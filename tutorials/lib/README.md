# Tutorial framework

`tutorial.js` + `tutorial.css` turn plain HTML into an interactive lesson that
runs the real js-game-zero engine (`jgz.js`, the script-tag build) in the
page. Pages open straight from disk; nothing needs a server.

## Files

| File                     | What it is                                                             |
| ------------------------ | ---------------------------------------------------------------------- |
| `jgz.js`                 | The engine, copied from js-game-zero by `scripts/build.ts`.            |
| `tutorial.js`            | The framework (`window.JGZT`).                                         |
| `tutorial.css`           | Shared styles and the four themes.                                     |
| `data/<game>.js`         | Generated: the game's images as data URLs + every step's code.         |
| `data/games.js`          | Generated: every game's `tutorial.json`, for the hub and `play.html`.  |

Step code lives in `tutorials/steps/<game>/NN-name.js`, each one a complete,
runnable `main.js`. The finished `games/<game>/main.js` is always added as the
last step, `final`. Run `bun scripts/build.ts` after changing art or steps.

## Page skeleton

```html
<body class="theme-night" data-game="firefly_flash" data-tutorial="Firefly Flash">
  <main class="page">
    <section class="hero">…</section>
    <section class="step" data-title="Short TOC title">
      <span class="step-kicker"></span>   <!-- filled with "Step N" -->
      <h2>…</h2>
      <p>…</p>
      <div class="cell" data-step="03-move"></div>
    </section>
    …
  </main>
  <script src="lib/jgz.js"></script>
  <script src="lib/tutorial.js"></script>
  <script src="lib/data/firefly_flash.js"></script>
  <script>
    JGZT.challenge("id", (game) => …);
    JGZT.start();
  </script>
</body>
```

Themes: `theme-night`, `theme-ice`, `theme-space`, `theme-hub`. Page-only
styles go in a `<style>` block in the page.

## Building blocks

**Code cell** — `<div class="cell" data-step="KEY">`. An editor and a live
game. Lines new since the previous step (in `order`) are highlighted and the
editor scrolls to them. Options:

- `data-play-only` — just the game, no editor (use for "play the finished game").
- `data-watch="score, state, fireflies.length"` — a live values panel.
- `data-diff-from="KEY"` — compare against a different step.
- `data-height="300px"` — editor max height.
- `id="…"` — give two cells of the same step different ids.

Learner edits are saved per cell in `localStorage`; ↺ Reset restores the step.

**Tweak** — `<div class="tweak" data-name="SPEED" data-min data-max data-step data-label data-unit data-icon>`
binds a slider to `const SPEED = 120;` (or `let`) in the nearest cell above
and reruns the game as it moves. `data-type="color"` binds a colour picker to
`const GLOW = "#ffd34d";`. Wrap several in `<div class="tweak-row">`.

**Challenge** — checked automatically while the cell's game runs:

```html
<div class="challenge" data-id="moon-left" data-success="The moon moved!">
  <p>Move the moon to the top-left corner.</p>
  <p class="hint">The first number is x…</p>          <!-- revealed one by one -->
  <pre class="answer">screen.circle(80, 60, 40, "white");</pre>
</div>
```

```js
JGZT.challenge("moon-left", (game) => {
  const moon = game.drawn().find((d) => d.kind === "circle" && d.radius >= 30);
  return moon && moon.x < 200 && moon.y < 150; // true = passed, string = a nudge
});
```

`game` has `read(path)` (live values: `"score"`, `"fish[0].x"`), `drawn()`
(what the last frame drew — see js-game-zero's `$drawn` docs), `has(name)`,
`call(name, ...args)`, `code` (the cell's source) and `running`.

**Quiz** —

```html
<div class="quiz" data-id="q-dt" data-answer="b">
  <p>What does dt measure?</p>
  <button data-choice="a">Pixels</button>
  <button data-choice="b">Seconds since the last frame</button>
  <div class="explain" data-for="b">Right — …</div>
  <div class="explain" data-for="wrong">Hint for any wrong answer.</div>
</div>
```

**Code reference** — `<code class="ref">clampIp</code>` (or `data-match="…"`,
or `data-lines="5-7"`) highlights matching lines on hover/focus. A match is a
plain substring of a single line: every line containing it lights up, and a
needle spanning two lines matches nothing.

Refs, tweaks and challenges find their cell the same way: `data-cell="KEY"`
if given; otherwise, inside a `.step`, the nearest code cell above them in
that step, or the step's first code cell if none is above; outside a step,
the nearest cell above.

**Term** — `<span class="term" tabindex="0" data-tip="A named box that holds a value.">variable</span>`.

**Callouts** — `<div class="callout big-idea"><span class="callout-icon">🧠</span><div><span class="callout-title">Big idea</span>…</div></div>`
(also `.tip`, `.warn`, or plain).

**Art tray** — `<div class="art-tray" data-filter="^firefly"></div>` shows the
game's images with their asset names.

**Static code** — `<pre class="code-block">…</pre>` gets syntax colours.

**Widgets** — page-specific interactive figures: a `.widget` box with
`.widget-title`, `.widget-sub`, a `<canvas>`, `.widget-controls`, `.readout`.
Write their code in the page's own `<script>`, with the helpers below:

```js
const W = 760, H = 240;                       // the widget's own units
const canvas = document.querySelector("#tongue-lab canvas");
const ctx = JGZT.setupCanvas(canvas, W, H);   // sharp on every screen
JGZT.onDrag(canvas, W, H, ([x, y], phase) => { … draw(); });
ctx.fillStyle = JGZT.themeColor("--accent");
const frog = new Image();                     // the game's own art
frog.src = JGZT.games.frog_feast.assets["images/frog_idle.svg"];
frog.onload = draw;
```

## JavaScript API

`JGZT.cell(idOrStepKey)` → the cell (`.code`, `.original`, `.setCode(code)`,
`.run()`, `.view()`), `JGZT.on("run" | "first-run" | "stop" | "change" | "challenge" | "complete", fn)`,
`JGZT.celebrate(element)`, `JGZT.sfx.success()`, `JGZT.highlight(code)`,
`JGZT.downloadProject(code)`, `JGZT.store.get/set`,
`JGZT.games[<game>].assets` (asset path → data URL), and the widget helpers
`JGZT.setupCanvas`, `JGZT.pointerAt`, `JGZT.onDrag`, `JGZT.themeColor`.

## Checks

- `bun scripts/check-steps.ts [game]` — runs every step through `jgz test`.
- `bun scripts/check-tutorials.ts [page.html] [--shots dir]` — opens each page
  in Chromium, runs every cell, and fails on errors, refs that match nothing,
  leftover TODOs, and sideways scrolling at phone width.
- `bun scripts/check-challenges.ts [game]` — applies each model solution in
  `tests/challenges/<game>.js` and expects its challenge to pass (and not to
  pass before the change).
- `bun scripts/syntax-report.ts <game>` — lists the syntax and engine calls
  each step uses for the first time, and flags the ones the page never
  mentions in inline code (tutorials listed under `after` in `tutorial.json`
  count as already taught).
