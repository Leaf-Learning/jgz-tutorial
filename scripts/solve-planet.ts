// Checks that every Planet Putt hole can be finished within par, using the
// game's OWN physics: the finished main.js runs in Chromium through the
// script-tag engine, and this script calls its moveBall / inWormhole /
// lostInSpace / isResting functions directly to try thousands of shots.
//
// Usage: bun scripts/solve-planet.ts [--fast]
// (Run `bun scripts/build.ts` first so the game's art is bundled.)
//
// tests/planet_putt.test.ts also uses openSolver() to pick real shots.

import { chromium, type Browser, type Page } from "playwright";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

export type Shot = {
  pull: [number, number]; // how far to drag back, in whole pixels
  sinks: boolean;
  lost: boolean;
  landing: [number, number] | null; // where the ball rests if it doesn't sink
};

export type Solver = {
  holeCount: number;
  holes: {
    name: string;
    par: number;
    tee: [number, number];
    hole: [number, number];
  }[];
  /** The best single shot from (x, y) on a hole: one that sinks, else the closest landing. */
  bestShot(
    hole: number,
    x: number,
    y: number,
    opts?: SearchOptions,
  ): Promise<Shot>;
  /** Fewest strokes (up to 3) to finish a hole from its tee, and hole-in-one count. */
  solveHole(
    hole: number,
    opts?: SearchOptions,
  ): Promise<{ best: number | null; holeInOnes: number; tried: number }>;
  close(): Promise<void>;
};

type SearchOptions = { angleStep?: number; speedStep?: number };

