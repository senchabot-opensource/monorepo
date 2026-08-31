# Senchabot Extensions

Free, open-source customizable stream overlays, multi-chat widgets, and streaming tools for Twitch and Kick. Configure and embed overlays and tools into OBS Studio, Streamlabs Desktop, XSplit Broadcaster, vMix, Lightstream, PRISM Live Studio, Twitch Studio, Meld Studio, Wirecast, Ecamm Live, or any software that supports browser sources in seconds. No account or login required.

## What It Does

Senchabot Extensions provides 100% free streaming widgets, customizable overlays, and interactive tools for Twitch and Kick streamers. Each tool and overlay runs as a browser source that you can add to OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources in seconds.

- **Sub Sprout** — A visual plant widget and subscriber goal overlay that grows with each subscription, resub, or gift sub. Resets after reaching full growth.
- **Universal Chat** — A multi-chat widget and stream chat box overlay that combines Twitch and Kick chat into a single on-screen feed with 7TV emotes, badges, and platform indicators.
- **Raffle Picker** — A chat-based giveaway and raffle tool. Viewers type a keyword to enter; winners are drawn and announced on a live confetti celebration overlay.
- **OBS Bridge** — A chat-controlled scene switching and stream control tool connecting over local OBS WebSocket.

## Live URLs

- [extensions.senchabot.com](https://extensions.senchabot.com/) — Widget and tool hub
- [Sub Sprout](https://extensions.senchabot.com/setup/sub-growing-plant/)
- [Universal Chat](https://extensions.senchabot.com/setup/chat-widget/)
- [Raffle Picker](https://extensions.senchabot.com/setup/raffle/)
- [OBS Bridge](https://extensions.senchabot.com/setup/obs-bridge/)

## Widget & Tool Usage

### Sub Sprout (`/setup/sub-growing-plant`)

A visual SVG plant widget and subscriber goal overlay that grows in stages whenever a subscription event occurs.

**How it works:**
- Listens to Twitch subs/resubs/gift subs via ComfyJS.
- Also connects to Kick's Pusher WebSocket for subscription events.
- Has 5 growth stages (0–4). Each sub advances it by one.
- Once it hits stage 4, the next sub resets it to the seedling stage, creating a looping animation.
- Mods and the broadcaster can type `!grow` in chat to manually advance the plant.

**Setup:**
1. Go to `/setup/sub-growing-plant`.
2. Enter your channel name and select the platform (Twitch or Kick).
3. Copy the generated widget URL.
4. Paste it into OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources as a **Browser Source**.

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
│   │   └── raffle.tsx              # Raffle configuration
│   └── widgets/
│       ├── sub-sprout-widget.tsx   # Sub Sprout overlay
│       ├── chat-widget.tsx         # Universal Chat overlay
│       └── raffle-overlay.tsx      # Raffle winner overlay
├── src/features/widgets/           # Widget and tool logic and components
├── src/hooks/                      # Shared hooks (raffle state, chat connections)
├── src/styles.css                  # Tailwind CSS entry
└── vite.config.ts                  # Vite + TanStack Router config
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are auto-generated from files in `src/routes/`.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md).
