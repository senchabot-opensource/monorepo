# Senchabot Web Dashboard

A Next.js web dashboard for managing Senchabot bots and settings.

## Prerequisites
- Node.js 18 or higher
- npm, pnpm, or yarn
- Environment variables set in `.env` (see `env.example` if available)

## Setup
1. Install dependencies:
   ```sh
   npm install
   # or
   pnpm install
   ```
2. Copy the example environment file (if present):
   ```sh
   cp env.example .env
   ```
3. Fill in the required values in `.env`.

## Running the App
```sh
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
.
├── src/            # Source code
├── public/         # Static assets
├── prisma/         # Database schema
├── package.json    # Project metadata
└── README.md
```

## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
