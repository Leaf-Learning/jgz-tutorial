// Opens every tutorial page from disk in headless Chromium, runs every code
// cell, and fails on page errors or on a cell whose game reports an error.
// Also fails when a <code class="ref"> highlights no line in its cell, when
// "TODO" is left in the page's text, or when the page scrolls sideways on a
// phone-sized screen.
//
// Usage: bun scripts/check-tutorials.ts [page.html ...] [--shots <dir>]
//   --shots <dir>   also save screenshots of every cell (for eyeballing art):
//                   its poster frame before Run, and the game after poking

import { chromium } from "playwright";
import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const shotsIndex = args.indexOf("--shots");
const shotsDir = shotsIndex >= 0 ? args[shotsIndex + 1] : null;
const named = args.filter(
  (arg, i) => arg.endsWith(".html") && (shotsIndex < 0 || i !== shotsIndex + 1),
);
const pages = named.length
  ? named
  : (await readdir(join(root, "tutorials"))).filter(
      (file) => file.endsWith(".html") && !file.startsWith("_"),
    );
if (shotsDir) await mkdir(shotsDir, { recursive: true });

const browser = await chromium.launch();
let failures = 0;

for (const page of pages) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const tab = await context.newPage();
  const problems: string[] = [];
  tab.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
  tab.on("console", (message) => {
    if (message.type() === "error" && !/fonts\.g/.test(message.text()))
      problems.push(`console error: ${message.text()}`);
  });
  const url = pathToFileURL(join(root, "tutorials", page)).href;
  await tab.goto(url);
  await tab.waitForTimeout(400);

  const leftovers = await tab.evaluate(() =>
    (document.body.innerText.match(/TODO[^\n]{0,50}/g) || []).slice(0, 5),
  );
  for (const text of leftovers)
    problems.push(`placeholder left in the page: "${text}"`);
  problems.push(...(await brokenRefs(tab)));

  const cellCount = await tab.locator(".cell").count();
  for (let i = 0; i < cellCount; i++) {
    const cell = tab.locator(".cell").nth(i);
    await cell.scrollIntoViewIfNeeded();
    const label = (await cell.getAttribute("data-step")) ?? `#${i}`;
    const shot = (kind: string) =>
      join(
        shotsDir!,
        `${page.replace(".html", "")}-${String(i).padStart(2, "0")}-${label}-${kind}.png`,
      );
    if (shotsDir) {
      // The poster is drawn once the cell scrolls into view.
      await tab.waitForTimeout(700);
      await cell.screenshot({ path: shot("poster") });
    }
    await cell.locator(".stage-play").click();
    await tab.waitForTimeout(700);
    const stage = cell.locator(".stage");
    const box = await stage.boundingBox();
    if (box) {
      // Poke the game a little: a click, a drag, and some keys.
      await tab.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
      await tab.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.4);
      await tab.mouse.down();
      await tab.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.6, {
        steps: 5,
      });
      await tab.mouse.up();
      for (const key of ["ArrowRight", "ArrowUp", "Space", "ArrowLeft"]) {
        await tab.keyboard.press(key);
        await tab.waitForTimeout(120);
      }
      await tab.waitForTimeout(500);
    }
    const errors = await cell.locator(".msg-error").allInnerTexts();
    const running = await cell.evaluate((node) =>
      node.classList.contains("is-running"),
    );
    if (errors.length) problems.push(`cell ${label}: ${errors.join(" | ")}`);
    else if (!running) problems.push(`cell ${label}: not running after Run`);
    if (shotsDir) await cell.screenshot({ path: shot("running") });
  }

  // Phones: nothing may stick out sideways.
  const phone = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const phoneTab = await phone.newPage();
  await phoneTab.goto(url);
  await phoneTab.waitForTimeout(400);
  const scrollWidth = await phoneTab.evaluate(
    () => document.documentElement.scrollWidth,
  );
  if (scrollWidth > 391)
    problems.push(
      `scrolls sideways on a phone: ${scrollWidth}px wide at 390px`,
    );
  await phone.close();

  const widgets = await tab.locator(".widget").count();
  console.log(
    `${problems.length ? "✗" : "✓"} ${page}: ${cellCount} cells, ${widgets} widgets`,
  );
  for (const problem of problems) console.log(`    ${problem}`);
  failures += problems.length;
  await context.close();
}

await browser.close();
process.exit(failures ? 1 : 0);

/** Every code ref must light up at least one line, in its own step's cell. */
async function brokenRefs(tab: import("playwright").Page): Promise<string[]> {
  return tab.evaluate(() => {
    const broken: string[] = [];
    for (const ref of document.querySelectorAll<HTMLElement>("code.ref")) {
      const label = ref.dataset.match || ref.dataset.lines || ref.textContent;
      ref.dispatchEvent(new MouseEvent("mouseenter"));
      const marked = document.querySelector(".ed-hl .l.is-ref");
      const cell = marked?.closest<HTMLElement>(".cell");
      ref.dispatchEvent(new MouseEvent("mouseleave"));
      const step = ref.closest(".step");
      if (!marked) broken.push(`ref "${label}" highlights nothing`);
      else if (step && cell && !step.contains(cell) && !ref.dataset.cell)
        broken.push(
          `ref "${label}" highlights a line in another step's cell (${cell.dataset.step})`,
        );
    }
    return broken;
  });
}
