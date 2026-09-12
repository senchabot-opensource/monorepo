/**
 * What the smoke suite visits and what it expects there. Pages come from the served
 * sitemap.xml, so a new prerendered page (a /tr/... route included) is tested as soon as it is
 * listed there; EXTRA_PAGES is the one list to extend for pages the sitemap leaves out.
 */
import { en } from '../../src/lib/i18n/en.ts';
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

/** Locale path prefixes; `/tr/setup/raffle` is tested like `/setup/raffle`. */
export const LOCALE_PREFIXES = ['tr'];

/** The header theme button, found by its label in any language. */
export const THEME_TOGGLE = [en, tr]
  .map((dict) => `header button[aria-label="${dict.common.themeToggle}"]`)
  .join(', ');

/** Hero demos by widget path. Below Tailwind's `sm` (640px) the hero only shows the chat. */
export const HERO_DEMOS = {
  wide: ['/widgets/emote-wall', '/widgets/sub-sprout-widget', '/widgets/chat-widget'],
  narrow: ['/widgets/chat-widget'],
  breakpoint: 640,
};

/** What each overlay must render before it counts as working (see READY in browser-checks). */
export const READY_BY_WIDGET = {
  '/widgets/chat-widget': 'chat',
  '/widgets/emote-wall': 'emotes',
  '/widgets/sub-sprout-widget': 'plant',
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
  raffle: {
    // Start, Stop and Draw live in the right-hand panel instead of a preview.
    preview: { selector: 'button', min: 3 },
    steps: [{ type: 'input[placeholder="!join"]', text: '!enter' }],
    // The overlay URL has no settings: the winner reaches it over a BroadcastChannel.
    exact: '/widgets/raffle-overlay',
  },
  'obs-bridge': {
    // Commands, users and channels summary instead of a preview.
    preview: { selector: 'section', min: 3 },
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
export const KNOWN_BUGS = [
  {
    check: 'disabled controls show a not-allowed cursor',
    note:
      'styles.css gives button:disabled pointer-events: none, so the hover falls through to the ' +
      'parent and disabled:cursor-not-allowed never shows (only NumberField sets it on a wrapper).',
  },
];
