// Model solutions for every challenge in tutorials/pancake-stack.html.
// `bun scripts/check-challenges.ts pancake_stack` applies each one to its
// cell's step code and expects the challenge to tick itself off.

/**
 * Plays like a careful person until `done` says so: points the bear where
 * the lowest falling pancake will land, allowing for the sway of the tower
 * when there is one. Works for the one-pancake steps too (`pancake`).
 */
function catchPancakes(done, ms = 60000) {
  return async (game) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (await done(game)) return;
      const single = await game.read("pancake");
      const list = (await game.read("falling")) ?? (single ? [single] : []);
      const next = list
        .filter((pancake) => pancake.state === "falling")
        .sort((a, b) => b.y - a.y)[0];
      if (next) {
        const height = (await game.read("stack.length")) ?? 0;
        const wobble = (await game.read("WOBBLE")) ?? 0;
        const speed = next.speed ?? (await game.read("PANCAKE_SPEED"));
        const time = (await game.read("time")) ?? 0;
        // How long until it reaches the top of the tower (the plate is at y = 350).
        const wait = Math.max(0, (350 - height * 13 - (next.y + 13)) / speed);
        const sway =
          Math.sin((time + wait) * ((await game.read("WOBBLE_SPEED")) ?? 0)) *
          wobble *
          height *
          height;
        await game.move(Math.round(next.x - sway), 200);
      }
      await game.wait(50);
    }
  };
}

/** @type {import("../../scripts/check-challenges").Solution[]} */
export default [
  {
    id: "night-sky",
    edit: [
      [
        'screen.fill("#8fd3ff", "#ffe9c7");',
        'screen.fill("#0d0a24", "#3a2b6e");',
      ],
    ],
  },
  {
    id: "cloud",
    edit: [
      [
        'screen.circle(590, 96, 46, "#ffd34d");',
        'screen.circle(590, 96, 46, "#ffd34d");\n\n  screen.circle(200, 120, 28, "white");\n  screen.circle(235, 108, 34, "white");\n  screen.circle(272, 122, 26, "white");',
      ],
    ],
  },
  {
    id: "bear-left",
    edit: [["midBottom: [WIDTH / 2, FLOOR]", "midBottom: [150, FLOOR]"]],
  },
  {
    id: "turbo",
    edit: [["const CHEF_SPEED = 460;", "const CHEF_SPEED = 700;"]],
  },
  {
    id: "wasd",
    edit: [
      [
        "if (keyboard.left) chef.x -= CHEF_SPEED * dt;",
        "if (keyboard.left || keyboard.a) chef.x -= CHEF_SPEED * dt;",
      ],
      [
        "if (keyboard.right) chef.x += CHEF_SPEED * dt;",
        "if (keyboard.right || keyboard.d) chef.x += CHEF_SPEED * dt;",
      ],
    ],
  },
  {
    id: "space-home",
    edit: (code) =>
      code +
      "\nfunction onKeyDown(key) {\n  if (key === keys.SPACE) targetX = WIDTH / 2;\n}\n",
  },
  {
    id: "fast-fall",
    edit: [["const PANCAKE_SPEED = 140;", "const PANCAKE_SPEED = 320;"]],
  },
  {
    id: "generous",
    edit: [["const CATCH_RANGE = 40;", "const CATCH_RANGE = 90;"]],
  },
  {
    id: "catch-three",
    play: catchPancakes(async (game) => (await game.read("score")) >= 3),
    timeout: 40000,
  },
  {
    id: "all-berry",
    edit: [
      [
        'const PANCAKE_PICTURES = ["pancake_plain", "pancake_berry", "pancake_choc"];',
        'const PANCAKE_PICTURES = ["pancake_berry"];',
      ],
    ],
    play: async (game) => game.wait(4500),
    timeout: 12000,
  },
  {
    id: "click-spawn",
    edit: [
      [
        /(function onMouseDown\(pos, button\) \{[^}]*targetX = pos\[0\];)/,
        "$1\n  falling.push(makePancake());",
      ],
    ],
  },
  {
    id: "short-order",
    edit: [["const STACK_LIMIT = 10;", "const STACK_LIMIT = 5;"]],
  },
  {
    id: "stack-five",
    play: catchPancakes(async (game) => (await game.read("stack.length")) >= 5),
    timeout: 60000,
  },
  {
    id: "earthquake",
    edit: [["const WOBBLE_SPEED = 3;", "const WOBBLE_SPEED = 9;"]],
  },
  {
    id: "snake",
    edit: [
      [
        "return Math.sin(time * WOBBLE_SPEED) * WOBBLE * index * index;",
        "return Math.sin(time * WOBBLE_SPEED - index * 0.4) * WOBBLE * index * index;",
      ],
    ],
  },
  {
    id: "five-lives",
    edit: [["const MAX_MISSES = 3;", "const MAX_MISSES = 5;"]],
  },
  {
    id: "lose-on-purpose",
    play: async (game) => {
      await game.move(10, 200);
      await game.wait(14000);
    },
    timeout: 30000,
  },
  {
    id: "new-rush",
    edit: [
      [
        '{ name: "Midnight snack", from: 165, speed: 270, gap: 0.9 },',
        '{ name: "Midnight snack", from: 165, speed: 270, gap: 0.9 },\n  { name: "Pancake panic", from: 240, speed: 310, gap: 0.8 },',
      ],
    ],
  },
  {
    id: "quick-brunch",
    edit: [['{ name: "Brunch", from: 25,', '{ name: "Brunch", from: 5,']],
    play: catchPancakes(
      async (game) => (await game.read("activeRush.name")) === "Brunch",
    ),
    timeout: 60000,
  },
  {
    id: "springy",
    edit: [
      [
        'animate(pancake, { scale: 1, offset: 0, duration: 0.35, tween: "bounceEnd" });',
        'animate(pancake, { scale: 1, offset: 0, duration: 0.35, tween: "spring" });',
      ],
    ],
  },
  {
    id: "more-clouds",
    edit: [["for (let i = 0; i < 4; i++) {", "for (let i = 0; i < 8; i++) {"]],
  },
];
