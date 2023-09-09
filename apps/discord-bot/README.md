# Senchabot Discord Bot

Discord bot written in Go!

## Getting Started

Prerequisites

* Go 1.19 or later
* If you haven't done prerequisites written in [monorepo/README.md](../../README.md),  please change into main directory and follow steps there first. 

## Installation

1. For setting environment variables create a `.env` file based on the example file `env.example`

   ```sh
   cp env.example .env
   ```

2. Fill the environment variables in the `.env` file

   ```sh
   # vim or another editor
   vim .env
   ```

3. Install the required packages

   ```sh
   go mod install
   ```

## Usage

1. You can start the bot by running:

   ```sh
   go run ./cmd/main
   ```

## Structure

```bash
.
├── cmd
│   └── main
│       └── main.go
├── Dockerfile
├── documentation
│   ├── feature-list.md
│   ├── README.md
│   └── TR
│       └── README.md
├── env.example
├── fly.toml
├── internal
│   ├── command
│   │   ├── addcmdaliascommand.go
│   │   ├── addcmdcommand.go
│   │   ├── cmdscommand.go
│   │   ├── command.go
│   │   ├── deletecmdaliascommand.go
│   │   ├── deletecmdcommand.go
│   │   ├── deletecommand.go
│   │   ├── helpers
│   │   │   └── helpers.go
│   │   ├── invitecommand.go
│   │   ├── purgecommand.go
│   │   ├── setcommand.go
│   │   └── updatecmdcommand.go
│   └── service
│       ├── event
│       │   └── event.go
│       ├── service.go
│       └── streamer
│           └── streamer.go
└── README.md
```

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](../../CONTRIBUTING.md) first.
