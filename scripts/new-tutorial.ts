// Sets up everything a new game and its tutorial need, so the build and all
// the checks work from the very first minute:
//
//   games/<id>/main.js, README.md, tutorial.json, fonts/ (+ font licence)
//   tutorials/steps/<id>/01-start.js     the first tutorial step
//   tutorials/<slug>.html                the tutorial page, from a template
//   tests/<id>.test.ts                   play-through tests (jgz)
//   tests/challenges/<id>.js             model solutions for the challenges
//   a .theme-<slug> colour theme in tutorials/lib/tutorial.css
//
// then runs the build. Every placeholder says TODO; `bun run check:tutorials`
// fails until the page and hub card have none left.
//
// Usage: bun scripts/new-tutorial.ts <game_id> "<Title>" [--base night|ice|space|hub]
//   e.g. bun scripts/new-tutorial.ts frog_feast "Frog Feast" --base ice

import { existsSync } from "node:fs";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const baseIndex = args.indexOf("--base");
const base = baseIndex >= 0 ? args[baseIndex + 1] : "night";
const [id, title] = args.filter(
  (_, i) => baseIndex < 0 || (i !== baseIndex && i !== baseIndex + 1),
);

function fail(message: string): never {
  console.error(message);
  console.error(
    'Usage: bun scripts/new-tutorial.ts <game_id> "<Title>" [--base night|ice|space|hub]',
  );
  process.exit(1);
}

if (!id || !title) fail("Give the game an id and a title.");
if (!/^[a-z][a-z0-9_]*$/.test(id))
  fail(
    `"${id}" won't do: use lowercase letters, digits and underscores, like frog_feast.`,
  );
if (existsSync(join(root, "games", id))) fail(`games/${id} already exists.`);

const slug = id.replace(/_/g, "-");
const page = `${slug}.html`;
const theme = `theme-${slug}`;
if (existsSync(join(root, "tutorials", page)))
  fail(`tutorials/${page} already exists.`);

// The next tutorial number on the hub.
let order = 0;
for (const game of await readdir(join(root, "games"))) {
  const info = join(root, "games", game, "tutorial.json");
  if (existsSync(info))
    order = Math.max(
      order,
      Number(JSON.parse(await readFile(info, "utf8")).order) || 0,
    );
}
order += 1;

// The base theme's colours, cloned into a new theme for this game.
const cssFile = join(root, "tutorials/lib/tutorial.css");
const css = await readFile(cssFile, "utf8");
const baseBlock = css.match(
  new RegExp(`\\n\\.theme-${base} \\{[\\s\\S]*?\\n\\}\\n`),
);
if (!baseBlock)
  fail(
    `There's no .theme-${base} in tutorial.css. Pick night, ice, space or hub.`,
  );
const pageBackground = baseBlock[0].match(/--bg-2: ([^;]+);/)?.[1] ?? "#2d2758";
const fill = (text: string) =>
  text
    .replaceAll("{{ID}}", id)
    .replaceAll("{{TITLE}}", title)
    .replaceAll("{{PAGE}}", page)
    .replaceAll("{{THEME}}", theme)
    .replaceAll("{{NUMBER}}", String(order));
const template = (name: string) =>
  readFile(join(root, "scripts/templates", name), "utf8").then(fill);

const gameDir = join(root, "games", id);
await mkdir(join(gameDir, "fonts"), { recursive: true });
await copyFile(
  join(root, "shared/fonts/fredoka.ttf"),
  join(gameDir, "fonts/fredoka.ttf"),
);
// The licence sits outside fonts/: jgz only allows font files in there.
await copyFile(
  join(root, "shared/fonts/OFL.txt"),
  join(gameDir, "FONT-LICENSE-OFL.txt"),
);
const starter = await template("main.js");
await writeFile(join(gameDir, "main.js"), starter);
await writeFile(join(gameDir, "README.md"), await template("README.md"));
await writeFile(
  join(gameDir, "tutorial.json"),
  JSON.stringify(
    {
      title,
      page,
      order,
      after: [],
      theme,
      tagline: "TODO: one playful line about the game.",
      help: "TODO: the controls and the goal, in two sentences.",
      topics: ["TODO 🎯 Concept"],
      card: { background: pageBackground, sprites: [] },
    },
    null,
    2,
  ) + "\n",
);

await mkdir(join(root, "tutorials/steps", id), { recursive: true });
await writeFile(join(root, "tutorials/steps", id, "01-start.js"), starter);
await writeFile(join(root, "tutorials", page), await template("tutorial.html"));
await writeFile(
  join(root, "tests", `${id}.test.ts`),
  await template("game.test.ts"),
);
await mkdir(join(root, "tests/challenges"), { recursive: true });
await writeFile(
  join(root, "tests/challenges", `${id}.js`),
  await template("challenges.js"),
);

const themeBlock = baseBlock[0].replace(
  `.theme-${base} {`,
  `/* ${title}: started from theme-${base}. Retune to match the game's art. */\n.${theme} {`,
);
const themesEnd = css.indexOf("/* ---------- Base ---------- */");
await writeFile(
  cssFile,
  css.slice(0, themesEnd) +
    themeBlock.trimStart() +
    "\n" +
    css.slice(themesEnd),
);

const build = Bun.spawnSync(["bun", join(root, "scripts/build.ts")], {
  stdout: "inherit",
  stderr: "inherit",
});
if (build.exitCode !== 0) process.exit(build.exitCode ?? 1);

console.log(`
Made ${title} (tutorial ${order}):

  games/${id}/                  main.js, tutorial.json, README.md, fonts/
  tutorials/${page}
  tutorials/steps/${id}/01-start.js
  tests/${id}.test.ts
  tests/challenges/${id}.js
  .${theme} in tutorials/lib/tutorial.css

Open tutorials/${page} to see it. Fill in every TODO, then run
bun run check to test everything.`);
