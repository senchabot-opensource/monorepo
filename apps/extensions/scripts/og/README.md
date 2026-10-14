# Social cards and app icons

`generate.mjs` renders these files with headless Chrome:

- `public/og/<id>.png`: 1200×630 Open Graph / Twitter cards, one per widget (named by its registry
  id) plus `home` and `guides`. A test checks that every widget has its own and that no two are the
  same picture.
- `public/apple-touch-icon.png` (180), `public/icon-192.png`, `public/icon-512.png`: the logo on
  `#09090b`, sized to stay inside the maskable safe zone

The overlay pictures are screenshots of the real widget demos (`?mock=true`, `?simulate=true`,
`?demo=1`), laid onto `template.html`. Where a card needs a set moment, the overlay gets the same
BroadcastChannel messages its setup page's test buttons send: a goal two short of its target, a
featured message, the next track, the credits rolled from the top, and so on. Titles and taglines
come from `src/lib/i18n/en.ts`, so rerun the script when that copy changes. A new widget needs a
card in `CARDS`, its captures in `CAPTURES`, its icon in `template.html` and its path in
`OG_IMAGES` (`src/lib/seo/head.ts`).

## Regenerate

Needs Node 24+ (it imports `en.ts` directly), Google Chrome, and internet access for Geist and
the emote CDNs.

```sh
cd apps/extensions
./node_modules/.bin/vite build
./node_modules/.bin/vite preview --port 4173 &
node scripts/og/generate.mjs                       # all cards and icons
node scripts/og/generate.mjs --only raffle,icons   # a subset
```

`--base <url>` (or `OG_BASE_URL`) points it at another running copy of the app, and `CHROME_PATH`
at another Chrome binary. Stop the preview server when you are done.

The script uses a throwaway Chrome profile and kills Chrome on exit, on Ctrl+C and after a
5 minute hard timeout. The demos are seeded, so reruns pick the same emotes; timing still varies a
little, so look over the cards before committing them. Keep each card under ~300 KB.
