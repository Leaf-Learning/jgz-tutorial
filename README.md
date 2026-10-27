# Learn to code by making games

Interactive tutorials that take a complete beginner from an empty screen to a
finished, cute browser game, one runnable step at a time, with
[js-game-zero](https://github.com/Leaf-Learning/js-game-zero). Six are ready
to play, and your coding agent can make a new one from your own game idea.

## Make your own

Have a game idea? Open this folder in your favourite coding agent (Claude Code,
Codex, Pi, Antigravity…) and say something like:

> Make a tutorial for my game idea: a frog that catches bugs with its tongue before the sun sets.

The agent follows the **new-game-tutorial** skill in `skills/new-game-tutorial/`. It shapes the
idea into a beginner-sized game with you. Then it builds the game with cute art, carves it into
steps, writes the tutorial page with challenges, quizzes and widgets, and runs every check. The
new tutorial shows up on the hub next to the others.

- **Agents that support skills** find it on their own: `.agents/skills/` (read by Codex, Pi and
  Antigravity) and `.claude/skills/` (read by Claude Code) both link to `skills/`. To call it by
  name, use `/new-game-tutorial` in Claude Code or `$new-game-tutorial` in Codex.
- **Any other agent:** ask it to follow `skills/new-game-tutorial/SKILL.md`.

The agent needs the same setup as the [commands](#commands) below: Bun, then `bun install` and
`bunx playwright install chromium`.

Building one by hand? `bun run new frog_feast "Frog Feast"` sets up all the files, and the
skill's guides in `skills/new-game-tutorial/references/` describe the house style.

## The tutorials

| # | Game | Teaches |
| - | ---- | ------- |
| 1 | **Firefly Flash**: one click sets off a chain reaction of fireflies | drawing, the game loop, variables, lists & loops, `if`, clicks, sound, game states, saving |
| 2 | **Penguin Slide**: an ice puzzle where you slide until something stops you | grids, levels as text, `while` loops, keys & swipes, tweens, undo, progress |
| 3 | **Planet Putt**: mini-golf in space, where planets bend every shot | velocity, acceleration, gravity, drag-to-aim, bouncing, predicting paths, levels as data |
| 4 | **Pancake Stack**: a bear catches falling pancakes on a tower that wobbles more with every catch | keys & pointer, falling with speed × time, timers, lists & loops, indexes, `Math.sin` wobbles, game states, levels as data |
| 5 | **Octo Pop**: an octopus pops word bubbles as you type them | strings (length, letters, `slice`, `startsWith`, `split`), keys & typing, `if` / `else if` chains, lives & game states, levels as data |
| 6 | **Tiny Garden**: plant, water, pick and sell flowers to buy rarer seeds | timers, growth stages, states, data tables, loops that add up, buying rules, saving a whole garden |

## Open the tutorials

Play them online at [leaflearning.org/jgz/tutor/](https://leaflearning.org/jgz/tutor/),
or open **`tutorials/index.html`** in a browser. That's it: no server, no
install. The pages run the real js-game-zero engine with editable code next
to each game, and work straight from disk.

The site serves a copy of `tutorials/`, made by the leaflearning.org repo's
`scripts/update_tutor.sh`. `tutorials/lib/social.png` is the hub's link
preview there.

Each tutorial has:

- **Live code cells.** Edit the code and press ▶ Run (or Ctrl/⌘ + Enter). Lines new in each step glow green. Edits are saved in the browser; ↺ Reset restores them.
- **Challenges that check themselves** by watching the running game, with hints and a "Show me" answer.
- **Quizzes, sliders bound to constants in the code, live-value panels**, and custom widgets (a dt race, a circle-touch toy, a level painter, a gravity explorer…).
- **A download button** that zips the learner's game (`main.js`, art, font, README) to keep playing in the js-game-zero sandbox, or to test with `jgz`. Its README says how to set up both.

`tutorials/play.html?game=penguin_slide` plays any finished game full-size.

## Layout

```
games/<game>/            each game as a jgz project: main.js, images/, fonts/,
                         plus tutorial.json (its hub card and play-page details)
tutorials/
  index.html             the hub
  <game>.html            one page per tutorial
  play.html              full-size player
  steps/<game>/NN-*.js   every tutorial step, each a complete runnable game
  lib/                   the tutorial framework (see lib/README.md),
                         the engine (jgz.js) and generated data bundles
tests/                   play-through tests that drive each game with jgz
tests/challenges/        a model solution for every challenge on every page
scripts/                 build, checks, scaffolding, solvers and the Firefly tuner
shared/fonts/            Fredoka (SIL OFL), used by all the games
skills/                  the new-game-tutorial skill (.agents/skills and .claude/skills link here)
```

The last step of each tutorial *is* `games/<game>/main.js`, so a tutorial
can't drift away from its game.

## Commands

Needs [Bun](https://bun.sh). js-game-zero comes from npm: the engine, the `jgz`
CLI and the API reference are the `@js-game-zero/*` packages in `package.json`.

```sh
bun install                         # js-game-zero, Playwright and Prettier
bunx playwright install chromium    # the browser that jgz and the checks drive
bun run build                       # copy the engine + bundle art and steps into tutorials/lib
bun run jgz -- test games/planet_putt   # drive a game with the jgz CLI
bun run new <game_id> "<Title>"     # set up a new game and tutorial

bun run check                       # everything below, in order
bun run test:games                  # play-through tests for every game (via jgz)
bun run check:steps                 # run every tutorial step through jgz
bun run check:tutorials             # open every page in Chromium: cells, refs, phone width, TODOs
bun run check:challenges            # solve every challenge with its model solution
bun scripts/syntax-report.ts <game> # syntax each step uses first, and what the page never mentions
bun scripts/solve-penguin.ts        # prove every Penguin level solvable at par
bun scripts/tune-firefly.ts         # re-measure Firefly Flash's night goals
```

Run `bun run build` after changing any art, step or `main.js`.

To move to a newer js-game-zero, raise all three `@js-game-zero/*` versions in
`package.json` together, then run `bun install`, `bun run build` and `bun run check`.

## Credits

Built on js-game-zero (MIT). All game art was drawn as SVG for these games.
Font: [Fredoka](https://github.com/hafontia/Fredoka-One), © 2016 The Fredoka
Project Authors, SIL Open Font License (`shared/fonts/OFL.txt`).
