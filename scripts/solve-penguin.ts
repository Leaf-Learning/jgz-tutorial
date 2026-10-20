// Breadth-first solver for Penguin Slide levels. It follows the game's rules
// exactly, so the tests can prove every level is solvable and that each
// level's `par` is the fewest moves possible.
//
// Usage: bun scripts/solve-penguin.ts      (prints every level's solution)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type Level = { name: string; par: number; map: string[] };
export type Direction = "up" | "down" | "left" | "right";
export type Solution = { moves: number; path: Direction[] } | null;

const STEPS: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/** Reads the LEVELS array straight out of the finished game's main.js. */
export function levelsFromGame(): Level[] {
  const path = fileURLToPath(
    new URL("../games/penguin_slide/main.js", import.meta.url),
  );
  const source = readFileSync(path, "utf8");
  const match = source.match(/const LEVELS = (\[[\s\S]*?\n\]);/);
  if (!match)
    throw new Error("Could not find `const LEVELS = [...]` in main.js");
  return new Function(`return ${match[1]};`)();
}

/** Where a slide ends, which fish it passes, and whether it splashes. */
export function slideFrom(
  map: string[],
  col: number,
  row: number,
  dir: Direction,
): { col: number; row: number; passed: [number, number][]; splash: boolean } {
  const [dx, dy] = STEPS[dir];
  const passed: [number, number][] = [];
  let splash = false;
  while (map[row + dy][col + dx] !== "#") {
    col += dx;
    row += dy;
    passed.push([col, row]);
    const tile = map[row][col];
    if (tile === "O") {
      splash = true;
      break;
    }
    if (tile === "*") break;
  }
  return { col, row, passed, splash };
}

export function solve(map: string[]): Solution {
  let start: [number, number] | null = null;
  const fish: string[] = [];
  map.forEach((line, row) => {
    [...line].forEach((tile, col) => {
      if (tile === "P") start = [col, row];
      if (tile === "F") fish.push(`${col},${row}`);
    });
  });
  if (!start) throw new Error("level has no P");
  const all = (1 << fish.length) - 1;
  const key = (c: number, r: number, eaten: number) => `${c},${r},${eaten}`;
  const seen = new Set([key(start[0], start[1], 0)]);
  let frontier = [
    { col: start[0], row: start[1], eaten: 0, path: [] as Direction[] },
  ];
  while (frontier.length) {
    const next: typeof frontier = [];
    for (const state of frontier) {
      for (const dir of Object.keys(STEPS) as Direction[]) {
        const result = slideFrom(map, state.col, state.row, dir);
        if (result.splash || result.passed.length === 0) continue;
        let eaten = state.eaten;
        for (const [c, r] of result.passed) {
          const index = fish.indexOf(`${c},${r}`);
          if (index >= 0) eaten |= 1 << index;
        }
        const path = [...state.path, dir];
        if (eaten === all) return { moves: path.length, path };
        const k = key(result.col, result.row, eaten);
        if (seen.has(k)) continue;
        seen.add(k);
        next.push({ col: result.col, row: result.row, eaten, path });
      }
    }
    frontier = next;
  }
  return null;
}

if (import.meta.main) {
  levelsFromGame().forEach((level, index) => {
    const solution = solve(level.map);
    const size = `${level.map[0].length}×${level.map.length}`;
    console.log(
      `${String(index + 1).padStart(2)}. ${level.name.padEnd(18)} ${size.padEnd(6)} par ${level.par}  optimal ${solution ? solution.moves : "UNSOLVABLE"}  ${solution ? solution.path.join(" ") : ""}`,
    );
  });
}
