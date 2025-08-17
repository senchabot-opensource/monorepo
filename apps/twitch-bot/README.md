# Senchabot Twitch Bot

A Twitch chat bot written in Go.

## Prerequisites
- Go 1.24 or higher
- Environment variables set in `.env` (see `env.example`)
- If you haven't done prerequisites written in [monorepo/README.md](../../README.md),  please change into main directory and follow steps there first. 

## Setup
1. Copy the example environment file:
   ```sh
   cp env.example .env
   ```
2. Fill in the required values in `.env`.
3. Download dependencies:
   ```sh
   go mod download
   ```

## Running the Bot
```sh
go run ./cmd/main
```

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
