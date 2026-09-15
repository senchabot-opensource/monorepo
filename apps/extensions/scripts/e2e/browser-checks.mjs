/** Everything that needs a real browser: one exported job per kind of test case. */
import { sleep } from '../lib/chrome.mjs';
import {
  CONSOLE_ALLOWLIST,
  DESKTOP_MIN_WIDTH,
  HERO_DEMOS,
  READY_BY_WIDGET,
  SETUP_SPECS,
  THEME_TOGGLE,
} from './config.mjs';

/** Lets effects run and late console errors arrive after hydration. */
const SETTLE_MS = 750;
const DEMO_TIMEOUT_MS = 15_000;
// A channel that exists: the chat preview looks its badges up, and an unknown name makes that
// lookup 404 and the widget log an error.
const TEST_CHANNEL = 'twitch';

const TOOL_GRID = 'main > div:first-child';
const SETTINGS_PANEL = `${TOOL_GRID} > div:nth-child(1)`;
const PREVIEW_PANEL = `${TOOL_GRID} > div:nth-child(2)`;
// CopyUrlField is the only input that always carries aria-invalid.
const URL_INPUT = 'main input[aria-invalid]';
const COPY_BUTTON = `${URL_INPUT} + button`;
const WIDGETS_MENU = 'header nav button[aria-controls]';

/**
 * In-page test for "the overlay shows something": chat has message text, the emote wall a
 * loaded image, Sub Sprout an SVG plant, `text:x` the text x. Kept as source so it can run in
 * the top document and inside iframes alike.
 */
const READY = `(doc, kind) => {
  if (!doc?.body || doc.readyState !== 'complete') return false;
  if (kind === 'chat') return doc.body.innerText.trim().length > 10;
  if (kind === 'emotes') return [...doc.images].some((img) => img.complete && img.naturalWidth > 0);
  if (kind === 'plant') {
    return [...doc.querySelectorAll('svg')].some(
      (svg) => svg.getBoundingClientRect().width > 0 && svg.querySelectorAll('path').length >= 3,
    );
  }
  if (kind.startsWith('text:')) return doc.body.innerText.includes(kind.slice(5));
  return false;
}`;

const TRANSPARENT = ['rgba(0, 0, 0, 0)', 'transparent'];

let userAgent;

// Every tab shares the browser's clipboard, so parallel Copy checks take turns.
let clipboardQueue = Promise.resolve();
function withClipboard(fn) {
  const run = clipboardQueue.then(fn);
  clipboardQueue = run.catch(() => {});
  return run;
}

/**
 * Opens a tab with the viewport, theme, browser language (English unless `language` is given,
 * e.g. `tr-TR`) and console capture every job needs.
 */
export async function openTab(chrome, { width, height, theme, origin, language = 'en-US' }) {
  const page = await chrome.newPage();
  if (origin) {
    await page.grantPermissions(origin, ['clipboardReadWrite', 'clipboardSanitizedWrite']);
  }
  const problems = [];
  const requests = [];
  const formatArg = (arg) =>
    arg.value ?? arg.description ?? arg.unserializableValue ?? `[${arg.type}]`;
  page.on('Runtime.exceptionThrown', ({ exceptionDetails: details }) =>
    problems.push({
      kind: 'uncaught exception',
      text: details.exception?.description ?? details.text,
      url: details.url ?? '',
    }),
  );
  page.on('Runtime.consoleAPICalled', (event) => {
    if (event.type !== 'error' && event.type !== 'assert') return;
    problems.push({
      kind: `console.${event.type}`,
      text: event.args.map(formatArg).join(' '),
      url: event.stackTrace?.callFrames?.[0]?.url ?? '',
    });
  });
  page.on('Log.entryAdded', ({ entry }) => {
    if (entry.level === 'error') {
      problems.push({ kind: `${entry.source} error`, text: entry.text, url: entry.url ?? '' });
    }
  });
  page.on('Network.requestWillBeSent', ({ request }) => requests.push(request.url));

  await Promise.all([
    page.send('Page.enable'),
    page.send('Runtime.enable'),
    page.send('Log.enable'),
    page.send('Network.enable'),
  ]);
  userAgent ??= (await chrome.connection.send('Browser.getVersion')).userAgent;
  await Promise.all([
    page.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    }),
    // The site lands visitors in their browser language, so pin it (English by default).
    page.send('Emulation.setLocaleOverride', { locale: language }),
    page.send('Network.setUserAgentOverride', {
      userAgent,
      acceptLanguage: `${language},${language.slice(0, 2)}`,
    }),
    // Clipboard writes and :focus-visible need a focused page.
    page.send('Emulation.setFocusEmulationEnabled', { enabled: true }),
  ]);
  if (theme) {
    await page.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `try { localStorage.setItem('theme', ${JSON.stringify(theme)}); } catch {}`,
    });
  }
  return { page, problems, requests, close: () => page.close() };
}

