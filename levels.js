// How to add your own levels:
// Name: Name of the level
// Hint: is actually the name of the world, I need to fix that
// Sky: Color of the sky, it should be the same for every level in a world
// Accent: Color of the player and the goal
// Start: Starting position of the player
// Goal: Position of the goal
// Platforms: Each platform is an object with x, y, width and height properties.
// Crumbling platforms: Platforms that crumble quickly (just set crumble: true on a platform)
// Spikes: Each spike is an object with x, y (the base), width and height.

// Notes: The x and y coordinates are the opposite of what they would be in a graphing calculator for instance
// This is annoying but it's what gamedev folks usually do

const LEVELS = [
  {
    name: 'Welcome',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#ff7654',
    start: { x: 80, y: 390 },
    goal: { x: 1950, y: 150 },
    platforms: [
      { x: 0, y: 470, width: 420, height: 70 },
      { x: 530, y: 410, width: 180, height: 24, crumble: true },
      { x: 790, y: 335, width: 170, height: 24 },
      { x: 1040, y: 430, width: 220, height: 24 },
      { x: 1280, y: 300, width: 150, height: 24, crumble: true },
      { x: 1480, y: 380, width: 200, height: 24 },
      { x: 1800, y: 280, width: 200, height: 24 }
    ],
    spikes: [
      { x: 610, y: 410, width: 40, height: 22 },
      { x: 1120, y: 430, width: 42, height: 22 },
      { x: 1570, y: 380, width: 44, height: 22 }
    ],
    portals: [{ entryx: 300, entryy: 350, exitx: 1200, exity: 200, radius: 25},]
  },

  {
    name: 'The Gaps',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#ffd166',
    start: { x: 80, y: 360 },
    goal: { x: 2110, y: 300 },
    platforms: [
      { x: 0, y: 470, width: 300, height: 70 },
      { x: 400, y: 380, width: 120, height: 24, crumble: true },
      { x: 650, y: 290, width: 150, height: 24 },
      { x: 930, y: 420, width: 120, height: 24 },
      { x: 1180, y: 340, width: 140, height: 24, crumble: true },
      { x: 1450, y: 280, width: 130, height: 24 },
      { x: 1750, y: 400, width: 160, height: 24 },
      { x: 2050, y: 290, width: 180, height: 24 }
    ],
    spikes: [
      { x: 690, y: 290, width: 42, height: 22 },
      { x: 970, y: 420, width: 40, height: 22 },
      { x: 1800, y: 400, width: 44, height: 22 }
    ],
    portals: []
  },

  {
    name: 'The Final Level',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#7ed6a5',
    start: { x: 80, y: 390 },
    goal: { x: 2390, y: 160 },
    platforms: [
      { x: 0, y: 470, width: 360, height: 70 },
      { x: 490, y: 360, width: 120, height: 24, crumble: true },
      { x: 700, y: 440, width: 140, height: 24 },
      { x: 950, y: 280, width: 120, height: 24 },
      { x: 1220, y: 350, width: 130, height: 24, crumble: true },
      { x: 1520, y: 240, width: 110, height: 24 },
      { x: 1820, y: 380, width: 150, height: 24 },
      { x: 2120, y: 290, width: 140, height: 24 },
      { x: 2350, y: 350, width: 200, height: 24 }
    ],
    spikes: [
      { x: 750, y: 440, width: 42, height: 22 },
      { x: 990, y: 280, width: 40, height: 22 },
      { x: 1870, y: 380, width: 44, height: 22 }
    ],
    portals: [
      { x: 0, y: 470, width: 360, height: 70 },
    ]
  }
];