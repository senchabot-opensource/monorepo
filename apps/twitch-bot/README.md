# Senchabot Twitch Bot

Twitch bot written in Go!

## Getting Started

Prerequisites

* Go 1.19 or later

Installing

1. Clone the repo and navigate to the monorepo directory
   ```sh
   git clone https://github.com/senchabot-dev/monorepo.git
   cd monorepo
   ```

2. Navigate to the project directory and install the required packages
   ```sh
   cd apps/twitch-bot
   go mod install
   ```

## Usage

1. Set enviroment variables
   ```sh
   echo 'MYSQL_DATABASE_URL="mysql_database_connection_uri"' >> .env
   echo 'OAUTH="twitch_oauth_token"' >> .env
   ```

2. Once you have set these enviroment variables, you can start the bot by running:
   ```sh
   go run ./cmd/main
   ```

## Structure

```bash
├── client
│   └── client.go
├── cmd
│   └── main
│       └── main.go
├── go.mod
├── go.sum
├── internal
│   ├── backend
│   │   ├── backend.go
│   │   └── mysql
│   │       └── mysql.go
│   ├── command
│   │   ├── addcommand.go
│   │   ├── command.go
│   │   ├── deletecommand.go
│   │   ├── frontendship.go
│   │   ├── helpers
│   │   │   └── helpers.go
│   │   ├── invite.go
│   │   ├── kampus.go
│   │   ├── ping.go
│   │   ├── senchabot.go
│   │   └── updatecommand.go
│   ├── db
│   │   └── db.go
│   ├── handler
│   │   ├── botjoin.go
│   │   ├── handler.go
│   │   └── privatemessage.go
│   └── models
│       └── models.go
└── server
    └── server.go
```

## Contributing
Contributions are always welcome! Please read the [contribution guidelines](../../CONTRIBUTING.md) first.
