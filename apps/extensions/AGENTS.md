# AGENTS.md — apps/extensions

Free OBS browser-source widgets and tools ([extensions.senchabot.com](https://extensions.senchabot.com/)).
TanStack Start + Vite, React, Tailwind, Biome, Vitest. There is no account and no backend for the
widgets: each one is configured through URL search params and talks to Twitch and Kick straight
from the browser.

Git and pull-request rules are in the [root AGENTS.md](../../AGENTS.md).

## Running it

```sh
npm install
npm run build
npm run preview -- --port 3320   # then open the URL it prints
npm test                         # vitest, ~1500 tests
npx tsc --noEmit
npx biome check --write src/the/files/you/changed.tsx
```

Use `build` + `preview` rather than `npm run dev`: in dev the TanStack devtools hold one SSE
connection open per frame, the landing page's widget iframes exhaust the browser's per-host
connection pool, and the demos stay blank. After a code change, rebuild **and** restart the
preview — a running preview keeps serving the old bundle.

Stop the preview before switching branches. Its router plugin rewrites `routeTree.gen.ts` when
files change, which dirties the working tree.

## House rules

- **Twitch and Kick get the same features.** If a capability exists officially on only one
  platform, ship it on neither. No unofficial or third-party sources to close the gap.
- **Don't change behavior unless the old behavior is a verified bug.** Overlay output, OBS
  behavior and the setup panels are what streamers already have on screen. Read the current `dev`
  code and check a primary source (official docs, a live payload) before "fixing" anything, and
  add a test that fails without the fix.
- **Both locales, every string.** UI copy lives as keys in `src/lib/i18n/en.ts` and
  `src/lib/i18n/tr.ts`. A key present in one and missing in the other fails a test.
- **Biome on your files only.** Much of the tree predates the formatter, so
  `biome check --write <folder>` silently reformats dozens of unrelated files. Pass explicit file
  paths, and don't `--write` `en.ts` / `tr.ts` at all.

## A user-facing change touches more than one file

Widgets, tools and guides are wired up in several places, and the tests know it:

- `src/lib/changelog.ts` — one entry, newest first, with its `changelog.entries.*` key in both locales.
- `src/lib/widgets.ts` or `src/lib/guides.ts` — the entry and its en/tr meta (title ≤ 60
  characters, description ≤ 160).
- a route under `src/routes/{-$locale}/`, plus the prerender list in `vite.config.ts` (the English
  path and the `/tr` one).
- `public/sitemap.xml`, `public/llms.txt`, `public/llms-full.txt`, and `README.md` for a new
  widget or tool.

`guides.test.ts`, `seo/sitemap.test.ts` and `src/test/pages/navigation.test.tsx` fail when one of
these is missing, and the failure names the file — read it instead of guessing.
