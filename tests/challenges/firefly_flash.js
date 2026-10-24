// Model solutions for every challenge in tutorials/firefly-flash.html.
// `bun scripts/check-challenges.ts firefly_flash` applies each one to its
// cell's step code and expects the challenge to tick itself off.

/** Clicks drifting fireflies one at a time until none are left (or `times` runs out). */
async function clickFireflies(game, times = 14) {
  for (let i = 0; i < times; i++) {
    const spots = await game.evaluate((view) =>
      (view.read("fireflies") || [])
        .filter((fly) => fly.state === "drifting")
        .map((fly) => [fly.x, fly.y]),
    );
    if (!spots.length) break;
    await game.click(spots[0][0], spots[0][1]);
    await game.wait(250);
  }
}

/** @type {import("../../scripts/check-challenges").Solution[]} */
export default [
  {
    id: "moon-corner",
    edit: [["screen.circle(446, 74, 40", "screen.circle(80, 70, 40"]],
  },
  {
    id: "big-moon",
    edit: [["screen.circle(446, 74, 40", "screen.circle(446, 74, 70"]],
  },
  {
    id: "more-stars",
    edit: [
      [
        'screen.circle(590, 170, 1.5, "white");',
        'screen.circle(590, 170, 1.5, "white");\n  screen.circle(260, 150, 2, "white");\n  screen.circle(40, 200, 1.5, "white");',
      ],
    ],
  },
  { id: "hill-color", edit: [[/"#231d57"/g, '"#1f4d45"']] },
  {
    id: "on-moon",
    edit: [
      ["let x = 200;", "let x = 446;"],
      ["let y = 180;", "let y = 74;"],
    ],
  },
  {
    id: "fly-down",
    edit: [
      ["let vx = 50;", "let vx = 0;"],
      ["let vy = -30;", "let vy = 30;"],
    ],
  },
  {
    id: "zoom",
    edit: [
      ["let vx = 50;", "let vx = 180;"],
      ["let vy = -30;", "let vy = -160;"],
    ],
  },
  { id: "fifty", edit: [["const COUNT = 12;", "const COUNT = 50;"]] },
  {
    id: "slowpokes",
    edit: [
      ["const MIN_SPEED = 25;", "const MIN_SPEED = 5;"],
      ["const MAX_SPEED = 60;", "const MAX_SPEED = 20;"],
    ],
  },
  { id: "fast-wings", edit: [["fps: 12,", "fps: 24,"]] },
  { id: "moon-left", edit: [["center: [446, 74]", "center: [120, 74]"]] },
  {
    id: "huge-flash",
    edit: [["const FLASH_SIZE = 44;", "const FLASH_SIZE = 110;"]],
    play: async (game) => {
      await game.click(320, 200);
      await game.wait(800);
    },
  },
  { id: "ten-lit", play: (game) => clickFireflies(game) },
  {
    id: "big-bodies",
    edit: [["const FIREFLY_SIZE = 12;", "const FIREFLY_SIZE = 30;"]],
    play: (game) => clickFireflies(game),
  },
  {
    id: "waveform",
    edit: [['waveform: "triangle"', 'waveform: "square"']],
    play: (game) => clickFireflies(game),
  },
  {
    id: "easy-first",
    edit: [["{ fireflies: 10, goal: 3 }", "{ fireflies: 10, goal: 1 }"]],
  },
  {
    id: "ninth-night",
    edit: [
      [
        "{ fireflies: 40, goal: 30 },",
        "{ fireflies: 40, goal: 30 },\n  { fireflies: 55, goal: 45 },",
      ],
    ],
  },
  {
    id: "rename",
    edit: [['write("Firefly Flash", middle', 'write("Glow Party", middle']],
  },
  {
    id: "longer-tune",
    edit: [
      [
        'playTune(["C5", "E5", "G5", "C6"])',
        'playTune(["C5", "E5", "G5", "C6", "G5", "C6"])',
      ],
      ["{ fireflies: 10, goal: 3 }", "{ fireflies: 10, goal: 1 }"],
    ],
    // Start the first night, light one firefly, and wait for the night to end.
    play: async (game) => {
      await game.click(320, 200);
      await game.wait(300);
      await clickFireflies(game, 1);
      await game.wait(3000);
    },
    timeout: 4000,
  },
];