/** Waits for React to hydrate the SSR markup, for web fonts, and for effects to settle. */
async function waitForApp(page) {
  await page.poll(
    () => Object.keys(document.body ?? {}).some((key) => key.startsWith('__reactFiber')),
    { timeout: 15_000, what: 'React to hydrate' },
  );
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await sleep(SETTLE_MS);
}

async function load(tab, url) {
  const error = await tab.page.goto(url);
  if (error) throw new Error(`navigation failed: ${error}`);
  await waitForApp(tab.page);
}

/** Console problems minus the allowlisted noise, which is returned separately for the report. */
export function splitConsole(problems) {
  const allowed = [];
  const errors = [];
  for (const problem of problems) {
    const rule = CONSOLE_ALLOWLIST.find(
      (entry) =>
        (!entry.url || entry.url.test(problem.url)) &&
        (!entry.text || entry.text.test(problem.text)),
    );
    if (rule) allowed.push({ ...problem, reason: rule.reason });
    else errors.push(problem);
  }
  return { allowed, errors };
}

const HYDRATION = /Minified React error #(418|419|421|422|423|425)|hydrat/i;

function checkConsole(tab, check, noise) {
  const { allowed, errors } = splitConsole(tab.problems);
  noise.push(...allowed);
  const hydration = errors.filter((problem) => HYDRATION.test(problem.text));
  check('no hydration errors', hydration.length === 0, formatProblems(hydration));
  check('no console errors', errors.length === 0, formatProblems(errors));
}

const formatProblems = (problems) =>
  problems
    .slice(0, 5)
    .map((p) => `${p.kind}: ${p.text.split('\n')[0].slice(0, 220)}${p.url ? ` (${p.url})` : ''}`)
    .join(' | ') + (problems.length > 5 ? ` | ...and ${problems.length - 5} more` : '');

/** Head tags, headings, overflow and cursors: runs in the page. */
function collectPageFacts() {
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
  };
  const describe = (el) => {
    const role = el.getAttribute('role');
    const label =
      el.getAttribute('aria-label') ||
      el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) ||
      el.getAttribute('title') ||
      '';
    return `<${el.tagName.toLowerCase()}${role ? ` role=${role}` : ''}> "${label}"`;
  };
  // The cursor a person sees: an element with pointer-events: none passes the hover to what is
  // under it, so its own cursor never shows (disabled buttons used to do this).
  const shownCursor = (el) => {
    let target = el;
    while (target.parentElement && getComputedStyle(target).pointerEvents === 'none') {
      target = target.parentElement;
    }
    return { cursor: getComputedStyle(target).cursor, from: target };
  };
  const enabledCursor = [];
  const disabledCursor = [];
  for (const el of document.querySelectorAll('button, summary, [role="button"]')) {
    if (!visible(el)) continue;
    const disabled = el.matches(':disabled') || el.getAttribute('aria-disabled') === 'true';
    const shown = shownCursor(el);
    if (disabled && shown.cursor !== 'not-allowed') {
      const parent = `<${shown.from.tagName.toLowerCase()} class="${(shown.from.getAttribute('class') ?? '').slice(0, 40)}">`;
      const via = shown.from === el ? '' : ` (pointer-events: none, the hover lands on ${parent})`;
      disabledCursor.push(`${describe(el)} shows cursor ${shown.cursor}${via}`);
    }
    if (!disabled && shown.from === el && shown.cursor !== 'pointer') {
      enabledCursor.push(`${describe(el)} shows cursor ${shown.cursor}`);
    }
  }
  // The outermost elements that stick out past the right edge, to point at the culprit.
  const overflowing = [];
  if (document.documentElement.scrollWidth > innerWidth) {
    for (const el of document.body.querySelectorAll('*')) {
      const right = el.getBoundingClientRect().right;
      const parentRight = el.parentElement?.getBoundingClientRect().right ?? 0;
      if (right > innerWidth + 1 && parentRight <= innerWidth + 1 && overflowing.length < 3) {
        const cls = (el.getAttribute('class') ?? '').slice(0, 60);
        overflowing.push(`${describe(el)} ends at ${Math.round(right)}px [${cls}]`);
      }
    }
  }
  return {
    path: location.pathname,
    h1: document.querySelectorAll('h1').length,
    titles: [...document.querySelectorAll('title')].filter((el) => !el.closest('svg')).length,
    descriptions: document.querySelectorAll('meta[name="description"]').length,
    canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map((el) => el.href),
    robots: document.querySelector('meta[name="robots"]')?.content ?? '',
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((el) => {
      try {
        JSON.parse(el.textContent);
        return null;
      } catch (err) {
        return err.message;
      }
    }),
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth,
    overflowing,
    enabledCursor,
    disabledCursor,
    dark: document.documentElement.classList.contains('dark'),
  };
}

