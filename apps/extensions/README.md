# Senchabot Extensions

Free, open-source customizable stream overlays, multi-chat widgets, and streaming tools for Twitch and Kick. Configure and embed overlays and tools into OBS Studio, Streamlabs Desktop, XSplit Broadcaster, vMix, Lightstream, PRISM Live Studio, Twitch Studio, Meld Studio, Wirecast, Ecamm Live, or any software that supports browser sources in seconds. No account or login required.

## What It Does

Senchabot Extensions provides 100% free streaming widgets, customizable overlays, and interactive tools for Twitch and Kick streamers. Each tool and overlay runs as a browser source that you can add to OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources in seconds.

- **Sub Sprout** — A visual plant widget and subscriber goal overlay that grows with each subscription, resub, or gift sub. Resets after reaching full growth.
- **Universal Chat** — A multi-chat widget and stream chat box overlay that combines Twitch and Kick chat into a single on-screen feed with 7TV emotes, badges, and platform indicators.
- **Raffle Picker** — A chat-based giveaway and raffle tool. Viewers type a keyword to enter; winners are drawn and announced on a live confetti celebration overlay.
- **OBS Bridge** — A chat-controlled scene switching and stream control tool connecting over local OBS WebSocket.
- **Emote Wall** — A floating emote overlay that turns emote-only Twitch, Kick, and 7TV chat messages into floating on-screen emotes with Calm, Chaos or Bounce animations.

## Live URLs

