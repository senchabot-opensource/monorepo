# Senchabot Monorepo

Open source bots for Discord, Twitch, and a web dashboard.

## Monorepo Structure

- `apps/` - Application entrypoints (bots, web dashboard)
- `pkg/` - Shared Go packages
- `helper/` - Utility scripts and helpers
- `service/` - Service layer code
- `model/` - Data models
- `config/` - Configuration files
- `db/` - Database-related files

## Prerequisites

- Git
- Go 1.24 or higher
- Node.js 18 or higher
- npm, pnpm, or yarn
- Docker & Docker Compose

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/senchabot-opensource/monorepo.git
   cd monorepo
   ```
2. **Set up environment variables**
   - Copy `.env.example` files to `.env` in each app or service as needed.
   - Fill in required values.
3. **Install dependencies**
   - For Go apps:
     ```sh
     go mod download
     ```
   - For web app:
     ```sh
     cd apps/web
     npm install # or pnpm install
     ```
4. **Start services**
   - Start database and dependencies:
     ```sh
     docker-compose up -d
     ```

5. **Run apps**
   - See each app's README for specific instructions.

## Documentation

- [Web App](./apps/web/README.md)
- [Discord Bot](./apps/discord-bot/README.md)
- [Twitch Bot](./apps/twitch-bot/README.md)

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](./CONTRIBUTING.md) first.
