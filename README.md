# Senchabot

Open-source streaming toolkit for **Twitch**, **Kick** and **Discord**. One repository holds a
Twitch chat bot, a Discord bot, a web dashboard that runs both, and a set of free OBS browser
source overlays that need no account at all.

**Live:** [senchabot.com](https://senchabot.com/) — dashboard · [extensions.senchabot.com](https://extensions.senchabot.com/) — overlays and tools

| App | What it is | Built with |
| --- | --- | --- |
| [`apps/extensions`](./apps/extensions) | Free stream overlays and tools as browser sources, for Twitch and Kick | TanStack Start, Vite, React, Tailwind |
| [`apps/web`](./apps/web) | Dashboard for the bots, commands and streamer tools | Next.js, Prisma, PostgreSQL |
| [`apps/twitch-bot`](./apps/twitch-bot) | Twitch chat bot | Go |
| [`apps/discord-bot`](./apps/discord-bot) | Discord bot | Go |
| [`apps/command-server`](./apps/command-server) | gRPC server the bots ask for command data | Go |

## Free stream overlays and tools — no account, no download

[extensions.senchabot.com](https://extensions.senchabot.com/) gives every widget a browser source
URL you paste into OBS Studio, Streamlabs Desktop, XSplit, vMix, PRISM Live Studio, Twitch Studio
or anything else that supports browser sources. You configure each one in the browser, copy its
URL, and it runs on **Twitch and Kick** alike. Nothing to install, nothing to sign up for.

**Overlays**

| Overlay | What it does |
| --- | --- |
| [Sub Sprout](https://extensions.senchabot.com/setup/sub-growing-plant) | A plant that grows with every sub, resub and gift sub, and starts over at full growth |
| [Universal Chat](https://extensions.senchabot.com/setup/chat-widget) | Twitch and Kick chat merged into one on-screen feed, with 7TV, BTTV and FFZ emotes and platform badges |
| [Emote Wall](https://extensions.senchabot.com/setup/emote-wall) | Emote-only messages float across the screen, in Calm, Chaos or Bounce motion |
| [Stream Alerts](https://extensions.senchabot.com/setup/stream-alerts) | Animated alerts with sound for subs, gift subs, Bits, Kicks and raids |
| [Sub Goal](https://extensions.senchabot.com/setup/sub-goal) | A goal bar every sub and gift sub fills, with a trophy when the target lands |
| [Stream Frames](https://extensions.senchabot.com/setup/stream-frames) | Webcam, chat and screen frames drawn in the chosen preset's look, transparent in the middle |

**Tools**

| Tool | What it does |
| --- | --- |
| [Chat Poll](https://extensions.senchabot.com/setup/chat-poll) | Chat votes by typing a number; live bars, a timer and the winner at the end |
| [Raffle Picker](https://extensions.senchabot.com/setup/raffle) | Viewers enter with a keyword; the drawn winner lands on a confetti overlay |
| [Subathon Timer](https://extensions.senchabot.com/setup/subathon-timer) | Subs, gift subs, Bits and Kicks add time, shown as a health bar, a clock or a ring |
| [OBS Bridge](https://extensions.senchabot.com/setup/obs-bridge) | Chat commands switch scenes and control recording over local OBS WebSocket |

[Game presets](https://extensions.senchabot.com/presets) restyle the widgets together, every widget
has a [setup guide](https://extensions.senchabot.com/guides), and the
[changelog](https://extensions.senchabot.com/changelog) lists what changed.

## Twitch bot

- **Custom chat commands** with placeholders like `{user}`, `{channel}` and `{date}`
- **Aliases** that map a shortcut onto an existing command
- **Timers** that repeat a command on an interval, up to three per channel
- **Shoutouts and clips** on demand, with a custom shoutout format
- **Cooldowns** per user, and broadcaster-only or moderator-allowed command management

## Discord bot

- **Twitch livestream announcements** with custom templates, per-streamer overrides and category filters
- **Discord Scheduled Events** created automatically when a tracked streamer goes live
- **Custom slash commands** per guild, deployed as real Discord Application Commands
- **Moderation** — bulk delete recent messages by content or author pattern
- **Privacy controls** — viewers opt in or out of message content tracking

## Web dashboard

Manage Discord servers and Twitch channels from one account: create and edit commands and command
variables, configure livestream tracking and announcement channels, share a public command list at
`/commands/<channel>`, and open the streamer tools (chat raffle, sub badge generator, Sub Sprout).

## Running it locally

**Prerequisites:** Git · Go 1.25+ (see [`go.mod`](./go.mod)) · Node.js 20.19+ · Docker and Docker
Compose · a PostgreSQL database (Compose brings one)

Everything at once, from the repository root:

```sh
docker-compose up -d   # PostgreSQL, pgAdmin, the web app and both bots
```

Copy each app's `env.example` to `.env` and fill it in first. To run one app on its own:

```sh
# Twitch or Discord bot, from apps/twitch-bot or apps/discord-bot
go run ./cmd/main

# Dashboard, from apps/web
npm install && npm run dev            # http://localhost:3000

# Overlays and tools, from apps/extensions
npm install && npm run build && npm run preview
```

Each app's README covers its own environment variables and commands.

## Repository layout

```
apps/
  extensions/     overlays and tools (browser sources)
  web/            dashboard
  twitch-bot/     Twitch chat bot
  discord-bot/    Discord bot
  command-server/ gRPC command server
command/          bot command handlers
config/           environment configuration
db/               PostgreSQL data access
grpc/             gRPC service for bot commands
helper/           shared helpers
model/            data models
platform/         the platform names the apps share
twitchapi/        Twitch API client
```

## Documentation

- [Extensions](./apps/extensions/README.md) — every widget's options, browser source sizes, chat commands
- [Web dashboard](./apps/web/README.md) — pages, API routes and streamer tools
- [Twitch bot](./apps/twitch-bot/README.md) — chat command reference
- [Discord bot](./apps/discord-bot/README.md) — slash command reference

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for the branch and
commit conventions, and the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[GNU General Public License v3.0](./LICENSE)

Not affiliated with Twitch, Kick or Discord.
