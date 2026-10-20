// Penguin Slide: drives the real game through the jgz CLI, and proves every
// level is solvable with `par` as the fewest possible moves.

import { afterEach, describe, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { act, openGame, type JgzSession } from "../scripts/jgz-session";
import { levelsFromGame, solve } from "../scripts/solve-penguin";

const GAME = fileURLToPath(new URL("../games/penguin_slide", import.meta.url));
const LEVELS = levelsFromGame();
const TIMEOUT = 90_000;

let session: JgzSession | null = null;
afterEach(async () => {
  await session?.close();
  session = null;
});

async function start(): Promise<JgzSession> {
  session = await openGame(GAME, { seed: "penguin-tests" });
  return session;
}

async function read(s: JgzSession, paths: string[]) {
  return (await s.play([act.step(1)], { inspect: paths })).inspect;
}

/** Asks the game itself, through its own fishLeft() function. */
async function fishLeft(s: JgzSession): Promise<number> {
  const response = await s.send({ command: "call", binding: "fishLeft" });
  return response.result;
}

/** Slides one way and waits long enough for any slide to finish. */
async function move(s: JgzSession, key: string) {
  await s.play([act.tap(key), act.seconds(1)]);
}

/** From the title screen, plays the solver's solution to every level before `index`. */
async function reachLevel(s: JgzSession, index: number) {
  await s.play([act.tap("space"), act.step(2)]);
  for (let i = 0; i < index; i++) {
    for (const dir of solve(LEVELS[i].map)!.path) await move(s, dir);
    await s.play([act.tap("space"), act.step(2)]);
  }
}

describe("levels", () => {
  test("every level is solvable and its par is the fewest moves", () => {
    expect(LEVELS.length).toBe(8);
    for (const level of LEVELS) {
      const solution = solve(level.map);
      expect(solution).not.toBeNull();
      expect(solution!.moves).toBe(level.par);
    }
  });

  test("every level is walled in by rock and has one penguin", () => {
    for (const level of LEVELS) {
      const rows = level.map;
      expect(rows[0]).toMatch(/^#+$/);
      expect(rows[rows.length - 1]).toMatch(/^#+$/);
      for (const row of rows) {
        expect(row.length).toBe(rows[0].length);
        expect(row[0]).toBe("#");
        expect(row[row.length - 1]).toBe("#");
      }
      expect(rows.join("").split("P").length - 1).toBe(1);
      expect(rows.length * 48 + 48).toBeLessThanOrEqual(480);
      expect(rows[0].length * 48).toBeLessThanOrEqual(720);
    }
  });
});

describe("playing", () => {
  test(
    "title screen starts level 1, and a slide to the fish wins it",
    async () => {
      const s = await start();
      expect((await read(s, ["state"])).state).toBe("title");
      await s.play([act.tap("space"), act.step(2)]);
      expect(await read(s, ["state", "levelIndex"])).toEqual({
        state: "playing",
        levelIndex: 0,
      });
      await move(s, "right");
      const after = await read(s, ["state", "moves", "penguin.col"]);
      expect(after).toEqual({ state: "won", moves: 1, "penguin.col": 10 });
    },
    TIMEOUT,
  );

  test(
    "a slide stops next to a rock, and bumping a wall is not a move",
    async () => {
      const s = await start();
      await reachLevel(s, 1); // Rock Stop
      await move(s, "right");
      expect(await read(s, ["penguin.col", "penguin.row", "moves"])).toEqual({
        "penguin.col": 6, // the rock is at column 7
        "penguin.row": 1,
        moves: 1,
      });
      await move(s, "up"); // already against the top wall
      expect((await read(s, ["moves"])).moves).toBe(1);
    },
    TIMEOUT,
  );

  test(
    "snow stops the penguin on top of it",
    async () => {
      const s = await start();
      await reachLevel(s, 2); // Snow Day
      await move(s, "down");
      expect(await read(s, ["penguin.col", "penguin.row"])).toEqual({
        "penguin.col": 5,
        "penguin.row": 4, // the snow patch, not the bottom wall
      });
    },
    TIMEOUT,
  );

  test(
    "sliding into a hole splashes and restarts the level",
    async () => {
      const s = await start();
      await reachLevel(s, 3); // Mind the Hole
      await s.play([act.tap("right"), act.seconds(0.6)]);
      expect((await read(s, ["state"])).state).toBe("splash");
      await s.play([act.tap("left"), act.seconds(1.2)]); // input is ignored
      expect(
        await read(s, ["state", "moves", "penguin.col", "penguin.row"]),
      ).toEqual({
        state: "playing",
        moves: 0,
        "penguin.col": 1,
        "penguin.row": 1,
      });
    },
    TIMEOUT,
  );

  test(
    "eating every fish clears a level and space moves on",
    async () => {
      const s = await start();
      await reachLevel(s, 4); // Fish Trio
      for (const dir of solve(LEVELS[4].map)!.path) await move(s, dir);
      expect((await read(s, ["state"])).state).toBe("won");
      await s.play([act.tap("space"), act.step(2)]);
      expect(await read(s, ["state", "levelIndex", "moves"])).toEqual({
        state: "playing",
        levelIndex: 5,
        moves: 0,
      });
    },
    TIMEOUT,
  );

  test(
    "undo puts back the penguin, the fish and the move count; R restarts",
    async () => {
      const s = await start();
      await reachLevel(s, 4); // Fish Trio: down, left, down eats a fish
      await move(s, "down");
      await move(s, "left");
      await move(s, "down");
      expect((await read(s, ["moves"])).moves).toBe(3);
      expect(await fishLeft(s)).toBe(2);

      await s.play([act.tap("z"), act.step(2)]);
      const undone = await read(s, ["moves", "penguin.col", "penguin.row"]);
      expect(undone.moves).toBe(2);
      expect(await fishLeft(s)).toBe(3);
      expect([undone["penguin.col"], undone["penguin.row"]]).toEqual([1, 4]);

      await move(s, "left");
      await s.play([act.tap("r"), act.step(2)]);
      expect(await read(s, ["moves", "penguin.col", "penguin.row"])).toEqual({
        moves: 0,
        "penguin.col": 9,
        "penguin.row": 1,
      });
    },
    TIMEOUT,
  );

  test(
    "a mouse or finger swipe slides the penguin",
    async () => {
      const s = await start();
      await s.play([act.click(360, 240), act.step(2)]); // tap starts the game
      await s.play([
        act.press(200, 300),
        act.step(2),
        act.move(300, 310),
        act.step(2),
        act.release(400, 312),
        act.seconds(1),
      ]);
      expect(await read(s, ["state", "moves"])).toEqual({
        state: "won",
        moves: 1,
      });
    },
    TIMEOUT,
  );

  test(
    "progress is saved and the title screen continues from it",
    async () => {
      const s = await start();
      await reachLevel(s, 2);
      const saved = await read(s, ["unlocked", "best"]);
      expect(saved).toEqual({ unlocked: 2, best: { "0": 1, "1": 2 } });
      // Storage survives a reload within the session, like reopening the page.
      const restarted = await s.send({ command: "restart" });
      expect(restarted.ok).toBe(true);
      expect(await read(s, ["state", "unlocked", "chosen"])).toEqual({
        state: "title",
        unlocked: 2,
        chosen: 2,
      });
    },
    TIMEOUT,
  );

  test(
    "beating the last level shows the ending",
    async () => {
      const s = await start();
      await reachLevel(s, 7);
      for (const dir of solve(LEVELS[7].map)!.path) await move(s, dir);
      await s.play([act.tap("space"), act.step(2)]);
      const end = await s.play([act.step(1)], { inspect: ["state"] });
      expect(end.inspect.state).toBe("finished");
      expect(end.status.pageErrors).toEqual([]);
      expect(end.status.diagnostics).toEqual([]);
    },
    TIMEOUT,
  );
});
