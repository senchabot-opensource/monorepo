# Senchabot Monorepo

Open source Discord & Twitch bot

## Getting Started

### Prerequisites

- Git
- Node.js 18 or higher
- npm

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/senchabot-opensource/monorepo.git
   cd monorepo
   ```

2. Create `.env` files based on the example `env.example` files

   ```sh
   cp env.example .env
   cd packages/senchabot-prisma/env.example packages/senchabot-prisma/.env
   cp apps/web/env.example apps/web/.env
   ```

3. Install the dependencies

   ```sh
   npm install
   ```

4. Run turbo build

   ```sh
   npx turbo build
   ```

5. Let's build up a Docker container for MySQL database

   ```sh
   docker-compose up --build
   # If you want to run the Docker container in the background, run this command instead of the command above:
   docker-compose up -d
   ```
   
6. Let's generate Prisma files and database

   ```sh
   npx turbo db:generate
   npx turbo db:push
   ```


## Documentations

- ### Apps
  - [web](./apps/web/README.md)
  - [discord-bot](./apps/discord-bot/README.md)
  - [twitch-bot](./apps/twitch-bot/README.md)

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](./CONTRIBUTING.md) first.
