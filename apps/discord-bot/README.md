# Senchabot Discord Bot

A Discord bot for Twitch livestream announcements, custom slash commands, moderation, and privacy controls. Written in Go.

## What It Does

- **Twitch Livestream Announcements** — Track Twitch streamers and post embeds to a Discord channel when they go live. Supports custom message templates, per-streamer overrides, and category filtering.
- **Auto Discord Scheduled Events** — When a streamer goes live, the bot can automatically create a Discord Scheduled Event for the stream. Configure which announcement channels trigger event creation with `/set-twitch event-channel`.
- **Custom Slash Commands** — Create guild-specific slash commands with variables. They are deployed instantly as real Discord Application Commands.
- **Moderation** — Bulk delete recent messages by content or author pattern, and clean up bot-created scheduled events.
- **Privacy Controls** — Users can opt in or out of message content tracking.

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
   - `TOKEN` — Discord bot token
   - `CLIENT_ID` — Discord application client ID
   - `DATABASE_URL` — PostgreSQL connection string
   - `TWITCH_CLIENT_ID` — Twitch app client ID
   - `TWITCH_CLIENT_SECRET` — Twitch app client secret
3. Download dependencies:
   ```sh
   go mod download
   ```

## Running the Bot

From the monorepo root, `docker-compose up -d` also starts this bot (along with PostgreSQL, pgAdmin, the web app, and the Twitch bot).

To run it standalone:
```sh
go run ./cmd/main
```

## Command Reference

All commands are registered as Discord slash commands. Some require the **Manage Server** permission.

### Twitch Announcements (Manage Server)

| Command | Description |
|---------|-------------|
| `/set-twitch streamer <twitch-username-or-url> [channel]` | Add a Twitch streamer to track. When they go live, an announcement is posted to the specified channel (or the default channel). Validates the Twitch user before adding. |
| `/set-twitch announcement default-channel <channel>` | Set the default Discord text channel for all streamer announcements. |
| `/set-twitch announcement default-content <text>` | Set the default announcement message template. Supports placeholders: `{twitch.username}`, `{twitch.url}`, `{stream.category}`, `{stream.title}`. |
| `/set-twitch announcement custom-content <username> <text>` | Set a custom announcement message for a specific streamer, overriding the default. |
| `/set-twitch announcement category-filter <channel> <regex> <condition>` | Filter announcements per channel using a regex against the stream category. Condition: `matches` or `does not match`. |
| `/set-twitch event-channel <channel>` | When a Twitch announcement is posted in this channel, also create a Discord Scheduled Event for the live stream. |
| `/del-twitch streamer <username>` | Remove a Twitch streamer from announcements. |
| `/del-twitch announcement default-channel` | Remove the default announcement channel setting. |
| `/del-twitch announcement default-content` | Reset announcement content to the built-in default. |
| `/del-twitch announcement custom-content <username>` | Remove per-streamer custom announcement content. |
| `/del-twitch announcement category-filter <channel>` | Remove a channel's category filter. |
| `/del-twitch event-channel <channel>` | Remove a channel from the event creation list. |
| `/streamer-list` | List all Twitch streamers currently configured for announcements. |

### Moderation (Manage Server)

| Command | Description |
|---------|-------------|
| `/purge events` | Delete all Discord Scheduled Events created by the bot. |
| `/purge last-100-channel-messages [message-content] [username]` | Bulk delete up to 100 messages not older than 14 days. Filter by message content substring or username substring. At least one filter must be provided. |

### Custom Commands (Manage Server)

| Command | Description |
|---------|-------------|
| `/acmd <name> <content>` | Add a custom slash command for this server. Deployed immediately as a guild-specific slash command. Name must be 1–32 characters, lowercase, letters/numbers/hyphens only. |
| `/ucmd <name> <new-content>` | Update an existing custom command's content. |
| `/dcmd <name>` | Delete a custom command and remove its slash command registration. |
| `/cmds` | List all available commands (system + custom) for this server. |

### General Commands

| Command | Description |
|---------|-------------|
| `/invite` | Returns the bot's OAuth2 invite URL. |
| `/track-my-messages` | Opt in to having your message content tracked by Senchabot. |
| `/do-not-track-my-messages` | Opt out of message content tracking. |

## Project Structure
```
.
├── cmd/            # Entrypoint
├── internal/       # Commands, handlers, services
├── env.example     # Example environment variables
├── Dockerfile      # Container config
├── fly.toml        # Deployment config
└── README.md
```

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](../../CONTRIBUTING.md) first.
