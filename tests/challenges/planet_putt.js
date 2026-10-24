// Model solutions for every challenge in tutorials/planet-putt.html.
// `bun scripts/check-challenges.ts planet_putt` applies each one to its
// cell's step code and expects the challenge to tick itself off.

/** Press in the middle and pull back, holding the aim for a moment. */
async function holdAim(game) {
  await game.press(360, 240);
  await game.move(300, 270);
  await game.wait(900);
  await game.release();
}

/** From the first tee (110, 300), shoot hard at the pink planet (360, 120). */
async function shootAtPlanet(game) {
  const dx = 360 - 110;
  const dy = 120 - 300;
  const length = Math.hypot(dx, dy);
  await game.drag(
    [360, 240],
    [360 - (dx / length) * 110, 240 - (dy / length) * 110],
  );
}

/** @type {import("../../scripts/check-challenges").Solution[]} */
export default [
  {
    id: "giant-stars",
    edit: [
      [
        "randomChoice([1, 1, 1, 1.5, 2, 3])",
        "randomChoice([1, 1, 1, 1.5, 2, 3, 6])",
      ],
    ],
  },
  {
    id: "straight-up",
    edit: [
      ["ball.vx = 150", "ball.vx = 0"],
      ["ball.vy = -60", "ball.vy = -120"],
    ],
  },
  {
    id: "floor-bounce",
    edit: [
      [
        "  ball.y += ball.vy * dt;\n}",
        "  ball.y += ball.vy * dt;\n  if (ball.y > HEIGHT && ball.vy > 0) {\n    ball.vy = -ball.vy * 0.8;\n  }\n}",
      ],
    ],
    timeout: 5000,
  },
  {
    id: "two-planets",
    edit: [
      [
        'planets.push(makePlanet(380, 170, 60, "blue"));',
        'planets.push(makePlanet(380, 170, 60, "blue"));\nplanets.push(makePlanet(560, 340, 45, "green"));',
      ],
    ],
  },
  {
    id: "speed-text",
    edit: [
      [
        "  const color = speed > MAX_SPEED * 0.9 ? PINK : GOLD;\n",
        '  const color = speed > MAX_SPEED * 0.9 ? PINK : GOLD;\n  screen.draw.text("Speed: " + Math.round(speed), [tip[0] + 12, tip[1]], {\n    size: 18,\n    color: color,\n  });\n',
      ],
    ],
    play: holdAim,
  },
  {
    id: "strokes-hud",
    edit: [
      [
        "function drawHud() {\n",
        'function drawHud() {\n  write("Strokes: " + strokes, WIDTH - 16, 12, 22, GOLD, "topRight");\n',
      ],
    ],
  },
  {
    id: "ouch",
    edit: [
      [
        '  animate(planet.actor, { scale: size, duration: 0.7, tween: "spring" });\n',
        '  animate(planet.actor, { scale: size, duration: 0.7, tween: "spring" });\n  ball.image = "ball_ouch";\n',
      ],
    ],
    play: shootAtPlanet,
  },
  {
    id: "spin",
    edit: [["wormhole.angle -= 120 * dt;", "wormhole.angle += 300 * dt;"]],
  },
  { id: "close-dots", edit: [["i % 6 === 0", "i % 3 === 0"]], play: holdAim },
  {
    id: "seventh-hole",
    edit: [
      [
        "];\n\nconst SCORE_NAMES",
        '  {\n    name: "Moon Maze",\n    par: 3,\n    tee: [80, 80],\n    hole: [640, 400],\n    planets: [\n      { x: 240, y: 200, radius: 50, kind: "pink" },\n      { x: 450, y: 300, radius: 60, kind: "blue" },\n    ],\n  },\n];\n\nconst SCORE_NAMES',
      ],
    ],
  },
  {
    id: "bonk-sound",
    edit: [
      [
        '  tone.play("C3", 0.12, { waveform: "square", volume: 0.15 });',
        '  tone.play("G2", 0.15, { waveform: "sawtooth", volume: 0.15 });',
      ],
    ],
    // Leave the title screen, then bonk a planet.
    play: async (game) => {
      await game.click(360, 240);
      await game.wait(500);
      await shootAtPlanet(game);
    },
  },
  { id: "twinkle-fast", edit: [["Math.sin(time * 2", "Math.sin(time * 6"]] },
];
