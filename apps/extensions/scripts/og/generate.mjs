#!/usr/bin/env node
/**
 * Renders the Open Graph cards (public/og/*.png) and app icons (public/*.png) with headless
 * Chrome. Overlay visuals are real screenshots of the widget demos, so a running build is needed.
 *
 *   node scripts/og/generate.mjs [--base http://localhost:4173] [--only home,chat-box]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { en } from '../../src/lib/i18n/en.ts';
import { launchChrome, sleep } from '../lib/chrome.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(HERE, '../../public');
const TEMPLATE_URL = pathToFileURL(join(HERE, 'template.html')).href;
const LOGO_URL = pathToFileURL(join(PUBLIC_DIR, 'senchabot-logo.svg')).href;
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

// The preview's test buttons reach it over this channel: take 25 minutes off a one hour timer,
// then gift 5 subs, so the bar sits around two thirds with the +5:00 on its way up.
const SUBATHON_HIT = `(() => {
  const channel = new BroadcastChannel('senchabot:subathon-preview');
  channel.postMessage({ type: 'event', event: { kind: 'mod', platform: 'twitch', text: '!subathon remove 25m' } });
  channel.postMessage({ type: 'event', event: { kind: 'gift', platform: 'twitch', name: 'pixelfox', count: 5, tier: 1 } });
})()`;
const OXANIUM_READY = `document.fonts.check('800 20px Oxanium')`;
const FRAME_READY = `document.fonts.status === 'loaded' && Boolean(document.querySelector('[data-testid="frame-art"] svg path'))`;
// One test alert over the preview channel; it stays up while the demo's own alerts wait.
const streamAlert = (alert) =>
  `new BroadcastChannel('senchabot:stream-alerts-preview').postMessage({ type: 'alert', preview: 'og', alert: ${JSON.stringify(alert)} })`;
const ALERT_READY = `Boolean(document.querySelector('[data-testid="stream-alert"]'))`;
// Sub Goal's preview takes test events over its channel: set the count, then a gift that
// lands the bar two short of the goal with its +5 on the way up.
const goalEvents = (...events) =>
  `(() => { const channel = new BroadcastChannel('senchabot:goal-preview'); ${events
    .map((event) => `channel.postMessage({ type: 'event', preview: 'og', event: ${JSON.stringify(event)} });`)
    .join(' ')} })()`;

// Chat Poll's preview takes chat messages over its channel: a mod puts the poll from the URL up,
// then viewers on both platforms vote. Test messages pause the simulated voters for a few seconds.
const POLL_VOTES = [12, 27, 18, 7];
const POLL_VOTE = `(() => {
  const channel = new BroadcastChannel('senchabot:poll-preview');
  const send = (event) => channel.postMessage({ type: 'event', preview: 'og', event });
  send({ kind: 'message', platform: 'twitch', login: 'mod', text: '!poll start', mod: true, sub: true });
  let viewer = 0;
  ${JSON.stringify(POLL_VOTES)}.forEach((count, option) => {
    for (let i = 0; i < count; i++) {
      const platform = viewer++ % 3 === 0 ? 'kick' : 'twitch';
      send({ kind: 'message', platform, login: 'v' + viewer, text: String(option + 1), mod: false, sub: false });
    }
  });
})()`;

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
  // simspeed=1 runs the clock in real time, so only the scripted events move it.
  subathonBar: {
    path: '/widgets/subathon?simulate=1&simspeed=1',
    width: 800,
    height: 300,
    settleMs: 600,
    trigger: SUBATHON_HIT,
    afterTriggerMs: 650,
    ready: OXANIUM_READY,
  },
  subathonRing: {
    path: '/widgets/subathon?simulate=1&simspeed=1&style=ring&color=purple',
    width: 800,
    height: 300,
    settleMs: 600,
    trigger: SUBATHON_HIT,
    afterTriggerMs: 650,
    ready: OXANIUM_READY,
  },
  goal: {
    path: '/widgets/goal?simulate=1&start=13&target=20&title=ROAD+TO+20&preview=og',
    width: 800,
    height: 260,
    settleMs: 600,
    trigger: goalEvents(
      { kind: 'mod', platform: 'twitch', text: '!goal set 13' },
      { kind: 'gift', platform: 'kick', name: 'pixelfox', count: 5, tier: 1 },
    ),
    afterTriggerMs: 650,
    ready: OXANIUM_READY,
  },
  goalReached: {
    path: '/widgets/goal?simulate=1&start=9&target=10&color=gold&preview=og',
    width: 800,
    height: 260,
    settleMs: 600,
    trigger: goalEvents({ kind: 'sub', platform: 'twitch', name: 'lunaa', tier: 1 }),
    // The trophy has landed and the burst is on its way out.
    afterTriggerMs: 1300,
    ready: OXANIUM_READY,
  },
  // Stills (motion=0), so the art doesn't catch a glint or a petal mid-flight.
  framesDynasty: {
    path: '/widgets/frame?demo=1&piece=camera&preset=dynasty&label=senchabot&motion=0',
    width: 640,
    height: 360,
    settleMs: 1500,
    ready: FRAME_READY,
  },
  framesAgent: {
    path: '/widgets/frame?demo=1&piece=camera&preset=agent&label=senchabot&motion=0',
    width: 640,
    height: 360,
    settleMs: 1500,
    ready: FRAME_READY,
  },
  poll: {
    path: `/widgets/poll?simulate=1&preview=og&q=${encodeURIComponent('What should we play tonight?')}&o=${encodeURIComponent('Horror game|Speedrun|Viewer games|Just chatting')}`,
    width: 640,
    height: 560,
    settleMs: 600,
    trigger: POLL_VOTE,
    // The bars have grown and the new-vote flashes have faded.
    afterTriggerMs: 1200,
    ready: `${OXANIUM_READY} && document.querySelector('[data-testid="poll-card"]')`,
  },
  alertNeon: {
    path: '/widgets/stream-alerts?simulate=1&dur=20&preview=og',
    width: 800,
    height: 450,
    settleMs: 600,
    trigger: streamAlert({ kind: 'sub', platform: 'twitch', name: 'pixelfox', tier: 1 }),
    // Past the entrance, while the frame sweep is mid-way.
    afterTriggerMs: 1900,
    ready: `${ALERT_READY} && ${OXANIUM_READY}`,
  },
  alertCelestial: {
    path: '/widgets/stream-alerts?simulate=1&dur=20&theme=celestial&color=gold&preview=og',
    width: 800,
    height: 450,
    settleMs: 600,
    trigger: streamAlert({ kind: 'gift', platform: 'kick', name: 'lunaa', count: 5, tier: 1 }),
    afterTriggerMs: 2200,
    ready: `${ALERT_READY} && document.fonts.check('700 20px Cinzel')`,
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
    id: 'subathon',
    eyebrow: { icon: 'subathon', label: 'Tool' },
    title: en.widgets.subathon.name,
    subtitle: en.widgets.subathon.tagline,
    visual: {
      kind: 'stage',
      live: true,
      layers: [
        layer('subathonBar', { x: 9, y: 22, width: 520, height: 195 }),
        layer('subathonRing', { x: 49, y: 200, width: 440, height: 165 }),
      ],
    },
  },
  {
    id: 'stream-alerts',
    eyebrow: { icon: 'stream-alerts', label: 'Overlay' },
    title: en.widgets.streamAlerts.name,
    subtitle: en.widgets.streamAlerts.tagline,
    visual: {
      kind: 'stage',
      live: true,
      // The 800x450 sources hold the alert in their middle 320 rows.
      layers: [
        layer('alertNeon', { x: 9, y: -34, width: 520, height: 293 }),
        layer('alertCelestial', { x: 9, y: 168, width: 520, height: 293 }),
      ],
    },
  },
  {
    id: 'goal',
    eyebrow: { icon: 'goal', label: 'Overlay' },
    title: en.widgets.goal.name,
    subtitle: en.widgets.goal.tagline,
    visual: {
      kind: 'stage',
      live: true,
      // Two 800x260 sources: one on its way to the goal, one just past it with the trophy.
      layers: [
        layer('goal', { x: 9, y: 40, width: 520, height: 169 }),
        layer('goalReached', { x: 9, y: 212, width: 520, height: 169 }),
      ],
    },
  },
  {
    id: 'frames',
    eyebrow: { icon: 'frames', label: 'Overlay' },
    title: en.widgets.frames.name,
    subtitle: en.widgets.frames.tagline,
    visual: {
      kind: 'stage',
      live: true,
      // Two 640x360 camera frames in different presets, one over the other's corner.
      layers: [
        layer('framesDynasty', { x: 0, y: 8, width: 400, height: 225 }),
        layer('framesAgent', { x: 138, y: 199, width: 400, height: 225 }),
      ],
    },
  },
  {
    id: 'poll',
    eyebrow: { icon: 'poll', label: 'Tool' },
    title: en.widgets.poll.name,
    subtitle: en.widgets.poll.tagline,
    visual: {
      kind: 'stage',
      live: true,
      // The 640x560 source, its poll at the top; four options fill about two thirds of it.
      layers: [layer('poll', { x: 22, y: 30, width: 494, height: 432 })],
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
        {
          title: en.guides.obs.title,
          icons: ['chat-box', 'emote-wall', 'sub-sprout', 'subathon', 'stream-alerts', 'raffle'],
        },
        { title: en.guides.chat.title, icons: ['chat-box', 'emote-wall', 'sub-sprout'] },
        { title: en.guides.raffle.title, icons: ['raffle'] },
        { title: en.guides.bridge.title, icons: ['obs-bridge'] },
      ],
    },
  },
].map((card) => ({ ...card, trust }));

// --- Chrome over the DevTools protocol -------------------------------------------------------

async function open(page, url, { width, height, scale, transparent }) {
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: scale,
    mobile: false,
  });
  await page.send(
    'Emulation.setDefaultBackgroundColorOverride',
    transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {},
  );
  const error = await page.goto(url);
  if (error) throw new Error(`Could not open ${url}: ${error}`);
}

async function screenshot(page) {
  const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
  return data;
}

const isTrue = (page, expression) => page.evaluate(`Boolean(${expression})`);

// --- Rendering -------------------------------------------------------------------------------

async function captureDemo(page, name) {
  const spec = CAPTURES[name];
  const url = new URL(spec.path, BASE);
  // Chat labels and the raffle "Winner!" text are translated; crawlers get the English site.
  url.searchParams.set('lang', 'en');
  const { identifier } = await page.send('Page.addScriptToEvaluateOnNewDocument', {
    source: seededRandom(spec.seed ?? 1),
  });
  // Twice the display size, so the card downsamples instead of upscaling.
  await open(page, url.href, { ...spec, scale: 2, transparent: true });
  await page.send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  await page.evaluate(
    `document.head.append(Object.assign(document.createElement('style'), { textContent: ${JSON.stringify(OBS_SOURCE_CSS)} }))`,
  );
  await sleep(spec.settleMs);
  if (spec.trigger) {
    await page.evaluate(spec.trigger);
    await sleep(spec.afterTriggerMs);
  }
  if (spec.score) return bestFrame(page, name, spec);
  // The demos keep moving, so the ready state is checked again after the shot: a chat message
  // or plant step that lands mid-capture means another try.
  for (let attempt = 0; attempt < 10; attempt++) {
    await page.poll(`Boolean(${spec.ready})`, {
      timeout: 90_000,
      interval: 50,
      what: `the ${name} demo`,
    });
    if (spec.holdMs) {
      await sleep(spec.holdMs);
      if (!(await isTrue(page, spec.ready))) continue;
    }
    const png = await screenshot(page);
    if (await isTrue(page, spec.ready)) {
      console.log(`  captured ${name}`);
      return `data:image/png;base64,${png}`;
    }
  }
  throw new Error(`The ${name} demo never held still long enough to capture`);
}

async function bestFrame(page, name, spec) {
  let best = { score: Number.NEGATIVE_INFINITY, png: '' };
  for (const end = Date.now() + spec.sampleMs; Date.now() < end; await sleep(100)) {
    const before = await page.evaluate(spec.score);
    if (before <= best.score) continue;
    const png = await screenshot(page);
    // Scored on both sides of the shot, since emotes move while it is taken.
    const score = Math.min(before, await page.evaluate(spec.score));
    if (score > best.score) best = { score, png };
  }
  console.log(`  captured ${name} (score ${best.score})`);
  return `data:image/png;base64,${best.png}`;
}

async function renderTemplate(page, size, call) {
  await open(page, TEMPLATE_URL, { ...size, scale: 1, transparent: false });
  await page.evaluate(call);
  return Buffer.from(await screenshot(page), 'base64');
}

function write(file, png) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, png);
  console.log(
    `  wrote ${file.replace(`${PUBLIC_DIR}/`, 'public/')} (${Math.round(png.length / 1024)} KB)`,
  );
}

let chrome;

async function main() {
  const cards = CARDS.filter((card) => !ONLY || ONLY.has(card.id));
  const needed = new Set(cards.flatMap((card) => (card.visual.layers ?? []).map((l) => l.capture)));

  const res = await fetch(`${BASE}/widgets/chat-widget?mock=true`).catch(() => null);
  if (!res?.ok) throw new Error(`No app at ${BASE}. Start a build first (see README.md).`);

  chrome = await launchChrome({ hardTimeoutMs: HARD_TIMEOUT_MS });
  const page = await chrome.newPage();
  await page.send('Page.enable');
  await page.send('Emulation.setLocaleOverride', { locale: 'en-US' });

  const shots = {};
  for (const name of needed) shots[name] = await captureDemo(page, name);

  for (const card of cards) {
    const cardShots = Object.fromEntries(
      (card.visual.layers ?? []).map((l) => [l.capture, shots[l.capture]]),
    );
    const payload = { ...card, stage: STAGE, logo: LOGO_URL, shots: cardShots };
    const png = await renderTemplate(page, CARD, `window.renderCard(${JSON.stringify(payload)})`);
    write(join(PUBLIC_DIR, 'og', `${card.id}.png`), png);
  }

  if (!ONLY || ONLY.has('icons')) {
    for (const icon of ICONS) {
      const size = { width: icon.size, height: icon.size };
      const png = await renderTemplate(
        page,
        size,
        `window.renderIcon(${JSON.stringify({ size: icon.size, logo: LOGO_URL })})`,
      );
      write(join(PUBLIC_DIR, icon.file), png);
    }
  }
}

try {
  await main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await chrome?.close();
}
