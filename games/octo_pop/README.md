# Octo Pop

Octo the octopus pops word bubbles. Bubbles with words inside float up from the sea floor, and you type a word to pop its bubble before it reaches the surface. Letters you have typed turn pink, a wrong letter makes Octo wince, and each bubble that escapes costs a heart. Pop enough bubbles to clear a level; there are five, with longer words and faster bubbles each time. Your best score is saved.

**Controls:** Type the letters of a word (capitals count the same as small letters). Backspace erases a letter. Enter, Space or a click starts the game and moves on from the win and lose screens. It needs a keyboard.

**Learn to build it:** [`tutorials/octo-pop.html`](../../tutorials/octo-pop.html)
walks a complete beginner through making this game from an empty screen.

## Run it

```sh
# headless check with the jgz CLI (from the repo root)
bun run jgz -- test games/octo_pop

# or open it in the js-game-zero sandbox: make a blank project, paste
# main.js, and upload images/ and fonts/ through the Assets panel
```

## What's inside

| Path                | What it is                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `main.js`           | The whole game, written to be read by beginners.                                                |
| `images/`           | The hand-made SVG art: Octo (idle, happy, ouch), bubble, fish, hearts, tray, sky and sea floor. |
| `fonts/fredoka.ttf` | Fredoka SemiBold, under the SIL Open Font License (`FONT-LICENSE-OFL.txt`).                     |
| `tutorial.json`     | How the game appears on the tutorials hub and the play page.                                    |
