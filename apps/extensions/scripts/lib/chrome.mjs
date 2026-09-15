/**
 * Headless Chrome over the DevTools protocol, on Node's built-in WebSocket (no dependencies).
 * One browser connection, one flat session per tab.
 *
 *   const chrome = await launchChrome();
 *   try {
 *     const page = await chrome.newPage();
 *     await page.goto('http://localhost:4173/');
 *     console.log(await page.evaluate(() => document.title));
 *   } finally {
 *     await chrome.close();
 *   }
 *
 * Chrome runs with a throwaway profile. It is killed (with its whole process group) and the
 * profile deleted on close(), on process exit, on SIGINT/SIGTERM, on an uncaught error and after
 * a hard timeout, so a crashed or interrupted script never leaves a browser behind.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const CHROME_PATH =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const COMMAND_TIMEOUT_MS = 30_000;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Turns a function plus JSON-serialisable arguments into an expression for Runtime.evaluate. */
const toExpression = (fnOrExpression, args) =>
  typeof fnOrExpression === 'function'
    ? `(${fnOrExpression})(${args.map((arg) => JSON.stringify(arg)).join(',')})`
    : fnOrExpression;

class Connection {
  #ws;
  #nextId = 0;
  #pending = new Map();
  #listeners = new Set();

  constructor(ws) {
    this.#ws = ws;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id !== undefined) {
        const call = this.#pending.get(msg.id);
        if (!call) return;
        this.#pending.delete(msg.id);
        clearTimeout(call.timer);
        if (msg.error) call.reject(new Error(`${call.method}: ${msg.error.message}`));
        else call.resolve(msg.result);
        return;
      }
      for (const listener of this.#listeners) listener(msg);
    };
    ws.onclose = () => {
      for (const call of this.#pending.values()) {
        clearTimeout(call.timer);
        call.reject(new Error(`${call.method}: browser connection closed`));
      }
      this.#pending.clear();
    };
  }

  send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = ++this.#nextId;
      // A command that never answers (a crashed tab) must not hang the whole run.
      const timer = setTimeout(() => {
        this.#pending.delete(id);
        reject(new Error(`${method}: no answer after ${COMMAND_TIMEOUT_MS / 1000}s`));
      }, COMMAND_TIMEOUT_MS);
      this.#pending.set(id, { resolve, reject, method, timer });
      this.#ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }

  listen(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  close() {
    this.#ws.close();
  }
}

/** One tab, driven through its own flat CDP session. */
export class Page {
  constructor(connection, { targetId, sessionId, browserContextId }) {
    this.connection = connection;
    this.targetId = targetId;
    this.sessionId = sessionId;
    this.browserContextId = browserContextId;
  }

  send(method, params = {}) {
    return this.connection.send(method, params, this.sessionId);
  }

  /** Calls fn(params) for every `method` event of this tab; returns an unsubscribe function. */
  on(method, fn) {
    return this.connection.listen((msg) => {
      if (msg.sessionId === this.sessionId && msg.method === method) fn(msg.params);
    });
  }

  waitForEvent(method, { timeout = COMMAND_TIMEOUT_MS, predicate = () => true } = {}) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off();
        reject(new Error(`Timed out after ${timeout / 1000}s waiting for ${method}`));
      }, timeout);
      const off = this.on(method, (params) => {
        if (!predicate(params)) return;
        clearTimeout(timer);
        off();
        resolve(params);
      });
    });
  }

  /** Runs a function (or expression) in the page and returns its JSON result. */
  async evaluate(fnOrExpression, ...args) {
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression: toExpression(fnOrExpression, args),
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (exceptionDetails) {
      throw new Error(
        `evaluate: ${exceptionDetails.exception?.description ?? exceptionDetails.text}`,
      );
    }
    return result.value;
  }

  /** Re-evaluates until the result is truthy, then returns it. */
  async poll(fnOrExpression, { timeout = 10_000, interval = 100, what = 'a condition' } = {}) {
    const deadline = Date.now() + timeout;
    let last;
    while (Date.now() < deadline) {
      last = await this.evaluate(fnOrExpression).catch((err) => err);
      if (last && !(last instanceof Error)) return last;
      await sleep(interval);
    }
    const detail = last instanceof Error ? ` (last error: ${last.message})` : '';
    throw new Error(`Timed out after ${timeout / 1000}s waiting for ${what}${detail}`);
  }

  /** Navigates and waits for the load event. Returns the navigation's error text, if any. */
  async goto(url, { timeout = 30_000 } = {}) {
    const loaded = this.waitForEvent('Page.loadEventFired', { timeout });
    const { errorText } = await this.send('Page.navigate', { url });
    if (errorText) {
      loaded.catch(() => {});
      return errorText;
    }
    await loaded;
    return null;
  }

  /**
   * Real mouse click at the centre of the first element matching `selector`. A visually hidden
   * input (a styled radio) is clicked through its label, like a person would.
   */
  async click(selector) {
    const point = await this.evaluate((sel) => {
      let el = document.querySelector(sel);
      if (!el) return null;
      const box = el.getBoundingClientRect();
      if ((box.width <= 1 || box.height <= 1) && el.closest('label')) el = el.closest('label');
      el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, selector);
    if (!point) throw new Error(`click: nothing matches ${selector}`);
    await this.clickAt(point.x, point.y);
  }

  async clickAt(x, y) {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await this.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      clickCount: 1,
    });
    await this.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount: 1,
    });
  }

  /** Presses a named key (ArrowDown, Escape, Enter, Tab...) on the focused element. */
  async press(key) {
    const codes = {
      ArrowDown: 40,
      ArrowUp: 38,
      Escape: 27,
      Enter: 13,
      Tab: 9,
      Home: 36,
      End: 35,
    };
    const keyCode = codes[key];
    const base = { key, code: key, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
    await this.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  }

  /** Types text into the focused element like a paste (one input event). */
  async insertText(text) {
    await this.send('Input.insertText', { text });
  }

  /** Grants permissions (e.g. clipboardReadWrite) to `origin` in this tab's profile. */
  async grantPermissions(origin, permissions) {
    await this.connection.send('Browser.grantPermissions', {
      origin,
      permissions,
      browserContextId: this.browserContextId,
    });
  }

  async close() {
    await this.connection.send('Target.closeTarget', { targetId: this.targetId }).catch(() => {});
    await this.connection
      .send('Target.disposeBrowserContext', { browserContextId: this.browserContextId })
      .catch(() => {});
  }
}

