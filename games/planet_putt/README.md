# Planet Putt

Mini-golf in space. Press anywhere, pull back like a slingshot, and let go:
planets pull the ball with gravity, bounce it off their faces, and the ball
comes to rest wherever the space dust stops it. Sink it in the swirling
wormhole in as few strokes as you can across six holes.

| Do this                   | To                                          |
| ------------------------- | ------------------------------------------- |
| Press, drag back, release | Aim and putt (the dots show where it'll go) |
| <kbd>R</kbd>              | Start the hole over                         |
| Click (between holes)     | Carry on                                    |

Leaving the screen costs a stroke and puts the ball back where you hit it.
Your best total is saved.

Concepts: velocity and acceleration as x/y pairs, gravity that fades with
distance, bouncing with surface normals, a fixed physics step, and
predicting the future by simulating it.

## Run it

Play it from the hub: open [`tutorials/index.html`](../../tutorials/index.html) and press
**Play** on its card.

To test it, the jgz CLI runs it in headless Chromium. From the jgz-tutorial folder:

```sh
bun run jgz -- test games/planet_putt
```

To keep building it outside this repo, use the js-game-zero sandbox, which runs from a
clone of its repository
([Getting started](https://github.com/Leaf-Learning/js-game-zero/blob/main/docs/getting-started.md)
says how). Make a blank game, paste `main.js` into the editor, and add `images/` and
`fonts/` from the Images and Fonts panels on the left.

The tutorial that builds this game step by step is
[`tutorials/planet-putt.html`](../../tutorials/planet-putt.html).

The font is Fredoka (SIL Open Font License, see `FONT-LICENSE-OFL.txt`).
Every hole is checked to be makeable within par by `scripts/solve-planet.ts`.
