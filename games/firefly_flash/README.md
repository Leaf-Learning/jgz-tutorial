# Firefly Flash

A cozy chain-reaction game. Fireflies drift across a night meadow; you get
**one click** per night. Your click sends out a flash of light, every firefly
it touches flashes too, and their light catches more. Light up enough
fireflies to clear each of the eight nights. Every flash plays the next note
of a pentatonic scale, so big chains play little tunes.

**Controls:** click or tap. That's it.

**Learn to build it:** [`tutorials/firefly-flash.html`](../../tutorials/firefly-flash.html)
walks a complete beginner through making this game from an empty screen.

## Run it

```sh
# headless check with the jgz CLI (from the repo root)
bun run jgz -- test games/firefly_flash

# or open it in the js-game-zero sandbox: make a blank game, paste
# main.js, and add images/ and fonts/ from the Images and Fonts panels
```

## What's inside

| Path                   | What it is                                                       |
| ---------------------- | ---------------------------------------------------------------- |
| `main.js`              | The whole game (~300 lines, written to be read by beginners).    |
| `images/`              | Hand-made SVG art: fireflies (2 wing frames, dim and lit), moon, meadow, jar. |
| `fonts/fredoka.ttf`    | Fredoka SemiBold, under the SIL Open Font License (`FONT-LICENSE-OFL.txt`). |

Difficulty was tuned by simulation: each night's goal is what a well-placed
click lights up most of the time, while a random click usually falls short.
`tests/firefly_flash.test.ts` plays the game through `jgz` to check that
losing, retrying, winning, saving progress and later nights all work.
