// Plays Firefly Flash through the real jgz CLI: title → night 1, a click on
// empty sky loses, a click on a crowd of fireflies starts a chain that wins,
// progress is saved, and the next night has more fireflies.

import { afterAll, beforeAll, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { act, openGame, type JgzSession } from "../scripts/jgz-session";

const gameDir = fileURLToPath(
  new URL("../games/firefly_flash", import.meta.url),
);
let game: JgzSession;

beforeAll(async () => {
  game = await openGame(gameDir, { seed: "firefly-test" });
});
afterAll(async () => {
  await game.close();
});

type Fly = { x: number; y: number; state: string };

// The inspector summarises an Actor with its own properties (x, y, image…)
// and keeps the ones the game added (state, vx…) under `properties`.
async function fireflies(): Promise<Fly[]> {
  const actors = await game.inspect("fireflies");
  return actors.map((actor: any) => ({
    x: actor.x,
    y: actor.y,
    state: actor.properties.state,
  }));
}

// The spot with the most fireflies within reach of a flash.
function crowdedSpot(flies: Fly[]): [number, number] {
  let best = flies[0];
  let bestCount = -1;
  for (const fly of flies) {
    const near = flies.filter(
      (other) => Math.hypot(other.x - fly.x, other.y - fly.y) < 70,
    ).length;
    if (near > bestCount) {
      best = fly;
      bestCount = near;
    }
  }
  return [Math.round(best.x), Math.round(best.y)];
}

async function finishChain() {
  for (let i = 0; i < 12; i++) {
    const state = await game.inspect("state");
    if (state !== "chain") return state;
    await game.play([act.seconds(0.5)]);
  }
  return game.inspect("state");
}

test("starts on the title screen with fireflies to watch", async () => {
  const result = await game.play([act.step(10)], {
    inspect: ["state", "fireflies.length", "night"],
  });
  expect(result.inspect).toEqual({
    state: "title",
    "fireflies.length": 12,
    night: 0,
  });
  expect(result.status.diagnostics).toEqual([]);
});

test("clicking the title starts night 1", async () => {
  const result = await game.play([act.click(320, 200), act.step(2)], {
    inspect: ["state", "fireflies.length", "lit", "spark"],
  });
  expect(result.inspect).toEqual({
    state: "aiming",
    "fireflies.length": 10,
    lit: 0,
    spark: null,
  });
});

test("a flash that can't reach any firefly lights nothing, and the night is lost", async () => {
  // Fireflies drift into a flash while it glows, so open sky isn't safe. The
  // bottom-left corner of the meadow is: fireflies turn back at SKY_BOTTOM,
  // more than a flash's reach (FLASH_SIZE + FIREFLY_SIZE) away from it.
  await game.play([act.seconds(1)]);
  const flash = await game.play([act.click(0, 399), act.step(1)], {
    inspect: ["state", "spark.x", "spark.y"],
  });
  expect(flash.inspect).toEqual({
    state: "chain",
    "spark.x": 0,
    "spark.y": 399,
  });
  expect(await finishChain()).toBe("lost");
  expect(await game.inspect("lit")).toBe(0);
});

test("clicking after a loss replays the same night", async () => {
  const result = await game.play([act.click(320, 200), act.step(1)], {
    inspect: ["state", "night", "lit", "fireflies.length"],
  });
  expect(result.inspect).toEqual({
    state: "aiming",
    night: 0,
    lit: 0,
    "fireflies.length": 10,
  });
});

test("a flash on a firefly lights it, and a good click wins the night", async () => {
  let won = false;
  for (let attempt = 0; attempt < 8 && !won; attempt++) {
    await game.play([act.seconds(0.5)]);
    const [x, y] = crowdedSpot(await fireflies());
    await game.play([act.click(x, y), act.seconds(0.4)]);
    const flies = await fireflies();
    // The firefly under the click is caught almost immediately.
    expect(
      flies.some((fly) => fly.state === "flashing" || fly.state === "done"),
    ).toBe(true);
    expect(await game.inspect("lit")).toBeGreaterThan(0);
    const end = await finishChain();
    expect(["won", "lost"]).toContain(end);
    won = end === "won";
    if (!won) await game.play([act.click(320, 200), act.step(1)]);
  }
  expect(won).toBe(true);
  const result = await game.play([act.step(1)], {
    inspect: ["lit", "bestNight"],
  });
  expect(result.inspect.lit).toBeGreaterThanOrEqual(3);
  expect(result.inspect.bestNight).toBe(1); // saved to storage
});

test("the next night brings more fireflies and a bigger goal", async () => {
  const result = await game.play([act.click(320, 200), act.step(1)], {
    inspect: ["state", "night", "fireflies.length", "NIGHTS[1].goal"],
  });
  expect(result.inspect).toEqual({
    state: "aiming",
    night: 1,
    "fireflies.length": 14,
    "NIGHTS[1].goal": 4,
  });
});

test("fireflies stay inside the sky while drifting", async () => {
  await game.play([act.seconds(8)]);
  for (const fly of await fireflies()) {
    expect(fly.x).toBeGreaterThan(0);
    expect(fly.x).toBeLessThan(640);
    expect(fly.y).toBeGreaterThan(20);
    expect(fly.y).toBeLessThan(345);
  }
});

test("best progress survives a restart", async () => {
  const restarted = await game.send({ command: "restart" });
  expect(restarted.ok).toBe(true);
  const result = await game.play([act.step(1)], {
    inspect: ["state", "bestNight"],
  });
  expect(result.inspect).toEqual({ state: "title", bestNight: 1 });
});
