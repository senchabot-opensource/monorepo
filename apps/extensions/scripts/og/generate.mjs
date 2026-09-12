#!/usr/bin/env node
/**
 * Renders the Open Graph cards (public/og/*.png) and app icons (public/*.png) with headless
 * Chrome. Overlay visuals are real screenshots of the widget demos, so a running build is needed.
 *
 *   node scripts/og/generate.mjs [--base http://localhost:4173] [--only home,chat-box]
 */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { en } from '../../src/lib/i18n/en.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(HERE, '../../public');
const TEMPLATE_URL = pathToFileURL(join(HERE, 'template.html')).href;
const LOGO_URL = pathToFileURL(join(PUBLIC_DIR, 'senchabot-logo.svg')).href;
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HARD_TIMEOUT_MS = 5 * 60_000;

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: process.env.OG_BASE_URL ?? 'http://localhost:4173' },
    only: { type: 'string' },
  },
});
const BASE = args.base.replace(/\/$/, '');
const ONLY = args.only ? new Set(args.only.split(',')) : null;

/** The visual box on the right of every card; captures are taken at exactly this CSS size. */
const STAGE = { width: 538, height: 432 };
const CARD = { width: 1200, height: 630 };
const ICONS = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
];

// OBS injects this CSS into every browser source; the overlays rely on it for transparency.
const OBS_SOURCE_CSS =
  'body { background-color: rgba(0, 0, 0, 0) !important; margin: 0px auto; overflow: hidden; } html { background: transparent !important; }';

const IMAGES_READY = `[...document.images].every((img) => img.complete && img.naturalWidth > 0)`;
// Emotes drift in random directions and a still frame catches some of them half off the edge,
// piled on another or under the card's Live badge. Those are hidden for the shot (like a moment
// they weren't there), and the frame with the most fully visible emotes wins.
const tidyEmotes = (keepOut = { right: 0, bottom: 0 }) => `(() => {
  if (!(${IMAGES_READY})) return -1;
  const imgs = [...document.images];
  for (const img of imgs) img.style.visibility = '';
  const opacity = (img) => Number(getComputedStyle(img).opacity);
  const hits = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const badge = { left: 0, top: 0, right: ${keepOut.right}, bottom: ${keepOut.bottom} };
  // Emote images have transparent margins, so boxes may touch a little.
  const core = (r) => {
    const m = r.width * 0.15;
    return { left: r.left + m, top: r.top + m, right: r.right - m, bottom: r.bottom - m };
  };
  const kept = [];
  for (const img of imgs.sort((a, b) => opacity(b) - opacity(a))) {
    const r = img.getBoundingClientRect();
    const ok =
      r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight &&
      !hits(r, badge) && !kept.some((k) => hits(core(r), core(k)));
    if (ok) kept.push(r);
    else img.style.visibility = 'hidden';
  }
  return imgs.filter((img) => img.style.visibility === '' && opacity(img) > 0.9).length;
})()`;

// Replaces Math.random with a seeded generator (mulberry32), so the demos pick the same emotes,
// spots and confetti on every run.
const seededRandom = (seed) => `(() => {
  let a = ${seed} >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();`;
// New chat messages slide in; wait for a moment between two of them.
const CHAT_READY = `${IMAGES_READY} && document.getAnimations().every((a) => a.playState !== 'running')`;

/** Stage corner covered by the Live badge (template.html `.live`). */
const LIVE_BADGE = { right: 104, bottom: 50 };

/** Live demo screenshots, keyed by name; each card lists the ones it needs. */
const CAPTURES = {
  chat: {
    path: '/widgets/chat-widget?mock=true&mockRate=1',
    width: 330,
    height: 400,
    settleMs: 9500,
    ready: CHAT_READY,
  },
  chatSmall: {
    path: '/widgets/chat-widget?mock=true&mockRate=1&fontSize=15',
    width: 236,
    height: 392,
    settleMs: 9500,
    ready: CHAT_READY,
  },
  emotes: {
    path: '/widgets/emote-wall?mock=true&size=76&duration=14',
    // Seeds here and below were picked by eye for a varied, spread-out mix of emotes.
    seed: 5,
    width: STAGE.width,
    height: STAGE.height,
    settleMs: 8000,
    score: tidyEmotes(LIVE_BADGE),
    sampleMs: 15000,
  },
  // Home only: emotes kept to the left of the chat so they don't run under its text.
  emotesNarrow: {
    path: '/widgets/emote-wall?mock=true&size=56&duration=12',
    seed: 3,
    width: 268,
    height: 200,
    settleMs: 6000,
    score: tidyEmotes(),
    sampleMs: 10000,
  },
  // The classic plant tops out at step 8 before it starts over; 700ms lets its 0.6s grow
  // transition finish, and the step is re-checked in case a double sub moved it on.
  sprout: {
    path: '/widgets/sub-sprout-widget?simulate=true',
    width: 800,
    height: 600,
    settleMs: 0,
    ready: `document.querySelector('.sprout-overlay')?.classList.contains('step-8')`,
    holdMs: 700,
  },
  // Raffle has no demo mode: the overlay gets the same BroadcastChannel message the setup
  // page sends when you draw a winner.
  raffle: {
    path: '/widgets/raffle-overlay',
    width: STAGE.width,
    height: STAGE.height,
    settleMs: 1500,
    ready: 'true',
    trigger: `new BroadcastChannel('senchabot-raffle-broadcast').postMessage({ type: 'raffle:winner', winner: { username: 'pixelfox', displayName: 'pixelfox' } })`,
    afterTriggerMs: 1100,
  },
};

