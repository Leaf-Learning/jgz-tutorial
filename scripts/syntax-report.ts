// Lists, step by step, the JavaScript syntax and engine calls a tutorial's
// code uses for the first time, and flags the ones its page never mentions
// in inline <code> (or a .term) by the end of that step. A beginner meets
// every one of these in the editor, so each needs a sentence somewhere.
//
// A tutorial that lists others under "after" in its tutorial.json gets
// credit for everything those taught.
//
// The flags are a heuristic: a mention isn't always an explanation, and
// some things (a closing bracket) don't need one. Read the list, then fix
// the page where it's really missing something.
//
// Usage: bun scripts/syntax-report.ts <game> [--all]
//   --all   also list the features the page does mention

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const game = process.argv[2];
const showAll = process.argv.includes("--all");
if (!game || !existsSync(join(root, "games", game, "tutorial.json"))) {
  console.error("Usage: bun scripts/syntax-report.ts <game> [--all]");
  process.exit(1);
}

// [label, how to spot it in code, what counts as mentioning it on the page]
const SYNTAX: [string, RegExp, string[]][] = [
  ["let", /\blet\b/, ["let"]],
  ["const", /\bconst\b/, ["const"]],
  ["function", /\bfunction\b/, ["function"]],
  ["return", /\breturn\b/, ["return"]],
  ["if", /\bif\s*\(/, ["if"]],
  ["else", /\belse\b/, ["else"]],
  ["for (let i = …) loop", /\bfor\s*\(\s*let\b/, ["for (let", "for(let"]],
  ["for … of loop", /\bfor\s*\(\s*const\s+\w+\s+of\b/, [" of "]],
  ["while", /\bwhile\s*\(/, ["while"]],
  ["break / continue", /\b(break|continue)\b/, ["break", "continue"]],
  ["===", /===/, ["==="]],
  ["!==", /!==/, ["!=="]],
  ["< > <= >=", /[^=!<>]\s(<|>|<=|>=)\s/, ["<", ">"]],
  ["&& (and)", /&&/, ["&&"]],
  ["|| (or)", /\|\|/, ["||"]],
  ["! (not)", /!(?!=)/, ["!"]],
  ["? : (pick a value)", /\s\?\s/, ["?"]],
  ["?? (or else)", /\?\?/, ["??"]],
  ["+= -= *=", /[+\-*/]=(?!=)/, ["+=", "-=", "*=", "/="]],
  ["++ / --", /\+\+|--/, ["++", "--"]],
  ["% (remainder)", /\s%\s/, ["%"]],
  ["=> (arrow function)", /=>/, ["=>"]],
  ["`template ${strings}`", /`/, ["`", "${"]],
  ["new", /\bnew\s+\w/, ["new "]],
  ["null", /\bnull\b/, ["null"]],
  ["true / false", /\b(true|false)\b/, ["true", "false"]],
  ["typeof", /\btypeof\b/, ["typeof"]],
  ["[ arrays ]", /[=(,]\s*\[/, ["["]],
  ["{ key: value } objects", /\{\s*\w+\s*:/, [": "]],
];

// Names that are worth a mention each time a new one appears.
const NAMED =
  /\b(Math\.\w+|screen(?:\.draw)?\.\w+|animate|clock\.\w+|tone\.\w+|storage\.\w+|keyboard\.\w+|keys\.\w+|mouse\.\w+|music\.\w+|sounds\.\w+|randomInt|randomChoice|clamp|rgb|Actor|Rect)\b|\.(push|pop|shift|unshift|splice|slice|length|filter|map|some|every|find|includes|indexOf|sort|join|split|repeat|padStart|toFixed|forEach|touches|colliderect|distanceTo|angleTo)\b|\bfunction (draw|update|onMouseDown|onMouseUp|onMouseMove|onKeyDown|onKeyUp)\b/g;

function named(code: string): string[] {
  const found = new Set<string>();
  for (const match of code.matchAll(NAMED)) {
    let name = match[0].replace(/^function /, "");
    if (name.startsWith("keys.")) name = "keys.…";
    else if (name.startsWith("keyboard.")) name = "keyboard.…";
    found.add(name);
  }
  return [...found];
}

// Comments and strings out of the way (template strings are spotted first).
function codeOnly(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, '""');
}

const info = JSON.parse(
  await readFile(join(root, "games", game, "tutorial.json"), "utf8"),
);
const html = await readFile(join(root, "tutorials", info.page), "utf8");

// Each step section: which step it shows, and the words it mentions in code.
const decode = (text: string) =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const sections = [
  ...html.matchAll(/<section class="step"[\s\S]*?<\/section>/g),
].map(([text]) => ({
  steps: [
    ...text.matchAll(
      /class="cell"[^>]*data-step="([^"]+)"|data-step="([^"]+)"[^>]*class="cell"/g,
    ),
  ].map((m) => m[1] ?? m[2]),
  mentions: [
    /<code[^>]*>([\s\S]*?)<\/code>/g,
    /class="term"[^>]*>([\s\S]*?)<\/span>/g,
    /data-match="([^"]*)"/g,
  ]
    .flatMap((pattern) => [...text.matchAll(pattern)].map((m) => decode(m[1])))
    .join("\n"),
}));

const stepsDir = join(root, "tutorials/steps", game);
const order = (await readdir(stepsDir)).filter((f) => f.endsWith(".js")).sort();
const steps = await Promise.all(
  order.map(async (file) => ({
    key: file.replace(/\.js$/, ""),
    code: await readFile(join(stepsDir, file), "utf8"),
  })),
);
steps.push({
  key: "final",
  code: await readFile(join(root, "games", game, "main.js"), "utf8"),
});

// Tutorials this one builds on ("after" in tutorial.json) have already
// taught everything their code uses.
const seen = new Set<string>();
for (const earlier of info.after ?? []) {
  const dir = join(root, "tutorials/steps", earlier);
  const files = existsSync(dir)
    ? (await readdir(dir)).filter((f) => f.endsWith(".js"))
    : [];
  const codes = await Promise.all(
    files.map((file) => readFile(join(dir, file), "utf8")),
  );
  codes.push(await readFile(join(root, "games", earlier, "main.js"), "utf8"));
  for (const code of codes) {
    const plain = codeOnly(code);
    for (const [label, pattern] of SYNTAX)
      if (pattern.test(label.startsWith("`") ? code : plain)) seen.add(label);
    for (const name of named(plain)) seen.add(name);
  }
}
let mentioned = "";
let flagged = 0;
const after = info.after?.length ? ` (after ${info.after.join(", ")})` : "";
console.log(
  `${info.page}${after}: syntax and engine calls, by the step that first uses them\n`,
);
for (const step of steps) {
  const index = sections.findIndex((section) =>
    section.steps.includes(step.key),
  );
  // Everything the page has mentioned up to and including this step's section.
  if (index >= 0)
    mentioned = sections
      .slice(0, index + 1)
      .map((section) => section.mentions)
      .join("\n");
  const source = step.code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
  const code = codeOnly(step.code);
  const fresh: { label: string; ok: boolean }[] = [];
  for (const [label, pattern, words] of SYNTAX) {
    const used = label.startsWith("`")
      ? pattern.test(source)
      : pattern.test(code);
    if (!used || seen.has(label)) continue;
    seen.add(label);
    fresh.push({ label, ok: words.some((word) => mentioned.includes(word)) });
  }
  for (const name of named(code)) {
    if (seen.has(name)) continue;
    seen.add(name);
    const word = name.replace(/^\./, "").replace(".…", ".");
    fresh.push({ label: name, ok: mentioned.includes(word) });
  }
  const missing = fresh.filter((item) => !item.ok);
  flagged += missing.length;
  const where = index >= 0 ? "" : "  (no step section shows this step)";
  console.log(`${step.key}${where}`);
  if (missing.length)
    console.log(
      `  ⚠ not mentioned yet: ${missing.map((item) => item.label).join(", ")}`,
    );
  if (showAll && fresh.length > missing.length)
    console.log(
      `  ✓ mentioned: ${fresh
        .filter((item) => item.ok)
        .map((item) => item.label)
        .join(", ")}`,
    );
}
console.log(`\n${flagged} first uses with no mention on the page so far.`);
