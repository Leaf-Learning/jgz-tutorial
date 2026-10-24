# {{TITLE}}

TODO: what the game is and how a round goes, in a short paragraph.

**Controls:** TODO.

**Learn to build it:** [`tutorials/{{PAGE}}`](../../tutorials/{{PAGE}})
walks a complete beginner through making this game from an empty screen.

## Run it

```sh
# headless check with the jgz CLI (from the repo root)
bun run jgz -- test games/{{ID}}

# or open it in the js-game-zero sandbox: make a blank project, paste
# main.js, and upload images/ and fonts/ through the Assets panel
```

## What's inside

| Path                | What it is                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| `main.js`           | The whole game, written to be read by beginners.                             |
| `images/`           | TODO: the hand-made SVG art.                                                 |
| `fonts/fredoka.ttf` | Fredoka SemiBold, under the SIL Open Font License (`FONT-LICENSE-OFL.txt`). |
| `tutorial.json`     | How the game appears on the tutorials hub and the play page.                 |
