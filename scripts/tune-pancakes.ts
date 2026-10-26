// Pancake Stack difficulty simulator. It plays the real finished game
// (games/pancake_stack/main.js) in Chromium with three kinds of bot, many
// seeded games each, and reports how far each one gets before the third
// miss:
//
//   pro      sees where each pancake will land and where the stack's top will
//            be swaying to by then, and gets there in time if it can (after a
//            tenth of a second's reaction time)
//   casual   looks twice a second, moves 0.4 seconds later, aims up to 25
//            pixels off, and ignores where the stack is swaying to
//   dozing   stands still
//
// The rush table in main.js (RUSHES) was tuned so the pro rarely misses
// until the dinner rush, the casual bot reaches brunch or lunch, and the
// dozing bot loses in seconds.
//
// Usage: bun scripts/tune-pancakes.ts [games=24] [seconds=180]
// (Run `bun scripts/build.ts` first so the game's art is bundled.)

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const source = await Bun.file(root + "/games/pancake_stack/main.js").text();
const games = Number(process.argv[2] ?? 24);
const seconds = Number(process.argv[3] ?? 180);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("file://" + root + "/tutorials/pancake-stack.html");
await page.waitForTimeout(300);

const results = await page.evaluate(
  async ({ source, games, seconds }) => {
    const assets = JGZT.games.pancake_stack.assets;
    // Decoded before each game runs, so a pancake's picture never holds
    // the frames these bots step.
    const images = await JGZ.loadImages(assets);
    const out = {};
    for (const kind of ["pro", "casual", "dozing"]) {
      const runs = [];
      for (let g = 0; g < games; g++) {
        const canvas = document.createElement("canvas");
        const handle = JGZ.run(source + "\nstartGame();\nfunction draw() {}", {
          canvas,
          autostart: false,
          seed: `tune-${kind}-${g}`,
          assetUrls: assets,
          keyboardTarget: canvas,
          mouseReleaseTarget: canvas,
          PIXEL_DENSITY: 1,
          preloadedAssets: { images },
        });
        await handle.ready;
        handle.step(0);
        const ins = JGZ.getGameInspector(handle);
        const point = (x) =>
          canvas.dispatchEvent(
            new MouseEvent("mousemove", { clientX: x, clientY: 200 }),
          );
        // A small seeded wobble for the casual bot's aim.
        let rng = g * 7919 + 13;
        const noise = () => {
          rng = (rng * 1103515245 + 12345) & 0x7fffffff;
          return (rng / 0x7fffffff - 0.5) * 2;
        };
        const pending = []; // [frame to act on, x] for the bots' reaction time
        const react = kind === "pro" ? 6 : 24;
        const frames = Math.round(seconds * 60);
        let frame = 0;
        const missesAt = [];
        let lastMisses = 0;
        for (; frame < frames && ins.read("state") === "playing"; frame++) {
          const falling = ins
            .read("falling")
            .filter((p) => p.state === "falling");
          const time = ins.read("time");
          const n = ins.read("stack").length;
          const speedNow = ins.read("activeRush").speed;
          const W = ins.read("WOBBLE");
          const WS = ins.read("WOBBLE_SPEED");
          const sway = (t) => Math.sin(t * WS) * W * n * n;
          const top = ins.read("stackTop")();
          if (kind !== "dozing" && falling.length) {
            // The pancake that will land first.
            falling.sort(
              (a, b) => (top - a.bottom) / a.speed - (top - b.bottom) / b.speed,
            );
            const p = falling[0];
            if (kind === "pro") {
              const wait = Math.max(0, (top - p.bottom) / p.speed);
              pending.push([frame + react, p.x - sway(time + wait)]);
            } else if (frame % 30 === 0) {
              pending.push([frame + react, p.x + noise() * 25]);
            }
          }
          while (pending.length && pending[0][0] <= frame)
            point(pending.shift()[1]);
          handle.step(1 / 60);
          const m = ins.read("misses");
          if (m !== lastMisses) {
            missesAt.push(ins.read("score"));
            lastMisses = m;
          }
        }
        runs.push({
          score: ins.read("score"),
          seconds: Math.round(frame / 60),
          rush: ins.read("activeRush").name,
          missesAt,
          survived: ins.read("state") === "playing",
        });
        handle.stop();
      }
      out[kind] = runs;
    }
    return out;
  },
  { source, games, seconds },
);

const median = (values: number[]) =>
  values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
for (const [kind, runs] of Object.entries(results) as [string, any[]][]) {
  const scores = runs.map((r) => r.score);
  const times = runs.map((r) => r.seconds);
  console.log(
    `${kind.padEnd(7)} score median ${median([...scores])} (min ${Math.min(...scores)}, max ${Math.max(...scores)})  ` +
      `time median ${median([...times])}s  survived ${runs.filter((r) => r.survived).length}/${runs.length}  ` +
      `rushes ${[...new Set(runs.map((r) => r.rush))].join(", ")}`,
  );
  if (kind !== "dozing")
    console.log(
      "   first misses at score:",
      runs.map((r) => r.missesAt[0] ?? "-").join(" "),
    );
}
await browser.close();