export async function openSolver(): Promise<Solver> {
  const source = await readFile(
    join(root, "games/planet_putt/main.js"),
    "utf8",
  );
  const engine = await readFile(join(root, "tutorials/lib/jgz.js"), "utf8");
  const data = await readFile(
    join(root, "tutorials/lib/data/planet_putt.js"),
    "utf8",
  );
  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();
  await page.setContent("<!doctype html><body></body>");
  await page.addScriptTag({ content: engine });
  await page.addScriptTag({
    content: `window.JGZT = { register: (key, bundle) => { window.BUNDLE = bundle; } };`,
  });
  await page.addScriptTag({ content: data });

  // Inside the page: one running copy of the game per hole, started straight
  // on that hole, and helpers that fly pretend balls with its functions.
  await page.evaluate((gameSource) => {
    const w = window as any;
    const JGZ = w.JGZ;
    const games: any[] = [];
    w.gameFor = async (index: number) => {
      if (games[index]) return games[index];
      const source = gameSource.replace(
        /startHole\(0\);\s*state = "title";\s*$/,
        `startHole(${index});`,
      );
      const canvas = document.createElement("canvas");
      const handle = JGZ.run(source, {
        canvas,
        autostart: false,
        assetUrls: w.BUNDLE.assets,
        PIXEL_DENSITY: 1,
      });
      await handle.ready;
      handle.step(0);
      const game = JGZ.getGameInspector(handle);
      const fn = (name: string) => game.read(name);
      games[index] = {
        HOLES: fn("HOLES"),
        STEP: fn("STEP"),
        POWER: fn("POWER"),
        MAX_SPEED: fn("MAX_SPEED"),
        moveBall: fn("moveBall"),
        inWormhole: fn("inWormhole"),
        lostInSpace: fn("lostInSpace"),
        isResting: fn("isResting"),
      };
      return games[index];
    };

    // The velocity the game would launch with for a whole-pixel pull-back.
    const velocityFor = (g: any, pull: [number, number]) => {
      let vx = pull[0] * g.POWER;
      let vy = pull[1] * g.POWER;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > g.MAX_SPEED) {
        vx = (vx / speed) * g.MAX_SPEED;
        vy = (vy / speed) * g.MAX_SPEED;
      }
      return [vx, vy];
    };

    const fly = (g: any, x: number, y: number, v: number[]) => {
      const body = { x, y, vx: v[0], vy: v[1], stillTime: 0 };
      for (let t = 0; t < 20 / g.STEP; t++) {
        g.moveBall(body, g.STEP);
        if (g.inWormhole(body))
          return { sinks: true, lost: false, landing: null };
        if (g.lostInSpace(body))
          return { sinks: false, lost: true, landing: null };
        if (g.isResting(body, g.STEP))
          return { sinks: false, lost: false, landing: [body.x, body.y] };
      }
      return { sinks: false, lost: false, landing: [body.x, body.y] };
    };

    const pulls = (g: any, angleStep: number, speedStep: number) => {
      const list: [number, number][] = [];
      const seen = new Set<string>();
      for (let degrees = 0; degrees < 360; degrees += angleStep) {
        for (let speed = 60; speed <= g.MAX_SPEED; speed += speedStep) {
          const radians = (degrees * Math.PI) / 180;
          const pull: [number, number] = [
            Math.round((Math.cos(radians) * speed) / g.POWER),
            Math.round((Math.sin(radians) * speed) / g.POWER),
          ];
          const key = pull.join(",");
          if (!seen.has(key)) {
            seen.add(key);
            list.push(pull);
          }
        }
      }
      return list;
    };

    w.bestShot = async (
      index: number,
      x: number,
      y: number,
      angleStep: number,
      speedStep: number,
    ) => {
      const g = await w.gameFor(index);
      const hole = g.HOLES[index].hole;
      let best: any = null;
      let bestDistance = Infinity;
      for (const pull of pulls(g, angleStep, speedStep)) {
        const result = fly(g, x, y, velocityFor(g, pull));
        if (result.sinks) return { pull, ...result };
        if (result.lost) continue;
        const d = Math.hypot(
          result.landing![0] - hole[0],
          result.landing![1] - hole[1],
        );
        if (d < bestDistance) {
          bestDistance = d;
          best = { pull, ...result };
        }
      }
      return best;
    };

    w.solveHole = async (
      index: number,
      angleStep: number,
      speedStep: number,
    ) => {
      const g = await w.gameFor(index);
      const data = g.HOLES[index];
      const all = pulls(g, angleStep, speedStep);
      let frontier = [{ x: data.tee[0], y: data.tee[1] }];
      let best = null;
      let holeInOnes = 0;
      for (let stroke = 1; stroke <= 3 && best === null; stroke++) {
        const landings = new Map<string, { x: number; y: number }>();
        for (const start of frontier) {
          for (const pull of all) {
            const result = fly(g, start.x, start.y, velocityFor(g, pull));
            if (result.sinks) {
              best = stroke;
              if (stroke === 1) holeInOnes++;
            } else if (!result.lost) {
              // Group nearby landing spots so the search stays small.
              const [lx, ly] = result.landing!;
              landings.set(`${Math.round(lx / 12)},${Math.round(ly / 12)}`, {
                x: lx,
                y: ly,
              });
            }
          }
        }
        // Keep the 40 landing spots closest to the wormhole for the next stroke.
        frontier = [...landings.values()]
          .sort(
            (a, b) =>
              Math.hypot(a.x - data.hole[0], a.y - data.hole[1]) -
              Math.hypot(b.x - data.hole[0], b.y - data.hole[1]),
          )
          .slice(0, 40);
      }
      return { best, holeInOnes, tried: all.length };
    };
  }, source);

  const holes = await page.evaluate(
    async () => (await (window as any).gameFor(0)).HOLES,
  );
  return {
    holeCount: holes.length,
    holes,
    bestShot: (hole, x, y, opts = {}) =>
      page.evaluate(
        ([h, bx, by, a, s]) => (window as any).bestShot(h, bx, by, a, s),
        [hole, x, y, opts.angleStep ?? 2, opts.speedStep ?? 15] as const,
      ),
    solveHole: (hole, opts = {}) =>
      page.evaluate(([h, a, s]) => (window as any).solveHole(h, a, s), [
        hole,
        opts.angleStep ?? 2.5,
        opts.speedStep ?? 20,
      ] as const),
    close: () => browser.close(),
  };
}

if (import.meta.main) {
  const fast = process.argv.includes("--fast");
  const solver = await openSolver();
  let ok = true;
  for (let i = 0; i < solver.holeCount; i++) {
    const data = solver.holes[i];
    const r = await solver.solveHole(
      i,
      fast ? { angleStep: 4, speedStep: 30 } : {},
    );
    const fine = r.best !== null && r.best <= data.par;
    ok &&= fine;
    console.log(
      `${fine ? "✓" : "✗"} hole ${i + 1} "${data.name}": par ${data.par}, solver best ${r.best ?? "none ≤3"}, hole-in-one aims ${r.holeInOnes}/${r.tried}`,
    );
  }
  await solver.close();
  process.exit(ok ? 0 : 1);
}