/** One page in one theme at one viewport: the core matrix case. */
export async function runPageCase({ chrome, base, page, theme, viewport, check, noise }) {
  const tab = await openTab(chrome, { ...viewport, theme });
  try {
    await load(tab, new URL(page.path, base).href);
    const facts = await tab.page.evaluate(collectPageFacts);
    const indexable = page.status === 200;

    check('stays on its URL', facts.path === page.path, `ended on ${facts.path}`);
    check('theme applied', facts.dark === (theme === 'dark'), `html.dark is ${facts.dark}`);
    check('exactly one <h1>', facts.h1 === 1, `found ${facts.h1}`);
    check('exactly one <title>', facts.titles === 1, `found ${facts.titles}`);
    check('exactly one meta description', facts.descriptions === 1, `found ${facts.descriptions}`);
    if (indexable) {
      const canonicalPath = facts.canonicals[0] && new URL(facts.canonicals[0]).pathname;
      check(
        'exactly one canonical, pointing at this page',
        facts.canonicals.length === 1 && canonicalPath === page.path,
        `found ${JSON.stringify(facts.canonicals)}`,
      );
      check('has JSON-LD', facts.jsonLd.length > 0, 'no application/ld+json block');
    } else {
      // A canonical on an error page would ask search engines to index it.
      check(
        'noindex and no canonical',
        facts.canonicals.length === 0 && facts.robots.includes('noindex'),
        `canonicals ${JSON.stringify(facts.canonicals)}, robots "${facts.robots}"`,
      );
    }
    const badJson = facts.jsonLd.filter(Boolean);
    check('JSON-LD parses', badJson.length === 0, badJson.join('; '));
    check(
      'no horizontal overflow',
      facts.scrollWidth <= facts.innerWidth,
      `scrollWidth ${facts.scrollWidth} > ${facts.innerWidth}: ${facts.overflowing.join('; ')}`,
    );
    check(
      'enabled controls show a pointer cursor',
      facts.enabledCursor.length === 0,
      facts.enabledCursor.join('; '),
    );
    check(
      'disabled controls show a not-allowed cursor',
      facts.disabledCursor.length === 0,
      facts.disabledCursor.join('; '),
    );

    if (page.kind === 'setup' && viewport.width >= DESKTOP_MIN_WIDTH) {
      await checkSetupScreen(tab.page, page, check);
    }
    if (page.kind === 'landing') {
      await checkLanding(tab.page, viewport, theme, check);
    }
    if (!indexable) {
      // Chrome logs the error page's own status as a failed resource; that 404 is the point.
      const self = new URL(page.path, base).href;
      tab.problems = tab.problems.filter((p) => !(p.url === self && /status of 404/.test(p.text)));
    }
    checkConsole(tab, check, noise);
  } catch (err) {
    check('page ran to the end', false, err.message);
    checkConsole(tab, check, noise);
  } finally {
    await tab.close();
  }
}

