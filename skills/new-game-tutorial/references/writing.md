# Writing the tutorial page

## Who's reading

Someone who has never programmed. Maybe 11, maybe 60. They can click and type, but "variable",
"function" and "string" mean nothing to them yet. They learn by poking at things, and they give
up when they hit a wall of text or an error they can't read. Write for them, not for programmers.

## Voice

- **Warm, playful and encouraging**, in the second person. Celebrate small wins.
- **Short sentences and short paragraphs** (two to four sentences).
- **Concrete first:** run it, see it, then explain it. Never explain code they haven't seen run.
- **Everyday analogies:** a flip book for the game loop, a labelled box for a variable, a recipe
  for a function.
- **Never** say "simply", "just", "obviously", "easy" or "trivial". If it were obvious to
  them, they wouldn't need the page.
- **Small jokes about the game's characters** are good. Jokes at the reader's expense are not.
- **Spelling:** the existing pages use British spelling in prose ("colour", "centre"). The code
  says `color`, because that's what the engine calls it.

## Anatomy of a step

```html
<section class="step" data-title="Short title for the contents drawer">
  <span class="step-kicker"></span>                     <!-- filled in as "Step 4" -->
  <h2>A title that promises a result</h2>
  <p>Why this step: what's missing from the game right now. Then: press <strong>Run</strong>.</p>
  <div class="cell" data-step="04-game-loop" data-watch="x, vx"></div>
  <p>What just happened, in one or two sentences.</p>
  <ul>
    <li><code class="ref" data-match="x += vx * dt">x += vx * dt;</code> explained…</li>
  </ul>
  <div class="callout big-idea">…the one concept of this step…</div>
  <div class="widget" id="…">…optional…</div>
  <div class="tweak-row">…sliders for its constants…</div>
  <div class="quiz" data-id="q-…">…</div>
  <div class="challenge" data-id="…">…</div>
  <p class="muted">A teaser for the next step.</p>
</section>
```

Steps run 250–600 words of prose. The order can bend. A widget can come before the code, and a
step can have two cells when it compares before and after. Give every cell after the first its own
`id`.

## Explaining code

- **Explain every line the step adds,** grouped sensibly, each with a `code.ref` that lights up the
  lines on hover. Prefer `data-match="a distinctive substring"` over `data-lines`, which breaks
  when the code changes. `check:tutorials` fails on refs that match nothing.
- **Define each new word the first time it appears** with
  `<span class="term" tabindex="0" data-tip="…">word</span>`, and add it to the glossary.
- **One big idea per step** in a `callout big-idea`: its name ("Big idea: variables"), a plain
  definition, an analogy, a tiny example. Use `callout tip` for asides and `callout warn` for classic
  mistakes (`=` vs `===`, forgetting `* dt`, a missing comma).
- **Code in the prose must match the cell exactly.** Copy it from the step file.
- **Let them break it.** Somewhere early, invite a deliberate mistake (delete a bracket) so they see
  the friendly error message and learn that errors are normal and fixable.

## Challenges

A challenge is a small change to the current step's code, checked live while the game runs.

```html
<div class="challenge" data-id="slow-bugs" data-success="Sleepy bugs! Much easier to catch.">
  <p><strong>Slow the bugs down</strong> to half their speed.</p>
  <p class="hint">Look for the speed in the tuning constants at the top.</p>
  <p class="hint">Halve <code>BUG_SPEED</code>: 90 becomes 45.</p>
  <pre class="answer">const BUG_SPEED = 45;</pre>
</div>
```

- **Mix the kinds:** change a number (a warm-up), copy a pattern and add a line, combine two ideas,
  add to level data, or play to a goal (`data-kicker="Play time"`). Make them harder as the
  tutorial goes on. The last ones can be open-ended.
- **Phrase each one as a goal, not a recipe:** a bold title and one sentence saying what success
  looks like. One to three hints, from "where to look" to "nearly the answer". The `.answer` shows
  only the changed lines, not the whole program.
- **Make `data-success` specific and playful.**

The check goes in the page's script:

```js
JGZT.challenge("slow-bugs", (game) => {
  const speed = game.read("BUG_SPEED");
  if (speed > 45) return false;
  return (game.read("bugs") || []).length > 0 || "Slow enough! Now press Run to see them.";
});
```

- **Watch the running game,** not the code. Use `game.read("score")`, `game.read("bugs.length")` and
  `game.read("LEVELS[0].goal")` for live values, and `game.drawn()` for what the last frame drew
  (`{ kind: "circle" | "rect" | "text" | "image" | "actor" | …, x, y, … }`). Match `game.code` only
  when nothing visible changes (a waveform name), and pair it with a runtime condition.
- **Accept any reasonable solution:** check thresholds and outcomes, not the exact model answer.
- **Return a string to nudge** when they're halfway there.
- **It must be false on the untouched step.** `check:challenges` fails a check that passes before
  any change.
- **Code defensively:** the learner's game may be broken. `read` returns `undefined` on failure, so
  use `|| []` and `|| 0`. A check that throws counts as false.

