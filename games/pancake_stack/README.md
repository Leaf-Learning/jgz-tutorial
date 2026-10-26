# Pancake Stack

A catch-and-stack arcade game made with [js-game-zero](https://github.com/Leaf-Learning/js-game-zero).
A bear chef slides left and right under a sky that rains pancakes. Every pancake
you catch lands on top of the stack, and the stack gets taller and wobblier with
each one. Miss three pancakes and the game is over.

## How a game goes

- Pancakes fall from the clouds. Slide so the top of your stack is under one, and
  it lands. Miss, and it falls past the plate and costs a heart.
- The tower sways more the higher it gets, and you have to aim at where its top
  is _now_, not at the bear.
- A tower of ten is served to a customer: 10 bonus points, and a fresh plate.
- The kitchen gets busier as your score climbs: breakfast, brunch, a lunch rush,
  a dinner rush and a midnight snack, each with faster and more frequent pancakes
  (the `RUSHES` table in `main.js`).
- Your best score is saved.

## Controls

| Action          | Keys                  | Touch / mouse                    |
| --------------- | --------------------- | -------------------------------- |
| Slide the bear  | Arrow keys or A and D | Move the mouse, or drag a finger |
| Start / play on | Space or Enter        | Click or tap                     |

## Run it

```sh
bun run jgz -- test games/pancake_stack          # from the jgz-tutorial folder
```

Or make a blank project in the js-game-zero sandbox, paste `main.js` into the
editor, and upload `images/*.svg` and `fonts/fredoka.ttf` through the Assets
panel.

The tutorial that builds this game step by step is
[`tutorials/pancake-stack.html`](../../tutorials/pancake-stack.html).
`bun test tests/pancake_stack.test.ts` plays the real game through the `jgz` CLI,
and `bun scripts/tune-pancakes.ts` plays it with bots to check the difficulty.

## What's inside

| Path                | What it is                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `main.js`           | The whole game, written to be read by beginners.                                             |
| `images/`           | The hand-made SVG art: the bear (idle, happy, ouch), three pancakes, a cloud and two hearts. |
| `fonts/fredoka.ttf` | Fredoka SemiBold, under the SIL Open Font License (`FONT-LICENSE-OFL.txt`).                  |
| `tutorial.json`     | How the game appears on the tutorials hub and the play page.                                 |

## Credits

Art drawn for this project (SVG). The font is Fredoka, under the SIL Open Font
License — see `FONT-LICENSE-OFL.txt`.
