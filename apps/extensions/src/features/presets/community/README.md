# Community presets

A preset gives Chat Box, Stream Alerts, Sub Goal, Subathon Timer, Chat Poll and the Raffle
winner overlay the same look. Each community preset is one JSON file in this folder. Once your
pull request is merged, the preset shows up on [extensions.senchabot.com/presets](https://extensions.senchabot.com/presets)
and on every setup page, with your name on it.

## Make one

1. Copy the example below into `<id>.json` here. The file name must match `id`: lowercase
   letters, digits and dashes, starting with a letter, up to 24 characters.
2. Pick your colors and fonts. Look at the built-in presets in
   [`../builtin-presets.ts`](../builtin-presets.ts) for what each value does on screen.
3. Run `npm run build && npm run preview` in `apps/extensions`, open
   `/presets?preset=<id>` and check every widget.
4. Run `npm test`. It fails if a preset doesn't pass the schema in
   [`../preset-schema.ts`](../preset-schema.ts); a preset that fails is left out of the site.
5. Open a pull request with a screenshot of the presets page.

```json
{
  "id": "neon-city",
  "name": "Neon City",
  "game": "Cyberpunk 2077",
  "author": { "name": "yourname", "url": "https://twitch.tv/yourname" },
  "description": {
    "en": "Magenta frames on dark glass, cyan bars and Chakra Petch titles.",
    "tr": "Koyu cam üstünde macenta çerçeveler, camgöbeği barlar ve Chakra Petch başlıklar."
  },
  "fonts": {
    "display": { "family": "Chakra Petch", "weights": "400;500;600;700", "fallback": "sans-serif" },
    "body": { "family": "Exo 2", "weights": "400..800", "fallback": "sans-serif" }
  },
  "colors": {
    "accent": "#00e5ff",
    "win": "#fcee0a",
    "text": "#f2f2f2",
    "muted": "#9aa4b5",
    "panel": "#16121f",
    "panel2": "#07060b",
    "frame": "#ff2a6d",
    "frame2": "#5b1033",
    "track": "#0c0a12"
  },
  "panelOpacity": 0.9,
  "frame": "hud",
  "radius": 0.2,
  "skew": -8,
  "title": { "upper": true, "italic": false, "tracking": 0.12 },
  "fill": "stripes",
  "motion": "slide",
  "sound": "neon",
  "shadow": "soft"
}
```

## Values

| Key | What it is |
| --- | --- |
| `game` | Optional. The game it's made for, shown next to the name. |
| `description` | One sentence in English and one in Turkish, up to 160 characters each. |
| `fonts` | Two [Google Fonts](https://fonts.google.com): `display` for titles, names and numbers, `body` for chat and small text. `weights` is the `wght` axis, a range like `400..900` or a list like `400;700`. Pick fonts with the latin-ext subset, so Turkish letters (ş ğ ı İ) don't fall back to another font. |
| `colors` | Nine `#rrggbb` colors: `accent` fills bars and glows, `win` marks a reached goal or a poll's winner, `panel` and `panel2` are the panel's top and bottom, `frame` and `frame2` are the frame's light and dark lines, `track` is a bar's empty part. |
| `panelOpacity` | 0.5 to 1. Below 1 the game shows through the panels a little. |
| `frame` | `gilded` (thin gold lines, diamond studs), `ornate` (thick bevel, rivets), `lacquer` (outer band, inner line, corner brackets), `iron` (dark border, corner teeth, a glow along the bottom), `tactical` (cut corners, an accent edge), `hud` (corner brackets, an accent top line) or `pixel` (stepped pixel border). |
| `radius` | 0 to 1.5, scales each widget's own corner radius: 0 is square, 1 keeps it. |
| `skew` | -20 to 0, how far bars lean, in degrees. |
| `title` | Title text: uppercase or not, italic or not, letter spacing in em (0 to 0.4). |
| `fill` | What's on top of a bar's fill: `gloss`, `stripes`, `blocks` (hard steps, wide seams) or `flat`. |
| `motion` | How the alert card comes in: `unfold`, `drop`, `scroll`, `slam`, `slide`, `wipe` or `pop`. |
| `sound` | Which alert sounds play: `neon` (synth) or `celestial` (bells). |
| `shadow` | `soft` for a dark halo behind text, `hard` for a one-step drop shadow like pixel games. |

## Rules

- Colors and fonts only: presets can't carry images, so no game logos, art or official fonts.
- Game names are fine to name what a preset is made for, not to make it look official.
- A preset can't reuse an id that's already taken, including `classic`.