Then add the model solution to `tests/challenges/<id>.js`, matching the `.answer`:

```js
{ id: "slow-bugs", edit: [["const BUG_SPEED = 90;", "const BUG_SPEED = 45;"]] },
{
  id: "catch-five",
  play: async (game) => {
    for (let i = 0; i < 10; i++) {
      const bugs = await game.evaluate((view) => view.read("bugs").map((bug) => [bug.x, bug.y]));
      await game.click(bugs[0][0], bugs[0][1]);
      await game.wait(400);
    }
  },
},
```

`edit` takes `[find, replace]` pairs (each `find` must be in the step's code) or a function.
`play` gets `click`, `press`, `move`, `release`, `drag`, `key`, `wait`, `read`, `drawn` and
`evaluate`, with positions in game pixels.

## Quizzes

About one per step, testing the concept, not trivia.

```html
<div class="quiz" data-id="q-origin" data-answer="b">
  <p>Where is the spot <code>(0, 0)</code>?</p>
  <button data-choice="a">Right in the middle of the window</button>
  <button data-choice="b">The top-left corner</button>
  <button data-choice="c">The bottom-left corner, like in maths class</button>
  <div class="explain" data-for="b">x counts from the left and y counts down from the top…</div>
  <div class="explain" data-for="c">That's how graphs work in maths, but screens count y downwards.</div>
  <div class="explain" data-for="wrong">Hover over (or tap) the game above and watch the numbers.</div>
</div>
```

- **Wrong answers should be real misconceptions** (y grows upwards, `dt` counts frames, `=`
  compares). Every explanation teaches something; never write just "Wrong!".
- Use three choices, sometimes two or four. Give each quiz a unique `data-id`.

## Tweaks and live values

- **Tweaks** (`<div class="tweak" data-name="BUG_SPEED" data-min="10" data-max="300" data-label="Bug speed" data-icon="🐞" data-unit=" px/s">`)
  bind a slider to a `const NAME = number;` line and rerun the game as it moves. Use them where
  feel matters (speed, size, gravity, timing, colour with `data-type="color"`). Pick ranges that
  stay playable.
- **Live values:** `data-watch="x, y, state"` on a cell shows changing values beside the game.
  Use it when the lesson is that something changes every frame.

## Widgets

Use two to five per tutorial, for the ideas words can't carry: why `* dt`, distance, vectors,
grids, loops stepping, tweens, state machines, gravity. The existing ones are the model:
`firefly-flash.html` (dt race, flash graph, touch toy, scale keys, state map), `penguin-slide.html`
(grid explorer, while-loop stepper, tween race, level painter) and `planet-putt.html` (velocity
playground, gravity explorer, bounce visualiser).

- Make it interactive within a second, explained in one sentence (`.widget-sub`), with a live
  `.readout` that shows the sum with the real numbers ("√(30² + 40²) = 50").
- Draw on a `<canvas>`, written in the page's own `<script>`, with the framework's helpers:
  - `JGZT.setupCanvas(canvas, W, H)` gives a sharp context in your own units.
  - `JGZT.onDrag(canvas, W, H, (point, phase) => …)` handles mouse, pen and touch drags.
  - `JGZT.themeColor("--accent")` reads the theme's colours.
  - `JGZT.games.<id>.assets["images/frog.svg"]` is the game's art, ready for an `<img>`.

  See `tutorials/lib/README.md`. Fit the canvas to the width on phones.
- Anything you hover must work with a tap too: listen for `pointermove` and `pointerdown`, not
  mouse events (a running game stops a finger's mouse events), and give a hint that says click or
  hover a `data-touch="Tap …"` version.
- A widget can write into the code. Firefly's scale keys rewrite `NOTES` with
  `JGZT.cell("10-music").setCode(…)`.
- Put page-only CSS in the `<style>` block at the top.

## Hero and finale

- **Hero:** kicker (`🐸 Tutorial 4 · Timers and tongues`), title, a warm lede, three meta chips
  (time, who it's for or what it assumes, nothing to install), "Play it first" with how to play,
  exactly six learn-cards, and the shared "How this page works" callout.
- **Finale:** "You made <Title>! 🎉", a recap naming each big idea in bold, six "ideas to try next"
  each with a hint at how (`moon.touches(pos)`), the download button, a link to the next tutorial or
  all tutorials, and a glossary with every `.term` from the page.

## Before you call it done

- Every step has a cell, refs for its new lines, and a quiz or a challenge.
- `bun scripts/syntax-report.ts <id>` lists the syntax and engine calls each step uses for the first
  time, and flags those the page never mentions in inline code. Give each real gap a sentence. The
  usual ones to miss are `else`, `||`, `? :`, `%`, `Math.*` helpers, and outline vs filled drawing
  calls.
- Every challenge has hints, an answer and a model solution.
- No TODOs are left.
- Read it top to bottom as the beginner described above. Is any word used before it's explained?
  Does any step ask for something the page hasn't taught?
