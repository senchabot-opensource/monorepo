# End-to-end smoke suite

`run.mjs` opens every page of a running build in headless Chrome and checks that it works the
way a visitor and a streamer would use it. No test framework or npm package: it drives the system
Chrome over the DevTools protocol with Node's built-in `fetch` and `WebSocket`
(`scripts/lib/chrome.mjs`).

## Run it

Needs Node 24+ (it imports the i18n dictionaries from `src/lib/i18n/*.ts` directly) and Google
Chrome.

```sh
cd apps/extensions
./node_modules/.bin/vite build
./node_modules/.bin/vite preview --port 4173 --strictPort &
npm run test:e2e
```

Stop the preview server when you are done.

| Option                  | Env               | Default                 |                                                   |
| ----------------------- | ----------------- | ----------------------- | ------------------------------------------------- |
| `--base <url>`          | `E2E_BASE_URL`    | `http://localhost:4173` | Any running copy, production included             |
| `--only <text>`         |                   |                         | Only pages and overlays whose path contains it; skips the SEO files |
| `--concurrency <n>`     | `E2E_CONCURRENCY` | `4`                     | Tabs running at once                              |
| `--verbose`             |                   |                         | List every check under its test case              |
|                         | `CHROME_PATH`     | macOS Google Chrome     | Another Chrome or Chromium binary, e.g. on CI     |
|                         | `E2E_TIMEOUT_MS`  | `900000` (15 min)       | Hard stop for the whole run                       |

Pass options through npm with `--`: `npm run test:e2e -- --only /setup --verbose`. The run takes
about a minute. It prints a line per test case, then a summary table (pages by theme and
viewport, overlays, SEO files), the failures, and the allowlisted console noise it saw. The exit
code is 1 when any check fails, including known bugs (see below).

## What it checks

Every page in `/sitemap.xml` plus `EXTRA_PAGES` (a 404 URL), in the dark and light theme
(`localStorage.theme` set before load), at 1440×900, 1366×768 and 400×860:

- **HTTP**: 200 without a redirect (404 for the 404 URL), no redirect loops, and the page stays
  on its URL after hydration.
- **Console**: no uncaught exceptions, `console.error` calls, browser error logs or React
  hydration errors, in the page or its same-origin iframes.
- **Layout**: no horizontal overflow (`scrollWidth <= innerWidth`); the failure names the element
  that sticks out.
- **Head**: one `<h1>`, `<title>`, meta description and canonical (pointing at the page itself),
  and every JSON-LD block parses. The 404 page must be `noindex` without a canonical instead.
- **Cursors**: every visible button, `summary` and `role="button"` shows a pointer, or
  `not-allowed` when disabled. It checks the cursor a person actually sees: a disabled button
  with `pointer-events: none` shows its parent's cursor, not its own.
- **Setup pages** (desktop sizes): the tool area fits the screen with the Copy button visible,
  and the preview renders the widget (or the live panel exists for Raffle and OBS Bridge).
- **Landing**: the hero demos render within 15 s (chat text, emote images, the plant SVG);
  gallery previews mount only near the viewport and unmount when scrolled past; after a theme
  toggle the demo iframes stay `color-scheme: normal` with a transparent, theme-free document.

Flows, once per page at 1440×900 in the dark theme:

- **Header Widgets menu** (landing): click opens it with a link to every setup page and a second
  click closes it; ArrowDown opens it on the first link and moves on; Escape closes it and gives
  focus back.
- **Setup pages**: type a channel, change one setting, and check the widget URL (for example
  `twitch=twitch` and `mode=chaos` on the Emote Wall); click Copy and check the next steps panel
  and the clipboard; on Chat Box, Emote Wall and Sub Sprout paste that URL into a fresh page and
  check it loads the same settings.

Overlays at their browser-source size (`/widgets/chat-widget?mock=true`,
`/widgets/emote-wall?mock=true`, `/widgets/sub-sprout-widget?simulate=true`,
`/widgets/raffle-overlay` fed a winner over its BroadcastChannel): they end on a 200, render,
have a transparent `html` and `body`, ignore the site theme, use `font-widget`, never request
Geist and have no site header or footer. `/tools/obs-bridge?twitch=test` gets the console,
heading and overflow checks.

SEO files: `robots.txt`, `sitemap.xml` (valid XML per the browser's parser, every `<loc>` answers
200), `llms.txt` and `llms-full.txt` as `text/plain`, every OG and Twitter image the pages point
at (a 1200×630 PNG, read from its header), the manifest icons and the head icons.

## Adding pages

Pages come from the served sitemap, so a new prerendered page, a `/tr/...` route included, is
tested as soon as it is in `public/sitemap.xml`. Everything else lives in `config.mjs`:

- `EXTRA_PAGES`: pages the sitemap leaves out (with the status they must answer).
- `LOCALE_PREFIXES`: path prefixes that are stripped to classify a page, so `/tr/setup/raffle`
  is tested like `/setup/raffle` and `/tr` like the landing page.
- `SETUP_SPECS`: one entry per setup page slug: what its preview shows and the setting the flow
  changes. A new setup page without an entry fails with a message saying so.
- `OVERLAYS`: overlay URLs and the size to open them at.

## Allowlisted console noise

Console errors that are expected and not the app's fault. Each has a narrow regex in
`CONSOLE_ALLOWLIST` (`config.mjs`), and the report counts how often each one showed up.

| Message                                                                  | Why it's expected                                                                                                                                              |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 404 from `7tv.io/v3/users/`, `api.betterttv.net/3/cached/users/`, `api.frankerfacez.com/v1/room/` | A channel without an account on that emote service. The widgets treat it as "no channel emotes", but Chrome logs every 4xx response as an error.       |
| 403/429 from `api.github.com`                                            | The landing star count calls the GitHub API unauthenticated (60 requests an hour per IP); repeated runs hit the limit and the page hides the count.         |
| `WebSocket connection to 'ws://127.0.0.1:4455/' failed`                  | OBS Bridge connects to obs-websocket on the local machine, and no OBS runs under test.                                                                         |
| `Failed to load Twitch global/channel badges: TypeError: Failed to fetch` | The chat preview iframe reloads on every settings change; Chrome aborts the old document's badge requests (`net::ERR_ABORTED`) and the badge hook logs them. |

The 404 page's own "Failed to load resource: 404" is ignored in code, since that status is what
the test asks for.

## Known bugs

`KNOWN_BUGS` in `config.mjs` lists checks that fail because of a reported app bug. They still
fail the run; the report marks them `BUG` instead of `FAIL` so a new failure stands out. Delete
the entry once the bug is fixed.

## Browser hygiene

Chrome runs headless with a throwaway profile in the OS temp directory and its own process
group. `scripts/lib/chrome.mjs` kills the whole group and deletes the profile when the run ends,
on Ctrl+C or SIGTERM, on an uncaught error, and at the hard timeout. Each test case gets its own
browser context (separate storage and permissions) and window. Nothing touches your Chrome
profile. To confirm nothing is left after a run:

```sh
pgrep -fl "remote-debugging-port"   # no output
ls "${TMPDIR:-/tmp}" | grep senchabot-chrome   # no output
```
