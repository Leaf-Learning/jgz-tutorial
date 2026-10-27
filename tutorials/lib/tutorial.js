/*
 * js-game-zero tutorial framework.
 *
 * Turns plain HTML markup into an interactive lesson: live code cells that run
 * the real js-game-zero engine, sliders bound to constants in the code,
 * auto-checked challenges, quizzes, a progress bar, and a downloadable
 * project zip. No dependencies and no server: it runs from file://.
 *
 * Page contract (see tutorials/lib/README.md for the full reference):
 *
 *   <body data-game="firefly_flash" data-tutorial="Firefly Flash">
 *     <section class="step" data-title="...">          one TOC entry
 *       <div class="cell" data-step="03-move"></div>    a live code cell
 *       <div class="tweak" data-name="SPEED" ...></div> a slider for a constant
 *       <div class="challenge" data-id="..."></div>     an auto-checked task
 *       <div class="quiz" data-answer="b"></div>        a multiple-choice quiz
 *     </section>
 *     <script> JGZT.challenge("id", (game) => ...); JGZT.start(); </script>
 */
(() => {
  "use strict";

  const JGZT = (window.JGZT = window.JGZT || {});
  const games = (JGZT.games = JGZT.games || {});
  const checks = {};
  const cells = [];
  const cellsById = new Map();
  const listeners = new Set();
  let activeCell = null;
  let pageGame = null;
  let pageKey = "";
  const pageTitle = document.title;

  JGZT.register = (key, data) => {
    games[key] = data;
    // Every picture decoded once, for every run of every cell, so a game
    // sees each image's size from its first line.
    data.imagesReady = JGZ.loadImages(data.assets).then((images) => {
      data.images = images;
    });
  };

  /* ------------------------------------------------------------------ *
   * Small helpers
   * ------------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  function h(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "html") node.innerHTML = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(child));
    }
    return node;
  }

  const escapeHtml = (text) =>
    text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function debounce(fn, ms) {
    let timer = 0;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // localStorage can be missing or throw (private windows, blocked storage);
  // the lesson must keep working without it.
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage unavailable: progress just won't persist */
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
  JGZT.store = store;

  /* ------------------------------------------------------------------ *
   * Syntax highlighting
   * ------------------------------------------------------------------ */

  const KEYWORDS = new Set(
    "let const var function return if else for while do of in new break continue switch case default typeof true false null undefined this class extends try catch finally throw async await".split(
      " ",
    ),
  );
  const ENGINE = new Set(
    "screen Actor keyboard keys keymods mouse clock animate tone sounds music storage images randomInt randomChoice clamp rgb Rect ZRect exit".split(
      " ",
    ),
  );
  const SETTINGS = new Set("WIDTH HEIGHT TITLE ICON TOUCH_CONTROLS PIXEL_DENSITY".split(" "));
  const HOOKS = new Set(
    "draw update onMouseDown onMouseUp onMouseMove onKeyDown onKeyUp onMusicEnd".split(" "),
  );
  const BUILTINS = new Set("Math console JSON Number String Array Object Infinity NaN".split(" "));

  const TOKEN =
    /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\[\s\S])*`?)|(\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b|\.\d+\b)|([A-Za-z_$][\w$]*)|(=>|[-+*/%=<>!&|^~?:]+)|([()[\]{}.,;])|(\s+)|([\s\S])/g;

  function tokenize(code) {
    const tokens = [];
    let previous = "";
    let match;
    TOKEN.lastIndex = 0;
    while ((match = TOKEN.exec(code))) {
      const [text, comment, string, number, word, operator, punct, space] = match;
      let type = "";
      if (comment) type = "com";
      else if (string) type = "str";
      else if (number) type = "num";
      else if (word) {
        const after = code.slice(TOKEN.lastIndex).match(/^\s*(\(|=\s*(?:\([^)]*\)|\w+)\s*=>)/);
        if (previous === ".") type = after ? "fn" : "prop";
        else if (KEYWORDS.has(word)) type = "kw";
        else if (SETTINGS.has(word)) type = "set";
        else if (HOOKS.has(word) && after) type = "hook";
        else if (ENGINE.has(word)) type = "eng";
        else if (BUILTINS.has(word)) type = "bi";
        else if (/^[A-Z][A-Z0-9_]+$/.test(word)) type = "const";
        else if (after) type = "fn";
      } else if (operator) type = "op";
      else if (punct) type = "pun";
      tokens.push({ text, type });
      if (!space) previous = text;
    }
    return tokens;
  }

  /** Renders code as an array of line HTML strings. */
  function highlightLines(code) {
    const lines = [""];
    for (const { text, type } of tokenize(code)) {
      const parts = text.split("\n");
      parts.forEach((part, index) => {
        if (index > 0) lines.push("");
        if (part) {
          const safe = escapeHtml(part);
          lines[lines.length - 1] += type ? `<span class="t-${type}">${safe}</span>` : safe;
        }
      });
    }
    return lines;
  }
  JGZT.highlight = (code) => highlightLines(code).join("\n");

  /** Indexes of lines in `next` that are new or changed compared to `prev`. */
  function changedLines(prev, next) {
    const a = prev.split("\n");
    const b = next.split("\n");
    const n = a.length;
    const m = b.length;
    const width = m + 1;
    const table = new Uint16Array((n + 1) * (m + 1));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        table[i * width + j] =
          a[i] === b[j]
            ? table[(i + 1) * width + j + 1] + 1
            : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
      }
    }
    const changed = new Set();
    let i = 0;
    let j = 0;
    while (j < m) {
      if (i < n && a[i] === b[j]) {
        i++;
        j++;
      } else if (i < n && table[(i + 1) * width + j] >= table[i * width + j + 1]) {
        i++;
      } else {
        if (b[j].trim()) changed.add(j);
        j++;
      }
    }
    return changed;
  }

  /* ------------------------------------------------------------------ *
   * Editor: a textarea over a highlighted <pre>, so typing stays native
   * (undo, selection, IME, screen readers) and colours are drawn beneath.
   * ------------------------------------------------------------------ */

  class Editor {
    constructor(parent, code, { onChange, onRun, label }) {
      this.onChange = onChange;
      this.onRun = onRun;
      this.marks = { new: new Set(), err: new Set(), ref: new Set() };
      this.root = h("div", { class: "ed" });
      this.gutter = h("div", { class: "ed-gutter", "aria-hidden": "true" });
      this.hl = h("div", { class: "ed-hl", "aria-hidden": "true" });
      this.ta = h("textarea", {
        class: "ed-ta",
        spellcheck: "false",
        autocapitalize: "off",
        autocomplete: "off",
        autocorrect: "off",
        wrap: "off",
        "aria-label": label || "Game code",
      });
      this.ta.value = code;
      this.root.append(h("div", { class: "ed-inner" }, this.gutter, h("div", { class: "ed-code" }, this.hl, this.ta)));
      parent.append(this.root);
      this.ta.addEventListener("input", () => {
        this.render();
        this.revealCaret();
        this.onChange?.(this.value);
      });
      this.ta.addEventListener("keydown", (event) => this.keydown(event));
      this.ta.addEventListener("click", () => this.revealCaret());
      this.render();
    }

    get value() {
      return this.ta.value;
    }

    set value(code) {
      this.ta.value = code;
      this.render();
    }

    render() {
      const lines = highlightLines(this.ta.value);
      let gutter = "";
      let body = "";
      lines.forEach((html, index) => {
        const classes = ["l"];
        if (this.marks.new.has(index)) classes.push("is-new");
        if (this.marks.ref.has(index)) classes.push("is-ref");
        if (this.marks.err.has(index)) classes.push("is-err");
        body += `<div class="${classes.join(" ")}">${html || " "}</div>`;
        gutter += `<div class="${classes.join(" ")}">${index + 1}</div>`;
      });
      this.hl.innerHTML = body;
      this.gutter.innerHTML = gutter;
    }

    setMarks(kind, lineIndexes) {
      this.marks[kind] = new Set(lineIndexes);
      this.render();
    }

    lineHeight() {
      return parseFloat(getComputedStyle(this.ta).lineHeight) || 20;
    }

    /** Scrolls the editor so a line (0-based) sits comfortably in view. */
    scrollToLine(index, { center = false } = {}) {
      const lh = this.lineHeight();
      const top = index * lh;
      const view = this.root.clientHeight;
      if (center || top < this.root.scrollTop || top > this.root.scrollTop + view - lh * 2) {
        this.root.scrollTop = Math.max(0, top - (center ? view / 3 : lh * 2));
      }
    }

    revealCaret() {
      const before = this.ta.value.slice(0, this.ta.selectionStart);
      const line = before.split("\n").length - 1;
      const lh = this.lineHeight();
      const top = line * lh;
      const view = this.root.clientHeight;
      if (top < this.root.scrollTop) this.root.scrollTop = top;
      else if (top + lh * 2 > this.root.scrollTop + view) this.root.scrollTop = top + lh * 2 - view;
      const column = before.length - before.lastIndexOf("\n") - 1;
      const charWidth = this.charWidth();
      const left = column * charWidth + 56;
      const width = this.root.clientWidth;
      if (left > this.root.scrollLeft + width - 24) this.root.scrollLeft = left - width + 48;
      else if (left - 56 < this.root.scrollLeft) this.root.scrollLeft = Math.max(0, left - 80);
    }

    charWidth() {
      if (!this._charWidth) {
        const probe = h("span", { class: "ed-probe" }, "0000000000");
        this.hl.append(probe);
        this._charWidth = probe.getBoundingClientRect().width / 10 || 8;
        probe.remove();
      }
      return this._charWidth;
    }

    insert(text) {
      this.ta.focus();
      // execCommand keeps the browser's undo history intact.
      if (!document.execCommand("insertText", false, text)) {
        this.ta.setRangeText(text, this.ta.selectionStart, this.ta.selectionEnd, "end");
        this.ta.dispatchEvent(new Event("input"));
      }
    }

    keydown(event) {
      const ta = this.ta;
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        this.onRun?.();
        return;
      }
      if (event.key === "Escape") {
        ta.blur();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        const { selectionStart: start, selectionEnd: end, value } = ta;
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        if (start === end && !event.shiftKey) {
          this.insert("  ");
          return;
        }
        // Indent or dedent every selected line.
        const lineEnd = value.indexOf("\n", end - 1) === -1 ? value.length : value.indexOf("\n", end - 1);
        const block = value.slice(lineStart, lineEnd);
        const changed = event.shiftKey
          ? block.replace(/^ {1,2}/gm, "")
          : block.replace(/^/gm, "  ");
        ta.setSelectionRange(lineStart, lineEnd);
        this.insert(changed);
        ta.setSelectionRange(lineStart, lineStart + changed.length);
        return;
      }
      if (event.key === "Enter" && !event.shiftKey && !event.altKey) {
        const { selectionStart: start, value } = ta;
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const indent = value.slice(lineStart, start).match(/^\s*/)[0];
        const before = value.slice(lineStart, start).trimEnd();
        const extra = /[{([]$/.test(before) ? "  " : "";
        event.preventDefault();
        const next = value.slice(start).match(/^[ \t]*[})\]]/);
        if (extra && next) {
          this.insert(`\n${indent}${extra}\n${indent}`);
          const caret = start + 1 + indent.length + extra.length;
          ta.setSelectionRange(caret, caret);
        } else {
          this.insert(`\n${indent}${extra}`);
        }
        this.revealCaret();
      }
    }
  }
  JGZT.Editor = Editor;

  /* ------------------------------------------------------------------ *
   * Friendly error messages
   * ------------------------------------------------------------------ */

  function explainError(message) {
    const tips = [
      [/Did you mean/, "The engine has a guess at what you meant — check the spelling against its suggestion. Capital letters matter!"],
      [/is not defined/, "JavaScript doesn't know that name. Check the spelling (capital letters count!) and make sure you created it with <code>let</code> or <code>const</code> before using it."],
      [/Unexpected end of input|missing \) |Unexpected token|Invalid or unexpected token|expected expression|Unexpected identifier|Unexpected string|Unexpected number/i, "The punctuation is tangled — usually a missing <code>(</code> <code>)</code> <code>{</code> <code>}</code>, a comma, or a quote mark. Look at this line and the one just above it. Every opening bracket needs a closing partner."],
      [/is not a function/, "Something was called with <code>()</code> but it isn't a function. Check the spelling of the function's name."],
      [/Cannot read propert|undefined is not an object|null is not an object/, "The code asked for a property (the part after a dot) of something that doesn't exist yet. Is a variable misspelled, or used before it gets a value?"],
      [/Assignment to constant/, "A <code>const</code> can't be changed after it's created. Use <code>let</code> for values that change."],
      [/has already been declared/, "Two things were created with the same name. Each <code>let</code>/<code>const</code> name can only be created once — remove the extra <code>let</code>."],
      [/MissingAsset|No image|Could not load|not find/i, "There's no picture with that name. Asset names are lowercase, like <code>\"firefly_1\"</code> — check the name against the art tray."],
      [/draw\(\) must not|draw must not/i, "<code>draw()</code> must have empty brackets — it's <code>update(dt)</code> that gets <code>dt</code>."],
    ];
    for (const [pattern, tip] of tips) if (pattern.test(message)) return tip;
    return "Read the message carefully — it usually names the exact thing that went wrong. Then look at the highlighted line.";
  }

  /* ------------------------------------------------------------------ *
   * Console capture: console.log from the running game shows in its cell.
   * ------------------------------------------------------------------ */

  for (const method of ["log", "info", "warn", "error"]) {
    const original = console[method].bind(console);
    console[method] = (...args) => {
      original(...args);
      if (activeCell?.capturing) activeCell.logLine(method, args);
    };
  }

  /* ------------------------------------------------------------------ *
   * Cells: an editor plus a live game.
   * ------------------------------------------------------------------ */

  const GAME_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Spacebar"]);

  class Cell {
    constructor(root, index) {
      this.root = root;
      this.index = index;
      this.stepKey = root.dataset.step;
      this.id = root.id || `cell-${this.stepKey}`;
      this.storeKey = `jgzt:${pageKey}:code:${this.id}`;
      this.game = pageGame;
      const original = this.game.steps[this.stepKey];
      if (original === undefined) throw new Error(`No step "${this.stepKey}" in ${pageKey}`);
      this.original = original;
      const order = this.game.order;
      const previousKey = root.dataset.diffFrom || order[order.indexOf(this.stepKey) - 1];
      this.previous = previousKey ? this.game.steps[previousKey] : "";
      this.playOnly = root.hasAttribute("data-play-only");
      this.handle = null;
      this.ranOnce = false;
      this.runCode = null;
      this.build();
    }

    build() {
      // Saved edits remember which version of the step they were made on, so
      // an updated tutorial never shows a learner stale code.
      const saved = store.get(this.storeKey, null);
      const fresh = saved && typeof saved === "object" && saved.base === fingerprint(this.original);
      const code = this.playOnly || !fresh ? this.original : saved.code;
      this.root.classList.add(this.playOnly ? "cell--play" : "cell--code");
      this.root.textContent = "";

      const stageBox = h("div", { class: "stage-box" });
      this.stage = h("div", {
        class: "stage",
        tabindex: "0",
        "aria-label": "Game — click to play. Press Escape to leave the game.",
      });
      this.canvasHolder = h("div", { class: "stage-canvas" });
      this.overlay = h(
        "button",
        { class: "stage-play", type: "button", onclick: () => this.run({ focus: true }) },
        h("span", { class: "stage-play-icon", "aria-hidden": "true" }, "▶"),
        h("span", { class: "stage-play-label" }, this.playOnly ? "Play" : "Run"),
      );
      this.focusTip = h("div", { class: "stage-tip" }, "Click the game to use the keyboard");
      this.stage.append(this.canvasHolder, this.overlay, this.focusTip);
      this.stage.addEventListener("keydown", (event) => {
        if (event.key === "Escape") this.stage.blur();
        if (GAME_KEYS.has(event.key)) event.preventDefault();
      });
      this.stage.addEventListener("mousedown", () => {
        if (this.handle && document.activeElement !== this.stage) this.stage.focus({ preventScroll: true });
      });
      // js-game-zero reports the scroll wheel as a mouse button, so scrolling
      // the page past a running game would click it. Cells keep wheel events
      // to the page unless they opt in with data-wheel.
      if (!this.root.hasAttribute("data-wheel")) {
        this.stage.addEventListener("wheel", (event) => event.stopPropagation(), { capture: true, passive: true });
      }
      this.stage.addEventListener("focus", () => this.root.classList.add("is-focused"));
      this.stage.addEventListener("blur", () => this.root.classList.remove("is-focused"));

      this.output = h("div", { class: "output", "aria-live": "polite" });
      stageBox.append(this.stage);

      const watch = this.root.dataset.watch;
      if (watch) {
        this.watchPaths = watch.split(",").map((p) => p.trim()).filter(Boolean);
        this.watchBox = h("div", { class: "watch" }, h("div", { class: "watch-title" }, "🔍 Live values"));
        this.watchRows = new Map();
        for (const path of this.watchPaths) {
          const value = h("code", { class: "watch-value" }, "—");
          this.watchRows.set(path, value);
          this.watchBox.append(h("div", { class: "watch-row" }, h("code", { class: "watch-name" }, path), value));
        }
        stageBox.append(this.watchBox);
      }
      stageBox.append(this.output);

      if (this.playOnly) {
        this.root.append(stageBox);
        this.observe();
        return;
      }

      const editorBox = h("div", { class: "editor-box" });
      const bar = h("div", { class: "cell-bar" });
      this.runButton = h(
        "button",
        { class: "btn btn-run", type: "button", title: "Run (Ctrl/⌘ + Enter)", onclick: () => this.run({ focus: true }) },
        "▶ Run",
      );
      this.resetButton = h(
        "button",
        { class: "btn btn-ghost", type: "button", title: "Put the code back the way this step started", onclick: () => this.reset() },
        "↺ Reset",
      );
      this.newToggle = h(
        "button",
        { class: "btn btn-ghost btn-new", type: "button", "aria-pressed": "true", title: "Highlight the lines that are new in this step", onclick: () => this.toggleNew() },
        "✨ New lines",
      );
      const download = h(
        "button",
        { class: "btn btn-ghost", type: "button", title: "Download this code and its art as a project you can open in the js-game-zero sandbox", onclick: () => JGZT.downloadProject(this.editor.value) },
        "⬇ Download",
      );
      this.badge = h("span", { class: "cell-badge" });
      bar.append(this.runButton, this.resetButton, this.newToggle, h("span", { class: "spacer" }), this.badge, download);
      editorBox.append(bar);
      this.editor = new Editor(editorBox, code, {
        label: `Code for ${this.root.closest(".step")?.dataset.title || "this step"}`,
        onRun: () => this.run(),
        onChange: (value) => this.changed(value),
      });
      if (this.root.dataset.height) this.editor.root.style.maxHeight = this.root.dataset.height;
      this.root.append(editorBox, stageBox);
      this.showNew = true;
      this.refreshMarks();
      this.updateBadge();
      this.observe();
      requestAnimationFrame(() => this.scrollToFirstNew());
    }

    observe() {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            this.visible = entry.isIntersecting;
            if (entry.isIntersecting && !this.previewed) this.preview();
            if (this.handle) {
              if (entry.isIntersecting) this.handle.resume();
              else this.handle.pause();
            }
          }
        },
        { rootMargin: "200px 0px" },
      );
      observer.observe(this.root);
    }

    get code() {
      return this.playOnly ? this.original : this.editor.value;
    }

    changed(value) {
      if (value === this.original) store.remove(this.storeKey);
      else saveCode(this.storeKey, { code: value, base: fingerprint(this.original) });
      this.refreshMarks();
      this.updateBadge();
      this.root.classList.toggle("is-stale", this.handle !== null && value !== this.runCode);
      if (this.editor.marks.err.size) this.editor.setMarks("err", []);
    }

    updateBadge() {
      if (!this.badge) return;
      const edited = this.editor.value !== this.original;
      this.badge.textContent = edited ? "✏️ edited" : "";
      this.resetButton.disabled = !edited;
    }

    refreshMarks() {
      if (!this.editor) return;
      this.editor.setMarks("new", this.showNew && this.previous ? changedLines(this.previous, this.editor.value) : []);
    }

    toggleNew() {
      this.showNew = !this.showNew;
      this.newToggle.setAttribute("aria-pressed", String(this.showNew));
      this.refreshMarks();
    }

    scrollToFirstNew() {
      if (!this.editor || !this.showNew || this.root.hasAttribute("data-no-scroll")) return;
      const first = Math.min(...this.editor.marks.new);
      if (Number.isFinite(first)) this.editor.scrollToLine(first, { center: true });
    }

    reset() {
      this.editor.value = this.original;
      store.remove(this.storeKey);
      this.changed(this.original);
      this.scrollToFirstNew();
      if (this.handle) this.run();
    }

    /** Replaces the code (used by tweak sliders) and optionally reruns it. */
    setCode(code, { rerun = true } = {}) {
      if (this.playOnly) return;
      this.editor.value = code;
      this.changed(code);
      if (rerun) this.run();
    }

    stop({ keepFrame = true } = {}) {
      if (!this.handle) return;
      const handle = this.handle;
      this.handle = null;
      handle.stop();
      this.capturing = false;
      this.root.classList.remove("is-running", "is-stale");
      if (!keepFrame) this.canvasHolder.textContent = "";
      if (activeCell === this) activeCell = null;
      emit("stop", this);
    }

    freshCanvas() {
      this.canvasHolder.textContent = "";
      const canvas = h("canvas", { class: "game-canvas" });
      this.canvasHolder.append(canvas);
      return canvas;
    }

    start(code, options) {
      const canvas = this.freshCanvas();
      this.clearOutput();
      this.diagnostics = [];
      let handle;
      try {
        handle = JGZ.run(code, {
          canvas,
          assetUrls: this.game.assets,
          // A run started before they're decoded loads them itself.
          ...(this.game.images ? { preloadedAssets: { images: this.game.images } } : {}),
          projectId: `jgzt-${pageKey}`,
          keyboardTarget: this.stage,
          diagnostics: (d) => this.diagnostic(d),
          ...options,
        });
      } catch (error) {
        document.title = pageTitle;
        if (!this.diagnostics.some((d) => d.severity === "error")) {
          this.showError({ message: String(error?.message || error) });
        }
        return null;
      }
      document.title = pageTitle;
      handle.ready.catch((error) => {
        if (!this.diagnostics.some((d) => d.severity === "error"))
          this.showError({ message: String(error?.message || error) });
      });
      return handle;
    }

    /** Draws the code's first frame without running it, as a poster. */
    async preview() {
      this.previewed = true;
      await this.game.imagesReady;
      if (this.handle) return;
      // A poster run never hears the keyboard: it only draws a frame.
      const handle = this.start(this.code, { autostart: false, keyboardTarget: h("div") });
      if (!handle) return;
      this.previewHandle = handle;
      try {
        await handle.ready;
        if (this.previewHandle === handle) handle.step(0);
        // Fonts named in draw() only start loading during that first frame;
        // draw the poster again once they've arrived.
        await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]);
        if (this.previewHandle === handle) handle.step(0);
      } catch {
        /* errors are shown by start() */
      }
      this.cancelPreview(handle);
      this.stage.classList.add("has-preview");
    }

    cancelPreview(handle = this.previewHandle) {
      if (!handle) return;
      handle.stop();
      if (this.previewHandle === handle) this.previewHandle = null;
    }

    run({ focus = false } = {}) {
      if (activeCell && activeCell !== this) activeCell.stop();
      this.stop();
      this.cancelPreview();
      const code = this.code;
      this.runCode = code;
      activeCell = this;
      this.capturing = true;
      const handle = this.start(code, {});
      this.stage.classList.add("has-preview");
      if (!handle) {
        activeCell = null;
        this.capturing = false;
        return;
      }
      this.handle = handle;
      this.root.classList.toggle("uses-keys", /\bkeyboard\.|\bonKeyDown\b|\bonKeyUp\b/.test(code));
      this.root.classList.add("is-running");
      this.root.classList.remove("is-stale");
      if (this.editor) this.editor.setMarks("err", []);
      if (focus) this.stage.focus({ preventScroll: true });
      const firstRun = !this.ranOnce;
      this.ranOnce = true;
      progress.mark(`ran:${this.id}`);
      if (!this.visible) handle.pause();
      emit("run", this);
      if (firstRun) emit("first-run", this);
    }

    diagnostic(d) {
      this.diagnostics.push(d);
      if (d.severity === "error") {
        this.showError(d);
        if (this.handle) {
          this.root.classList.remove("is-running");
          this.capturing = false;
          this.handle = null;
          if (activeCell === this) activeCell = null;
        }
      } else if (d.code !== "duplicate-config") {
        this.showHint(d);
      }
    }

    clearOutput() {
      this.output.textContent = "";
      this.logCount = 0;
    }

    showError(d) {
      const message = String(d.message || "Something went wrong").replace(/^(startup|update|draw|clock|asset|input) failed: /, "");
      const line = d.line;
      const box = h(
        "div",
        { class: "msg msg-error" },
        h("div", { class: "msg-title" }, "🐞 ", line ? `Oops — line ${line}` : "Oops — the game stopped"),
        h("div", { class: "msg-text" }, message),
        h("div", { class: "msg-tip", html: explainError(message) }),
      );
      if (line && this.editor) {
        this.editor.setMarks("err", [line - 1]);
        this.editor.scrollToLine(line - 1, { center: true });
        box.append(
          h("button", { class: "btn btn-small", type: "button", onclick: () => this.editor.scrollToLine(line - 1, { center: true }) }, `Show line ${line}`),
        );
      }
      this.output.prepend(box);
      this.stage.classList.add("has-error");
      setTimeout(() => this.stage.classList.remove("has-error"), 600);
    }

    showHint(d) {
      if (!d.message) return;
      this.output.append(
        h("div", { class: "msg msg-hint" }, h("div", { class: "msg-title" }, "💡 ", d.line ? `A hint about line ${d.line}` : "A hint"), h("div", { class: "msg-text" }, d.message)),
      );
    }

    logLine(method, args) {
      this.logCount = (this.logCount || 0) + 1;
      if (this.logCount > 60) return;
      let log = $(".log", this.output);
      if (!log) {
        log = h("div", { class: "log" }, h("div", { class: "log-title" }, "🖨 console.log"));
        this.output.append(log);
      }
      const text = args.map((value) => formatValue(value)).join(" ");
      log.append(h("div", { class: `log-line log-${method}` }, this.logCount === 60 ? "… (more lines hidden)" : text));
      log.scrollTop = log.scrollHeight;
    }

    /** A safe view of the live game for challenge checks. */
    view() {
      const handle = this.handle;
      const inspector = handle ? JGZ.getGameInspector(handle) : null;
      const read = (path) => {
        if (!inspector) return undefined;
        try {
          return inspector.read(path);
        } catch {
          return undefined;
        }
      };
      return {
        running: Boolean(handle),
        code: this.code,
        read,
        has: (name) => typeof read(name) === "function",
        drawn: () => read("$drawn") || [],
        call: (name, ...args) => {
          const fn = read(name);
          return typeof fn === "function" ? fn(...args) : undefined;
        },
        cell: this,
      };
    }

    tickWatch() {
      if (!this.watchRows) return;
      const view = this.view();
      for (const [path, node] of this.watchRows) {
        const text = view.running ? formatValue(view.read(path), true) : "—";
        if (node.textContent !== text) {
          node.textContent = text;
          node.classList.remove("flash");
          void node.offsetWidth;
          node.classList.add("flash");
        }
      }
    }
  }

  const saveCode = debounce((key, value) => store.set(key, value), 300);

  // A short, stable hash of some text (FNV-1a), to tell code versions apart.
  function fingerprint(text) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(36);
  }

  function formatValue(value, short = false) {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
    if (typeof value === "string") return short ? JSON.stringify(value) : value;
    if (typeof value === "boolean") return String(value);
    if (typeof value === "function") return `function ${value.name || ""}`;
    if (Array.isArray(value)) {
      if (short) return `[ ${value.length} item${value.length === 1 ? "" : "s"} ]`;
      return `[${value.slice(0, 8).map((v) => formatValue(v, true)).join(", ")}${value.length > 8 ? ", …" : ""}]`;
    }
    if (typeof value === "object") {
      if (value.constructor?.name === "Actor") return `Actor(${JSON.stringify(value.image)}) at ${Math.round(value.x)}, ${Math.round(value.y)}`;
      try {
        const entries = Object.entries(value).slice(0, 5);
        return `{ ${entries.map(([k, v]) => `${k}: ${typeof v === "object" && v !== null ? "…" : formatValue(v, true)}`).join(", ")}${Object.keys(value).length > 5 ? ", …" : ""} }`;
      } catch {
        return String(value);
      }
    }
    return String(value);
  }
  JGZT.formatValue = formatValue;

  function cellFor(node) {
    const id = node.dataset.cell;
    if (id) return cellsById.get(id) || cells.find((cell) => cell.stepKey === id);
    // Otherwise, the cell this node talks about: within its own step, the
    // nearest code cell above it, or else the step's first code cell (prose
    // often introduces code before showing it). Outside a step, the nearest
    // cell above it in the page.
    const before = (cell) => cell.root.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING;
    const section = node.closest(".step");
    if (section) {
      const own = cells.filter((cell) => section.contains(cell.root));
      const code = own.filter((cell) => !cell.playOnly);
      const pool = code.length ? code : own;
      if (pool.length) return pool.filter(before).at(-1) || pool[0];
    }
    return cells.filter(before).at(-1) || null;
  }
  JGZT.cell = (id) => cellsById.get(id) || cells.find((cell) => cell.stepKey === id);

  /* ------------------------------------------------------------------ *
   * Tweaks: sliders and colour pickers bound to a constant in the code.
   * ------------------------------------------------------------------ */

  function setupTweak(root) {
    const cell = cellFor(root);
    const name = root.dataset.name;
    const type = root.dataset.type || "number";
    const label = root.dataset.label || name;
    const pattern = new RegExp(
      type === "color"
        ? `(\\b(?:const|let)\\s+${name}\\s*=\\s*)(["'])(#[0-9a-fA-F]{3,8})\\2`
        : `(\\b(?:const|let)\\s+${name}\\s*=\\s*)(-?\\d+(?:\\.\\d+)?)`,
    );
    const current = () => {
      const match = cell?.code.match(pattern);
      return match ? (type === "color" ? match[3] : Number(match[2])) : null;
    };
    const value = current();
    const output = h("output", { class: "tweak-value" });
    const input =
      type === "color"
        ? h("input", { type: "color", value: value ?? "#ffffff", "aria-label": label })
        : h("input", {
            type: "range",
            min: root.dataset.min ?? 0,
            max: root.dataset.max ?? 100,
            step: root.dataset.step ?? 1,
            value: value ?? 0,
            "aria-label": label,
          });
    const note = h("div", { class: "tweak-note" });
    root.textContent = "";
    root.append(
      h("div", { class: "tweak-head" }, h("span", { class: "tweak-icon", "aria-hidden": "true" }, root.dataset.icon || "🎛"), h("label", { class: "tweak-label" }, label), output),
      input,
      h("div", { class: "tweak-code" }, h("code", {}, `${type === "color" ? "const" : "const"} ${name} = `), h("code", { class: "tweak-code-value" }, "")),
      note,
    );
    const show = (v) => {
      output.textContent = type === "color" ? v : `${v}${root.dataset.unit || ""}`;
      $(".tweak-code-value", root).textContent = type === "color" ? `"${v}";` : `${v};`;
    };
    if (value === null) {
      input.disabled = true;
      note.textContent = `Can't find "${name}" in the code above — press ↺ Reset there to bring it back.`;
    } else show(value);
    const apply = debounce((v) => {
      const code = cell.code;
      if (!pattern.test(code)) {
        note.textContent = `Can't find "${name}" in the code above — press ↺ Reset there to bring it back.`;
        return;
      }
      note.textContent = "";
      const next = code.replace(pattern, (_, start, quote) => (type === "color" ? `${start}${quote}${v}${quote}` : `${start}${v}`));
      cell.setCode(next, { rerun: true });
      progress.mark(`tweak:${name}`);
    }, 120);
    input.addEventListener("input", () => {
      show(input.value);
      apply(input.value);
    });
    on("change", (changed) => {
      if (changed !== cell) return;
      const v = current();
      if (v === null) {
        input.disabled = true;
        return;
      }
      input.disabled = false;
      note.textContent = "";
      if (String(v) !== input.value) {
        input.value = v;
        show(v);
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Challenges: tasks checked automatically against the running game.
   * ------------------------------------------------------------------ */

  JGZT.challenge = (id, check) => {
    checks[id] = check;
  };

  const challenges = [];
  // scripts/check-challenges.ts reads these to find each challenge's cell.
  JGZT.challenges = challenges;

  function setupChallenge(root) {
    const id = root.dataset.id;
    const cell = cellFor(root);
    const done = progress.has(`challenge:${id}`);
    const hints = $$(".hint", root);
    const answer = $(".answer", root);
    hints.forEach((hint) => hint.remove());
    answer?.remove();
    const body = h("div", { class: "challenge-body" }, ...root.childNodes);
    const status = h("div", { class: "challenge-status" });
    const tools = h("div", { class: "challenge-tools" });
    root.textContent = "";
    root.append(
      h("div", { class: "challenge-badge", "aria-hidden": "true" }, h("span", { class: "challenge-icon" }, "🎯"), h("span", { class: "challenge-check" }, "✓")),
      h("div", { class: "challenge-main" }, h("div", { class: "challenge-kicker" }, root.dataset.kicker || "Your turn"), body, status, tools),
    );
    const revealed = [];
    let shown = 0;
    if (hints.length) {
      const hintButton = h("button", { class: "btn btn-small btn-soft", type: "button" }, `💡 Hint (${hints.length})`);
      hintButton.addEventListener("click", () => {
        if (shown < hints.length) {
          const hint = h("div", { class: "hint-box" }, h("strong", {}, `Hint ${shown + 1}: `), ...hints[shown].childNodes);
          revealed.push(hint);
          tools.before(hint);
          shown += 1;
          hintButton.textContent = shown < hints.length ? `💡 Another hint (${hints.length - shown})` : "💡 No more hints";
          hintButton.disabled = shown >= hints.length;
        }
      });
      tools.append(hintButton);
    }
    if (answer) {
      const code = answer.textContent.replace(/^\n+|\s+$/g, "");
      const answerButton = h("button", { class: "btn btn-small btn-soft", type: "button" }, "👀 Show me");
      answerButton.addEventListener("click", () => {
        answerButton.remove();
        const pre = h("pre", { class: "answer-box code-block", html: JGZT.highlight(code) });
        tools.before(h("div", { class: "answer-wrap" }, h("div", { class: "answer-label" }, answer.dataset.label || "One way to do it:"), pre));
      });
      tools.append(answerButton);
    }
    const challenge = { id, root, cell, status, done };
    challenges.push(challenge);
    if (done) markChallenge(challenge, { quiet: true });
    else status.textContent = cell ? "Edit the code, then press ▶ Run — I'll check it while it runs." : "";
  }

  function markChallenge(challenge, { quiet = false } = {}) {
    challenge.done = true;
    challenge.root.classList.add("is-done");
    challenge.status.innerHTML = `<strong>Nailed it!</strong> ${challenge.root.dataset.success || "Challenge complete."}`;
    progress.mark(`challenge:${challenge.id}`);
    if (!quiet) {
      celebrate(challenge.root);
      emit("challenge", challenge);
    }
  }

  function tickChallenges() {
    for (const challenge of challenges) {
      if (challenge.done || !challenge.cell || challenge.cell !== activeCell) continue;
      const check = checks[challenge.id];
      if (!check) continue;
      let result;
      try {
        result = check(challenge.cell.view());
      } catch {
        result = false;
      }
      if (result === true) markChallenge(challenge);
      else if (typeof result === "string") challenge.status.textContent = result;
    }
  }

  /* ------------------------------------------------------------------ *
   * Quizzes
   * ------------------------------------------------------------------ */

  function setupQuiz(root, index) {
    const id = root.dataset.id || `quiz-${index}`;
    const answer = root.dataset.answer;
    const explains = new Map($$(".explain", root).map((node) => [node.dataset.for, node]));
    for (const node of explains.values()) node.remove();
    const feedback = h("div", { class: "quiz-feedback", "aria-live": "polite" });
    const choices = $$("[data-choice]", root);
    const kicker = h("div", { class: "quiz-kicker" }, root.dataset.kicker || "🤔 Quick quiz");
    root.prepend(kicker);
    const choiceBox = h("div", { class: "quiz-choices" });
    choices[0]?.before(choiceBox);
    for (const choice of choices) {
      choiceBox.append(choice);
      choice.classList.add("quiz-choice");
      choice.setAttribute("type", "button");
      choice.addEventListener("click", () => {
        const right = choice.dataset.choice === answer;
        choice.classList.add(right ? "is-right" : "is-wrong");
        const explain = explains.get(choice.dataset.choice) || explains.get(right ? "right" : "wrong");
        feedback.innerHTML = "";
        feedback.className = `quiz-feedback ${right ? "is-right" : "is-wrong"}`;
        feedback.append(h("strong", {}, right ? "Yes! " : "Not quite. "), ...(explain ? [...explain.cloneNode(true).childNodes] : [right ? "" : "Have another go."]));
        if (right) {
          root.classList.add("is-done");
          for (const other of choices) other.disabled = true;
          if (!progress.has(`quiz:${id}`)) {
            progress.mark(`quiz:${id}`);
            celebrate(choice, { small: true });
          }
        } else {
          sfx.oops();
        }
      });
    }
    root.append(feedback);
    if (progress.has(`quiz:${id}`)) {
      root.classList.add("is-done");
      const right = choices.find((c) => c.dataset.choice === answer);
      right?.classList.add("is-right");
      for (const other of choices) other.disabled = true;
      const explain = explains.get(answer) || explains.get("right");
      feedback.className = "quiz-feedback is-right";
      feedback.append(h("strong", {}, "Yes! "), ...(explain ? [...explain.cloneNode(true).childNodes] : []));
    }
  }

  /* ------------------------------------------------------------------ *
   * Code references: hovering <code class="ref" data-match="..."> lights
   * up the matching lines in the nearest cell's editor.
   * ------------------------------------------------------------------ */

  function setupRef(node) {
    const cell = cellFor(node);
    if (!cell?.editor) return;
    node.tabIndex = 0;
    const lines = () => {
      const code = cell.editor.value.split("\n");
      if (node.dataset.lines) {
        const result = [];
        for (const part of node.dataset.lines.split(",")) {
          const [from, to = from] = part.split("-").map(Number);
          for (let i = from; i <= to; i++) result.push(i - 1);
        }
        return result;
      }
      const needle = node.dataset.match || node.textContent;
      return code.flatMap((line, index) => (line.includes(needle) ? [index] : []));
    };
    const enter = () => {
      const found = lines();
      cell.editor.setMarks("ref", found);
      if (found.length) cell.editor.scrollToLine(found[0], { center: true });
    };
    const leave = () => cell.editor.setMarks("ref", []);
    node.addEventListener("mouseenter", enter);
    node.addEventListener("focus", enter);
    node.addEventListener("mouseleave", leave);
    node.addEventListener("blur", leave);
  }

  /* ------------------------------------------------------------------ *
   * Progress: ran cells, solved challenges and quizzes, stored per page.
   * ------------------------------------------------------------------ */

  const progress = {
    items: new Set(),
    total: 0,
    load() {
      this.items = new Set(store.get(`jgzt:${pageKey}:progress`, []));
    },
    has(item) {
      return this.items.has(item);
    },
    mark(item) {
      if (this.items.has(item)) return;
      this.items.add(item);
      store.set(`jgzt:${pageKey}:progress`, [...this.items]);
      renderProgress();
    },
    reset() {
      this.items.clear();
      store.remove(`jgzt:${pageKey}:progress`);
    },
  };
  JGZT.progress = progress;

  let trackedItems = [];
  function renderProgress() {
    const done = trackedItems.filter((item) => progress.has(item)).length;
    const total = trackedItems.length || 1;
    const percent = Math.round((done / total) * 100);
    const bar = $(".progress-fill");
    if (bar) bar.style.width = `${percent}%`;
    const label = $(".progress-label");
    if (label) label.textContent = `${percent}%`;
    for (const entry of $$(".toc-item")) {
      const items = entry._items || [];
      entry.classList.toggle("is-done", items.length > 0 && items.every((item) => progress.has(item)));
    }
    if (percent === 100 && trackedItems.length && !renderProgress.cheered) {
      renderProgress.cheered = true;
      if (renderProgress.ready) {
        setTimeout(() => {
          celebrate(document.body, { big: true });
          emit("complete");
        }, 500);
      }
    }
    document.body.classList.toggle("is-complete", percent === 100);
  }

  function itemsIn(section) {
    return [
      ...$$(".cell:not([data-play-only])", section).map((node) => `ran:${node.id || `cell-${node.dataset.step}`}`),
      ...$$(".challenge", section).map((node) => `challenge:${node.dataset.id}`),
      ...$$(".quiz", section).map((node, i) => `quiz:${node.dataset.id || `quiz-${$$(".quiz").indexOf(node)}`}`),
    ];
  }

  function buildChrome() {
    const title = document.body.dataset.tutorial || document.title;
    const steps = $$("section.step");
    trackedItems = steps.flatMap((section) => itemsIn(section));
    // The hub page reads these to show "how far along" on each tutorial card.
    store.set(`jgzt:${pageKey}:items`, trackedItems);

    const header = h(
      "header",
      { class: "topbar" },
      h("a", { class: "topbar-home", href: "index.html", title: "All tutorials" }, h("img", { class: "topbar-logo", src: "lib/jgz-logo.svg", alt: "" }), h("span", {}, "jgz tutorials")),
      h("div", { class: "topbar-title" }, title),
      h(
        "div",
        { class: "progress", role: "progressbar", "aria-label": "Your progress" },
        h("div", { class: "progress-track" }, h("div", { class: "progress-fill" })),
        h("span", { class: "progress-label" }, "0%"),
      ),
      h("button", { class: "btn btn-icon toc-toggle", type: "button", "aria-label": "Steps", "aria-expanded": "false", onclick: () => toggleToc() }, "☰"),
      h("button", { class: "btn btn-icon mute-toggle", type: "button", "aria-label": "Sound effects", onclick: () => toggleMute() }, sfx.muted ? "🔇" : "🔊"),
    );
    document.body.prepend(header);

    const toc = h("nav", { class: "toc", "aria-label": "Steps" }, h("div", { class: "toc-title" }, "Steps"));
    const list = h("ol", { class: "toc-list" });
    steps.forEach((section, index) => {
      if (!section.id) section.id = `step-${index + 1}`;
      const item = h("li", { class: "toc-item" }, h("a", { href: `#${section.id}` }, h("span", { class: "toc-dot", "aria-hidden": "true" }), h("span", { class: "toc-text" }, section.dataset.title || `Step ${index + 1}`)));
      item._items = itemsIn(section);
      item._section = section;
      list.append(item);
      const kicker = $(".step-kicker", section);
      if (kicker && !kicker.textContent.trim()) kicker.textContent = `Step ${index + 1}`;
    });
    toc.append(list);
    toc.addEventListener("click", (event) => {
      if (event.target.closest("a")) toggleToc(false);
    });
    document.body.append(toc);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const item of $$(".toc-item")) item.classList.toggle("is-current", item._section === entry.target);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    steps.forEach((section) => observer.observe(section));
  }

  function toggleToc(force) {
    const open = force ?? !document.body.classList.contains("toc-open");
    document.body.classList.toggle("toc-open", open);
    $(".toc-toggle")?.setAttribute("aria-expanded", String(open));
  }

  function toggleMute() {
    sfx.muted = !sfx.muted;
    store.set("jgzt:muted", sfx.muted);
    const button = $(".mute-toggle");
    if (button) button.textContent = sfx.muted ? "🔇" : "🔊";
  }

  /* ------------------------------------------------------------------ *
   * Sound effects and confetti
   * ------------------------------------------------------------------ */

  const sfx = {
    muted: store.get("jgzt:muted", false),
    ctx: null,
    play(notes, { type = "triangle", gap = 0.07, length = 0.18, volume = 0.12 } = {}) {
      if (this.muted) return;
      try {
        this.ctx ??= new (window.AudioContext || window.webkitAudioContext)();
        const start = this.ctx.currentTime + 0.01;
        notes.forEach((frequency, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.value = frequency;
          const t = start + i * gap;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
          osc.connect(gain).connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + length + 0.02);
        });
      } catch {
        /* no audio available */
      }
    },
    success() {
      this.play([523.25, 659.25, 783.99, 1046.5]);
    },
    small() {
      this.play([659.25, 987.77], { gap: 0.08 });
    },
    big() {
      this.play([523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5], { gap: 0.1, length: 0.3 });
    },
    oops() {
      this.play([220, 196], { type: "sine", gap: 0.09, volume: 0.08 });
    },
  };
  JGZT.sfx = sfx;

  let confetti = null;
  function celebrate(anchor, { small = false, big = false } = {}) {
    if (big) sfx.big();
    else if (small) sfx.small();
    else sfx.success();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!confetti) {
      const canvas = h("canvas", { class: "confetti", "aria-hidden": "true" });
      document.body.append(canvas);
      confetti = { canvas, ctx: canvas.getContext("2d"), parts: [], running: false };
    }
    const colors = (getComputedStyle(document.body).getPropertyValue("--confetti") || "#ffd166,#ef476f,#06d6a0,#118ab2").split(",").map((c) => c.trim());
    const box = anchor.getBoundingClientRect();
    const count = big ? 220 : small ? 30 : 90;
    for (let i = 0; i < count; i++) {
      const fromTop = big;
      confetti.parts.push({
        x: fromTop ? Math.random() * innerWidth : box.left + box.width * (0.2 + Math.random() * 0.6),
        y: fromTop ? -20 - Math.random() * innerHeight * 0.5 : box.top + Math.min(box.height, 80) / 2,
        vx: (Math.random() - 0.5) * (fromTop ? 120 : 520),
        vy: fromTop ? 60 + Math.random() * 120 : -260 - Math.random() * 380,
        size: 5 + Math.random() * 6,
        spin: Math.random() * Math.PI,
        vs: (Math.random() - 0.5) * 12,
        color: colors[i % colors.length],
        life: big ? 4.5 : 1.8 + Math.random() * 0.6,
        shape: Math.random() < 0.3 ? "circle" : "rect",
      });
    }
    if (!confetti.running) {
      confetti.running = true;
      let last = performance.now();
      const frame = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const { canvas, ctx, parts } = confetti;
        if (canvas.width !== innerWidth * devicePixelRatio) {
          canvas.width = innerWidth * devicePixelRatio;
          canvas.height = innerHeight * devicePixelRatio;
        }
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (const p of parts) {
          p.vy += 520 * dt;
          p.vx *= 0.99;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.spin += p.vs * dt;
          p.life -= dt;
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin);
          ctx.fillStyle = p.color;
          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
        confetti.parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
        if (confetti.parts.length) requestAnimationFrame(frame);
        else {
          confetti.running = false;
          ctx.clearRect(0, 0, innerWidth, innerHeight);
        }
      };
      requestAnimationFrame(frame);
    }
  }
  JGZT.celebrate = celebrate;

  /* ------------------------------------------------------------------ *
   * Project download: a .zip with main.js, the art, and a README.
   * ------------------------------------------------------------------ */

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  /** A minimal uncompressed ("stored") zip writer. */
  function makeZip(files) {
    const encoder = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    for (const { name, data } of files) {
      const nameBytes = encoder.encode(name);
      const bytes = typeof data === "string" ? encoder.encode(data) : data;
      const crc = crc32(bytes);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true);
      local.setUint16(8, 0, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, bytes.length, true);
      local.setUint32(22, bytes.length, true);
      local.setUint16(26, nameBytes.length, true);
      chunks.push(new Uint8Array(local.buffer), nameBytes, bytes);
      const entry = new DataView(new ArrayBuffer(46));
      entry.setUint32(0, 0x02014b50, true);
      entry.setUint16(4, 20, true);
      entry.setUint16(6, 20, true);
      entry.setUint16(8, 0x0800, true);
      entry.setUint32(16, crc, true);
      entry.setUint32(20, bytes.length, true);
      entry.setUint32(24, bytes.length, true);
      entry.setUint16(28, nameBytes.length, true);
      entry.setUint32(42, offset, true);
      central.push(new Uint8Array(entry.buffer), nameBytes);
      offset += 30 + nameBytes.length + bytes.length;
    }
    const centralSize = central.reduce((sum, part) => sum + part.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);
    return new Blob([...chunks, ...central, new Uint8Array(end.buffer)], { type: "application/zip" });
  }

  function dataUrlBytes(url) {
    const [, meta, payload] = url.match(/^data:([^,]*),(.*)$/s);
    if (meta.endsWith(";base64")) {
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }
    return new TextEncoder().encode(decodeURIComponent(payload));
  }

  JGZT.downloadProject = (code) => {
    const name = pageKey;
    const files = [{ name: `${name}/main.js`, data: code }];
    for (const [path, url] of Object.entries(pageGame.assets)) files.push({ name: `${name}/${path}`, data: dataUrlBytes(url) });
    // The zip's asset folders (images/, fonts/…), each added to the sandbox
    // from the panel of the same name.
    const folders = [...new Set(Object.keys(pageGame.assets).map((path) => path.split("/")[0]))];
    const list = (words) => (words.length > 1 ? `${words.slice(0, -1).join(", ")} and ${words.at(-1)}` : words.join(""));
    const panels = `${list(folders.map((folder) => folder[0].toUpperCase() + folder.slice(1)))} panel${folders.length > 1 ? "s" : ""}`;
    const readme = [
      `${document.body.dataset.tutorial || name} — a js-game-zero game`,
      "",
      folders.length ? `main.js is the game. The files it uses are in ${list(folders.map((folder) => `${folder}/`))}.` : "main.js is the game.",
      "",
      "To keep playing it and building it, use the js-game-zero sandbox. It runs",
      "on your computer and needs Bun (https://bun.sh). Set it up once:",
      "",
      "    git clone https://github.com/Leaf-Learning/js-game-zero.git",
      "    cd js-game-zero",
      "    bun install",
      "",
      "Then, in that js-game-zero folder, start it with  bun run dev:sandbox  and",
      "open the address it prints (http://127.0.0.1:4173). Make a blank game and",
      "put everything in main.js into its editor, in place of the code there.",
      ...(folders.length ? [`Then add the files in ${list(folders.map((folder) => `${folder}/`))}`, `from the ${panels} on the left.`] : []),
      "",
      "To test it from a terminal, there's the jgz tool. It runs the game in a",
      "browser you can't see, where you press keys, step through frames, read",
      "values and take screenshots. Install it once with:",
      "",
      "    bun add --global @js-game-zero/cli",
      "    jgz install-chromium",
      "",
      "Then, in this folder:  jgz test .",
      "",
      "Have fun!",
      "",
    ];
    files.push({ name: `${name}/README.txt`, data: readme.join("\n") });
    const link = h("a", { href: URL.createObjectURL(makeZip(files)), download: `${name}.zip` });
    document.body.append(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 1000);
  };

  /* ------------------------------------------------------------------ *
   * Events (page scripts can listen) and the art tray.
   * ------------------------------------------------------------------ */

  function on(event, fn) {
    const wrapped = (name, payload) => name === event && fn(payload);
    listeners.add(wrapped);
    return () => listeners.delete(wrapped);
  }
  function emit(event, payload) {
    for (const fn of listeners) fn(event, payload);
  }
  JGZT.on = on;

  function setupArtTray(root) {
    const filter = root.dataset.filter ? new RegExp(root.dataset.filter) : null;
    root.classList.add("art-tray");
    for (const [path, url] of Object.entries(pageGame.assets)) {
      if (!path.startsWith("images/")) continue;
      const name = path.slice(7).replace(/\.\w+$/, "");
      if (filter && !filter.test(name)) continue;
      root.append(
        h(
          "figure",
          { class: "art", title: `new Actor("${name}")` },
          h("div", { class: "art-pic" }, h("img", { src: url, alt: name })),
          h("figcaption", {}, h("code", {}, `"${name}"`)),
        ),
      );
    }
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ *
   * Widget helpers: sharp canvases, pointer positions and drags, in the
   * widget's own logical units (so drawing code never thinks in pixels).
   * ------------------------------------------------------------------ */

  /** Sizes a canvas for crisp drawing at width × height units; returns its 2D context. */
  JGZT.setupCanvas = (canvas, width, height) => {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return ctx;
  };

  /** Where a pointer event is on the canvas, in its width × height units. */
  JGZT.pointerAt = (canvas, event, width, height) => {
    const box = canvas.getBoundingClientRect();
    return [((event.clientX - box.left) / box.width) * width, ((event.clientY - box.top) / box.height) * height];
  };

  /** Calls handler(point, "down" | "move" | "up") as a mouse, pen or finger drags. Return false on "down" to ignore that press. */
  JGZT.onDrag = (canvas, width, height, handler) => {
    let active = false;
    canvas.addEventListener("pointerdown", (event) => {
      active = handler(JGZT.pointerAt(canvas, event, width, height), "down") !== false;
      if (active) canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (active) handler(JGZT.pointerAt(canvas, event, width, height), "move");
    });
    const end = (event) => {
      if (!active) return;
      active = false;
      handler(JGZT.pointerAt(canvas, event, width, height), "up");
    };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
  };

  /** A CSS colour from the page's theme, like JGZT.themeColor("--accent"). */
  JGZT.themeColor = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();

  JGZT.start = () => {
    pageKey = document.body.dataset.game;
    pageGame = games[pageKey];
    if (!pageGame) throw new Error(`No game data loaded for "${pageKey}". Did you run scripts/build.ts?`);
    progress.load();
    buildChrome();
    for (const pre of $$("pre.code-block")) pre.innerHTML = JGZT.highlight(pre.textContent.replace(/^\n+|\s+$/g, ""));
    $$(".cell").forEach((node, index) => {
      const cell = new Cell(node, index);
      cells.push(cell);
      cellsById.set(cell.id, cell);
    });
    $$(".art-tray").forEach(setupArtTray);
    $$(".tweak").forEach(setupTweak);
    $$(".challenge").forEach(setupChallenge);
    $$(".quiz").forEach(setupQuiz);
    $$("code.ref").forEach(setupRef);
    for (const button of $$("[data-reset-progress]")) {
      button.addEventListener("click", () => {
        if (!confirm("Start this tutorial over? Your progress and code edits on this page will be cleared.")) return;
        progress.reset();
        for (const cell of cells) store.remove(cell.storeKey);
        location.reload();
      });
    }
    // Let cells and tweaks hear about code edits.
    for (const cell of cells) {
      if (!cell.editor) continue;
      cell.editor.ta.addEventListener("input", () => emit("change", cell));
      const setCode = cell.setCode.bind(cell);
      cell.setCode = (code, options) => {
        setCode(code, options);
        emit("change", cell);
      };
      const reset = cell.reset.bind(cell);
      cell.reset = () => {
        reset();
        emit("change", cell);
      };
    }
    renderProgress();
    renderProgress.ready = true;
    setInterval(() => {
      tickChallenges();
      activeCell?.tickWatch();
    }, 250);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleToc(false);
    });
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  };
})();
