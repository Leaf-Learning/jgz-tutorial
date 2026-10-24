// Proves every challenge on a tutorial page can be solved, using the model
// solutions in tests/challenges/<game>.js. For each challenge it:
//
//   1. runs the cell's own step code and checks the challenge does NOT pass
//      yet (a check that passes on untouched code is too easy to notice),
//   2. applies the solution's code edits and runs the game,
//   3. plays the game if the solution says how (clicks, keys, drags),
//   4. waits for the challenge to tick itself off.
//
// It also fails when a challenge on the page has no solution, or a solution
// names a challenge that isn't on the page.
//
// Usage: bun scripts/check-challenges.ts [game ...]

import { chromium, type Page } from "playwright";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/** One model solution, as written in tests/challenges/<game>.js. */
export type Solution = {
  /** The challenge's data-id. */
  id: string;
  /**
   * Changes to the step's code: [find, replace] pairs applied in order (each
   * `find` must be in the code), or a function from old code to new code.
   * Leave out for challenges solved just by playing.
   */
  edit?: [string | RegExp, string][] | ((code: string) => string);
  /** Plays the running game after the edit, if the challenge needs it. */
  play?: (game: GameDriver) => Promise<void>;
  /** How long to wait for the challenge to pass, in ms (default 3000). */
  timeout?: number;
};

/** Drives one cell's running game. Positions are in game pixels. */
export type GameDriver = {
  click(x: number, y: number): Promise<void>;
  press(x: number, y: number): Promise<void>;
  move(x: number, y: number, steps?: number): Promise<void>;
  release(): Promise<void>;
  drag(from: [number, number], to: [number, number]): Promise<void>;
  /** Presses a key with the game focused ("ArrowRight", "Space", "z"…). */
  key(name: string): Promise<void>;
  wait(ms: number): Promise<void>;
  /**
   * A live value from the game, e.g. read("score") or read("fish[0].x"),
   * copied out as plain data (Actors keep x, y, image and their own fields).
   */
  read(path: string): Promise<any>;
  /** Runs fn(view, arg) inside the page, with the cell's challenge view. */
  evaluate<T, A = undefined>(fn: (view: any, arg: A) => T, arg?: A): Promise<T>;
  /** What the last frame drew (see js-game-zero's $drawn). */
  drawn(): Promise<any[]>;
  page: Page;
};

const root = fileURLToPath(new URL("..", import.meta.url));
const solutionsDir = join(root, "tests/challenges");
const requested = process.argv.slice(2);
const games = requested.length
  ? requested
  : (await readdir(solutionsDir))
      .filter((file) => file.endsWith(".js"))
      .map((file) => file.replace(/\.js$/, ""))
      .sort();

const browser = await chromium.launch();
let failures = 0;

for (const game of games) {
  const infoFile = join(root, "games", game, "tutorial.json");
  const solutionFile = join(solutionsDir, `${game}.js`);
  if (!existsSync(infoFile) || !existsSync(solutionFile)) {
    console.log(
      `✗ ${game}: needs games/${game}/tutorial.json and tests/challenges/${game}.js`,
    );
    failures++;
    continue;
  }
  const info = JSON.parse(await readFile(infoFile, "utf8"));
  const solutions: Solution[] = (await import(pathToFileURL(solutionFile).href))
    .default;

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(pathToFileURL(join(root, "tutorials", info.page)).href);
  await page.waitForTimeout(500);

  console.log(`\n${info.page}`);
  const onPage: string[] = await page.evaluate(() =>
    (window as any).JGZT.challenges.map((c: any) => c.id),
  );
  const solved = new Set(solutions.map((solution) => solution.id));
  const problems: string[] = [];
  for (const id of onPage)
    if (!solved.has(id))
      problems.push(`${id}: no solution in tests/challenges/${game}.js`);
  for (const id of solved)
    if (!onPage.includes(id))
      problems.push(`${id}: not a challenge on the page`);
  for (const problem of problems) console.log(`  ✗ ${problem}`);
  failures += problems.length;

  for (const solution of solutions) {
    if (!onPage.includes(solution.id)) continue;
    const result = await solve(page, solution);
    console.log(
      result === true ? `  ✓ ${solution.id}` : `  ✗ ${solution.id}: ${result}`,
    );
    if (result !== true) failures++;
  }
  if (pageErrors.length) {
    console.log(`  ✗ page errors: ${pageErrors.join(" | ")}`);
    failures++;
  }
  await context.close();
}

await browser.close();
process.exit(failures ? 1 : 0);

