# Widget URL contract fixtures

Streamers paste widget URLs into OBS once and keep them, so a setup page must keep building the
exact same URL text for the same settings. The tests in `src/__tests__/url-contract/` check the
current code against golden fixtures made from the logic as it was before the redesign.

- `base-reference.ts`: the pre-redesign URL logic (commit 426eef0), frozen on purpose. Never edit
  it, not even to follow a rename; it is the reference the current code is compared with.
- `generate.ts`: runs `base-reference.ts` over a bounded matrix per widget and writes
  `src/__tests__/url-contract/fixtures/{chat-box,emote-wall,sub-sprout,obs-bridge}.json`, each
  case `{ group, input, expectedUrl }`. Groups: `channels` (every channel combination and
  platform at default settings), `single` (each setting value changed on its own) and `pairwise`
  (every pair of values of any two settings, channels included, in at least one case).

## Regenerate

Needs Node 22.18+ (it runs the `.ts` files directly) and nothing outside `node_modules`:

```sh
cd apps/extensions
node scripts/url-contract/generate.ts
```

The output is deterministic and ends with a Biome format pass, so a rerun must leave the fixtures
byte-identical (`git diff --exit-code src/__tests__/url-contract/fixtures`). Only rerun it after
widening the matrix in `generate.ts`; a failing contract test means the current code changed a
URL, never that the fixtures need refreshing.

When a URL is meant to change (the OBS Bridge now trims channels, for example), keep those inputs
out of the matrix and cover the new rule with named tests next to the golden ones.
