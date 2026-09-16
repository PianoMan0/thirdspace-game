/**
 * LEVELS CONFIGURATION
 * ====================
 * Easy-to-edit level structure for beginners
 * 
 * To create a new level, copy the template below and fill in the values:
 * 
 * {
 *   name: 'LEVEL NAME',
 *   hint: 'HINT TEXT',
 *   sky: '#hexcolor',
 *   accent: '#hexcolor',
 *   start: [x, y],
 *   goal: [x, y],
 *   platforms: [[x, y, width, height], ...],
 *   obstacles: [] // Add obstacles here
 * }
 */

const LEVELS = [
  // ===== WORLD 1: LOW ORBIT =====
  {
    name: 'LOW ORBIT',
    hint: 'VECTOR TRAINING',
    sky: '#101b24',
    accent: '#ff7654',
    start: [80, 390],
    goal: [1950, 300],
    platforms: [
      [0, 470, 420, 70],
      [530, 410, 180, 24],
      [790, 335, 170, 24],
      [1040, 430, 220, 24],
      [1280, 300, 150, 24],
      [1480, 380, 200, 24],
      [1800, 280, 200, 24]
    ],
    obstacles: []
  },

  // ===== WORLD 2: THE GAPS =====
  {
    name: 'THE GAPS',
    hint: 'MOMENTUM TEST',
    sky: '#1b1820',
    accent: '#ffd166',
    start: [80, 360],
    goal: [2110, 240],
    platforms: [
      [0, 470, 300, 70],
      [400, 380, 120, 24],
      [650, 290, 150, 24],
      [930, 420, 120, 24],
      [1180, 340, 140, 24],
      [1450, 280, 130, 24],
      [1750, 400, 160, 24],
      [2050, 290, 180, 24]
    ],
    obstacles: []
  },

  // ===== WORLD 3: LAST LIGHT =====
  {
    name: 'LAST LIGHT',
    hint: 'FINAL VECTOR',
    sky: '#101f1d',
    accent: '#7ed6a5',
    start: [80, 390],
    goal: [2390, 160],
    platforms: [
      [0, 470, 360, 70],
      [490, 360, 120, 24],
      [700, 440, 140, 24],
      [950, 280, 120, 24],
      [1220, 350, 130, 24],
      [1520, 240, 110, 24],
      [1820, 380, 150, 24],
      [2120, 290, 140, 24],
      [2350, 350, 200, 24]
    ],
    obstacles: []
  }
];

// ===== OBSTACLE TYPES =====
// Examples for future obstacle implementation:
// 
// Spike obstacle: { type: 'spike', x: 100, y: 200, width: 30, height: 20 }
// Moving platform: { type: 'moving', x: 100, y: 200, width: 50, height: 24, minX: 100, maxX: 300, speed: 60 }
// Fan (updraft): { type: 'fan', x: 100, y: 200, width: 60, height: 30, power: 400 }
// Bouncer: { type: 'bouncer', x: 100, y: 200, width: 40, height: 20, bounceForce: 600 }
