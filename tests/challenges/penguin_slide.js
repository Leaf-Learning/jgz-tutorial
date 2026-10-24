// Model solutions for every challenge in tutorials/penguin-slide.html.
// `bun scripts/check-challenges.ts penguin_slide` applies each one to its
// cell's step code and expects the challenge to tick itself off.

/** Presses keys one by one, letting each slide finish first. */
function slide(...keys) {
  return async (game) => {
    for (const key of keys) {
      await game.key(key);
      await game.wait(900);
    }
  };
}

/** @type {import("../../scripts/check-challenges").Solution[]} */
export default [
  {
    id: "grid-size",
    edit: [
      ["const COLUMNS = 10;", "const COLUMNS = 12;"],
      ["const ROWS = 6;", "const ROWS = 8;"],
    ],
  },
  {
    id: "checkerboard",
    edit: [
      [
        'screen.rect(x + 1, y + 1, TILE - 2, TILE - 2, "#d3efff");',
        'if ((row + col) % 2 === 0) {\n  screen.rect(x + 1, y + 1, TILE - 2, TILE - 2, "#d3efff");\n} else {\n  screen.rect(x + 1, y + 1, TILE - 2, TILE - 2, "#a9dcf7");\n}',
      ],
    ],
  },
  {
    id: "add-rock",
    edit: [
      ['  "#........#",\n  "#.....F..#",', '  "#...#....#",\n  "#.....F..#",'],
    ],
  },
  {
    id: "snow-pic",
    edit: [
      ['"#........#",\n  "#.....F..#",', '"#..*.....#",\n  "#.....F..#",'],
      [
        'if (letter === "#") screen.blit("rock", [x, y]);',
        'if (letter === "#") screen.blit("rock", [x, y]);\n      if (letter === "*") screen.blit("snow", [x, y]);',
      ],
    ],
  },
  {
    id: "walk-to-fish",
    play: slide(
      "ArrowRight",
      "ArrowRight",
      "ArrowRight",
      "ArrowRight",
      "ArrowRight",
      "ArrowDown",
      "ArrowDown",
      "ArrowDown",
    ),
  },
  {
    id: "wasd",
    edit: (code) =>
      code.replace(
        /function onKeyDown\(key\) \{[\s\S]*?\n\}/,
        "function onKeyDown(key) {\n  if (key === keys.LEFT || key === keys.A) step(-1, 0);\n  if (key === keys.RIGHT || key === keys.D) step(1, 0);\n  if (key === keys.UP || key === keys.W) step(0, -1);\n  if (key === keys.DOWN || key === keys.S) step(0, 1);\n}",
      ),
  },
  {
    id: "move-counter",
    edit: [
      [
        "let grid = []; // the level's tiles: one array of letters per row",
        "let grid = []; // the level's tiles: one array of letters per row\nlet moves = 0;",
      ],
      [
        "  penguin.row = row;\n  penguin.col = col;\n  penguin.pos",
        "  moves += 1;\n  penguin.row = row;\n  penguin.col = col;\n  penguin.pos",
      ],
      [
        /(color: "#18324f",\n  \}\);\n)\}/,
        '$1  screen.draw.text(`Moves: ${moves}`, {\n    center: [WIDTH / 2, HEIGHT - 32],\n    fontname: FONT,\n    size: 24,\n    color: "#2f5580",\n  });\n}',
      ],
    ],
    play: slide("ArrowRight"),
  },
  {
    id: "tween",
    edit: [
      [
        'duration: distance * SLIDE_TIME,\n    tween: "linear"',
        'duration: distance * SLIDE_TIME,\n    tween: "bounce"',
      ],
    ],
  },
  {
    id: "third-fish",
    edit: [
      ['  "#........#",\n  "##########",', '  "#..F.....#",\n  "##########",'],
    ],
    play: slide(
      "ArrowRight",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
    ),
  },
  {
    id: "own-level",
    edit: [
      [
        /const LEVEL = \[[\s\S]*?\n\];/,
        'const LEVEL = [\n  "############",\n  "#P.....#...#",\n  "#..........#",\n  "#....*...O.#",\n  "#.........F#",\n  "#.F........#",\n  "############",\n];',
      ],
    ],
    play: slide("ArrowDown", "ArrowRight", "ArrowUp"),
  },
  {
    id: "fifth-level",
    edit: [
      [
        /(\n {2}\},\n)(\];\n)/,
        '$1  {\n    name: "My Level",\n    par: 3,\n    map: [\n      "###########",\n      "#P....O..F#",\n      "#.........#",\n      "#.........#",\n      "#....*....#",\n      "#.....F...#",\n      "###########",\n    ],\n  },\n$2',
      ],
    ],
  },
  { id: "three-stars", play: slide("ArrowRight") },
  {
    id: "blizzard",
    edit: [["const SNOWFLAKES = 45;", "const SNOWFLAKES = 300;"]],
  },
];
