# Senchabot Extensions

Free, open-source streaming widgets and tools for Twitch and Kick. Configure and embed overlays into OBS, Streamlabs, or any browser-source-ready software in seconds. No account required.

## What It Does

Senchabot Extensions provides free streaming widgets and tools for Twitch and Kick streamers. Each tool runs as a browser source overlay that you can add to OBS, Streamlabs, or XSplit in seconds.

- **Sub Sprout** — A visual plant widget that grows with each subscription, resub, or gift sub. Resets after reaching full growth.
- **Universal Chat** — A chat merge tool that combines Twitch and Kick chat into a single on-screen overlay with emotes, badges, and platform indicators.
- **Raffle** — A chat-based giveaway tool. Viewers type a keyword to enter; winners are drawn and announced on an overlay with confetti.

## Live URLs

- [extensions.senchabot.com](https://extensions.senchabot.com/) — Widget and tool hub
- [Sub Sprout](https://extensions.senchabot.com/setup/sub-growing-plant/)
- [Universal Chat](https://extensions.senchabot.com/setup/chat-widget/)
- [Raffle](https://extensions.senchabot.com/setup/raffle/)

## Widget/Tool Usage

### Sub Sprout (`/setup/sub-growing-plant`)

A visual SVG plant widget that grows in stages whenever a subscription event occurs.

**How it works:**
- Listens to Twitch subs/resubs/gift subs via ComfyJS.
- Also connects to Kick's Pusher WebSocket for subscription events.
- Has 5 growth stages (0–4). Each sub advances it by one.
- Once it hits stage 4, the next sub resets it to the seedling stage, creating a looping animation.
- Mods and the broadcaster can type `!grow` in Twitch chat to manually advance the plant.

**Setup:**
1. Go to `/setup/sub-growing-plant`.
2. Enter your channel name and select the platform (Twitch or Kick).
3. Copy the generated widget/tool URL.
4. Paste it into OBS, Streamlabs, or XSplit as a **Browser Source**.

---

### Universal Chat (`/setup/chat-widget`)

A chat merge tool that combines Twitch and Kick chat into a single, cohesive on-screen overlay. Designed for streamers who multistream to both platforms.

**How it works:**
- Connects to Twitch IRC anonymously and Kick's Pusher WebSocket.
- Parses emotes, badges, and platform indicators for both services.
- Supports configurable font size, background opacity, and vertical/horizontal layout.
- Messages auto-fade after 30 seconds.

**Setup:**
1. Go to `/setup/chat-widget`.
2. Enter your Twitch channel and/or Kick channel.
3. Customize font size, background, opacity, and orientation.
4. Copy the generated URL into OBS as a **Browser Source**.

---

### Raffle (`/setup/raffle`)

A chat-based giveaway tool and raffle widget with an OBS overlay for winner announcements.

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
4. Add `/widgets/raffle-overlay` to OBS as a **Browser Source** (usually centered or full-screen).
5. Click **Draw Winner** when ready.

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
