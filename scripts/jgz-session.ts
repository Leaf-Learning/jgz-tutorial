// A tiny driver for the `jgz test --json` protocol, shared by the game tests
// and the tutorial step checker. Each request gets an id; the matching
// response resolves its promise. Event lines (console output, page errors,
// diagnostics) are collected on `events` for later assertions.

import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
export const JGZ_CLI =
  process.env.JGZ_CLI ?? join(root, "../js-game-zero/packages/cli/src/cli.ts");

type Json = any;

export type JgzSession = {
  readonly ready: Json;
  readonly events: Json[];
  send(request: Record<string, unknown>): Promise<Json>;
  /** Runs `play` and returns its result, throwing if the request failed. */
  play(
    actions: Record<string, unknown>[],
    extra?: Record<string, unknown>,
  ): Promise<Json>;
  inspect(path: string): Promise<Json>;
  /** Calls one of the game's top-level functions that takes no arguments. */
  call(binding: string): Promise<Json>;
  /** Saves the canvas as a PNG (to `path`, or a temporary file) and returns where. */
  screenshot(path?: string): Promise<string>;
  close(): Promise<void>;
};

export async function openGame(
  projectDir: string,
  options: { seed?: string } = {},
): Promise<JgzSession> {
  const args = ["bun", JGZ_CLI, "test", projectDir, "--json"];
  if (options.seed !== undefined) args.push("--seed", options.seed);
  const proc = Bun.spawn(args, {
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });

  const events: Json[] = [];
  const pending = new Map<number, (value: Json) => void>();
  let resolveReady!: (value: Json) => void;
  let rejectReady!: (error: Error) => void;
  const ready = new Promise<Json>((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });

  (async () => {
    const decoder = new TextDecoder();
    let buffer = "";
    for await (const chunk of proc.stdout) {
      buffer += decoder.decode(chunk, { stream: true });
      let newline;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        let message: Json;
        try {
          message = JSON.parse(line);
        } catch {
          continue;
        }
        if (message.type === "response" && pending.has(message.id)) {
          pending.get(message.id)!(message);
          pending.delete(message.id);
        } else if (message.type === "response" && message.id === undefined) {
          rejectReady(new Error(message.error?.message ?? line));
        } else if (message.type === "event") {
          events.push(message);
          if (message.event === "ready") resolveReady(message);
        }
      }
    }
    rejectReady(new Error("jgz exited before it was ready"));
  })();

  const readyEvent = await Promise.race([
    ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("jgz did not start in 30s")), 30000),
    ),
  ]);

  let nextId = 1;
  const send = (request: Record<string, unknown>): Promise<Json> => {
    const id = nextId++;
    const response = new Promise<Json>((resolve) => pending.set(id, resolve));
    proc.stdin.write(JSON.stringify({ id, ...request }) + "\n");
    proc.stdin.flush();
    return response;
  };

  const session: JgzSession = {
    ready: readyEvent,
    events,
    send,
    async play(actions, extra = {}) {
      const response = await send({ command: "play", actions, ...extra });
      if (!response.ok) throw new Error(JSON.stringify(response));
      return response.result;
    },
    async inspect(path) {
      const response = await send({ command: "inspect", path });
      if (!response.ok) throw new Error(JSON.stringify(response));
      return response.result;
    },
    async call(binding) {
      const response = await send({ command: "call", binding });
      if (!response.ok) throw new Error(JSON.stringify(response));
      return response.result;
    },
    async screenshot(path) {
      const response = await send({
        command: "screenshot",
        ...(path ? { path } : {}),
      });
      if (!response.ok) throw new Error(JSON.stringify(response));
      return response.result.path;
    },
    async close() {
      try {
        await Promise.race([
          send({ command: "quit" }),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
      } finally {
        proc.kill();
        await proc.exited;
      }
    },
  };
  return session;
}

/** Shorthands for building `play` actions. */
export const act = {
  step: (count = 1, dt = 1 / 60) => ({ command: "step", count, dt }),
  seconds: (s: number) => ({
    command: "step",
    count: Math.round(s * 60),
    dt: 1 / 60,
  }),
  tap: (key: string) => ({ command: "key", action: "tap", key }),
  down: (key: string) => ({ command: "key", action: "down", key }),
  up: (key: string) => ({ command: "key", action: "up", key }),
  move: (x: number, y: number) => ({ command: "mouse", action: "move", x, y }),
  click: (x: number, y: number) => ({
    command: "mouse",
    action: "click",
    button: "left",
    x,
    y,
  }),
  press: (x: number, y: number) => ({
    command: "mouse",
    action: "down",
    button: "left",
    x,
    y,
  }),
  release: (x: number, y: number) => ({
    command: "mouse",
    action: "up",
    button: "left",
    x,
    y,
  }),
};
