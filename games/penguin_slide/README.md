# Penguin Slide

A sliding-ice puzzle game made with [js-game-zero](https://github.com/taharafiq/js-game-zero).
Press an arrow and the penguin slides until something stops it. Eat every fish
to clear the level, in as few moves as you can.

## Controls

| Action           | Keys                      | Touch / mouse               |
| ---------------- | ------------------------- | --------------------------- |
| Slide            | Arrow keys or W A S D     | Swipe (drag) in a direction |
| Undo             | Z                         | **Undo** button in the HUD  |
| Restart level    | R                         | **Reset** button in the HUD |
| Start / continue | Space or Enter            | Tap                         |
| Pick a level     | ← / → on the title screen | Tap the left or right side  |
| Back to title    | Escape                    |                             |

## Tiles

| Letter | Tile       | What it does                                      |
| ------ | ---------- | ------------------------------------------------- |
| `#`    | rock       | Stops the penguin on the tile before it           |
| `.`    | ice        | Keeps the penguin sliding                         |
| `*`    | snow       | Stops the penguin **on** it                       |
| `O`    | water hole | Splash! The level restarts                        |
| `F`    | fish       | Eaten when the penguin slides over or stops on it |
| `P`    | penguin    | Where the penguin starts                          |

Each level's `par` is the fewest moves that eats every fish.
`bun scripts/solve-penguin.ts` proves it with a breadth-first search, and
`bun test tests/penguin_slide.test.ts` checks every level and plays the real
game through the `jgz` CLI.

## Run it

```sh
bun run jgz -- test games/penguin_slide          # from the jgz-tutorial folder
```

Or make a blank project in the js-game-zero sandbox, paste `main.js` into the
editor, and upload `images/*.svg` and `fonts/fredoka.ttf` through the Assets
panel.

The tutorial that builds this game step by step is
[`tutorials/penguin-slide.html`](../../tutorials/penguin-slide.html).

## Credits

Art drawn for this project (SVG). The font is Fredoka, under the SIL Open Font
License — see `FONT-LICENSE-OFL.txt`.
