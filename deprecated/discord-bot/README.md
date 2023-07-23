# Senchabot Discord Bot

## Getting Started

### Prerequisites
* Node.js (v18 or higher) and npm

### Installation
1. Clone the repo and navigate to the monorepo directory
   ```sh
   git clone https://github.com/senchabot-dev/monorepo.git
   cd monorepo
   ```

2. Navigate to the project directory and install dependencies
   ```sh
   cd apps/discord-bot
   npm install
   ```

3. Copy env.example and set the variables in it
   ```sh
   cp env.example .env
   ```

## Usage

1. Once you have set enviroment variables, you need to deploy slash commands before start the bot:
   ```sh
   npm run deploy-cmds
   ```

2. Now you can start the bot by running:
   ```sh
   npm run dev
   ```

### Once the bot is running, you can interact with it using commands.
* `/purge` - "This command will delete the most recent 100 messages containing a specified character string in the text channel where the command was run, or messages sent by a user whose username or nickname contains the specified character string"
* `/event purge` - "This command will delete any scheduled events in the guild where the command was run"
* `/voice` - "Create dynamic voice channels"
* `/invite` - "Prints Senchabot invite url"
* `/ping` - "Pongs : D"

## Features
* [Live Stream Scheduled Events](./docs/features/live-stream-scheduled-events.md)

## Structure

```bash
.
├── commands
│   ├── event.ts
│   ├── invite.ts
│   ├── ping.ts
│   ├── purge.ts
│   └── voice.ts
├── events
│   ├── guildMemberAdd.ts
│   ├── guildMemberUpdate.ts
│   ├── interactionCreate.ts
│   ├── messageCreate.ts
│   ├── messageReactionAdd.ts
│   ├── messageReactionRemove.ts
│   ├── ready.ts
│   └── voiceStateUpdate.ts
├── handlers
│   ├── commandHandler.ts
│   └── eventHandler.ts
├── scripts
│   └── deploy-commands.ts
├── structures
│   ├── chatgptHandler.ts
│   └── octoHandler.ts
├── types
│   └── index.ts
└── utils
    ├── botFunctions.ts
    ├── dynamicVoice.ts
    ├── env.ts
    ├── helpers.ts
    ├── memberFunctions.ts
    └── scheduledEventFunctions.ts
├── .gitignore
├── .dockerignore
├── Dockerfile
├── LICENSE
├── README.md
├── client.ts
├── config.ts
├── env.example
├── index.ts
├── package.json
├── tsconfig.json
```

## Contributing
Contributions are always welcome! Please read the [contribution guidelines](../../CONTRIBUTING.md) first.
