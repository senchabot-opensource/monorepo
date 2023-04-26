# Senchabot Monorepo
Senchabot apps and packages

#### [apps/reflect](./apps/reflect) - The web app: [senchabot.app](https://senchabot.app/)
> _Web application for managing Senchabot, its commands and configuring the bot._ 
#### [apps/interface](./apps/interface) - Senchabot web interface app: [interface.senchabot.app](https://interface.senchabot.app/)
> _Web application to use Senchabot through a web interface similar to the sci-fi themes._
#### [apps/discord-bot](./apps/discord-bot)
#### [apps/twitch-bot](./apps/twitch-bot)

## Getting Started
### Prerequisites
* Git
* Node.js 18 or higher

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/senchabot-dev/monorepo.git
   cd monorepo
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Run turbo build

   ```sh
   npx turbo build
   ```

4. Create a `.env` file based on the example file `env.example`

   ```sh
   cp env.example .env
   ```

5. Let's build up a Docker container for Postgres database

   ```sh
   docker-compose up --build
   # If you want to run the Docker container in the background, run this command instead of the command above:
   docker-compose up -d
   ```

## Documentations
- ### Apps
   * [reflect](./apps/reflect/README.md)
   * [interface](./apps/interface/README.md)
   * [discord-bot](./apps/discord-bot/README.md)
   * [twitch-bot](./apps/twitch-bot/README.md)

## Contributing
Contributions are always welcome! Please read the [contribution guidelines](./CONTRIBUTING.md) first.
