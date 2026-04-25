# Senchabot Twitch Bot

A Twitch chat bot for custom commands, aliases, timers, shoutouts, clip creation, and moderation. Written in Go.

## What It Does

- **Custom Chat Commands** — Create, update, and delete text commands with placeholders like `{user}`, `{channel}`, and `{date}`.
- **Command Aliases** — Map shortcuts to existing commands (e.g., `!hello` → `!hi`).
- **Command Timers** — Auto-repeat a command in chat on a set interval (up to 3 per channel).
- **Shoutouts & Clips** — Trigger Twitch shoutouts with a custom format and create clips on demand.
- **Cooldown System** — Per-user cooldowns to prevent command spam.
- **Permission System** — Broadcaster-only or moderator-allowed command management (configurable).

## Prerequisites
- Go 1.24 or higher
- Environment variables set in `.env` (see `env.example`)
- If you haven't done prerequisites written in [monorepo/README.md](../../README.md), please change into main directory and follow steps there first.

## Setup
1. Copy the example environment file:
   ```sh
   cp env.example .env
   ```
2. Fill in the required values in `.env`.
   - `OAUTH` — Twitch bot OAuth token (format: `oauth:...`)
   - `DATABASE_URL` — PostgreSQL connection string
   - `WEBHOOK_TOKEN` — Webhook token for external integrations
3. Download dependencies:
   ```sh
   go mod download
   ```

## Running the Bot

From the monorepo root, `docker-compose up -d` also starts this bot (along with PostgreSQL, pgAdmin, the web app, and the Discord bot).

To run it standalone:
```sh
go run ./cmd/main
```

## Adding the Bot to Your Channel

The bot does not auto-join channels. To add it:
1. Whisper the bot: `!invite`
2. The bot will join your channel and seed optional default commands.

To remove it, type `!leave` in your own channel (broadcaster only).

## Command Reference

Commands use the `!` prefix. Broadcaster-only commands can optionally allow moderators if `mods_manage_cmds_enabled` is turned on.

### Channel Management

| Command | Who Can Use | Description |
|---------|-------------|-------------|
| `!invite` | Whisper only | Adds your channel to the bot and makes it join your chat. |
| `!leave` | Broadcaster only | Removes your channel from the bot and makes it leave your chat. |

### Custom Commands (Broadcaster / Mod*)

| Command | Description |
|---------|-------------|
| `!acmd <name> <content>` | Add a custom text command. Content supports variables like `{user}`, `{channel}`, `{date}`. |
| `!ucmd <name> <new-content>` | Update an existing custom command. |
| `!dcmd <name>` | Delete a custom command. |
| `!acmda <alias> <command>` | Add a command alias (e.g., `!acmda hello hi` makes `!hello` run `!hi`). |
| `!dcmda <alias>` | Delete a command alias. |
| `!cmds` | List all available commands (custom + system). |

### Timers (Broadcaster / Mod*)

| Command | Description |
|---------|-------------|
| `!atimer <command> <interval>` | Enable a repeating timer for a command. Interval is in minutes. Max 3 timers per channel. |
| `!dtimer <command>` | Disable/delete a command timer. |
| `!timers` | List all active command timers. |
| `!timer` | Show help text for the timer system. |

### Engagement

| Command | Who Can Use | Description |
|---------|-------------|-------------|
| `!so <username>` | Broadcaster / Mod* | Perform a Twitch shoutout for the given streamer. Message format is customizable via settings. |
| `!clip` | Broadcaster / Mod* | Create a Twitch clip for the current stream and return the clip URL. |
| `!ping` | Anyone | Responds with `pong! VoHiYo`. |
| `!help` | Anyone | Lists all system commands. |

\* Mods can execute these only if the `mods_manage_cmds_enabled` config setting is turned on.

## Command Variables

Custom command content supports these placeholders:
- `{user}` — The user who triggered the command
- `{channel}` — The current channel name
- `{date}` — Current date
- Additional variables may be configured via the web dashboard.

## Project Structure
```
.
├── client/         # Twitch API client
├── cmd/            # Entrypoint
├── internal/       # Commands, handlers, services
├── env.example     # Example environment variables
├── Dockerfile      # Container config
├── fly.toml        # Deployment config
└── README.md
```

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](../../CONTRIBUTING.md) first.