const trust = [en.home.trustFree, en.home.trustNoLogin, en.home.trustOpenSource];

/** Positioned image layer in stage pixels. */
const layer = (capture, box) => ({ capture, ...box });

const CARDS = [
  {
    id: 'home',
    title: en.home.heroTitle,
    subtitle: en.home.heroLead.split('. ')[0].concat('.'),
    titleSize: 58,
    visual: {
      kind: 'stage',
      live: true,
      layers: [
        layer('emotesNarrow', { x: 12, y: 54, width: 268, height: 200 }),
        layer('sprout', { x: -60, y: 180, width: 320, height: 240 }),
        layer('chatSmall', { x: 286, y: 20, width: 236, height: 392 }),
      ],
    },
  },
  {
    id: 'chat-box',
    eyebrow: { icon: 'chat-box', label: 'Overlay' },
    title: en.widgets.chatBox.name,
    subtitle: en.widgets.chatBox.tagline,
    visual: {
      kind: 'stage',
      live: true,
      layers: [layer('chat', { x: 190, y: 16, width: 330, height: 400 })],
    },
  },
  {
    id: 'emote-wall',
    eyebrow: { icon: 'emote-wall', label: 'Overlay' },
    title: en.widgets.emoteWall.name,
    subtitle: en.widgets.emoteWall.tagline,
    visual: {
      kind: 'stage',
      live: true,
      layers: [layer('emotes', { x: 0, y: 0, width: STAGE.width, height: STAGE.height })],
    },
  },
  {
    id: 'sub-sprout',
    eyebrow: { icon: 'sub-sprout', label: 'Overlay' },
    title: en.widgets.subSprout.name,
    subtitle: en.widgets.subSprout.tagline,
    visual: {
      kind: 'stage',
      live: true,
      // Scaled so the plant (x 330-470, y 145-550 of the 800x600 source) fills the stage height.
      layers: [layer('sprout', { x: -71, y: -76, width: 680, height: 510 })],
    },
  },
  {
    id: 'raffle',
    eyebrow: { icon: 'raffle', label: 'Tool' },
    title: en.widgets.raffle.name,
    subtitle: en.widgets.raffle.tagline,
    visual: {
      kind: 'stage',
      live: true,
      layers: [layer('raffle', { x: 0, y: 0, width: STAGE.width, height: STAGE.height })],
    },
  },
  {
    id: 'obs-bridge',
    eyebrow: { icon: 'obs-bridge', label: 'Tool' },
    title: en.widgets.obsBridge.name,
    subtitle: en.widgets.obsBridge.tagline,
    visual: { kind: 'obs-bridge', scenesLabel: en.home.visualScenes },
  },
  {
    id: 'guides',
    eyebrow: { icon: 'guides', label: en.guides.breadcrumb },
    title: en.common.footer.setupGuides,
    subtitle: 'Step-by-step help for free Twitch and Kick overlays in OBS.',
    visual: {
      kind: 'guides',
      readLabel: en.guides.readGuide,
      guides: [
        { title: en.guides.obs.title, icons: ['chat-box', 'emote-wall', 'sub-sprout', 'raffle'] },
        { title: en.guides.chat.title, icons: ['chat-box', 'emote-wall', 'sub-sprout'] },
        { title: en.guides.raffle.title, icons: ['raffle'] },
        { title: en.guides.bridge.title, icons: ['obs-bridge'] },
      ],
    },
  },
].map((card) => ({ ...card, trust }));

// --- Chrome over the DevTools protocol -------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), 'og-prof-'));
const port = 9500 + Math.floor(Math.random() * 400);
let chrome;

function cleanup() {
  try {
    chrome?.kill('SIGKILL');
  } catch {}
  rmSync(profile, { recursive: true, force: true });
}
// Also covers crashes that skip `finally`, like an uncaught EPIPE when stdout is piped to `head`.
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(143);
});
const hardStop = setTimeout(() => {
  console.error(`Gave up after ${HARD_TIMEOUT_MS / 1000}s.`);
  cleanup();
  process.exit(2);
}, HARD_TIMEOUT_MS);