/** Setup and tool pages: the tool fits the first screen and the preview (or live panel) works. */
async function checkSetupScreen(page, setup, check) {
  const fit = await page.evaluate(
    (grid, copy) => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const tool = document.querySelector(grid)?.getBoundingClientRect();
      const button = document.querySelector(copy)?.getBoundingClientRect();
      return { bottom: tool?.bottom ?? null, copyBottom: button?.bottom ?? null, innerHeight };
    },
    TOOL_GRID,
    COPY_BUTTON,
  );
  check(
    'tool area fits the screen',
    fit.bottom !== null && fit.bottom <= fit.innerHeight + 1,
    `tool area ends at ${fit.bottom}px, viewport is ${fit.innerHeight}px`,
  );
  check(
    'widget URL and Copy visible without scrolling',
    fit.copyBottom !== null && fit.copyBottom <= fit.innerHeight,
    fit.copyBottom === null
      ? 'no Copy button'
      : `Copy ends at ${fit.copyBottom}px, viewport is ${fit.innerHeight}px`,
  );

  const spec = SETUP_SPECS[setup.slug];
  if (!spec) {
    check('has a setup spec', false, `add "${setup.slug}" to SETUP_SPECS in config.mjs`);
    return;
  }
  if (spec.preview === 'iframe') {
    const ok = await page
      .poll(
        `(() => {
          const frame = document.querySelector(${JSON.stringify(`${PREVIEW_PANEL} iframe`)});
          if (!frame?.contentDocument) return false;
          const kinds = ${JSON.stringify(READY_BY_WIDGET)};
          const kind = kinds[new URL(frame.src).pathname];
          return Boolean(kind) && (${READY})(frame.contentDocument, kind);
        })()`,
        { timeout: DEMO_TIMEOUT_MS, what: 'the preview demo' },
      )
      .then(() => null)
      .catch((err) => err.message);
    check('preview renders the widget', ok === null, ok);
  } else {
    const count = await page.evaluate(
      (panel, selector) => document.querySelector(panel)?.querySelectorAll(selector).length ?? 0,
      PREVIEW_PANEL,
      spec.preview.selector,
    );
    check(
      'live panel renders',
      count >= spec.preview.min,
      `found ${count} "${spec.preview.selector}" in the panel, want ${spec.preview.min}+`,
    );
  }
}

const HERO = 'section[aria-labelledby="hero-title"]';

/** Landing only: hero demos, lazy gallery previews and transparent demos after a theme flip. */
async function checkLanding(page, viewport, theme, check) {
  const expected = viewport.width >= HERO_DEMOS.breakpoint ? HERO_DEMOS.wide : HERO_DEMOS.narrow;
  const heroState = `(() => {
    const ready = ${READY};
    const kinds = ${JSON.stringify(READY_BY_WIDGET)};
    const frames = [...document.querySelectorAll(${JSON.stringify(`${HERO} iframe`)})];
    return ${JSON.stringify(expected)}.map((path) => {
      const frame = frames.find((f) => new URL(f.src).pathname === path);
      return { path, ok: Boolean(frame?.contentDocument && ready(frame.contentDocument, kinds[path])) };
    });
  })()`;
  const demos = await page
    .poll(`(${heroState}).every((demo) => demo.ok)`, { timeout: DEMO_TIMEOUT_MS })
    .then(() => null)
    .catch(async () => {
      const state = await page.evaluate(heroState);
      return `not rendered after ${DEMO_TIMEOUT_MS / 1000}s: ${state
        .filter((demo) => !demo.ok)
        .map((demo) => demo.path)
        .join(', ')}`;
    });
  check(`hero demos render (${expected.length})`, demos === null, demos);

  const lazy = await checkGalleryLazy(page).catch((err) => err.message);
  check('gallery previews mount only near the viewport', lazy === null, lazy);

  const transparent = await checkThemeFlip(page, theme).catch((err) => err.message);
  check('demos stay transparent after a theme toggle', transparent === null, transparent);
}

/** Mounted gallery iframes, and the ones further from the viewport than PreviewFrame allows. */
function galleryState() {
  // PreviewFrame's rootMargin is 200px; the extra 60px absorbs layout shifts while scrolling.
  const margin = 260;
  const frames = [...document.querySelectorAll('#widgets iframe')];
  const far = frames.filter((frame) => {
    const rect = frame.parentElement.getBoundingClientRect();
    return rect.top > innerHeight + margin || rect.bottom < -margin;
  });
  return { mounted: frames.length, far: far.map((frame) => frame.title) };
}

