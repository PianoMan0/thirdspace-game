(function () {
  const STORAGE_KEY = 'thirdspace-settings';
  const defaults = {
    musicEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.6,
    reducedMotion: false,
    showGuide: true,
    highContrast: false,
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function normalizeSettings(raw = {}) {
    const next = { ...defaults, ...raw };
    const musicVolume = Number(next.musicVolume);
    const sfxVolume = Number(next.sfxVolume);
    next.musicVolume = clamp(Number.isFinite(musicVolume) ? musicVolume : defaults.musicVolume, 0, 1);
    next.sfxVolume = clamp(Number.isFinite(sfxVolume) ? sfxVolume : defaults.sfxVolume, 0, 1);
    next.musicEnabled = Boolean(next.musicEnabled);
    next.reducedMotion = Boolean(next.reducedMotion);
    next.showGuide = Boolean(next.showGuide);
    next.highContrast = Boolean(next.highContrast);
    return next;
  }

  function getSettings() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return normalizeSettings(raw);
    } catch {
      return { ...defaults };
    }
  }

  function saveSettings(nextSettings) {
    const settings = normalizeSettings(nextSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return settings;
  }

  function applySettingsToPage() {
    const settings = getSettings();
    document.body.dataset.motion = settings.reducedMotion ? 'reduced' : 'normal';
    document.body.dataset.contrast = settings.highContrast ? 'high' : 'normal';
    document.documentElement.style.setProperty('--music-volume', settings.musicVolume.toFixed(2));
    document.documentElement.style.setProperty('--sfx-volume', settings.sfxVolume.toFixed(2));
  }

  function bindSettingsForm() {
    const form = document.getElementById('settingsForm');
    if (!form) return;

    const controls = {
      musicEnabled: document.getElementById('musicEnabled'),
      musicVolume: document.getElementById('musicVolume'),
      sfxVolume: document.getElementById('sfxVolume'),
      reducedMotion: document.getElementById('reducedMotion'),
      showGuide: document.getElementById('showGuide'),
      highContrast: document.getElementById('highContrast'),
      musicVolumeValue: document.getElementById('musicVolumeValue'),
      sfxVolumeValue: document.getElementById('sfxVolumeValue'),
      resetButton: document.getElementById('resetSettings'),
    };

    const settings = getSettings();
    if (controls.musicEnabled) controls.musicEnabled.checked = settings.musicEnabled;
    if (controls.musicVolume) controls.musicVolume.value = String(settings.musicVolume);
    if (controls.sfxVolume) controls.sfxVolume.value = String(settings.sfxVolume);
    if (controls.reducedMotion) controls.reducedMotion.checked = settings.reducedMotion;
    if (controls.showGuide) controls.showGuide.checked = settings.showGuide;
    if (controls.highContrast) controls.highContrast.checked = settings.highContrast;

    const updateLabels = () => {
      if (controls.musicVolumeValue && controls.musicVolume) {
        controls.musicVolumeValue.textContent = `${Math.round(Number(controls.musicVolume.value) * 100)}%`;
      }
      if (controls.sfxVolumeValue && controls.sfxVolume) {
        controls.sfxVolumeValue.textContent = `${Math.round(Number(controls.sfxVolume.value) * 100)}%`;
      }
    };

    const persist = () => {
      const latest = {
        musicEnabled: controls.musicEnabled ? controls.musicEnabled.checked : defaults.musicEnabled,
        musicVolume: Number(controls.musicVolume ? controls.musicVolume.value : defaults.musicVolume),
        sfxVolume: Number(controls.sfxVolume ? controls.sfxVolume.value : defaults.sfxVolume),
        reducedMotion: controls.reducedMotion ? controls.reducedMotion.checked : defaults.reducedMotion,
        showGuide: controls.showGuide ? controls.showGuide.checked : defaults.showGuide,
        highContrast: controls.highContrast ? controls.highContrast.checked : defaults.highContrast,
      };
      saveSettings(latest);
      applySettingsToPage();
      updateLabels();
    };

    if (controls.musicVolume) controls.musicVolume.addEventListener('input', persist);
    if (controls.sfxVolume) controls.sfxVolume.addEventListener('input', persist);
    if (controls.musicEnabled) controls.musicEnabled.addEventListener('change', persist);
    if (controls.reducedMotion) controls.reducedMotion.addEventListener('change', persist);
    if (controls.showGuide) controls.showGuide.addEventListener('change', persist);
    if (controls.highContrast) controls.highContrast.addEventListener('change', persist);

    if (controls.resetButton) {
      controls.resetButton.addEventListener('click', () => {
        saveSettings(defaults);
        applySettingsToPage();
        if (controls.musicEnabled) controls.musicEnabled.checked = defaults.musicEnabled;
        if (controls.musicVolume) controls.musicVolume.value = String(defaults.musicVolume);
        if (controls.sfxVolume) controls.sfxVolume.value = String(defaults.sfxVolume);
        if (controls.reducedMotion) controls.reducedMotion.checked = defaults.reducedMotion;
        if (controls.showGuide) controls.showGuide.checked = defaults.showGuide;
        if (controls.highContrast) controls.highContrast.checked = defaults.highContrast;
        updateLabels();
      });
    }

    updateLabels();
  }

  window.ThirdSpaceSettings = {
    defaults,
    getSettings,
    saveSettings,
    applySettingsToPage,
    normalizeSettings,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applySettingsToPage();
      bindSettingsForm();
    }, { once: true });
  } else {
    applySettingsToPage();
    bindSettingsForm();
  }
})();
