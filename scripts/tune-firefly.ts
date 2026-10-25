// Firefly Flash difficulty simulator. For every night it plays many seeded
// games, clicks a grid of 45 spots one second in, and reports how many
// fireflies a good click (the top 10% of spots) and a typical click (the
// median spot) light up. Each night's goal in NIGHTS was set so a good click
// usually reaches it and a typical click doesn't.
//
// Usage: bun scripts/tune-firefly.ts [trials=10]

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const source = await Bun.file(root + "/games/firefly_flash/main.js").text();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("file://" + root + "/tutorials/firefly-flash.html");
await page.waitForTimeout(300);
const trials = Number(process.argv[2] ?? 10);
const results = await page.evaluate(
  async ({ source, trials }) => {
    const assets = JGZT.games.firefly_flash.assets;
    // Decoded before each game runs, so a lit firefly's picture never holds
    // the frames this loop steps.
    const images = await JGZ.loadImages(assets);
    const nights = [];
    for (let n = 0; n < 8; n++) {
      const bests = [],
        randoms = [];
      for (let t = 0; t < trials; t++) {
        const lits = [];
        for (let cx = 60; cx <= 580; cx += 65) {
          for (let cy = 70; cy <= 310; cy += 60) {
            const canvas = document.createElement("canvas");
            const handle = JGZ.run(
              source + `\nnight = ${n}; startNight();\nfunction draw() {}`,
              {
                canvas,
                autostart: false,
                seed: `tune-${n}-${t}`,
                assetUrls: assets,
                keyboardTarget: canvas,
                mouseReleaseTarget: canvas,
                PIXEL_DENSITY: 1,
                preloadedAssets: { images },
              },
            );
            await handle.ready;
            handle.step(0);
            for (let i = 0; i < 60; i++) handle.step(1 / 60);
            canvas.dispatchEvent(
              new MouseEvent("mousedown", {
                clientX: cx,
                clientY: cy,
                button: 0,
                buttons: 1,
              }),
            );
            canvas.dispatchEvent(
              new MouseEvent("mouseup", {
                clientX: cx,
                clientY: cy,
                button: 0,
              }),
            );
            const inspector = JGZ.getGameInspector(handle);
            for (
              let i = 0;
              i < 60 * 30 && inspector.read("state") === "chain";
              i++
            )
              handle.step(1 / 60);
            lits.push(inspector.read("lit"));
            handle.stop();
          }
        }
        lits.sort((a, b) => b - a);
        bests.push(lits[Math.floor(lits.length * 0.1)]);
        randoms.push(lits[Math.floor(lits.length / 2)]);
      }
      nights.push({
        n: n + 1,
        bests: bests.sort((a, b) => a - b),
        medianRandom: randoms.sort((a, b) => a - b),
      });
    }
    return nights;
  },
  { source, trials },
);
for (const r of results)
  console.log(
    `night ${r.n}: good-click (top 10%) lit ${JSON.stringify(r.bests)}  median-click ${JSON.stringify(r.medianRandom)}`,
  );
await browser.close();
