(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = 960, H = 540, TAU = Math.PI * 2;
  const worlds = [
    { name: 'LOW ORBIT', hint: 'VECTOR TRAINING', sky: '#101b24', accent: '#ff7654', start: [80, 390], goal: [1950, 300], platforms: [[0,470,420,70],[530,410,180,24],[790,335,170,24],[1040,430,220,24],[1350,350,170,24],[1590,440,180,24],[1840,370,260,170]] },
    { name: 'THE GAPS', hint: 'MOMENTUM TEST', sky: '#1b1820', accent: '#ffd166', start: [80, 360], goal: [2110, 240], platforms: [[0,470,300,70],[400,380,120,24],[650,290,150,24],[930,420,120,24],[1190,320,145,24],[1480,230,130,24],[1740,390,130,24],[1980,310,260,230]] },
    { name: 'LAST LIGHT', hint: 'FINAL VECTOR', sky: '#101f1d', accent: '#7ed6a5', start: [80,390], goal: [2390,160], platforms: [[0,470,360,70],[490,360,120,24],[700,440,140,24],[950,280,120,24],[1190,380,120,24],[1410,210,140,24],[1650,340,150,24],[1900,250,130,24],[2160,390,130,24],[2350,260,220,280]] }
  ];
  let dpr = 1, viewW = 1, viewH = 1, worldIndex = 0, deaths = 0, state = 'playing';
  let cameraX = 0, cameraY = 0, last = 0, drag = null, particles = [], pulse = 0;
  const player = { x: 0, y: 0, r: 18, vx: 0, vy: 0, trail: [], distance: 0, best: 0 };
  const $ = id => document.getElementById(id);
  const world = () => worlds[worldIndex];
  const endX = () => { const lastPlatform = world().platforms[world().platforms.length - 1]; return lastPlatform[0] + lastPlatform[2]; };

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    viewW = innerWidth; viewH = innerHeight;
    canvas.width = viewW * dpr; canvas.height = viewH * dpr;
  }
  function updateUi() {
    $('deaths').textContent = deaths;
    $('worldName').textContent = world().name;
    $('worldHint').textContent = world().hint;
    $('worldNumber').textContent = `${worldIndex + 1} / ${worlds.length}`;
    $('distance').textContent = Math.max(0, Math.round(player.distance / 10));
    $('progressBar').style.width = `${Math.min(100, Math.max(0, player.distance / endX() * 100))}%`;
  }
  function resetPlayer() {
    const [x, y] = world().start;
    Object.assign(player, { x, y, vx: 0, vy: 0, trail: [], distance: 0 });
    drag = null; cameraX = 0; cameraY = 0; state = 'playing'; $('pause').textContent = 'Pause';
    hideOverlay(); updateUi();
  }
  function loadWorld(index) { worldIndex = index; resetPlayer(); }
  function hideOverlay() { $('overlay').classList.add('hidden'); $('next').classList.add('hidden'); }
  function showOverlay(title, text, button, stats = '', next = false) {
    $('overlayTitle').textContent = title; $('overlayText').textContent = text;
    $('overlayStats').textContent = stats; $('overlayButton').textContent = button;
    $('overlay').classList.remove('hidden'); $('next').classList.toggle('hidden', !next);
  }
  function burst(x, y, color, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU, speed = 30 + Math.random() * 150;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .35 + Math.random() * .55, size: 1 + Math.random() * 3, color });
    }
  }
  function pointerWorld(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width * W + cameraX, y: (e.clientY - rect.top) / rect.height * H + cameraY };
  }
  function launch(dx, dy) {
    const length = Math.hypot(dx, dy);
    if (length < 18 || state !== 'playing') return;
    const power = Math.min(length, 130) / 130, speed = 260 + power * 480;
    player.vx = Math.max(-700, Math.min(700, player.vx + dx / length * speed));
    player.vy = Math.max(-700, Math.min(700, player.vy + dy / length * speed));
    burst(player.x, player.y, world().accent, 18); pulse = 1;
  }
  function startDrag(e) {
    if (state !== 'playing') return;
    e.preventDefault(); drag = { id: e.pointerId, point: pointerWorld(e) }; canvas.setPointerCapture?.(e.pointerId);
  }
  function moveDrag(e) { if (!drag || drag.id !== e.pointerId) return; e.preventDefault(); drag.point = pointerWorld(e); }
  function releaseDrag(e) {
    if (!drag || drag.id !== e.pointerId) return;
    e.preventDefault(); launch(player.x - drag.point.x, player.y - drag.point.y); drag = null;
  }
  canvas.addEventListener('pointerdown', startDrag); canvas.addEventListener('pointermove', moveDrag);
  canvas.addEventListener('pointerup', releaseDrag); canvas.addEventListener('pointercancel', releaseDrag);

  function fail() {
    if (state !== 'playing') return;
    state = 'dead'; deaths++; burst(player.x, player.y, '#fff', 28); updateUi();
    showOverlay('LOST IN SPACE', 'The void is patient. Your vector is not.', 'Try again', `BEST DISTANCE  ${Math.round(player.best / 10)}m`);
  }
  function win() {
    state = 'won'; burst(world().goal[0], world().goal[1], world().accent, 44);
    const final = worldIndex === worlds.length - 1;
    showOverlay(final ? 'ALL WORLDS CLEAR' : 'WORLD CLEAR', final ? 'Three worlds. One excellent vector.' : `${world().name} complete.`, final ? 'Play again' : `World ${worldIndex + 2}`, `DISTANCE  ${Math.round(player.distance / 10)}m`, !final);
  }
  function togglePause() {
    if (state === 'playing') { state = 'paused'; $('pause').textContent = 'Resume'; showOverlay('PAUSED', 'Your trajectory is waiting.', 'Resume'); }
    else if (state === 'paused') { state = 'playing'; $('pause').textContent = 'Pause'; hideOverlay(); }
  }
  $('pause').onclick = togglePause;
  $('restart').onclick = () => { if (state === 'dead') deaths++; resetPlayer(); };
  $('next').onclick = () => loadWorld((worldIndex + 1) % worlds.length);
  $('overlayButton').onclick = () => {
    if (state === 'won' && worldIndex < worlds.length - 1) loadWorld(worldIndex + 1);
    else if (state === 'paused') togglePause();
    else { if (state === 'dead') deaths++; loadWorld(state === 'won' ? 0 : worldIndex); }
  };
  addEventListener('resize', resize);
  addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'r') { if (state === 'dead') deaths++; resetPlayer(); }
    if (key === 'p' || key === 'escape') togglePause();
    if (state === 'playing' && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault(); const vectors = { arrowup: [0, -1], arrowdown: [0, 1], arrowleft: [-1, 0], arrowright: [1, 0], ' ': [0, -1] };
      const [x, y] = vectors[key]; launch(x * 95, y * 95);
    }
  });

  function update(dt) {
    if (state === 'playing') {
      const oldY = player.y;
      player.vy += 1050 * dt; player.vx *= Math.pow(.994, dt * 60); player.x += player.vx * dt; player.y += player.vy * dt;
      for (const p of world().platforms) {
        if (player.x + player.r > p[0] && player.x - player.r < p[0] + p[2] && player.y + player.r > p[1] && player.y - player.r < p[1] + p[3] && oldY + player.r <= p[1] + 6 && player.vy >= 0) {
          player.y = p[1] - player.r; player.vy = 0;
        }
      }
      player.distance = Math.max(player.distance, player.x - world().start[0]); player.best = Math.max(player.best, player.distance); updateUi();
      const goal = world().goal;
      if (Math.hypot(player.x - goal[0], player.y - goal[1]) < 46) win();
      if (player.y > H + 180 || player.y < -280 || player.x < -120) fail();
      cameraX += (Math.max(0, Math.min(endX() - W, player.x - W * .32)) - cameraX) * Math.min(1, dt * 5);
      cameraY += (Math.max(-160, Math.min(160, player.y - H * .58)) - cameraY) * Math.min(1, dt * 5);
      player.trail.push({ x: player.x, y: player.y }); if (player.trail.length > 18) player.trail.shift();
    }
    pulse = Math.max(0, pulse - dt * 2);
    particles = particles.filter(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 220 * dt; p.life -= dt; return p.life > 0; });
  }

  function draw() {
    const scale = Math.min(viewW / W, viewH / H), ox = (viewW - W * scale) / 2, oy = (viewH - H * scale) / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const background = ctx.createLinearGradient(0, 0, viewW, viewH); background.addColorStop(0, world().sky); background.addColorStop(1, '#080d12');
    ctx.fillStyle = background; ctx.fillRect(0, 0, viewW, viewH);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy); ctx.fillStyle = world().sky; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(-cameraX, -cameraY);
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    for (let i = 0; i < 90; i++) { const x = (i * 173) % (endX() + W), y = (i * 97) % H; ctx.globalAlpha = .15 + (i % 4) * .04; ctx.fillRect(x, y, 1 + i % 2, 1 + i % 2); }
    ctx.globalAlpha = 1;
    for (const p of world().platforms) { ctx.fillStyle = '#eee9dc'; ctx.beginPath(); ctx.roundRect(p[0], p[1], p[2], p[3], Math.min(9, p[3] / 2)); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(p[0], p[1] + p[3] - 4, p[2], 4); }
    const g = world().goal, glow = 28 + Math.sin(performance.now() / 260) * 4;
    ctx.globalAlpha = .14; ctx.fillStyle = world().accent; ctx.beginPath(); ctx.arc(g[0], g[1], glow + 16, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = world().accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(g[0], g[1], glow, 0, TAU); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(g[0], g[1], 5, 0, TAU); ctx.fill();
    for (const p of particles) { ctx.globalAlpha = Math.max(0, p.life * 1.5); ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); }
    ctx.globalAlpha = 1; player.trail.forEach((t, i) => { ctx.globalAlpha = i / player.trail.length * .3; ctx.fillStyle = world().accent; ctx.beginPath(); ctx.arc(t.x, t.y, player.r * (i / player.trail.length), 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1;
    if (drag) { const dx = drag.point.x - player.x, dy = drag.point.y - player.y, length = Math.hypot(dx, dy), pull = Math.min(length, 130); ctx.globalAlpha = .8; ctx.strokeStyle = world().accent; ctx.lineWidth = 3; ctx.setLineDash([5, 7]); ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(player.x + dx / (length || 1) * pull, player.y + dy / (length || 1) * pull); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = .18; ctx.fillStyle = world().accent; ctx.beginPath(); ctx.arc(player.x, player.y, 24 + pull / 4, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.fillStyle = world().accent; ctx.beginPath(); ctx.arc(player.x, player.y, player.r + pulse * 8, 0, TAU); ctx.fill(); ctx.fillStyle = '#f8f5ed'; ctx.beginPath(); ctx.arc(player.x, player.y, 7, 0, TAU); ctx.fill(); ctx.restore();
  }
  function loop(now) { const dt = Math.min(.033, (now - last) / 1000 || .016); last = now; update(dt); draw(); requestAnimationFrame(loop); }
  resize(); loadWorld(0); requestAnimationFrame(loop);
})();
