---
name: new-game-tutorial
description: Turn someone's game idea into a finished, cute js-game-zero game plus an interactive beginner tutorial page in this repo, with runnable steps, self-checking challenges, quizzes, sliders and widgets, verified by the repo's checks and listed on the tutorials hub. Use when the user wants to make a new game tutorial, add a game to the hub, or says something like "make a tutorial for my game idea".
---

# Make a game tutorial from an idea

You're adding a fourth (fifth, …) tutorial to this repo. When you're done there
must be:

- **A small, finished, cute game** in `games/<id>/`, a jgz project with hand-drawn SVG art.
- **An interactive tutorial page** at `tutorials/<slug>.html` that takes someone who has
  never programmed from an empty screen to that exact game, one runnable step at a time.
- **Tests and model solutions** that prove the game works and every challenge can be solved.
- **A hub card**, so the game shows on `tutorials/index.html` and plays in `play.html`.

The first three tutorials are the quality bar. Match them in tone, pacing and polish,
not just in structure. Read the one closest to the new game before writing anything:
`firefly-flash.html` (first-timers, clicks), `penguin-slide.html` (grids, keys),
`planet-putt.html` (physics, dragging).

## 0. Check the setup

```sh
ls ../js-game-zero/packages/browser-runtime/dist/browser/browser.js   # the engine, built
bun install && bunx playwright install chromium                      # once
bun run build && bun run test:games                                  # the repo is healthy
```

If js-game-zero is missing or unbuilt, stop and tell the user: it must sit next to this
folder (`../js-game-zero`), built with `bun run build`. Engine docs are in
`../js-game-zero/docs/` (`reference/*.md` for every API). Read
`tutorials/lib/README.md` for the page framework.

## 1. Shape the idea (with the user)

No idea yet? Offer three, each with a one-line pitch and what it would teach.

Then turn the idea into a **design brief** using [references/design.md](references/design.md):
the core verb, how a round goes, how it's won and lost, the controls (must work by mouse/touch, or
keys plus swipes), the progression (levels or rising difficulty), the art list, a base colour
theme, and the **concept ladder**: the 8–12 steps and the programming idea each step teaches.
Say what it teaches that the existing tutorials don't, and what it assumes ("best after Firefly Flash").

Show the brief in a compact form and get one go-ahead. Scope cuts are the user's call. Everything
after this point is yours: don't stop to ask about details you can decide well.

## 2. Scaffold

```sh
bun run new <game_id> "<Title>" --base night|ice|space|hub
```

`game_id` is snake_case (`frog_feast`). This makes the game folder, the page from a template,
a test file, a challenge-solutions file, a colour theme in `tutorial.css`, and a hub entry
(`games/<id>/tutorial.json`), then builds. Every placeholder says **TODO**, and
`check:tutorials` fails while any are left on the page or hub.

## 3. Build the finished game first

Write `games/<id>/main.js` as the complete game. Steps are carved out of it later, so it
must be written for beginners to read. Follow [references/game-code.md](references/game-code.md).
It covers code style, the engine's quirks, and driving the game with the jgz CLI.

- **Art:** draw every sprite as SVG in `games/<id>/images/`, in the house style:
  [references/art.md](references/art.md). Look at your art: render it and view the image.
- **Play it** through `bun run jgz -- test games/<id>` (JSONL: play, inspect, screenshot) and
  look at screenshots of every state (title, playing, won, lost, finished).
- **Tune it:** a winnable first level in seconds, real difficulty later. If levels are puzzles
  or aiming, write a solver or simulator like `scripts/solve-penguin.ts` or
  `scripts/tune-firefly.ts`, and set goals and pars from what it finds.
- **Test it:** `tests/<id>.test.ts` plays the real game through jgz, with one test per rule
  (starting, scoring, winning, losing, next level, saving).

## 4. Carve the steps

Each `tutorials/steps/<id>/NN-name.js` is a **complete program that runs**, and the finished
`main.js` is always added as the last step (`final`). Delete the scaffold's `01-start.js` once
yours exist.

- Work backwards from the finished game. The step before last is usually the finished game minus its
  polish (title screen, saving, extra juice), and each earlier step removes one idea.
- Use **the final game's names, comments and formatting** in every step, so the lines a step
  adds are exactly the lines the learner will keep. The page highlights new lines; noisy diffs
  bury the lesson. In the existing tutorials most steps change 10–80 lines (counted after
  Prettier); the levels step and the polish step can reach about 200. A bigger step usually
  teaches two ideas: split it.
- **Carve with a script, not by hand.** Write a throwaway script (in your scratch space) that builds
  each step from `main.js` with exact find-and-replace cuts and fails loudly when a cut no longer
  matches. Then a fix to the game flows into every step by rerunning it, instead of being patched
  into ten files.
