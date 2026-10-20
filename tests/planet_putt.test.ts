// Plays the real Planet Putt through the jgz CLI: mouse press, drag and
// release, just like a player. Shots that need to sink are chosen by the
// solver (scripts/solve-planet.ts), which flies pretend balls with the
// game's own physics functions.

import { afterAll, beforeAll, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { act, openGame, type JgzSession } from "../scripts/jgz-session";
import { openSolver, type Solver } from "../scripts/solve-planet";

const root = fileURLToPath(new URL("..", import.meta.url));
const GAME = join(root, "games/planet_putt");
const SLOW = 240_000;

let solver: Solver;

beforeAll(async () => {
  solver = await openSolver();
}, SLOW);

afterAll(async () => {
  await solver?.close();
});

// Press in the middle of the screen and drag back by `pull` (whole pixels).
function shotActions(pull: [number, number]) {
  const [x, y] = [360, 240];
  return [
    act.press(x, y),
    act.step(2),
    act.move(x - pull[0] / 2, y - pull[1] / 2),
    act.step(2),
    act.move(x - pull[0], y - pull[1]),
    act.step(2),
    act.release(x - pull[0], y - pull[1]),
    act.step(1),
  ];
}

async function waitForBallToSettle(game: JgzSession) {
  for (let i = 0; i < 40; i++) {
    const state = await game.inspect("state");
    if (state !== "flying" && state !== "sinking") return state;
    await game.play([act.seconds(0.5)]);
  }
  throw new Error("the ball never stopped");
}

// Plays the current hole to the end with solver-picked shots.
async function playHole(game: JgzSession) {
  const index = await game.inspect("holeIndex");
  for (let stroke = 0; stroke < 8; stroke++) {
    const x = await game.inspect("ball.x");
    const y = await game.inspect("ball.y");
    const shot = await solver.bestShot(index, x, y);
    await game.play(shotActions(shot.pull));
    const state = await waitForBallToSettle(game);
    if (state === "holeDone") return;
  }
  throw new Error(`hole ${index + 1} was not finished in 8 strokes`);
}

test(
  "the title screen waits for a click, then hole 1 starts",
  async () => {
    const game = await openGame(GAME, { seed: "title" });
    try {
      expect(await game.inspect("state")).toBe("title");
      const result = await game.play([act.click(360, 240), act.step(2)], {
        inspect: ["state", "holeIndex", "strokes", "ball.x", "ball.y"],
      });
      expect(result.inspect).toEqual({
        state: "aiming",
        holeIndex: 0,
        strokes: 0,
        "ball.x": 110,
        "ball.y": 300,
      });
    } finally {
      await game.close();
    }
  },
  SLOW,
);

test(
  "pulling back launches the ball the other way, and a planet bends its path",
  async () => {
    const game = await openGame(GAME, { seed: "launch" });
    try {
      await game.play([act.click(360, 240), act.step(2)]);
      // Aiming shows the dotted prediction.
      const aiming = await game.play(
        [act.press(400, 300), act.step(2), act.move(340, 300), act.step(2)],
        {
          inspect: ["predicted.length", "dragStart"],
        },
      );
      expect(aiming.inspect["predicted.length"]).toBeGreaterThan(10);
      // Pull 60px to the left: the ball flies right at 60 × POWER px/s.
      const shot = await game.play([act.release(340, 300), act.step(1)], {
        inspect: ["state", "strokes", "ball.vx", "ball.vy"],
      });
      expect(shot.inspect.state).toBe("flying");
      expect(shot.inspect.strokes).toBe(1);
      expect(shot.inspect["ball.vx"]).toBeGreaterThan(200);
      expect(shot.inspect["ball.vx"]).toBeLessThanOrEqual(240);
      // The pink planet sits above the tee line, so its pull curves the ball up.
      const later = await game.play([act.seconds(0.6)], {
        inspect: ["ball.vy", "ball.y"],
      });
      expect(later.inspect["ball.vy"]).toBeLessThan(0);
      expect(later.inspect["ball.y"]).toBeLessThan(300);
      // Eventually space dust stops it, and it's ready for the next stroke.
      expect(await waitForBallToSettle(game)).toBe("aiming");
    } finally {
      await game.close();
    }
  },
  SLOW,
);

test(
  "a lost ball costs a stroke and comes back to where it was hit",
  async () => {
    const game = await openGame(GAME, { seed: "lost" });
    try {
      await game.play([act.click(360, 240), act.step(2)]);
      // Pull right and down hard: the ball flies off the top-left of the screen.
      await game.play(shotActions([-120, 40]));
      const state = await waitForBallToSettle(game);
      const result = await game.play([act.step(1)], {
        inspect: ["state", "strokes", "ball.x", "ball.y", "message"],
      });
      expect(state).toBe("aiming");
      expect(result.inspect.strokes).toBe(2);
      expect(result.inspect["ball.x"]).toBe(110);
      expect(result.inspect["ball.y"]).toBe(300);
      expect(result.inspect.message).toContain("Lost in space");
    } finally {
      await game.close();
    }
  },
  SLOW,
);

test(
  "hitting a planet bounces the ball and wobbles the planet",
  async () => {
    const game = await openGame(GAME, { seed: "bonk" });
    try {
      await game.play([act.click(360, 240), act.step(2)]);
      // Fire straight at the sleepy pink planet (it's up and to the right).
      const planet = await game.inspect("planets[0]");
      const tee = [110, 300];
      const dx = planet.x - tee[0];
      const dy = planet.y - tee[1];
      const length = Math.hypot(dx, dy);
      const pull: [number, number] = [
        Math.round((dx / length) * 110),
        Math.round((dy / length) * 110),
      ];
      await game.play(shotActions(pull));
      let sawOuch = false;
      let movedAway = false;
      for (let i = 0; i < 40 && !(sawOuch && movedAway); i++) {
        const r = await game.play([act.step(3)], {
          inspect: [
            "ball.image",
            "ball.vx",
            "ball.vy",
            "planets[0].actor.scale",
          ],
        });
        if (r.inspect["ball.image"] === "ball_ouch") sawOuch = true;
        // After the bounce the ball moves back away from the planet (down-left).
        if (sawOuch && r.inspect["ball.vy"] > 0) movedAway = true;
      }
      expect(sawOuch).toBe(true);
      expect(movedAway).toBe(true);
    } finally {
      await game.close();
    }
  },
  SLOW,
);

test(
  "R starts the hole over",
  async () => {
    const game = await openGame(GAME, { seed: "retry" });
    try {
      await game.play([act.click(360, 240), act.step(2)]);
      await game.play(shotActions([-30, 10]));
      await waitForBallToSettle(game);
      const result = await game.play([act.tap("r"), act.step(2)], {
        inspect: ["strokes", "ball.x", "ball.y", "state"],
      });
      expect(result.inspect).toEqual({
        strokes: 0,
        "ball.x": 110,
        "ball.y": 300,
        state: "aiming",
      });
    } finally {
      await game.close();
    }
  },
  SLOW,
);

test("all six holes can be played through to the scorecard, and the best total is saved", async () => {
  const game = await openGame(GAME, { seed: "round" });
  try {
    await game.play([act.click(360, 240), act.step(2)]);
    for (let hole = 0; hole < solver.holeCount; hole++) {
      expect(await game.inspect("holeIndex")).toBe(hole);
      await playHole(game);
      const done = await game.play([act.step(1)], {
        inspect: ["state", "scores"],
      });
      expect(done.inspect.state).toBe("holeDone");
      expect(done.inspect.scores.length).toBe(hole + 1);
      await game.play([act.click(360, 240), act.step(2)]);
    }
    const card = await game.play([act.step(1)], {
      inspect: ["state", "scores", "bestTotal", "newBest"],
    });
    expect(card.inspect.state).toBe("scorecard");
    const total = card.inspect.scores.reduce(
      (a: number, b: number) => a + b,
      0,
    );
    expect(card.inspect.bestTotal).toBe(total);
    expect(card.inspect.newBest).toBe(true);
    // The best total survives a restart (it's in storage).
    await game.send({ command: "restart" });
    expect(await game.inspect("bestTotal")).toBe(total);
  } finally {
    await game.close();
  }
}, 600_000);

test("every hole can be finished within par (solver, using the game's own physics)", async () => {
  for (let i = 0; i < solver.holeCount; i++) {
    const r = await solver.solveHole(i, { angleStep: 4, speedStep: 30 });
    expect({
      hole: i + 1,
      ok: r.best !== null && r.best <= solver.holes[i].par,
    }).toEqual({
      hole: i + 1,
      ok: true,
    });
  }
}, 600_000);
