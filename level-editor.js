(() => {
  const canvas = document.getElementById('editorCanvas');
  const ctx = canvas.getContext('2d');
  const WORLD_WIDTH = 2400;
  const VIEW_WIDTH = 960;
  const VIEW_HEIGHT = 540;
  const STORAGE_KEY = 'thirdspace-custom-levels';
  const $ = id => document.getElementById(id);
  const levelName = $('levelName');
  const savedLevels = $('savedLevels');
  const viewPosition = $('viewPosition');
  const viewPositionLabel = $('viewPositionLabel');
  const status = $('editorStatus');
  let current = createLevel();
  let currentId = null;
  let tool = 'platform';
  let history = [];
  let dpr = 1;

  function createLevel() {
    return {
      name: 'My level',
      hint: 'CUSTOM LEVEL',
      sky: '#4b5961',
      accent: '#ff7654',
      start: { x: 80, y: 390 },
      goal: { x: 2300, y: 180 },
      platforms: [{ x: 0, y: 470, width: 300, height: 70 }],
      spikes: [],
      lasers: [],
      portals: [],
      pumpkins: []
    };
  }

  function readLevels() {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) throw new Error('Saved level data is not a list.');
    return parsed.filter(level => level && typeof level.id === 'string' && typeof level.name === 'string');
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  }

  function refreshSavedLevels(selectedId = '') {
    try {
      const levels = readLevels();
      savedLevels.replaceChildren(new Option('New level', ''));
      levels.forEach(level => savedLevels.add(new Option(level.name, level.id)));
      savedLevels.value = selectedId;
    } catch (error) {
      savedLevels.replaceChildren(new Option('Saved levels unavailable', ''));
      setStatus(`Could not read saved levels: ${error.message}`, true);
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * dpr));
    canvas.height = Math.max(1, Math.round(bounds.height * dpr));
    draw();
  }

  function viewTransform() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const scale = Math.min(width / VIEW_WIDTH, height / VIEW_HEIGHT);
    return {
      scale,
      ox: (width - VIEW_WIDTH * scale) / 2,
      oy: (height - VIEW_HEIGHT * scale) / 2
    };
  }

  function drawPlayer(x, y, radius, accent) {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(x - radius, y - radius);
    ctx.lineTo(x - radius / 3, y - radius);
    ctx.lineTo(x - radius / 1.2, y);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + radius, y - radius);
    ctx.lineTo(x + radius / 3, y - radius);
    ctx.lineTo(x + radius / 1.2, y);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8f5ed';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5e0d0d';
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.55, y - radius * 0.1, 2, 4, Math.PI / 30, 0, Math.PI * 2);
    ctx.ellipse(x + radius * 0.55, y - radius * 0.1, 2, 4, Math.PI / 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + 4, radius * 0.5, 0, Math.PI, false);
    ctx.fill();
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const { scale, ox, oy } = viewTransform();
    const cameraX = Number(viewPosition.value);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#171717';
    ctx.fillRect(0, 0, width, height);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
    ctx.fillStyle = current.sky;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    ctx.save();
    ctx.translate(-cameraX, 0);

    ctx.strokeStyle = 'rgba(255,255,255,.09)';
    ctx.lineWidth = 1;
    for (let x = Math.floor(cameraX / 40) * 40; x <= cameraX + VIEW_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, VIEW_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= VIEW_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(cameraX, y);
      ctx.lineTo(cameraX + VIEW_WIDTH, y);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.font = '12px sans-serif';
    ctx.fillText('TAP TO PLACE · SNAP 20', cameraX + 18, 24);

    for (const platform of current.platforms) {
      ctx.fillStyle = platform.crumble ? '#e7bd6a' : '#eee9dc';
      ctx.beginPath();
      ctx.roundRect(platform.x, platform.y, platform.width, platform.height, Math.min(9, platform.height / 2));
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.18)';
      ctx.fillRect(platform.x, platform.y + platform.height - 4, platform.width, 4);
      if (platform.crumble) {
        ctx.strokeStyle = 'rgba(64,42,20,.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(platform.x + platform.width * .4, platform.y + 2);
        ctx.lineTo(platform.x + platform.width * .48, platform.y + platform.height - 3);
        ctx.lineTo(platform.x + platform.width * .56, platform.y + platform.height * .45);
        ctx.stroke();
      }
    }
    for (const spike of current.spikes) {
      ctx.fillStyle = '#eee9dc';
      ctx.beginPath();
      ctx.moveTo(spike.x, spike.y);
      ctx.lineTo(spike.x + spike.width / 2, spike.y - spike.height);
      ctx.lineTo(spike.x + spike.width, spike.y);
      ctx.closePath();
      ctx.fill();
    }
    for (const laser of current.lasers) {
      ctx.globalAlpha = .24;
      ctx.fillStyle = '#ff3158';
      ctx.fillRect(laser.x - 5, laser.y - 5, laser.width + 10, laser.height + 10);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ff3158';
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      ctx.fillStyle = '#fff3f5';
      ctx.fillRect(laser.x, laser.y + laser.height * .3, laser.width, Math.max(2, laser.height * .4));
    }

    ctx.save();
    ctx.globalAlpha = .14;
    ctx.fillStyle = current.accent;
    ctx.beginPath();
    ctx.arc(current.goal.x, current.goal.y, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = current.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(current.goal.x, current.goal.y, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(current.goal.x, current.goal.y, 5, 0, Math.PI * 2);
    ctx.fill();
    drawPlayer(current.start.x, current.start.y, 18, current.accent);
    ctx.restore();
  }

  function snap(value) {
    return Math.max(0, Math.min(WORLD_WIDTH - 20, Math.round(value / 20) * 20));
  }

  function saveHistory() {
    history.push(JSON.stringify(current));
    if (history.length > 40) history.shift();
  }

  function place(event) {
    if (event.button !== undefined && event.button !== 0) return;
    const bounds = canvas.getBoundingClientRect();
    const { scale, ox, oy } = viewTransform();
    const cameraX = Number(viewPosition.value);
    const x = snap((event.clientX - bounds.left - ox) / scale + cameraX);
    const y = snap(Math.max(0, Math.min(VIEW_HEIGHT, (event.clientY - bounds.top - oy) / scale)));
    if ((event.clientY - bounds.top - oy) / scale < 0 || (event.clientY - bounds.top - oy) / scale > VIEW_HEIGHT) return;
    saveHistory();
    if (tool === 'platform' || tool === 'crumble') {
      current.platforms.push({ x: snap(x - 70), y: snap(y - 12), width: 150, height: 24, ...(tool === 'crumble' ? { crumble: true } : {}) });
    } else if (tool === 'spikes') {
      current.spikes.push({ x: snap(x - 20), y, width: 40, height: 22, text: false });
    } else if (tool === 'laser') {
      current.lasers.push({ x: snap(x - 60), y: snap(y - 4), width: 120, height: 8, text: false });
    } else if (tool === 'start') {
      current.start = { x, y };
    } else if (tool === 'goal') {
      current.goal = { x, y };
    } else if (tool === 'erase') {
      eraseNearest(x, y);
    }
    draw();
  }

  function eraseNearest(x, y) {
    const candidates = [
      ...current.platforms.map((item, index) => ({ type: 'platforms', index, x: item.x + item.width / 2, y: item.y + item.height / 2 })),
      ...current.spikes.map((item, index) => ({ type: 'spikes', index, x: item.x + item.width / 2, y: item.y - item.height / 2 })),
      ...current.lasers.map((item, index) => ({ type: 'lasers', index, x: item.x + item.width / 2, y: item.y + item.height / 2 }))
    ];
    candidates.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    const nearest = candidates[0];
    if (!nearest || Math.hypot(nearest.x - x, nearest.y - y) > 100) {
      history.pop();
      setStatus('Tap closer to a piece to erase it.');
      return;
    }
    current[nearest.type].splice(nearest.index, 1);
  }

  function updateEditor() {
    levelName.value = current.name;
    draw();
  }

  function loadSelectedLevel() {
    try {
      const level = readLevels().find(item => item.id === savedLevels.value);
      if (!level) {
        setStatus('Choose a saved level to load.', true);
        return;
      }
      saveHistory();
      currentId = level.id;
      current = {
        ...level,
        start: { ...level.start },
        goal: { ...level.goal },
        platforms: level.platforms || [],
        spikes: level.spikes || [],
        lasers: level.lasers || [],
        portals: level.portals || [],
        pumpkins: level.pumpkins || []
      };
      history = [];
      updateEditor();
      setStatus(`Loaded "${current.name}".`);
    } catch (error) {
      setStatus(`Could not load this level: ${error.message}`, true);
    }
  }

  function saveLevel() {
    const name = levelName.value.trim();
    if (!name) {
      setStatus('Give your level a name before saving.', true);
      levelName.focus();
      return null;
    }
    if (!current.platforms.length) {
      setStatus('Add at least one platform before saving.', true);
      return null;
    }
    if (current.goal.x === current.start.x && current.goal.y === current.start.y) {
      setStatus('Move the goal away from the starting point.', true);
      return null;
    }
    try {
      const levels = readLevels();
      const id = currentId || `level-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const saved = {
        ...current,
        id,
        name,
        hint: 'CUSTOM LEVEL',
        platforms: current.platforms.map(({ crumble, ...platform }) => ({ ...platform, ...(crumble ? { crumble: true } : {}) }))
      };
      const existing = levels.findIndex(level => level.id === id);
      if (existing < 0) levels.push(saved);
      else levels[existing] = saved;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
      current = { ...saved, start: { ...saved.start }, goal: { ...saved.goal } };
      currentId = id;
      refreshSavedLevels(id);
      setStatus(`"${name}" saved on this device.`);
      return saved;
    } catch (error) {
      setStatus(`Could not save this level: ${error.message}`, true);
      return null;
    }
  }

  function playSelectedLevel() {
    if (!savedLevels.value) {
      setStatus('Choose a saved level to play, or use Save & play for your current level.', true);
      return;
    }
    try {
      const level = readLevels().find(item => item.id === savedLevels.value);
      if (!level || !level.start || !level.goal || !Array.isArray(level.platforms) || !level.platforms.length) {
        setStatus('This saved level is incomplete. Load it, make a platform, and save it again.', true);
        return;
      }
      location.href = `meow.html?custom=${encodeURIComponent(level.id)}`;
    } catch (error) {
      setStatus(`Could not open this saved level: ${error.message}`, true);
    }
  }

  canvas.addEventListener('pointerdown', event => {
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    place(event);
  });
  viewPosition.addEventListener('input', () => {
    viewPositionLabel.value = `${Math.round(Number(viewPosition.value) / 10)} m`;
    draw();
  });
  document.querySelectorAll('[data-tool]').forEach(button => {
    button.addEventListener('click', () => {
      tool = button.dataset.tool;
      document.querySelectorAll('[data-tool]').forEach(item => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      setStatus(`${button.textContent} tool selected.`);
    });
  });
  levelName.addEventListener('input', () => { current.name = levelName.value; });
  savedLevels.addEventListener('change', () => {
    if (savedLevels.value) setStatus(`Selected "${savedLevels.selectedOptions[0].textContent}". Load to edit, or play it directly.`);
  });
  $('loadLevel').addEventListener('click', loadSelectedLevel);
  $('saveLevel').addEventListener('click', saveLevel);
  $('playLevel').addEventListener('click', () => {
    const saved = saveLevel();
    if (saved) location.href = `meow.html?custom=${encodeURIComponent(saved.id)}`;
  });
  $('playSavedLevel').addEventListener('click', playSelectedLevel);
  $('newLevel').addEventListener('click', () => {
    saveHistory();
    current = createLevel();
    currentId = null;
    history = [];
    savedLevels.value = '';
    levelName.value = current.name;
    viewPosition.value = '0';
    viewPositionLabel.value = '0 m';
    draw();
    setStatus('Started a new level.');
  });
  $('undoEdit').addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) {
      setStatus('Nothing to undo.');
      return;
    }
    current = JSON.parse(previous);
    updateEditor();
    setStatus('Last edit undone.');
  });
  $('clearLevel').addEventListener('click', () => {
    if (!window.confirm('Remove all platforms and hazards from this level?')) return;
    saveHistory();
    current.platforms = [];
    current.spikes = [];
    current.lasers = [];
    draw();
    setStatus('Level pieces cleared. Your start and goal are still in place.');
  });
  $('deleteLevel').addEventListener('click', () => {
    if (!savedLevels.value) {
      setStatus('Choose a saved level to delete.', true);
      return;
    }
    const selectedId = savedLevels.value;
    const selected = savedLevels.selectedOptions[0].textContent;
    if (!window.confirm(`Delete "${selected}" from this browser?`)) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readLevels().filter(level => level.id !== selectedId)));
      if (currentId === selectedId) {
        currentId = null;
        current = createLevel();
        levelName.value = current.name;
      }
      refreshSavedLevels();
      draw();
      setStatus(`Deleted "${selected}".`);
    } catch (error) {
      setStatus(`Could not delete this level: ${error.message}`, true);
    }
  });

  window.addEventListener('resize', resize);
  refreshSavedLevels();
  resize();
})();
