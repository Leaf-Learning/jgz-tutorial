/*!
 * @js-game-zero/browser-runtime 0.2.0
 * https://github.com/Leaf-Learning/js-game-zero
 *
 * MIT License
 *
 * Copyright (c) 2026 Taha Rafiq
 * Easing equations copyright (c) 2001 Robert Penner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  function __accessProp(key) {
    return this[key];
  }
  var __toCommonJS = (from) => {
    var entry = (__moduleCache ??= new WeakMap).get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function") {
      for (var key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(entry, key))
          __defProp(entry, key, {
            get: __accessProp.bind(from, key),
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
          });
    }
    __moduleCache.set(from, entry);
    return entry;
  };
  var __moduleCache;
  var __returnValue = (v) => v;
  function __exportSetter(name, newValue) {
    this[name] = __returnValue.bind(null, newValue);
  }
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: __exportSetter.bind(all, name)
      });
  };

  // packages/browser-runtime/src/browser.ts
  var exports_browser = {};
  __export(exports_browser, {
    validateAssetName: () => validateAssetName2,
    tweens: () => tweens2,
    tweenNames: () => tweenNames2,
    tone: () => tone2,
    storage: () => storage2,
    sounds: () => sounds2,
    setScreen: () => setScreen2,
    screen: () => screen2,
    run: () => run2,
    rgb: () => rgb2,
    randomInt: () => randomInt2,
    randomChoice: () => randomChoice2,
    parseToneFrequency: () => parseToneFrequency2,
    noteToFrequency: () => noteToFrequency2,
    normalizeWaveform: () => normalizeWaveform2,
    normalizeColor: () => normalizeColor2,
    music: () => music2,
    mouse: () => mouse2,
    mapBrowserWheelEvent: () => mapBrowserWheelEvent2,
    mapBrowserMouseEvent: () => mapBrowserMouseEvent2,
    mapBrowserMouseButton: () => mapBrowserMouseButton2,
    mapBrowserKeyEvent: () => mapBrowserKeyEvent2,
    layoutText: () => layoutText2,
    keys: () => keys2,
    keymods: () => keymods2,
    keyboard: () => keyboard2,
    images: () => images2,
    getScreen: () => getScreen2,
    getParameterNames: () => getParameterNames2,
    fonts: () => fonts2,
    fitTextboxFontSize: () => fitTextboxFontSize2,
    exit: () => exit2,
    distanceTo: () => distanceTo2,
    dispatchHook: () => dispatchHook2,
    defineGame: () => defineGame2,
    createToneGenerator: () => createToneGenerator2,
    createStorage: () => createStorage2,
    createSoundLoader: () => createSoundLoader2,
    createMusicPlayer: () => createMusicPlayer2,
    createMusicLoader: () => createMusicLoader2,
    createLocalStorageAdapter: () => createLocalStorageAdapter2,
    createInputDispatcher: () => createInputDispatcher2,
    createImageLoader: () => createImageLoader2,
    createFontLoader: () => createFontLoader2,
    createBrowserSoundAsset: () => createBrowserSoundAsset2,
    createAssetLoaders: () => createAssetLoaders2,
    collectRuntimeDiagnostics: () => collectRuntimeDiagnostics2,
    clock: () => clock2,
    clampVolume: () => clampVolume2,
    clamp: () => clamp3,
    buttonsFromBrowserButtons: () => buttonsFromBrowserButtons2,
    audioUnlock: () => audioUnlock2,
    assetUrl: () => assetUrl2,
    animate: () => animate2,
    angleTo: () => angleTo2,
    ZRect: () => ZRect2,
    ValueError: () => ValueError2,
    ToneGenerator: () => ToneGenerator2,
    Storage: () => Storage2,
    Screen: () => Screen2,
    Rect: () => Rect2,
    MusicPlayer: () => MusicPlayer2,
    MissingAssetError: () => MissingAssetError2,
    KeyboardState: () => KeyboardState2,
    JsonStorageError: () => JsonStorageError2,
    InvalidAssetNameError: () => InvalidAssetNameError2,
    InputDispatcher: () => InputDispatcher2,
    ImageSurface: () => ImageSurface2,
    DEFAULT_TONE_VOLUME: () => DEFAULT_TONE_VOLUME2,
    CreatedTone: () => CreatedTone2,
    Clock: () => Clock3,
    BrowserSoundAsset: () => BrowserSoundAsset2,
    AudioUnlockState: () => AudioUnlockState2,
    Animation: () => Animation2,
    Actor: () => Actor2
  });

  // packages/core/src/active-service.ts
  var activeServiceProxyBrand = Symbol("activeServiceProxy");
  function isActiveServiceProxy(value) {
    return (typeof value === "object" || typeof value === "function") && value !== null && value[activeServiceProxyBrand] === true;
  }
  function createActiveServiceProxy(getActive) {
    const proxy = new Proxy({}, {
      get(_proxyTarget, property) {
        if (property === activeServiceProxyBrand)
          return true;
        const target = getActive();
        if (target === proxy) {
          throw new Error("Active-service resolution returned the ambient proxy itself. " + "The public singleton export cannot be installed as its own " + "backing target; pass a concrete instance instead.");
        }
        const value = Reflect.get(target, property, target);
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(_proxyTarget, property, value) {
        const target = getActive();
        return Reflect.set(target, property, value, target);
      },
      deleteProperty(_proxyTarget, property) {
        return Reflect.deleteProperty(getActive(), property);
      },
      has(_proxyTarget, property) {
        if (property === activeServiceProxyBrand)
          return true;
        return Reflect.has(getActive(), property);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(getActive());
      },
      ownKeys() {
        return Reflect.ownKeys(getActive());
      },
      getOwnPropertyDescriptor(_proxyTarget, property) {
        const descriptor = Reflect.getOwnPropertyDescriptor(getActive(), property);
        return descriptor ? { ...descriptor, configurable: true } : undefined;
      }
    });
    return proxy;
  }

  // packages/core/src/util.ts
  function levenshtein(a, b) {
    const previous = Array.from({ length: b.length + 1 }, (_value, index) => index);
    const current = Array.from({ length: b.length + 1 }, () => 0);
    for (let i = 1;i <= a.length; i += 1) {
      current[0] = i;
      for (let j = 1;j <= b.length; j += 1) {
        current[j] = Math.min((previous[j] ?? 0) + 1, (current[j - 1] ?? 0) + 1, (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      for (let j = 0;j < previous.length; j += 1)
        previous[j] = current[j] ?? 0;
    }
    return previous[b.length] ?? 0;
  }
  function editDistance(a, b) {
    const rows = Array.from({ length: a.length + 1 }, (_value, i) => Array.from({ length: b.length + 1 }, (_cell, j) => i === 0 ? j : i));
    for (let i = 1;i <= a.length; i += 1) {
      for (let j = 1;j <= b.length; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let best = Math.min((rows[i - 1]?.[j] ?? 0) + 1, (rows[i]?.[j - 1] ?? 0) + 1, (rows[i - 1]?.[j - 1] ?? 0) + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          best = Math.min(best, (rows[i - 2]?.[j - 2] ?? 0) + 1);
        }
        rows[i][j] = best;
      }
    }
    return rows[a.length]?.[b.length] ?? 0;
  }
  function looseName(name) {
    return name.toLowerCase().replaceAll("_", "");
  }
  function closestName(name, candidates) {
    const loose = looseName(name);
    const threshold = loose.length < 6 ? 1 : 2;
    let best = null;
    for (const candidate of candidates) {
      if (candidate === name)
        continue;
      const candidateLoose = looseName(candidate);
      if (loose !== candidateLoose && loose.includes(candidateLoose))
        continue;
      const distance = editDistance(loose, candidateLoose);
      if (distance > threshold)
        continue;
      const exact = editDistance(name, candidate);
      if (!best || distance < best.distance || distance === best.distance && exact < best.exact) {
        best = { name: candidate, distance, exact };
      }
    }
    return best?.name;
  }
  function describeValue(value) {
    if (typeof value === "string")
      return `"${value}"`;
    if (typeof value === "number")
      return String(value);
    try {
      return JSON.stringify(value) ?? String(value);
    } catch {
      return String(value);
    }
  }
  function didYouMean(name, candidates) {
    const suggestion = closestName(name, candidates);
    return suggestion === undefined ? "" : ` Did you mean ${suggestion}?`;
  }
  function rejectUnknownOptions(options, allowed, label) {
    for (const key of Object.keys(options)) {
      if (allowed.has(key))
        continue;
      const suggestion = closestName(key, allowed) ?? (key.length >= 3 ? [...allowed].find((option) => option.startsWith(key)) : undefined);
      throw new TypeError(`${label} has no option called ${key}.${suggestion === undefined ? "" : ` Did you mean ${suggestion}?`}`);
    }
  }
  function isPromiseLike(value) {
    return typeof value === "object" && value !== null && typeof value.then === "function";
  }
  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }
  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }
  function requireFiniteNumber(value, label) {
    if (isFiniteNumber(value))
      return value;
    throw new TypeError(`${label} must be a finite number.`);
  }
  function isPair(value) {
    return Array.isArray(value) && value.length === 2 && isFiniteNumber(value[0]) && isFiniteNumber(value[1]);
  }
  function requirePoint(value, label) {
    if (isPair(value))
      return [value[0], value[1]];
    throw new TypeError(`${label} must be a two-number tuple.`);
  }
  function horizontalAnchorOffset(value, width) {
    if (typeof value === "number" && Number.isFinite(value))
      return value;
    if (value === "left")
      return 0;
    if (value === "center" || value === "middle")
      return width / 2;
    if (value === "right")
      return width;
    throw new TypeError("invalid horizontal anchor.");
  }
  function verticalAnchorOffset(value, height) {
    if (typeof value === "number" && Number.isFinite(value))
      return value;
    if (value === "top")
      return 0;
    if (value === "center" || value === "middle")
      return height / 2;
    if (value === "bottom")
      return height;
    throw new TypeError("invalid vertical anchor.");
  }
  var rectPositionKeys = [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
    "midTop",
    "midLeft",
    "midRight",
    "midBottom",
    "center"
  ];
  var imageExtensions = [
    "png",
    "gif",
    "jpg",
    "jpeg",
    "bmp",
    "webp",
    "svg"
  ];
  var soundExtensions = ["wav", "ogg", "mp3", "m4a"];

  // packages/core/src/friendly-names.ts
  var toolingProperties = new Set([
    "then",
    "toJSON",
    "constructor",
    "valueOf",
    "toString",
    "inspect",
    "asymmetricMatch",
    "nodeType",
    "$$typeof"
  ]);
  var guardedMembers = new WeakMap;
  function otherSpellings(name) {
    const words = name.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z0-9]+/g) ?? [];
    if (words.length < 2 || words.join("") !== name)
      return [];
    let spellings = [words[0].toLowerCase()];
    for (const word of words.slice(1)) {
      const lower = word.toLowerCase();
      spellings = spellings.flatMap((start) => [
        `${start}${lower}`,
        `${start}_${lower}`
      ]);
    }
    return spellings;
  }
  function guardSpellings(target, label, fields = []) {
    const names = new Set([...Object.getOwnPropertyNames(target), ...fields]);
    for (const name of names) {
      if (name === "constructor" || name.startsWith("_"))
        continue;
      for (const spelling of otherSpellings(name)) {
        if (spelling in target)
          continue;
        const message = `${label}.${spelling} doesn't exist. Did you mean ${label}.${name}?`;
        const fail = () => {
          throw new TypeError(message);
        };
        guardedMembers.set(fail, name);
        Object.defineProperty(target, spelling, {
          get: fail,
          set: fail,
          enumerable: false,
          configurable: true
        });
      }
    }
  }
  function guardedMember(target, property) {
    for (let current = target;current !== null; current = Object.getPrototypeOf(current)) {
      const descriptor = Object.getOwnPropertyDescriptor(current, property);
      if (descriptor) {
        return descriptor.get ? guardedMembers.get(descriptor.get) : undefined;
      }
    }
    return;
  }
  function isGuard(owner, name) {
    const getter = Object.getOwnPropertyDescriptor(owner, name)?.get;
    return getter !== undefined && guardedMembers.has(getter);
  }
  function memberNames(target) {
    const names = new Set;
    for (let current = target;current && current !== Object.prototype && current !== Function.prototype; current = Object.getPrototypeOf(current)) {
      for (const name of Object.getOwnPropertyNames(current)) {
        if (name === "constructor" || name.startsWith("_"))
          continue;
        if (!isGuard(current, name))
          names.add(name);
      }
    }
    return [...names];
  }
  var friendlyServices = new WeakMap;
  function friendlyService(target, label, options = {}) {
    const cached = friendlyServices.get(target);
    if (cached)
      return cached;
    const hidden = new Set(options.hidden ?? []);
    const nested = new Set(options.nested ?? []);
    const visibleNames = () => memberNames(target).filter((name) => !hidden.has(name));
    const bound = new Map;
    const proxy = new Proxy(target, {
      get(proxyTarget, property) {
        if (typeof property !== "string") {
          return Reflect.get(proxyTarget, property, proxyTarget);
        }
        if (hidden.has(property) || !(property in proxyTarget)) {
          if (toolingProperties.has(property) || property in Object.prototype) {
            return;
          }
          const names = visibleNames();
          const respelled = names.find((name) => looseName(name) === looseName(property));
          const suggestion = respelled ?? closestName(property, names);
          const hint = options.hints?.[looseName(property)];
          const meant = respelled === undefined && hint !== undefined ? hint : suggestion === undefined ? undefined : `${label}.${suggestion}`;
          throw new TypeError(`${label}.${property} doesn't exist.${meant === undefined ? "" : ` Did you mean ${meant}?`}`);
        }
        const value = Reflect.get(proxyTarget, property, proxyTarget);
        const descriptor = Object.getOwnPropertyDescriptor(proxyTarget, property);
        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          return value;
        }
        if (typeof value === "function") {
          const cachedMethod = bound.get(property);
          if (cachedMethod !== undefined)
            return cachedMethod;
          const method = value.bind(proxyTarget);
          bound.set(property, method);
          return method;
        }
        if (nested.has(property) && isPlainObject(value)) {
          return friendlyService(value, `${label}.${property}`, {
            hints: options.hints ?? {}
          });
        }
        return value;
      },
      set(proxyTarget, property, value) {
        return Reflect.set(proxyTarget, property, value, proxyTarget);
      },
      has(proxyTarget, property) {
        return Reflect.has(proxyTarget, property);
      }
    });
    friendlyServices.set(target, proxy);
    return proxy;
  }
  function isPlainObject(value) {
    if (typeof value !== "object" || value === null)
      return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  // packages/core/src/audio.ts
  class AudioUnlockState {
    unlocked = false;
    isUnlocked() {
      return this.unlocked;
    }
    markUnlocked() {
      this.unlocked = true;
    }
  }
  guardSpellings(AudioUnlockState.prototype, "audioUnlock");
  var audioUnlock = new AudioUnlockState;

  class BrowserSoundAsset {
    kind;
    name;
    url;
    bytes;
    createElement;
    unlockState;
    activeInstances = new Set;
    metadataElement = null;
    volumeValue;
    lastErrorMessage = null;
    constructor(asset, options = {}) {
      this.kind = "sound";
      this.name = asset.name;
      this.url = asset.url;
      if (asset.bytes)
        this.bytes = asset.bytes;
      this.createElement = options.createAudioElement ?? createHtmlAudioElement;
      this.unlockState = options.unlockState ?? audioUnlock;
      this.volumeValue = clampVolume(options.volume ?? 1);
    }
    play(loops = 0) {
      const loopCount = requireLoopCount(loops);
      let element;
      try {
        element = this.createElement(this.url);
      } catch (error) {
        this.lastErrorMessage = errorMessage(error);
        return;
      }
      element.volume = this.volumeValue;
      element.loop = loopCount < 0;
      const instance = {
        element,
        loopCount,
        remainingLoops: loopCount,
        ended: () => this.handleInstanceEnded(instance)
      };
      this.activeInstances.add(instance);
      element.addEventListener("ended", instance.ended);
      this.playElement(element, () => {
        if (this.activeInstances.has(instance))
          this.removeInstance(instance, true);
      });
    }
    loop() {
      this.play(-1);
    }
    stop() {
      for (const instance of [...this.activeInstances]) {
        this.removeInstance(instance, true);
      }
    }
    getLength() {
      const element = this.firstActiveElement() ?? this.getMetadataElement();
      return Number.isFinite(element.duration) && element.duration > 0 ? element.duration : 0;
    }
    setVolume(volume) {
      this.volumeValue = clampVolume(volume);
      for (const instance of this.activeInstances) {
        instance.element.volume = this.volumeValue;
      }
      if (this.metadataElement)
        this.metadataElement.volume = this.volumeValue;
    }
    getVolume() {
      return this.volumeValue;
    }
    debugState() {
      return {
        active: this.activeInstances.size > 0,
        loop: [...this.activeInstances].some((instance) => Boolean(instance.element.loop)),
        volume: this.volumeValue,
        unlocked: this.unlockState.isUnlocked(),
        lastError: this.lastErrorMessage
      };
    }
    debugInstanceCount() {
      return this.activeInstances.size;
    }
    handleInstanceEnded(instance) {
      if (!this.activeInstances.has(instance))
        return;
      if (instance.loopCount < 0)
        return;
      if (instance.remainingLoops > 0) {
        instance.remainingLoops -= 1;
        instance.element.currentTime = 0;
        this.playElement(instance.element, () => {
          if (this.activeInstances.has(instance))
            this.removeInstance(instance, true);
        });
        return;
      }
      this.removeInstance(instance, false);
    }
    firstActiveElement() {
      for (const instance of this.activeInstances)
        return instance.element;
      return null;
    }
    getMetadataElement() {
      this.metadataElement ??= this.createElement(this.url);
      this.metadataElement.volume = this.volumeValue;
      return this.metadataElement;
    }
    playElement(element, onRejected) {
      try {
        const result = element.play();
        if (isPromiseLike(result)) {
          result.then(() => {
            this.unlockState.markUnlocked();
          }).catch((error) => {
            this.lastErrorMessage = errorMessage(error);
            onRejected?.();
          });
        } else {
          this.unlockState.markUnlocked();
        }
      } catch (error) {
        this.lastErrorMessage = errorMessage(error);
        onRejected?.();
      }
    }
    removeInstance(instance, resetTime) {
      const { element } = instance;
      element.removeEventListener("ended", instance.ended);
      element.pause();
      element.loop = false;
      if (resetTime)
        element.currentTime = 0;
      this.activeInstances.delete(instance);
    }
  }
  guardSpellings(BrowserSoundAsset.prototype, "sound");
  function createBrowserSoundAsset(asset, options = {}) {
    return new BrowserSoundAsset(asset, options);
  }

  class MusicPlayer {
    loaderValue;
    createElement;
    scheduler;
    currentTrack = null;
    queuedNames = [];
    onEnd;
    onError;
    fadeoutHandles = [];
    volumeValue;
    lastErrorMessage = null;
    operationGeneration = 0;
    pendingStart = null;
    constructor(options = {}) {
      this.loaderValue = options.loader ?? null;
      this.createElement = options.createAudioElement ?? createHtmlAudioElement;
      this.scheduler = options.scheduler ?? defaultTimeoutScheduler();
      this.onEnd = options.onMusicEnd;
      this.onError = options.onError;
      this.volumeValue = clampVolume(options.volume ?? 1);
    }
    async play(name) {
      const generation = this.replacePlayback();
      await this.beginTrackStart(name, "loop", generation);
    }
    async playOnce(name) {
      const generation = this.replacePlayback();
      await this.beginTrackStart(name, "once", generation);
    }
    async queue(name) {
      this.queuedNames.push(name);
      if (this.currentTrack)
        return;
      const pending = this.pendingStart;
      if (pending) {
        await pending;
        return;
      }
      await this.playNextQueuedTrack(this.operationGeneration);
    }
    stop() {
      this.replacePlayback();
    }
    pause() {
      this.currentTrack?.element.pause();
    }
    unpause() {
      const element = this.currentTrack?.element;
      if (!element)
        return;
      this.playElement(element);
    }
    rewind() {
      const element = this.currentTrack?.element;
      if (!element)
        return;
      element.currentTime = 0;
    }
    getPos() {
      const element = this.currentTrack?.element;
      if (!element)
        return -1;
      return element.currentTime * 1000;
    }
    get position() {
      return this.currentTrack?.element.currentTime ?? 0;
    }
    set position(seconds) {
      this.setPos(seconds);
    }
    setPos(seconds) {
      if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) {
        throw new RangeError("setPos seconds must be a non-negative number.");
      }
      const element = this.currentTrack?.element;
      if (!element)
        return;
      element.currentTime = seconds;
    }
    fadeOut(seconds) {
      if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) {
        throw new RangeError("fadeOut duration must be a non-negative number.");
      }
      this.clearFadeout();
      if (seconds === 0) {
        this.stop();
        return;
      }
      const track = this.currentTrack;
      if (!track)
        return;
      const durationMs = seconds * 1000;
      const steps = Math.max(1, Math.ceil(durationMs / 50));
      const startVolume = track.element.volume;
      for (let step = 1;step <= steps; step += 1) {
        const handle = this.scheduler.setTimeout(() => {
          if (this.currentTrack !== track)
            return;
          track.element.volume = startVolume * (1 - step / steps);
          if (step === steps)
            this.stop();
        }, durationMs * step / steps);
        this.fadeoutHandles.push(handle);
      }
    }
    setVolume(volume) {
      this.volumeValue = clampVolume(volume);
      if (this.currentTrack)
        this.currentTrack.element.volume = this.volumeValue;
    }
    getVolume() {
      return this.volumeValue;
    }
    isPlaying(_name) {
      return Boolean(this.currentTrack && !this.currentTrack.element.paused);
    }
    setOnMusicEnd(callback) {
      this.onEnd = callback;
    }
    debugState() {
      return {
        current: this.currentTrack?.asset.name ?? null,
        queued: [...this.queuedNames],
        isPlaying: this.isPlaying(),
        volume: this.volumeValue,
        lastError: this.lastErrorMessage
      };
    }
    debugCurrentElement() {
      return this.currentTrack?.element ?? null;
    }
    get loader() {
      this.loaderValue ??= createMusicLoader();
      return this.loaderValue;
    }
    async beginTrackStart(name, mode, generation) {
      const pending = this.startTrack(name, mode, generation);
      this.pendingStart = pending;
      try {
        await pending;
        return true;
      } catch (error) {
        if (generation === this.operationGeneration) {
          this.reportError(error);
        }
        return false;
      } finally {
        if (this.pendingStart === pending)
          this.pendingStart = null;
      }
    }
    async startTrack(name, mode, generation) {
      const asset = await this.loader.load(name);
      if (generation !== this.operationGeneration)
        return;
      const element = this.createElement(asset.url);
      if (generation !== this.operationGeneration)
        return;
      element.volume = this.volumeValue;
      element.loop = mode === "loop";
      const track = {
        asset,
        element,
        mode,
        ended: () => {
          this.handleTrackEnded(track, generation).catch((error) => {
            if (generation !== this.operationGeneration)
              return;
            this.lastErrorMessage = errorMessage(error);
            this.queuedNames = [];
          });
        }
      };
      this.currentTrack = track;
      element.addEventListener("ended", track.ended);
      this.playElement(element, () => {
        if (this.currentTrack === track) {
          this.queuedNames = [];
          this.disposeCurrent(true);
        }
      }, generation);
    }
    async playNextQueuedTrack(generation) {
      if (generation !== this.operationGeneration)
        return;
      const next = this.queuedNames.shift();
      if (!next) {
        if (generation === this.operationGeneration)
          this.onEnd?.();
        return;
      }
      const started = await this.beginTrackStart(next, "once", generation);
      if (!started) {
        await this.playNextQueuedTrack(generation);
      }
    }
    async handleTrackEnded(track, generation) {
      if (generation !== this.operationGeneration || this.currentTrack !== track) {
        return;
      }
      this.disposeCurrent(false);
      if (this.queuedNames.length > 0) {
        await this.playNextQueuedTrack(generation);
        return;
      }
      if (generation === this.operationGeneration)
        this.onEnd?.();
    }
    playElement(element, onRejected, generation = this.operationGeneration) {
      try {
        const result = element.play();
        if (isPromiseLike(result)) {
          result.catch((error) => {
            if (generation !== this.operationGeneration)
              return;
            this.reportError(error);
            onRejected?.();
          });
        }
      } catch (error) {
        if (generation !== this.operationGeneration)
          return;
        this.reportError(error);
        onRejected?.();
      }
    }
    reportError(error) {
      this.lastErrorMessage = errorMessage(error);
      try {
        this.onError?.(error);
      } catch (callbackError) {
        console.error("Error in music error handler:", callbackError);
      }
    }
    replacePlayback() {
      this.operationGeneration += 1;
      this.pendingStart = null;
      this.clearFadeout();
      this.queuedNames = [];
      this.disposeCurrent(true);
      return this.operationGeneration;
    }
    disposeCurrent(resetTime) {
      const track = this.currentTrack;
      if (!track)
        return;
      track.element.removeEventListener("ended", track.ended);
      track.element.pause();
      track.element.loop = false;
      if (resetTime)
        track.element.currentTime = 0;
      this.currentTrack = null;
    }
    clearFadeout() {
      for (const handle of this.fadeoutHandles) {
        this.scheduler.clearTimeout(handle);
      }
      this.fadeoutHandles = [];
    }
  }
  guardSpellings(MusicPlayer.prototype, "music");
  function createMusicPlayer(options = {}) {
    return new MusicPlayer(options);
  }
  var defaultMusicPlayer = createMusicPlayer();
  var activeMusicPlayer = null;
  function setActiveMusicPlayer(nextMusicPlayer) {
    const previous = activeMusicPlayer;
    activeMusicPlayer = nextMusicPlayer;
    return previous;
  }
  function getActiveMusicPlayer() {
    return activeMusicPlayer ?? defaultMusicPlayer;
  }
  var music = createActiveServiceProxy(getActiveMusicPlayer);
  function clampVolume(volume) {
    if (typeof volume !== "number" || Number.isNaN(volume))
      return 1;
    return Math.min(1, Math.max(0, volume));
  }
  function createHtmlAudioElement(url) {
    if (typeof globalThis.Audio !== "function") {
      throw new Error("HTML audio is not available in this environment.");
    }
    return new globalThis.Audio(url);
  }
  function requireLoopCount(loops) {
    if (Number.isInteger(loops) && loops >= -1)
      return loops;
    throw new RangeError("loops is how many extra times to play the sound: 0 plays it once, 2 plays it three times, and -1 (or sound.loop()) plays it until stop().");
  }
  function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
  }
  function defaultTimeoutScheduler() {
    return {
      setTimeout(callback, delayMs) {
        return globalThis.setTimeout(callback, delayMs);
      },
      clearTimeout(handle) {
        globalThis.clearTimeout(handle);
      }
    };
  }

  // packages/core/src/browser-asset-backends.ts
  var fontExtensions = ["ttf", "otf", "woff", "woff2"];
  async function loadBrowserImage(url, createSurface) {
    const ImageConstructor = globalThis.Image;
    if (typeof ImageConstructor !== "function") {
      throw new Error("HTML Image is not available in this environment.");
    }
    const image = new ImageConstructor;
    image.decoding = "async";
    const loaded = new Promise((resolve, reject) => {
      image.addEventListener("load", () => resolve(image), { once: true });
      image.addEventListener("error", () => reject(new Error("image load failed")), { once: true });
    });
    image.src = url;
    return createSurface(await loaded);
  }
  async function loadSoundAsset(url, name) {
    const bytes = await fetchBytes(url);
    return createBrowserSoundAsset({
      kind: "sound",
      name,
      url,
      bytes
    });
  }
  async function loadMusicAsset(url, name) {
    return {
      kind: "music",
      name,
      url,
      bytes: await fetchBytes(url)
    };
  }
  async function loadFontAsset(url, name) {
    const bytes = await fetchBytes(url);
    const filename = name.split("/").at(-1) ?? name;
    const family = stripExtension(filename, fontExtensions);
    let face;
    if (typeof globalThis.FontFace === "function") {
      face = new FontFace(family, bytes);
      await face.load();
      globalThis.document?.fonts?.add(face);
    }
    return {
      kind: "font",
      name,
      url,
      bytes,
      family,
      ...face ? { face } : {}
    };
  }
  async function fetchBytes(url) {
    if (/^data:/i.test(url))
      return decodeDataUrl(url);
    if (typeof globalThis.fetch !== "function") {
      throw new Error("fetch is not available");
    }
    const response = await globalThis.fetch(url);
    if (!response.ok)
      throw new Error(`HTTP ${response.status}`);
    return response.arrayBuffer();
  }
  function decodeDataUrl(url) {
    const comma = url.indexOf(",");
    if (comma < 0)
      throw new Error("malformed data URL");
    const header = url.slice("data:".length, comma);
    const body = url.slice(comma + 1);
    if (/;base64$/i.test(header)) {
      const binary = atob(body);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0;index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return bytes.buffer;
    }
    return new TextEncoder().encode(decodeURIComponent(body)).buffer;
  }
  function stripExtension(name, extensions) {
    for (const extension of extensions) {
      if (name.endsWith(`.${extension}`)) {
        return name.slice(0, -extension.length - 1);
      }
    }
    return name;
  }

  // packages/core/src/geometry.ts
  class Rect {
    left;
    top;
    width;
    height;
    constructor(...args) {
      const [left, top, width, height] = parseRectArgs(args);
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
    }
    get x() {
      return this.left;
    }
    set x(value) {
      this.left = requireFiniteNumber(value, "x");
    }
    get y() {
      return this.top;
    }
    set y(value) {
      this.top = requireFiniteNumber(value, "y");
    }
    get w() {
      return this.width;
    }
    set w(value) {
      this.width = requireFiniteNumber(value, "w");
    }
    get h() {
      return this.height;
    }
    set h(value) {
      this.height = requireFiniteNumber(value, "h");
    }
    get right() {
      return this.left + this.width;
    }
    set right(value) {
      this.left = requireFiniteNumber(value, "right") - this.width;
    }
    get bottom() {
      return this.top + this.height;
    }
    set bottom(value) {
      this.top = requireFiniteNumber(value, "bottom") - this.height;
    }
    get centerX() {
      return this.left + this.width / 2;
    }
    set centerX(value) {
      this.left = requireFiniteNumber(value, "centerX") - this.width / 2;
    }
    get centerY() {
      return this.top + this.height / 2;
    }
    set centerY(value) {
      this.top = requireFiniteNumber(value, "centerY") - this.height / 2;
    }
    get topLeft() {
      return [this.left, this.top];
    }
    set topLeft(value) {
      const [x, y] = parsePair(value, "topLeft");
      this.left = x;
      this.top = y;
    }
    get topRight() {
      return [this.right, this.top];
    }
    set topRight(value) {
      const [x, y] = parsePair(value, "topRight");
      this.right = x;
      this.top = y;
    }
    get bottomLeft() {
      return [this.left, this.bottom];
    }
    set bottomLeft(value) {
      const [x, y] = parsePair(value, "bottomLeft");
      this.left = x;
      this.bottom = y;
    }
    get bottomRight() {
      return [this.right, this.bottom];
    }
    set bottomRight(value) {
      const [x, y] = parsePair(value, "bottomRight");
      this.right = x;
      this.bottom = y;
    }
    get midTop() {
      return [this.centerX, this.top];
    }
    set midTop(value) {
      const [x, y] = parsePair(value, "midTop");
      this.centerX = x;
      this.top = y;
    }
    get midLeft() {
      return [this.left, this.centerY];
    }
    set midLeft(value) {
      const [x, y] = parsePair(value, "midLeft");
      this.left = x;
      this.centerY = y;
    }
    get midRight() {
      return [this.right, this.centerY];
    }
    set midRight(value) {
      const [x, y] = parsePair(value, "midRight");
      this.right = x;
      this.centerY = y;
    }
    get midBottom() {
      return [this.centerX, this.bottom];
    }
    set midBottom(value) {
      const [x, y] = parsePair(value, "midBottom");
      this.centerX = x;
      this.bottom = y;
    }
    get center() {
      return [this.centerX, this.centerY];
    }
    set center(value) {
      const [x, y] = parsePair(value, "center");
      this.centerX = x;
      this.centerY = y;
    }
    get size() {
      return [this.width, this.height];
    }
    set size(value) {
      const [width, height] = parsePair(value, "size");
      this.width = width;
      this.height = height;
    }
    get 0() {
      return this.left;
    }
    get 1() {
      return this.top;
    }
    get 2() {
      return this.width;
    }
    get 3() {
      return this.height;
    }
    [Symbol.iterator]() {
      const values = [this.left, this.top, this.width, this.height];
      return values[Symbol.iterator]();
    }
    copy() {
      const RectClass = this.constructor;
      return new RectClass(this.left, this.top, this.width, this.height);
    }
    move(xOrOffset, y) {
      const [x, yOffset] = parseOffset(xOrOffset, y, "move");
      const copy = this.copy();
      copy.moveIp(x, yOffset);
      return copy;
    }
    moveIp(xOrOffset, y) {
      const [x, yOffset] = parseOffset(xOrOffset, y, "moveIp");
      this.left += x;
      this.top += yOffset;
    }
    inflate(xOrSize, y) {
      const [x, yAmount] = parseOffset(xOrSize, y, "inflate");
      const copy = this.copy();
      copy.inflateIp(x, yAmount);
      return copy;
    }
    inflateIp(xOrSize, y) {
      const [x, yAmount] = parseOffset(xOrSize, y, "inflateIp");
      this.left -= x / 2;
      this.top -= yAmount / 2;
      this.width += x;
      this.height += yAmount;
    }
    normalize() {
      if (this.width < 0) {
        this.left += this.width;
        this.width = -this.width;
      }
      if (this.height < 0) {
        this.top += this.height;
        this.height = -this.height;
      }
    }
    clamp(other) {
      const container = normalizedRect(other);
      const rect = this.copy();
      if (rect.width >= container.width) {
        rect.left = container.left + (container.width - rect.width) / 2;
      } else if (rect.left < container.left) {
        rect.left = container.left;
      } else if (rect.right > container.right) {
        rect.right = container.right;
      }
      if (rect.height >= container.height) {
        rect.top = container.top + (container.height - rect.height) / 2;
      } else if (rect.top < container.top) {
        rect.top = container.top;
      } else if (rect.bottom > container.bottom) {
        rect.bottom = container.bottom;
      }
      return rect;
    }
    clampIp(other) {
      this.applyGeometry(this.clamp(other));
    }
    clip(other) {
      const a = normalizedRect(this);
      const b = normalizedRect(other);
      const left = Math.max(a.left, b.left);
      const top = Math.max(a.top, b.top);
      const right = Math.min(a.right, b.right);
      const bottom = Math.min(a.bottom, b.bottom);
      return new Rect(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
    }
    clipIp(other) {
      this.applyGeometry(this.clip(other));
    }
    union(other) {
      const a = normalizedRect(this);
      const b = normalizedRect(other);
      const left = Math.min(a.left, b.left);
      const top = Math.min(a.top, b.top);
      const right = Math.max(a.right, b.right);
      const bottom = Math.max(a.bottom, b.bottom);
      return new Rect(left, top, right - left, bottom - top);
    }
    unionIp(other) {
      this.applyGeometry(this.union(other));
    }
    unionAll(others) {
      return others.reduce((accumulator, other) => accumulator.union(other), this.copy());
    }
    unionAllIp(others) {
      this.applyGeometry(this.unionAll(others));
    }
    fit(other) {
      const container = normalizedRect(other);
      const rect = normalizedRect(this);
      if (rect.width === 0 || rect.height === 0) {
        return new Rect(container.left, container.top, 0, 0);
      }
      const scale = Math.min(container.width / rect.width, container.height / rect.height);
      const width = rect.width * scale;
      const height = rect.height * scale;
      return new Rect(container.left + (container.width - width) / 2, container.top + (container.height - height) / 2, width, height);
    }
    contains(other) {
      const a = normalizedRect(this);
      const b = normalizedRect(other);
      return b.left >= a.left && b.top >= a.top && b.right <= a.right && b.bottom <= a.bottom;
    }
    collidePoint(pointOrX, y) {
      const [x, yPoint] = parseOffset(pointOrX, y, "collidePoint");
      const rect = normalizedRect(this);
      return rect.width > 0 && rect.height > 0 && x >= rect.left && x < rect.right && yPoint >= rect.top && yPoint < rect.bottom;
    }
    touches(target) {
      return isPair(target) ? this.collidePoint(target) : this.collideRect(target);
    }
    collideRect(other) {
      const a = normalizedRect(this);
      const b = normalizedRect(other);
      return a.width > 0 && a.height > 0 && b.width > 0 && b.height > 0 && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }
    collideList(others) {
      return others.findIndex((other) => this.collideRect(other));
    }
    collideListAll(others) {
      const indexes = [];
      others.forEach((other, index) => {
        if (this.collideRect(other))
          indexes.push(index);
      });
      return indexes;
    }
    collideDict(dict, useValues = true) {
      for (const [key, value] of dictEntries(dict)) {
        const candidate = useValues ? value : key;
        if (this.collideRect(candidate))
          return [key, value];
      }
      return;
    }
    collideDictAll(dict, useValues = true) {
      const results = [];
      for (const [key, value] of dictEntries(dict)) {
        const candidate = useValues ? value : key;
        if (this.collideRect(candidate))
          results.push([key, value]);
      }
      return results;
    }
    applyGeometry(source) {
      this.left = source.left;
      this.top = source.top;
      this.width = source.width;
      this.height = source.height;
    }
  }
  function* dictEntries(dict) {
    if (dict instanceof Map) {
      yield* dict.entries();
      return;
    }
    yield* Object.entries(dict);
  }
  guardSpellings(Rect.prototype, "rect");

  class ZRect extends Rect {
  }
  function angleTo(from, to) {
    const [fromX, fromY] = parsePair(from, "from");
    const [toX, toY] = parsePair(to, "to");
    return Math.atan2(fromY - toY, toX - fromX) * 180 / Math.PI;
  }
  function distanceTo(from, to) {
    const [fromX, fromY] = parsePair(from, "from");
    const [toX, toY] = parsePair(to, "to");
    return Math.hypot(toX - fromX, toY - fromY);
  }
  function normalizedRect(rect) {
    const copy = rect instanceof Rect ? rect.copy() : new Rect(rect);
    copy.normalize();
    return copy;
  }
  function parseRectArgs(args) {
    if (args.length === 4 && args.every(isFiniteNumber)) {
      return args;
    }
    if (args.length === 2 && isPair(args[0]) && isPair(args[1])) {
      const [left, top] = parsePair(args[0], "topLeft");
      const [width, height] = parsePair(args[1], "size");
      return [left, top, width, height];
    }
    if (args.length === 1) {
      return resolveRectLike(args[0], 0);
    }
    throw new TypeError("Rect requires (left, top, width, height), ([left, top], [width, height]), another Rect, [left, top, width, height], or an object with a `.rect` property/method.");
  }
  function resolveRectLike(value, depth) {
    if (value instanceof Rect) {
      return [value.left, value.top, value.width, value.height];
    }
    if (isRectTuple(value)) {
      const [left, top, width, height] = value;
      return [left, top, width, height];
    }
    if (isRectObject(value)) {
      return [value.left, value.top, value.width, value.height];
    }
    if (isXywhObject(value)) {
      return [value.x, value.y, value.w, value.h];
    }
    if (isRecord(value) && "rect" in value) {
      if (depth > 16) {
        throw new TypeError("Rect: exceeded recursion depth resolving a `.rect` reference.");
      }
      const member = value.rect;
      const resolved = typeof member === "function" ? member.call(value) : member;
      return resolveRectLike(resolved, depth + 1);
    }
    throw new TypeError("Rect requires (left, top, width, height), ([left, top], [width, height]), another Rect, [left, top, width, height], or an object with a `.rect` property/method.");
  }
  function parseOffset(xOrOffset, y, label) {
    if (isPair(xOrOffset) && y === undefined) {
      return parsePair(xOrOffset, label);
    }
    if (isFiniteNumber(xOrOffset) && isFiniteNumber(y)) {
      return [xOrOffset, y];
    }
    throw new TypeError(`${label} requires two finite numbers or a two-number tuple.`);
  }
  function parsePair(value, label) {
    return requirePoint(value, label);
  }
  function isRectTuple(value) {
    return Array.isArray(value) && value.length === 4 && isFiniteNumber(value[0]) && isFiniteNumber(value[1]) && isFiniteNumber(value[2]) && isFiniteNumber(value[3]);
  }
  function isRecord(value) {
    return typeof value === "object" && value !== null;
  }
  function isRectObject(value) {
    return isRecord(value) && isFiniteNumber(value.left) && isFiniteNumber(value.top) && isFiniteNumber(value.width) && isFiniteNumber(value.height);
  }
  function isXywhObject(value) {
    return isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y) && isFiniteNumber(value.w) && isFiniteNumber(value.h);
  }

  // packages/core/src/assets.ts
  class MissingAssetError extends Error {
    kind;
    assetName;
    attemptedUrls;
    constructor(kind, name, options = {}) {
      const attemptedUrls = [...options.attemptedUrls ?? []];
      const attemptedMessage = attemptedUrls.length === 0 ? "" : ` (tried ${attemptedUrls.join(", ")})`;
      super(`Missing ${kind} asset: ${name}${attemptedMessage}`, options.cause === undefined ? undefined : { cause: options.cause });
      this.name = "MissingAssetError";
      this.kind = kind;
      this.assetName = name;
      this.attemptedUrls = attemptedUrls;
    }
  }

  class InvalidAssetNameError extends TypeError {
    constructor(kind, name, reason) {
      super(`Invalid ${kind} asset name "${name}": ${reason}`);
      this.name = "InvalidAssetNameError";
    }
  }

  class ImageSurface {
    source;
    width;
    height;
    constructor(source, width, height) {
      this.source = source;
      this.width = requirePositiveDimension(width ?? source.naturalWidth ?? source.width, "image width");
      this.height = requirePositiveDimension(height ?? source.naturalHeight ?? source.height, "image height");
    }
    getWidth() {
      return this.width;
    }
    getHeight() {
      return this.height;
    }
    getSize() {
      return [this.width, this.height];
    }
    getRect(options = {}) {
      const rect = new Rect(0, 0, this.width, this.height);
      applyRectPosition(rect, options);
      return rect;
    }
  }
  guardSpellings(ImageSurface.prototype, "image");
  function createImageLoader(options = {}) {
    return createAssetLoader({
      kind: "image",
      directory: "images",
      extensions: imageExtensions,
      ...options,
      loadAsset: options.loadAsset ?? ((url) => loadBrowserImage(url, (image) => new ImageSurface(image)))
    });
  }
  async function loadImages(assetUrls) {
    const loader = createImageLoader({ assetUrls });
    const names = Object.keys(assetUrls).filter((path) => path.startsWith("images/")).map((path) => path.slice("images/".length));
    const loaded = await Promise.all(names.map((name) => loader.load(name).then((surface) => [name, surface], () => null)));
    return Object.fromEntries(loaded.filter((entry) => entry !== null));
  }
  function createSoundLoader(options = {}) {
    return createAssetLoader({
      kind: "sound",
      directory: "sounds",
      extensions: soundExtensions,
      ...options,
      loadAsset: options.loadAsset ?? loadSoundAsset
    });
  }
  function createMusicLoader(options = {}) {
    return createAssetLoader({
      kind: "music",
      directory: "music",
      extensions: soundExtensions,
      ...options,
      loadAsset: options.loadAsset ?? loadMusicAsset
    });
  }
  function createFontLoader(options = {}) {
    return createAssetLoader({
      kind: "font",
      directory: "fonts",
      extensions: fontExtensions,
      ...options,
      loadAsset: options.loadAsset ?? loadFontAsset
    });
  }
  function createAssetLoaders(options = {}) {
    return {
      images: createImageLoader(options),
      sounds: createSoundLoader(options),
      music: createMusicLoader(options),
      fonts: createFontLoader(options)
    };
  }
  function validateAssetName(kind, name, extensions) {
    if (typeof name !== "string" || name.trim() !== name || name.length === 0) {
      throw new InvalidAssetNameError(kind, String(name), "use a non-empty name");
    }
    if (name.startsWith("/") || /^[a-z]+:\/\//i.test(name)) {
      throw new InvalidAssetNameError(kind, name, "absolute paths are not allowed");
    }
    if (name.includes("\\") || name.includes("//")) {
      throw new InvalidAssetNameError(kind, name, "use forward-slash paths");
    }
    const segments = name.split("/");
    if (segments.some((segment) => segment === "." || segment === "..")) {
      throw new InvalidAssetNameError(kind, name, "path traversal is not allowed");
    }
    if (segments.some((segment) => segment.length === 0)) {
      throw new InvalidAssetNameError(kind, name, "empty path segments are not allowed");
    }
    for (const segment of segments) {
      const [stem, extension, extra] = segment.split(".");
      if (extra !== undefined) {
        throw new InvalidAssetNameError(kind, name, "only one extension is allowed");
      }
      if (!stem || !/^[a-z][a-z0-9_]*$/.test(stem)) {
        throw new InvalidAssetNameError(kind, name, "names must be lowercase, start with a letter, and contain only letters, digits, and underscores");
      }
      if (extension !== undefined) {
        if (!/^[a-z0-9]+$/.test(extension)) {
          throw new InvalidAssetNameError(kind, name, "extensions must be lowercase");
        }
        if (!extensions.includes(extension)) {
          throw new InvalidAssetNameError(kind, name, `supported extensions are ${extensions.join(", ")}`);
        }
      }
    }
    return name;
  }
  function assetUrl(assetBaseUrl, projectId, directory, name) {
    const base = assetBaseUrl.replace(/\/+$/, "");
    const encodedProjectId = encodeURIComponent(projectId);
    const encodedName = name.split("/").map((segment) => encodeURIComponent(segment)).join("/");
    return `${base}/${encodedProjectId}/${directory}/${encodedName}`;
  }
  function locateAsset(loader, name) {
    const { assetUrls } = loader;
    if (!assetUrls) {
      return assetUrl(loader.assetBaseUrl, loader.projectId, loader.directory, name);
    }
    const path = `${loader.directory}/${name}`;
    return Object.hasOwn(assetUrls, path) ? assetUrls[path] : undefined;
  }
  var defaultAssetLoaders = createAssetLoaders();
  var activeAssetLoaders = null;
  function setActiveAssetLoaders(loaders) {
    const previous = activeAssetLoaders;
    activeAssetLoaders = loaders;
    return previous;
  }
  var images = createActiveServiceProxy(() => activeAssetLoaders?.images ?? defaultAssetLoaders.images);
  var sounds = createActiveServiceProxy(() => activeAssetLoaders?.sounds ?? defaultAssetLoaders.sounds);
  var musicAssets = createActiveServiceProxy(() => activeAssetLoaders?.music ?? defaultAssetLoaders.music);
  var fonts = createActiveServiceProxy(() => activeAssetLoaders?.fonts ?? defaultAssetLoaders.fonts);
  var MAX_SETTLED_FAILURES = 32;
  function createAssetLoader(options) {
    const projectId = validateProjectId(options.projectId ?? "default");
    const assetBaseUrl = options.assetBaseUrl ?? "/assets";
    const assetUrls = options.assetUrls ? Object.freeze({ ...requireAssetUrls(options.assetUrls) }) : undefined;
    const cache = new Map;
    const aliases = new Map;
    const pending = new Map;
    const settledFailures = [];
    const lazyProperties = new Map;
    const target = {
      kind: options.kind,
      projectId,
      assetBaseUrl,
      assetUrls,
      directory: options.directory,
      extensions: [...options.extensions],
      async load(name) {
        const requested = validateAssetName(options.kind, name, options.extensions);
        const cached = getCached(cache, aliases, requested);
        if (cached)
          return cached;
        const existingPending = pending.get(requested);
        if (existingPending)
          return existingPending;
        const loadPromise = loadFirstMatchingAsset(options, {
          assetBaseUrl,
          assetUrls,
          projectId,
          requested
        }).then(({ asset, resolved }) => {
          cache.set(resolved, asset);
          aliases.set(requested, resolved);
          aliases.set(stripKnownExtension(resolved, options.extensions), resolved);
          pending.delete(requested);
          return asset;
        }).catch((error) => {
          pending.delete(requested);
          const failure = error instanceof MissingAssetError ? error : new MissingAssetError(options.kind, requested, {
            cause: error
          });
          settledFailures.push(failure);
          if (settledFailures.length > MAX_SETTLED_FAILURES) {
            settledFailures.splice(0, settledFailures.length - MAX_SETTLED_FAILURES);
          }
          throw failure;
        });
        pending.set(requested, loadPromise);
        return loadPromise;
      },
      get(name) {
        const requested = validateAssetName(options.kind, name, options.extensions);
        return getCached(cache, aliases, requested);
      },
      has(name) {
        const requested = validateAssetName(options.kind, name, options.extensions);
        return getCached(cache, aliases, requested) !== undefined;
      },
      define(name, asset) {
        const requested = validateAssetName(options.kind, name, options.extensions);
        cache.set(requested, asset);
        aliases.set(requested, requested);
        aliases.set(stripKnownExtension(requested, options.extensions), requested);
        return asset;
      },
      unload(name) {
        const requested = validateAssetName(options.kind, name, options.extensions);
        const resolved = aliases.get(requested) ?? requested;
        const deleted = cache.delete(resolved);
        for (const [alias, canonical] of [...aliases.entries()]) {
          if (canonical === resolved || alias === requested) {
            aliases.delete(alias);
            lazyProperties.delete(alias);
          }
        }
        lazyProperties.delete(requested);
        lazyProperties.delete(resolved);
        return deleted;
      },
      unloadAll() {
        cache.clear();
        aliases.clear();
        pending.clear();
        settledFailures.length = 0;
        lazyProperties.clear();
      },
      cacheKeys() {
        return [...cache.keys()].sort();
      },
      pendingCount() {
        return pending.size;
      },
      async waitForIdle() {
        while (pending.size > 0) {
          await Promise.allSettled([...pending.values()]);
        }
        const failures = settledFailures.splice(0);
        if (failures.length === 1)
          throw failures[0];
        if (failures.length > 1) {
          throw new AggregateError(failures, `${failures.length} ${options.kind} assets failed to load.`);
        }
      }
    };
    guardSpellings(target, options.directory);
    return new Proxy(target, {
      get(loader, property, receiver) {
        if (typeof property !== "string") {
          return Reflect.get(loader, property, receiver);
        }
        if (property in loader || property === "then" || property === "inspect" || property === "toJSON") {
          return Reflect.get(loader, property, receiver);
        }
        const requested = validateAssetName(options.kind, property, options.extensions);
        const cached = getCached(cache, aliases, requested);
        if (cached)
          return cached;
        const existing = lazyProperties.get(requested);
        if (existing)
          return existing;
        const lazy = createLazyAsset({
          assetBaseUrl,
          assetUrls,
          directory: options.directory,
          extensions: options.extensions,
          get: () => getCached(cache, aliases, requested),
          kind: options.kind,
          load: () => loader.load(requested),
          projectId,
          requested
        });
        lazyProperties.set(requested, lazy);
        return lazy;
      }
    });
  }
  function createLazyAsset(context) {
    if (context.kind === "image") {
      return createLazySurface(context);
    }
    if (context.kind === "sound") {
      return createLazySoundAsset(context);
    }
    return createLazyLoadedAsset(context);
  }
  function createLazySurface(context) {
    context.load().catch(() => {
      return;
    });
    const loaded = () => {
      const asset = context.get();
      if (!asset)
        throw new MissingAssetError(context.kind, context.requested);
      return asset;
    };
    const surface = {
      get source() {
        return loaded().source;
      },
      getWidth() {
        return loaded().getWidth();
      },
      getHeight() {
        return loaded().getHeight();
      },
      getSize() {
        return loaded().getSize();
      },
      getRect(options) {
        return loaded().getRect(options);
      }
    };
    guardSpellings(surface, "image");
    return surface;
  }
  function createLazySoundAsset(context) {
    let loaded;
    let loading = null;
    const current = () => loaded ?? context.get();
    const ensure = () => {
      const asset = current();
      if (asset) {
        loaded = asset;
        return Promise.resolve(asset);
      }
      loading ??= context.load().then((resolved) => {
        loaded = resolved;
        return resolved;
      });
      return loading;
    };
    const whenLoaded = (callback) => {
      const asset = current();
      if (asset) {
        loaded = asset;
        callback(asset);
        return;
      }
      ensure().then(callback).catch(() => {
        return;
      });
    };
    const sound = {
      kind: "sound",
      name: context.requested,
      get url() {
        return current()?.url ?? fallbackAssetUrl(context);
      },
      play(loops = 0) {
        whenLoaded((asset) => asset.play(loops));
      },
      loop() {
        whenLoaded((asset) => typeof asset.loop === "function" ? asset.loop() : asset.play(-1));
      },
      stop() {
        const asset = current();
        if (asset) {
          loaded = asset;
          asset.stop();
          return;
        }
        if (loading) {
          loading.then((resolved) => resolved.stop()).catch(() => {
            return;
          });
        }
      },
      getLength() {
        return current()?.getLength() ?? 0;
      },
      setVolume(volume) {
        whenLoaded((asset) => asset.setVolume(volume));
      },
      getVolume() {
        return current()?.getVolume() ?? 1;
      }
    };
    guardSpellings(sound, "sound");
    return sound;
  }
  function createLazyLoadedAsset(context) {
    context.load().catch(() => {
      return;
    });
    const placeholder = {
      kind: context.kind,
      name: context.requested,
      url: fallbackAssetUrl(context)
    };
    return new Proxy(placeholder, {
      get(target, property, receiver) {
        if (property === "then")
          return;
        const loaded = context.get();
        if (loaded && property in loaded)
          return loaded[property];
        return Reflect.get(target, property, receiver);
      }
    });
  }
  function fallbackAssetUrl(context) {
    const candidates = candidateNames(context.requested, context.extensions);
    if (!context.assetUrls) {
      return locateAsset(context, candidates[0] ?? context.requested) ?? "";
    }
    for (const candidate of candidates) {
      const url = locateAsset(context, candidate);
      if (url !== undefined)
        return url;
    }
    return "";
  }
  async function loadFirstMatchingAsset(options, context) {
    const candidates = candidateNames(context.requested, options.extensions);
    const loadAsset = options.loadAsset;
    const attemptedUrls = [];
    const causes = [];
    for (const candidate of candidates) {
      const url = locateAsset({ ...context, directory: options.directory }, candidate);
      if (url === undefined) {
        causes.push(new Error(`${options.directory}/${candidate} isn't in assetUrls.`));
        continue;
      }
      attemptedUrls.push(url);
      if (!loadAsset) {
        causes.push(new Error("No asset loader is configured."));
        continue;
      }
      try {
        return {
          asset: await loadAsset(url, candidate),
          resolved: candidate
        };
      } catch (error) {
        causes.push(error);
      }
    }
    const cause = causes.length === 1 ? causes[0] : new AggregateError(causes, `Every candidate for ${options.kind} asset ${context.requested} failed.`);
    throw new MissingAssetError(options.kind, context.requested, {
      attemptedUrls,
      cause
    });
  }
  function candidateNames(name, extensions) {
    if (hasKnownExtension(name, extensions))
      return [name];
    return extensions.map((extension) => `${name}.${extension}`);
  }
  function hasKnownExtension(name, extensions) {
    return extensions.some((extension) => name.endsWith(`.${extension}`));
  }
  function stripKnownExtension(name, extensions) {
    for (const extension of extensions) {
      if (name.endsWith(`.${extension}`))
        return name.slice(0, -extension.length - 1);
    }
    return name;
  }
  function getCached(cache, aliases, requested) {
    return cache.get(aliases.get(requested) ?? requested);
  }
  function requireAssetUrls(assetUrls) {
    if (typeof assetUrls !== "object" || assetUrls === null) {
      throw new TypeError('assetUrls must map asset paths to URLs, like { "images/cat.svg": url }.');
    }
    for (const [path, url] of Object.entries(assetUrls)) {
      if (typeof url !== "string" || url.length === 0) {
        throw new TypeError(`assetUrls["${path}"] must be a URL string.`);
      }
    }
    return assetUrls;
  }
  function validateProjectId(projectId) {
    if (!/^[a-z][a-z0-9_-]*$/.test(projectId)) {
      throw new TypeError("projectId must be lowercase, start with a letter, and contain only letters, digits, underscores, or hyphens.");
    }
    return projectId;
  }
  function applyRectPosition(rect, options) {
    const keys = rectPositionKeys.filter((key2) => options[key2] !== undefined);
    if (keys.length > 1) {
      throw new TypeError("getRect accepts at most one position keyword.");
    }
    const key = keys[0];
    if (!key)
      return;
    rect[key] = requirePoint(options[key], key);
  }
  function requirePositiveDimension(value, label) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
    throw new TypeError(`${label} must be a positive finite number.`);
  }
  function rectFromBlitTarget(target) {
    if (isPair(target))
      return [target[0], target[1]];
    return new Rect(target);
  }

  // packages/core/src/input.ts
  var baseKeys = {
    BACKSPACE: 8,
    TAB: 9,
    CLEAR: 12,
    RETURN: 13,
    PAUSE: 19,
    ESCAPE: 27,
    SPACE: 32,
    EXCLAIM: 33,
    QUOTEDBL: 34,
    HASH: 35,
    DOLLAR: 36,
    AMPERSAND: 38,
    QUOTE: 39,
    LEFTPAREN: 40,
    RIGHTPAREN: 41,
    ASTERISK: 42,
    PLUS: 43,
    COMMA: 44,
    MINUS: 45,
    PERIOD: 46,
    SLASH: 47,
    K_0: 48,
    K_1: 49,
    K_2: 50,
    K_3: 51,
    K_4: 52,
    K_5: 53,
    K_6: 54,
    K_7: 55,
    K_8: 56,
    K_9: 57,
    COLON: 58,
    SEMICOLON: 59,
    LESS: 60,
    EQUALS: 61,
    GREATER: 62,
    QUESTION: 63,
    AT: 64,
    LEFTBRACKET: 91,
    BACKSLASH: 92,
    RIGHTBRACKET: 93,
    CARET: 94,
    UNDERSCORE: 95,
    BACKQUOTE: 96,
    A: 97,
    B: 98,
    C: 99,
    D: 100,
    E: 101,
    F: 102,
    G: 103,
    H: 104,
    I: 105,
    J: 106,
    K: 107,
    L: 108,
    M: 109,
    N: 110,
    O: 111,
    P: 112,
    Q: 113,
    R: 114,
    S: 115,
    T: 116,
    U: 117,
    V: 118,
    W: 119,
    X: 120,
    Y: 121,
    Z: 122,
    DELETE: 127,
    KP0: 1073741922,
    KP1: 1073741913,
    KP2: 1073741914,
    KP3: 1073741915,
    KP4: 1073741916,
    KP5: 1073741917,
    KP6: 1073741918,
    KP7: 1073741919,
    KP8: 1073741920,
    KP9: 1073741921,
    KP_PERIOD: 1073741923,
    KP_DIVIDE: 1073741908,
    KP_MULTIPLY: 1073741909,
    KP_MINUS: 1073741910,
    KP_PLUS: 1073741911,
    KP_ENTER: 1073741912,
    KP_EQUALS: 1073741927,
    UP: 1073741906,
    DOWN: 1073741905,
    RIGHT: 1073741903,
    LEFT: 1073741904,
    INSERT: 1073741897,
    HOME: 1073741898,
    END: 1073741901,
    PAGEUP: 1073741899,
    PAGEDOWN: 1073741902,
    F1: 1073741882,
    F2: 1073741883,
    F3: 1073741884,
    F4: 1073741885,
    F5: 1073741886,
    F6: 1073741887,
    F7: 1073741888,
    F8: 1073741889,
    F9: 1073741890,
    F10: 1073741891,
    F11: 1073741892,
    F12: 1073741893,
    F13: 1073741928,
    F14: 1073741929,
    F15: 1073741930,
    NUMLOCK: 1073741907,
    CAPSLOCK: 1073741881,
    SCROLLOCK: 1073741895,
    RSHIFT: 1073742053,
    LSHIFT: 1073742049,
    RCTRL: 1073742052,
    LCTRL: 1073742048,
    RALT: 1073742054,
    LALT: 1073742050,
    RMETA: 1073742055,
    LMETA: 1073742051,
    LSUPER: 1073742051,
    RSUPER: 1073742055,
    MODE: 1073742081,
    HELP: 1073741941,
    PRINT: 1073741894,
    SYSREQ: 1073741978,
    BREAK: 1073741896,
    MENU: 1073741942,
    POWER: 1073741926,
    EURO: 1073742004,
    LAST: 1073742106
  };
  var keys = Object.freeze({
    ...baseKeys,
    ENTER: baseKeys.RETURN
  });
  var keymods = Object.freeze({
    NONE: 0,
    LSHIFT: 1,
    RSHIFT: 2,
    SHIFT: 3,
    LCTRL: 64,
    RCTRL: 128,
    CTRL: 192,
    LALT: 256,
    RALT: 512,
    ALT: 768,
    LMETA: 1024,
    RMETA: 2048,
    META: 3072,
    NUM: 4096,
    CAPS: 8192,
    MODE: 16384
  });
  var mouse = Object.freeze({
    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3,
    WHEEL_UP: 4,
    WHEEL_DOWN: 5
  });

  class MouseState {
    pos = null;
    buttons = new Set;
    clearButtons() {
      this.buttons = new Set;
    }
  }
  function createLiveMouse(state, center) {
    const current = () => state.pos ?? center();
    const live = { ...mouse };
    Object.defineProperties(live, {
      pos: {
        get: () => [current()[0], current()[1]],
        enumerable: true,
        configurable: true
      },
      x: { get: () => current()[0], enumerable: true, configurable: true },
      y: { get: () => current()[1], enumerable: true, configurable: true },
      buttons: {
        get: () => new Set(state.buttons),
        enumerable: true,
        configurable: true
      },
      down: {
        get: () => state.buttons.size > 0,
        enumerable: true,
        configurable: true
      }
    });
    return live;
  }
  var keyValues = new Set(Object.values(keys));
  var keyCodesByAttribute = new Map;
  for (const [name, value] of Object.entries(keys)) {
    keyCodesByAttribute.set(keyAttributeName(name), value);
  }
  keyCodesByAttribute.set("enter", keys.RETURN);
  keyCodesByAttribute.set("return", keys.RETURN);
  var safeUnknownKeyboardProperties = new Set([
    "then",
    "toJSON",
    "constructor",
    "valueOf",
    "toString",
    "inspect",
    "asymmetricMatch"
  ]);
  function isSafeUnknownKeyboardProperty(property) {
    return safeUnknownKeyboardProperties.has(property) || property in Object.prototype;
  }

  class KeyboardState {
    _pressed = new Set;
    constructor() {
      return new Proxy(this, {
        get(target, property, receiver) {
          if (typeof property !== "string")
            return Reflect.get(target, property, receiver);
          if (property in target) {
            const value = Reflect.get(target, property, receiver);
            return typeof value === "function" ? value.bind(target) : value;
          }
          if (/^\d+$/.test(property)) {
            const key2 = Number(property);
            return isKeyConstant(key2) ? target.isPressed(key2) : false;
          }
          const key = keyCodesByAttribute.get(property.toLowerCase());
          if (key !== undefined)
            return target.isPressed(key);
          if (isSafeUnknownKeyboardProperty(property))
            return;
          throw new Error(`The key "${property}" does not exist`);
        },
        has(target, property) {
          return property in target || typeof property === "string" && keyCodesByAttribute.has(property.toLowerCase());
        }
      });
    }
    press(key) {
      assertKeyConstant(key);
      this._pressed.add(key);
    }
    release(key) {
      assertKeyConstant(key);
      this._pressed.delete(key);
    }
    clear() {
      this._pressed.clear();
    }
    isPressed(key) {
      assertKeyConstant(key);
      return this._pressed.has(key);
    }
    pressed() {
      return [...this._pressed].sort((a, b) => a - b);
    }
  }
  var defaultKeyboard = new KeyboardState;
  var activeKeyboard = null;
  function setActiveKeyboard(nextKeyboard) {
    const previous = activeKeyboard;
    activeKeyboard = nextKeyboard;
    return previous;
  }
  function getActiveKeyboard() {
    return activeKeyboard ?? defaultKeyboard;
  }
  var keyboard = createActiveServiceProxy(getActiveKeyboard);
  function isKeyConstant(value) {
    return typeof value === "number" && keyValues.has(value);
  }
  function assertKeyConstant(value) {
    if (!isKeyConstant(value)) {
      throw new TypeError(`Invalid key constant: ${String(value)}`);
    }
  }
  function keyAttributeName(name) {
    if (name.startsWith("K_"))
      return `k_${name.slice(2).toLowerCase()}`;
    if (/^KP\d$/.test(name))
      return name.toLowerCase();
    return name.toLowerCase();
  }

  // packages/core/src/events.ts
  var INPUT_HOOK_NAMES = [
    "onMouseDown",
    "onMouseUp",
    "onMouseMove",
    "onKeyDown",
    "onKeyUp",
    "onMusicEnd"
  ];
  var HOOK_PARAMETERS = {
    onMouseDown: ["pos", "button", "buttons", "rel"],
    onMouseUp: ["pos", "button", "buttons", "rel"],
    onMouseMove: ["pos", "rel", "buttons", "button"],
    onKeyDown: ["key", "mod", "unicode", "repeat"],
    onKeyUp: ["key", "mod", "unicode", "repeat"],
    onMusicEnd: []
  };
  var browserCodeToKey = new Map([
    ["Backspace", keys.BACKSPACE],
    ["Tab", keys.TAB],
    ["Clear", keys.CLEAR],
    ["Enter", keys.RETURN],
    ["NumpadEnter", keys.KP_ENTER],
    ["Pause", keys.PAUSE],
    ["Escape", keys.ESCAPE],
    ["Space", keys.SPACE],
    ["Delete", keys.DELETE],
    ["NumpadDecimal", keys.KP_PERIOD],
    ["NumpadDivide", keys.KP_DIVIDE],
    ["NumpadMultiply", keys.KP_MULTIPLY],
    ["NumpadSubtract", keys.KP_MINUS],
    ["NumpadAdd", keys.KP_PLUS],
    ["NumpadEqual", keys.KP_EQUALS],
    ["ArrowUp", keys.UP],
    ["ArrowDown", keys.DOWN],
    ["ArrowRight", keys.RIGHT],
    ["ArrowLeft", keys.LEFT],
    ["Insert", keys.INSERT],
    ["Home", keys.HOME],
    ["End", keys.END],
    ["PageUp", keys.PAGEUP],
    ["PageDown", keys.PAGEDOWN],
    ["NumLock", keys.NUMLOCK],
    ["CapsLock", keys.CAPSLOCK],
    ["ScrollLock", keys.SCROLLOCK],
    ["ShiftRight", keys.RSHIFT],
    ["ShiftLeft", keys.LSHIFT],
    ["ControlRight", keys.RCTRL],
    ["ControlLeft", keys.LCTRL],
    ["AltRight", keys.RALT],
    ["AltLeft", keys.LALT],
    ["MetaRight", keys.RMETA],
    ["MetaLeft", keys.LMETA],
    ["ContextMenu", keys.MENU],
    ["PrintScreen", keys.PRINT],
    ["Minus", keys.MINUS],
    ["Equal", keys.EQUALS],
    ["BracketLeft", keys.LEFTBRACKET],
    ["BracketRight", keys.RIGHTBRACKET],
    ["Backslash", keys.BACKSLASH],
    ["Semicolon", keys.SEMICOLON],
    ["Quote", keys.QUOTE],
    ["Backquote", keys.BACKQUOTE],
    ["Comma", keys.COMMA],
    ["Period", keys.PERIOD],
    ["Slash", keys.SLASH]
  ]);
  for (let index = 0;index <= 9; index += 1) {
    browserCodeToKey.set(`Digit${index}`, keys[`K_${index}`]);
    browserCodeToKey.set(`Numpad${index}`, keys[`KP${index}`]);
  }
  for (let index = 1;index <= 15; index += 1) {
    browserCodeToKey.set(`F${index}`, keys[`F${index}`]);
  }
  for (let code = 65;code <= 90; code += 1) {
    const letter = String.fromCharCode(code);
    browserCodeToKey.set(`Key${letter}`, keys[letter]);
  }
  function dispatchHook(handler, args, order = Object.keys(args)) {
    if (!handler)
      return;
    const parameters = getParameterNames(handler);
    if (parameters.length === 1 && parameters[0] === "event") {
      handler(args);
      return;
    }
    const names = resolveHookParameters(parameters, order);
    handler(...names.map((name) => name === undefined ? undefined : args[name]));
  }
  function resolveHookParameters(declared, known) {
    const claimed = new Set(declared.filter((name) => known.includes(name)));
    const unclaimed = known.filter((name) => !claimed.has(name));
    return declared.map((name) => known.includes(name) ? name : unclaimed.shift());
  }
  function getParameterNames(callback) {
    const source = Function.prototype.toString.call(callback).replaceAll(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    const arrow = /^(?:async\s+)?(?:\(([^)]*)\)|([\w$]+))\s*=>/.exec(source.trim());
    if (arrow)
      return splitParameterList(arrow[1] ?? arrow[2] ?? "");
    const match = /^[^(]*\(([^)]*)\)/.exec(source);
    return match ? splitParameterList(match[1] ?? "") : [];
  }
  function mapBrowserKeyEvent(event) {
    const key = keyFromBrowserEvent(event);
    if (key === null)
      return null;
    return {
      key,
      mod: modifiersFromKeyboardEvent(event),
      unicode: unicodeFromKeyboardEvent(event),
      repeat: event.repeat === true
    };
  }
  function mapBrowserMouseEvent(event, target, previousPos) {
    const scale = displayToLogicalScale(target);
    const pos = pointFromMouseEvent(event, target, scale);
    return {
      pos,
      button: mapBrowserMouseButton(event.button),
      buttons: buttonsFromBrowserButtons(event.buttons ?? 0),
      rel: relativeMotion(event, pos, previousPos, scale)
    };
  }
  function mapBrowserMouseButton(button) {
    if (button === 0)
      return mouse.LEFT;
    if (button === 1)
      return mouse.MIDDLE;
    if (button === 2)
      return mouse.RIGHT;
    return null;
  }
  function mapBrowserWheelEvent(event, target) {
    if (!(event.deltaY < 0) && !(event.deltaY > 0))
      return null;
    const button = event.deltaY < 0 ? mouse.WHEEL_UP : mouse.WHEEL_DOWN;
    return {
      pos: pointFromMouseEvent(event, target, displayToLogicalScale(target)),
      button,
      buttons: buttonsFromBrowserButtons(event.buttons ?? 0),
      rel: [0, 0]
    };
  }
  function buttonsFromBrowserButtons(buttons) {
    const pressed = new Set;
    if ((buttons & 1) !== 0)
      pressed.add(mouse.LEFT);
    if ((buttons & 2) !== 0)
      pressed.add(mouse.RIGHT);
    if ((buttons & 4) !== 0)
      pressed.add(mouse.MIDDLE);
    return pressed;
  }

  class InputDispatcher {
    keyboard;
    mouseState;
    hooks;
    lastMousePos = null;
    physicalKeys = new Set;
    virtualKeys = new Map;
    constructor(hooks = {}, keyboard2 = new KeyboardState, mouseState = new MouseState) {
      this.hooks = hooks;
      this.keyboard = keyboard2;
      this.mouseState = mouseState;
    }
    handleKeyDown(event) {
      const mapped = mapBrowserKeyEvent(event);
      if (!mapped)
        return false;
      this.physicalKeys.add(mapped.key);
      this.keyboard.press(mapped.key);
      if (![...this.virtualKeys.values()].includes(mapped.key) || mapped.repeat) {
        dispatchHook(this.hooks.onKeyDown, mapped, HOOK_PARAMETERS.onKeyDown);
      }
      return true;
    }
    handleKeyUp(event) {
      const mapped = mapBrowserKeyEvent(event);
      if (!mapped)
        return false;
      this.physicalKeys.delete(mapped.key);
      if ([...this.virtualKeys.values()].includes(mapped.key))
        return true;
      this.keyboard.release(mapped.key);
      dispatchHook(this.hooks.onKeyUp, mapped, HOOK_PARAMETERS.onKeyUp);
      return true;
    }
    handleFocusLoss() {
      this.physicalKeys.clear();
      this.virtualKeys.clear();
      this.keyboard.clear();
      this.mouseState.clearButtons();
    }
    handleVirtualKeyDown(key, source) {
      assertKeyConstant(key);
      if (this.virtualKeys.has(source))
        return;
      this.virtualKeys.set(source, key);
      const held = this.keyboard.isPressed(key);
      this.keyboard.press(key);
      if (!held) {
        dispatchHook(this.hooks.onKeyDown, { key, mod: keymods.NONE, unicode: "", repeat: false }, HOOK_PARAMETERS.onKeyDown);
      }
    }
    handleVirtualKeyUp(source) {
      const key = this.virtualKeys.get(source);
      if (key === undefined)
        return;
      this.virtualKeys.delete(source);
      if (this.physicalKeys.has(key) || [...this.virtualKeys.values()].includes(key)) {
        return;
      }
      this.keyboard.release(key);
      dispatchHook(this.hooks.onKeyUp, { key, mod: keymods.NONE, unicode: "", repeat: false }, HOOK_PARAMETERS.onKeyUp);
    }
    handleMouseDown(event, target) {
      const mapped = mapBrowserMouseEvent(event, target, this.lastMousePos);
      this.trackMouse(mapped);
      if (mapped.button === null)
        return false;
      dispatchHook(this.hooks.onMouseDown, mapped, HOOK_PARAMETERS.onMouseDown);
      return true;
    }
    handleMouseUp(event, target) {
      const mapped = mapBrowserMouseEvent(event, target, this.lastMousePos);
      this.trackMouse(mapped);
      if (mapped.button === null)
        return false;
      dispatchHook(this.hooks.onMouseUp, mapped, HOOK_PARAMETERS.onMouseUp);
      return true;
    }
    handleMouseMove(event, target) {
      const mapped = mapBrowserMouseEvent(event, target, this.lastMousePos);
      this.trackMouse(mapped);
      dispatchHook(this.hooks.onMouseMove, mapped, HOOK_PARAMETERS.onMouseMove);
      return true;
    }
    handleWheel(event, target) {
      const mapped = mapBrowserWheelEvent(event, target);
      if (!mapped)
        return false;
      this.lastMousePos = mapped.pos;
      this.mouseState.pos = mapped.pos;
      dispatchHook(this.hooks.onMouseDown, mapped, HOOK_PARAMETERS.onMouseDown);
      return true;
    }
    trackMouse(mapped) {
      this.lastMousePos = mapped.pos;
      this.mouseState.pos = mapped.pos;
      this.mouseState.buttons = new Set(mapped.buttons);
    }
    attach(mouseTarget, keyboardTarget = mouseTarget) {
      const keyDown = (event) => this.handleKeyDown(event);
      const keyUp = (event) => this.handleKeyUp(event);
      const mouseDown = (event) => this.handleMouseDown(event, mouseTarget);
      const mouseUp = (event) => this.handleMouseUp(event, mouseTarget);
      const mouseMove = (event) => this.handleMouseMove(event, mouseTarget);
      const wheel = (event) => this.handleWheel(event, mouseTarget);
      const focusLoss = () => this.handleFocusLoss();
      const visibilityTarget = mouseTarget.ownerDocument ?? (typeof document === "undefined" ? keyboardTarget : document);
      const visibilityChange = () => {
        const target = visibilityTarget;
        if (target.hidden === false || target.visibilityState === "visible") {
          return;
        }
        this.handleFocusLoss();
      };
      const mouseReleaseTarget = keyboardTarget === mouseTarget ? mouseTarget : keyboardTarget;
      keyboardTarget.addEventListener("keydown", keyDown);
      keyboardTarget.addEventListener("keyup", keyUp);
      keyboardTarget.addEventListener("blur", focusLoss);
      visibilityTarget.addEventListener("visibilitychange", visibilityChange);
      mouseTarget.addEventListener("mousedown", mouseDown);
      mouseReleaseTarget.addEventListener("mouseup", mouseUp);
      mouseTarget.addEventListener("mousemove", mouseMove);
      mouseTarget.addEventListener("wheel", wheel, { passive: true });
      return () => {
        keyboardTarget.removeEventListener("keydown", keyDown);
        keyboardTarget.removeEventListener("keyup", keyUp);
        keyboardTarget.removeEventListener("blur", focusLoss);
        visibilityTarget.removeEventListener("visibilitychange", visibilityChange);
        mouseTarget.removeEventListener("mousedown", mouseDown);
        mouseReleaseTarget.removeEventListener("mouseup", mouseUp);
        mouseTarget.removeEventListener("mousemove", mouseMove);
        mouseTarget.removeEventListener("wheel", wheel);
      };
    }
  }
  function createInputDispatcher(hooks = {}, keyboard2 = new KeyboardState, mouseState = new MouseState) {
    return new InputDispatcher(hooks, keyboard2, mouseState);
  }
  function keyFromBrowserEvent(event) {
    if (event.code && browserCodeToKey.has(event.code)) {
      return browserCodeToKey.get(event.code) ?? null;
    }
    const key = event.key;
    if (!key)
      return null;
    if (key.length === 1) {
      const code = key.toLowerCase().charCodeAt(0);
      if (code >= 97 && code <= 122)
        return code;
      if (code >= 48 && code <= 57)
        return code;
      const punctuation = punctuationKey(key);
      if (punctuation !== null)
        return punctuation;
    }
    return namedKey(key);
  }
  function namedKey(key) {
    switch (key) {
      case "ArrowUp":
        return keys.UP;
      case "ArrowDown":
        return keys.DOWN;
      case "ArrowRight":
        return keys.RIGHT;
      case "ArrowLeft":
        return keys.LEFT;
      case "Enter":
        return keys.RETURN;
      case "Escape":
        return keys.ESCAPE;
      case " ":
      case "Spacebar":
        return keys.SPACE;
      case "Backspace":
        return keys.BACKSPACE;
      case "Tab":
        return keys.TAB;
      case "Delete":
        return keys.DELETE;
      default:
        return null;
    }
  }
  function punctuationKey(value) {
    const code = value.charCodeAt(0);
    if (code >= 33 && code <= 47 || code >= 58 && code <= 64 || code >= 91 && code <= 96) {
      return code;
    }
    return null;
  }
  function unicodeFromKeyboardEvent(event) {
    return event.key && event.key.length === 1 ? event.key : "";
  }
  function modifiersFromKeyboardEvent(event) {
    let mod = 0;
    if (event.shiftKey)
      mod |= keymods.SHIFT;
    if (event.ctrlKey)
      mod |= keymods.CTRL;
    if (event.altKey)
      mod |= keymods.ALT;
    if (event.metaKey)
      mod |= keymods.META;
    if (event.code === "ShiftLeft")
      mod |= keymods.LSHIFT | keymods.SHIFT;
    if (event.code === "ShiftRight")
      mod |= keymods.RSHIFT | keymods.SHIFT;
    if (event.code === "ControlLeft")
      mod |= keymods.LCTRL | keymods.CTRL;
    if (event.code === "ControlRight")
      mod |= keymods.RCTRL | keymods.CTRL;
    if (event.code === "AltLeft")
      mod |= keymods.LALT | keymods.ALT;
    if (event.code === "AltRight")
      mod |= keymods.RALT | keymods.ALT;
    if (event.code === "MetaLeft")
      mod |= keymods.LMETA | keymods.META;
    if (event.code === "MetaRight")
      mod |= keymods.RMETA | keymods.META;
    if (event.getModifierState?.("CapsLock"))
      mod |= keymods.CAPS;
    if (event.getModifierState?.("NumLock"))
      mod |= keymods.NUM;
    if (event.getModifierState?.("AltGraph"))
      mod |= keymods.MODE;
    return mod;
  }
  function displayToLogicalScale(target) {
    const rect = target?.getBoundingClientRect?.();
    return [
      axisScale(target?.width, rect?.width),
      axisScale(target?.height, rect?.height)
    ];
  }
  function axisScale(logical, displayed) {
    if (typeof logical !== "number" || !Number.isFinite(logical) || logical <= 0)
      return 1;
    if (typeof displayed !== "number" || !Number.isFinite(displayed) || displayed <= 0)
      return 1;
    return logical / displayed;
  }
  function pointFromMouseEvent(event, target, scale) {
    const rect = target?.getBoundingClientRect?.();
    const left = rect?.left ?? 0;
    const top = rect?.top ?? 0;
    return [(event.clientX - left) * scale[0], (event.clientY - top) * scale[1]];
  }
  function relativeMotion(event, pos, previousPos, scale) {
    if (typeof event.movementX === "number" && typeof event.movementY === "number") {
      return [event.movementX * scale[0], event.movementY * scale[1]];
    }
    if (previousPos)
      return [pos[0] - previousPos[0], pos[1] - previousPos[1]];
    return [0, 0];
  }
  function splitParameterList(parameters) {
    return parameters.split(",").map(cleanParameter).filter((parameter) => parameter.length > 0);
  }
  function cleanParameter(parameter) {
    return parameter.trim().replace(/=.*$/, "").replace(/^\.{3}/, "").trim();
  }

  // packages/core/src/clock.ts
  function requireCallback(callback, method) {
    if (typeof callback === "function")
      return;
    throw new TypeError(`clock.${method} needs a function to call later, but got ${describeValue(callback)}. Give the function's name without brackets: clock.${method}(spawn, 1), not clock.${method}(spawn(), 1).`);
  }

  class Clock {
    options;
    time = 0;
    nextOrder = 0;
    scheduled = [];
    active = new Set;
    tickCallbacks = [];
    constructor(options = {}) {
      this.options = options;
    }
    schedule(callback, delay) {
      requireCallback(callback, "schedule");
      this.scheduled.push({
        callback,
        due: this.time + validateDuration(delay, "delay"),
        interval: null,
        order: this.nextOrder,
        canceled: false
      });
      this.nextOrder += 1;
    }
    scheduleUnique(callback, delay) {
      requireCallback(callback, "scheduleUnique");
      this.unschedule(callback);
      this.schedule(callback, delay);
    }
    scheduleInterval(callback, interval) {
      requireCallback(callback, "scheduleInterval");
      const seconds = validateDuration(interval, "interval");
      if (seconds === 0)
        throw new RangeError("interval must be greater than 0.");
      this.scheduled.push({
        callback,
        due: this.time + seconds,
        interval: seconds,
        order: this.nextOrder,
        canceled: false
      });
      this.nextOrder += 1;
    }
    unschedule(callback) {
      for (const event of this.scheduled) {
        if (event.callback === callback)
          event.canceled = true;
      }
      for (const event of this.active) {
        if (event.callback === callback)
          event.canceled = true;
      }
      for (const event of this.tickCallbacks) {
        if (event.callback === callback)
          event.canceled = true;
      }
      this.scheduled = this.scheduled.filter((event) => !event.canceled);
      this.tickCallbacks = this.tickCallbacks.filter((event) => !event.canceled);
    }
    eachTick(callback) {
      this.tickCallbacks.push({ callback, canceled: false });
    }
    clear() {
      for (const event of this.scheduled)
        event.canceled = true;
      for (const event of this.active)
        event.canceled = true;
      for (const event of this.tickCallbacks)
        event.canceled = true;
      this.scheduled = [];
      this.tickCallbacks = [];
    }
    tick(dt) {
      const delta = validateDuration(dt, "dt");
      const targetTime = this.time + delta;
      const tickCallbacks = [...this.tickCallbacks];
      for (const event2 of tickCallbacks) {
        if (event2.canceled)
          continue;
        try {
          event2.callback(delta);
        } catch (error) {
          this.reportCallbackError(error);
          this.unschedule(event2.callback);
        }
      }
      this.tickCallbacks = this.tickCallbacks.filter((event2) => !event2.canceled);
      this.time = targetTime;
      let event = this.nextDueEvent();
      while (event && event.due <= this.time) {
        this.scheduled.splice(this.scheduled.indexOf(event), 1);
        if (!event.canceled) {
          this.active.add(event);
          try {
            event.callback();
          } catch (error) {
            this.reportCallbackError(error);
            this.active.delete(event);
            this.unschedule(event.callback);
            event = this.nextDueEvent();
            continue;
          }
          this.active.delete(event);
        }
        if (event.interval !== null && !event.canceled) {
          event.due += event.interval;
          this.scheduled.push(event);
        }
        event = this.nextDueEvent();
      }
    }
    now() {
      return this.time;
    }
    nextDueEvent() {
      this.scheduled = this.scheduled.filter((event) => !event.canceled);
      return this.scheduled.reduce((best, event) => {
        if (!best)
          return event;
        if (event.due < best.due)
          return event;
        if (event.due === best.due && event.order < best.order)
          return event;
        return best;
      }, undefined);
    }
    reportCallbackError(error) {
      if (this.options.onError)
        this.options.onError(error);
      else
        reportClockCallbackError(error);
    }
  }
  guardSpellings(Clock.prototype, "clock");
  var defaultClock = new Clock;
  var activeClock = null;
  function setActiveClock(nextClock) {
    const previous = activeClock;
    activeClock = nextClock;
    return previous;
  }
  function getActiveClock() {
    return activeClock ?? defaultClock;
  }
  var clock = createActiveServiceProxy(getActiveClock);
  function validateDuration(value, label) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError(`${label} must be a finite number.`);
    }
    if (value < 0)
      throw new RangeError(`${label} must be non-negative.`);
    return value;
  }
  function reportClockCallbackError(error) {
    console.error("Error in scheduled clock callback:", error);
  }

  // packages/core/src/color.ts
  var namedColors = new Set(`aliceblue antiquewhite aqua aquamarine azure beige bisque black
  blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse
  chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan
  darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta
  darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen
  darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink
  deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen
  fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey
  honeydew hotpink indianred indigo ivory khaki lavender lavenderblush
  lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow
  lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen
  lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime
  limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid
  mediumpurple mediumseagreen mediumslateblue mediumspringgreen
  mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin
  navajowhite navy oldlace olive olivedrab orange orangered orchid
  palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff
  peru pink plum powderblue purple rebeccapurple red rosybrown royalblue
  saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue
  slateblue slategray slategrey snow springgreen steelblue tan teal thistle
  tomato turquoise violet wheat white whitesmoke yellow yellowgreen
  transparent currentcolor`.split(/\s+/));
  var hexColor = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
  var colorFunction = /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(.*\)$/is;
  function normalizeColor(color) {
    if (typeof color === "string")
      return requireColorString(color);
    if (Array.isArray(color) && (color.length === 3 || color.length === 4)) {
      return colorFromTuple(color);
    }
    throw new TypeError(`${describeValue(color)} isn't a color. Use a color name like "red", a hex code like "#ff8800", or a list of red, green and blue numbers like [255, 136, 0].`);
  }
  function requireColorString(color) {
    const value = color.trim();
    if (namedColors.has(value.toLowerCase()) || hexColor.test(value) || colorFunction.test(value) || browserSupportsColor(value)) {
      return color;
    }
    if (value.startsWith("#")) {
      throw new TypeError(`"${color}" isn't a hex color. Use # and 3 or 6 hex digits (0-9, a-f), like "#f80" or "#ff8800".`);
    }
    const suggestion = closestColorName(value);
    throw new TypeError(suggestion === undefined ? `"${color}" isn't a color name. Use a color name like "red", a hex code like "#ff8800", or a list like [255, 136, 0].` : `"${color}" isn't a color name. Did you mean "${suggestion}"?`);
  }
  function colorFromTuple(color) {
    const problem = tupleProblem(color);
    if (problem !== undefined) {
      throw new TypeError(`${describeValue(color)} isn't a color: ${problem}.`);
    }
    const [red, green, blue, alpha] = color;
    if (alpha === undefined)
      return `rgb(${red}, ${green}, ${blue})`;
    return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
  }
  function tupleProblem(color) {
    const [red, green, blue] = color;
    const alpha = color[3];
    const isChannel = (value) => Number.isInteger(value) && value >= 0 && value <= 255;
    if (![red, green, blue].every(isChannel)) {
      return "red, green and blue must be whole numbers from 0 to 255";
    }
    if (alpha === undefined)
      return;
    if (typeof alpha === "number" && alpha > 0 && alpha < 1) {
      return `the fourth number (alpha) goes from 0 (invisible) to 255 (solid), so for half see-through use ${Math.round(alpha * 255)}, not ${alpha}`;
    }
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 255) {
      return "the fourth number (alpha) goes from 0 (invisible) to 255 (solid)";
    }
    return;
  }
  function rgb(red, green, blue, alpha) {
    for (const [label, value] of Object.entries({ red, green, blue })) {
      if (value === undefined) {
        throw new TypeError(`rgb is missing ${label}: rgb(red, green, blue), each from 0 to 255.`);
      }
      requireRgbNumber(value, label);
    }
    if (alpha !== undefined)
      requireRgbNumber(alpha, "alpha");
    const color = alpha === undefined ? [red, green, blue] : [red, green, blue, alpha];
    const problem = tupleProblem(color);
    if (problem !== undefined) {
      throw new TypeError(`rgb(${color.join(", ")}) isn't a color: ${problem}.`);
    }
    return color;
  }
  function requireRgbNumber(value, label) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError(`rgb's ${label} must be a number, but got ${describeValue(value)}.`);
    }
  }
  function closestColorName(value) {
    const squashed = value.toLowerCase().replace(/[\s_-]/g, "");
    if (namedColors.has(squashed))
      return squashed;
    const threshold = squashed.length < 6 ? 1 : 2;
    let best;
    for (const name of namedColors) {
      const distance = editDistance(squashed, name);
      if (distance <= threshold && (!best || distance < best.distance)) {
        best = { name, distance };
      }
    }
    return best?.name;
  }
  function browserSupportsColor(value) {
    const css = globalThis.CSS;
    try {
      return css?.supports?.("color", value) === true;
    } catch {
      return false;
    }
  }
  function verticalGradient(context, top, height, color, gcolor) {
    const gradient = context.createLinearGradient(0, top, 0, top + height);
    gradient.addColorStop(0, normalizeColor(color));
    gradient.addColorStop(1, normalizeColor(gcolor));
    return gradient;
  }

  // packages/core/src/rendering.ts
  var textPositionKeys = ["pos", ...rectPositionKeys];
  var textOptionAliases = {
    size: "fontsize",
    minSize: "minFontsize",
    outline: "owidth",
    outlineColor: "ocolor",
    shadowColor: "scolor",
    gradientColor: "gcolor"
  };
  var textboxOptionKeys = new Set([
    ...Object.keys(textOptionAliases),
    ...rectPositionKeys,
    "fontname",
    "sysfontname",
    "fontsize",
    "minFontsize",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "lineheight",
    "align",
    "strip",
    "owidth",
    "ocolor",
    "shadow",
    "scolor",
    "gcolor",
    "alpha",
    "anchor",
    "angle"
  ]);
  var textOptionKeys = new Set([
    ...[...textboxOptionKeys].filter((key) => key !== "minFontsize" && key !== "minSize"),
    "pos",
    "top",
    "left",
    "bottom",
    "right",
    "centerX",
    "centerY",
    "width",
    "widthem"
  ]);
  var shortForms = {
    circle: {
      call: "screen.circle(x, y, radius, color)",
      numbers: ["x", "y", "radius"],
      arity: 4,
      lists: 'screen.circle takes x, y as two numbers, like screen.circle(200, 150, 25, "gold"). For an [x, y] list, use screen.draw.filledCircle([x, y], radius, color).',
      extra: "screen.circle always fills, so it has no outline width. For an outline, use screen.draw.circle([x, y], radius, color, width)."
    },
    rect: {
      call: "screen.rect(x, y, width, height, color)",
      numbers: ["x", "y", "width", "height"],
      arity: 5,
      lists: 'screen.rect takes x, y, width, height as four numbers, like screen.rect(40, 40, 120, 60, "orange"). For a list or a Rect, use screen.draw.filledRect([x, y, width, height], color).',
      extra: "screen.rect always fills, so it has no outline width. For an outline, use screen.draw.rect([x, y, width, height], color, width)."
    },
    triangle: {
      call: "screen.triangle(x1, y1, x2, y2, x3, y3, color)",
      numbers: ["x1", "y1", "x2", "y2", "x3", "y3"],
      arity: 7,
      lists: 'screen.triangle takes each corner as two numbers, like screen.triangle(160, 40, 120, 120, 200, 120, "lime"). For [x, y] lists, use screen.draw.filledPolygon([[x1, y1], [x2, y2], [x3, y3]], color).',
      extra: "screen.triangle always fills, so it has no outline width. For an outline, use screen.draw.polygon([[x1, y1], [x2, y2], [x3, y3]], color, width)."
    },
    line: {
      call: "screen.line(x1, y1, x2, y2, color, width)",
      numbers: ["x1", "y1", "x2", "y2"],
      arity: 6,
      lists: 'screen.line takes each end as two numbers, like screen.line(20, 20, 200, 120, "white", 3). For [x, y] lists, use screen.draw.line([x1, y1], [x2, y2], color, width).',
      extra: "screen.line takes at most six values: screen.line(x1, y1, x2, y2, color, width)."
    }
  };
  var currentScreen = null;
  var screenSizes = new WeakMap;
  var densityAttribute = "data-jgz-density";
  var densityRule = `:where(canvas[${densityAttribute}]) { width: var(--jgz-width); }`;
  function resizeScreen(screen, width, height, density = 1) {
    const canvas = screen.canvas;
    const previous = screenSizes.get(screen);
    const canvasWidth = Math.max(1, Math.round(width * density));
    const canvasHeight = Math.max(1, Math.round(height * density));
    const kept = previous?.width === width && previous.height === height && (canvas.width !== canvasWidth || canvas.height !== canvasHeight) ? copyCanvas(canvas) : null;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const size = { width, height, density, canvasWidth, canvasHeight };
    screenSizes.set(screen, size);
    applyDensityTransform(screen.context, size);
    applyDensityCss(canvas, size);
    if (kept)
      screen.context.drawImage(kept, 0, 0, width, height);
  }
  function syncScreen(screen) {
    const size = screenSizes.get(screen);
    if (!size)
      return;
    const { canvas, context } = screen;
    if (canvas.width !== size.canvasWidth || canvas.height !== size.canvasHeight) {
      resizeScreen(screen, canvas.width === size.canvasWidth ? size.width : canvas.width, canvas.height === size.canvasHeight ? size.height : canvas.height, size.density);
      return;
    }
    if (!isScaled(size) || typeof context.getTransform !== "function")
      return;
    const matrix = context.getTransform();
    if (matrix.isIdentity)
      applyDensityTransform(context, size);
  }
  function isScaled(size) {
    return size.canvasWidth !== size.width || size.canvasHeight !== size.height;
  }
  function applyDensityTransform(context, size) {
    if (!isScaled(size) || typeof context.setTransform !== "function")
      return;
    context.setTransform(size.canvasWidth / size.width, 0, 0, size.canvasHeight / size.height, 0, 0);
  }
  function applyDensityCss(canvas, size) {
    const { style, ownerDocument: doc } = canvas;
    if (!style || !doc || typeof canvas.setAttribute !== "function")
      return;
    if (!isScaled(size)) {
      canvas.removeAttribute?.(densityAttribute);
      style.removeProperty("--jgz-width");
      return;
    }
    const root = canvas.getRootNode?.();
    const parent = root && root.nodeType === 11 ? root : doc.head ?? null;
    if (parent && !parent.querySelector(`style[${densityAttribute}]`)) {
      const rule = doc.createElement("style");
      rule.setAttribute(densityAttribute, "");
      rule.textContent = densityRule;
      parent.prepend(rule);
    }
    canvas.setAttribute(densityAttribute, "");
    style.setProperty("--jgz-width", `${size.width}px`);
  }
  function copyCanvas(canvas) {
    if (canvas.width === 0 || canvas.height === 0)
      return null;
    try {
      const copy = typeof OffscreenCanvas === "function" ? new OffscreenCanvas(canvas.width, canvas.height) : canvas.ownerDocument?.createElement("canvas");
      if (!copy)
        return null;
      copy.width = canvas.width;
      copy.height = canvas.height;
      const context = copy.getContext("2d");
      if (!context)
        return null;
      context.drawImage(canvas, 0, 0);
      return copy;
    } catch {
      return null;
    }
  }
  var MAX_DRAWN = 200;
  var drawnThings = new WeakMap;
  function beginDrawn(screen) {
    drawnThings.set(screen, []);
  }
  function drawnOn(screen) {
    return drawnThings.get(screen) ?? [];
  }
  function recordDrawn(screen, thing) {
    const list = drawnThings.get(screen);
    if (list && list.length < MAX_DRAWN)
      list.push(thing);
  }
  var colorOf = (color) => typeof color === "string" ? color : [...color];

  class Screen {
    canvas;
    context;
    imageLoader;
    draw = {
      line: (start, end, color, width = 1) => this.drawLine(start, end, color, width),
      circle: (pos, radius, color, width = 1) => this.drawCircle(pos, radius, color, width),
      filledCircle: (pos, radius, color) => this.drawCircle(pos, radius, color, 0, true),
      polygon: (points, color, width = 1) => this.drawPolygon(points, color, width),
      filledPolygon: (points, color) => this.drawPolygon(points, color, 0, true),
      rect: (rect, color, width = 1) => this.drawRect(rect, color, width),
      filledRect: (rect, color) => this.drawRect(rect, color, 0, true),
      text: (text, posOrOptions, options) => this.drawText(text, posOrOptions, options),
      textbox: (text, rect, options = {}) => this.drawTextbox(text, rect, options),
      image: (image, pos) => this.blit(image, pos)
    };
    constructor(canvas, context, options = {}) {
      const resolvedContext = context ?? canvas.getContext?.("2d");
      if (!resolvedContext) {
        throw new TypeError("Screen requires a Canvas 2D context.");
      }
      this.canvas = canvas;
      this.context = resolvedContext;
      this.imageLoader = options.imageLoader ?? images;
      guardSpellings(this.draw, "screen.draw");
    }
    get width() {
      return screenSizes.get(this)?.width ?? this.canvas.width;
    }
    get height() {
      return screenSizes.get(this)?.height ?? this.canvas.height;
    }
    get density() {
      return screenSizes.get(this)?.density ?? 1;
    }
    bounds() {
      return new ZRect(0, 0, this.width, this.height);
    }
    clear() {
      recordDrawn(this, { kind: "clear" });
      withSavedCanvasState(this.context, () => {
        this.context.globalAlpha = 1;
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.width, this.height);
      });
    }
    fill(color, gcolor) {
      recordDrawn(this, {
        kind: "fill",
        color: colorOf(color),
        ...gcolor === undefined ? {} : { to: colorOf(gcolor) }
      });
      const style = gcolor === undefined ? normalizeColor(color) : verticalGradient(this.context, 0, this.height, color, gcolor);
      this.context.fillStyle = style;
      this.context.fillRect(0, 0, this.width, this.height);
    }
    blit(image, pos) {
      const at = rectFromBlitTarget(pos);
      const surface = typeof image === "string" ? this.imageLoader.get(image) : image;
      if (!surface) {
        return this.imageLoader.load(image).then(() => {
          return;
        });
      }
      recordDrawn(this, {
        kind: "image",
        image: typeof image === "string" ? image : "",
        x: Array.isArray(at) ? at[0] : at.left,
        y: Array.isArray(at) ? at[1] : at.top
      });
      this.drawSurface(surface, pos);
    }
    circle(x, y, radius, color = "white") {
      requireShortForm(shortForms.circle, arguments);
      this.drawCircle([x, y], radius, color, 0, true);
    }
    rect(x, y, width, height, color = "white") {
      requireShortForm(shortForms.rect, arguments);
      this.drawRect([x, y, width, height], color, 0, true);
    }
    triangle(x1, y1, x2, y2, x3, y3, color = "white") {
      requireShortForm(shortForms.triangle, arguments);
      this.drawPolygon([
        [x1, y1],
        [x2, y2],
        [x3, y3]
      ], color, 0, true);
    }
    line(x1, y1, x2, y2, color = "white", width = 1) {
      requireShortForm(shortForms.line, arguments);
      this.drawLine([x1, y1], [x2, y2], color, width);
    }
    text(text, x, y, color = "white", size = 24) {
      requireTextShortForm(arguments);
      this.drawText(String(text), [x, y], { color, fontsize: size });
    }
    drawSurface(surface, pos) {
      const target = rectFromBlitTarget(pos);
      const source = surface.source;
      if (Array.isArray(target)) {
        this.context.drawImage(source, target[0], target[1]);
        return;
      }
      this.context.drawImage(source, target.left, target.top);
    }
    drawLine(start, end, color, width) {
      const [startX, startY] = requirePoint(start, "start");
      const [endX, endY] = requirePoint(end, "end");
      recordDrawn(this, {
        kind: "line",
        x: startX,
        y: startY,
        x2: endX,
        y2: endY,
        color: colorOf(color)
      });
      withSavedCanvasState(this.context, () => {
        this.context.strokeStyle = normalizeColor(color);
        this.context.lineWidth = requirePositiveNumber(width, "width");
        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
      });
    }
    drawCircle(pos, radius, color, width, filled = false) {
      const [x, y] = requirePoint(pos, "pos");
      const parsedRadius = requirePositiveNumber(radius, "radius");
      recordDrawn(this, {
        kind: "circle",
        x,
        y,
        radius: parsedRadius,
        color: colorOf(color),
        filled
      });
      withSavedCanvasState(this.context, () => {
        this.context.beginPath();
        this.context.arc(x, y, parsedRadius, 0, Math.PI * 2);
        if (filled) {
          this.context.fillStyle = normalizeColor(color);
          this.context.fill();
        } else {
          this.context.strokeStyle = normalizeColor(color);
          this.context.lineWidth = requirePositiveNumber(width, "width");
          this.context.stroke();
        }
      });
    }
    drawPolygon(points, color, width, filled = false) {
      if (!Array.isArray(points) || points.length < 3) {
        throw new TypeError("polygon requires at least three points.");
      }
      const parsed = points.map((point, index) => requirePoint(point, `points[${index}]`));
      const first = parsed[0];
      if (!first)
        throw new TypeError("polygon requires at least three points.");
      recordDrawn(this, {
        kind: "polygon",
        x: first[0],
        y: first[1],
        points: parsed.length,
        color: colorOf(color),
        filled
      });
      withSavedCanvasState(this.context, () => {
        this.context.beginPath();
        this.context.moveTo(first[0], first[1]);
        for (const [x, y] of parsed.slice(1))
          this.context.lineTo(x, y);
        this.context.closePath();
        if (filled) {
          this.context.fillStyle = normalizeColor(color);
          this.context.fill();
        } else {
          this.context.strokeStyle = normalizeColor(color);
          this.context.lineWidth = requirePositiveNumber(width, "width");
          this.context.stroke();
        }
      });
    }
    drawRect(rectLike, color, width, filled = false) {
      const rect = new Rect(rectLike);
      recordDrawn(this, {
        kind: "rect",
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        color: colorOf(color),
        filled
      });
      withSavedCanvasState(this.context, () => {
        if (filled) {
          this.context.fillStyle = normalizeColor(color);
          this.context.fillRect(rect.left, rect.top, rect.width, rect.height);
        } else {
          this.context.strokeStyle = normalizeColor(color);
          this.context.lineWidth = requirePositiveNumber(width, "width");
          this.context.strokeRect(rect.left, rect.top, rect.width, rect.height);
        }
      });
    }
    drawText(text, posOrOptions, maybeOptions) {
      let pos;
      let given;
      if (isPlainOptions(posOrOptions)) {
        if (maybeOptions !== undefined) {
          throw new TypeError('screen.draw.text takes its options once: either second, as in text("Hi", { center: [x, y] }), or third, after a position.');
        }
        given = posOrOptions;
      } else {
        pos = posOrOptions;
        given = maybeOptions ?? {};
      }
      rejectUnknownOptions(given, textOptionKeys, "screen.draw.text");
      const options = canonicalTextOptions(given, "screen.draw.text");
      const layout = layoutText(this.context, text, pos, options);
      recordDrawn(this, {
        kind: "text",
        text: String(text),
        x: layout.topLeft[0],
        y: layout.topLeft[1],
        width: layout.boxWidth,
        height: layout.boxHeight,
        ...options.color === undefined ? {} : { color: colorOf(options.color) }
      });
      renderTextLayout(this.context, layout, options);
    }
    drawTextbox(text, rectLike, givenOptions) {
      rejectUnknownOptions(givenOptions, textboxOptionKeys, "screen.draw.textbox");
      const options = canonicalTextOptions(givenOptions, "screen.draw.textbox");
      const rect = new Rect(rectLike);
      recordDrawn(this, {
        kind: "text",
        text: String(text),
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        ...options.color === undefined ? {} : { color: colorOf(options.color) }
      });
      const fit = fitTextboxFontSize(this.context, text, rect, options);
      const anchor = options.anchor ?? "center";
      const rectAnchorOffset = anchorOffsetFor(anchor, rect.width, rect.height);
      const point = [
        rect.left + rectAnchorOffset[0],
        rect.top + rectAnchorOffset[1]
      ];
      const layout = layoutText(this.context, text, point, {
        ...options,
        fontsize: fit.fontSize,
        width: rect.width,
        lineheight: fit.lineHeight,
        anchor
      });
      renderTextLayout(this.context, layout, options);
    }
  }
  function isPlainOptions(value) {
    if (typeof value !== "object" || value === null)
      return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }
  function canonicalTextOptions(options, label) {
    let result = null;
    for (const [alias, canonical] of Object.entries(textOptionAliases)) {
      if (!(alias in options))
        continue;
      if (canonical in options) {
        throw new TypeError(`${label} got both ${alias} and ${canonical}; they mean the same thing, so give just one.`);
      }
      result ??= { ...options };
      result[canonical] = result[alias];
      delete result[alias];
    }
    return result ?? options;
  }
  function setScreen(screen) {
    const previous = currentScreen;
    currentScreen = screen;
    return previous;
  }
  function getScreen() {
    if (!currentScreen) {
      throw new Error("No active Screen has been configured.");
    }
    return currentScreen;
  }
  var screen = createActiveServiceProxy(getScreen);
  function layoutText(context, text, pos, options = {}) {
    const fontSize = requirePositiveNumber(options.fontsize ?? 24, "fontsize");
    const lineHeight = requirePositiveNumber(options.lineheight ?? fontSize * 1.2, "lineheight");
    const font = buildFontString(fontSize, options);
    const widthLimit = options.width ?? (options.widthem === undefined ? undefined : options.widthem * fontSize);
    const strip = options.strip ?? true;
    const { lines, textWidth } = withTemporaryFont(context, font, () => {
      const lines2 = wrapLines(context, String(text), widthLimit, strip);
      return {
        lines: lines2,
        textWidth: lines2.reduce((maximum, line) => Math.max(maximum, context.measureText(line).width), 0)
      };
    });
    const boxWidth = widthLimit ?? textWidth;
    const boxHeight = Math.max(lineHeight, lines.length * lineHeight);
    const align = options.align ?? "left";
    if (!["left", "center", "right"].includes(align)) {
      throw new TypeError("align must be left, center, or right.");
    }
    const position = resolveTextPosition(pos, options, boxWidth, boxHeight);
    const anchorOffset = anchorOffsetFor(options.anchor ?? position.impliedAnchor ?? defaultTextAnchorFor(position.key), boxWidth, boxHeight);
    const topLeft = position.key === "pos" ? [
      position.point[0] - anchorOffset[0],
      position.point[1] - anchorOffset[1]
    ] : position.point;
    return {
      lines,
      font,
      fontSize,
      lineHeight,
      boxWidth,
      boxHeight,
      textWidth,
      align,
      topLeft,
      anchorOffset,
      alpha: clamp(options.alpha ?? 1, 0, 1)
    };
  }
  function fitTextboxFontSize(context, text, rectLike, options = {}) {
    const rect = new Rect(rectLike);
    const maxSize = Math.floor(options.fontsize ?? Math.min(rect.height, 48));
    const minSize = Math.floor(options.minFontsize ?? 4);
    for (let size = maxSize;size >= minSize; size -= 1) {
      const lineHeight = options.lineheight ?? size * 1.2;
      const layout = layoutText(context, text, rect.topLeft, {
        ...options,
        fontsize: size,
        width: rect.width,
        lineheight: lineHeight
      });
      if (layout.lines.length * lineHeight <= rect.height && layout.lines.every((line) => measureWithFont(context, line, layout.font) <= rect.width)) {
        return { fontSize: size, lineHeight, lines: layout.lines };
      }
    }
    const fontSize = Math.max(1, minSize);
    return {
      fontSize,
      lineHeight: options.lineheight ?? fontSize * 1.2,
      lines: wrapLines(context, text, rect.width, options.strip ?? true)
    };
  }
  function renderTextLayout(context, layout, options) {
    const angle = options.angle ?? 0;
    withSavedCanvasState(context, () => {
      context.globalAlpha *= layout.alpha;
      context.translate(layout.topLeft[0] + layout.anchorOffset[0], layout.topLeft[1] + layout.anchorOffset[1]);
      if (angle !== 0)
        context.rotate(-angle * Math.PI / 180);
      context.font = layout.font;
      context.textBaseline = "top";
      context.textAlign = layout.align;
      const originX = -layout.anchorOffset[0];
      const originY = -layout.anchorOffset[1];
      if (options.background !== undefined) {
        context.fillStyle = normalizeColor(options.background);
        context.fillRect(originX, originY, layout.boxWidth, layout.boxHeight);
      }
      const fillStyle = options.gcolor === undefined ? normalizeColor(options.color ?? "white") : verticalGradient(context, originY, layout.boxHeight, options.color ?? "white", options.gcolor);
      const shadowOffset = shadowOffsetFor(options.shadow);
      const lineX = lineBaseX(originX, layout.boxWidth, layout.align);
      layout.lines.forEach((line, index) => {
        const y = originY + index * layout.lineHeight;
        if (shadowOffset) {
          context.fillStyle = normalizeColor(options.scolor ?? "black");
          context.fillText(line, lineX + shadowOffset[0], y + shadowOffset[1]);
        }
        if ((options.owidth ?? 0) > 0) {
          context.strokeStyle = normalizeColor(options.ocolor ?? "black");
          context.lineWidth = requirePositiveNumber(options.owidth, "owidth") * 2;
          context.strokeText(line, lineX, y);
        }
        context.fillStyle = fillStyle;
        context.fillText(line, lineX, y);
        if (options.underline) {
          const lineWidth = context.measureText(line).width;
          const [start, end] = lineExtentX(lineX, lineWidth, layout.align);
          const thickness = Math.max(1, layout.fontSize / 15);
          const underlineY = y + layout.fontSize * 0.9;
          context.fillStyle = fillStyle;
          context.fillRect(start, underlineY - thickness / 2, end - start, thickness);
        }
      });
    });
  }
  function wrapLines(context, text, widthLimit, strip) {
    const normalized = String(text).replace(/\t/g, "    ").replace(/\r\n/g, `
`);
    const paragraphs = normalized.split(`
`);
    if (widthLimit === undefined) {
      return paragraphs.map((paragraph) => strip ? rstripSpaces(paragraph) : paragraph);
    }
    const limit = requirePositiveNumber(widthLimit, "width");
    const measure = (candidate) => context.measureText(candidate).width;
    const lines = [];
    for (const paragraph of paragraphs) {
      lines.push(...wrapParagraph(measure, paragraph, limit, strip));
    }
    return lines;
  }
  function wrapParagraph(measure, rawText, width, strip) {
    let text = strip ? rstripSpaces(rawText) : rawText;
    const lines = [];
    if (!text) {
      lines.push("");
      return lines;
    }
    const leadingSpaceCount = text.length - lstripSpaces(text).length;
    let a = firstIndexOfSpaceOr(text, leadingSpaceCount, text.length);
    let line = text.slice(0, a);
    while (a + 1 < text.length) {
      let b;
      let bline;
      if (text.indexOf(" ", a + 1) === -1) {
        b = text.length;
        bline = text;
      } else if (strip) {
        b = text.indexOf(" ", a + 1);
        while (b > 0 && text[b - 1] === " ") {
          const next = text.indexOf(" ", b + 1);
          if (next === -1) {
            b = text.length;
            break;
          }
          b = next;
        }
        bline = text.slice(0, b);
      } else {
        b = text[a] === " " ? a + 1 : text.indexOf(" ", a + 1);
        bline = text.slice(0, b);
      }
      if (measure(bline) <= width) {
        a = b;
        line = bline;
      } else {
        lines.push(line);
        text = strip ? lstripSpaces(text.slice(a)) : text.slice(a);
        a = firstIndexOfSpaceOr(text, 1, text.length);
        line = text.slice(0, a);
      }
    }
    if (text)
      lines.push(line);
    return lines;
  }
  function firstIndexOfSpaceOr(text, from, fallback) {
    const index = text.indexOf(" ", from);
    return index === -1 ? fallback : index;
  }
  function lstripSpaces(text) {
    let index = 0;
    while (index < text.length && text[index] === " ")
      index += 1;
    return text.slice(index);
  }
  function rstripSpaces(text) {
    let end = text.length;
    while (end > 0 && text[end - 1] === " ")
      end -= 1;
    return text.slice(0, end);
  }
  var horizontalScalarKeys = ["left", "centerX", "right"];
  var verticalScalarKeys = ["top", "centerY", "bottom"];
  var horizontalScalarAnchor = {
    left: "left",
    centerX: "center",
    right: "right"
  };
  var verticalScalarAnchor = {
    top: "top",
    centerY: "center",
    bottom: "bottom"
  };
  function resolveTextPosition(pos, options, width, height) {
    if (pos !== undefined && options.pos !== undefined) {
      throw new TypeError("draw.text accepts exactly one position source.");
    }
    const compoundEntries = textPositionKeys.filter((key2) => {
      if (key2 === "pos")
        return options.pos !== undefined || pos !== undefined;
      return options[key2] !== undefined;
    });
    const namedCompoundEntries = compoundEntries.filter((key2) => key2 !== "pos");
    const horizontalScalars = horizontalScalarKeys.filter((key2) => options[key2] !== undefined);
    const verticalScalars = verticalScalarKeys.filter((key2) => options[key2] !== undefined);
    if (horizontalScalars.length > 0 || verticalScalars.length > 0) {
      if (namedCompoundEntries.length > 0) {
        throw new TypeError("draw.text accepts exactly one position source.");
      }
      if (horizontalScalars.length > 1) {
        throw new TypeError("draw.text accepts only one of left, centerX, or right.");
      }
      if (verticalScalars.length > 1) {
        throw new TypeError("draw.text accepts only one of top, centerY, or bottom.");
      }
      const fallback = pos ?? options.pos;
      const horizontalKey = horizontalScalars[0];
      const verticalKey = verticalScalars[0];
      const x = horizontalKey === undefined ? fallback?.[0] : requireFiniteNumber(options[horizontalKey], horizontalKey);
      const y = verticalKey === undefined ? fallback?.[1] : requireFiniteNumber(options[verticalKey], verticalKey);
      if (x === undefined) {
        throw new TypeError("Unable to determine horizontal position.");
      }
      if (y === undefined) {
        throw new TypeError("Unable to determine vertical position.");
      }
      const hanchor = horizontalKey === undefined ? "left" : horizontalScalarAnchor[horizontalKey];
      const vanchor = verticalKey === undefined ? "top" : verticalScalarAnchor[verticalKey];
      return { key: "pos", point: [x, y], impliedAnchor: [hanchor, vanchor] };
    }
    if (compoundEntries.length > 1) {
      throw new TypeError("draw.text accepts exactly one position source.");
    }
    const key = compoundEntries[0] ?? "pos";
    const value = key === "pos" ? options.pos ?? pos ?? [0, 0] : options[key];
    const point = requirePoint(value, key);
    switch (key) {
      case "topRight":
        return { key, point: [point[0] - width, point[1]] };
      case "bottomLeft":
        return { key, point: [point[0], point[1] - height] };
      case "bottomRight":
        return { key, point: [point[0] - width, point[1] - height] };
      case "midTop":
        return { key, point: [point[0] - width / 2, point[1]] };
      case "midLeft":
        return { key, point: [point[0], point[1] - height / 2] };
      case "midRight":
        return { key, point: [point[0] - width, point[1] - height / 2] };
      case "midBottom":
        return { key, point: [point[0] - width / 2, point[1] - height] };
      case "center":
        return { key, point: [point[0] - width / 2, point[1] - height / 2] };
      default:
        return { key, point };
    }
  }
  function defaultTextAnchorFor(positionKey) {
    return positionKey === "pos" ? "topLeft" : positionKey;
  }
  function anchorOffsetFor(anchor, width, height) {
    if (typeof anchor === "string") {
      switch (anchor) {
        case "topLeft":
          return [0, 0];
        case "topRight":
          return [width, 0];
        case "bottomLeft":
          return [0, height];
        case "bottomRight":
          return [width, height];
        case "midTop":
          return [width / 2, 0];
        case "midLeft":
          return [0, height / 2];
        case "midRight":
          return [width, height / 2];
        case "midBottom":
          return [width / 2, height];
        case "center":
          return [width / 2, height / 2];
        default:
          throw new TypeError(`Unknown text anchor: ${anchor}.${didYouMean(anchor, rectPositionKeys)}`);
      }
    }
    if (Array.isArray(anchor) && anchor.length === 2) {
      return [
        horizontalAnchorOffset(anchor[0], width),
        verticalAnchorOffset(anchor[1], height)
      ];
    }
    throw new TypeError("anchor must be a known string or two-item tuple.");
  }
  function lineBaseX(originX, width, align) {
    if (align === "center")
      return originX + width / 2;
    if (align === "right")
      return originX + width;
    return originX;
  }
  function lineExtentX(lineX, lineWidth, align) {
    if (align === "center")
      return [lineX - lineWidth / 2, lineX + lineWidth / 2];
    if (align === "right")
      return [lineX - lineWidth, lineX];
    return [lineX, lineX + lineWidth];
  }
  var GENERIC_FONT_FAMILIES = new Set([
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui"
  ]);
  function cssFontFamily(name) {
    if (GENERIC_FONT_FAMILIES.has(name))
      return name;
    return `"${name.replace(/"/g, "\\\"")}"`;
  }
  function resolveFontFamily(options) {
    if (options.fontname !== undefined && options.sysfontname !== undefined) {
      throw new TypeError("draw.text accepts only one of fontname or sysfontname.");
    }
    if (options.sysfontname !== undefined) {
      return cssFontFamily(options.sysfontname);
    }
    if (options.fontname !== undefined) {
      const loaded = tryGetLoadedFont(options.fontname);
      if (loaded)
        return cssFontFamily(loaded.family);
      tryStartLoadingFont(options.fontname);
      return cssFontFamily(options.fontname);
    }
    return "sans-serif";
  }
  function tryGetLoadedFont(name) {
    try {
      return fonts.get(name);
    } catch {
      return;
    }
  }
  function tryStartLoadingFont(name) {
    try {
      fonts.load(name).catch(() => {
        return;
      });
    } catch {}
  }
  function buildFontString(fontSize, options) {
    const fontFamily = resolveFontFamily(options);
    const styleParts = [];
    if (options.italic)
      styleParts.push("italic");
    if (options.bold)
      styleParts.push("bold");
    const stylePrefix = styleParts.length > 0 ? `${styleParts.join(" ")} ` : "";
    return `${stylePrefix}${fontSize}px ${fontFamily}`;
  }
  function shadowOffsetFor(shadow) {
    if (shadow === undefined)
      return null;
    if (typeof shadow === "number" && Number.isFinite(shadow))
      return [shadow, shadow];
    return requirePoint(shadow, "shadow");
  }
  function measureWithFont(context, text, font) {
    return withTemporaryFont(context, font, () => context.measureText(text).width);
  }
  function withTemporaryFont(context, font, callback) {
    const previousFont = context.font;
    try {
      context.font = font;
      return callback();
    } finally {
      context.font = previousFont;
    }
  }
  function withSavedCanvasState(context, callback) {
    context.save();
    try {
      return callback();
    } finally {
      context.restore();
    }
  }
  function requireShortForm(form, args) {
    const values = Array.from(args);
    const name = form.call.slice(0, form.call.indexOf("("));
    const numbers = values.slice(0, form.numbers.length);
    if (numbers.some((value) => typeof value === "object" && value !== null)) {
      throw new TypeError(form.lists);
    }
    form.numbers.forEach((label, index) => {
      const value = values[index];
      if (value === undefined) {
        throw new TypeError(`${name} is missing ${label}: ${form.call}.`);
      }
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(`${name}'s ${label} must be a number, but got ${describeValue(value)}.`);
      }
    });
    if (values.length > form.arity)
      throw new TypeError(form.extra);
  }
  var textCall = "screen.text(text, x, y, color, size)";
  function requireTextShortForm(args) {
    const values = Array.from(args);
    const [text, x, y] = values;
    if (text === undefined) {
      throw new TypeError(`screen.text is missing text: ${textCall}.`);
    }
    if (typeof text !== "string" && !(typeof text === "number" && Number.isFinite(text))) {
      throw new TypeError(`screen.text's text must be words in quotes or a number, but got ${describeValue(text)}.`);
    }
    if (typeof x === "object" && x !== null || typeof y === "object" && y !== null) {
      throw new TypeError('screen.text takes x, y as two numbers, like screen.text("Score: 3", 20, 30). For an [x, y] list or options such as center, use screen.draw.text(text, [x, y], options).');
    }
    for (const [label, value] of [
      ["x", x],
      ["y", y]
    ]) {
      if (value === undefined) {
        throw new TypeError(`screen.text is missing ${label}: ${textCall}.`);
      }
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(`screen.text's ${label} must be a number, but got ${describeValue(value)}.`);
      }
    }
    if (values.length > 5) {
      throw new TypeError(`screen.text takes at most five values: ${textCall}. For more options, use screen.draw.text.`);
    }
  }
  function requirePositiveNumber(value, label) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
    throw new TypeError(`${label} must be a positive finite number.`);
  }

  // packages/core/src/source-scan.ts
  var punctuators = [
    ">>>=",
    "...",
    "===",
    "!==",
    "**=",
    "<<=",
    ">>=",
    ">>>",
    "&&=",
    "||=",
    "??=",
    "=>",
    "==",
    "!=",
    "<=",
    ">=",
    "&&",
    "||",
    "??",
    "?.",
    "++",
    "--",
    "+=",
    "-=",
    "*=",
    "%=",
    "&=",
    "|=",
    "^=",
    "**",
    "<<",
    ">>"
  ];
  var regexPrecedingKeywords = new Set([
    "return",
    "typeof",
    "instanceof",
    "in",
    "of",
    "new",
    "delete",
    "void",
    "throw",
    "case",
    "do",
    "else",
    "yield",
    "await"
  ]);
  var expressionPrecedingPunctuators = new Set([
    "=",
    "(",
    ",",
    ":",
    "[",
    "?",
    "=>",
    "!",
    "||",
    "&&",
    "??",
    "+",
    "-",
    "*",
    "/",
    "%",
    "<",
    ">",
    "&",
    "|",
    "^",
    "~"
  ]);
  var expressionPrecedingKeywords = new Set([
    "return",
    "typeof",
    "void",
    "new",
    "throw",
    "yield",
    "await",
    "in",
    "of",
    "case",
    "delete",
    "instanceof"
  ]);
  var identifierStart = /[\p{ID_Start}$_]/u;
  var identifierPart = /[\p{ID_Continue}$\u200C\u200D]/u;
  var numberPart = /[0-9A-Za-z_.]/;
  function tokenizeSource(source) {
    const tokens = [];
    const templateDepths = [];
    let depth = 0;
    let parens = 0;
    let brackets = 0;
    let index = 0;
    const push = (type, value) => {
      tokens.push({ type, value, depth, parens, brackets });
    };
    const previous = () => tokens.at(-1);
    const scanTemplateText = () => {
      while (index < source.length) {
        const char = source[index];
        if (char === "\\") {
          index += 2;
          continue;
        }
        if (char === "`") {
          index += 1;
          return true;
        }
        if (char === "$" && source[index + 1] === "{") {
          index += 2;
          templateDepths.push(depth);
          depth += 1;
          return true;
        }
        index += 1;
      }
      return false;
    };
    if (source.startsWith("#!")) {
      const end = source.indexOf(`
`);
      index = end === -1 ? source.length : end;
    }
    while (index < source.length) {
      const char = source[index];
      const next = source[index + 1];
      if (/\s/u.test(char)) {
        index += 1;
        continue;
      }
      if (char === "/" && next === "/") {
        const end = source.indexOf(`
`, index);
        index = end === -1 ? source.length : end;
        continue;
      }
      if (char === "/" && next === "*") {
        const end = source.indexOf("*/", index + 2);
        if (end === -1)
          return null;
        index = end + 2;
        continue;
      }
      if (char === "'" || char === '"') {
        index += 1;
        let closed = false;
        while (index < source.length) {
          const current = source[index];
          if (current === "\\") {
            index += 2;
            continue;
          }
          if (current === `
`)
            return null;
          index += 1;
          if (current === char) {
            closed = true;
            break;
          }
        }
        if (!closed)
          return null;
        push("literal", "string");
        continue;
      }
      if (char === "`") {
        index += 1;
        push("literal", "template");
        if (!scanTemplateText())
          return null;
        continue;
      }
      if (char === "}") {
        index += 1;
        const templateDepth = templateDepths.at(-1);
        if (templateDepth !== undefined && depth === templateDepth + 1) {
          templateDepths.pop();
          depth -= 1;
          if (!scanTemplateText())
            return null;
          continue;
        }
        if (depth === 0)
          return null;
        depth -= 1;
        push("punctuator", "}");
        continue;
      }
      if (char === "{") {
        push("punctuator", "{");
        depth += 1;
        index += 1;
        continue;
      }
      if (char === "(") {
        push("punctuator", "(");
        parens += 1;
        index += 1;
        continue;
      }
      if (char === ")") {
        if (parens === 0)
          return null;
        parens -= 1;
        push("punctuator", ")");
        index += 1;
        continue;
      }
      if (char === "[") {
        push("punctuator", "[");
        brackets += 1;
        index += 1;
        continue;
      }
      if (char === "]") {
        if (brackets === 0)
          return null;
        brackets -= 1;
        push("punctuator", "]");
        index += 1;
        continue;
      }
      if (identifierStart.test(char)) {
        const start = index;
        index += 1;
        while (index < source.length && identifierPart.test(source[index] ?? ""))
          index += 1;
        push("identifier", source.slice(start, index));
        continue;
      }
      if (/[0-9]/.test(char) || char === "." && /[0-9]/.test(next ?? "")) {
        index += 1;
        while (index < source.length && numberPart.test(source[index] ?? ""))
          index += 1;
        push("literal", "number");
        continue;
      }
      if (char === "/") {
        if (regexAllowedAfter(previous())) {
          index += 1;
          let inClass = false;
          let closed = false;
          while (index < source.length) {
            const current = source[index];
            if (current === `
`)
              return null;
            if (current === "\\") {
              index += 2;
              continue;
            }
            index += 1;
            if (inClass) {
              if (current === "]")
                inClass = false;
            } else if (current === "[") {
              inClass = true;
            } else if (current === "/") {
              closed = true;
              break;
            }
          }
          if (!closed)
            return null;
          while (index < source.length && /[a-z]/.test(source[index] ?? ""))
            index += 1;
          push("literal", "regex");
          continue;
        }
        if (next === "=") {
          push("punctuator", "/=");
          index += 2;
          continue;
        }
        push("punctuator", "/");
        index += 1;
        continue;
      }
      const punctuator = punctuators.find((candidate) => source.startsWith(candidate, index));
      if (punctuator) {
        push("punctuator", punctuator);
        index += punctuator.length;
        continue;
      }
      push("punctuator", char);
      index += 1;
    }
    if (templateDepths.length > 0 || depth !== 0 || parens !== 0 || brackets !== 0)
      return null;
    return tokens;
  }
  function regexAllowedAfter(token) {
    if (!token)
      return true;
    if (token.type === "literal")
      return false;
    if (token.type === "identifier")
      return regexPrecedingKeywords.has(token.value);
    return token.value !== ")" && token.value !== "]" && token.value !== "}";
  }
  var emptyScan = {
    complete: false,
    topLevelFunctions: [],
    topLevelAssignments: []
  };
  function scanSource(source) {
    const tokens = tokenizeSource(source);
    if (!tokens)
      return emptyScan;
    const functions = new Set;
    const assignments = new Set;
    const at = (index) => tokens[index];
    const isPunctuator = (token, value) => token?.type === "punctuator" && token.value === value;
    const isIdentifier = (token, value) => token?.type === "identifier" && (value === undefined || token.value === value);
    const isFunctionValue = (index) => {
      const token = at(index);
      if (!token)
        return false;
      if (isIdentifier(token, "function") || isIdentifier(token, "async"))
        return true;
      if (token.type === "identifier")
        return isPunctuator(at(index + 1), "=>");
      if (!isPunctuator(token, "("))
        return false;
      let open = 0;
      for (let cursor = index;cursor < tokens.length; cursor += 1) {
        const current = at(cursor);
        if (isPunctuator(current, "("))
          open += 1;
        else if (isPunctuator(current, ")")) {
          open -= 1;
          if (open === 0)
            return isPunctuator(at(cursor + 1), "=>");
        }
      }
      return false;
    };
    const collectDeclaration = (start) => {
      let expectsName = true;
      for (let cursor = start;cursor < tokens.length; cursor += 1) {
        const current = at(cursor);
        if (!current)
          return;
        if (current.depth !== 0 || current.parens !== 0 || current.brackets !== 0) {
          continue;
        }
        if (isPunctuator(current, ";"))
          return;
        if (expectsName) {
          if (!isIdentifier(current))
            return;
          assignments.add(current.value);
          if (isPunctuator(at(cursor + 1), "=") && isFunctionValue(cursor + 2)) {
            functions.add(current.value);
          }
          expectsName = false;
          continue;
        }
        if (isPunctuator(current, ","))
          expectsName = true;
      }
    };
    for (let index = 0;index < tokens.length; index += 1) {
      const token = at(index);
      if (!token || token.depth !== 0 || token.parens !== 0 || token.brackets !== 0)
        continue;
      if (token.type !== "identifier")
        continue;
      const before = at(index - 1);
      const after = at(index + 1);
      if (token.value === "function") {
        if (isExpressionContext(before))
          continue;
        const nameIndex = isPunctuator(after, "*") ? index + 2 : index + 1;
        const name = at(nameIndex);
        if (isIdentifier(name) && isPunctuator(at(nameIndex + 1), "(")) {
          functions.add(name.value);
        }
        continue;
      }
      if ((token.value === "const" || token.value === "let" || token.value === "var") && isIdentifier(after)) {
        collectDeclaration(index + 1);
        continue;
      }
      if (isPunctuator(after, "=")) {
        if (isPunctuator(before, ".") || isPunctuator(before, "?."))
          continue;
        assignments.add(token.value);
        if (isFunctionValue(index + 2))
          functions.add(token.value);
      }
    }
    return {
      complete: true,
      topLevelFunctions: [...functions],
      topLevelAssignments: [...assignments]
    };
  }
  function isExpressionContext(token) {
    if (!token)
      return false;
    if (token.type === "literal")
      return false;
    if (token.type === "identifier")
      return expressionPrecedingKeywords.has(token.value);
    return expressionPrecedingPunctuators.has(token.value);
  }

  // packages/core/src/runtime-diagnostics.ts
  var RUNTIME_CONFIGURATION_NAMES = [
    "WIDTH",
    "HEIGHT",
    "PIXEL_DENSITY",
    "TITLE",
    "ICON",
    "TOUCH_CONTROLS"
  ];
  var RUNTIME_SOURCE_HOOK_NAMES = [
    "draw",
    "update",
    ...INPUT_HOOK_NAMES
  ];
  var hookNames = RUNTIME_SOURCE_HOOK_NAMES;
  var RUNTIME_MODULE_OPTION_NAMES = [
    ...RUNTIME_CONFIGURATION_NAMES,
    ...hookNames
  ];
  var constantNames = new Set(RUNTIME_CONFIGURATION_NAMES);
  var hookNameSet = new Set(hookNames);
  function collectRuntimeDiagnostics(moduleOrSource, options = {}) {
    const diagnostics = [];
    const emit = createDiagnosticEmitter(diagnostics);
    if (typeof moduleOrSource === "string") {
      diagnoseSource(moduleOrSource, emit);
      return diagnostics;
    }
    diagnoseGameModule(moduleOrSource, options, emit, "import");
    return diagnostics;
  }
  function diagnoseGameModule(module, options, emit, mode) {
    const keys2 = Object.keys(module);
    const defined = new Set(keys2);
    for (const key of keys2)
      diagnoseIdentifier(key, "function", defined, emit);
    for (const key of RUNTIME_MODULE_OPTION_NAMES) {
      if (module[key] !== undefined && options[key] !== undefined) {
        emit({
          code: "duplicate-config",
          severity: "warning",
          name: key,
          message: `${key} appears in both the ${mode} module and run options.`
        });
      }
    }
    warnHookParameters(module, emit);
    warnHookArity("draw", module.draw, 0, emit);
    warnHookArity("update", module.update, 1, emit);
    if (module.WIDTH !== undefined && !isValidRuntimeDimension(module.WIDTH)) {
      emit({
        code: "invalid-config",
        severity: "warning",
        name: "WIDTH",
        message: "WIDTH should be a positive finite number."
      });
    }
    if (module.HEIGHT !== undefined && !isValidRuntimeDimension(module.HEIGHT)) {
      emit({
        code: "invalid-config",
        severity: "warning",
        name: "HEIGHT",
        message: "HEIGHT should be a positive finite number."
      });
    }
  }
  function diagnoseSource(source, emit) {
    const scan = scanSource(source);
    if (scan.complete) {
      const defined = new Set([
        ...scan.topLevelFunctions,
        ...scan.topLevelAssignments
      ]);
      const functions = new Set(scan.topLevelFunctions);
      for (const name of functions)
        diagnoseIdentifier(name, "function", defined, emit);
      for (const name of scan.topLevelAssignments) {
        if (!functions.has(name))
          diagnoseIdentifier(name, "assignment", defined, emit);
      }
    }
    for (const match of source.matchAll(/["'`]([^"'`]+)["'`]/g)) {
      const name = match[1];
      if (name)
        diagnoseAssetName(name, emit);
    }
  }
  function createDiagnosticEmitter(diagnostics, callback) {
    return (diagnostic) => {
      diagnostics.push(diagnostic);
      callback?.(diagnostic);
    };
  }
  var activeDiagnosticEmit = null;
  function setActiveDiagnosticEmit(emit) {
    const previous = activeDiagnosticEmit;
    activeDiagnosticEmit = emit;
    return previous;
  }
  function getActiveDiagnosticEmit() {
    return activeDiagnosticEmit;
  }
  function describeRuntimeError(error) {
    return error instanceof Error ? error.message : String(error);
  }
  function isValidRuntimeDimension(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  }
  function diagnoseIdentifier(name, kind, defined, emit) {
    if (constantNames.has(name) || hookNameSet.has(name))
      return;
    const constantSuggestion = name !== name.toLowerCase() ? closestName(name, RUNTIME_CONFIGURATION_NAMES) : undefined;
    if (constantSuggestion && !defined.has(constantSuggestion)) {
      emit({
        code: "constant-typo",
        severity: "warning",
        name,
        suggestion: constantSuggestion,
        message: `Did you mean ${constantSuggestion} instead of ${name}?`
      });
      return;
    }
    if (kind !== "function")
      return;
    const hookSuggestion = closestName(name, hookNames);
    if (hookSuggestion && !defined.has(hookSuggestion)) {
      const respelled = looseName(name) === looseName(hookSuggestion);
      emit({
        code: "hook-typo",
        severity: "warning",
        name,
        suggestion: hookSuggestion,
        message: respelled ? `${name} is never called. Hooks are named in camelCase, so rename it to ${hookSuggestion}.` : `Did you mean ${hookSuggestion} instead of ${name}?`
      });
    }
  }
  function diagnoseAssetName(name, emit) {
    const extension = name.split(".").at(-1)?.toLowerCase();
    const kind = extension && imageExtensions.includes(extension) ? "image" : extension && soundExtensions.includes(extension) ? "sound" : null;
    if (!kind)
      return;
    const extensions = kind === "image" ? imageExtensions : soundExtensions;
    try {
      validateAssetName(kind, name, extensions);
    } catch (error) {
      emit({
        code: "asset-name",
        severity: "warning",
        name,
        message: describeRuntimeError(error)
      });
    }
  }
  function warnHookParameters(module, emit) {
    for (const name of INPUT_HOOK_NAMES) {
      const hook = module[name];
      if (typeof hook !== "function")
        continue;
      const declared = getParameterNames(hook);
      if (declared.length === 1 && declared[0] === "event")
        continue;
      const known = HOOK_PARAMETERS[name];
      const resolved = resolveHookParameters(declared, known);
      declared.forEach((parameter, index) => {
        if (known.includes(parameter))
          return;
        const receives = resolved[index];
        const knownList = known.length > 0 ? known.join(", ") : "nothing";
        emit({
          code: "hook-parameter",
          severity: "warning",
          name,
          ...receives === undefined ? {} : { suggestion: receives },
          message: receives === undefined ? `${name} receives ${knownList}, so its ${parameter} parameter will always be undefined.` : `${name}'s ${parameter} parameter receives ${receives}, because it is in that place in the list. Rename it to ${receives} to make that clear (${name} receives ${knownList}).`
        });
      });
    }
  }
  function warnHookArity(name, hook, maximum, emit) {
    if (!hook)
      return;
    const arity = getParameterNames(hook).length;
    if (arity > maximum) {
      emit({
        code: "hook-arity",
        severity: "warning",
        name,
        message: name === "draw" ? "draw should not declare parameters." : "update should accept either no parameters or one dt parameter."
      });
    }
  }

  // packages/core/src/actor.ts
  var positionKeys = ["pos", ...rectPositionKeys];
  var sizeKeys = ["scale", "width", "height"];
  var allowedOptionKeys = new Set([
    ...positionKeys,
    ...sizeKeys,
    "anchor",
    "angle",
    "opacity",
    "images",
    "fps",
    "loop",
    "clock",
    "screen",
    "loader",
    "imageLoader"
  ]);

  class SizedSurface {
    inner;
    width;
    height;
    constructor(inner, width, height) {
      this.inner = inner;
      this.width = width;
      this.height = height;
    }
    get source() {
      return this.inner.source;
    }
    getWidth() {
      return this.width;
    }
    getHeight() {
      return this.height;
    }
    getSize() {
      return [this.width, this.height];
    }
    getRect() {
      return new Rect(0, 0, this.width, this.height);
    }
  }

  class Actor {
    loader;
    screen;
    _image = "";
    _surface = null;
    _pos = [0, 0];
    _anchor = ["center", "center"];
    _angle = 0;
    _opacity = 1;
    _scale = 1;
    _native = null;
    sizeSource = { key: "scale", value: 1 };
    positionSource;
    imageLoadPromise = null;
    _images = null;
    _fps = 10;
    _loop = true;
    animationStart = 0;
    clockSource = null;
    constructor(image, pos, options = {}) {
      const hasExplicitPos = isPair(pos);
      const resolvedOptions = hasExplicitPos ? options : { ...pos, ...options };
      validateActorOptions(resolvedOptions);
      this.loader = resolvedOptions.imageLoader ?? resolvedOptions.loader ?? images;
      this.clockSource = resolvedOptions.clock ?? null;
      if (resolvedOptions.screen)
        this.screen = resolvedOptions.screen;
      if (resolvedOptions.anchor !== undefined)
        this.anchor = resolvedOptions.anchor;
      if (resolvedOptions.angle !== undefined)
        this.angle = resolvedOptions.angle;
      if (resolvedOptions.opacity !== undefined)
        this.opacity = resolvedOptions.opacity;
      this.sizeSource = resolveSizeSource(resolvedOptions);
      this.positionSource = resolvePositionSource(hasExplicitPos ? pos : undefined, resolvedOptions);
      this.image = image;
      if (resolvedOptions.fps !== undefined)
        this.fps = resolvedOptions.fps;
      if (resolvedOptions.loop !== undefined)
        this.loop = resolvedOptions.loop;
      if (resolvedOptions.images !== undefined) {
        this.images = resolvedOptions.images;
      }
      this.applyPositionSource();
    }
    get image() {
      return this._image;
    }
    set image(value) {
      if (typeof value !== "string" || value.length === 0) {
        throw new TypeError("Actor image must be a non-empty asset name.");
      }
      this._image = value;
      const cached = this.loader.get(value);
      if (cached) {
        this.adoptSurface(cached);
        this.imageLoadPromise = Promise.resolve(cached);
        return;
      }
      const loadPromise = this.loader.load(value).then((surface) => {
        if (this._image === value)
          this.adoptSurface(surface);
        return surface;
      });
      this.imageLoadPromise = loadPromise;
      reportLoadFailure(loadPromise, value);
    }
    get images() {
      return this._images ? [...this._images] : null;
    }
    set images(value) {
      if (value === null || Array.isArray(value) && value.length === 0) {
        this._images = null;
        return;
      }
      if (!Array.isArray(value) || !value.every((name) => typeof name === "string" && name.length > 0)) {
        throw new TypeError('Actor images must be a list of image names, like ["coin_0", "coin_1"].');
      }
      this._images = [...value];
      this.animationStart = this.now();
      for (const name of this._images.slice(1)) {
        if (!this.loader.get(name)) {
          reportLoadFailure(this.loader.load(name), name);
        }
      }
      this.image = this._images[0];
    }
    get fps() {
      return this._fps;
    }
    set fps(value) {
      if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        throw new TypeError("Actor fps must be a number greater than 0.");
      }
      const elapsed = this.now() - this.animationStart;
      this.animationStart = this.now() - elapsed * this._fps / value;
      this._fps = value;
    }
    get loop() {
      return this._loop;
    }
    set loop(value) {
      if (typeof value !== "boolean") {
        throw new TypeError("Actor loop must be true or false.");
      }
      this._loop = value;
    }
    get frame() {
      const frames = this._images;
      if (!frames)
        return 0;
      const step = this.elapsedFrames();
      return this._loop ? step % frames.length : Math.min(step, frames.length - 1);
    }
    get finished() {
      const frames = this._images;
      if (!frames || this._loop)
        return false;
      return this.elapsedFrames() >= frames.length;
    }
    elapsedFrames() {
      const elapsed = Math.max(0, this.now() - this.animationStart);
      return Math.floor(elapsed * this._fps + 0.000000001);
    }
    now() {
      return (this.clockSource ?? getActiveClock()).now();
    }
    get pos() {
      return [this._pos[0], this._pos[1]];
    }
    set pos(value) {
      this._pos = requirePoint(value, "pos");
      this.positionSource = { key: "pos", value: this.pos };
    }
    get x() {
      return this._pos[0];
    }
    set x(value) {
      this._pos = [requireFiniteNumber(value, "x"), this._pos[1]];
      this.positionSource = { key: "pos", value: this.pos };
    }
    get y() {
      return this._pos[1];
    }
    set y(value) {
      this._pos = [this._pos[0], requireFiniteNumber(value, "y")];
      this.positionSource = { key: "pos", value: this.pos };
    }
    get anchor() {
      return [this._anchor[0], this._anchor[1]];
    }
    set anchor(value) {
      this._anchor = normalizeAnchor(value);
      this.applyPositionSource();
    }
    get angle() {
      return this._angle;
    }
    set angle(value) {
      this._angle = requireFiniteNumber(value, "angle");
    }
    get opacity() {
      return this._opacity;
    }
    set opacity(value) {
      this._opacity = clamp(requireFiniteNumber(value, "opacity"), 0, 1);
    }
    get scale() {
      return this._scale;
    }
    set scale(value) {
      this.sizeSource = { key: "scale", value: requireScale(value, "scale") };
      this.applySizeSource();
    }
    get width() {
      return this.rect().width;
    }
    set width(value) {
      this.sizeSource = { key: "width", value: requireScale(value, "width") };
      this.applySizeSource();
    }
    get height() {
      return this.rect().height;
    }
    set height(value) {
      this.sizeSource = { key: "height", value: requireScale(value, "height") };
      this.applySizeSource();
    }
    get topLeft() {
      return this.rect().topLeft;
    }
    set topLeft(value) {
      this.setRectPosition("topLeft", value);
    }
    get topRight() {
      return this.rect().topRight;
    }
    set topRight(value) {
      this.setRectPosition("topRight", value);
    }
    get bottomLeft() {
      return this.rect().bottomLeft;
    }
    set bottomLeft(value) {
      this.setRectPosition("bottomLeft", value);
    }
    get bottomRight() {
      return this.rect().bottomRight;
    }
    set bottomRight(value) {
      this.setRectPosition("bottomRight", value);
    }
    get midTop() {
      return this.rect().midTop;
    }
    set midTop(value) {
      this.setRectPosition("midTop", value);
    }
    get midLeft() {
      return this.rect().midLeft;
    }
    set midLeft(value) {
      this.setRectPosition("midLeft", value);
    }
    get midRight() {
      return this.rect().midRight;
    }
    set midRight(value) {
      this.setRectPosition("midRight", value);
    }
    get midBottom() {
      return this.rect().midBottom;
    }
    set midBottom(value) {
      this.setRectPosition("midBottom", value);
    }
    get center() {
      return this.rect().center;
    }
    set center(value) {
      this.setRectPosition("center", value);
    }
    get left() {
      return this.rect().left;
    }
    set left(value) {
      const rect = this.baseRect();
      rect.left = requireFiniteNumber(value, "left");
      this.setPosFromBaseRect(rect);
    }
    get top() {
      return this.rect().top;
    }
    set top(value) {
      const rect = this.baseRect();
      rect.top = requireFiniteNumber(value, "top");
      this.setPosFromBaseRect(rect);
    }
    get right() {
      return this.rect().right;
    }
    set right(value) {
      const rect = this.baseRect();
      rect.right = requireFiniteNumber(value, "right");
      this.setPosFromBaseRect(rect);
    }
    get bottom() {
      return this.rect().bottom;
    }
    set bottom(value) {
      const rect = this.baseRect();
      rect.bottom = requireFiniteNumber(value, "bottom");
      this.setPosFromBaseRect(rect);
    }
    async ready() {
      if (this._surface)
        return this._surface;
      if (!this.imageLoadPromise)
        throw new Error("Actor image is not loading.");
      return this.imageLoadPromise;
    }
    rect() {
      if (this.angle === 0)
        return this.baseRect();
      const base = this.baseRect();
      const radians = -this.angle * Math.PI / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const corners = [
        base.topLeft,
        base.topRight,
        base.bottomRight,
        base.bottomLeft
      ].map(([x, y]) => {
        const dx = x - this.x;
        const dy = y - this.y;
        return [
          this.x + dx * cos - dy * sin,
          this.y + dx * sin + dy * cos
        ];
      });
      const xs = corners.map(([x]) => x);
      const ys = corners.map(([, y]) => y);
      const left = Math.min(...xs);
      const top = Math.min(...ys);
      return new Rect(left, top, Math.max(...xs) - left, Math.max(...ys) - top);
    }
    draw(screen2) {
      if (this._images) {
        const name = this._images[this.frame];
        if (name !== undefined && name !== this._image)
          this.image = name;
      }
      if (!this._surface)
        return;
      const target = screen2 ?? this.screen ?? getScreen();
      recordDrawn(target, {
        kind: "actor",
        image: this.image,
        x: this.x,
        y: this.y
      });
      const [anchorX, anchorY] = this.anchorOffset();
      target.context.save();
      try {
        target.context.globalAlpha *= this.opacity;
        target.context.translate(this.x, this.y);
        if (this.angle !== 0) {
          target.context.rotate(-this.angle * Math.PI / 180);
        }
        const native = this._native ?? this._surface;
        target.context.drawImage(this._surface.source, -anchorX, -anchorY, native.getWidth() * this._scale, native.getHeight() * this._scale);
      } finally {
        target.context.restore();
      }
    }
    unloadImage() {
      this.loader.unload(this.image);
      this._surface = null;
      this._native = null;
      this.imageLoadPromise = null;
    }
    angleTo(target) {
      return angleTo(this.pos, actorTargetPoint(target));
    }
    distanceTo(target) {
      return distanceTo(this.pos, actorTargetPoint(target));
    }
    copy() {
      return this.rect().copy();
    }
    move(xOrOffset, y) {
      if (Array.isArray(xOrOffset))
        return this.rect().move(xOrOffset);
      return this.rect().move(xOrOffset, y);
    }
    moveIp(xOrOffset, y) {
      const rect = this.baseRect();
      if (Array.isArray(xOrOffset))
        rect.moveIp(xOrOffset);
      else
        rect.moveIp(xOrOffset, y);
      this.setPosFromBaseRect(rect);
    }
    inflate(xOrSize, y) {
      if (Array.isArray(xOrSize))
        return this.rect().inflate(xOrSize);
      return this.rect().inflate(xOrSize, y);
    }
    inflateIp(xOrSize, y) {
      const rect = this.baseRect();
      if (Array.isArray(xOrSize))
        rect.inflateIp(xOrSize);
      else
        rect.inflateIp(xOrSize, y);
      this.applyBaseRectGeometry(rect);
    }
    normalize() {
      const rect = this.baseRect();
      rect.normalize();
      this.applyBaseRectGeometry(rect);
    }
    clamp(other) {
      return this.rect().clamp(other);
    }
    clampIp(other) {
      const current = this.rect();
      const clamped = current.clamp(other);
      const [x, y] = this.pos;
      this.pos = [x + clamped.left - current.left, y + clamped.top - current.top];
    }
    clip(other) {
      return this.rect().clip(other);
    }
    union(other) {
      return this.rect().union(other);
    }
    unionAll(others) {
      return this.rect().unionAll(others);
    }
    fit(other) {
      return this.rect().fit(other);
    }
    collidePoint(pointOrX, y) {
      if (Array.isArray(pointOrX))
        return this.rect().collidePoint(pointOrX);
      return this.rect().collidePoint(pointOrX, y);
    }
    touches(target) {
      return this.rect().touches(target);
    }
    collideRect(other) {
      return this.rect().collideRect(other);
    }
    collideList(others) {
      return this.rect().collideList(others);
    }
    collideListAll(others) {
      return this.rect().collideListAll(others);
    }
    contains(other) {
      return this.rect().contains(other);
    }
    baseRect() {
      const [anchorX, anchorY] = this.anchorOffset();
      return new Rect(this.x - anchorX, this.y - anchorY, this.surfaceWidth(), this.surfaceHeight());
    }
    surfaceWidth() {
      return (this._surface?.getWidth() ?? 0) * this._scale;
    }
    surfaceHeight() {
      return (this._surface?.getHeight() ?? 0) * this._scale;
    }
    adoptSurface(surface) {
      this._surface = surface;
      this._native = surface;
      this.applySizeSource();
    }
    applySizeSource() {
      const native = this._native;
      const { key, value } = this.sizeSource;
      if (key === "scale")
        this._scale = value;
      else if (native) {
        const basis = key === "width" ? native.getWidth() : native.getHeight();
        this._scale = basis > 0 ? value / basis : 1;
      }
      this.applyPositionSource();
    }
    setRectPosition(key, value) {
      const point = requirePoint(value, key);
      const rect = this.baseRect();
      rect[key] = point;
      this.setPosFromBaseRect(rect);
      this.positionSource = { key, value: point };
    }
    setPosFromBaseRect(rect) {
      const [anchorX, anchorY] = this.anchorOffset();
      this._pos = [rect.left + anchorX, rect.top + anchorY];
      this.positionSource = { key: "pos", value: this.pos };
    }
    applyBaseRectGeometry(rect) {
      if (this._surface) {
        this._surface = new SizedSurface(this._surface, rect.width / this._scale, rect.height / this._scale);
      }
      const [anchorX, anchorY] = this.anchorOffset();
      this._pos = [rect.left + anchorX, rect.top + anchorY];
      this.positionSource = { key: "pos", value: this.pos };
    }
    applyPositionSource() {
      if (!this.positionSource)
        return;
      if (this.positionSource.key === "pos") {
        this._pos = [...this.positionSource.value];
        return;
      }
      const rect = new Rect(0, 0, this.width, this.height);
      rect[this.positionSource.key] = this.positionSource.value;
      const [anchorX, anchorY] = this.anchorOffset();
      this._pos = [rect.left + anchorX, rect.top + anchorY];
    }
    anchorOffset() {
      return [
        horizontalAnchorOffset(this._anchor[0], this.surfaceWidth()),
        verticalAnchorOffset(this._anchor[1], this.surfaceHeight())
      ];
    }
  }
  function resolvePositionSource(explicitPos, options) {
    const optionSources = positionKeys.filter((key) => options[key] !== undefined);
    if (explicitPos !== undefined && optionSources.length > 0) {
      throw new TypeError("Actor accepts exactly one position source.");
    }
    if (optionSources.length > 1) {
      throw new TypeError("Actor accepts exactly one position source.");
    }
    if (explicitPos !== undefined) {
      return { key: "pos", value: requirePoint(explicitPos, "pos") };
    }
    const source = optionSources[0];
    if (source) {
      return { key: source, value: requirePoint(options[source], source) };
    }
    return { key: "topLeft", value: [0, 0] };
  }
  function resolveSizeSource(options) {
    const given = sizeKeys.filter((key2) => options[key2] !== undefined);
    if (given.length > 1) {
      throw new TypeError("Actor accepts at most one of scale, width and height.");
    }
    const key = given[0];
    if (!key)
      return { key: "scale", value: 1 };
    return { key, value: requireScale(options[key], key) };
  }
  function requireScale(value, name) {
    const n = requireFiniteNumber(value, name);
    if (n <= 0)
      throw new TypeError(`Actor ${name} must be greater than 0.`);
    return n;
  }
  function reportLoadFailure(promise, name) {
    const reportDiagnostic = getActiveDiagnosticEmit();
    promise.catch((error) => {
      reportDiagnostic?.({
        code: "runtime-error",
        severity: "warning",
        phase: "asset",
        recoverable: true,
        message: `Failed to load image "${name}": ${describeRuntimeError(error)}`
      });
    });
  }
  function validateActorOptions(options) {
    rejectUnknownOptions(options, allowedOptionKeys, "Actor");
  }
  function normalizeAnchor(value) {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new TypeError("anchor must be a two-item tuple.");
    }
    horizontalAnchorOffset(value[0], 1);
    verticalAnchorOffset(value[1], 1);
    return [value[0], value[1]];
  }
  function actorTargetPoint(target) {
    return target instanceof Actor ? target.pos : requirePoint(target, "target");
  }
  guardSpellings(Actor.prototype, "actor");

  // packages/core/src/animation.ts
  var animationsByTarget = new WeakMap;
  var activeAnimationClock = null;
  var tweens = Object.freeze({
    linear(n) {
      return n;
    },
    accelerate(n) {
      return easeInQuad(n);
    },
    decelerate(n) {
      return easeOutQuad(n);
    },
    accelDecel(n) {
      return easeInOutQuad(n);
    },
    inElastic(n) {
      return easeInElastic(n);
    },
    outElastic(n) {
      return easeOutElastic(n);
    },
    inOutElastic(n) {
      return easeInOutElastic(n);
    },
    bounceEnd(n) {
      return easeOutBounce(n);
    },
    bounceStart(n) {
      return easeInBounce(n);
    },
    bounceStartEnd(n) {
      return easeInOutBounce(n);
    },
    endElastic(n) {
      return tweens.inElastic(n);
    },
    startElastic(n) {
      return tweens.outElastic(n);
    },
    bothElastic(n) {
      return tweens.inOutElastic(n);
    },
    easeIn(n) {
      return tweens.accelerate(n);
    },
    easeOut(n) {
      return tweens.decelerate(n);
    },
    easeInOut(n) {
      return tweens.accelDecel(n);
    },
    bounce(n) {
      return tweens.bounceEnd(n);
    },
    spring(n) {
      return tweens.outElastic(n);
    }
  });
  var tweenNames = Object.freeze(Object.keys(tweens));

  class Animation {
    onFinished;
    object;
    duration;
    tween;
    elapsed = 0;
    targetValues = new Map;
    initialValues = new Map;
    scheduler;
    tickCallback = (dt) => this.update(dt);
    _running = true;
    constructor(object, options, scheduler = getAnimationClock()) {
      if (typeof object !== "object" || object === null) {
        throw new TypeError("Animation target must be an object.");
      }
      const { tween = "linear", duration = 1, onFinished, ...targets } = options;
      this.object = object;
      this.duration = validateDuration2(duration);
      this.tween = resolveTween(tween);
      this.onFinished = onFinished;
      this.scheduler = scheduler;
      const targetEntries = Object.entries(targets).filter(([, value]) => value !== undefined);
      if (targetEntries.length === 0) {
        throw new TypeError("Animation requires at least one target property.");
      }
      for (const [property, targetValue] of targetEntries) {
        if (!(property in object)) {
          throw new ValueError(`object has no attribute ${property} to animate.${didYouMean(property, ["duration", "tween", "onFinished", ...propertyNames(object)])}`);
        }
        const initialValue = normalizeTargetValue(object[property], property);
        const finalValue = normalizeTargetValue(targetValue, property, initialValue);
        this.initialValues.set(property, initialValue);
        this.targetValues.set(property, finalValue);
        replaceExistingAnimation(object, property, this);
      }
      this.scheduler.eachTick(this.tickCallback);
    }
    get running() {
      return this._running;
    }
    update(dt) {
      if (!this._running)
        return;
      this.elapsed += dt;
      const progress = this.duration === 0 ? 1 : Math.min(1, this.elapsed / this.duration);
      if (progress >= 1) {
        this.completeNaturally();
        return;
      }
      this.apply(tweens[this.tween](progress));
    }
    stop(complete = false) {
      if (!this._running)
        return;
      if (complete) {
        this.apply(1);
      }
      this._running = false;
      for (const property of [...this.targetValues.keys()]) {
        this.removeTarget(property, false);
      }
      this.scheduler.unschedule(this.tickCallback);
    }
    removeTarget(property, stopIfEmpty = true) {
      this.targetValues.delete(property);
      this.initialValues.delete(property);
      const registry = animationsByTarget.get(this.object);
      if (registry?.get(property) === this) {
        registry.delete(property);
        if (registry.size === 0)
          animationsByTarget.delete(this.object);
      }
      if (this.targetValues.size === 0 && stopIfEmpty) {
        this.stop(false);
      }
    }
    completeNaturally() {
      this.apply(1);
      const onFinished = this.onFinished;
      this.stop(false);
      onFinished?.();
    }
    apply(progress) {
      for (const [property, target] of this.targetValues) {
        const start = this.initialValues.get(property);
        if (start === undefined)
          continue;
        this.object[property] = interpolateValue(progress, start, target);
      }
    }
  }
  guardSpellings(Animation.prototype, "animation", ["onFinished"]);

  class ValueError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValueError";
    }
  }
  function animate(object, options) {
    return new Animation(object, options);
  }
  function withAnimationClock(scheduler, callback) {
    const previous = activeAnimationClock;
    activeAnimationClock = scheduler;
    try {
      return callback();
    } finally {
      activeAnimationClock = previous;
    }
  }
  function getAnimationClock() {
    return activeAnimationClock ?? clock;
  }
  function replaceExistingAnimation(object, property, animation) {
    let registry = animationsByTarget.get(object);
    if (!registry) {
      registry = new Map;
      animationsByTarget.set(object, registry);
    }
    const previous = registry.get(property);
    if (previous && previous !== animation) {
      previous.removeTarget(property);
    }
    registry.set(property, animation);
  }
  function propertyNames(object) {
    const names = [];
    for (let current = object;current && current !== Object.prototype; current = Object.getPrototypeOf(current)) {
      names.push(...Object.getOwnPropertyNames(current));
    }
    return names.filter((name) => guardedMember(object, name) === undefined);
  }
  function validateDuration2(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError("duration must be a finite number.");
    }
    if (value < 0)
      throw new RangeError("duration must be non-negative.");
    return value;
  }
  function resolveTween(name) {
    if (name in tweens)
      return name;
    const suggestion = nearestTween(name);
    if (suggestion) {
      throw new Error(`No tween called ${name} found, did you mean ${suggestion}?`);
    }
    throw new Error(`No tween called ${name} found.`);
  }
  function nearestTween(name) {
    const respelled = tweenNames.find((candidate) => looseName(candidate) === looseName(name));
    if (respelled)
      return respelled;
    let bestName = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const candidate of tweenNames) {
      const distance = levenshtein(name, candidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestName = candidate;
      }
    }
    return bestDistance <= 3 ? bestName : null;
  }
  function normalizeTargetValue(value, property, sameShapeAs) {
    if (typeof value === "number" && Number.isFinite(value)) {
      if (sameShapeAs !== undefined && Array.isArray(sameShapeAs)) {
        throw new TypeError(`${property} target must match the existing tuple shape.`);
      }
      return value;
    }
    if (Array.isArray(value) && value.every((entry) => typeof entry === "number" && Number.isFinite(entry))) {
      if (sameShapeAs !== undefined && (!Array.isArray(sameShapeAs) || sameShapeAs.length !== value.length)) {
        throw new TypeError(`${property} target must match the existing tuple shape.`);
      }
      return [...value];
    }
    throw new TypeError(`${property} must be a finite number or numeric tuple.`);
  }
  function interpolateValue(progress, start, target) {
    if (typeof start === "number" && typeof target === "number") {
      return start + (target - start) * progress;
    }
    if (Array.isArray(start) && Array.isArray(target)) {
      return start.map((value, index) => value + ((target[index] ?? value) - value) * progress);
    }
    throw new TypeError("Cannot interpolate mismatched values.");
  }
  var TAU = 2 * Math.PI;
  function easeInQuad(t) {
    return t * t;
  }
  function easeOutQuad(t) {
    return -t * (t - 2);
  }
  function easeInOutQuad(t) {
    const half = t * 2;
    if (half < 1)
      return 0.5 * half * half;
    const u = half - 1;
    return -0.5 * (u * (u - 2) - 1);
  }
  function easeInElastic(t) {
    if (t === 0 || t === 1)
      return t;
    const period = 0.3;
    const u = t - 1;
    return -(2 ** (10 * u) * Math.sin((u - period / 4) * TAU / period));
  }
  function easeOutElastic(t) {
    if (t === 0 || t === 1)
      return t;
    const period = 0.3;
    return 2 ** (-10 * t) * Math.sin((t - period / 4) * TAU / period) + 1;
  }
  function easeInOutElastic(t) {
    if (t === 0 || t === 1)
      return t;
    const period = 0.45;
    const u = t * 2 - 1;
    const wave = Math.sin((u - period / 4) * TAU / period);
    if (u < 0)
      return -0.5 * (2 ** (10 * u) * wave);
    return 0.5 * (2 ** (-10 * u) * wave) + 1;
  }
  function easeOutBounce(t) {
    if (t < 1 / 2.75)
      return 7.5625 * t * t;
    if (t < 2 / 2.75) {
      const u2 = t - 1.5 / 2.75;
      return 7.5625 * u2 * u2 + 0.75;
    }
    if (t < 2.5 / 2.75) {
      const u2 = t - 2.25 / 2.75;
      return 7.5625 * u2 * u2 + 0.9375;
    }
    const u = t - 2.625 / 2.75;
    return 7.5625 * u * u + 0.984375;
  }
  function easeInBounce(t) {
    return 1 - easeOutBounce(1 - t);
  }
  function easeInOutBounce(t) {
    if (t < 0.5)
      return easeInBounce(t * 2) * 0.5;
    return easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
  }

  // packages/core/src/pixel-density.ts
  var MAX_AUTO_PIXEL_DENSITY = 3;
  var MAX_CANVAS_PIXELS = 4096 * 4096;
  function devicePixelRatioOf(canvas) {
    const ratio = canvas.ownerDocument?.defaultView?.devicePixelRatio ?? globalThis.devicePixelRatio;
    return typeof ratio === "number" && Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  }
  function resolvePixelDensity(value, width, height, deviceRatio, emit) {
    const fits = Math.max(1, Math.sqrt(MAX_CANVAS_PIXELS / (width * height)));
    const auto = Math.max(1, Math.min(deviceRatio, MAX_AUTO_PIXEL_DENSITY, fits));
    if (value === undefined)
      return auto;
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      emit({
        code: "invalid-config",
        severity: "warning",
        name: "PIXEL_DENSITY",
        message: "PIXEL_DENSITY should be a positive number, like 1 or 2; using the screen's own density."
      });
      return auto;
    }
    if (value <= fits)
      return value;
    emit({
      code: "invalid-config",
      severity: "warning",
      name: "PIXEL_DENSITY",
      message: `PIXEL_DENSITY ${value} makes a ${width} × ${height} game too big a canvas for phones to show; using ${Math.floor(fits * 100) / 100}.`
    });
    return fits;
  }

  // packages/core/src/random.ts
  function hashSeed(seed) {
    if (typeof seed === "number" && !Number.isFinite(seed)) {
      throw new TypeError(`seed must be a finite number or a string, not ${seed}.`);
    }
    if (typeof seed !== "string" && typeof seed !== "number") {
      throw new TypeError(`seed must be a string or a number, not ${typeof seed}.`);
    }
    const value = String(seed);
    if (/^\d{1,9}$/.test(value))
      return Number(value) >>> 0;
    let hash = 2166136261;
    for (let index = 0;index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  function createSeededRandom(seed) {
    let state = hashSeed(seed) || 1831565813;
    return () => {
      state += 1831565813;
      let value = state;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }
  function mathWithRandom(random) {
    return Object.freeze(Object.create(Math, {
      random: { value: random, enumerable: false }
    }));
  }
  var activeRandom = null;
  function setActiveRandom(random) {
    const previous = activeRandom;
    activeRandom = random;
    return previous;
  }
  function random() {
    return activeRandom ? activeRandom() : Math.random();
  }

  // packages/core/src/runtime-persistence.ts
  var AUTOSAVE_DEBOUNCE_MS = 250;
  function attachAutosave(storage, emit) {
    let timer = null;
    let dirty = false;
    let writing = null;
    const reportSaveFailure = (error) => {
      emit(storageWarning(`Failed to auto-save storage: ${errorMessage2(error)}`));
    };
    const flush = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      if (writing)
        return writing;
      writing = (async () => {
        while (dirty) {
          dirty = false;
          try {
            await storage.save();
          } catch (error) {
            dirty = true;
            throw error;
          }
        }
      })().finally(() => {
        writing = null;
      });
      return writing;
    };
    const unsubscribe = storage.onChange(() => {
      dirty = true;
      if (timer !== null)
        clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        flush().catch(reportSaveFailure);
      }, AUTOSAVE_DEBOUNCE_MS);
    });
    const hasWindow = typeof window !== "undefined" && typeof window.addEventListener === "function";
    const pagehideHandler = hasWindow ? () => void flush().catch(reportSaveFailure) : undefined;
    const visibilityHandler = hasWindow && typeof document !== "undefined" ? () => {
      if (document.visibilityState === "hidden") {
        flush().catch(reportSaveFailure);
      }
    } : undefined;
    if (hasWindow && pagehideHandler) {
      window.addEventListener("pagehide", pagehideHandler);
    }
    if (hasWindow && visibilityHandler && typeof document !== "undefined") {
      document.addEventListener("visibilitychange", visibilityHandler);
    }
    return {
      flush,
      detach() {
        unsubscribe();
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
        if (hasWindow && pagehideHandler) {
          window.removeEventListener("pagehide", pagehideHandler);
        }
        if (hasWindow && visibilityHandler && typeof document !== "undefined") {
          document.removeEventListener("visibilitychange", visibilityHandler);
        }
      }
    };
  }
  function primeStorage(storage, emit) {
    const state = { current: false };
    try {
      if (storage.loadSync()) {
        state.current = true;
        return { state, promise: Promise.resolve() };
      }
    } catch (error) {
      emit(storageWarning(`Failed to load storage: ${errorMessage2(error)}`));
      state.current = true;
      return { state, promise: Promise.resolve() };
    }
    const promise = storage.load().catch((error) => {
      emit(storageWarning(`Failed to load storage: ${errorMessage2(error)}`));
    }).then(() => {
      state.current = true;
    });
    return { state, promise };
  }
  function storageWarning(message) {
    return {
      code: "runtime-error",
      severity: "warning",
      phase: "storage",
      recoverable: true,
      message
    };
  }
  function errorMessage2(error) {
    return error instanceof Error ? error.message : String(error);
  }

  // packages/core/src/storage-path.ts
  function normalizeStoragePath(path) {
    if (path.length === 0 || path.includes("\\") || path.startsWith("/")) {
      throw new TypeError("storage path must be a relative forward-slash path.");
    }
    const segments = path.split("/");
    if (segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")) {
      throw new TypeError("storage path cannot include empty or traversal segments.");
    }
    return segments.join("/");
  }

  // packages/core/src/storage.ts
  class JsonStorageError extends Error {
    path;
    constructor(path, message) {
      super(`${message} at ${path}`);
      this.name = "JsonStorageError";
      this.path = path;
    }
  }

  class Storage {
    adapter;
    values = new Map;
    listeners = new Set;
    constructor(options = {}) {
      this.adapter = options.adapter ?? createLocalStorageAdapter({
        ...options.projectId !== undefined ? { projectId: options.projectId } : {},
        ...options.path !== undefined ? { path: options.path } : {}
      });
      return new Proxy(this, storageProxyHandler);
    }
    get path() {
      return this.adapter.path;
    }
    get(key, defaultValue) {
      requireStorageKey(key);
      return this.values.has(key) ? this.values.get(key) : defaultValue;
    }
    set(key, value) {
      requireStorageKey(key);
      this.values.set(key, value);
      this.notify();
    }
    setDefault(key, defaultValue) {
      requireStorageKey(key);
      if (!this.values.has(key)) {
        this.values.set(key, defaultValue);
        this.notify();
      }
      return this.values.get(key);
    }
    has(key) {
      requireStorageKey(key);
      return this.values.has(key);
    }
    delete(key) {
      requireStorageKey(key);
      const deleted = this.values.delete(key);
      if (deleted)
        this.notify();
      return deleted;
    }
    clear() {
      if (this.values.size === 0)
        return;
      this.values.clear();
      this.notify();
    }
    keys() {
      return [...this.values.keys()].sort();
    }
    toJSON() {
      return this.jsonObject();
    }
    onChange(listener) {
      this.listeners.add(listener);
      return () => {
        this.listeners.delete(listener);
      };
    }
    async save() {
      await this.adapter.save(JSON.stringify(this.jsonObject()));
    }
    async load() {
      const text = await this.adapter.load();
      this.applyLoadedText(text);
    }
    loadSync() {
      if (!this.adapter.loadSync)
        return false;
      this.applyLoadedText(this.adapter.loadSync());
      return true;
    }
    applyLoadedText(text) {
      this.values.clear();
      if (text === null || text === "")
        return;
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (error) {
        throw new JsonStorageError(this.path, error instanceof Error ? error.message : "Invalid JSON");
      }
      validateJsonValue(parsed, "storage");
      if (!isPlainRecord(parsed)) {
        throw new JsonStorageError("storage", "Storage data must be a JSON object");
      }
      for (const [key, value] of Object.entries(parsed)) {
        this.values.set(key, value);
      }
    }
    notify() {
      for (const listener of this.listeners)
        listener();
    }
    jsonObject() {
      const object = {};
      for (const [key, value] of this.values)
        object[key] = value;
      validateJsonValue(object, "storage");
      return object;
    }
  }
  guardSpellings(Storage.prototype, "storage");
  function createStorage(options = {}) {
    return new Storage(options);
  }
  function createLocalStorageAdapter(options = {}) {
    const projectId = validateStorageProjectId(options.projectId ?? "default");
    const path = normalizeStoragePath(options.path ?? "storage");
    const scopedKey = `js-game-zero:${projectId}:${path}`;
    return {
      path: scopedKey,
      async load() {
        const localStorage = resolveLocalStorage(options.localStorage);
        return localStorage.getItem(scopedKey);
      },
      loadSync() {
        const localStorage = resolveLocalStorage(options.localStorage);
        return localStorage.getItem(scopedKey);
      },
      save(text) {
        const localStorage = resolveLocalStorage(options.localStorage);
        localStorage.setItem(scopedKey, text);
      }
    };
  }
  function validateJsonValue(value, path = "value") {
    validateJsonValueInner(value, path, new WeakSet);
  }
  function validateJsonValueInner(value, path, seen) {
    if (value === null || typeof value === "string" || typeof value === "boolean") {
      return;
    }
    if (typeof value === "number") {
      if (Number.isFinite(value))
        return;
      throw new JsonStorageError(path, "Non-finite numbers are not JSON values");
    }
    if (typeof value !== "object") {
      throw new JsonStorageError(path, `${typeof value} is not a JSON value`);
    }
    if (seen.has(value)) {
      throw new JsonStorageError(path, "Circular references are not JSON values");
    }
    seen.add(value);
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        validateJsonValueInner(item, `${path}[${index}]`, seen);
      });
      seen.delete(value);
      return;
    }
    if (!isPlainRecord(value)) {
      throw new JsonStorageError(path, "Only plain objects can be saved as JSON");
    }
    for (const [key, item] of Object.entries(value)) {
      validateJsonValueInner(item, `${path}.${key}`, seen);
    }
    seen.delete(value);
  }
  function requireStorageKey(key) {
    if (typeof key !== "string" || key.length === 0) {
      throw new TypeError("storage keys must be non-empty strings.");
    }
  }
  function validateStorageProjectId(projectId) {
    if (!/^[a-z][a-z0-9_-]*$/.test(projectId)) {
      throw new TypeError("storage projectId must be lowercase, start with a letter, and contain only letters, digits, underscores, or hyphens.");
    }
    return projectId;
  }
  function resolveLocalStorage(localStorage) {
    const resolved = localStorage ?? globalThis.localStorage;
    if (!resolved) {
      throw new Error("localStorage is not available in this environment.");
    }
    return resolved;
  }
  function isPlainRecord(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }
  var storageProxyHandler = {
    get(target, property, receiver) {
      if (typeof property !== "string") {
        return Reflect.get(target, property, receiver);
      }
      if (property === "then" || property === "inspect" || property === "toJSON") {
        return Reflect.get(target, property, receiver);
      }
      if (property in target) {
        const value = Reflect.get(target, property, receiver);
        return typeof value === "function" ? value.bind(target) : value;
      }
      return target.get(property);
    },
    set(target, property, value, receiver) {
      if (typeof property !== "string" || property in target) {
        return Reflect.set(target, property, value, receiver);
      }
      target.set(property, value);
      return true;
    },
    deleteProperty(target, property) {
      return typeof property === "string" ? target.delete(property) : false;
    },
    has(target, property) {
      return Reflect.has(target, property) || typeof property === "string" && target.has(property);
    },
    ownKeys(target) {
      return [...new Set([...Reflect.ownKeys(target), ...target.keys()])];
    },
    getOwnPropertyDescriptor(target, property) {
      if (typeof property === "string" && target.has(property)) {
        return {
          configurable: true,
          enumerable: true,
          writable: true,
          value: target.get(property)
        };
      }
      return Reflect.getOwnPropertyDescriptor(target, property);
    }
  };
  var defaultStorage = createStorage();
  var activeStorage = null;
  function setActiveStorage(nextStorage) {
    const previous = activeStorage;
    activeStorage = nextStorage;
    return previous;
  }
  function getActiveStorage() {
    return activeStorage ?? defaultStorage;
  }
  var storage = createActiveServiceProxy(getActiveStorage);

  // packages/core/src/tone.ts
  var tonePlayOptionKeys = new Set(["waveform", "volume"]);
  var DEFAULT_TONE_VOLUME = 0.8;

  class CreatedTone {
    frequency;
    duration;
    waveform;
    volume;
    generator;
    constructor(generator, spec) {
      this.generator = generator;
      this.frequency = spec.frequency;
      this.duration = spec.duration;
      this.waveform = spec.waveform;
      this.volume = spec.volume;
    }
    play(options = {}) {
      rejectUnknownOptions(options, tonePlayOptionKeys, "tone");
      return this.generator.play(this.frequency, this.duration, {
        waveform: options.waveform ?? this.waveform,
        volume: options.volume ?? this.volume
      });
    }
  }

  class ToneGenerator {
    contextValue;
    unlockState;
    scheduledTones = [];
    constructor(options = {}) {
      this.contextValue = options.audioContext ?? null;
      this.unlockState = options.unlockState ?? audioUnlock;
    }
    create(noteOrFrequency, duration = 1, options = {}) {
      return new CreatedTone(this, this.createSpec(noteOrFrequency, duration, options));
    }
    async play(noteOrFrequency, duration = 1, options = {}) {
      const spec = this.createSpec(noteOrFrequency, duration, options);
      const context = this.getContext();
      await this.unlock();
      const startAt = context.currentTime;
      const stopAt = startAt + spec.duration;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = spec.waveform;
      setAudioParam(oscillator.frequency, spec.frequency, startAt);
      setAudioParam(gain.gain, spec.volume, startAt);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(stopAt);
      const playback = {
        ...spec,
        startedAt: startAt,
        stoppedAt: stopAt
      };
      this.scheduledTones.push(playback);
      return playback;
    }
    async unlock() {
      const context = this.getContext();
      if (context.state === "suspended" && context.resume) {
        await context.resume();
      }
      if (context.state === undefined || context.state === "running") {
        this.unlockState.markUnlocked();
      }
      return this.unlockState.isUnlocked();
    }
    isUnlocked() {
      return this.unlockState.isUnlocked();
    }
    debugState() {
      return {
        unlocked: this.unlockState.isUnlocked(),
        contextState: this.contextValue?.state ?? null,
        scheduled: [...this.scheduledTones]
      };
    }
    createSpec(noteOrFrequency, duration, options) {
      rejectUnknownOptions(options, tonePlayOptionKeys, "tone");
      return {
        frequency: parseToneFrequency(noteOrFrequency),
        duration: requireToneDuration(duration),
        waveform: normalizeWaveform(options.waveform ?? "sine"),
        volume: clampVolume(options.volume ?? DEFAULT_TONE_VOLUME)
      };
    }
    getContext() {
      if (this.contextValue)
        return this.contextValue;
      const AudioContextConstructor = globalThis.AudioContext ?? globalThis.webkitAudioContext;
      if (typeof AudioContextConstructor !== "function") {
        throw new Error("Web Audio is not available in this environment.");
      }
      this.contextValue = new AudioContextConstructor;
      return this.contextValue;
    }
  }
  guardSpellings(ToneGenerator.prototype, "tone");
  function createToneGenerator(options = {}) {
    return new ToneGenerator(options);
  }
  var tone = createToneGenerator();
  function parseToneFrequency(noteOrFrequency) {
    if (typeof noteOrFrequency === "number") {
      if (Number.isFinite(noteOrFrequency) && noteOrFrequency > 0) {
        return noteOrFrequency;
      }
      throw new RangeError("tone frequency must be a positive finite number.");
    }
    return noteToFrequency(noteOrFrequency);
  }
  function noteToFrequency(noteName) {
    const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(noteName.trim());
    if (!match) {
      throw new TypeError("tone note names must look like A4, A#5, or Bb3.");
    }
    const [, note = "", accidental = "", octaveText = ""] = match;
    const baseSemitone = noteSemitones[note.toUpperCase()];
    if (baseSemitone === undefined) {
      throw new TypeError(`Unknown tone note name: ${noteName}.`);
    }
    const semitone = baseSemitone + (accidental === "#" ? 1 : accidental === "b" ? -1 : 0);
    const octave = Number(octaveText);
    const midi = (octave + 1) * 12 + semitone;
    return 440 * 2 ** ((midi - 69) / 12);
  }
  function requireToneDuration(duration) {
    if (typeof duration === "number" && Number.isFinite(duration) && duration > 0 && duration <= 4) {
      return duration;
    }
    throw new RangeError("tone duration must be greater than 0 and at most 4 seconds.");
  }
  function normalizeWaveform(waveform) {
    if (waveform === "sin")
      return "sine";
    if (waveform === "saw")
      return "sawtooth";
    return waveform;
  }
  function setAudioParam(param, value, time) {
    if (param.setValueAtTime) {
      param.setValueAtTime(value, time);
      return;
    }
    param.value = value;
  }
  var noteSemitones = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
  };

  // packages/core/src/touch-controls.ts
  var defaults = {
    up: keys.UP,
    down: keys.DOWN,
    left: keys.LEFT,
    right: keys.RIGHT,
    a: keys.SPACE,
    b: keys.X,
    start: keys.RETURN,
    select: keys.ESCAPE
  };
  var labels = {
    a: "A",
    b: "B",
    start: "Start",
    select: "Select"
  };
  var directions = ["up", "down", "left", "right"];
  var arrows = {
    up: "M6 14.5 12 8.5 18 14.5",
    down: "M6 9.5 12 15.5 18 9.5",
    left: "M14.5 6 8.5 12 14.5 18",
    right: "M9.5 6 15.5 12 9.5 18"
  };
  function normalizeTouchControls(value) {
    if (value === undefined || value === false)
      return null;
    const config = value === true ? defaults : value;
    if (typeof config !== "object" || config === null || Array.isArray(config)) {
      throw new TypeError("TOUCH_CONTROLS must be true, false, or a button mapping object.");
    }
    const mapping = config;
    for (const name of Object.keys(mapping)) {
      if (name !== "show" && !Object.hasOwn(defaults, name)) {
        throw new TypeError(`Unknown TOUCH_CONTROLS button: ${name}`);
      }
    }
    const show = mapping.show ?? "auto";
    if (show !== "auto" && show !== "always") {
      throw new TypeError('TOUCH_CONTROLS.show must be "auto" or "always".');
    }
    const buttons = [];
    for (const name of Object.keys(defaults)) {
      if (!Object.hasOwn(mapping, name))
        continue;
      const key = mapping[name];
      if (!isKeyConstant(key)) {
        throw new TypeError(`TOUCH_CONTROLS.${name} must be a keys constant.`);
      }
      buttons.push([name, key]);
    }
    return { show, buttons };
  }
  var controlStyles = `
[data-jgz-touch-surface] { box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: var(--jgz-dock-gap, 16px); width: 100%; min-width: 0; min-height: 0; flex-shrink: 0; }
[data-jgz-touch-surface] > canvas { flex-shrink: 0; }
[data-jgz-touch-controls] {
  --_size: var(--jgz-key-size, clamp(40px, 10vw, 52px));
  --_fill: var(--jgz-key-fill, #263244);
  --_ink: var(--jgz-key-ink, #fff);
  --_line: var(--jgz-key-line, #718096);
  --_line-width: var(--jgz-key-line-width, 2px);
  --_pressed: var(--jgz-key-pressed-fill, #4267a0);
  --_pressed-line: var(--jgz-key-pressed-line, #b9d5ff);
  --_dx: var(--jgz-key-shadow-x, 0px);
  --_dy: var(--jgz-key-shadow-y, 0px);
  --_shadow: var(--jgz-key-shadow-color, transparent);
  --_radius: var(--jgz-key-radius, 12px);
  --_dpad-radius: var(--jgz-dpad-radius, 10px);
  --_dot: var(--jgz-dpad-dot, rgba(255, 255, 255, 0.16));
  --_font: var(--jgz-key-font, bold 13px system-ui, sans-serif);
  --_action-font: var(--jgz-action-font, bold 18px system-ui, sans-serif);
  --_action-line-width: var(--jgz-action-line-width, var(--_line-width));
  --_system-height: var(--jgz-system-height, 40px);
  --_system-radius: var(--jgz-system-radius, 12px);
  --_focus: var(--jgz-focus-ring, #facc15);
  box-sizing: border-box; width: 100%; max-width: 680px; flex-shrink: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); grid-template-areas: "dpad system actions"; align-items: center; gap: 12px 8px; padding: 8px max(8px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left)); user-select: none; -webkit-user-select: none;
}
[data-jgz-touch-controls][hidden] { display: none; }
[data-jgz-touch-controls] button { box-sizing: border-box; display: flex; align-items: center; justify-content: center; min-width: var(--_size); height: var(--_size); margin: 0; padding: 0 8px; border: var(--_line-width) solid var(--_line); border-radius: var(--_radius); color: var(--_ink); background: var(--_fill); box-shadow: var(--_dx) var(--_dy) 0 var(--_shadow); font: var(--_font); touch-action: none; -webkit-tap-highlight-color: transparent; cursor: pointer; transition: transform 60ms ease-out, box-shadow 60ms ease-out, background-color 60ms ease-out; }
[data-jgz-touch-controls] button svg { width: 46%; height: 46%; flex-shrink: 0; pointer-events: none; }
[data-jgz-touch-controls] button[aria-pressed="true"] { background: var(--_pressed); border-color: var(--_pressed-line); transform: translate(var(--_dx), var(--_dy)); box-shadow: 0 0 0 var(--_shadow); }
[data-jgz-touch-controls] button:focus-visible { outline: 3px solid var(--_focus); outline-offset: 2px; }
[data-jgz-touch-controls] .jgz-dpad { grid-area: dpad; justify-self: start; display: grid; }
[data-jgz-touch-controls] .jgz-cross { grid-template: repeat(3, var(--_size)) / repeat(3, var(--_size)); filter: drop-shadow(var(--_dx) var(--_dy) 0 var(--_shadow)); }
[data-jgz-touch-controls] .jgz-cross button { position: relative; z-index: 1; min-width: 0; height: auto; padding: 0; border-radius: 0; box-shadow: none; }
[data-jgz-touch-controls] .jgz-cross button[aria-pressed="true"] { transform: none; box-shadow: none; }
[data-jgz-touch-controls] .jgz-cross [data-jgz-touch-button="up"] { grid-area: 1 / 2; border-bottom: 0; margin-bottom: calc(-1 * var(--_line-width)); border-radius: var(--_dpad-radius) var(--_dpad-radius) 0 0; }
[data-jgz-touch-controls] .jgz-cross [data-jgz-touch-button="down"] { grid-area: 3 / 2; border-top: 0; margin-top: calc(-1 * var(--_line-width)); border-radius: 0 0 var(--_dpad-radius) var(--_dpad-radius); }
[data-jgz-touch-controls] .jgz-cross [data-jgz-touch-button="left"] { grid-area: 2 / 1; border-right: 0; margin-right: calc(-1 * var(--_line-width)); border-radius: var(--_dpad-radius) 0 0 var(--_dpad-radius); }
[data-jgz-touch-controls] .jgz-cross [data-jgz-touch-button="right"] { grid-area: 2 / 3; border-left: 0; margin-left: calc(-1 * var(--_line-width)); border-radius: 0 var(--_dpad-radius) var(--_dpad-radius) 0; }
[data-jgz-touch-controls] .jgz-dpad-center { grid-area: 2 / 2; box-sizing: border-box; border: var(--_line-width) solid var(--_line); background: radial-gradient(circle closest-side, var(--_dot) 0 22%, transparent 24%), var(--_fill); }
[data-jgz-touch-controls] .jgz-cross.jgz-has-up .jgz-dpad-center { border-top: 0; }
[data-jgz-touch-controls] .jgz-cross.jgz-has-down .jgz-dpad-center { border-bottom: 0; }
[data-jgz-touch-controls] .jgz-cross.jgz-has-left .jgz-dpad-center { border-left: 0; }
[data-jgz-touch-controls] .jgz-cross.jgz-has-right .jgz-dpad-center { border-right: 0; }
[data-jgz-touch-controls] .jgz-split { gap: 12px; grid-auto-flow: column; grid-template-rows: var(--_size); }
[data-jgz-touch-controls] .jgz-split button { min-width: calc(var(--_size) * 1.2); }
[data-jgz-touch-controls] .jgz-split.jgz-vertical { grid-auto-flow: row; grid-template-rows: none; }
[data-jgz-touch-controls] .jgz-actions { grid-area: actions; justify-self: end; display: grid; grid-template: repeat(3, calc(var(--_size) / 2)) / repeat(2, var(--_size)); column-gap: 8px; }
[data-jgz-touch-controls] .jgz-actions button { padding: 0; border-width: var(--_action-line-width); border-radius: 50%; font: var(--_action-font); }
[data-jgz-touch-controls] [data-jgz-touch-button="a"] { grid-area: 1 / 2 / span 2; }
[data-jgz-touch-controls] [data-jgz-touch-button="b"] { grid-area: 2 / 1 / span 2; }
[data-jgz-touch-controls] .jgz-actions.jgz-single { grid-template: var(--_size) / var(--_size); }
[data-jgz-touch-controls] .jgz-actions.jgz-single button { grid-area: 1 / 1; }
[data-jgz-touch-controls] .jgz-system { grid-area: system; justify-self: center; display: flex; flex-direction: column; gap: 8px; }
[data-jgz-touch-controls] .jgz-system button { min-width: 0; height: var(--_system-height); padding: 0 14px; border-radius: var(--_system-radius); }
@media (orientation: portrait) {
  [data-jgz-touch-surface] { gap: var(--jgz-dock-gap, 48px); }
  [data-jgz-touch-controls] { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: "dpad actions"; }
  [data-jgz-touch-controls].jgz-has-system.jgz-has-actions { grid-template-areas: "dpad actions" "system system"; }
  [data-jgz-touch-controls].jgz-has-system.jgz-has-actions .jgz-system { flex-direction: row; }
  [data-jgz-touch-controls].jgz-has-system:not(.jgz-has-actions) { grid-template-areas: "dpad system"; }
  [data-jgz-touch-controls].jgz-has-system:not(.jgz-has-actions) .jgz-system { justify-self: end; }
}
`;
  var isDirection = (name) => directions.includes(name);
  function arrow(doc, direction) {
    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", arrows[direction]);
    svg.append(path);
    return svg;
  }
  function mountTouchControls(canvas, settings, dispatcher, invoke, screen2 = canvas) {
    const noop = { reset() {}, detach() {} };
    const parent = canvas.parentElement;
    if (!settings || !settings.buttons.length || !parent)
      return noop;
    const doc = canvas.ownerDocument;
    const view = doc.defaultView;
    if (!view)
      return noop;
    const surface = doc.createElement("div");
    surface.dataset.jgzTouchSurface = "";
    const root = doc.createElement("div");
    root.dataset.jgzTouchControls = "";
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", "Game touch controls");
    const style = doc.createElement("style");
    style.textContent = controlStyles;
    root.append(style);
    const dpad = doc.createElement("div");
    dpad.className = "jgz-dpad";
    const system = doc.createElement("div");
    system.className = "jgz-system";
    const actions = doc.createElement("div");
    actions.className = "jgz-actions";
    root.append(dpad, system, actions);
    const held = new Map;
    const bindings = new Map;
    const keyboardSources = new Map;
    const cleanups = [];
    const listen = (target, type, callback) => {
      target.addEventListener(type, callback);
      cleanups.push(() => target.removeEventListener(type, callback));
    };
    const updateButton = (button) => {
      button.setAttribute("aria-pressed", String(keyboardSources.has(button) || [...held.values()].some((press) => press.button === button)));
    };
    const release = (id) => {
      const press = held.get(id);
      if (!press)
        return;
      held.delete(id);
      updateButton(press.button);
      if (press.capture.hasPointerCapture(id))
        press.capture.releasePointerCapture(id);
      invoke(() => dispatcher.handleVirtualKeyUp(press.source));
    };
    for (const [name, key] of settings.buttons) {
      const button = doc.createElement("button");
      bindings.set(button, key);
      button.type = "button";
      button.dataset.jgzTouchButton = name;
      if (isDirection(name))
        button.append(arrow(doc, name));
      else
        button.textContent = labels[name];
      button.setAttribute("aria-label", name.length > 1 ? name[0].toUpperCase() + name.slice(1) : name.toUpperCase());
      button.setAttribute("aria-pressed", "false");
      const group = isDirection(name) ? dpad : ["start", "select"].includes(name) ? system : actions;
      group.append(button);
      listen(button, "pointerdown", (raw) => {
        const event = raw;
        if (event.button !== 0 || held.has(event.pointerId))
          return;
        event.preventDefault();
        canvas.focus({ preventScroll: true });
        button.setPointerCapture(event.pointerId);
        const source = {};
        held.set(event.pointerId, { button, capture: button, source });
        updateButton(button);
        invoke(() => dispatcher.handleVirtualKeyDown(key, source));
      });
      for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
        listen(button, type, (event) => release(event.pointerId));
      }
      listen(button, "keydown", (raw) => {
        const event = raw;
        if (event.key !== " " && event.key !== "Enter")
          return;
        event.preventDefault();
        event.stopPropagation();
        if (keyboardSources.has(button))
          return;
        const source = {};
        keyboardSources.set(button, source);
        updateButton(button);
        invoke(() => dispatcher.handleVirtualKeyDown(key, source));
      });
      const releaseKeyboard = () => {
        const source = keyboardSources.get(button);
        if (!source)
          return;
        keyboardSources.delete(button);
        updateButton(button);
        invoke(() => dispatcher.handleVirtualKeyUp(source));
      };
      listen(button, "keyup", (raw) => {
        const event = raw;
        if (event.key !== " " && event.key !== "Enter")
          return;
        event.preventDefault();
        event.stopPropagation();
        releaseKeyboard();
      });
      listen(button, "blur", releaseKeyboard);
    }
    listen(root, "pointermove", (raw) => {
      const event = raw;
      const press = held.get(event.pointerId);
      if (!press || !dpad.contains(press.button))
        return;
      const next = doc.elementFromPoint(event.clientX, event.clientY)?.closest("button");
      if (!next || !dpad.contains(next) || next === press.button)
        return;
      const key = bindings.get(next);
      if (key === undefined)
        return;
      const previous = press.button;
      press.button = next;
      updateButton(previous);
      updateButton(next);
      invoke(() => {
        dispatcher.handleVirtualKeyUp(press.source);
        if (root.isConnected)
          dispatcher.handleVirtualKeyDown(key, press.source);
      });
    });
    const shown = directions.filter((direction) => settings.buttons.some(([name]) => name === direction));
    const opposite = shown.length === 2 && (shown.every((d) => d === "up" || d === "down") || shown.every((d) => d === "left" || d === "right"));
    if (shown.length >= 2 && !opposite) {
      dpad.classList.add("jgz-cross");
      for (const direction of shown)
        dpad.classList.add(`jgz-has-${direction}`);
      const center = doc.createElement("div");
      center.className = "jgz-dpad-center";
      center.setAttribute("aria-hidden", "true");
      dpad.append(center);
    } else if (shown.length) {
      dpad.classList.add("jgz-split");
      if (shown.every((d) => d === "up" || d === "down"))
        dpad.classList.add("jgz-vertical");
    }
    if (!dpad.children.length)
      dpad.remove();
    root.classList.toggle("jgz-has-system", system.children.length > 0);
    root.classList.toggle("jgz-has-actions", actions.children.length > 0);
    if (!system.children.length)
      system.remove();
    actions.classList.toggle("jgz-single", actions.children.length === 1);
    if (!actions.children.length)
      actions.remove();
    canvas.after(root);
    const initialWidth = canvas.style.width;
    const initialHeight = canvas.style.height;
    let fitted = false;
    const restoreSize = () => {
      if (fitted) {
        canvas.style.width = initialWidth;
        canvas.style.height = initialHeight;
        fitted = false;
      }
      if (surface.parentElement) {
        surface.before(canvas, root);
        surface.remove();
      }
    };
    const fit = () => {
      if (root.hidden)
        return;
      if (!surface.parentElement) {
        canvas.before(surface);
        surface.append(canvas, root);
      }
      const parentStyle = view.getComputedStyle(parent);
      const pixels = (value) => parseFloat(value) || 0;
      const siblings = [...parent.children].filter((element) => element !== canvas && element !== root && element !== surface && element.tagName !== "SCRIPT" && element.tagName !== "STYLE" && view.getComputedStyle(element).display !== "none");
      const siblingHeight = siblings.reduce((total, element) => {
        const style2 = view.getComputedStyle(element);
        return total + element.getBoundingClientRect().height + pixels(style2.marginTop) + pixels(style2.marginBottom);
      }, 0);
      const canvasStyle = view.getComputedStyle(canvas);
      const horizontalEdges = pixels(canvasStyle.borderLeftWidth) + pixels(canvasStyle.borderRightWidth) + pixels(canvasStyle.paddingLeft) + pixels(canvasStyle.paddingRight);
      const verticalEdges = pixels(canvasStyle.borderTopWidth) + pixels(canvasStyle.borderBottomWidth) + pixels(canvasStyle.paddingTop) + pixels(canvasStyle.paddingBottom);
      const width = Math.min(parent.clientWidth || view.innerWidth, view.innerWidth) - pixels(parentStyle.paddingLeft) - pixels(parentStyle.paddingRight) - horizontalEdges;
      const surfaceHeight = Math.max(0, Math.min(parent === doc.body ? view.innerHeight - pixels(parentStyle.marginTop) - pixels(parentStyle.marginBottom) : parent.clientHeight || view.innerHeight, view.innerHeight) - siblingHeight - pixels(parentStyle.rowGap) * siblings.length - pixels(parentStyle.paddingTop) - pixels(parentStyle.paddingBottom));
      surface.style.height = `${surfaceHeight}px`;
      surface.style.rowGap = "";
      const dockHeight = root.getBoundingClientRect().height;
      const minimumGap = pixels(view.getComputedStyle(surface).rowGap);
      const height = surfaceHeight - dockHeight - minimumGap - verticalEdges;
      const logicalWidth = screen2.width || 1;
      const logicalHeight = screen2.height || 1;
      const scale = Math.max(0, Math.min(width / logicalWidth, height / logicalHeight));
      const setScale = (value) => {
        const borderBox = canvasStyle.boxSizing === "border-box";
        canvas.style.width = `${logicalWidth * value + (borderBox ? horizontalEdges : 0)}px`;
        canvas.style.height = `${logicalHeight * value + (borderBox ? verticalEdges : 0)}px`;
      };
      setScale(scale);
      const rect = canvas.getBoundingClientRect();
      const contentWidth = rect.width - horizontalEdges;
      const contentHeight = rect.height - verticalEdges;
      const constrainedScale = Math.max(0, Math.min(scale, contentWidth / logicalWidth, contentHeight / logicalHeight));
      if (constrainedScale < scale) {
        setScale(constrainedScale);
      }
      if (view.matchMedia("(orientation: portrait)").matches) {
        const screenHeight = canvas.getBoundingClientRect().height;
        surface.style.rowGap = `${Math.max(minimumGap, (surfaceHeight - screenHeight) / 2 - dockHeight)}px`;
      }
      fitted = true;
    };
    const reset = () => {
      const presses = [...held.entries()];
      held.clear();
      keyboardSources.clear();
      for (const [id, press] of presses) {
        if (press.capture.hasPointerCapture(id))
          press.capture.releasePointerCapture(id);
        updateButton(press.button);
      }
      for (const button of root.querySelectorAll("button"))
        updateButton(button);
    };
    const media = view.matchMedia("(any-pointer: coarse)");
    const updateVisibility = () => {
      const wasVisible = !root.hidden;
      root.hidden = settings.show !== "always" && !media.matches && view.navigator.maxTouchPoints === 0;
      if (root.hidden && wasVisible) {
        reset();
        dispatcher.handleFocusLoss();
        restoreSize();
      } else
        fit();
    };
    listen(media, "change", updateVisibility);
    listen(view, "resize", fit);
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    observer.observe(parent);
    observer.observe(canvas);
    const dimensions = new MutationObserver(fit);
    dimensions.observe(canvas, {
      attributes: true,
      attributeFilter: ["width", "height"]
    });
    updateVisibility();
    return {
      reset,
      detach() {
        reset();
        observer.disconnect();
        dimensions.disconnect();
        for (const cleanup of cleanups)
          cleanup();
        restoreSize();
        root.remove();
      }
    };
  }

  // packages/core/src/touch-pointer.ts
  function attachTouchPointer(canvas, dispatcher, invoke, target = canvas) {
    if (!canvas.style || typeof canvas.setPointerCapture !== "function") {
      return { reset() {}, detach() {} };
    }
    const initialTouchAction = canvas.style.touchAction;
    canvas.style.touchAction = "none";
    let active = null;
    let previous = null;
    const mapped = (event, down2) => ({
      clientX: event.clientX,
      clientY: event.clientY,
      button: 0,
      buttons: down2 ? 1 : 0,
      movementX: previous ? event.clientX - previous.clientX : 0,
      movementY: previous ? event.clientY - previous.clientY : 0
    });
    const down = (raw) => {
      const event = raw;
      if (event.pointerType === "mouse" || active !== null || !event.isPrimary || event.button !== 0)
        return;
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(event.pointerId);
      active = event.pointerId;
      const mouseEvent = mapped(event, true);
      previous = { clientX: event.clientX, clientY: event.clientY };
      invoke(() => {
        dispatcher.handleMouseDown(mouseEvent, target);
      });
    };
    const move = (raw) => {
      const event = raw;
      if (event.pointerId !== active)
        return;
      const mouseEvent = mapped(event, true);
      previous = { clientX: event.clientX, clientY: event.clientY };
      invoke(() => {
        dispatcher.handleMouseMove(mouseEvent, target);
      });
    };
    const reset = () => {
      const id = active;
      active = null;
      previous = null;
      if (id !== null && canvas.hasPointerCapture(id))
        canvas.releasePointerCapture(id);
    };
    const up = (raw) => {
      const event = raw;
      if (event.pointerId !== active)
        return;
      const mouseEvent = event.type === "lostpointercapture" && previous ? { ...previous, button: 0, buttons: 0, movementX: 0, movementY: 0 } : mapped(event, false);
      reset();
      invoke(() => {
        dispatcher.handleMouseUp(mouseEvent, target);
      });
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
      canvas.addEventListener(type, up);
    return {
      reset() {
        const position = previous;
        const held = active !== null;
        reset();
        if (held && position) {
          invoke(() => {
            dispatcher.handleMouseUp({ ...position, button: 0, buttons: 0, movementX: 0, movementY: 0 }, target);
          });
        }
      },
      detach() {
        reset();
        canvas.style.touchAction = initialTouchAction;
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
          canvas.removeEventListener(type, up);
      }
    };
  }

  // packages/core/src/helpers.ts
  function randomInt(min, max) {
    return pickInt(min, max, "randomInt");
  }
  function randomChoice(items) {
    return pickFrom(items, "randomChoice");
  }
  function pickInt(min, max, name) {
    requireNumber(min, name, "min");
    requireNumber(max, name, "max");
    const low = Math.ceil(min);
    const high = Math.floor(max);
    if (low > high) {
      throw new RangeError(`${name}(${min}, ${max}) has no whole numbers to pick from: put the smaller number first.`);
    }
    return low + Math.floor(random() * (high - low + 1));
  }
  function pickFrom(items, name) {
    if (!Array.isArray(items)) {
      throw new TypeError(`${name} needs a list, like ${name}([1, 2, 3]).`);
    }
    if (items.length === 0) {
      throw new RangeError(`${name} needs a list with at least one item.`);
    }
    return items[Math.floor(random() * items.length)];
  }
  function clamp2(value, min, max) {
    requireNumber(value, "clamp", "value");
    requireNumber(min, "clamp", "min");
    requireNumber(max, "clamp", "max");
    if (min > max) {
      throw new RangeError(`clamp(value, ${min}, ${max}): the smallest allowed value comes first.`);
    }
    return Math.min(max, Math.max(min, value));
  }
  function requireNumber(value, name, label) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError(`${name}'s ${label} must be a number, but got ${String(value)}.`);
    }
  }

  // packages/core/src/runtime-source.ts
  var builtinGlobals = {
    Array,
    BigInt,
    Boolean,
    Date,
    Error,
    Infinity: Infinity,
    Intl,
    JSON,
    Map,
    Math,
    NaN: NaN,
    Number,
    Object,
    Promise,
    RangeError,
    ReferenceError,
    RegExp,
    Set,
    String,
    Symbol,
    SyntaxError,
    TypeError,
    WeakMap,
    WeakSet,
    console,
    decodeURIComponent,
    encodeURIComponent,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    undefined: undefined
  };
  var drawMethods = [
    "line",
    "circle",
    "filledCircle",
    "polygon",
    "filledPolygon",
    "rect",
    "filledRect",
    "text",
    "textbox",
    "image"
  ];
  var screenHints = Object.fromEntries([
    ...drawMethods.flatMap((name) => {
      const loose = looseName(name);
      return [
        [`draw${loose}`, `screen.draw.${name}`],
        [loose, `screen.draw.${name}`]
      ];
    }),
    ["fillrect", "screen.draw.filledRect"],
    ["fillcircle", "screen.draw.filledCircle"],
    ["fillpolygon", "screen.draw.filledPolygon"],
    ["rectangle", "screen.draw.rect"],
    ["filledrectangle", "screen.draw.filledRect"],
    ["fillrectangle", "screen.draw.filledRect"],
    ["drawrectangle", "screen.draw.rect"],
    ["triangle", "screen.triangle"],
    ["filledtriangle", "screen.triangle"]
  ]);
  function pointToService(cls, className, serviceName, service) {
    return new Proxy(cls, {
      get(target, property, receiver) {
        if (typeof property === "string" && !(property in target) && property in service) {
          const member = guardedMember(service, property) ?? property;
          throw new TypeError(`${className}.${property} doesn't exist. Did you mean ${serviceName}.${member}?`);
        }
        return Reflect.get(target, property, receiver);
      }
    });
  }
  var screenInternals = [
    "drawSurface",
    "drawLine",
    "drawCircle",
    "drawPolygon",
    "drawRect",
    "drawText",
    "drawTextbox"
  ];
  var unavailableGlobalHints = {
    setTimeout: "Use clock.schedule(callback, seconds) instead. It takes seconds, not milliseconds, and pauses with the game.",
    setInterval: "Use clock.scheduleInterval(callback, seconds) instead. It takes seconds, not milliseconds, and pauses with the game.",
    clearTimeout: "Use clock.unschedule(callback) to cancel something scheduled with clock.",
    clearInterval: "Use clock.unschedule(callback) to cancel something scheduled with clock.",
    requestAnimationFrame: "The game already calls update() and draw() for you on every frame.",
    alert: "Show a message with screen.draw.text() inside draw(), or print it with console.log().",
    confirm: "Show a question with screen.draw.text() and read the answer in onKeyDown() or onMouseDown().",
    prompt: "Show a question with screen.draw.text() and read the answer in onKeyDown() or onMouseDown().",
    window: "Games draw on their canvas with screen, and read input with keyboard and hooks like onKeyDown().",
    document: "Games draw on their canvas with screen, and read input with keyboard and hooks like onKeyDown().",
    localStorage: 'Use storage instead, for example storage.set("score", 10).',
    sessionStorage: 'Use storage instead, for example storage.set("score", 10).',
    Image: 'Use new Actor("name") or screen.blit("name", [x, y]) to show a picture from images/.',
    Audio: 'Use sounds.name.play() for a sound in sounds/, or music.play("name") for music.'
  };
  var sourceResultFields = [
    ...RUNTIME_CONFIGURATION_NAMES.map((name) => `${name}: ${name}`),
    ...RUNTIME_SOURCE_HOOK_NAMES.map((name) => `${name}: typeof ${name} === "function" ? ${name} : undefined`)
  ].join(`,
`);
  function executeZeroBoilerplateSource(source, context, runFunction, emit) {
    diagnoseSource(source, emit);
    const scan = scanSource(source);
    const functionNames = new Set(scan.topLevelFunctions);
    const bindingNames = scan.complete ? scan.topLevelAssignments.filter((name) => !functionNames.has(name)) : [];
    const callableNames = scan.complete ? [...functionNames] : [];

    class RuntimeActor extends Actor {
      constructor(image, pos, options = {}) {
        super(image, pos, {
          ...options,
          screen: context.screen,
          loader: context.loaders.images,
          clock: context.clock
        });
      }
    }
    const globals = {
      Animation,
      animate,
      Clock: pointToService(Clock, "Clock", "clock", context.clock),
      KeyboardState,
      Rect,
      ZRect,
      Screen: pointToService(Screen, "Screen", "screen", context.screen),
      Storage: pointToService(Storage, "Storage", "storage", context.storage),
      Actor: RuntimeActor,
      screen: friendlyService(context.screen, "screen", {
        hidden: screenInternals,
        nested: ["draw"],
        hints: screenHints
      }),
      clock: friendlyService(context.clock, "clock"),
      keyboard: context.keyboard,
      keymods: friendlyService(keymods, "keymods"),
      keys: friendlyService(keys, "keys"),
      mouse: friendlyService(createLiveMouse(context.mouseState, () => [
        configuredSize("WIDTH", context.screen.width) / 2,
        configuredSize("HEIGHT", context.screen.height) / 2
      ]), "mouse"),
      images: context.loaders.images,
      sounds: context.loaders.sounds,
      music: friendlyService(context.music, "music"),
      createBrowserSoundAsset,
      storage: context.storage,
      tone: friendlyService(context.tone, "tone"),
      randomInt,
      randomChoice,
      clamp: clamp2,
      rgb,
      run: runFunction,
      exit: () => context.stop?.(),
      ...context.random ? { Math: mathWithRandom(context.random) } : {}
    };
    const scopeTarget = { ...globals };
    function configuredSize(name, fallback) {
      const value = scopeTarget[name];
      return typeof value === "number" && value > 0 ? value : fallback;
    }
    const optionalNames = new Set([
      ...RUNTIME_CONFIGURATION_NAMES,
      ...RUNTIME_SOURCE_HOOK_NAMES,
      ...bindingNames,
      ...callableNames,
      ...typeofOperands(source)
    ]);
    const scope = new Proxy(scopeTarget, {
      has(_target, property) {
        return property !== Symbol.unscopables;
      },
      get(target, property) {
        if (property === Symbol.unscopables)
          return;
        if (typeof property !== "string")
          return;
        if (property in target)
          return target[property];
        if (property in builtinGlobals)
          return builtinGlobals[property];
        if (optionalNames.has(property))
          return;
        throw undefinedNameError(property, source, target);
      },
      set(target, property, value) {
        if (typeof property === "string")
          target[property] = value;
        return true;
      }
    });
    let factory;
    try {
      factory = new Function("scope", wrapSource(source, String(sourceResultFields), [
        ...bindingNames,
        ...callableNames
      ]));
    } catch (error) {
      if (error instanceof SyntaxError && sourceLineOf(error) === undefined) {
        const line = syntaxErrorLine(source, error.message);
        if (line !== undefined)
          syntaxLines.set(error, line);
      }
      throw error;
    }
    const evaluated = factory(scope);
    const bindings = Object.freeze([...bindingNames]);
    const callables = Object.freeze(callableNames);
    return {
      module: evaluated.module,
      inspector: {
        bindings: () => bindings,
        functions: () => callables,
        read(name) {
          if (!bindings.includes(name) && !callables.includes(name)) {
            throw new TypeError(`Unknown game-state binding: ${name}`);
          }
          return evaluated.readers[name]?.();
        }
      }
    };
  }
  function typeofOperands(source) {
    const tokens = tokenizeSource(source) ?? [];
    const operands = [];
    tokens.forEach((token, index) => {
      const next = tokens[index + 1];
      if (token.value === "typeof" && next?.type === "identifier") {
        operands.push(next.value);
      }
    });
    return operands;
  }
  function undefinedNameError(name, source, scope) {
    const hint = unavailableGlobalHints[name];
    if (hint !== undefined) {
      return new ReferenceError(`${name} isn't available in js-game-zero games. ${hint}`);
    }
    const tokens = tokenizeSource(source) ?? [];
    const sourceNames = tokens.filter((token, index) => token.type === "identifier" && tokens[index - 1]?.value !== ".").map((token) => token.value);
    const candidates = new Set([
      ...Object.keys(scope),
      ...Object.keys(builtinGlobals),
      ...sourceNames
    ]);
    const error = new ReferenceError(`${name} is not defined.${didYouMean(name, candidates)}`);
    const line = onlyLineOf(name, source);
    if (line !== undefined)
      nameLines.set(error, line);
    return error;
  }
  function onlyLineOf(name, source) {
    const escaped = name.replace(/[$]/g, "\\$");
    const read = new RegExp(`(^|[^\\w$.])${escaped}(?![\\w$])`);
    const lines = source.split(`
`).map((line) => line.replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, '""').replace(/\/\/.*$/, ""));
    const found = lines.flatMap((line, i) => read.test(line) ? [i + 1] : []);
    return found.length === 1 ? found[0] : undefined;
  }
  function wrapSource(source, resultFields, bindingNames = []) {
    const readerFields = bindingNames.map((name) => `${JSON.stringify(name)}: () => ${name}`).join(`,
`);
    return `return (function() {
      with (scope) {
        ${source}
        return {
          module: { ${resultFields} },
          readers: { ${readerFields} }
        };
      };
    })();`;
  }
  var calibration;
  var FRAME_RE = /([^\s()]+):(\d+):(\d+)\)?\s*$/;
  function frames(stack) {
    const out = [];
    for (const raw of stack.split(`
`)) {
      const match = FRAME_RE.exec(raw);
      if (match)
        out.push({ file: match[1], line: Number(match[2]) });
    }
    return out;
  }
  var ownLine = (error) => {
    const { line, sourceURL } = error;
    return {
      line: typeof line === "number" ? line : undefined,
      url: typeof sourceURL === "string" ? sourceURL : undefined
    };
  };
  function readCalibration(error) {
    if (!(error instanceof Error) || !error.stack)
      return null;
    const lines = error.stack.split(`
`);
    const throwing = lines[0]?.startsWith(String(error)) ? lines[1] : lines[0];
    const match = throwing ? FRAME_RE.exec(throwing) : null;
    if (match) {
      const line = Number(match[2]);
      return line >= 1 ? { kind: "stack", marker: match[1], offset: line - 1 } : null;
    }
    const own = ownLine(error);
    return own.line !== undefined && own.line >= 1 ? { kind: "line", offset: own.line - 1, url: own.url } : null;
  }
  function calibrateFrames() {
    try {
      const factory = new Function("scope", wrapSource('throw new Error("calibrate");', "", []));
      factory({});
    } catch (error) {
      return readCalibration(error);
    }
    return null;
  }
  function lineWith(calibration2, error) {
    if (!(error instanceof Error) || !error.stack)
      return;
    let line;
    if (calibration2.kind === "stack") {
      const frame = frames(error.stack).find((candidate) => candidate.file === calibration2.marker);
      line = frame && frame.line - calibration2.offset;
    } else {
      const own = ownLine(error);
      if (own.line !== undefined && own.url === calibration2.url)
        line = own.line - calibration2.offset;
    }
    return line !== undefined && line >= 1 ? line : undefined;
  }
  var syntaxLines = new WeakMap;
  var nameLines = new WeakMap;
  var AT_END = /end of (input|script)/i;
  function compileProblem(source) {
    try {
      new Function("scope", source);
      return;
    } catch (error) {
      return error instanceof SyntaxError ? error.message : undefined;
    }
  }
  function syntaxErrorLine(source, message) {
    const lines = source.split(`
`);
    const atEnd = AT_END.test(message);
    let compiles = 0;
    for (let k = 1;k <= lines.length; k += 1) {
      const problem = compileProblem(lines.slice(0, k).join(`
`));
      if (problem === undefined)
        compiles = k;
      else if (!atEnd && problem === message)
        return k;
    }
    return atEnd && compiles < lines.length ? compiles + 1 : undefined;
  }
  function sourceLineOf(error) {
    const known = typeof error === "object" && error ? syntaxLines.get(error) : undefined;
    if (known !== undefined)
      return known;
    calibration ??= calibrateFrames();
    const line = calibration ? lineWith(calibration, error) : undefined;
    return line ?? (typeof error === "object" && error ? nameLines.get(error) : undefined);
  }

  // packages/core/src/runtime.ts
  var definedGameBrand = Symbol("js-game-zero.defined-game");
  function defineGame(factory) {
    if (typeof factory !== "function") {
      throw new TypeError("defineGame requires a game factory function.");
    }
    return { [definedGameBrand]: true, create: factory };
  }
  var activeHandles = [];
  var gameInspectors = new WeakMap;
  function getSourceInspector(handle) {
    return gameInspectors.get(handle) ?? null;
  }
  function run(moduleOrSource, options = {}) {
    const diagnostics = [];
    const emit = createDiagnosticEmitter(diagnostics, options.diagnostics);
    const mode = typeof moduleOrSource === "string" ? "global" : "import";
    let module;
    let inspector = null;
    let context;
    let game;
    let touchControls = null;
    try {
      if (mode === "global") {
        context = createRuntimeContext(options, diagnostics, emit, undefined);
        const evaluated = withRuntimeContext(context, () => executeZeroBoilerplateSource(String(moduleOrSource), context, run, emit));
        module = evaluated.module;
        inspector = evaluated.inspector;
      } else if (isDefinedGame(moduleOrSource)) {
        context = createRuntimeContext(options, diagnostics, emit, undefined);
        module = withRuntimeContext(context, () => adaptDefinedGame(moduleOrSource.create(createGameContext(context))));
      } else {
        module = moduleOrSource;
        context = createRuntimeContext(options, diagnostics, emit, module);
      }
      diagnoseGameModule(module, options, emit, mode);
      game = mergeModuleOptions(module, options);
      requireDrawArity(game.draw);
      applyCanvasConfiguration(context, game, emit);
      configureDocumentTitle(game);
      applyFavicon(context, game.ICON, emit);
      touchControls = normalizeTouchControls(game.TOUCH_CONTROLS);
    } catch (error) {
      const line = sourceLineOf(error);
      emit({
        code: "runtime-error",
        severity: "error",
        phase: "startup",
        recoverable: false,
        message: `startup failed: ${describeRuntimeError(error)}`,
        ...line !== undefined ? { line } : {}
      });
      cleanupFailedStartup(context, emit);
      throw error;
    }
    let stopped = false;
    let paused = false;
    let frameHandle = null;
    let lastTimestamp = null;
    let state = "starting";
    let failure = null;
    let detachInput = () => {};
    let cleanupPromise = null;
    let resolveDone = () => {};
    const done = new Promise((resolve) => {
      resolveDone = resolve;
    });
    let handle;
    const removeActiveHandle = () => {
      const index = activeHandles.indexOf(handle);
      if (index >= 0)
        activeHandles.splice(index, 1);
      setScreen(activeHandles.at(-1)?.screen ?? null);
    };
    const dispose = () => {
      if (cleanupPromise)
        return cleanupPromise;
      stopped = true;
      paused = false;
      if (state !== "failed")
        state = "stopped";
      detachInput();
      context.scheduler.cancelAnimationFrame(frameHandle);
      context.keyboard.clear();
      context.clock.clear();
      context.music.stop();
      context.stop = null;
      context.autosave.detach();
      if (state !== "failed")
        gameInspectors.delete(handle);
      removeActiveHandle();
      if (context.ownsCanvas)
        context.canvas.remove?.();
      cleanupPromise = Promise.resolve(context.autosave.flush()).catch((error) => {
        emit({
          code: "runtime-error",
          severity: "warning",
          phase: "storage",
          recoverable: true,
          message: `Failed to flush storage while stopping: ${describeRuntimeError(error)}`
        });
      }).then(() => {
        resolveDone();
      });
      return cleanupPromise;
    };
    const failRuntime = (phase, error) => {
      if (state === "failed" || state === "stopped")
        return;
      const line = sourceLineOf(error);
      failure = {
        phase,
        message: describeRuntimeError(error),
        cause: error,
        ...line !== undefined ? { line } : {}
      };
      state = "failed";
      emit({
        code: "runtime-error",
        severity: "error",
        phase,
        recoverable: false,
        message: `${phase} failed: ${describeRuntimeError(error)}`,
        ...line !== undefined ? { line } : {}
      });
      dispose();
    };
    const hooks = game;
    const dispatcher = createInputDispatcher(hooks, context.keyboard, context.mouseState);
    detachInput = attachDispatcher(dispatcher, context, context.canvas, options, (error) => failRuntime("input", error), touchControls);
    const musicEndHook = hooks.onMusicEnd;
    context.music.setOnMusicEnd(musicEndHook ? () => {
      try {
        withRuntimeContext(context, () => musicEndHook());
      } catch (error) {
        failRuntime("audio", error);
      }
    } : undefined);
    const ready = waitForPreloadGate(context).then(() => {
      if (state === "starting")
        state = "running";
    }).catch((error) => {
      failRuntime("startup", error);
      throw error;
    });
    ready.catch(() => {});
    handle = {
      mode,
      canvas: context.canvas,
      screen: context.screen,
      clock: context.clock,
      keyboard: context.keyboard,
      loaders: context.loaders,
      storage: context.storage,
      diagnostics,
      module: game,
      get state() {
        return state;
      },
      get failure() {
        return failure;
      },
      ready,
      done,
      pause() {
        if (stopped || state === "failed")
          return;
        paused = true;
        state = "paused";
      },
      resume() {
        if (stopped)
          return;
        paused = false;
        state = "running";
      },
      step(dt) {
        if (stopped || paused)
          return;
        if (isRuntimeGated(context)) {
          if (state !== "starting")
            monitorLateAssetGate(context, failRuntime);
          return;
        }
        runFrame(game, context, dt, failRuntime);
      },
      stop() {
        dispose();
      },
      dispose,
      async restart(nextSource = moduleOrSource) {
        await dispose();
        return run(nextSource, options);
      },
      reload(nextSource = moduleOrSource) {
        handle.stop();
        return run(nextSource, options);
      }
    };
    context.stop = () => handle.stop();
    if (inspector)
      gameInspectors.set(handle, inspector);
    activeHandles.push(handle);
    setScreen(context.screen);
    if (options.autostart !== false) {
      const frame = (timestamp) => {
        if (stopped)
          return;
        const previous = lastTimestamp ?? timestamp;
        lastTimestamp = timestamp;
        if (!paused) {
          if (isRuntimeGated(context)) {
            if (state !== "starting")
              monitorLateAssetGate(context, failRuntime);
          } else {
            const dt = Math.min(0.25, Math.max(0, (timestamp - previous) / 1000));
            runFrame(game, context, dt, failRuntime);
          }
        }
        if (!stopped) {
          frameHandle = context.scheduler.requestAnimationFrame(frame);
        }
      };
      frameHandle = context.scheduler.requestAnimationFrame(frame);
    }
    return handle;
  }
  function exit() {
    activeHandles.at(-1)?.stop();
  }
  function createRuntimeContext(options, diagnostics, emit, module) {
    const random2 = options.seed === undefined ? null : createSeededRandom(options.seed);
    const ownsCanvas = options.canvas === undefined;
    const canvas = options.canvas ?? createCanvas(options.container);
    const adoptsDefaultLoaders = activeHandles.length === 0;
    try {
      const scheduler = options.scheduler ?? createDefaultScheduler();
      const defaultLoaders = createAssetLoaders({
        projectId: options.projectId ?? "default",
        assetBaseUrl: options.assetBaseUrl ?? "/assets",
        ...options.assetUrls ? { assetUrls: options.assetUrls } : {}
      });
      const loaders = {
        images: options.loaders?.images ?? defaultLoaders.images,
        sounds: options.loaders?.sounds ?? defaultLoaders.sounds,
        music: options.loaders?.music ?? defaultLoaders.music,
        fonts: options.loaders?.fonts ?? defaultLoaders.fonts
      };
      const screen2 = new Screen(canvas, canvas.getContext("2d"), {
        imageLoader: loaders.images
      });
      definePreloadedAssets(loaders, options.preloadedAssets);
      preloadAssets(loaders, options.preload, emit);
      const keyboard2 = new KeyboardState;
      const mouseState = new MouseState;
      const liveMouse = createLiveMouse(mouseState, () => [
        screen2.width / 2,
        screen2.height / 2
      ]);
      const clockFailure = { current: null };
      const clock2 = new Clock({
        onError(error) {
          clockFailure.current ??= error;
        }
      });
      const storage2 = resolveStorage(options);
      const { state: storageReadyState, promise: storageReady } = primeStorage(storage2, emit);
      const autosave = attachAutosave(storage2, emit);
      const onMusicEnd = module?.onMusicEnd;
      const music2 = createMusicPlayer({
        loader: loaders.music,
        ...onMusicEnd ? { onMusicEnd } : {},
        onError(error) {
          emit({
            code: "runtime-error",
            severity: "warning",
            phase: "audio",
            recoverable: true,
            message: `Music playback failed: ${describeRuntimeError(error)}`
          });
        }
      });
      const scopedTone = createToneGenerator({
        unlockState: new AudioUnlockState
      });
      return {
        canvas,
        ownsCanvas,
        screen: screen2,
        clock: clock2,
        clockFailure,
        keyboard: keyboard2,
        mouseState,
        mouse: liveMouse,
        loaders,
        music: music2,
        tone: scopedTone,
        storage: storage2,
        scheduler,
        storageReadyState,
        storageReady,
        autosave,
        emit,
        adoptsDefaultLoaders,
        random: random2,
        assetGate: null,
        audioAssetGate: null,
        stop: null
      };
    } catch (error) {
      if (ownsCanvas)
        canvas.remove?.();
      throw error;
    }
  }
  function cleanupFailedStartup(context, emit) {
    if (!context)
      return;
    context.autosave.detach();
    context.keyboard.clear();
    context.clock.clear();
    context.music.stop();
    if (context.ownsCanvas)
      context.canvas.remove?.();
    setScreen(activeHandles.at(-1)?.screen ?? null);
    context.autosave.flush().catch((flushError) => {
      emit({
        code: "runtime-error",
        severity: "warning",
        phase: "storage",
        recoverable: true,
        message: `Failed to flush storage after startup failure: ${describeRuntimeError(flushError)}`
      });
    });
  }
  function isDefinedGame(value) {
    return typeof value === "object" && value !== null && definedGameBrand in value && value[definedGameBrand] === true && typeof value.create === "function";
  }
  function createGameContext(context) {

    class ScopedActor extends Actor {
      constructor(image, pos, options = {}) {
        super(image, pos, {
          ...options,
          screen: context.screen,
          loader: context.loaders.images,
          clock: context.clock
        });
      }
    }
    const scopedAnimate = (object, options) => withAnimationClock(context.clock, () => animate(object, options));
    return {
      Actor: ScopedActor,
      Animation,
      Rect,
      ZRect,
      Screen,
      Storage,
      screen: context.screen,
      clock: context.clock,
      keyboard: context.keyboard,
      keymods,
      keys,
      mouse: context.mouse,
      images: context.loaders.images,
      sounds: context.loaders.sounds,
      music: context.music,
      fonts: context.loaders.fonts,
      storage: context.storage,
      tone: context.tone,
      animate: scopedAnimate,
      exit: () => context.stop?.()
    };
  }
  function adaptDefinedGame(module) {
    const adapted = {
      ...module.WIDTH === undefined ? {} : { WIDTH: module.WIDTH },
      ...module.HEIGHT === undefined ? {} : { HEIGHT: module.HEIGHT },
      ...module.PIXEL_DENSITY === undefined ? {} : { PIXEL_DENSITY: module.PIXEL_DENSITY },
      ...module.TITLE === undefined ? {} : { TITLE: module.TITLE },
      ...module.ICON === undefined ? {} : { ICON: module.ICON },
      ...module.TOUCH_CONTROLS === undefined ? {} : { TOUCH_CONTROLS: module.TOUCH_CONTROLS },
      ...module.draw ? { draw: module.draw } : {},
      ...module.update ? { update: module.update } : {}
    };
    const writable = adapted;
    for (const name of INPUT_HOOK_NAMES) {
      const callback = module[name];
      if (!callback)
        continue;
      if (name === "onMusicEnd") {
        writable[name] = callback;
        continue;
      }
      const eventCallback = callback;
      writable[name] = (event) => {
        eventCallback(event);
      };
    }
    return adapted;
  }
  function mergeModuleOptions(module, options) {
    const merged = { ...module };
    for (const key of RUNTIME_MODULE_OPTION_NAMES) {
      if (options[key] !== undefined) {
        merged[key] = options[key];
      }
    }
    return merged;
  }
  function runFrame(module, context, dt, onFailure) {
    try {
      syncScreenDensity(module, context);
      withRuntimeContext(context, () => {
        try {
          context.clock.tick(dt);
        } catch (error) {
          onFailure("clock", error);
          return;
        }
        if (context.clockFailure.current !== null) {
          const error = context.clockFailure.current;
          context.clockFailure.current = null;
          onFailure("clock", error);
          return;
        }
        if (module.update) {
          try {
            const parameters = getParameterNames(module.update);
            if (parameters.length === 0)
              module.update();
            else
              module.update(dt);
          } catch (error) {
            onFailure("update", error);
            return;
          }
        }
        monitorAudioAssetGate(context);
        if (isRuntimeGated(context)) {
          monitorLateAssetGate(context, onFailure);
          return;
        }
        try {
          beginDrawn(context.screen);
          module.draw?.();
        } catch (error) {
          onFailure("draw", error);
        }
      });
    } catch (error) {
      onFailure("draw", error);
    }
  }
  function isRuntimeGated(context) {
    if (!context.storageReadyState.current)
      return true;
    let pending = context.loaders.images.pendingCount() + context.loaders.fonts.pendingCount();
    if (context.adoptsDefaultLoaders) {
      pending += defaultAssetLoaders.images.pendingCount() + defaultAssetLoaders.fonts.pendingCount();
    }
    return pending > 0;
  }
  function waitForPreloadGate(context) {
    const waits = [
      context.storageReady,
      context.loaders.images.waitForIdle(),
      context.loaders.fonts.waitForIdle()
    ];
    if (context.adoptsDefaultLoaders) {
      waits.push(defaultAssetLoaders.images.waitForIdle(), defaultAssetLoaders.fonts.waitForIdle());
    }
    return Promise.all(waits).then(() => {
      return;
    });
  }
  function monitorLateAssetGate(context, onFailure) {
    if (context.assetGate)
      return;
    const waits = [
      context.loaders.images.waitForIdle(),
      context.loaders.fonts.waitForIdle()
    ];
    if (context.adoptsDefaultLoaders) {
      waits.push(defaultAssetLoaders.images.waitForIdle(), defaultAssetLoaders.fonts.waitForIdle());
    }
    const gate = Promise.all(waits).then(() => {
      return;
    });
    context.assetGate = gate;
    gate.catch((error) => onFailure("asset", error)).finally(() => {
      if (context.assetGate === gate)
        context.assetGate = null;
    });
  }
  function monitorAudioAssetGate(context) {
    if (context.audioAssetGate)
      return;
    const waits = [
      context.loaders.sounds.waitForIdle(),
      context.loaders.music.waitForIdle()
    ];
    if (context.adoptsDefaultLoaders) {
      waits.push(defaultAssetLoaders.sounds.waitForIdle(), defaultAssetLoaders.music.waitForIdle());
    }
    const gate = Promise.all(waits).then(() => {
      return;
    });
    context.audioAssetGate = gate;
    gate.catch((error) => {
      context.emit({
        code: "runtime-error",
        severity: "warning",
        phase: "asset",
        recoverable: true,
        message: `Sound/music asset failed to load: ${describeRuntimeError(error)}`
      });
    }).finally(() => {
      if (context.audioAssetGate === gate)
        context.audioAssetGate = null;
    });
  }
  function requireDrawArity(hook) {
    if (!hook)
      return;
    if (getParameterNames(hook).length > 0) {
      throw new TypeError("draw() must not take any arguments.");
    }
  }
  function applyFavicon(context, icon, emit) {
    if (!icon || typeof document === "undefined")
      return;
    try {
      validateAssetName("image", icon, context.loaders.images.extensions);
    } catch (error) {
      emit({
        code: "invalid-config",
        severity: "warning",
        name: "ICON",
        message: `ICON is not a usable image asset name: ${describeRuntimeError(error)}`
      });
      return;
    }
    const href = locateAsset(context.loaders.images, icon);
    if (href === undefined)
      return;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head?.append(link);
    }
    link.href = href;
  }
  function applyCanvasConfiguration(context, module, emit) {
    const width = readDimension(module.WIDTH, 800, "WIDTH", emit);
    const height = readDimension(module.HEIGHT, 600, "HEIGHT", emit);
    const density = resolvePixelDensity(module.PIXEL_DENSITY, width, height, devicePixelRatioOf(context.canvas), emit);
    resizeScreen(context.screen, width, height, density);
  }
  function syncScreenDensity(module, context) {
    const { screen: screen2 } = context;
    syncScreen(screen2);
    if (module.PIXEL_DENSITY !== undefined)
      return;
    const density = resolvePixelDensity(undefined, screen2.width, screen2.height, devicePixelRatioOf(context.canvas), context.emit);
    if (density !== screen2.density) {
      resizeScreen(screen2, screen2.width, screen2.height, density);
    }
  }
  function configureDocumentTitle(module) {
    if (module.TITLE === undefined || typeof document === "undefined")
      return;
    document.title = String(module.TITLE);
  }
  function readDimension(value, fallback, name, emit) {
    if (value === undefined)
      return fallback;
    if (isValidRuntimeDimension(value))
      return Math.floor(value);
    emit({
      code: "invalid-config",
      severity: "warning",
      name,
      message: `${name} should be a positive finite number; using ${fallback}.`
    });
    return fallback;
  }
  function attachDispatcher(dispatcher, context, canvas, options, onFailure, touchControls) {
    const keyboardTarget = options.keyboardTarget ?? (typeof window === "undefined" ? undefined : window) ?? canvas;
    if (typeof canvas.addEventListener !== "function" || typeof keyboardTarget?.addEventListener !== "function") {
      return () => {};
    }
    const invoke = (callback) => {
      try {
        withRuntimeContext(context, callback);
      } catch (error) {
        onFailure(error);
      }
    };
    const { screen: screen2 } = context;
    const pointer = {
      get width() {
        return screen2.width;
      },
      get height() {
        return screen2.height;
      },
      ...typeof canvas.getBoundingClientRect === "function" ? { getBoundingClientRect: () => canvas.getBoundingClientRect() } : {}
    };
    const keyDown = (event) => invoke(() => void dispatcher.handleKeyDown(event));
    const keyUp = (event) => invoke(() => void dispatcher.handleKeyUp(event));
    const mouseDown = (event) => invoke(() => void dispatcher.handleMouseDown(event, pointer));
    const mouseUp = (event) => invoke(() => void dispatcher.handleMouseUp(event, pointer));
    const mouseMove = (event) => invoke(() => void dispatcher.handleMouseMove(event, pointer));
    const wheel = (event) => invoke(() => void dispatcher.handleWheel(event, pointer));
    const controls = mountTouchControls(canvas, touchControls, dispatcher, invoke, pointer);
    const touchPointer = attachTouchPointer(canvas, dispatcher, invoke, pointer);
    const clearKeyboard = () => {
      controls.reset();
      touchPointer.reset();
      dispatcher.handleFocusLoss();
    };
    const visibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        clearKeyboard();
      }
    };
    const mouseReleaseTargets = new Set;
    if (options.mouseReleaseTarget) {
      mouseReleaseTargets.add(options.mouseReleaseTarget);
    } else if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      mouseReleaseTargets.add(window);
    } else {
      mouseReleaseTargets.add(canvas);
      if (typeof keyboardTarget.addEventListener === "function") {
        mouseReleaseTargets.add(keyboardTarget);
      }
    }
    keyboardTarget.addEventListener("keydown", keyDown);
    keyboardTarget.addEventListener("keyup", keyUp);
    keyboardTarget.addEventListener("blur", clearKeyboard);
    if (typeof window !== "undefined" && keyboardTarget !== window) {
      window.addEventListener("blur", clearKeyboard);
    }
    canvas.addEventListener("mousedown", mouseDown);
    for (const target of mouseReleaseTargets) {
      target.addEventListener("mouseup", mouseUp);
    }
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("wheel", wheel, { passive: true });
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", visibilityChange);
    }
    return () => {
      controls.detach();
      touchPointer.detach();
      keyboardTarget.removeEventListener("keydown", keyDown);
      keyboardTarget.removeEventListener("keyup", keyUp);
      keyboardTarget.removeEventListener("blur", clearKeyboard);
      if (typeof window !== "undefined" && keyboardTarget !== window) {
        window.removeEventListener("blur", clearKeyboard);
      }
      canvas.removeEventListener("mousedown", mouseDown);
      for (const target of mouseReleaseTargets) {
        target.removeEventListener("mouseup", mouseUp);
      }
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("wheel", wheel);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", visibilityChange);
      }
    };
  }
  function withRuntimeContext(context, callback) {
    const previousAssets = setActiveAssetLoaders(context.loaders);
    const previousKeyboard = setActiveKeyboard(context.keyboard);
    const previousClock = setActiveClock(context.clock);
    const previousMusic = setActiveMusicPlayer(context.music);
    const previousStorage = setActiveStorage(context.storage);
    const previousScreen = setScreen(context.screen);
    const previousDiagnosticEmit = setActiveDiagnosticEmit(context.emit);
    const previousRandom = setActiveRandom(context.random);
    try {
      return withAnimationClock(context.clock, callback);
    } finally {
      setActiveRandom(previousRandom);
      setActiveDiagnosticEmit(previousDiagnosticEmit);
      setScreen(previousScreen);
      setActiveStorage(previousStorage);
      setActiveMusicPlayer(previousMusic);
      setActiveClock(previousClock);
      setActiveKeyboard(previousKeyboard);
      setActiveAssetLoaders(previousAssets);
    }
  }
  function resolveStorage(options) {
    const requestedStorage = isActiveServiceProxy(options.storage) ? undefined : options.storage;
    if (!requestedStorage) {
      try {
        return createStorage({
          adapter: createLocalStorageAdapter({
            projectId: options.projectId ?? "default"
          })
        });
      } catch {
        return createStorage();
      }
    }
    if (requestedStorage instanceof Storage)
      return requestedStorage;
    if ("load" in requestedStorage && "save" in requestedStorage && "path" in requestedStorage) {
      return createStorage({ adapter: requestedStorage });
    }
    return requestedStorage;
  }
  function preloadAssets(loaders, assets = [], emit) {
    for (const asset of assets) {
      const [directory, ...rest] = asset.split("/");
      const name = rest.join("/");
      if (!directory || !name)
        continue;
      if (directory === "images")
        loaders.images.load(name);
      else if (directory === "sounds" || directory === "music") {
        const loader = directory === "sounds" ? loaders.sounds : loaders.music;
        loader.load(name).catch((error) => {
          emit?.({
            code: "runtime-error",
            severity: "warning",
            phase: "audio",
            recoverable: true,
            message: `Failed to preload ${directory}/${name}: ${describeRuntimeError(error)}`
          });
        });
      } else if (directory === "fonts")
        loaders.fonts.load(name);
    }
  }
  function definePreloadedAssets(loaders, assets) {
    if (!assets)
      return;
    for (const [name, asset] of Object.entries(assets.images ?? {})) {
      loaders.images.define(name, asset);
    }
    for (const [name, asset] of Object.entries(assets.sounds ?? {})) {
      loaders.sounds.define(name, asset);
    }
    for (const [name, asset] of Object.entries(assets.music ?? {})) {
      loaders.music.define(name, asset);
    }
    for (const [name, asset] of Object.entries(assets.fonts ?? {})) {
      loaders.fonts.define(name, asset);
    }
  }
  function createCanvas(container) {
    if (typeof document === "undefined") {
      throw new Error("run requires a canvas option outside the browser.");
    }
    const canvas = document.createElement("canvas");
    canvas.tabIndex = 0;
    (container ?? document.body).append(canvas);
    return canvas;
  }
  function createDefaultScheduler() {
    return {
      requestAnimationFrame(callback) {
        if (typeof requestAnimationFrame === "function") {
          return requestAnimationFrame(callback);
        }
        return setTimeout(() => callback(performance.now()), 16);
      },
      cancelAnimationFrame(handle) {
        if (handle === null || handle === undefined)
          return;
        if (typeof cancelAnimationFrame === "function" && typeof handle === "number") {
          cancelAnimationFrame(handle);
          return;
        }
        clearTimeout(handle);
      },
      now() {
        return performance.now();
      }
    };
  }

  // packages/core/src/inspection.ts
  var MAX_DEPTH = 6;
  var MAX_COLLECTION_SIZE = 100;
  var MAX_STRING_LENGTH = 1e4;
  function serializeGameValue(value) {
    return serialize(value, 0, new WeakSet);
  }
  function serialize(value, depth, ancestors) {
    if (value === null || typeof value === "boolean")
      return value;
    if (typeof value === "string") {
      return value.length <= MAX_STRING_LENGTH ? value : `${value.slice(0, MAX_STRING_LENGTH)}…`;
    }
    if (typeof value === "number") {
      if (Number.isNaN(value))
        return tagged("Number", { value: "NaN" });
      if (value === Infinity)
        return tagged("Number", { value: "Infinity" });
      if (value === -Infinity)
        return tagged("Number", { value: "-Infinity" });
      if (Object.is(value, -0))
        return tagged("Number", { value: "-0" });
      return value;
    }
    if (value === undefined)
      return tagged("Undefined");
    if (typeof value === "bigint") {
      return tagged("BigInt", { value: String(value) });
    }
    if (typeof value === "symbol") {
      return tagged("Symbol", { value: value.description ?? "" });
    }
    if (typeof value === "function") {
      return tagged("Function", { name: value.name || "anonymous" });
    }
    if (depth >= MAX_DEPTH)
      return tagged("Truncated", { reason: "depth" });
    if (ancestors.has(value))
      return tagged("Circular");
    ancestors.add(value);
    try {
      if (value instanceof Actor)
        return serializeActor(value, depth, ancestors);
      if (value instanceof ZRect)
        return serializeRect(value, "ZRect");
      if (value instanceof Rect)
        return serializeRect(value, "Rect");
      if (value instanceof Date) {
        return tagged("Date", {
          value: Number.isNaN(value.getTime()) ? "Invalid Date" : value.toISOString()
        });
      }
      if (value instanceof Error) {
        return tagged("Error", { name: value.name, message: value.message });
      }
      if (Array.isArray(value)) {
        const items = value.slice(0, MAX_COLLECTION_SIZE).map((item) => serialize(item, depth + 1, ancestors));
        if (value.length > MAX_COLLECTION_SIZE) {
          items.push(tagged("Truncated", {
            reason: "collection",
            omitted: value.length - MAX_COLLECTION_SIZE
          }));
        }
        return items;
      }
      if (value instanceof Set) {
        return tagged("Set", {
          values: serializeCollection([...value], depth, ancestors),
          size: value.size
        });
      }
      if (value instanceof Map) {
        const entries = [...value.entries()].slice(0, MAX_COLLECTION_SIZE).map(([key, item]) => [
          serialize(key, depth + 1, ancestors),
          serialize(item, depth + 1, ancestors)
        ]);
        return tagged("Map", {
          entries,
          size: value.size,
          ...value.size > MAX_COLLECTION_SIZE ? { omitted: value.size - MAX_COLLECTION_SIZE } : {}
        });
      }
      return serializeObject(value, depth, ancestors);
    } finally {
      ancestors.delete(value);
    }
  }
  var actorInternalKeys = new Set([
    "loader",
    "screen",
    "_image",
    "_surface",
    "_pos",
    "_anchor",
    "_angle",
    "_opacity",
    "_scale",
    "_native",
    "sizeSource",
    "positionSource",
    "imageLoadPromise",
    "_images",
    "_fps",
    "_loop",
    "animationStart",
    "clockSource"
  ]);
  function serializeActor(actor, depth, ancestors) {
    let rect = null;
    try {
      rect = actor.rect();
    } catch {}
    const properties = {};
    for (const key of Object.keys(actor).sort()) {
      if (actorInternalKeys.has(key))
        continue;
      properties[key] = readProperty(actor, key, depth + 1, ancestors);
    }
    return tagged("Actor", {
      image: actor.image,
      pos: actor.pos,
      x: actor.x,
      y: actor.y,
      width: safeNumber(() => actor.width),
      height: safeNumber(() => actor.height),
      angle: actor.angle,
      opacity: actor.opacity,
      scale: actor.scale,
      anchor: [...actor.anchor],
      rect: rect ? serializeRect(rect, "Rect") : null,
      properties
    });
  }
  function serializeRect(rect, type) {
    return tagged(type, {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      center: [...rect.center]
    });
  }
  function serializeObject(value, depth, ancestors) {
    const output = {};
    const keys2 = Object.keys(value).sort();
    for (const key of keys2.slice(0, MAX_COLLECTION_SIZE)) {
      output[key] = readProperty(value, key, depth + 1, ancestors);
    }
    if (keys2.length > MAX_COLLECTION_SIZE) {
      output.$truncated = tagged("Truncated", {
        reason: "collection",
        omitted: keys2.length - MAX_COLLECTION_SIZE
      });
    }
    const prototype = Object.getPrototypeOf(value);
    const constructorName = prototype?.constructor?.name;
    if (prototype !== Object.prototype && prototype !== null && typeof constructorName === "string" && constructorName !== "Object") {
      return tagged(constructorName || "Object", { properties: output });
    }
    return output;
  }
  function readProperty(value, key, depth, ancestors) {
    try {
      return serialize(Reflect.get(value, key), depth, ancestors);
    } catch (error) {
      return tagged("Unreadable", {
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
  function serializeCollection(values, depth, ancestors) {
    const serialized = values.slice(0, MAX_COLLECTION_SIZE).map((value) => serialize(value, depth + 1, ancestors));
    if (values.length > MAX_COLLECTION_SIZE) {
      serialized.push(tagged("Truncated", {
        reason: "collection",
        omitted: values.length - MAX_COLLECTION_SIZE
      }));
    }
    return serialized;
  }
  function safeNumber(read) {
    try {
      return serializeGameValue(read());
    } catch {
      return tagged("Unavailable");
    }
  }
  function tagged(type, fields = {}) {
    return { $type: type, ...fields };
  }
  var identifier = /^[\p{ID_Start}$_][\p{ID_Continue}$\u200C\u200D]*/u;
  var unsafeProperties = new Set(["__proto__", "prototype", "constructor"]);
  function parseStatePath(source) {
    const invalid = () => {
      throw new TypeError(`Invalid state path: ${JSON.stringify(source)}. Use a binding with .name and [index] after it, such as player.x or fish[0].y.`);
    };
    if (typeof source !== "string")
      invalid();
    const bindingMatch = identifier.exec(source);
    if (!bindingMatch)
      invalid();
    const binding = bindingMatch[0];
    const segments = [];
    let cursor = binding.length;
    while (cursor < source.length) {
      if (source[cursor] === ".") {
        const match = identifier.exec(source.slice(cursor + 1));
        if (!match)
          invalid();
        if (unsafeProperties.has(match[0]))
          invalid();
        segments.push(match[0]);
        cursor += match[0].length + 1;
        continue;
      }
      if (source[cursor] === "[") {
        const end = source.indexOf("]", cursor + 1);
        if (end === -1)
          invalid();
        const raw = source.slice(cursor + 1, end);
        if (!/^\d+$/.test(raw))
          invalid();
        const index = Number(raw);
        if (!Number.isSafeInteger(index))
          invalid();
        segments.push(index);
        cursor = end + 1;
        continue;
      }
      invalid();
    }
    if (unsafeProperties.has(binding))
      invalid();
    return { source, binding, segments };
  }
  var DRAWN = "$drawn";
  function createGameInspector(source, screen2) {
    const read = (path) => {
      const parsed = typeof path === "string" ? parseStatePath(path) : path;
      let value = parsed.binding === DRAWN && screen2 ? drawnOn(screen2) : source.read(parsed.binding);
      for (const segment of parsed.segments) {
        if (value === null || typeof value !== "object" && typeof value !== "function") {
          throw new TypeError(`Cannot read ${parsed.source}: ${String(segment)} has no parent value.`);
        }
        value = Reflect.get(value, segment);
      }
      return value;
    };
    return {
      bindings: () => source.bindings(),
      functions: () => source.functions(),
      read,
      inspect(path) {
        if (path !== undefined)
          return serializeGameValue(read(path));
        const snapshot = {};
        for (const binding of source.bindings()) {
          try {
            snapshot[binding] = serializeGameValue(source.read(binding));
          } catch (error) {
            snapshot[binding] = serializeGameValue(error);
          }
        }
        return snapshot;
      }
    };
  }
  var hostInspectors = new WeakMap;
  function getGameInspector(handle) {
    const source = getSourceInspector(handle);
    if (!source)
      return null;
    let inspector = hostInspectors.get(source);
    if (!inspector) {
      inspector = createGameInspector(source, handle.screen);
      hostInspectors.set(source, inspector);
    }
    return inspector;
  }

  // packages/core/src/host.ts
  var createSeededRandom2 = createSeededRandom;
  var getGameInspector2 = getGameInspector;
  var loadImages2 = loadImages;
  var parseStatePath2 = parseStatePath;
  var serializeGameValue2 = serializeGameValue;

  // packages/browser-runtime/src/index.ts
  var exports_src = {};
  __export(exports_src, {
    validateAssetName: () => validateAssetName2,
    tweens: () => tweens2,
    tweenNames: () => tweenNames2,
    tone: () => tone2,
    storage: () => storage2,
    sounds: () => sounds2,
    setScreen: () => setScreen2,
    screen: () => screen2,
    run: () => run2,
    rgb: () => rgb2,
    randomInt: () => randomInt2,
    randomChoice: () => randomChoice2,
    parseToneFrequency: () => parseToneFrequency2,
    noteToFrequency: () => noteToFrequency2,
    normalizeWaveform: () => normalizeWaveform2,
    normalizeColor: () => normalizeColor2,
    music: () => music2,
    mouse: () => mouse2,
    mapBrowserWheelEvent: () => mapBrowserWheelEvent2,
    mapBrowserMouseEvent: () => mapBrowserMouseEvent2,
    mapBrowserMouseButton: () => mapBrowserMouseButton2,
    mapBrowserKeyEvent: () => mapBrowserKeyEvent2,
    layoutText: () => layoutText2,
    keys: () => keys2,
    keymods: () => keymods2,
    keyboard: () => keyboard2,
    images: () => images2,
    getScreen: () => getScreen2,
    getParameterNames: () => getParameterNames2,
    fonts: () => fonts2,
    fitTextboxFontSize: () => fitTextboxFontSize2,
    exit: () => exit2,
    distanceTo: () => distanceTo2,
    dispatchHook: () => dispatchHook2,
    defineGame: () => defineGame2,
    createToneGenerator: () => createToneGenerator2,
    createStorage: () => createStorage2,
    createSoundLoader: () => createSoundLoader2,
    createMusicPlayer: () => createMusicPlayer2,
    createMusicLoader: () => createMusicLoader2,
    createLocalStorageAdapter: () => createLocalStorageAdapter2,
    createInputDispatcher: () => createInputDispatcher2,
    createImageLoader: () => createImageLoader2,
    createFontLoader: () => createFontLoader2,
    createBrowserSoundAsset: () => createBrowserSoundAsset2,
    createAssetLoaders: () => createAssetLoaders2,
    collectRuntimeDiagnostics: () => collectRuntimeDiagnostics2,
    clock: () => clock2,
    clampVolume: () => clampVolume2,
    clamp: () => clamp3,
    buttonsFromBrowserButtons: () => buttonsFromBrowserButtons2,
    audioUnlock: () => audioUnlock2,
    assetUrl: () => assetUrl2,
    animate: () => animate2,
    angleTo: () => angleTo2,
    ZRect: () => ZRect2,
    ValueError: () => ValueError2,
    ToneGenerator: () => ToneGenerator2,
    Storage: () => Storage2,
    Screen: () => Screen2,
    Rect: () => Rect2,
    MusicPlayer: () => MusicPlayer2,
    MissingAssetError: () => MissingAssetError2,
    KeyboardState: () => KeyboardState2,
    JsonStorageError: () => JsonStorageError2,
    InvalidAssetNameError: () => InvalidAssetNameError2,
    InputDispatcher: () => InputDispatcher2,
    ImageSurface: () => ImageSurface2,
    DEFAULT_TONE_VOLUME: () => DEFAULT_TONE_VOLUME2,
    CreatedTone: () => CreatedTone2,
    Clock: () => Clock3,
    BrowserSoundAsset: () => BrowserSoundAsset2,
    AudioUnlockState: () => AudioUnlockState2,
    Animation: () => Animation2,
    Actor: () => Actor2
  });

  // packages/core/src/index.ts
  var Actor2 = Actor;
  var Animation2 = Animation;
  var ValueError2 = ValueError;
  var animate2 = animate;
  var tweenNames2 = tweenNames;
  var tweens2 = tweens;
  var ImageSurface2 = ImageSurface;
  var InvalidAssetNameError2 = InvalidAssetNameError;
  var MissingAssetError2 = MissingAssetError;
  var fonts2 = fonts;
  var images2 = images;
  var sounds2 = sounds;
  var music2 = music;
  var Clock3 = Clock;
  var clock2 = clock;
  var Rect2 = Rect;
  var ZRect2 = ZRect;
  var angleTo2 = angleTo;
  var distanceTo2 = distanceTo;
  var clamp3 = clamp2;
  var randomChoice2 = randomChoice;
  var randomInt2 = randomInt;
  var KeyboardState2 = KeyboardState;
  var keyboard2 = keyboard;
  var keymods2 = keymods;
  var keys2 = keys;
  var mouse2 = mouse;
  var Screen2 = Screen;
  var screen2 = screen;
  var rgb2 = rgb;
  var defineGame2 = defineGame;
  var exit2 = exit;
  var run2 = run;
  var JsonStorageError2 = JsonStorageError;
  var Storage2 = Storage;
  var storage2 = storage;
  var CreatedTone2 = CreatedTone;
  var DEFAULT_TONE_VOLUME2 = DEFAULT_TONE_VOLUME;
  var tone2 = tone;
  var AudioUnlockState2 = AudioUnlockState;
  var BrowserSoundAsset2 = BrowserSoundAsset;
  var InputDispatcher2 = InputDispatcher;
  var MusicPlayer2 = MusicPlayer;
  var ToneGenerator2 = ToneGenerator;
  var assetUrl2 = assetUrl;
  var audioUnlock2 = audioUnlock;
  var buttonsFromBrowserButtons2 = buttonsFromBrowserButtons;
  var clampVolume2 = clampVolume;
  var collectRuntimeDiagnostics2 = collectRuntimeDiagnostics;
  var createAssetLoaders2 = createAssetLoaders;
  var createBrowserSoundAsset2 = createBrowserSoundAsset;
  var createFontLoader2 = createFontLoader;
  var createImageLoader2 = createImageLoader;
  var createInputDispatcher2 = createInputDispatcher;
  var createLocalStorageAdapter2 = createLocalStorageAdapter;
  var createMusicLoader2 = createMusicLoader;
  var createMusicPlayer2 = createMusicPlayer;
  var createSoundLoader2 = createSoundLoader;
  var createStorage2 = createStorage;
  var createToneGenerator2 = createToneGenerator;
  var dispatchHook2 = dispatchHook;
  var fitTextboxFontSize2 = fitTextboxFontSize;
  var getParameterNames2 = getParameterNames;
  var getScreen2 = getScreen;
  var layoutText2 = layoutText;
  var mapBrowserKeyEvent2 = mapBrowserKeyEvent;
  var mapBrowserMouseButton2 = mapBrowserMouseButton;
  var mapBrowserMouseEvent2 = mapBrowserMouseEvent;
  var mapBrowserWheelEvent2 = mapBrowserWheelEvent;
  var normalizeColor2 = normalizeColor;
  var normalizeWaveform2 = normalizeWaveform;
  var noteToFrequency2 = noteToFrequency;
  var parseToneFrequency2 = parseToneFrequency;
  var setScreen2 = setScreen;
  var validateAssetName2 = validateAssetName;
  // packages/browser-runtime/src/browser.ts
  var host = {
    createSeededRandom: createSeededRandom2,
    getGameInspector: getGameInspector2,
    loadImages: loadImages2,
    parseStatePath: parseStatePath2,
    serializeGameValue: serializeGameValue2
  };
  if (typeof window !== "undefined") {
    window.JGZ = { ...exports_src, ...host };
  }
})();
