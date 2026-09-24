(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d'); //context
  const W = 960, H = 540, CEILING_Y = -80, TAU = Math.PI * 2;
  const worlds = new URLSearchParams(location.search).has('daily') ? [createDailyLevel()] : LEVELS;
  let dpr = 1, viewW = 1, viewH = 1, worldIndex = 0, deaths = 0, state = 'playing';
  let cameraX = 0, cameraY = 0, last = 0, drag = null, particles = [], portalParticles = [], pulse = 0, uiTimer = 0;
  const player = { x: 0, y: 0, r: 18, vx: 0, vy: 0, trail: [], distance: 0, best: 0 };
  const $ = id => document.getElementById(id);
  const settings = () => {
    try {
      return JSON.parse(localStorage.getItem('thirdspace-settings') || '{}');
    } catch {
      return {};
    }
  };
  const world = () => worlds[worldIndex];
  const endX = () => { const lastPlatform = world().platforms[world().platforms.length - 1]; return lastPlatform.x + lastPlatform.width; };
  let timer = 0; // you can use this as a timer :P
  let portal_alpha = 0 
  let reduce = false;
  let portalup = false; 
  let portalstate = false; 
  let portalexit = [0,0]; 
  let secretmode = false;
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
    const { x, y } = world().start;
    //pumpkin
    secretmode = false; 
    particles = [];
    portalParticles = [];
    for (const portal of world().portals) {
      for (let i = 0; i < 8; i++) {
        portalParticles.push({
          portal,
          angle: (i / 8) * TAU,
          radius: portal.radius + (i % 3 - 1) * 3,
          speed: 0.45 + (i % 4) * 0.12,
          size: 2 + i % 3,
          alpha: 0.35 + (i % 4) * 0.12
        });
      }
    }
    for (const pump of world().pumpkins){
      pump.secret = false;
      insidepumpkin = false;
    }
    Object.assign(player, { x, y, vx: 0, vy: 0, trail: [], distance: 0 });
    world().platforms.forEach(platform => { platform.crumbleTime = null; });
    drag = null; cameraX = 0; cameraY = 0; state = 'playing'; $('pause').textContent = 'Pause (P)';
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
    const available = Math.max(0, 180 - particles.length);
    for (let i = 0; i < Math.min(count, available); i++) {
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
    e.preventDefault(); 
    if(world().name == "Backwards"){
      launch(drag.point.x - player.x, drag.point.y - player.y); 
    }else{
      launch(player.x - drag.point.x, player.y - drag.point.y); 
    }
    drag = null;
  }
  canvas.addEventListener('pointerdown', startDrag); canvas.addEventListener('pointermove', moveDrag);
  canvas.addEventListener('pointerup', releaseDrag); canvas.addEventListener('pointercancel', releaseDrag);

  function fail(reason = 'boundary') {
    if (state !== 'playing') return;
    state = 'dead'; deaths++; burst(player.x, player.y, '#fff', 28); updateUi();
    const messages = {
      boundary: ['LOST IN THE FIELDS', 'Thou drifted beyond the cruel bounderies of this world.'],
      spikes: ['PIERCED BY SPIKES', 'Thou hast perished, but thou can rebirth :3.'],
      laser: ['STRUCK BY A LASER', 'Not the dreaded laser of beam!'],
    };
    const [title, text] = messages[reason] || messages.boundary;
    showOverlay(title, text, 'Try again (R)', `BEST DISTANCE  ${Math.round(player.best / 10)}m`);
  } 
  function win() {
    state = 'won'; burst(world().goal.x, world().goal.y, world().accent, 44);
    const final = worldIndex === worlds.length - 1;
    showOverlay(final ? 'ALL WORLDS CLEAR' : 'LEVEL CLEAR', final ? 'You have conquered the game!' : `${world().name} complete.`, final ? 'Play again' : `World ${worldIndex + 2} (R)`, `DISTANCE  ${Math.round(player.distance / 10)}`, !final);
  }
  function togglePause() {
    if (state === 'playing') { state = 'paused'; $('pause').textContent = 'Resume'; showOverlay('PAUSED', 'Your destiny is waiting.', 'Resume'); }
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
    if (key === 'r') { 
      if(state == 'won'){
        loadWorld((worldIndex + 1) % worlds.length);
        return; 
      }
      if (state === 'dead') deaths++; 
      resetPlayer(); 
    }
    if (key === 'p' || key === 'escape') togglePause();
    if (state === 'playing' && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault(); 
      const vectors = world().name == "Backwards"?{ arrowup: [0, 1], arrowdown: [0, -1], arrowleft: [1, 0], arrowright: [-1, 0], ' ': [0, 1] } : { arrowup: [0, -1], arrowdown: [0, 1], arrowleft: [-1, 0], arrowright: [1, 0], ' ': [0, -1] };
      const [x, y] = vectors[key]; launch(x * 95, y * 95);
    }
  });

  function movePlayer(dt) {
    const distance = Math.max(Math.abs(player.vx * dt), Math.abs(player.vy * dt));
    const steps = Math.max(1, Math.ceil(distance / (player.r / 2)));
    const step = dt / steps;

    for (let i = 0; i < steps; i++) {
      player.x += player.vx * step;
      for (const platform of world().platforms) {
        if (platform.crumble && platform.crumbleTime === 0) continue;
        if (platform.secret && !secretmode) continue;
        if (player.x + player.r > platform.x && player.x - player.r < platform.x + platform.width && player.y + player.r > platform.y && player.y - player.r < platform.y + platform.height) {
          if (player.vx > 0) player.x = platform.x - player.r;
          else if (player.vx < 0) player.x = platform.x + platform.width + player.r;
          player.vx = 0;
        }
      }

      player.y += player.vy * step;
      for (const platform of world().platforms) {
        if (platform.crumble && platform.crumbleTime === 0) continue;
        if (player.x + player.r > platform.x && player.x - player.r < platform.x + platform.width && player.y + player.r > platform.y && player.y - player.r < platform.y + platform.height) {
          if (player.vy > 0) player.y = platform.y - player.r;
          else if (player.vy < 0) player.y = platform.y + platform.height + player.r;
          player.vy = 0;
          if (platform.crumble && platform.crumbleTime === null) platform.crumbleTime = .72;
        }
      }
    }
  }
  function update(dt) {
    //KEEP AT TOP
    if(timer > 0){
      timer -= dt;
      if(timer <= 0 ){
        timer = 0; 
        reduce = true; 
        player.x = portalexit[0];
        player.y = portalexit[1];
        player.vx = 0; 
        player.vy = 0; 
      }
    }
    if(reduce){
      if(portal_alpha > 0){
        portal_alpha = Math.max(0,portal_alpha-dt*3)
      }else{
        reduce = false;
        portalup = false; 
      }
    }
    //normal stuff
    if (state === 'playing' && !portalup) {
      world().platforms.forEach(platform => {
        if (platform.crumbleTime !== null) platform.crumbleTime = Math.max(0, platform.crumbleTime - dt);
      });
      player.vy += 1050 * dt; player.vx *= Math.pow(.994, dt * 60); movePlayer(dt);
      player.distance = Math.max(player.distance, player.x - world().start.x); player.best = Math.max(player.best, player.distance);
      uiTimer -= dt;
      if (uiTimer <= 0) { uiTimer = .1; updateUi(); }
      const goal = world().goal;
      if (Math.hypot(player.x - goal.x, player.y - goal.y) < 46) { win(); return; }
      for (const spike of world().spikes) {
        if (player.x + player.r > spike.x && player.x - player.r < spike.x + spike.width && player.y + player.r > spike.y - spike.height && player.y - player.r < spike.y) { fail('spikes'); return; }
      }
      for (const laser of world().lasers || []) {
        if (player.x + player.r > laser.x && player.x - player.r < laser.x + laser.width && player.y + player.r > laser.y && player.y - player.r < laser.y + laser.height) { fail('laser'); return; }
      }
      if (player.y > H + 180 || player.y < CEILING_Y || player.x < -120) fail('boundary');
      cameraX += (Math.max(0, Math.min(endX() - W, player.x - W * .32)) - cameraX) * Math.min(1, dt * 5);
      cameraY += (Math.max(-160, Math.min(160, player.y - H * .58)) - cameraY) * Math.min(1, dt * 5);
      player.trail.push({ x: player.x, y: player.y }); if (player.trail.length > 18) player.trail.shift();
    }
    let insideportal = false
    for (const particle of portalParticles) {
      particle.angle += particle.speed * dt;
    }
    for (const p of world().portals){
      const away = Math.hypot((player.x - p.entryx),(player.y - p.entryy)) //the distance formula too smh.
      if(away <= p.radius+1+player.r){
        insideportal = true; 
        if(!portalstate){
          portalstate = true 
          portalup = true;
          burst(player.x, player.y, "#a70ac7", 24);
          portal_alpha = 0.4; 
          timer = 0.8; 
          reduce = false;
          //
          portalexit = [p.exitx,p.exity]
        }
      }
    }
    //pumpkin detection
    for(const pk of world().pumpkins){
      //a pumpkin is 110 width and 80 height
      const pv = player.x - pk.x // from the center of the pumkin how far is the player? and it gives the mag and dir
      const dist = Math.hypot((player.x - pk.x),(player.y - pk.y)) //is that...the distance formula??
      const isInside = 
        Math.abs(pv)< (55 + player.r) && 
        Math.abs(player.y-pk.y) < (40 + player.r)
      if(isInside){
        if(!pk.secret){
          secretmode = !secretmode
          pk.secret = true; 
          //
          const dir = pv < 0? 1: -1; //js the direciton
          player.x = pk.x + dir*(55+player.r+2);
          player.vx = 0; 
        }
      }else{
        pk.secret = false;
      }
      
      
    }
    if(!insideportal){
      portalstate = false;
    }
    pulse = Math.max(0, pulse - dt * 2);
    particles = particles.filter(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 220 * dt; p.life -= dt; return p.life > 0; });
  }

  function draw() {
    const scale = Math.min(viewW / W, viewH / H), ox = (viewW - W * scale) / 2, oy = (viewH - H * scale) / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = world().sky; ctx.fillRect(0, 0, viewW, viewH);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy); ctx.fillStyle = world().sky; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(-cameraX, -cameraY);
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    for (let i = 0; i < 90; i++) { const x = (i * 173) % (endX() + W), y = (i * 97) % H; ctx.globalAlpha = .15 + (i % 4) * .04; ctx.fillRect(x, y, 1 + i % 2, 1 + i % 2); }
    ctx.globalAlpha = 1;
    //sorry lol this looks out of place im a crazy commenter if u want we can delete at the end tho
    //portal particles
    ctx.save();
    ctx.filter = 'none';
    for (const pt of portalParticles){
      const particleX = pt.portal.entryx + pt.radius * Math.cos(pt.angle);
      const particleY = pt.portal.entryy + pt.radius * Math.sin(pt.angle);
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = '#b948b0';
      ctx.beginPath();
      ctx.arc(particleX, particleY, pt.size, 0, TAU);
      ctx.fill();
    }
    //portals
      for (const p of world().portals){
        const portalPulse = Math.sin(performance.now() / 260) * 2;
        ctx.filter = 'none';
        ctx.strokeStyle = '#b948b0';
        ctx.fillStyle = 'rgba(95,25,90,.8)';
        ctx.lineWidth = 5;
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); //new drawing
        ctx.arc(p.entryx, p.entryy, p.radius + portalPulse,0, TAU);
        ctx.stroke();
        ctx.fill();
        if(p.text){
          ctx.filter = "none";
          ctx.font = "20px sans-serif"
          ctx.textAlign = "center"
          ctx.fillStyle = "#e8cc93"
          ctx.fillText("Portals bring you to", p.entryx, p.entryy-90)
          ctx.font = "bold 20px sans-serif"
          ctx.fillText("new places", p.entryx, p.entryy-70)
        }
      }
    ctx.restore();
    //pumpkins
    for (const pump of world().pumpkins){
      ctx.filter = 'none';
      ctx.fillStyle = "#73b591";
      ctx.beginPath(); 
      //stem
      ctx.moveTo(pump.x - 5, pump.y - 8); //translate
      ctx.quadraticCurveTo(pump.x - 20, pump.y-90, pump.x, pump.y-50);
      ctx.quadraticCurveTo(pump.x, pump.y-55, pump.x, pump.y-40);
      ctx.closePath(); 
      ctx.fill();
      //bleh
      ctx.fillStyle = '#d79616'
      ctx.strokeStyle = "#9f6e0b"
      ctx.lineWidth = 3; 
      //1
      ctx.beginPath();
      ctx.ellipse(pump.x-40,pump.y,15,35,Math.PI/30,0,TAU);
      ctx.fill();
      ctx.stroke();
      //2
      ctx.beginPath();
      ctx.ellipse(pump.x+40,pump.y,15,35,Math.PI/30,0,-TAU);
      ctx.fill();
      ctx.stroke();
      //main
      ctx.beginPath();
      ctx.ellipse(pump.x-20,pump.y,20,38,Math.PI/100,0,TAU);
      ctx.fill();
      ctx.stroke();
      //
      ctx.beginPath();
      ctx.ellipse(pump.x+20,pump.y,20,38,Math.PI/100,0,-TAU);
      ctx.fill();
      ctx.stroke();
      //
      ctx.fillStyle = "#f1bd55";
      ctx.beginPath(); 
      ctx.ellipse(pump.x, pump.y,20,40,0,0,TAU);
      ctx.fill(); 
      ctx.stroke();
      //text

      if(pump.text){
        ctx.font = "20px sans-serif"
        ctx.textAlign = "center"
        ctx.fillStyle = "#e8cc93"
        ctx.fillText("Pumpkins reveal", pump.x, pump.y-90)
        ctx.font = "bold 20px sans-serif"
        ctx.fillText("new paths", pump.x, pump.y-70)
      }
    }
    for (const p of world().platforms) {
      if (p.crumble && p.crumbleTime === 0) continue;
      if (p.secret && !secretmode) continue;
      const shaking = p.crumbleTime !== null ? Math.sin(performance.now() / 35) * (1 - p.crumbleTime / .72) * 2 : 0;
      ctx.save(); ctx.translate(shaking, 0); ctx.globalAlpha = p.crumbleTime === null ? 1 : .55 + p.crumbleTime / 2;
      const color = p.secret? "#57ff73" :"#eee9dc"
      ctx.fillStyle = color; 
      ctx.beginPath(); ctx.roundRect(p.x, p.y, p.width, p.height, Math.min(9, p.height / 2)); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(p.x, p.y + p.height - 4, p.width, 4); ctx.restore();
    }
    for (const spike of world().spikes) {
      ctx.fillStyle = '#eee9dc'; 
      ctx.beginPath(); 
      ctx.moveTo(spike.x, spike.y); 
      ctx.lineTo(spike.x + spike.width / 2, spike.y - spike.height);
      ctx.lineTo(spike.x + spike.width, spike.y);
      ctx.closePath(); 
      ctx.fill();
      if(spike.text){
          ctx.filter = "none";
          ctx.font = "20px sans-serif"
          ctx.textAlign = "center"
          ctx.fillStyle = "#e8cc93"
          ctx.fillText("Spikes", spike.x+10, spike.y-60)
          ctx.font = "bold 20px sans-serif"
          ctx.fillText("impale you", spike.x+15, spike.y-40)
      }
    }
    for (const laser of world().lasers || []) {
      const flicker = .75 + Math.sin(performance.now() / 90 + laser.x) * .15;
      ctx.save();
      ctx.globalAlpha = .22 * flicker;
      ctx.fillStyle = '#ff3158';
      ctx.fillRect(laser.x - 5, laser.y - 5, laser.width + 10, laser.height + 10);
      ctx.globalAlpha = flicker;
      ctx.fillStyle = '#ff3158';
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      ctx.fillStyle = '#fff3f5';
      ctx.fillRect(laser.x, laser.y + laser.height * .3, laser.width, Math.max(2, laser.height * .4));
      ctx.restore();
      if(laser.text){
          ctx.filter = "none";
          ctx.font = "20px sans-serif"
          ctx.textAlign = "center"
          ctx.fillStyle = "#e8cc93"
          ctx.fillText("Lazers", laser.x+100, laser.y-50)
          ctx.font = "bold 20px sans-serif"
          ctx.fillText("burn you", laser.x+95, laser.y-30)
      }
    }
    if(world().name == "The Basics"){
      ctx.fillStyle = "#e8cc93"
      ctx.fillText("Move by dragging", 100, 350)
      ctx.font = "bold 20px sans-serif"
      ctx.fillText("or with arrow keys", 100, 400)
    }
    if(world().name == "Backwards"){
      ctx.fillStyle = "#e8cc93"
      ctx.fillText("All controls are", 100, 350)
      ctx.font = "bold 20px sans-serif"
      ctx.fillText("Backwards now!", 100, 400)
    }
    const g = world().goal, glow = 28 + Math.sin(performance.now() / 260) * 4;
    //
    ctx.globalAlpha = .14; 
    ctx.fillStyle = world().accent; 
    ctx.beginPath(); 
    ctx.arc(g.x, g.y, glow + 16, 0, TAU); 
    ctx.fill(); 
    ctx.globalAlpha = 1;
    //
    ctx.strokeStyle = world().accent; 
    ctx.lineWidth = 3; 
    ctx.beginPath(); 
    ctx.arc(g.x, g.y, glow, 0, TAU); 
    ctx.stroke(); 
    ctx.fillStyle = '#ffffff'; 
    ctx.beginPath(); 
    ctx.arc(g.x, g.y, 5, 0, TAU); 
    ctx.fill();
    //
    for (const p of particles) { ctx.globalAlpha = Math.max(0, p.life * 1.5); ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); }
    ctx.globalAlpha = 1; player.trail.forEach((t, i) => { ctx.globalAlpha = i / player.trail.length * .3; ctx.fillStyle = world().accent; ctx.beginPath(); ctx.arc(t.x, t.y, player.r * (i / player.trail.length), 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1;
    if (drag) { 
      const dx = world().name == "Backwards"? player.x  - drag.point.x: drag.point.x - player.x;
      const dy = world().name == "Backwards"? player.y  - drag.point.y: drag.point.y - player.y;
      const length = Math.hypot(dx, dy)
      const pull = Math.min(length, 130); 
      ctx.globalAlpha = .8; 
      ctx.strokeStyle = world().accent; ctx.lineWidth = 3; 
      ctx.setLineDash([5, 7]); 
      ctx.beginPath(); 
      ctx.moveTo(player.x, player.y); 
      ctx.lineTo(player.x + dx / (length || 1) * pull, player.y + dy / (length || 1) * pull); 
      ctx.stroke(); 
      ctx.setLineDash([]); 
      ctx.globalAlpha = .18; 
      ctx.fillStyle = world().accent; 
      ctx.beginPath(); 
      ctx.arc(player.x, player.y, 24 + pull / 4, 0, TAU); 
      ctx.fill(); 
      ctx.globalAlpha = 1; }
      const currentR = player.r + pulse * 8;
      //EARS
      ctx.fillStyle = world().accent; 
      ctx.beginPath();
      ctx.moveTo(player.x-currentR,player.y-currentR);
      ctx.lineTo(player.x - currentR /3, player.y - currentR);
      ctx.lineTo(player.x - currentR/1.2, player.y);
      ctx.fill();
      //
      ctx.fillStyle = world().accent; 
      ctx.beginPath();
      ctx.moveTo(player.x+currentR,player.y-currentR);
      ctx.lineTo(player.x + currentR /3, player.y - currentR);
      ctx.lineTo(player.x + currentR/1.2, player.y);
      ctx.fill();
      //DRAWING OUTER CIRCLE
      ctx.fillStyle = world().accent; 
      ctx.beginPath(); 
      ctx.arc(player.x, player.y, currentR, 0, TAU); 
      ctx.fill(); 
      //INNER CIRCLE
      ctx.fillStyle = '#f8f5ed'; 
      ctx.beginPath(); 
      ctx.arc(player.x, player.y, 7, 0, TAU); 
      ctx.fill(); 
      //eyes
      ctx.beginPath();
      ctx.fillStyle = '#5e0d0d';
      ctx.ellipse(player.x-currentR*0.55,player.y-currentR*0.1,2,4,Math.PI/30,0,TAU);
      ctx.fill();
      // 
      ctx.beginPath();
      ctx.fillStyle = '#5e0d0d';
      ctx.ellipse(player.x+currentR*0.55,player.y-currentR*0.1,2,4,Math.PI/30,0,TAU);
      ctx.fill();
      //mouth
      ctx.beginPath();
      ctx.fillStyle = '#5e0d0d';
      ctx.arc(player.x, player.y+4, currentR*0.5,0, Math.PI,false);
      ctx.fill();
      //done player
      ctx.restore();

    //overlay teleport
    if(portal_alpha >0){
      ctx.save();
      ctx.globalAlpha = portal_alpha; 
      //gradient
      const gradient = ctx.createRadialGradient(
        viewW/2, viewH/2, 50, //inner
        viewW/2, viewH/2, Math.max(viewW, viewH)
      );
      gradient.addColorStop(0,'#a82eb0')
      gradient.addColorStop(0.1,'#65066c')
      gradient.addColorStop(0.5,'#240226')
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,viewW,viewH)
      ctx.restore();
    }
  }
  function loop(now) { const dt = Math.min(.033, (now - last) / 1000 || .016); last = now; update(dt); draw(); requestAnimationFrame(loop); }
  resize(); loadWorld(0); requestAnimationFrame(loop);
})();

