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
// Lasers: Each laser is an object with x, y, width and height.

// Notes: The x and y coordinates are the opposite of what they would be in a graphing calculator for instance
// This is annoying but it's what gamedev folks usually do

const LEVELS = [
  {
    name: 'The Basics',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#ff7654',
    start: { x: 80, y: 390 },
    goal: { x: 1950, y: 150 },
    platforms: [
      { x: 0, y: 470, width: 420, height: 70},
      { x: 530, y: 410, width: 180, height: 24, crumble: true },
      { x: 790, y: 335, width: 170, height: 24,},
      { x: 1040, y: 430, width: 220, height: 24,},
      { x: 1280, y: 405, width: 150, height: 24, secret: true, crumble: true },
      { x: 1480, y: 380, width: 200, height: 24 },
      { x: 1800, y: 280, width: 200, height: 24 }
    ],
    spikes: [
      { x: 610, y: 410, width: 40, height: 22, text: true},
      { x: 1570, y: 380, width: 44, height: 22, text: false }
    ],
    lasers: [
      { x: 820, y: 245, width: 170, height: 8, text: true },
      { x: 1360, y: 140, width: 8, height: 130, text: false },
      { x: 1690, y: 315, width: 110, height: 8, text: false }
    ],
    portals: [
      { entryx: 1200, entryy: 350, exitx: 1400, exity: 200, radius: 25, text: true},
    ],
    pumpkins: [
      {x: 1150, y: 400, secret: false, text: true},
    ]
  },

  {
    name: 'The Gaps',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#ffd166',
    start: { x: 80, y: 360 },
    goal: { x: 2110, y: 150 },
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
      { x: 690, y: 290, width: 42, height: 22, text: false },
      { x: 970, y: 420, width: 40, height: 22, text: false },
      { x: 1800, y: 400, width: 44, height: 22, text: false }
    ],
    lasers: [
      { x: 540, y: 325, width: 110, height: 8, text: false},
      { x: 1060, y: 250, width: 8, height: 120, text: false },
      { x: 1580, y: 205, width: 150, height: 8, text: false }
    ],
    portals: [],
    pumpkins: [], 
  },

  {
    name: 'Laser Paradise',
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
      { x: 750, y: 440, width: 42, height: 22, text: false },
      { x: 990, y: 280, width: 40, height: 22, text: false },
      { x: 1870, y: 380, width: 44, height: 22, text: false }
    ],
    lasers: [
      { x: 840, y: 365, width: 110, height: 8, text: false },
      { x: 1360, y: 160, width: 8, height: 130, text: false },
      { x: 1980, y: 245, width: 140, height: 8, text: false}
    ],
    portals: [
      { x: 0, y: 470, width: 360, height: 70, text: false },
    ],
    pumpkins: [], 
  },

  {
    name: 'Needle Run',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#ffcf5c',
    start: { x: 80, y: 390 },
    goal: { x: 2310, y: 180 },
    platforms: [
      { x: 0, y: 470, width: 300, height: 70 },
      { x: 390, y: 390, width: 130, height: 24 },
      { x: 610, y: 270, width: 120, height: 24 },
      { x: 820, y: 390, width: 140, height: 24 },
      { x: 1080, y: 240, width: 120, height: 24 },
      { x: 1320, y: 350, width: 150, height: 24 },
      { x: 1600, y: 210, width: 120, height: 24 },
      { x: 1850, y: 330, width: 140, height: 24 },
      { x: 2110, y: 220, width: 260, height: 24 }
    ],
    spikes: [
      { x: 435, y: 390, width: 42, height: 22, text: false },
      { x: 650, y: 270, width: 42, height: 22, text: false },
      { x: 1380, y: 350, width: 44, height: 22, text: false },
      { x: 1900, y: 330, width: 42, height: 22, text: false }
    ],
    lasers: [
      { x: 740, y: 305, width: 80, height: 8, text: false },
      { x: 1210, y: 190, width: 8, height: 120, text: false },
      { x: 1725, y: 255, width: 110, height: 8, text: false }
    ],
    portals: [],
    pumpkins: [], 
  },

  {
    name: 'Crumble Canyon',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#8ee3c3',
    start: { x: 80, y: 390 },
    goal: { x: 2260, y: 140 },
    platforms: [
      { x: 0, y: 470, width: 330, height: 70 },
      { x: 430, y: 400, width: 120, height: 24, crumble: true },
      { x: 650, y: 320, width: 110, height: 24, crumble: true },
      { x: 850, y: 430, width: 150, height: 24 },
      { x: 1080, y: 300, width: 120, height: 24, crumble: true },
      { x: 1310, y: 210, width: 140, height: 24 },
      { x: 1550, y: 350, width: 120, height: 24, crumble: true },
      { x: 1780, y: 260, width: 130, height: 24, crumble: true },
      { x: 2040, y: 190, width: 270, height: 24 }
    ],
    spikes: [
      { x: 890, y: 430, width: 42, height: 22, text: false },
      { x: 1355, y: 210, width: 42, height: 22, text: false},
      { x: 1815, y: 260, width: 42, height: 22, text: false }
    ],
    lasers: [
      { x: 560, y: 350, width: 90, height: 8, text: false },
      { x: 1455, y: 245, width: 8, height: 120, text: false },
      { x: 1915, y: 205, width: 100, height: 8, text: false }
    ],
    portals: [],
    pumpkins: [], 
  },

  {
    name: 'Laser Hall',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#ff6b6b',
    start: { x: 80, y: 390 },
    goal: { x: 2390, y: 160 },
    platforms: [
      { x: 0, y: 470, width: 360, height: 70 },
      { x: 470, y: 360, width: 150, height: 24 },
      { x: 720, y: 360, width: 130, height: 24 },
      { x: 950, y: 260, width: 140, height: 24 },
      { x: 1190, y: 390, width: 130, height: 24 },
      { x: 1430, y: 280, width: 150, height: 24 },
      { x: 1690, y: 180, width: 120, height: 24 },
      { x: 1930, y: 330, width: 140, height: 24 },
      { x: 2180, y: 240, width: 260, height: 24 }
    ],
    spikes: [
      { x: 520, y: 360, width: 42, height: 22, text: false },
      { x: 1230, y: 390, width: 42, height: 22, text: false },
      { x: 1970, y: 330, width: 42, height: 22, text: false }
    ],
    lasers: [
      { x: 620, y: 295, width: 100, height: 8, text: false },
      { x: 850, y: 235, width: 8, height: 130, text: false },
      { x: 1095, y: 325, width: 90, height: 8, text: false },
      { x: 1325, y: 215, width: 8, height: 140, text: false },
      { x: 1585, y: 145, width: 105, height: 8, text: false },
      { x: 1815, y: 245, width: 8, height: 130, text: false },
      { x: 2075, y: 270, width: 105, height: 8, text: false }
    ],
    portals: [],
    pumpkins: [], 
  },

  {
    name: 'The Long Way',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#f7aef8',
    start: { x: 80, y: 390 },
    goal: { x: 2510, y: 180 },
    platforms: [
      { x: 0, y: 470, width: 260, height: 70 },
      { x: 420, y: 410, width: 90, height: 24 },
      { x: 650, y: 300, width: 100, height: 24 },
      { x: 900, y: 420, width: 90, height: 24 },
      { x: 1140, y: 250, width: 100, height: 24 },
      { x: 1380, y: 370, width: 90, height: 24 },
      { x: 1630, y: 200, width: 100, height: 24 },
      { x: 1880, y: 330, width: 90, height: 24 },
      { x: 2130, y: 150, width: 100, height: 24 },
      { x: 2390, y: 260, width: 220, height: 24 }
    ],
    spikes: [
      { x: 675, y: 300, width: 40, height: 22, text: false },
      { x: 925, y: 420, width: 40, height: 22, text: false },
      { x: 1660, y: 200, width: 40, height: 22, text: false },
      { x: 1910, y: 330, width: 40, height: 22, text: false }
    ],
    lasers: [
      { x: 510, y: 350, width: 105, height: 8, text: false },
      { x: 1245, y: 190, width: 8, height: 120, text: false },
      { x: 1975, y: 250, width: 110, height: 8, text: false }
    ],
    portals: [],
    pumpkins: [], 
  },

  {
    name: 'Low Orbit',
    hint: 'HARVEST',
    sky: '#737438',
    accent: '#ffe082',
    start: { x: 80, y: 400 },
    goal: { x: 2350, y: 300 },
    platforms: [
      { x: 0, y: 470, width: 340, height: 70 },
      { x: 450, y: 420, width: 150, height: 24 },
      { x: 700, y: 350, width: 130, height: 24 },
      { x: 930, y: 410, width: 140, height: 24 },
      { x: 1170, y: 300, width: 130, height: 24 },
      { x: 1400, y: 380, width: 150, height: 24 },
      { x: 1660, y: 290, width: 120, height: 24 },
      { x: 1890, y: 370, width: 140, height: 24 },
      { x: 2140, y: 300, width: 260, height: 24 }
    ],
    spikes: [
      { x: 500, y: 420, width: 42, height: 22, text: false },
      { x: 975, y: 410, width: 42, height: 22, text: false },
      { x: 1440, y: 380, width: 42, height: 22, text: false },
      { x: 1940, y: 370, width: 42, height: 22, text: false }
    ],
    lasers: [
      { x: 610, y: 300, width: 90, height: 8, text: false },
      { x: 1075, y: 350, width: 8, height: 100, text: false },
      { x: 1555, y: 250, width: 100, height: 8, text: false },
      { x: 2035, y: 275, width: 8, height: 120, text: false }
    ],
    portals: [],
    pumpkins: [], 
  }
];