/**
 * What the smoke suite visits and what it expects there. Pages come from the served
 * sitemap.xml, so a new prerendered page (a /tr/... route included) is tested as soon as it is
 * listed there; EXTRA_PAGES is the one list to extend for pages the sitemap leaves out.
 */
import { de } from '../../src/lib/i18n/de.ts';
import { en } from '../../src/lib/i18n/en.ts';
import { es } from '../../src/lib/i18n/es.ts';
import { fr } from '../../src/lib/i18n/fr.ts';
import { ja } from '../../src/lib/i18n/ja.ts';
import { pt } from '../../src/lib/i18n/pt.ts';
import { tr } from '../../src/lib/i18n/tr.ts';

export const THEMES = ['dark', 'light'];

export const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '400x860', width: 400, height: 860 },
];

/** Tool pages are one screen from Tailwind's `lg` breakpoint up. */
export const DESKTOP_MIN_WIDTH = 1024;

/** Pages that aren't in the sitemap but must still work. */
export const EXTRA_PAGES = [{ path: '/this-page-does-not-exist', status: 404 }];

/** Locale path prefixes (LOCALES minus English); `/tr/setup/raffle` is tested like `/setup/raffle`. */
export const LOCALE_PREFIXES = ['de', 'es', 'fr', 'ja', 'pt', 'tr'];

/** The header theme button, found by its label in any language. */
export const THEME_TOGGLE = [en, de, es, fr, ja, pt, tr]
  .map((dict) => `header button[aria-label="${dict.common.themeToggle}"]`)
  .join(', ');

/** Hero demos by widget path. Below Tailwind's `sm` (640px) the hero only shows the chat. */
export const HERO_DEMOS = {
  wide: [
    '/widgets/emote-wall',
    '/widgets/sub-sprout-widget',
    '/widgets/subathon',
    '/widgets/chat-widget',
  ],
  narrow: ['/widgets/chat-widget'],
  breakpoint: 640,
};

/** What each overlay must render before it counts as working (see READY in browser-checks). */
export const READY_BY_WIDGET = {
  '/widgets/chat-widget': 'chat',
  '/widgets/emote-wall': 'emotes',
  '/widgets/sub-sprout-widget': 'plant',
  '/widgets/subathon': 'text:SUBATHON',
  '/widgets/stream-alerts': 'alert',
  // Sub Goal and the Bits & Kicks Goal share this overlay, and their titles follow the page
  // language and the platforms (SUB GOAL, BITS GOAL, KICKS HEDEFİ…), so no title text fits all.
  '/widgets/goal': 'goal',
  '/widgets/counter': 'counter',
  '/widgets/event-list': 'event-list',
  '/widgets/credits': 'credits',
  '/widgets/queue': 'queue',
  '/widgets/leaderboard': 'leaderboard',
  '/widgets/lower-third': 'lower-third',
  '/widgets/tasks': 'tasks',
  '/widgets/now-playing': 'now-playing',
  '/widgets/emote-combo': 'emote-combo',
  '/widgets/featured': 'featured',
  '/widgets/frame': 'frame',
  '/widgets/poll': 'poll',
  '/widgets/countdown': 'countdown',
  // The demo's handles are senchabot_<platform>.
  '/widgets/socials': 'text:senchabot_',
};

/**
 * Per setup page (keyed by the slug after /setup/): what the preview shows and one quick edit.
 * `preview: 'iframe'` waits for the widget demo in the preview frame; `{ selector, min }` is a
 * live panel instead. `steps` run after a channel is typed into the first channel field;
 * `expect` are substrings the widget URL must then contain (`{channel}` is the typed name).
 */
