# Social cards and app icons

`generate.mjs` renders these files with headless Chrome:

- `public/og/{home,chat-box,emote-wall,sub-sprout,raffle,obs-bridge,guides}.png`: 1200×630
  Open Graph / Twitter cards
- `public/apple-touch-icon.png` (180), `public/icon-192.png`, `public/icon-512.png`: the logo on
  `#09090b`, sized to stay inside the maskable safe zone

The overlay pictures are screenshots of the real widget demos (`?mock=true`, `?simulate=true`, and
the Raffle overlay fed a winner over its BroadcastChannel), laid onto `template.html`. Titles and
taglines come from `src/lib/i18n/en.ts`, so rerun the script when that copy changes.

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
