# {{TITLE}}

TODO: what the game is and how a round goes, in a short paragraph.

**Controls:** TODO.

**Learn to build it:** [`tutorials/{{PAGE}}`](../../tutorials/{{PAGE}})
walks a complete beginner through making this game from an empty screen.

## Run it

Play it from the hub: open [`tutorials/index.html`](../../tutorials/index.html) and press
**Play** on its card.

To test it, the jgz CLI runs it in headless Chromium. From the jgz-tutorial folder:

```sh
bun run jgz -- test games/{{ID}}
```

To keep building it outside this repo, use the js-game-zero sandbox, which runs from a
clone of its repository
([Getting started](https://github.com/Leaf-Learning/js-game-zero/blob/main/docs/getting-started.md)
says how). Make a blank game, paste `main.js` into the editor, and add `images/` and
`fonts/` from the Images and Fonts panels on the left.

## What's inside

| Path                | What it is                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| `main.js`           | The whole game, written to be read by beginners.                             |
| `images/`           | TODO: the hand-made SVG art.                                                 |
| `fonts/fredoka.ttf` | Fredoka SemiBold, under the SIL Open Font License (`FONT-LICENSE-OFL.txt`). |
| `tutorial.json`     | How the game appears on the tutorials hub and the play page.                 |
