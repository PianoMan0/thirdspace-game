(() => {
  const SONGS = [
    'audio/Blast off song %231.m4a',
    'audio/Blast off song %232.m4a',
    'audio/Blast off song %233.m4a',
    'audio/Blast off song %234.m4a',
    'audio/ANOMALY.mp3',
    'audio/World 1 Theme.m4a'
  ];

  const button = document.getElementById('musicButton');
  if (!button || SONGS.length === 0) return;

  const audio = new Audio();
  audio.preload = 'auto';
  audio.loop = true;
  let songIndex = -1;
  let isLoading = false;

  function loadSettings() {
    try {
      const raw = JSON.parse(localStorage.getItem('thirdspace-settings') || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch {
      return {};
    }
  }

  function applyMusicPreferences() {
    const settings = loadSettings();
    const musicEnabled = settings.musicEnabled !== false;
    const volume = Number(settings.musicVolume ?? 0.7);
    audio.volume = musicEnabled ? Math.min(Math.max(volume, 0), 1) : 0;
    if (!musicEnabled && !audio.paused) {
      audio.pause();
    }
  }

  function updateButton() {
    const settings = loadSettings();
    const isPlaying = !audio.paused && settings.musicEnabled !== false;
    button.classList.toggle('is-playing', isPlaying);
    button.setAttribute('aria-label', isPlaying ? 'Play next song' : 'Play music');
    button.title = isPlaying ? 'Play next song' : 'Play music';
  }

  function waitForPlayableSource() {
    return new Promise((resolve, reject) => {
      if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        resolve();
        return;
      }

      const finish = (error) => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        error ? reject(error) : resolve();
      };
      const onCanPlay = () => finish();
      const onError = () => finish(audio.error || new Error('Audio could not be loaded'));
      audio.addEventListener('canplay', onCanPlay, { once: true });
      audio.addEventListener('error', onError, { once: true });
      audio.load();
    });
  }

  async function playSong(index) {
    if (isLoading) return;
    isLoading = true;

    for (let attempt = 0; attempt < SONGS.length; attempt++) {
      const candidateIndex = (index + attempt + SONGS.length) % SONGS.length;
      audio.src = SONGS[candidateIndex];
      audio.currentTime = 0;

      try {
        await waitForPlayableSource();
        await audio.play();
        songIndex = candidateIndex;
        updateButton();
        isLoading = false;
        return;
      } catch {
      }
    }

    isLoading = false;
    audio.removeAttribute('src');
    audio.load();
    updateButton();
    button.setAttribute('aria-label', 'No playable music found');
    button.title = 'No playable music found';
  }

  button.addEventListener('click', () => {
    const settings = loadSettings();
    if (settings.musicEnabled === false) {
      const next = { ...settings, musicEnabled: true };
      localStorage.setItem('thirdspace-settings', JSON.stringify(next));
      applyMusicPreferences();
    }
    playSong(songIndex + 1);
  });

  audio.addEventListener('pause', updateButton);
  audio.addEventListener('play', updateButton);
  applyMusicPreferences();
  updateButton();
  window.addEventListener('storage', () => {
    applyMusicPreferences();
    updateButton();
  });
})();
