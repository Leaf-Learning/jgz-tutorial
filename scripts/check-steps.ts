// Runs every tutorial step (and each finished game) through the real jgz CLI
// and fails if any of them throws, reports an error diagnostic, or logs a
// console error while being poked with clicks, drags and key presses.
//
// Usage: bun scripts/check-steps.ts [game ...]

import { existsSync } from "node:fs";
import {
  cp,
  mkdtemp,
  readdir,
  rm,
  writeFile,
  readFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { act, openGame } from "./jgz-session";

const root = fileURLToPath(new URL("..", import.meta.url));
const requested = process.argv.slice(2);
const gameNames = requested.length
  ? requested
  : (await readdir(join(root, "games"))).filter((name) =>
      existsSync(join(root, "games", name, "main.js")),
    );

let failures = 0;

for (const game of gameNames.sort()) {
  const gameDir = join(root, "games", game);
  const stepsDir = join(root, "tutorials/steps", game);
  const steps: { name: string; code: string }[] = [];
  if (existsSync(stepsDir)) {
    for (const file of (await readdir(stepsDir)).sort()) {
      if (file.endsWith(".js"))
        steps.push({
          name: file,
          code: await readFile(join(stepsDir, file), "utf8"),
        });
    }
  }
  steps.push({
    name: "main.js (final)",
    code: await readFile(join(gameDir, "main.js"), "utf8"),
  });

  console.log(`\n${game}`);
  for (const step of steps) {
    const dir = await mkdtemp(join(tmpdir(), `jgzt-${game}-`));
    await writeFile(join(dir, "main.js"), step.code);
    for (const folder of ["images", "sounds", "music", "fonts"]) {
      // Copied rather than symlinked: the jgz asset server refuses symlinks.
      if (existsSync(join(gameDir, folder)))
        await cp(join(gameDir, folder), join(dir, folder), { recursive: true });
    }
    const problems: string[] = [];
    try {
      const session = await openGame(dir, { seed: "check-steps" });
      const canvas = session.ready.status.canvas;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const result = await session.play(
        [
          act.step(5),
          act.click(cx, cy),
          act.seconds(0.5),
          act.tap("space"),
          act.tap("right"),
          act.seconds(0.5),
          act.tap("down"),
          act.tap("left"),
          act.tap("up"),
          act.press(cx + 20, cy + 10),
          act.step(3),
          act.move(cx - 30, cy + 40),
          act.step(3),
          act.move(cx - 60, cy + 70),
          act.step(3),
          act.release(cx - 60, cy + 70),
          act.seconds(2),
          act.click(cx / 2, cy / 2),
          act.seconds(2),
        ],
        {},
      );
      const status = result.status;
      for (const d of status.diagnostics ?? [])
        if (
          d.severity === "error" ||
          d.code === "hook-typo" ||
          d.code === "constant-typo"
        )
          problems.push(`${d.code}: ${d.message}`);
      if (status.failure)
        problems.push(`failure: ${JSON.stringify(status.failure)}`);
      for (const error of status.pageErrors ?? [])
        problems.push(`page error: ${JSON.stringify(error)}`);
      for (const line of status.console ?? [])
        if (line.type === "error") problems.push(`console error: ${line.text}`);
      for (const event of session.events)
        if (event.event === "runtime-error")
          problems.push(`runtime error: ${event.message}`);
      await session.close();
    } catch (error) {
      problems.push(String(error instanceof Error ? error.message : error));
    }
    await rm(dir, { recursive: true, force: true });
    console.log(`  ${problems.length ? "✗" : "✓"} ${step.name}`);
    for (const problem of problems) console.log(`      ${problem}`);
    failures += problems.length ? 1 : 0;
  }
}

console.log(
  failures ? `\n${failures} step(s) failed` : "\nAll steps ran cleanly.",
);
process.exit(failures ? 1 : 0);