async function checkGalleryLazy(page) {
  const scrollTo = (expression) =>
    page.evaluate(`(${expression}), new Promise((r) => requestAnimationFrame(() => r(true)))`);

  await scrollTo(`window.scrollTo({ top: 0, behavior: 'instant' })`);
  let state = await page.evaluate(galleryState);
  if (state.far.length) return `mounted while far below the fold: ${state.far.join(', ')}`;

  await scrollTo(
    `document.querySelector('#widgets article').scrollIntoView({ block: 'start', behavior: 'instant' })`,
  );
  state = await page
    .poll(`(() => { const s = (${galleryState})(); return s.mounted > 0 && s; })()`, {
      timeout: 5000,
      what: 'a gallery preview to mount after scrolling to it',
    })
    .catch(() => null);
  if (!state) return 'no gallery preview mounted after scrolling to the gallery';
  if (state.far.length) return `mounted off screen: ${state.far.join(', ')}`;

  await scrollTo(
    `window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })`,
  );
  const gone = await page
    .poll(`(${galleryState})().mounted === 0`, { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  await scrollTo(`window.scrollTo({ top: 0, behavior: 'instant' })`);
  if (!gone) return 'gallery previews stayed mounted after scrolling past them';
  return null;
}

async function checkThemeFlip(page, theme) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  // The hero demos come back after the gallery check scrolled them away.
  await page.poll(
    `document.querySelectorAll(${JSON.stringify(`${HERO} iframe`)}).length > 0 &&
      [...document.querySelectorAll(${JSON.stringify(`${HERO} iframe`)})].every((f) => f.contentDocument?.readyState === 'complete')`,
    { timeout: DEMO_TIMEOUT_MS, what: 'the hero demos to remount' },
  );
  await page.click(THEME_TOGGLE);
  const wantDark = theme !== 'dark';
  await page.poll(`document.documentElement.classList.contains('dark') === ${wantDark}`, {
    timeout: 3000,
    what: `the theme toggle to switch to ${wantDark ? 'dark' : 'light'}`,
  });
  await sleep(300);
  const frames = await page.evaluate((selector) => {
    return [...document.querySelectorAll(selector)].map((frame) => {
      const doc = frame.contentDocument;
      const root = doc?.documentElement;
      return {
        src: new URL(frame.src).pathname,
        frameScheme: getComputedStyle(frame).colorScheme,
        rootDark: root?.classList.contains('dark') ?? null,
        rootScheme: root ? getComputedStyle(root).colorScheme : null,
        htmlBg: root ? getComputedStyle(root).backgroundColor : null,
        bodyBg: doc?.body ? getComputedStyle(doc.body).backgroundColor : null,
      };
    });
  }, `${HERO} iframe`);
  if (frames.length === 0) return 'no hero demo iframes to check';
  const bad = frames.filter(
    (f) =>
      f.frameScheme !== 'normal' ||
      f.rootDark !== false ||
      f.rootScheme !== 'normal' ||
      !TRANSPARENT.includes(f.htmlBg) ||
      !TRANSPARENT.includes(f.bodyBg),
  );
  return bad.length
    ? bad
        .map(
          (f) =>
            `${f.src}: iframe color-scheme ${f.frameScheme}, overlay root dark=${f.rootDark} ` +
            `color-scheme ${f.rootScheme}, html bg ${f.htmlBg}, body bg ${f.bodyBg}`,
        )
        .join('; ')
    : null;
}

/** Header Widgets menu on the landing page: click and keyboard, open and closed. */
export async function runHeaderMenu({ chrome, base, path, setupPaths, check, noise }) {
  const tab = await openTab(chrome, { width: 1440, height: 900, theme: 'dark' });
  const { page } = tab;
  const menuState = (trigger) => {
    const button = document.querySelector(trigger);
    const panel = button && document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return null;
    const links = [...panel.querySelectorAll('a')].filter(
      (a) => a.getBoundingClientRect().height > 0,
    );
    return {
      expanded: button.getAttribute('aria-expanded') === 'true',
      open: !panel.hidden && panel.getBoundingClientRect().height > 0,
      links: links.map((a) => new URL(a.href).pathname),
      focus: document.activeElement === button ? 'trigger' : links.indexOf(document.activeElement),
    };
  };
  try {
    await load(tab, new URL(path, base).href);
    const closed = await page.evaluate(menuState, WIDGETS_MENU);
    if (!closed) throw new Error(`no Widgets menu (${WIDGETS_MENU}) in the header`);
    check('menu starts closed', !closed.open && !closed.expanded, JSON.stringify(closed));

    await page.click(WIDGETS_MENU);
    const opened = await page.poll(
      `(() => { const s = (${menuState})(${JSON.stringify(WIDGETS_MENU)}); return s?.open && s; })()`,
      { timeout: 3000, what: 'the menu to open on click' },
    );
    const missing = setupPaths.filter((p) => !opened.links.includes(p));
    check(
      `click opens it with every widget (${setupPaths.length})`,
      opened.expanded && missing.length === 0 && opened.links.length === setupPaths.length,
      `links ${JSON.stringify(opened.links)}, missing ${JSON.stringify(missing)}`,
    );
    await page.click(WIDGETS_MENU);
    const afterClick = await page.evaluate(menuState, WIDGETS_MENU);
    check(
      'second click closes it',
      !afterClick.open && !afterClick.expanded,
      JSON.stringify(afterClick),
    );

    await page.evaluate((trigger) => document.querySelector(trigger).focus(), WIDGETS_MENU);
    await page.press('ArrowDown');
    const keyOpen = await page
      .poll(
        `(() => { const s = (${menuState})(${JSON.stringify(WIDGETS_MENU)}); return s?.open && s.focus === 0 && s; })()`,
        { timeout: 3000, what: 'ArrowDown to open the menu and focus the first link' },
      )
      .catch((err) => err.message);
    check('ArrowDown opens it and focuses the first link', typeof keyOpen !== 'string', keyOpen);
    await page.press('ArrowDown');
    const moved = await page.evaluate(menuState, WIDGETS_MENU);
    check('ArrowDown moves to the next link', moved.focus === 1, `focus on ${moved.focus}`);
    await page.press('Escape');
    const escaped = await page.evaluate(menuState, WIDGETS_MENU);
    check(
      'Escape closes it and returns focus',
      !escaped.open && !escaped.expanded && escaped.focus === 'trigger',
      JSON.stringify(escaped),
    );
    checkConsole(tab, check, noise);
  } catch (err) {
    check('menu test ran to the end', false, err.message);
    checkConsole(tab, check, noise);
  } finally {
    await tab.close();
  }
}

/**
 * Language landing: each case is a fresh profile with a given browser language and optional
 * saved choice. Visitors must land on their language's URL, explicit /tr links and ?lang= must
 * update the saved choice, and the EN/TR switcher must stick on the next visit.
 */
// No console check here: every case redirects or navigates mid-load, which cancels in-flight
// font and API requests (net::ERR_SOCKET_NOT_CONNECTED). Page cases already cover console health.
export async function runLanguageLanding({ chrome, base, check }) {
  const url = (path) => new URL(path, base).href;
  const state = () => ({
    path: location.pathname + location.search,
    lang: document.documentElement.lang,
    saved: localStorage.getItem('lang'),
  });
  const settle = async (tab, path) => {
    await tab.page.poll(
      `location.pathname + location.search === ${JSON.stringify(path)} && Object.keys(document.body ?? {}).some((k) => k.startsWith('__reactFiber'))`,
      { timeout: 15_000, what: `to land on ${path}` },
    );
    return tab.page.evaluate(state);
  };
  const cases = [
    { name: 'Turkish browser opening / lands on /tr', language: 'tr-TR', open: '/', expect: '/tr', lang: 'tr' },
    { name: 'English browser stays on /', language: 'en-US', open: '/', expect: '/', lang: 'en' },
    { name: 'unsupported browser language falls back to English', language: 'de-DE', open: '/faq', expect: '/faq', lang: 'en' },
    { name: 'saved English beats a Turkish browser', language: 'tr-TR', saved: 'en', open: '/guides', expect: '/guides', lang: 'en' },
    { name: 'saved Turkish beats an English browser', language: 'en-US', saved: 'tr', open: '/guides', expect: '/tr/guides', lang: 'tr' },
    { name: 'legacy ?lang=tr lands on the Turkish URL without the param', language: 'en-US', open: '/setup/chat-widget?lang=tr', expect: '/tr/setup/chat-widget', lang: 'tr', savedAfter: 'tr' },
  ];
  for (const c of cases) {
    const tab = await openTab(chrome, { width: 1280, height: 800, theme: 'dark', language: c.language });
    try {
      if (c.saved) {
        await tab.page.goto(url('/robots.txt'));
        await tab.page.evaluate((v) => localStorage.setItem('lang', v), c.saved);
      }
      await tab.page.goto(url(c.open));
      const landed = await settle(tab, c.expect);
      check(
        c.name,
        landed.lang === c.lang && (!c.savedAfter || landed.saved === c.savedAfter),
        JSON.stringify(landed),
      );
    } catch (err) {
      check(c.name, false, err.message);
    } finally {
      await tab.close();
    }
  }

  // A /tr link updates the choice, and the switcher's EN link sticks on the next visit.
  const tab = await openTab(chrome, { width: 1280, height: 800, theme: 'dark', language: 'en-US' });
  try {
    await tab.page.goto(url('/tr/faq'));
    const viaLink = await settle(tab, '/tr/faq');
    await tab.page.goto(url('/'));
    const back = await settle(tab, '/tr');
    check('a /tr link saves Turkish for the next visit', viaLink.saved === 'tr' && back.lang === 'tr', JSON.stringify({ viaLink, back }));

    await tab.page.click('header a[hreflang="en"]');
    const switched = await settle(tab, '/');
    await tab.page.goto(url('/'));
    const again = await settle(tab, '/');
    check('clicking EN saves English and the next visit stays English', switched.saved === 'en' && again.lang === 'en', JSON.stringify({ switched, again }));
  } catch (err) {
    check('switcher choice sticks', false, err.message);
  } finally {
    await tab.close();
  }
}

/** Setup page flow: type a channel, change a setting, copy, then paste the URL back in. */
export async function runSetupFlow({ chrome, base, page: setup, check, noise, origin }) {
  const spec = SETUP_SPECS[setup.slug];
  const tab = await openTab(chrome, { width: 1440, height: 900, theme: 'dark', origin });
  const { page } = tab;
  const url = new URL(setup.path, base).href;
  const fillChannel = async () => {
    const found = await page.evaluate((panel) => {
      const input = document.querySelector(`${panel} input[type="text"]:not(:disabled)`);
      input?.focus();
      return Boolean(input);
    }, SETTINGS_PANEL);
    if (!found) throw new Error('no channel field in the settings panel');
    await page.insertText(TEST_CHANNEL);
  };
  const readUrl = () =>
    page.evaluate((sel) => document.querySelector(sel)?.value ?? null, URL_INPUT);

  try {
    if (!spec) throw new Error(`add "${setup.slug}" to SETUP_SPECS in config.mjs`);
    await load(tab, url);
    await fillChannel();
    for (const step of spec.steps) {
      if (step.click) await page.click(step.click);
      if (step.type) {
        const found = await page.evaluate((sel) => {
          const input = document.querySelector(sel);
          input?.focus();
          input?.select();
          return Boolean(input);
        }, step.type);
        if (!found) throw new Error(`nothing matches ${step.type}`);
        await page.insertText(step.text);
      }
      await sleep(150);
    }

    const wanted = (spec.expect ?? []).map((part) => part.replace('{channel}', TEST_CHANNEL));
    const exact = spec.exact ? `${origin}${spec.exact}` : null;
    const matches = (value) =>
      Boolean(value) && (exact ? value === exact : wanted.every((part) => value.includes(part)));
    let finalUrl = await readUrl();
    for (const deadline = Date.now() + 5000; !matches(finalUrl) && Date.now() < deadline; ) {
      await sleep(100);
      finalUrl = await readUrl();
    }
    check(
      'widget URL follows the settings',
      matches(finalUrl),
      `got ${JSON.stringify(finalUrl)}, want ${exact ? JSON.stringify(exact) : `it to contain ${JSON.stringify(wanted)}`}`,
    );

    const copied = await withClipboard(async () => {
      await page.click(COPY_BUTTON);
      const state = await page
        .poll(
          `(() => {
          const input = document.querySelector(${JSON.stringify(URL_INPUT)});
          const root = input?.parentElement?.parentElement;
          const link = root?.querySelector('ol a[target="_blank"]');
          if (link) return { panel: true, href: link.getAttribute('href') };
          const selected = document.activeElement === input && input.selectionStart === 0 &&
            input.selectionEnd === input.value.length && input.value.length > 0;
          return selected && { panel: false };
        })()`,
          { timeout: 3000, what: 'the next steps panel after Copy' },
        )
        .catch((err) => ({ error: err.message }));
      if (state.panel) {
        state.clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
      }
      return state;
    });
    if (copied.error) {
      check('Copy shows the next steps', false, copied.error);
    } else if (copied.panel) {
      check(
        'Copy shows the next steps',
        copied.href === finalUrl && (copied.clip === null || copied.clip === finalUrl),
        `test link ${copied.href}, clipboard ${JSON.stringify(copied.clip)}, URL ${finalUrl}`,
      );
    } else {
      // No clipboard access: the field selects the URL for a manual copy instead.
      check('Copy shows the next steps (manual-copy fallback)', true, '');
    }

    if (spec.pasteToEdit && finalUrl) {
      await load(tab, url);
      await page.click(URL_INPUT);
      await page.insertText(finalUrl);
      await sleep(300);
      const after = await page.evaluate(
        (sel, panel) => ({
          url: document.querySelector(sel)?.value ?? null,
          channel: document.querySelector(`${panel} input[type="text"]`)?.value ?? null,
          invalid: document.querySelector(sel)?.getAttribute('aria-invalid'),
        }),
        URL_INPUT,
        SETTINGS_PANEL,
      );
      check(
        'pasting a widget URL loads its settings',
        after.url === finalUrl && after.channel === TEST_CHANNEL && after.invalid === 'false',
        `after paste: URL ${JSON.stringify(after.url)}, channel ${JSON.stringify(after.channel)}, aria-invalid ${after.invalid}`,
      );
    }
    checkConsole(tab, check, noise);
  } catch (err) {
    check('flow ran to the end', false, err.message);
    checkConsole(tab, check, noise);
  } finally {
    await tab.close();
  }
}

/** One overlay (or the OBS Bridge live page) at its browser-source size. */
export async function runOverlay({ chrome, base, overlay, check, noise }) {
  // Dark site theme on purpose: overlays must ignore it.
  const tab = await openTab(chrome, {
    width: overlay.width,
    height: overlay.height,
    theme: 'dark',
  });
  const { page } = tab;
  try {
    await load(tab, new URL(overlay.path, base).href);
    if (overlay.trigger) await page.evaluate(overlay.trigger);
    if (overlay.ready) {
      const ready = await page
        .poll(`(${READY})(document, ${JSON.stringify(overlay.ready)})`, {
          timeout: DEMO_TIMEOUT_MS,
          what: `the overlay to show ${overlay.ready}`,
        })
        .then(() => null)
        .catch((err) => err.message);
      check(`shows ${overlay.ready}`, ready === null, ready);
    }
    const facts = await page.evaluate(() => {
      const html = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      return {
        htmlBg: html.backgroundColor,
        htmlImage: html.backgroundImage,
        bodyBg: body.backgroundColor,
        bodyImage: body.backgroundImage,
        bodyClass: document.body.className,
        siteChrome: document.querySelectorAll('header, footer, a[href="#main"]').length,
        dark: document.documentElement.classList.contains('dark'),
        scheme: html.colorScheme,
        h1: document.querySelectorAll('h1').length,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth,
      };
    });
    if (overlay.tool) {
      check('renders its heading', facts.h1 === 1, `found ${facts.h1} <h1>`);
      check(
        'no horizontal overflow',
        facts.scrollWidth <= facts.innerWidth,
        `scrollWidth ${facts.scrollWidth} > ${facts.innerWidth}`,
      );
    } else {
      check(
        'transparent html and body',
        TRANSPARENT.includes(facts.htmlBg) &&
          TRANSPARENT.includes(facts.bodyBg) &&
          facts.htmlImage === 'none' &&
          facts.bodyImage === 'none',
        `html ${facts.htmlBg} ${facts.htmlImage}, body ${facts.bodyBg} ${facts.bodyImage}`,
      );
      check(
        'ignores the site theme',
        !facts.dark && facts.scheme === 'normal',
        `html.dark ${facts.dark}, color-scheme ${facts.scheme}`,
      );
      check(
        'uses the widget font',
        facts.bodyClass.split(/\s+/).includes('font-widget'),
        `body class "${facts.bodyClass}"`,
      );
      const geist = tab.requests.filter((u) => /geist/i.test(u));
      check('never requests Geist', geist.length === 0, geist.join(', '));
      check('no site header or footer', facts.siteChrome === 0, `found ${facts.siteChrome}`);
    }
    checkConsole(tab, check, noise);
  } catch (err) {
    check('overlay ran to the end', false, err.message);
    checkConsole(tab, check, noise);
  } finally {
    await tab.close();
  }
}

/** Validates XML with the browser's parser; returns an error message or null. */
export async function parseXmlInBrowser(chrome, xml) {
  const tab = await openTab(chrome, { width: 800, height: 600 });
  try {
    return await tab.page.evaluate((text) => {
      const doc = new DOMParser().parseFromString(text, 'application/xml');
      const error = doc.querySelector('parsererror');
      if (error) return error.textContent.trim().slice(0, 200);
      const root = doc.documentElement;
      if (root.localName !== 'urlset') return `root element is <${root.localName}>, want <urlset>`;
      if (root.namespaceURI !== 'http://www.sitemaps.org/schemas/sitemap/0.9') {
        return `urlset namespace is ${root.namespaceURI}`;
      }
      return null;
    }, xml);
  } finally {
    await tab.close();
  }
}