export const SETUP_SPECS = {
  'chat-widget': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="horizontal"]' }],
    expect: ['/widgets/chat-widget?', 'twitch={channel}', 'orientation=horizontal'],
    pasteToEdit: true,
  },
  'emote-wall': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="chaos"]' }],
    expect: ['/widgets/emote-wall?', 'twitch={channel}', 'mode=chaos'],
    pasteToEdit: true,
  },
  'sub-growing-plant': {
    preview: 'iframe',
    // Plant variety is the first Select; its second option is anything but the default.
    steps: [
      { click: '[role="combobox"]' },
      { click: '[role="listbox"] [role="option"]:nth-child(2)' },
    ],
    expect: ['/widgets/sub-sprout-widget?', 'twitch={channel}', 'variety='],
    pasteToEdit: true,
  },
  'subathon-timer': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="clock"]' }],
    expect: ['/widgets/subathon?', 'twitch={channel}', 'style=clock'],
    pasteToEdit: true,
  },
  'stream-alerts': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/stream-alerts?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  'sub-goal': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/goal?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  counter: {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="stack"]' }],
    expect: ['/widgets/counter?', 'twitch={channel}', 'layout=stack'],
    pasteToEdit: true,
  },
  'event-list': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/event-list?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  'end-credits': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="fast"]' }],
    expect: ['/widgets/credits?', 'twitch={channel}', 'speed=fast'],
    pasteToEdit: true,
  },
  'viewer-queue': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/queue?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  'top-supporters': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="cheers"]' }],
    expect: ['/widgets/leaderboard?', 'twitch={channel}', 'board=cheers'],
    pasteToEdit: true,
  },
  'lower-thirds': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="tr"]' }],
    expect: ['/widgets/lower-third?', 'twitch={channel}', 'corner=tr'],
    pasteToEdit: true,
  },
  'task-list': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/tasks?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  'now-playing': {
    preview: 'iframe',
    // The first text field is the username, which takes the place of a channel here.
    steps: [{ click: 'input[type="radio"][value="pill"]' }],
    expect: ['/widgets/now-playing?', 'user={channel}', 'layout=pill'],
    pasteToEdit: true,
  },
  'emote-combo': {
    preview: 'iframe',
    // Gold is this widget's default color, so the check picks another.
    steps: [{ click: 'input[type="radio"][value="cyan"]' }],
    expect: ['/widgets/emote-combo?', 'twitch={channel}', 'color=cyan'],
    pasteToEdit: true,
  },
  'featured-message': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/featured?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  'bits-goal': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/goal?', 'twitch={channel}', 'type=bits', 'color=gold'],
    pasteToEdit: true,
  },
  'stream-frames': {
    preview: 'iframe',
    // Frames read no chat: the "channel" goes into the label, the first text field.
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/frame?', 'label={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  'stream-countdown': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/countdown?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  'chat-poll': {
    preview: 'iframe',
    steps: [{ click: 'input[type="radio"][value="gold"]' }],
    expect: ['/widgets/poll?', 'twitch={channel}', 'color=gold'],
    pasteToEdit: true,
  },
  socials: {
    preview: 'iframe',
    // Animation is the page's only Select; its second option is anything but the default.
    steps: [
      { click: '[role="combobox"]' },
      { click: '[role="listbox"] [role="option"]:nth-child(2)' },
    ],
    expect: ['/widgets/socials?', 'twitch={channel}', 'animation=slideLeft'],
    pasteToEdit: true,
  },
  raffle: {
    // Start, Stop and Draw live in the right-hand panel instead of a preview.
    preview: { selector: 'button', min: 3 },
    steps: [{ type: 'input[placeholder="!join"]', text: '!enter' }],
    // The overlay URL has no settings: the winner reaches it over a BroadcastChannel.
    exact: '/widgets/raffle-overlay',
  },
  'obs-bridge': {
    // The preview runs the live tool, so with no channel yet it shows a hint instead.
    preview: { selector: 'p', min: 1 },
    steps: [{ type: 'input[placeholder="brb"]', text: '!pause' }],
    expect: ['/tools/obs-bridge?', 'twitch={channel}', 'cmdBrb=%21pause'],
  },
};

/**
 * Overlays run inside OBS: transparent, on the widget font, without the site chrome or Geist.
 * `ready` names what must show up; `trigger` runs in the page first. OBS Bridge's live page is a
 * normal site page that stays open in a browser, so it only gets the console and layout checks.
 */
export const OVERLAYS = [
  { path: '/widgets/chat-widget?mock=true', width: 400, height: 600, ready: 'chat' },
  { path: '/widgets/emote-wall?mock=true', width: 1920, height: 1080, ready: 'emotes' },
  { path: '/widgets/sub-sprout-widget?simulate=true', width: 800, height: 600, ready: 'plant' },
  { path: '/widgets/subathon?simulate=1', width: 800, height: 300, ready: 'text:SUBATHON' },
  { path: '/widgets/stream-alerts?simulate=1', width: 800, height: 450, ready: 'alert' },
  { path: '/widgets/goal?simulate=1', width: 800, height: 260, ready: 'text:SUB GOAL' },
  { path: '/widgets/counter?simulate=1', width: 800, height: 260, ready: 'counter' },
  { path: '/widgets/event-list?simulate=1', width: 420, height: 520, ready: 'event-list' },
  { path: '/widgets/credits?simulate=1', width: 1920, height: 1080, ready: 'credits' },
  { path: '/widgets/queue?simulate=1', width: 440, height: 600, ready: 'queue' },
  { path: '/widgets/leaderboard?simulate=1', width: 440, height: 380, ready: 'leaderboard' },
  { path: '/widgets/lower-third?simulate=1&title=E2E', width: 1920, height: 1080, ready: 'text:E2E' },
  { path: '/widgets/tasks?simulate=1', width: 480, height: 720, ready: 'tasks' },
  { path: '/widgets/now-playing?demo=1', width: 640, height: 160, ready: 'now-playing' },
  { path: '/widgets/emote-combo?simulate=1', width: 600, height: 400, ready: 'emote-combo' },
  { path: '/widgets/featured?simulate=1', width: 720, height: 240, ready: 'featured' },
  {
    path: '/widgets/goal?simulate=1&type=bits',
    width: 800,
    height: 260,
    ready: 'text:BITS & KICKS GOAL',
  },
  { path: '/widgets/frame?demo=1&preset=dynasty', width: 1920, height: 1080, ready: 'frame' },
  { path: '/widgets/frame?piece=camera&label=e2e', width: 640, height: 360, ready: 'text:E2E' },
  // The first simulated poll comes up after a moment.
  { path: '/widgets/poll?simulate=1', width: 640, height: 560, ready: 'poll' },
  {
    path: '/widgets/raffle-overlay',
    width: 1920,
    height: 1080,
    ready: 'text:e2e_winner',
    // What the Raffle setup page broadcasts when it draws a winner.
    trigger: `new BroadcastChannel('senchabot-raffle-broadcast').postMessage({ type: 'raffle:winner', winner: { username: 'e2e_winner', displayName: 'e2e_winner' } })`,
  },
  { path: '/tools/obs-bridge?twitch=test', width: 1440, height: 900, tool: true },
];

/**
 * Console errors that are expected and not the app's fault. Each entry needs a reason. `text`
 * and `url` are regexes tested against the message and the URL it came from.
 */
export const CONSOLE_ALLOWLIST = [
  {
    url: /^https:\/\/(7tv\.io\/v3\/users\/|api\.betterttv\.net\/3\/cached\/users\/|api\.frankerfacez\.com\/v1\/room\/)/,
    text: /status of 404/,
    reason:
      '7TV, BTTV and FFZ answer 404 for a channel without an account there, which the widgets ' +
      'treat as "no channel emotes". Chrome still logs every 4xx response as a console error.',
  },
  {
    url: /^https:\/\/api\.github\.com\//,
    text: /status of (403|429)/,
    reason:
      'The landing star count calls the GitHub API unauthenticated (60 requests an hour per IP). ' +
      'Repeated runs hit the limit; the page then just hides the count.',
  },
  {
    text: /^WebSocket connection to 'ws:\/\/(localhost|127\.0\.0\.1):4455\/' failed/,
    reason:
      'OBS Bridge connects to obs-websocket on this machine; there is no OBS running under test.',
  },
  {
    text: /^Failed to load Twitch (global|channel) badges: TypeError: Failed to fetch/,
    reason:
      'The chat preview iframe reloads on every settings change. Chrome aborts the old ' +
      "document's badge requests (net::ERR_ABORTED) and the badge hook logs the aborted fetch.",
  },
];

/**
 * Failing checks caused by app bugs that are known and reported. They still fail the run; the
 * report labels them so a new failure stands out. Delete an entry once its bug is fixed.
 */
export const KNOWN_BUGS = [];
