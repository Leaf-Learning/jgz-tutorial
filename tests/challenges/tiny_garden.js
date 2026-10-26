// Model solutions for every challenge in tutorials/tiny-garden.html.
// `bun scripts/check-challenges.ts tiny_garden` applies each one to its cell's
// step code and expects the challenge to tick itself off.

/** The middle of plot number `index` (counting along the rows), in game pixels. */
const plot = (index) => [
  20 + (index % 4) * 108 + 48,
  128 + Math.floor(index / 4) * 90 + 45,
];
const STALL = [548, 270];
const slot = (index) => [19 + index * 122 + 57, 358];

/** Plants, waters, grows (with a very quick daisy), then picks the given plots. */
async function harvest(game, indexes, waitMs = 900) {
  for (const i of indexes) await game.click(...plot(i)); // plant
  for (const i of indexes) await game.click(...plot(i)); // water
  await game.wait(waitMs);
  for (const i of indexes) await game.click(...plot(i)); // pick
}

const QUICK = ["cost: 0, grow: 4, price: 3", "cost: 0, grow: 0.5, price: 3"];

/** @type {import("../../scripts/check-challenges").Solution[]} */
export default [
  {
    id: "sun-left",
    edit: [
      ["screen.circle(560, 50, 56,", "screen.circle(120, 50, 56,"],
      ["screen.circle(560, 50, 38,", "screen.circle(120, 50, 38,"],
    ],
  },
  {
    id: "tall-grass",
    edit: [
      ["screen.rect(0, 144, WIDTH, 256", "screen.rect(0, 100, WIDTH, 300"],
    ],
  },
  { id: "cloud-over-sun", edit: [["let cloudX = 40;", "let cloudX = 520;"]] },
  {
    id: "second-cloud",
    edit: [
      [
        '  screen.blit("cloud", [cloudX, 36]);',
        '  screen.blit("cloud", [cloudX, 36]);\n  screen.blit("cloud", [300, 20]);',
      ],
    ],
  },
  {
    id: "fast-cloud",
    edit: [["const CLOUD_SPEED = 14;", "const CLOUD_SPEED = 80;"]],
  },
  {
    id: "cloud-left",
    edit: [
      ["const CLOUD_SPEED = 14;", "const CLOUD_SPEED = -150;"],
      [
        "if (cloudX > WIDTH) cloudX = -100;",
        "if (cloudX < -100) cloudX = WIDTH;",
      ],
    ],
  },
  {
    id: "bigger-garden",
    edit: [
      ["const COLUMNS = 4;", "const COLUMNS = 5;"],
      ["const ROWS = 2;", "const ROWS = 3;"],
    ],
  },
  { id: "glow-corner", play: (game) => game.move(...plot(7)) },
  {
    id: "plant-three",
    play: async (game) => {
      for (const i of [0, 1, 2]) await game.click(...plot(i));
    },
  },
  {
    id: "quick-daisy",
    edit: [["cost: 0, grow: 4, price: 3", "cost: 0, grow: 1, price: 3"]],
    play: async (game) => {
      await game.click(...plot(0));
      await game.wait(1500);
    },
  },
  {
    id: "more-stages",
    edit: [
      [
        'const STAGES = ["seed", "sprout", "bud"];',
        'const STAGES = ["seed", "sprout", "sprout", "bud"];',
      ],
    ],
    play: (game) => game.click(...plot(0)),
  },
  {
    id: "long-drink",
    edit: [["const WATER_TIME = 5;", "const WATER_TIME = 10;"]],
    play: async (game) => {
      await game.click(...plot(0)); // plant
      await game.click(...plot(0)); // water
      await game.wait(300);
    },
  },
  {
    id: "water-two",
    play: async (game) => {
      for (const i of [0, 1]) await game.click(...plot(i)); // plant
      for (const i of [0, 1]) await game.click(...plot(i)); // water
    },
  },
  {
    id: "pick-three",
    edit: [QUICK],
    play: (game) => harvest(game, [0, 1, 2]),
    timeout: 6000,
  },
  {
    id: "daisy-gold",
    edit: [["cost: 0, grow: 4, price: 3", "cost: 0, grow: 0.5, price: 10"]],
    play: async (game) => {
      await harvest(game, [0], 800);
      await game.click(...STALL);
    },
    timeout: 6000,
  },
  { id: "rename-daisy", edit: [['name: "Daisy"', 'name: "Buttercup"']] },
  {
    id: "sixth-flower",
    edit: [
      [
        '  { name: "Moonbloom", image: "moonbloom", cost: 800, grow: 22, price: 70 },\n',
        '  { name: "Moonbloom", image: "moonbloom", cost: 800, grow: 22, price: 70 },\n  { name: "Pansy", image: "daisy", cost: 1500, grow: 26, price: 120 },\n',
      ],
      ["const SLOT_STEP = 122;", "const SLOT_STEP = 100;"],
    ],
  },
  {
    id: "start-rich",
    edit: [["let coins = 0;", "let coins = 100;"]],
    play: (game) => game.click(...slot(2)),
  },
  {
    id: "own-tune",
    edit: [
      [
        'playTune(["C5", "E5", "G5", "C6"]);',
        'playTune(["C5", "E5", "G5", "C6", "E6"]);',
      ],
      QUICK,
    ],
    play: async (game) => {
      await harvest(game, [0], 800);
      await game.click(...STALL);
    },
    timeout: 6000,
  },
  {
    id: "rename-title",
    edit: [
      [
        'write("Tiny Garden", WIDTH / 2, 126, 58, "#3f9b4f");',
        'write("Dewdrop Meadow", WIDTH / 2, 126, 58, "#3f9b4f");',
      ],
    ],
  },
];
