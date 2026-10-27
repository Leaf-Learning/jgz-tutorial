# Writing the game's code

The finished `main.js` is the last step of the tutorial, so a beginner reads every line of it.
Write it like `games/*/main.js`: plain, top to bottom, and commented for someone curious.

## Shape of the file

```js
WIDTH = 720;              // the engine's settings come first, as bare globals
HEIGHT = 480;
TITLE = "Frog Feast";

// Tuning: change these to change how the game feels.
const BUG_SPEED = 90;     // pixels per second       ← one per line, so sliders can bind to them
const TONGUE_TIME = 0.25; // seconds to reach out

const EVENINGS = [ … ];   // levels as data, with a comment explaining the format

let state = "title";      // "title", "playing", "won", "lost" or "finished"
let score = 0;
let best = storage.get("best", 0);

const frog = new Actor("frog_idle", { midBottom: [360, 440] });

function startEvening(index) { … }   // helpers: small, named for what they do,
function catchBug(bug) { … }         // with a one-line comment when the name isn't enough

function onMouseDown(pos, button) { … }   // the engine's hooks
function update(dt) { … }
function draw() { … }                     // draw() calls drawPond(), drawBugs(), drawHud()…

startEvening(0);                          // any setup the title screen needs
```

## Style rules

- **Beginner JavaScript only:** `const`/`let`, functions, `if`/`else`, `for … of`, counting `for`,
  `while`, arrays and plain objects, template strings. No classes, `this`, closures that matter,
  destructuring tricks, `?.` chains, `reduce`, or clever one-liners. An arrow function is fine
  as a callback (`clock.schedule(() => …, 1)`).
- **Names say what things are:** `fireflies`, `startFlash`, `SKY_BOTTOM`, never `ff`, `fn`, `tmp`.
  Tuning constants are `UPPER_SNAKE`.
- **Comments say why, in plain words.** A short comment above each function and on each
  tuning constant. No essays: the page does the teaching.
- **State is a string.** `let state = "title"`, with `if (state === "playing")` in `update`, `draw`
  and the input hooks. The tutorial teaches it as a state machine.
- **Levels and difficulty are data:** an array of objects (or strings for grids) near the top.
- **Text through one helper,** like `write(text, x, y, size, color)`, which sets
  `fontname: "fredoka"` and a soft shadow.
- **Saving:** `storage.get(key, fallback)` and `storage.set(key, value)` for best level or score.
- **Sound:** `tone.play(note, seconds, { waveform, volume })` is enough. No sound files needed.
- Run `bun run format` (Prettier) so the steps and the final game are formatted identically.

## Engine notes (js-game-zero)

Full reference: `node_modules/@js-game-zero/core/dist/reference/*.md` (hooks, screen, actor,
clock, audio, storage, runtime). Things worth knowing up front:

- **Hooks:** `draw()`, `update(dt)`, `onMouseDown(pos, button)`, `onMouseUp(pos, button)`,
  `onMouseMove(pos, rel, buttons)`, `onKeyDown(key)`, `onKeyUp(key)`. `keyboard.left` etc. for
  held keys. `keys.LEFT` etc. for comparing in `onKeyDown`. `mouse.pos` for the pointer.
- **The scroll wheel arrives as `onMouseDown`** with `mouse.WHEEL_UP` or `mouse.WHEEL_DOWN`. For
  click games, start `onMouseDown` with `if (button !== mouse.LEFT) return;`. Touch taps and drags
  arrive as left-button mouse events, so mouse games work on phones for free.
- **Keys on phones:** add swipe support (as Penguin Slide does: press, then compare where
  `onMouseUp` lands). `TOUCH_CONTROLS` exists but is untested inside tutorial cells. A typing
  game (an `onKeyDown(key, unicode)` that reads letters, like Octo Pop) gets on-screen letter keys
  on touch screens for free.
- **Drawing short forms** (easiest for beginners): `screen.fill(top, bottom?)`,
  `screen.circle(x, y, r, color)`, `screen.rect(x, y, w, h, color)`, `screen.triangle(…)`,
  `screen.line(x1, y1, x2, y2, color, width)`, `screen.text(text, x, y, color, size)`,
  `screen.blit("name", [x, y])`. The short forms fill, but `screen.draw.circle` / `screen.draw.rect`
  only outline. For centred, styled text use
  `screen.draw.text(text, { center, size, color, fontname, shadow, shadowColor })`.
- **Actors:** `new Actor("name", { center: [x, y] })`. Flip-books use
  `{ images: ["fly_1", "fly_2"], fps: 12 }`. `actor.image = "frog_happy"` swaps the face.
  `actor.opacity`, `actor.angle`, `actor.scale`. You can add your own fields (`bug.speed = 40`).
- **`animate(obj, { x: 300, scale: 1.2, duration: 0.4, tween: "bounceEnd", onFinished })`** works on
  any numeric field. `clock.schedule(fn, seconds)` runs something later.
- **Images are ready from the first line.** `jgz`, tutorial cells and `play.html` decode every image
  before the game's code runs, so sizes and edge positions (`midBottom`) are right at the top level.
  A script that runs the game itself (a simulator or tuner) should do the same:
  `JGZ.run(source, { assetUrls, preloadedAssets: { images: await JGZ.loadImages(assetUrls) } })`.
  Without that, an image first used later holds frames until it loads, and `handle.step()` does
  nothing meanwhile.
- **Randomness is seeded** in `jgz test --seed` and `JGZ.run({ seed })`: `Math.random`,
  `randomInt` and `randomChoice` repeat exactly, so tests can rely on layouts.
- **Asset names:** lowercase letters, digits and underscores, starting with a letter. `fonts/`
  holds only font files. The jgz asset server refuses symlinks.
- **TITLE becomes the browser tab's title** when the game runs. The framework restores the
  page's title, so don't fight it.

## Driving the game from the command line

`scripts/jgz-session.ts` wraps the CLI's JSONL protocol:

```ts
import { act, openGame } from "../scripts/jgz-session";
const game = await openGame("games/frog_feast", { seed: "try" });
const result = await game.play([act.click(360, 240), act.seconds(1)], {
  inspect: ["state", "score", "bugs.length"],
});
await game.close();
```

`act` has `step(count)`, `seconds(s)`, `tap(key)`, `down(key)`, `up(key)`, `move(x, y)`,
`click(x, y)`, `press(x, y)`, and `release(x, y)`. Put `act.step(2)` between press, move and
release so the game sees a real drag.

- **Inspecting:** an Actor's own fields sit under `properties` in `inspect` results. Lists past 100
  items are summarised, so inspect exact paths (`bugs[0].x`) rather than whole long lists.
- **Calling:** `game.call("startEvening")` runs a top-level function that takes no arguments.
- **Pictures:** `await game.screenshot("shot.png")` saves the canvas. Then look at the image.

For tests, copy the patterns in `tests/*.test.ts`:

- Check `result.status.diagnostics` is empty.
- Click to start.
- Find a winning move from live state (or from a solver).
- Assert `state` changes.
- Restart and check what was saved.