/** Returns true, or a reason the solution didn't pass. */
async function solve(page: Page, solution: Solution): Promise<true | string> {
  const { id } = solution;
  const cellId: string | null = await page.evaluate((id) => {
    const challenge = (window as any).JGZT.challenges.find(
      (c: any) => c.id === id,
    );
    return challenge?.cell?.id ?? null;
  }, id);
  if (!cellId) return "the challenge isn't attached to a code cell";

  // Cells pause while scrolled out of view, so bring this one on screen.
  await page.evaluate((cellId) => {
    (window as any).JGZT.cell(cellId).root.scrollIntoView({
      block: "center",
      behavior: "instant",
    });
  }, cellId);
  await page.waitForTimeout(300);

  const original: string = await page.evaluate((cellId) => {
    const cell = (window as any).JGZT.cell(cellId);
    cell.setCode(cell.original);
    return cell.original;
  }, cellId);
  await page.waitForTimeout(1200);
  if (await isDone(page, id))
    return "already passes before any change — the check is too easy";

  let code = original;
  try {
    code = applyEdit(original, solution.edit);
  } catch (error) {
    return String((error as Error).message);
  }
  await page.evaluate(
    ({ cellId, code }) => (window as any).JGZT.cell(cellId).setCode(code),
    { cellId, code },
  );
  await page.waitForTimeout(500);
  const error = await cellError(page, cellId);
  if (error) return `the solution's code has an error: ${error}`;

  if (solution.play) {
    try {
      await solution.play(driver(page, cellId));
    } catch (error) {
      return `play() failed: ${(error as Error).message}`;
    }
  }

  const deadline = Date.now() + (solution.timeout ?? 3000);
  while (Date.now() < deadline) {
    if (await isDone(page, id)) return true;
    await page.waitForTimeout(150);
  }
  const status = await page
    .locator(`.challenge[data-id="${id}"] .challenge-status`)
    .innerText();
  return (
    (await cellError(page, cellId)) ||
    `didn't pass (status: "${status.trim()}")`
  );
}

function applyEdit(code: string, edit: Solution["edit"]): string {
  if (!edit) return code;
  if (typeof edit === "function") return edit(code);
  for (const [find, replace] of edit) {
    const found =
      typeof find === "string"
        ? code.includes(find)
        : new RegExp(find.source, find.flags.replace("g", "")).test(code);
    if (!found)
      throw new Error(
        `edit didn't match the step's code: ${String(find).slice(0, 60)}`,
      );
    code = code.replace(find, replace);
  }
  return code;
}

function isDone(page: Page, id: string): Promise<boolean> {
  return page
    .locator(`.challenge[data-id="${id}"]`)
    .evaluate((node) => node.classList.contains("is-done"));
}

async function cellError(page: Page, cellId: string): Promise<string> {
  return page.evaluate(
    (cellId) =>
      (window as any).JGZT.cell(cellId).root.querySelector(".msg-error")
        ?.innerText ?? "",
    cellId,
  );
}

function driver(page: Page, cellId: string): GameDriver {
  // Game pixels → page pixels, from the canvas's place on the page.
  async function at(x: number, y: number): Promise<[number, number]> {
    const box = await page.evaluate((cellId) => {
      const cell = (window as any).JGZT.cell(cellId);
      const canvas = cell.root.querySelector(".stage canvas");
      const rect = canvas.getBoundingClientRect();
      const view = cell.view();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        gameWidth: view.read("WIDTH") || rect.width,
        gameHeight: view.read("HEIGHT") || rect.height,
      };
    }, cellId);
    return [
      box.left + (x / box.gameWidth) * box.width,
      box.top + (y / box.gameHeight) * box.height,
    ];
  }
  const read = (path: string) =>
    page.evaluate(
      ({ cellId, path }) => {
        // Copy to plain data, keeping getters like an Actor's x and y.
        const plain = (value: any, depth: number): any => {
          if (value === null || typeof value !== "object")
            return typeof value === "function" ? undefined : value;
          if (depth > 4) return undefined;
          if (Array.isArray(value))
            return value.map((item) => plain(item, depth + 1));
          const out: Record<string, any> = {};
          for (
            let proto = value;
            proto && proto !== Object.prototype;
            proto = Object.getPrototypeOf(proto)
          ) {
            for (const [key, desc] of Object.entries(
              Object.getOwnPropertyDescriptors(proto),
            )) {
              if (key in out || key.startsWith("_") || key === "constructor")
                continue;
              if (proto !== value && !desc.get) continue;
              try {
                const item = plain(value[key], depth + 1);
                if (item !== undefined) out[key] = item;
              } catch {
                /* skip values that throw */
              }
            }
          }
          return out;
        };
        return plain((window as any).JGZT.cell(cellId).view().read(path), 0);
      },
      { cellId, path },
    );
  return {
    page,
    async click(x, y) {
      const [px, py] = await at(x, y);
      await page.mouse.click(px, py);
    },
    async press(x, y) {
      const [px, py] = await at(x, y);
      await page.mouse.move(px, py);
      await page.mouse.down();
    },
    async move(x, y, steps = 6) {
      const [px, py] = await at(x, y);
      await page.mouse.move(px, py, { steps });
    },
    async release() {
      await page.mouse.up();
    },
    async drag(from, to) {
      await this.press(from[0], from[1]);
      await page.waitForTimeout(100);
      await this.move(to[0], to[1], 8);
      await page.waitForTimeout(200);
      await page.mouse.up();
    },
    async key(name) {
      await page.evaluate(
        (cellId) => (window as any).JGZT.cell(cellId).stage.focus(),
        cellId,
      );
      await page.keyboard.press(name);
    },
    wait: (ms) => page.waitForTimeout(ms),
    read,
    drawn: async () => (await read("$drawn")) || [],
    evaluate: (fn, arg) =>
      page.evaluate(
        ({ cellId, source, arg }) =>
          (0, eval)(`(${source})`)(
            (window as any).JGZT.cell(cellId).view(),
            arg,
          ),
        { cellId, source: fn.toString(), arg },
      ),
  };
}