- [extensions.senchabot.com](https://extensions.senchabot.com/) — Widget and tool hub
- [Sub Sprout](https://extensions.senchabot.com/setup/sub-growing-plant)
- [Universal Chat](https://extensions.senchabot.com/setup/chat-widget)
- [Raffle Picker](https://extensions.senchabot.com/setup/raffle)
- [OBS Bridge](https://extensions.senchabot.com/setup/obs-bridge)
- [Emote Wall](https://extensions.senchabot.com/setup/emote-wall)

## Widget & Tool Usage

### Sub Sprout (`/setup/sub-growing-plant`)

A visual SVG plant widget and subscriber goal overlay that grows in stages whenever a subscription event occurs.

**How it works:**
- Listens to Twitch subs/resubs/gift subs via tmi.js and Kick's Pusher WebSocket — supports both platforms simultaneously in a single browser source.
- 10 plant varieties (`classic`, `rose`, `sunflower`, `cactus`, `tulip`, `pine`, `lotus`, `lily`, `palm`, `vine`), each with multiple growth stages.
- When the plant reaches full growth, the next sub resets it according to the plant changing mode (`fixed`, `cycle`, `random`).
- Mods and the broadcaster can type `!grow` in chat to manually advance the plant.

**Setup:**
1. Go to `/setup/sub-growing-plant`.
2. Select Twitch, Kick, or Both and enter your channel name(s).
3. Copy the generated widget URL.
4. Paste it into OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources as a **Browser Source**.

You can also build the widget URL directly without the setup page:

```
https://extensions.senchabot.com/widgets/sub-sprout-widget?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&variety=classic&pick=fixed&water=off&countfx=1
```

**URL parameters:** `twitch`, `kick`, `variety`, `pick` (`fixed` | `cycle` | `random`), `water` (`off` | `rain` | `sparkle`), `countfx` (`0` | `1`), `potlabel` (`0` | `1`, stage text like `3/10` on the pot), `simulate` (`auto` | `1` | `0`). Older URLs using `channel` + `platform` still work.

---

### Universal Chat (`/setup/chat-widget`)

A multi-chat widget and stream chat box overlay that combines Twitch and Kick chat into a single, cohesive on-screen overlay. Designed for streamers who multistream to both platforms.

**How it works:**
- Connects to Twitch IRC anonymously and Kick's Pusher WebSocket.
- Parses 7TV emotes, sub badges, and platform indicators for both services.
- Supports configurable font size, background opacity, themes, and vertical/horizontal layout.
- Messages auto-fade or stay pinned on-screen.

**Setup:**
1. Go to `/setup/chat-widget`.
2. Enter your Twitch channel and/or Kick channel.
3. Customize font size, background, opacity, and orientation.
4. Copy the generated URL into OBS Studio, Streamlabs Desktop, XSplit, or your preferred streaming software as a **Browser Source**.

---

### Raffle Picker (`/setup/raffle`)

A chat-based giveaway tool and raffle widget with a browser source overlay for winner announcements.

**How it works:**
- Monitors Twitch IRC or Kick Pusher for messages matching your configured keyword (default `!join`).
- Validates entry rules: sub-only mode, minimum sub months, max wins per user.
- When you draw a winner, a random participant is selected and broadcast to the overlay with `canvas-confetti` fireworks.
- The overlay shows the winner's name for 10 seconds, then hides.
- State persists in `localStorage` so you don't lose entries on refresh.

**Setup:**
1. Go to `/setup/raffle`.
2. Configure platform, channel, entry keyword, and restrictions.
3. Click **Start Raffle** to collect entries from chat.
4. Add `/widgets/raffle-overlay` to OBS Studio, Streamlabs Desktop, XSplit, or any software supporting browser sources as a **Browser Source** (usually centered or full-screen).
5. Click **Draw Winner** when ready.

---

### OBS Bridge (`/setup/obs-bridge`)

A local WebSocket bridge that lets streamers and moderators control OBS Studio scenes and recording directly from chat commands.

**How it works:**
- Connects directly to OBS Studio via WebSocket (`ws://localhost:4455`).
- Enables chat commands like `!scene <name>`, `brb`, `back`, `!startstream`, and `!startrecord`.
- Supports moderator/user whitelists and custom scene names.

**Setup:**
1. Go to `/setup/obs-bridge`.
2. Enter your channel and local OBS WebSocket port/password.
3. Keep the tool open in a tab or add as a Browser Source / Custom Dock in OBS Studio or Streamlabs Desktop.

---

### Emote Wall (`/setup/emote-wall`)

A floating emote overlay that turns emote-only Twitch, Kick, and 7TV chat messages into floating on-screen emotes. Normal text messages are ignored.

**How it works:**
- Connects to Twitch IRC anonymously and Kick's Pusher WebSocket — supports both platforms simultaneously in a single browser source.
- Detects emote-only messages: Twitch native emotes, Kick native `[emote:id:name]` tokens, 7TV channel emotes, and mixed messages.
- Three animation modes: `calm` (emotes pop up at random spots, drift, and fade out), `chaos` (emotes zip across the screen from random borders and vanish halfway or at the far side), and `bounce` (emotes ricochet off the screen edges and speed up with every hit).

**Setup:**
1. Go to `/setup/emote-wall`.
2. Enter your Twitch channel and/or Kick channel.
3. Pick Calm, Chaos or Bounce mode and customize size, duration, and max simultaneous emotes.
4. Copy the generated URL into OBS Studio, Streamlabs Desktop, XSplit, or your preferred streaming software as a full-canvas **Browser Source** (e.g. 1920×1080).

You can also build the widget URL directly without the setup page:

```
https://extensions.senchabot.com/widgets/emote-wall?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&mode=chaos
```

**URL parameters:** `twitch`, `kick`, `sevenTv` (`true` | `false`), `mode` (`calm` | `chaos` | `bounce`), `subsOnly` (`true` | `false`), `subDurationX2` (`true` | `false`, sub emotes stay 2x longer), `showAllEmotes` (`true` | `false`, also show emotes in normal messages), `hypeMode` (`true` | `false`, only show emotes doubled by 2+ users), `spamBlock` (`true` | `false`, default on, block same-user emote spam), `size` (32–256), `duration` (2–30 seconds), `max` (1–120), `mock` (`true` | `false`).

## Getting Started (Local Development)

```bash
npm install
npm run dev
```

The dev server runs on port 3000 by default.

## Building For Production

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/):

```bash
npm run test
```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/):

```bash
npm run lint
npm run format
npm run check
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Project Structure

```
.
├── src/routes/
│   ├── index.tsx                   # Widget and tool hub landing page
│   ├── setup/
│   │   ├── sub-growing-plant.tsx   # Sub Sprout configuration
│   │   ├── chat-widget.tsx         # Universal Chat configuration
│   │   ├── raffle.tsx              # Raffle configuration
│   │   └── emote-wall.tsx          # Emote Wall configuration
│   └── widgets/
│       ├── sub-sprout-widget.tsx   # Sub Sprout overlay
│       ├── chat-widget.tsx         # Universal Chat overlay
│       ├── raffle-overlay.tsx      # Raffle winner overlay
│       └── emote-wall.tsx          # Emote Wall overlay
├── src/features/widgets/           # Widget and tool logic and components
├── src/hooks/                      # Shared hooks (raffle state, chat connections)
├── src/styles.css                  # Tailwind CSS entry
└── vite.config.ts                  # Vite + TanStack Router config
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are auto-generated from files in `src/routes/`.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md).
