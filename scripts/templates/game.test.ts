// Plays {{TITLE}} through the real jgz CLI. TODO: say what these tests
// cover, then add one test per rule of the game (see the other tests here).

import { afterAll, beforeAll, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { act, openGame, type JgzSession } from "../scripts/jgz-session";

const gameDir = fileURLToPath(new URL("../games/{{ID}}", import.meta.url));
let game: JgzSession;

beforeAll(async () => {
  game = await openGame(gameDir, { seed: "{{ID}}-test" });
});
afterAll(async () => {
  await game.close();
});

test("starts without errors", async () => {
  const result = await game.play([act.step(10)]);
  expect(result.status.diagnostics).toEqual([]);
});