- Step 1 is tiny (about 15 lines) and draws something right away. Something moves by step 3 or 4,
  and the player can interact by about the middle.
- `bun run format`, `bun run build`, then `bun run check:steps <id>`.

## 5. Write the page

Follow [references/writing.md](references/writing.md) for voice, step anatomy, challenges,
quizzes, tweaks and widgets. The framework contract is `tutorials/lib/README.md`.

- **Hero:** kicker, title, lede, time estimate, "Play it first" with the finished game,
  six learn-cards, and the "How this page works" callout.
- **One `<section class="step">` per step:** why → cell → each new line explained with
  `code.ref` → a big-idea callout → (widget) → tweaks → quiz → 1–2 challenges.
- **Challenges:** add a check in the page script, plus a model solution in
  `tests/challenges/<id>.js` (see the other files there). The checker proves each one can be solved
  *and* that it doesn't already pass before the learner changes anything.
- **Widgets:** 2–5 small interactive figures for the hardest ideas.
- **Finale:** a celebration naming every big idea, six "ideas to try next", the download button,
  and a glossary of every term the page introduced.
- **Hub and theme:** fill in `games/<id>/tutorial.json`:
  - `tagline`, `help` (shown on the play page), and `topics` (chips with emoji).
  - `after`: the tutorials this one builds on, if any.
  - `card.background`: any CSS background.
  - `card.sprites`: `[path, x, y, width]` entries placing the game's images on a card about
    300–370px wide and 190px tall.

  Then retune `.theme-<slug>` in `tutorial.css` to the art, and fill in `games/<id>/README.md`.

## 6. Verify everything

While you iterate, check just your game. The full `bun run check` takes several minutes.

```sh
bun run build && bun test tests/<id>.test.ts
bun run check:steps <id>
bun scripts/check-tutorials.ts <slug>.html index.html    # the page, and the hub card
bun run check:challenges <id>
bun scripts/syntax-report.ts <id>      # syntax and calls the page never mentions
```

At the end:

```sh
bun run check          # build, game tests, every step, every page, every challenge
grep -rn TODO games/<id> tests/<id>.test.ts tutorials/<slug>.html
bun scripts/check-tutorials.ts <slug>.html --shots <scratch dir>   # posters + running games
```

`check` must pass with no failures, and `syntax-report` should flag nothing that's really
unexplained. A beginner meets every keyword, operator and engine call in the editor.

Then look at the page yourself in a real browser, using Playwright screenshots at desktop
(1440px) and phone (390px) widths. Check:

- The art is crisp and consistent.
- Nothing overlaps or is cut off.
- Every widget works.
- The hero game starts from its poster frame.
- `play.html?game=<id>` plays the game, and the hub card looks right next to the others.

Then get a fresh-eyes review. Ask a subagent that hasn't seen your work to read the page
as a total beginner and list anything confusing, unexplained or out of order. Fix what's real.

## 7. Hand back

Tell the user how to open it (`tutorials/<slug>.html`, or the hub). Say what it teaches, what the
checks proved (test, step, challenge and page counts), and any judgment calls you made. Don't
commit unless they ask.

## Pitfalls that cost time before

- **Fonts folder:** `fonts/` may only hold font files. A licence there breaks jgz, so it lives at
  `games/<id>/FONT-LICENSE-OFL.txt`.
- **Asset names:** lowercase letters, digits and underscores, starting with a letter
  (`penguin_left.svg`).
- **Hidden cells pause:** a cell's game pauses while scrolled off screen. Scripts that drive a page
  must scroll the cell into view first.
- **Refs:** a `code.ref` binds to the nearest code cell above it in its step. A ref placed above
  its step's cell binds to that step's first cell. `check:tutorials` fails on refs that match nothing.
- **Tweaks:** sliders only bind to lines shaped exactly `const NAME = 123;` (or `let`).
- **Fragile checks:** challenge checks run inside the learner's possibly broken game. Read
  values defensively (`game.read(...)` returns `undefined` on failure) and return a nudge string
  for partial progress.
- **Scroll wheel:** js-game-zero reports the wheel as a mouse button. Guard
  `onMouseDown` with `if (button !== mouse.LEFT) return;` for click games.
- **Changing a step:** edits learners saved for that step are dropped automatically, because the
  page fingerprints each step. Rebuild after every change to art, steps or `main.js`.
- **Long lists in `inspect`:** jgz summarises lists past 100 items and values nested deeper than six
  levels. Inspect exact paths (`bugs[0].x`, `bugs.length`) in tests and bots, not whole lists.
