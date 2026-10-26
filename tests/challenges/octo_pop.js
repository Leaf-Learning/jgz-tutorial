// Model solutions for every challenge in tutorials/octo-pop.html.
// `bun scripts/check-challenges.ts octo_pop` applies each one to its cell's
// step code and expects the challenge to tick itself off.

/** Types one word, a letter at a time, with the game focused. */
async function typeWord(game, word) {
  for (const letter of word) {
    await game.key(letter);
    await game.wait(30);
  }
}

/** The words of the bubbles still floating, the highest one first. */
function floating(game) {
  return game.evaluate((view) =>
    (view.read("bubbles") || [])
      .filter((bubble) => !bubble.popping)
      .sort((a, b) => a.y - b.y)
      .map((bubble) => bubble.word),
  );
}

/** Pops bubbles until `done(game)` says to stop (or the time runs out). */
function popUntil(done, seconds = 40) {
  return async (game) => {
    const deadline = Date.now() + seconds * 1000;
    while (Date.now() < deadline && !(await done(game))) {
      const words = await floating(game);
      if (words.length > 0) await typeWord(game, words[0]);
      else await game.wait(200);
      await game.wait(150);
    }
  };
}

/** @type {import("../../scripts/check-challenges").Solution[]} */
export default [
  {
    id: "new-word",
    edit: [['screen.text("octopus", 322', 'screen.text("kraken", 322']],
  },
  {
    id: "big-bubble",
    edit: [
      [
        'screen.circle(360, 230, 56, "#f6fdff")',
        'screen.circle(360, 230, 80, "#f6fdff")',
      ],
      [
        "screen.draw.circle([360, 230], 56,",
        "screen.draw.circle([360, 230], 80,",
      ],
    ],
  },
  {
    id: "octo-happy",
    edit: [['new Actor("octopus_idle"', 'new Actor("octopus_happy"']],
  },
  {
    id: "long-word",
    edit: [['bubble.word = "octopus";', 'bubble.word = "jellyfish";']],
  },
  {
    id: "shout",
    edit: [
      [
        "write(bubble.word[i], left",
        "write(bubble.word[i].toUpperCase(), left",
      ],
    ],
  },
  {
    id: "fast-bubble",
    edit: [["const BUBBLE_SPEED = 28;", "const BUBBLE_SPEED = 60;"]],
  },
  {
    id: "my-word",
    edit: [['"moon", "bell"];', '"moon", "bell", "kraken"];']],
  },
  {
    id: "busy-sea",
    edit: [["const SPAWN_EVERY = 3.6;", "const SPAWN_EVERY = 1;"]],
    play: async (game) => game.wait(5500),
    timeout: 4000,
  },
  {
    id: "digits",
    edit: [
      [
        '"abcdefghijklmnopqrstuvwxyz";',
        '"abcdefghijklmnopqrstuvwxyz0123456789";',
      ],
    ],
    play: async (game) => game.key("5"),
  },
  {
    id: "caps-tray",
    edit: [
      [
        "write(typed, WIDTH / 2, middle, 30, INK);",
        "write(typed.toUpperCase(), WIDTH / 2, middle, 30, INK);",
      ],
    ],
    play: async (game) => {
      await game.key("a");
      await game.key("b");
    },
  },
  {
    id: "ends-with",
    edit: [["bubble.word.startsWith(typed)", "bubble.word.endsWith(typed)"]],
    play: async (game) => {
      let words = await floating(game);
      while (words.length === 0) {
        await game.wait(200);
        words = await floating(game);
      }
      await game.key(words[0].slice(-1));
    },
  },
  {
    id: "double-points",
    edit: [
      [
        "score += bubble.word.length; // longer words score more",
        "score += bubble.word.length * 2; // longer words score more",
      ],
    ],
    play: popUntil(async (game) => (await game.read("score")) > 0),
    timeout: 20000,
  },
  {
    id: "twelve-points",
    play: popUntil(async (game) => (await game.read("score")) >= 12),
    timeout: 40000,
  },
  {
    id: "streak-three",
    play: popUntil(async (game) => (await game.read("streak")) >= 3),
    timeout: 30000,
  },
  {
    id: "five-lives",
    edit: [["const MAX_LIVES = 3;", "const MAX_LIVES = 5;"]],
  },
  {
    id: "win-it",
    edit: [["const GOAL = 6;", "const GOAL = 2;"]],
    play: popUntil(async (game) => (await game.read("state")) === "won"),
    timeout: 30000,
  },
  {
    id: "ten-words",
    edit: [
      [
        'words: "cat sun fish crab wave pearl moon bell",',
        'words: "cat sun fish crab wave pearl moon bell seal reef kelp",',
      ],
    ],
  },
  {
    id: "sixth-level",
    edit: [
      [
        /(\n {2}\},\n)(\];\n)/,
        '$1  {\n    name: "The Abyss",\n    words: "anglerfish abyss lantern shadow trench",\n    speed: 48,\n    every: 2,\n    goal: 12,\n  },\n$2',
      ],
    ],
  },
  {
    id: "loud-title",
    edit: [
      ["write(TITLE, middle, 140", "write(TITLE.toUpperCase(), middle, 140"],
    ],
  },
  {
    id: "longer-tune",
    edit: [
      [
        'playTune(["C5", "E5", "G5", "C6"]);',
        'playTune(["C5", "E5", "G5", "C6", "G5", "C6"]);',
      ],
    ],
    // Skip ahead: winning a level for real takes half a minute.
    play: async (game) => game.evaluate((view) => view.call("winLevel")),
  },
];
