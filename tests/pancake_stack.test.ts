// Plays Pancake Stack through the real jgz CLI: the title waits for a press,
// the bear slides with the keys and the pointer (and stops at the edges),
// pancakes fall and land on the stack or are missed, the stack sways more as
// it gets taller, a full stack is served for a bonus, the kitchen gets busier
// as the score climbs, three misses end the game, and the best score is saved.

import { afterAll, beforeAll, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { act, openGame, type JgzSession } from "../scripts/jgz-session";

const gameDir = fileURLToPath(
  new URL("../games/pancake_stack", import.meta.url),
);
let game: JgzSession;

beforeAll(async () => {
  game = await openGame(gameDir, { seed: "pancake-test" });
});
afterAll(async () => {
  await game.close();
});

type Info = {
  state: string;
  score: number;
  misses: number;
  stack: number;
  falling: number;
  time: number;
  chefX: number;
  rush: string;
};

async function look(frames = 1): Promise<Info> {
  const result = await game.play([act.step(frames)], {
    inspect: [
      "state",
      "score",
      "misses",
      "stack.length",
      "falling.length",
      "time",
      "chef.x",
      "activeRush.name",
    ],
  });
  const seen = result.inspect;
  return {
    state: seen.state,
    score: seen.score,
    misses: seen.misses,
    stack: seen["stack.length"],
    falling: seen["falling.length"],
    time: seen.time,
    chefX: seen["chef.x"],
    rush: seen["activeRush.name"],
  };
}

type Pancake = { x: number; bottom: number; state: string; speed: number };

async function fallingPancakes(count: number): Promise<Pancake[]> {
  const pancakes: Pancake[] = [];
  for (let i = 0; i < count; i++) {
    const actor = await game.inspect(`falling[${i}]`);
    pancakes.push({
      x: actor.x,
      bottom: actor.rect.bottom,
      state: actor.properties.state,
      speed: actor.properties.speed,
    });
  }
  return pancakes;
}

/**
 * Plays like a careful person: points the bear where the next pancake will
 * land, allowing for the sway of the stack by then. Stops when `done` says so.
 */
async function play(done: (info: Info) => boolean, maxSeconds = 120) {
  const wobble = await game.inspect("WOBBLE");
  const wobbleSpeed = await game.inspect("WOBBLE_SPEED");
  let info = await look();
  for (let i = 0; i < maxSeconds * 15 && !done(info); i++) {
    if (info.state !== "playing") break;
    if (info.falling > 0) {
      const top = await game.call("stackTop");
      const next = (await fallingPancakes(Math.min(info.falling, 3)))
        .filter((pancake) => pancake.state === "falling")
        .sort(
          (a, b) => (top - a.bottom) / a.speed - (top - b.bottom) / b.speed,
        )[0];
      if (next) {
        const wait = Math.max(0, (top - next.bottom) / next.speed);
        const sway =
          Math.sin((info.time + wait) * wobbleSpeed) *
          wobble *
          info.stack *
          info.stack;
        await game.play([act.move(Math.round(next.x - sway), 200)]);
      }
    }
    info = await look(4);
  }
  return info;
}

test("starts on the title screen, with nothing falling", async () => {
  const result = await game.play([act.seconds(3)], {
    inspect: ["state", "falling.length", "stack.length", "chef.x", "misses"],
  });
  expect(result.inspect).toEqual({
    state: "title",
    "falling.length": 0,
    "stack.length": 0,
    "chef.x": 360,
    misses: 0,
  });
  expect(result.status.diagnostics).toEqual([]);
});

test("the arrow keys slide the bear, and the edges stop it", async () => {
  await game.play([act.down("left"), act.seconds(2), act.up("left")]);
  expect(await game.inspect("chef.x")).toBe(60); // EDGE
  await game.play([act.down("right"), act.seconds(0.3), act.up("right")]);
  const part = await game.inspect("chef.x");
  expect(part).toBeGreaterThan(150);
  expect(part).toBeLessThan(260); // 460 pixels a second, for 0.3 seconds
  await game.play([act.down("right"), act.seconds(3), act.up("right")]);
  expect(await game.inspect("chef.x")).toBe(660); // WIDTH - EDGE
});

test("the bear glides to the pointer, no faster than its top speed", async () => {
  await game.play([act.move(100, 200), act.seconds(2)]);
  expect(await game.inspect("chef.x")).toBe(100);
  const early = await game.play([act.move(600, 200), act.seconds(0.25)], {
    inspect: ["chef.x"],
  });
  expect(early.inspect["chef.x"]).toBeGreaterThan(180);
  expect(early.inspect["chef.x"]).toBeLessThan(260); // 460 × 0.25 = 115 away
  await game.play([act.seconds(2)]);
  expect(await game.inspect("chef.x")).toBe(600);
  // Pointers outside the playing area are held inside it.
  await game.play([act.move(715, 200), act.seconds(1)]);
  expect(await game.inspect("chef.x")).toBe(660);
});

test("pressing on the title starts a game, and a pancake starts to fall", async () => {
  const result = await game.play([act.click(360, 200), act.step(3)], {
    inspect: [
      "state",
      "score",
      "misses",
      "stack.length",
      "falling.length",
      "falling[0].y",
      "activeRush.name",
    ],
  });
  const seen = result.inspect;
  expect(seen.state).toBe("playing");
  expect(seen.score).toBe(0);
  expect(seen.misses).toBe(0);
  expect(seen["stack.length"]).toBe(0);
  expect(seen["falling.length"]).toBe(1);
  expect(seen["falling[0].y"]).toBeLessThan(0); // still above the top of the screen
  expect(seen["activeRush.name"]).toBe("Breakfast");
});

test("a finger can press, drag and let go to steer the bear", async () => {
  await game.play([
    act.press(400, 200),
    act.step(2),
    act.move(300, 200),
    act.step(2),
    act.release(300, 200),
    act.seconds(2),
  ]);
  expect(await game.inspect("chef.x")).toBe(300);
});

test("pancakes keep coming, one every 1.8 seconds at breakfast", async () => {
  // Stay out of the way so nothing lands, then count what fell.
  await game.play([act.move(60, 200), act.seconds(3.8)]);
  const info = await look();
  expect(info.falling + info.misses).toBeGreaterThanOrEqual(3);
  expect(info.stack).toBe(0);
});

test("a pancake over the plate lands on the stack, and the bear is happy", async () => {
  await game.call("startGame");
  const info = await play((seen) => seen.stack >= 1, 20);
  expect(info.stack).toBe(1);
  expect(info.score).toBe(1);
  expect(info.misses).toBe(0);
  expect(await game.inspect("chef.image")).toBe("bear_happy");
  const top = await game.inspect("stack[0]");
  expect(top.properties.state).toBe("landed");
  // It sits on the plate, right on the bear.
  expect(Math.abs(top.x - info.chefX)).toBeLessThan(2);
});

test("the stack grows by a pancake's height each time, and sways more the higher it is", async () => {
  const info = await play((seen) => seen.stack >= 7, 60);
  expect(info.stack).toBe(7);
  const heights: number[] = [];
  for (let i = 0; i < 7; i++) {
    heights.push((await game.inspect(`stack[${i}]`)).rect.bottom);
  }
  for (let i = 1; i < 7; i++) expect(heights[i - 1] - heights[i]).toBe(13);

  // Stop catching: the stack keeps swaying while the misses pile up.
  await game.play([act.move(360, 200)]);
  const swing = [0, 0, 0, 0, 0, 0, 0];
  for (let sample = 0; sample < 25; sample++) {
    const seen = await game.play([act.step(6)], {
      inspect: ["chef.x", "state"],
    });
    for (let i = 0; i < 7; i++) {
      const x = (await game.inspect(`stack[${i}].x`)) as number;
      swing[i] = Math.max(swing[i], Math.abs(x - seen.inspect["chef.x"]));
    }
  }
  expect(swing[0]).toBe(0); // the bottom pancake sits still
  for (let i = 1; i < 7; i++) expect(swing[i]).toBeGreaterThan(swing[i - 1]);
  expect(swing[6]).toBeGreaterThan(15); // 0.6 × 6 × 6 = 21.6 pixels at most
  expect(swing[6]).toBeLessThan(23);
});

test("a full stack of ten is served: 10 bonus points and a fresh plate", async () => {
  await game.call("startGame");
  let before = 0;
  const info = await play((seen) => {
    if (seen.stack > 0) before = seen.score;
    return seen.stack === 0 && before >= 9;
  }, 90);
  expect(info.state).toBe("playing");
  expect(before).toBe(9);
  expect(info.stack).toBe(0);
  expect(info.score).toBe(20); // nine, then the tenth catch + 10
  expect(info.misses).toBe(0);
});

test("the kitchen gets busier as the score climbs", async () => {
  const info = await play((seen) => seen.score >= 25, 120);
  expect(info.score).toBeGreaterThanOrEqual(25);
  expect(info.rush).toBe("Brunch");
  expect(await game.inspect("activeRush.speed")).toBe(165);
  await game.play([act.seconds(2.5)]);
  const pancakes = await fallingPancakes(
    Math.min(2, await game.inspect("falling.length")),
  );
  expect(pancakes.some((pancake) => pancake.speed === 165)).toBe(true);
});

test("a missed pancake costs a heart", async () => {
  await game.call("startGame");
  await game.play([act.move(60, 200), act.seconds(1.5)]);
  let info = await look();
  for (let i = 0; i < 300 && info.misses === 0; i++) info = await look(3);
  expect(info.misses).toBe(1);
  expect(info.stack).toBe(0);
  expect(await game.inspect("chef.image")).toBe("bear_ouch");
  const missed = await game.inspect("falling");
  expect(missed.some((actor: any) => actor.properties.state === "missed")).toBe(
    true,
  );
});

test("three misses end the game, and the best score is kept", async () => {
  await game.call("startGame");
  await play((seen) => seen.score >= 4, 30);
  await game.play([act.move(60, 200), act.seconds(20)]);
  const result = await game.play([act.step(1)], {
    inspect: ["state", "misses", "score", "best", "newBest"],
  });
  expect(result.inspect.state).toBe("lost");
  expect(result.inspect.misses).toBe(3);
  expect(result.inspect.score).toBeGreaterThanOrEqual(4);
  expect(result.inspect.best).toBe(result.inspect.score); // saved
  expect(result.inspect.newBest).toBe(true);
  // Nothing more falls once the game is over.
  const frozen = await game.inspect("falling.length");
  await game.play([act.seconds(3)]);
  expect(await game.inspect("falling.length")).toBe(frozen);
  // A lost game is on the screen: the stack is still wobbling.
  expect(await game.inspect("stack.length")).toBeGreaterThan(0);
});

test("pressing Space after a loss starts a new game", async () => {
  const result = await game.play([act.tap("space"), act.step(2)], {
    inspect: ["state", "score", "misses", "stack.length", "best"],
  });
  expect(result.inspect.state).toBe("playing");
  expect(result.inspect.score).toBe(0);
  expect(result.inspect.misses).toBe(0);
  expect(result.inspect["stack.length"]).toBe(0);
  expect(result.inspect.best).toBeGreaterThanOrEqual(4);
});

test("the best score survives a restart", async () => {
  const best = await game.inspect("best");
  const restarted = await game.send({ command: "restart" });
  expect(restarted.ok).toBe(true);
  const result = await game.play([act.step(1)], {
    inspect: ["state", "best"],
  });
  expect(result.inspect).toEqual({ state: "title", best });
});

test("the clouds drift across and come back round", async () => {
  const before = await game.inspect("clouds[0].x");
  await game.play([act.seconds(1)]);
  const after = await game.inspect("clouds[0].x");
  expect(after).toBeGreaterThan(before);
  await game.play([act.seconds(60)]);
  for (let i = 0; i < 4; i++) {
    const x = await game.inspect(`clouds[${i}].x`);
    expect(x).toBeGreaterThan(-200);
    expect(x).toBeLessThan(900);
  }
});
