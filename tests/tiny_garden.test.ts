// Plays Tiny Garden through the real jgz CLI: title → empty garden, plant a
// seed (thirsty), water it (it only grows while wet), pick the bloom, sell it,
// can't afford a rarer seed, earn the coins, buy it and see that it needs
// more watering, then check the garden is saved and that a patient gardener
// really can unlock every flower.

import { afterAll, beforeAll, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { act, openGame, type JgzSession } from "../scripts/jgz-session";

const gameDir = fileURLToPath(new URL("../games/tiny_garden", import.meta.url));
let game: JgzSession;

beforeAll(async () => {
  game = await openGame(gameDir, { seed: "garden-test" });
});
afterAll(async () => {
  await game.close();
});

const SLOW = 120_000;

// Where things are on screen (the same numbers as main.js).
const plotAt = (index: number): [number, number] => [
  20 + (index % 4) * 108 + 48,
  128 + Math.floor(index / 4) * 90 + 45,
];
const slotAt = (index: number): [number, number] => [
  19 + index * 122 + 57,
  320 + 38,
];
const STALL: [number, number] = [548, 270];

const plantState = (index: number) => `plots[${index}].state`;

/** Clicks plots 0..count-1, then waits a moment so the clicks land. */
async function clickPlots(count: number) {
  for (let i = 0; i < count; i++) {
    await game.play([act.click(...plotAt(i)), act.step(1)]);
  }
}

test("starts on the title screen with a garden and a shelf", async () => {
  const result = await game.play([act.step(10)], {
    inspect: ["state", "plots.length", "slots.length", "coins", "owned"],
  });
  expect(result.inspect).toEqual({
    state: "title",
    "plots.length": 8,
    "slots.length": 5,
    coins: 0,
    owned: [true, false, false, false, false],
  });
  expect(result.status.diagnostics).toEqual([]);
});

test("clicking the title starts the game, and the garden is empty", async () => {
  const result = await game.play([act.click(320, 200), act.step(2)], {
    inspect: ["state", plantState(0), "basket.length"],
  });
  expect(result.inspect).toEqual({
    state: "playing",
    [plantState(0)]: "empty",
    "basket.length": 0,
  });
});

test("clicking an empty plot plants the chosen seed, thirsty", async () => {
  const result = await game.play([act.click(...plotAt(0)), act.step(2)], {
    inspect: [plantState(0), "plots[0].seed", "plots[0].wet", "selected"],
  });
  expect(result.inspect).toEqual({
    [plantState(0)]: "growing",
    "plots[0].seed": 0,
    "plots[0].wet": 0,
    selected: 0,
  });
});

test("a thirsty plant doesn't grow", async () => {
  const result = await game.play([act.seconds(3)], {
    inspect: ["plots[0].growth", plantState(0)],
  });
  expect(result.inspect["plots[0].growth"]).toBe(0);
  expect(result.inspect[plantState(0)]).toBe("growing");
});

test("watering makes the plant grow, and darkens its soil", async () => {
  const result = await game.play(
    [act.click(...plotAt(0)), act.seconds(1), act.step(1)],
    {
      inspect: ["plots[0].wet", "plots[0].growth", "plots[0].image"],
    },
  );
  const wet = result.inspect["plots[0].wet"];
  const growth = result.inspect["plots[0].growth"];
  expect(wet).toBeGreaterThan(3.5);
  expect(wet).toBeLessThan(4.1);
  expect(growth).toBeGreaterThan(0.9);
  expect(growth).toBeLessThan(1.1);
  expect(result.inspect["plots[0].image"]).toBe("soil_wet");
});

test("a watered daisy blooms after four seconds of growing", async () => {
  const early = await game.play([act.seconds(1.5)], {
    inspect: [plantState(0)],
  });
  expect(early.inspect[plantState(0)]).toBe("growing");
  const late = await game.play([act.seconds(2)], {
    inspect: [plantState(0), "plots[0].growth"],
  });
  expect(late.inspect[plantState(0)]).toBe("ready");
  expect(late.inspect["plots[0].growth"]).toBeGreaterThanOrEqual(4);
});

test("clicking a bloom picks it into the basket", async () => {
  const result = await game.play([act.click(...plotAt(0)), act.step(2)], {
    inspect: [plantState(0), "basket", "coins"],
  });
  expect(result.inspect).toEqual({
    [plantState(0)]: "empty",
    basket: [0],
    coins: 0,
  });
});

test("selling the basket pays the flower's price", async () => {
  const result = await game.play([act.click(...STALL), act.step(2)], {
    inspect: ["coins", "basket.length", "message"],
  });
  expect(result.inspect.coins).toBe(3);
  expect(result.inspect["basket.length"]).toBe(0);
  expect(result.inspect.message).toContain("3 coins");
});

test("selling an empty basket just gives a hint", async () => {
  const result = await game.play([act.click(...STALL), act.step(2)], {
    inspect: ["coins", "message"],
  });
  expect(result.inspect.coins).toBe(3);
  expect(result.inspect.message).toContain("Pick some flowers");
});

test("a rarer seed you can't afford stays locked", async () => {
  const result = await game.play([act.click(...slotAt(1)), act.step(2)], {
    inspect: ["coins", "owned", "selected", "message"],
  });
  expect(result.inspect.coins).toBe(3);
  expect(result.inspect.owned).toEqual([true, false, false, false, false]);
  expect(result.inspect.selected).toBe(0);
  expect(result.inspect.message).toContain("25 coins");
});

/** Plants, waters, grows, picks and sells a daisy in every plot we can. */
async function daisyRound(count: number) {
  await clickPlots(count); // plant
  await clickPlots(count); // water
  await game.play([act.seconds(4.3)]);
  await clickPlots(count); // pick
  await game.play([act.click(...STALL), act.step(2)]);
}

test("selling more daisies earns the coins for tulip seeds, which unlock", async () => {
  await daisyRound(8); // 8 × 3 = 24 more coins
  expect(await game.inspect("coins")).toBe(27);
  const result = await game.play([act.click(...slotAt(1)), act.step(2)], {
    inspect: ["coins", "owned", "selected", "message"],
  });
  expect(result.inspect.coins).toBe(2);
  expect(result.inspect.owned).toEqual([true, true, false, false, false]);
  expect(result.inspect.selected).toBe(1);
  expect(result.inspect.message).toContain("Tulip");
});

test("choosing an unlocked seed switches which flower gets planted", async () => {
  await game.play([act.click(...slotAt(0)), act.step(1)]);
  expect(await game.inspect("selected")).toBe(0);
  await game.play([act.click(...slotAt(1)), act.step(1)]);
  expect(await game.inspect("selected")).toBe(1);
});

test("a tulip needs more than one watering", async () => {
  await game.play([act.click(...plotAt(0)), act.step(1)]); // plant a tulip
  expect(await game.inspect("plots[0].seed")).toBe(1);
  await game.play([act.click(...plotAt(0)), act.seconds(5.5)]); // water, wait
  let result = await game.play([act.seconds(2)], {
    inspect: [plantState(0), "plots[0].growth", "plots[0].wet"],
  });
  // The water ran out after 5 seconds: still growing, but stuck and thirsty.
  expect(result.inspect[plantState(0)]).toBe("growing");
  expect(result.inspect["plots[0].growth"]).toBeGreaterThan(4.9);
  expect(result.inspect["plots[0].growth"]).toBeLessThan(5.2);
  expect(result.inspect["plots[0].wet"]).toBeLessThanOrEqual(0);
  // Water it again and it can finish.
  result = await game.play([act.click(...plotAt(0)), act.seconds(2.5)], {
    inspect: [plantState(0)],
  });
  expect(result.inspect[plantState(0)]).toBe("ready");
  await game.play([act.click(...plotAt(0)), act.click(...STALL), act.step(2)]);
  expect(await game.inspect("coins")).toBe(9); // 2 + a tulip's 7
});

test("the garden is saved, and comes back after a restart", async () => {
  // Plant and water a daisy, so there's something growing to remember.
  await game.play([act.click(...slotAt(0)), act.step(1)]);
  await game.play([act.click(...plotAt(3)), act.step(1)]);
  await game.play([act.click(...plotAt(3)), act.seconds(1.5)]);
  await game.play([act.click(...slotAt(1)), act.step(1)]); // saves, too
  const before = await game.play([act.step(1)], {
    inspect: ["coins", "owned", "plots[3].growth"],
  });
  expect(before.inspect["plots[3].growth"]).toBeGreaterThan(1);
  const after = await game.play([act.step(1)], {
    restart: true,
    inspect: [
      "state",
      "hasSaved",
      "coins",
      "owned",
      "plots[3].state",
      "plots[3].growth",
    ],
  });
  expect(after.inspect.state).toBe("title");
  expect(after.inspect.hasSaved).toBe(true);
  expect(after.inspect.coins).toBe(before.inspect.coins);
  expect(after.inspect.owned).toEqual(before.inspect.owned);
  expect(after.inspect["plots[3].state"]).toBe("growing");
  expect(after.inspect["plots[3].growth"]).toBeGreaterThan(1);
});

// A patient gardener who plants, waters, picks and sells (about 1.7 clicks a
// second) must be able to buy every flower. This proves the game can't get
// stuck, and keeps the prices in the pacing the page promises.
test(
  "a patient gardener can unlock every flower",
  async () => {
    const SEED_COSTS = [0, 25, 100, 300, 800];
    const player = await openGame(gameDir, { seed: "patient" });
    try {
      await player.play([act.step(3), act.click(320, 200), act.step(1)]);
      const readPlots = Array.from({ length: 8 }, (_, i) => plantState(i));
      const readWet = Array.from({ length: 8 }, (_, i) => `plots[${i}].wet`);
      let seconds = 0;
      while (seconds < 600) {
        const now = (
          await player.play([act.step(1)], {
            inspect: [
              "coins",
              "basket.length",
              "selected",
              "owned",
              ...readPlots,
            ],
          })
        ).inspect;
        const wet = (await player.play([act.step(1)], { inspect: readWet }))
          .inspect;
        if (now.owned.every(Boolean)) break;
        const states = readPlots.map((path) => now[path]);
        const next = now.owned.indexOf(false);
        let target: [number, number] | null = null;
        if (now.coins >= SEED_COSTS[next]) target = slotAt(next);
        const ready = states.indexOf("ready");
        const thirsty = states.findIndex(
          (s, i) => s === "growing" && wet[`plots[${i}].wet`] <= 0.3,
        );
        const empty = states.indexOf("empty");
        const best = now.owned.lastIndexOf(true);
        if (!target) {
          if (ready >= 0) target = plotAt(ready);
          else if (
            now["basket.length"] >= 6 ||
            (now["basket.length"] > 0 && thirsty < 0 && empty < 0)
          )
            target = STALL;
          else if (thirsty >= 0) target = plotAt(thirsty);
          else if (empty >= 0)
            target = now.selected !== best ? slotAt(best) : plotAt(empty);
        }
        if (target) await player.play([act.click(...target)]);
        await player.play([act.seconds(0.6)]);
        seconds += 0.6;
      }
      const done = await player.play([act.step(1)], {
        inspect: ["owned", "message"],
      });
      expect(done.inspect.owned).toEqual([true, true, true, true, true]);
      expect(done.inspect.message).toContain("complete");
      // It should take a few minutes of play, not a few seconds...
      expect(seconds).toBeGreaterThan(150);
      // ...and not forever.
      expect(seconds).toBeLessThan(420);
    } finally {
      await player.close();
    }
  },
  SLOW * 4,
);