async function connect() {
  chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      '--mute-audio',
      '--lang=en-US',
      '--force-color-profile=srgb',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
      target = await res.json();
    } catch {
      await sleep(200);
    }
  }
  if (!target) throw new Error(`Chrome did not start (${CHROME})`);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    ws.onopen = resolveOpen;
    ws.onerror = reject;
  });
  let nextId = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve: done, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`));
      else done(msg.result);
    } else if (msg.method && listeners.has(msg.method)) {
      for (const fn of listeners.get(msg.method)) fn(msg.params);
      listeners.delete(msg.method);
    }
  };
  const send = (method, params = {}) =>
    new Promise((done, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve: done, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const once = (method) =>
    new Promise((done) => listeners.set(method, [...(listeners.get(method) ?? []), done]));
  return { send, once, close: () => ws.close() };
}

async function evaluate(cdp, expression) {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
  }
  return result.value;
}

async function waitFor(cdp, expression, timeoutMs, what) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await evaluate(cdp, `Boolean(${expression})`)) return;
    await sleep(50);
  }
  throw new Error(`Timed out waiting for ${what}`);
}

async function open(cdp, url, { width, height, scale, transparent }) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: scale,
    mobile: false,
  });
  await cdp.send(
    'Emulation.setDefaultBackgroundColorOverride',
    transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {},
  );
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url });
  await loaded;
}

async function screenshot(cdp) {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  return data;
}

// --- Rendering -------------------------------------------------------------------------------

async function captureDemo(cdp, name) {
  const spec = CAPTURES[name];
  const url = new URL(spec.path, BASE);
  // Chat labels and the raffle "Winner!" text are translated; crawlers get the English site.
  url.searchParams.set('lang', 'en');
  const { identifier } = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: seededRandom(spec.seed ?? 1),
  });
  // Twice the display size, so the card downsamples instead of upscaling.
  await open(cdp, url.href, { ...spec, scale: 2, transparent: true });
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  await evaluate(
    cdp,
    `document.head.append(Object.assign(document.createElement('style'), { textContent: ${JSON.stringify(OBS_SOURCE_CSS)} }))`,
  );
  await sleep(spec.settleMs);
  if (spec.trigger) {
    await evaluate(cdp, spec.trigger);
    await sleep(spec.afterTriggerMs);
  }
  if (spec.score) return bestFrame(cdp, name, spec);
  // The demos keep moving, so the ready state is checked again after the shot: a chat message
  // or plant step that lands mid-capture means another try.
  for (let attempt = 0; attempt < 10; attempt++) {
    await waitFor(cdp, spec.ready, 90_000, `the ${name} demo`);
    if (spec.holdMs) {
      await sleep(spec.holdMs);
      if (!(await evaluate(cdp, `Boolean(${spec.ready})`))) continue;
    }
    const png = await screenshot(cdp);
    if (await evaluate(cdp, `Boolean(${spec.ready})`)) {
      console.log(`  captured ${name}`);
      return `data:image/png;base64,${png}`;
    }
  }
  throw new Error(`The ${name} demo never held still long enough to capture`);
}

async function bestFrame(cdp, name, spec) {
  let best = { score: Number.NEGATIVE_INFINITY, png: '' };
  for (const end = Date.now() + spec.sampleMs; Date.now() < end; await sleep(100)) {
    const before = await evaluate(cdp, spec.score);
    if (before <= best.score) continue;
    const png = await screenshot(cdp);
    // Scored on both sides of the shot, since emotes move while it is taken.
    const score = Math.min(before, await evaluate(cdp, spec.score));
    if (score > best.score) best = { score, png };
  }
  console.log(`  captured ${name} (score ${best.score})`);
  return `data:image/png;base64,${best.png}`;
}

async function renderTemplate(cdp, size, call) {
  await open(cdp, TEMPLATE_URL, { ...size, scale: 1, transparent: false });
  await evaluate(cdp, call);
  return Buffer.from(await screenshot(cdp), 'base64');
}

function write(file, png) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, png);
  console.log(
    `  wrote ${file.replace(`${PUBLIC_DIR}/`, 'public/')} (${Math.round(png.length / 1024)} KB)`,
  );
}

async function main() {
  const cards = CARDS.filter((card) => !ONLY || ONLY.has(card.id));
  const needed = new Set(cards.flatMap((card) => (card.visual.layers ?? []).map((l) => l.capture)));

  const res = await fetch(`${BASE}/widgets/chat-widget?mock=true`).catch(() => null);
  if (!res?.ok) throw new Error(`No app at ${BASE}. Start a build first (see README.md).`);

  const cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Emulation.setLocaleOverride', { locale: 'en-US' });

  const shots = {};
  for (const name of needed) shots[name] = await captureDemo(cdp, name);

  for (const card of cards) {
    const cardShots = Object.fromEntries(
      (card.visual.layers ?? []).map((l) => [l.capture, shots[l.capture]]),
    );
    const payload = { ...card, stage: STAGE, logo: LOGO_URL, shots: cardShots };
    const png = await renderTemplate(cdp, CARD, `window.renderCard(${JSON.stringify(payload)})`);
    write(join(PUBLIC_DIR, 'og', `${card.id}.png`), png);
  }

  if (!ONLY || ONLY.has('icons')) {
    for (const icon of ICONS) {
      const size = { width: icon.size, height: icon.size };
      const png = await renderTemplate(
        cdp,
        size,
        `window.renderIcon(${JSON.stringify({ size: icon.size, logo: LOGO_URL })})`,
      );
      write(join(PUBLIC_DIR, icon.file), png);
    }
  }
  cdp.close();
}

try {
  await main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  clearTimeout(hardStop);
  cleanup();
}
