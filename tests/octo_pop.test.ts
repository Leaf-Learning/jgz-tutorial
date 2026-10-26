// Plays Octo Pop through the real jgz CLI: the title screen, typing a word to
// pop its bubble, typos, switching words mid-way, losing lives at the surface,
// retrying, winning a level, finishing the game and saving the best score.

import { afterAll, beforeAll, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { act, openGame, type JgzSession } from "../scripts/jgz-session";

const gameDir = fileURLToPath(new URL("../games/octo_pop", import.meta.url));
let game: JgzSession;

beforeAll(async () => {
  game = await openGame(gameDir, { seed: "octo-pop-test" });
});
afterAll(async () => {
  await game.close();
});

type Bubble = { word: string; x: number; y: number; popping: boolean };

// The inspector summarises an Actor with its own properties (x, y, image…)
// and keeps the ones the game added (word, popping…) under `properties`.
// Returns the bubbles still waiting to be popped, highest first.
async function floating(): Promise<Bubble[]> {
  const actors = await game.inspect("bubbles");
  return actors
    .map((actor: any) => ({
      word: actor.properties.word,
      x: actor.x,
      y: actor.y,
      popping: actor.properties.popping,
    }))
    .filter((bubble: Bubble) => !bubble.popping)
    .sort((a: Bubble, b: Bubble) => a.y - b.y);
}

// Types letters one frame apart, like quick fingers.
function letters(text: string) {
  return text.split("").flatMap((letter) => [act.tap(letter), act.step(1)]);
}

async function typeWord(word: string) {
  await game.play(letters(word));
}

async function backspace() {
  await game.play([act.tap("backspace"), act.step(1)]);
}

// Waits (in game time) until at least `count` bubbles are floating.
async function waitForBubbles(count: number): Promise<Bubble[]> {
  for (let i = 0; i < 40; i++) {
    const list = await floating();
    if (list.length >= count) return list;
    await game.play([act.seconds(0.5)]);
  }
  throw new Error(`no ${count} bubbles after 20 seconds`);
}

async function read(...paths: string[]) {
  const result = await game.play([act.step(1)], { inspect: paths });
  return result.inspect;
}

test("starts on the title screen with bubbles floating by", async () => {
  const result = await game.play([act.seconds(5)], {
    inspect: ["state", "level", "bubbles.length", "bestScore"],
  });
  expect(result.inspect.state).toBe("title");
  expect(result.inspect.level).toBe(0);
  expect(result.inspect["bubbles.length"]).toBeGreaterThanOrEqual(1);
  expect(result.inspect.bestScore).toBe(0);
  expect(result.status.diagnostics).toEqual([]);
});

test("typing on the title screen does nothing, Enter starts level 1", async () => {
  await typeWord("cat");
  expect(await read("state", "typed")).toEqual({ state: "title", typed: "" });
  const result = await game.play([act.tap("Enter"), act.step(2)], {
    inspect: ["state", "level", "lives", "popped", "score", "bubbles.length"],
  });
  expect(result.inspect).toEqual({
    state: "playing",
    level: 0,
    lives: 3,
    popped: 0,
    score: 0,
    "bubbles.length": 1, // the first bubble comes straight away
  });
});

test("the first letter of a word is kept, and Backspace takes a letter back", async () => {
  const [bubble] = await waitForBubbles(1);
  await game.play([act.tap(bubble.word[0]), act.step(1)]);
  expect((await read("typed")).typed).toBe(bubble.word[0]);
  await backspace();
  expect((await read("typed")).typed).toBe("");
  // Erasing with nothing typed is harmless.
  await backspace();
  expect((await read("typed")).typed).toBe("");
});

test("typing the whole word pops its bubble and scores its length plus the streak", async () => {
  const [bubble] = await waitForBubbles(1);
  await typeWord(bubble.word);
  const result = await game.play([act.step(1)], {
    inspect: ["typed", "popped", "score", "streak", "octopus.image"],
  });
  expect(result.inspect).toEqual({
    typed: "",
    popped: 1,
    score: bubble.word.length + 1,
    streak: 1,
    "octopus.image": "octopus_happy",
  });
  // The popped bubble swells and fades, then it is gone from the list.
  const popped = (await game.inspect("bubbles")).find(
    (actor: any) => actor.properties.word === bubble.word,
  );
  if (popped) expect(popped.properties.popping).toBe(true);
  await game.play([act.seconds(1)]);
  const left = await game.inspect("bubbles");
  expect(left.some((actor: any) => actor.properties.word === bubble.word)).toBe(
    false,
  );
  expect((await read("octopus.image"))["octopus.image"]).toBe("octopus_idle");
});

test("capital letters count, and keys that aren't letters are ignored", async () => {
  const [bubble] = await waitForBubbles(1);
  await game.play([
    act.down("shift"),
    act.tap(bubble.word[0]),
    act.up("shift"),
    act.step(1),
    act.tap("Space"),
    act.step(1),
    act.tap("ArrowLeft"),
    act.step(1),
    act.tap("1"),
    act.step(1),
  ]);
  expect((await read("typed")).typed).toBe(bubble.word[0]);
  await backspace();
});

test("a letter no bubble starts with is a typo: typing is cleared, the streak is lost, Octo says ouch", async () => {
  const list = await waitForBubbles(1);
  const starts = list.map((bubble) => bubble.word[0]);
  const wrong = "qxzjk".split("").find((letter) => !starts.includes(letter))!;
  const before = await read("streak", "score");
  expect(before.streak).toBeGreaterThan(0);
  await game.play([act.tap(wrong), act.step(1)]);
  const result = await read("typed", "streak", "score", "octopus.image");
  expect(result).toEqual({
    typed: "",
    streak: 0,
    score: before.score,
    "octopus.image": "octopus_ouch",
  });
  // And a typo half-way through a word clears what you had typed too.
  const [bubble] = await waitForBubbles(1);
  await game.play([act.tap(bubble.word[0]), act.step(1)]);
  const others = (await floating()).map((b) => b.word[0]);
  const wrongAgain = "qxzjk".split("").find((l) => !others.includes(l))!;
  await game.play([act.tap(wrongAgain), act.step(1)]);
  expect((await read("typed")).typed).toBe("");
});

test("a letter that starts a different word switches to that word", async () => {
  let pair: [Bubble, Bubble] | null = null;
  for (let i = 0; i < 60 && !pair; i++) {
    const list = await waitForBubbles(2);
    for (const a of list)
      for (const b of list)
        if (!pair && a.word[0] !== b.word[0] && a.word.length > 2)
          pair = [a, b];
    if (!pair) await game.play([act.seconds(0.5)]);
  }
  expect(pair).not.toBeNull();
  const [first, second] = pair!;
  const streak = (await read("streak")).streak;
  await game.play(letters(first.word.slice(0, 2)));
  expect((await read("typed")).typed).toBe(first.word.slice(0, 2));
  await game.play([act.tap(second.word[0]), act.step(1)]);
  const result = await read("typed", "streak");
  expect(result.typed).toBe(second.word[0]);
  expect(result.streak).toBe(streak); // switching isn't a mistake
  await backspace();
});

test("the same word never floats twice at the same time", async () => {
  for (let i = 0; i < 12; i++) {
    const words = (await floating()).map((bubble) => bubble.word);
    expect(new Set(words).size).toBe(words.length);
    await game.play([act.seconds(1.3)]);
  }
});

test("every level's words are plain lowercase letters, and no word starts another", async () => {
  const count = (await game.inspect("LEVELS.length")) as number;
  expect(count).toBe(5);
  for (let i = 0; i < count; i++) {
    const text = (await game.inspect(`LEVELS[${i}].words`)) as string;
    const words = text.split(" ");
    expect(words.length).toBeGreaterThanOrEqual(5);
    for (const word of words) {
      expect(word).toMatch(/^[a-z]{3,8}$/);
      for (const other of words)
        if (other !== word) expect(other.startsWith(word)).toBe(false);
    }
  }
});

test("bubbles that reach the surface cost lives, and three lost bubbles lose the level", async () => {
  // Stop typing and let the bubbles float away.
  let lives = 3;
  let state = "playing";
  for (let i = 0; i < 60 && state === "playing"; i++) {
    const result = await game.play([act.seconds(1)], {
      inspect: ["state", "lives"],
    });
    expect(result.inspect.lives).toBeLessThanOrEqual(lives); // never goes up
    lives = result.inspect.lives;
    state = result.inspect.state;
  }
  expect(state).toBe("lost");
  const result = await read("lives", "streak", "typed", "octopus.image");
  expect(result.lives).toBe(0);
  expect(result.streak).toBe(0);
  expect(result.typed).toBe("");
});

test("a lost level can't be typed on, and Enter tries the same level again", async () => {
  await game.play([act.tap("a"), act.step(1)]);
  expect((await read("typed")).typed).toBe("");
  const result = await game.play([act.tap("Enter"), act.step(2)], {
    inspect: ["state", "level", "lives", "popped", "score", "streak"],
  });
  // The score goes back to what it was when the level began: 0.
  expect(result.inspect).toEqual({
    state: "playing",
    level: 0,
    lives: 3,
    popped: 0,
    score: 0,
    streak: 0,
  });
});

test("popping enough bubbles wins the level, and Enter starts the next one", async () => {
  const goal = (await game.inspect("LEVELS[0].goal")) as number;
  for (let i = 0; i < 400; i++) {
    const [bubble] = await floating();
    if (bubble) await typeWord(bubble.word);
    else await game.play([act.seconds(0.3)]);
    if ((await game.inspect("state")) !== "playing") break;
  }
  const won = await read("state", "popped", "lives", "typed");
  expect(won.state).toBe("won");
  expect(won.popped).toBe(goal);
  expect(won.lives).toBe(3);
  // The score is the word lengths plus the streak bonus (1 + 2 + … + goal).
  expect((await read("score")).score).toBeGreaterThan(goal * 3);

  const next = await game.play([act.tap("Enter"), act.step(2)], {
    inspect: [
      "state",
      "level",
      "popped",
      "lives",
      "bubbles.length",
      "levelScore",
    ],
  });
  expect(next.inspect.state).toBe("playing");
  expect(next.inspect.level).toBe(1);
  expect(next.inspect.popped).toBe(0);
  expect(next.inspect.lives).toBe(3);
  expect(next.inspect["bubbles.length"]).toBe(1);
  expect(next.inspect.levelScore).toBeGreaterThan(0);
  // Level 2 uses its own words.
  const level2 = ((await game.inspect("LEVELS[1].words")) as string).split(" ");
  const [bubble] = await waitForBubbles(1);
  expect(level2).toContain(bubble.word);
});

test("a click moves on from the end screens too", async () => {
  await game.call("loseLevel");
  const lost = await read("state", "score", "bestScore");
  expect(lost.state).toBe("lost");
  // Even a lost level saves a record score.
  expect(lost.score).toBeGreaterThan(0);
  expect(lost.bestScore).toBe(lost.score);
  const result = await game.play([act.click(360, 240), act.step(2)], {
    inspect: ["state", "level"],
  });
  expect(result.inspect).toEqual({ state: "playing", level: 1 });
});

test("clearing the last level finishes the game and saves the best score", async () => {
  // Skip ahead with winLevel: each clear shows "won", and Enter moves on.
  while ((await read("level")).level < 4) {
    await game.call("winLevel");
    expect((await read("state")).state).toBe("won");
    await game.play([act.tap("Enter"), act.step(2)]);
  }
  expect((await read("level")).level).toBe(4);
  await game.call("winLevel");
  const result = await read("state", "score", "bestScore");
  expect(result.state).toBe("finished");
  expect(result.score).toBeGreaterThan(0);
  expect(result.bestScore).toBe(result.score); // saved to storage
  // Enter starts the whole game again from level 1, with the score back at 0.
  const again = await game.play([act.tap("Enter"), act.step(2)], {
    inspect: ["state", "level", "score", "bestScore"],
  });
  expect(again.inspect.state).toBe("playing");
  expect(again.inspect.level).toBe(0);
  expect(again.inspect.score).toBe(0);
  expect(again.inspect.bestScore).toBe(result.bestScore);
});

test("the best score survives a restart", async () => {
  const best = (await game.inspect("bestScore")) as number;
  expect(best).toBeGreaterThan(0);
  const restarted = await game.send({ command: "restart" });
  expect(restarted.ok).toBe(true);
  const result = await game.play([act.step(1)], {
    inspect: ["state", "bestScore"],
  });
  expect(result.inspect).toEqual({ state: "title", bestScore: best });
});
