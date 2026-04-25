# Senchabot Monorepo

Senchabot is an open-source, multi-platform bot and streamer toolkit. It includes a **Discord bot** (Go), a **Twitch chat bot** (Go), a **web dashboard** (Next.js), and free **browser-source streaming widgets/tools** for OBS.

## What It Does

- **Discord Bot** — Twitch livestream announcements, custom slash commands, message purging, and privacy controls for your server.
- **Twitch Bot** — Custom chat commands, command aliases, repeating timers, shoutouts, clip creation, and moderation tools for your channel.
- **Web Dashboard** — Manage both bots, configure settings, run chat raffles, create Twitch sub badges, and control sub-sprout overlays from one place.
- **Streaming Widgets/Tools** — Free OBS overlays: a growing plant for subs, merged Twitch/Kick chat, and chat-based raffle winner announcements.

## Monorepo Structure

- `apps/` — Application entrypoints (bots, web dashboard, streaming widgets)
  - `discord-bot/` — Discord bot (Go)
  - `twitch-bot/` — Twitch chat bot (Go)
  - `web/` — Next.js dashboard and streamer tools
  - `extensions/` — OBS browser-source widgets/tools (React + Vite)
- `pkg/` — Shared Go packages
- `helper/` — Utility scripts and helpers
- `service/` — Service layer code
- `model/` — Data models
- `config/` — Configuration files
- `db/` — Database-related files

## Prerequisites

- Git
- Go 1.24 or higher
- Node.js 18 or higher
- npm, pnpm, or yarn
- Docker & Docker Compose

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/senchabot-opensource/monorepo.git
   cd monorepo
   ```
2. **Set up environment variables**
   - Copy `.env.example` files to `.env` in each app or service as needed.
   - Fill in required values.
3. **Install dependencies**
   - For Go apps:
     ```sh
     go mod download
     ```
   - For web app:
     ```sh
     cd apps/web
     npm install # or pnpm install
     ```
4. **Start services**
   - From the monorepo root, `docker-compose up -d` starts PostgreSQL, pgAdmin, the web dashboard, the Discord bot, and the Twitch bot together:
     ```sh
     docker-compose up -d
     ```
   - You can also run apps individually. See each app's README for specific instructions.

5. **Run apps individually**
   - See each app's README for specific instructions.

## Feature Overview

### Discord Bot
- **Twitch Announcements** — Track Twitch streamers and post embeds when they go live. Supports custom message templates, per-streamer overrides, and category filtering.
- **Auto Discord Scheduled Events** — Automatically create Discord Scheduled Events when tracked streamers go live. Configure which channels trigger events via `/set-twitch event-channel`.
- **Custom Slash Commands** — Create guild-specific slash commands with variables. Deployed instantly as real Discord Application Commands.
- **Moderation** — Bulk delete recent messages by content or author pattern. Clean up bot-created scheduled events.
- **Privacy Controls** — Users can opt in or out of message content tracking.

### Twitch Bot
- **Custom Chat Commands** — Create, update, and delete text commands with placeholders (`{user}`, `{channel}`, `{date}`, etc.).
- **Command Aliases** — Map shortcuts to existing commands (e.g., `!hello` → `!hi`).
- **Command Timers** — Auto-repeat a command on a set interval (up to 3 per channel).
- **Shoutouts & Clips** — Trigger Twitch shoutouts with a custom format and create clips on demand.
- **Permissions** — Broadcaster-only or moderator-allowed command management (configurable).
- **Cooldowns** — Per-user cooldowns to prevent command spam.

### Web Dashboard
- **Unified Management** — Manage Discord servers and Twitch channels from one account.
- **Command Management** — Create, edit, enable/disable, and search custom commands. View system and global command references.
- **Command Variables** — Define reusable variables to inject into command responses.
- **Livestream Settings** — Configure Twitch streamer tracking, announcement channels, and event channel linking for Discord.
- **Streamer Tools** — Run chat raffles with OBS overlay, display a sub-sprout growth animation, and generate Twitch sub badges with background removal.
- **Public Command Page** — Share your Twitch command list at `/commands/<channel>` without requiring login.

### Streaming Widgets
All widgets/tools work as OBS Browser Sources. No account required.

- **Sub Sprout** — An SVG plant that grows with each subscription, resub, or gift sub. Supports manual growth via `!grow`. Resets after reaching max stage.
- **Universal Chat** — Merges Twitch and Kick chat into one overlay with emotes, badges, platform indicators, and auto-fading messages.
- **Raffle** — Chat-based giveaway tool. Viewers type a keyword to enter. Draw a winner and broadcast their name on an overlay with confetti.

## Documentation

- [Web App](./apps/web/README.md) — Dashboard setup, API routes, and streamer tools
- [Discord Bot](./apps/discord-bot/README.md) — Slash command reference and feature details
- [Twitch Bot](./apps/twitch-bot/README.md) — Chat command reference and feature details
- [Extensions](./apps/extensions/README.md) — Widget setup and usage

## Live Instances

- [Dashboard](https://senchabot.com/)
- [Extensions](https://extensions.senchabot.com/)

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](./CONTRIBUTING.md) first.
