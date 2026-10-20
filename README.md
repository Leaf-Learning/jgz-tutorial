# jgz tutorials

Three cute browser games built with [js-game-zero](../js-game-zero), and three
interactive, playful tutorials that teach a complete beginner to build each
one from an empty screen.

| # | Game | Teaches |
| - | ---- | ------- |
| 1 | **Firefly Flash**: one click sets off a chain reaction of fireflies | drawing, the game loop, variables, lists & loops, `if`, clicks, sound, game states, saving |
| 2 | **Penguin Slide**: an ice puzzle where you slide until something stops you | grids, levels as text, `while` loops, keys & swipes, tweens, undo, progress |
| 3 | **Planet Putt**: mini-golf in space, where planets bend every shot | velocity, acceleration, gravity, drag-to-aim, bouncing, predicting paths, levels as data |

## Open the tutorials

Open **`tutorials/index.html`** in a browser. That's it: no server, no
install. The pages run the real js-game-zero engine with editable code next
to each game, and work straight from disk.

Each tutorial has:

- **Live code cells.** Edit the code and press ▶ Run (or Ctrl/⌘ + Enter). Lines new in each step glow green. Edits are saved in the browser; ↺ Reset restores them.
- **Challenges that check themselves** by watching the running game, with hints and a "Show me" answer.
- **Quizzes, sliders bound to constants in the code, live-value panels**, and custom widgets (a dt race, a circle-touch toy, a level painter, a gravity explorer…).
- **A download button** that zips the learner's game (`main.js`, art, font, README) to keep playing in the js-game-zero sandbox or with `jgz`.

`tutorials/play.html?game=penguin_slide` plays any finished game full-size.

## Layout

```
games/<game>/            each game as a jgz project: main.js, images/, fonts/
tutorials/
  index.html             the hub
  <game>.html            the three tutorials
  play.html              full-size player
  steps/<game>/NN-*.js   every tutorial step, each a complete runnable game
  lib/                   the tutorial framework (see lib/README.md),
                         the engine (jgz.js) and generated data bundles
tests/                   play-through tests that drive each game with jgz
scripts/                 build, checks, solvers and the Firefly tuner
shared/fonts/            Fredoka (SIL OFL), used by all three games
```

The last step of each tutorial *is* `games/<game>/main.js`, so a tutorial
can't drift away from its game.

## Commands

Needs [Bun](https://bun.sh) and a js-game-zero checkout next to this folder
(`../js-game-zero`, built with `bun run build`).

```sh
bun install                         # Playwright, for the checks
bun run build                       # copy the engine + bundle art and steps into tutorials/lib
bun run jgz -- test games/planet_putt   # drive a game with the jgz CLI

bun run test:games                  # play-through tests for all three games (via jgz)
bun run check:steps                 # run every tutorial step through jgz
bun run check:tutorials             # open every page in Chromium and run every cell
bun scripts/solve-penguin.ts        # prove every Penguin level solvable at par
bun scripts/tune-firefly.ts         # re-measure Firefly Flash's night goals
```

Run `bun run build` after changing any art, step or `main.js`.

## Credits

Built on js-game-zero (MIT). All game art was drawn as SVG for these games.
Font: [Fredoka](https://github.com/hafontia/Fredoka-One), © 2016 The Fredoka
Project Authors, SIL Open Font License (`shared/fonts/OFL.txt`).