/**
 * Starts headless Chrome and connects to it. `hardTimeoutMs` kills everything and exits the
 * process with code 2 if the caller is still running by then.
 */
export async function launchChrome({ args = [], hardTimeoutMs = 10 * 60_000 } = {}) {
  const profile = mkdtempSync(join(tmpdir(), 'senchabot-chrome-'));
  // Its own process group, so cleanup can kill the renderer and GPU helpers along with it.
  const chrome = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-sync',
      '--disable-background-networking',
      '--hide-scrollbars',
      '--mute-audio',
      '--lang=en-US',
      '--force-color-profile=srgb',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      ...args,
      'about:blank',
    ],
    { stdio: 'ignore', detached: true },
  );
  let exited = false;
  const exitedPromise = new Promise((resolve) => {
    chrome.once('exit', () => {
      exited = true;
      resolve();
    });
  });
  chrome.once('error', () => {
    exited = true;
  });

  let cleaned = false;
  let hardStop;
  // Synchronous on purpose: it also runs from the 'exit' event, where async work never finishes.
  const killNow = () => {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(hardStop);
    // The whole group, even after a clean exit, in case a helper outlived the browser.
    if (chrome.pid) {
      try {
        process.kill(-chrome.pid, 'SIGKILL');
      } catch {
        if (!exited) chrome.kill('SIGKILL');
      }
    }
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    process.off('exit', killNow);
    process.off('SIGINT', onSigint);
    process.off('SIGTERM', onSigterm);
    process.off('uncaughtException', onFatal);
    process.off('unhandledRejection', onFatal);
  };
  const onSigint = () => {
    killNow();
    process.exit(130);
  };
  const onSigterm = () => {
    killNow();
    process.exit(143);
  };
  const onFatal = (err) => {
    console.error(err);
    killNow();
    process.exit(1);
  };
  process.on('exit', killNow);
  process.on('SIGINT', onSigint);
  process.on('SIGTERM', onSigterm);
  process.on('uncaughtException', onFatal);
  process.on('unhandledRejection', onFatal);
  hardStop = setTimeout(() => {
    console.error(`\nHard timeout: gave up after ${hardTimeoutMs / 1000}s.`);
    killNow();
    process.exit(2);
  }, hardTimeoutMs);
  hardStop.unref();

  // Chrome writes the port it picked (and the browser endpoint path) into the profile.
  const portFile = join(profile, 'DevToolsActivePort');
  let endpoint;
  for (let i = 0; i < 150 && !endpoint; i++) {
    if (exited) break;
    if (existsSync(portFile)) {
      const [port, path] = readFileSync(portFile, 'utf8').split('\n');
      if (port && path) endpoint = `ws://127.0.0.1:${port}${path}`;
    }
    if (!endpoint) await sleep(100);
  }
  if (!endpoint) {
    killNow();
    throw new Error(`Chrome did not start (${CHROME_PATH}). Set CHROME_PATH to another binary.`);
  }

  const ws = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error(`Could not connect to Chrome at ${endpoint}`));
  }).catch((err) => {
    killNow();
    throw err;
  });
  const connection = new Connection(ws);

  return {
    connection,
    profile,
    pid: chrome.pid,
    /**
     * Opens a tab in a fresh incognito-like context (its own storage and permissions, so tabs
     * running side by side never share localStorage) and in its own window, so it renders as the
     * visible, focused tab.
     */
    async newPage() {
      const { browserContextId } = await connection.send('Target.createBrowserContext');
      const { targetId } = await connection.send('Target.createTarget', {
        url: 'about:blank',
        browserContextId,
        newWindow: true,
      });
      const { sessionId } = await connection.send('Target.attachToTarget', {
        targetId,
        flatten: true,
      });
      return new Page(connection, { targetId, sessionId, browserContextId });
    },
    /** Closes Chrome politely, then makes sure it and its profile are gone. */
    async close() {
      if (cleaned) return;
      await Promise.race([connection.send('Browser.close').catch(() => {}), sleep(2000)]);
      await Promise.race([exitedPromise, sleep(3000)]);
      connection.close();
      killNow();
    },
  };
}
