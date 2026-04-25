# Senchabot Web Dashboard

A Next.js web dashboard for managing Senchabot bots, commands, settings, and streamer tools.

## What It Does

- **Unified Bot Management** — Manage Discord servers and Twitch channels from one account.
- **Command Management** — Create, edit, enable/disable, and search custom commands. View system and global command references.
- **Command Variables** — Define reusable variables to inject into command responses.
- **Livestream Settings** — Configure Twitch streamer tracking, announcement channels, and event channels for Discord.
- **Streamer Tools** — Display a sub-sprout growth animation, and generate Twitch sub badges with background removal.

## Prerequisites
- Node.js 18 or higher
- npm, pnpm, or yarn
- Environment variables set in `.env` (see `env.example` if available)

## Setup
1. Install dependencies:
   ```sh
   npm install
   # or
   pnpm install
   ```
2. Copy the example environment file (if present):
   ```sh
   cp env.example .env
   ```
3. Fill in the required values in `.env`.

## Running the App
```sh
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Authentication
- Log in with **Twitch** and/or **Discord** OAuth
- Link both accounts to a single Senchabot profile

### Dashboard Home (`/dashboard`)
- View your connected **Servers & Channels**
- Invite the Discord bot to new servers
- Have the Twitch bot join your channel

### Entity Overview (`/dashboard/[platform]/[id]`)
- See the last 10 **audit log entries** (who ran what command/admin action and when)
- Platform can be `twitch` or `discord`

### Commands (`/dashboard/[platform]/[id]/commands`)
- **Custom** — Create, edit, delete, enable/disable, and search custom commands
- **Global** — Read-only list of shared/global commands available to the entity
- **System** — Built-in bot command reference (e.g., `!ping`, `!so`, `!clip`, `/set-twitch`, `/purge`)
- **Variables** — Define custom command variables (templated placeholders like `{varname}`) to reuse across command responses

### Discord-Specific Pages
- **Announcements** (`/dashboard/discord/[id]/announcements`) — Add/remove Twitch streamers for live announcements, choose target channels, and set custom announcement text
- **Event Channels** (`/dashboard/discord/[id]/event-channels`) — Select which announcement channels should trigger automatic Discord Scheduled Event creation when a tracked streamer goes live

### Twitch Settings (`/dashboard/twitch/[id]/settings`)
- **General Settings** — Toggle switches for:
  - `bot_activity_enabled` — Enable/disable bot activity logging
  - `mods_manage_cmds_enabled` — Allow moderators to manage commands
- **Command Customizations** — Customize `so_command_message_format` (shoutout text). Supports `{twitch.username}` placeholder.

### Streamer Tools (`/dashboard/tools`)
- **Sub Sprout Overlay** — OBS browser source that shows a plant growing with each subscription. Connects to Twitch chat via ComfyJS. Resets growth cycle after 4 subs. Testable with `!grow` in chat.
- **Twitch Sub Badge Creator** — Upload an image, optionally remove background using AI, and auto-generate 18x18, 36x36, and 72x72 PNGs. Preview in a mock Twitch chat UI and download individually or all at once.

### Public Pages
- `/commands/[channel]` — Public command list for any Twitch channel (no login required)
- `/overlay/raffle` — OBS overlay for raffle winner announcements
- `/overlay/sub-sprout` — OBS overlay for sub sprout animation

## Project Structure
```
.
├── src/            # Source code (app router, components, actions)
├── public/         # Static assets
├── prisma/         # Database schema (auth-only)
├── package.json    # Project metadata
└── README.md
```

## Architecture Notes

- The web app stores only **auth/session data** in its own PostgreSQL database via Prisma.
- All bot business data (commands, settings, logs, announcements) lives in an external backend API (`API_URL`).
- Uses **NextAuth v5** with Twitch and Discord providers.
- Uses **Server Actions (ZSA)** for mutations with optimistic UI and cache revalidation.

## Related Projects

- [Senchabot Extensions](https://extensions.senchabot.com/) — Free streaming widgets/tools for Twitch and Kick
  - [Sub Sprout](https://extensions.senchabot.com/setup/sub-growing-plant/)
  - [Universal Chat](https://extensions.senchabot.com/setup/chat-widget/)
  - [Raffle](https://extensions.senchabot.com/setup/raffle/)

## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
