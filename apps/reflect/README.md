# Reflect Web App

Web application for managing Senchabot, its commands and configuring the bot.

## Reflect uses

- [React](https://react.dev/)
- [Next.js](https://nextjs.org)
- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Material UI](https://mui.com)
- [tRPC](https://trpc.io)
- [Zod](https://zod.dev)
- [React Hook Form](https://react-hook-form.com/)
- [emotion](https://emotion.sh/)
- [superjson](https://github.com/blitz-js/superjson)
- [Jotai](https://jotai.org/)

## Getting Started

1. Clone the repository

   ```sh
   git clone https://github.com/senchabot-dev/monorepo.git
   cd monorepo
   ```

2. Install the dependencies

   ```sh
   npm install
   # or
   yarn install
   ```

3. If you hadn't done for main directory,  please change into main directory and create a `.env` file based on the example file `env.example`

   ```sh
   cp env.example .env
   ```

4. If you hadn't done for main directory, please change into main directory and build up a Docker container for Postgres database

   ```sh
   docker-compose up --build
   # If you want to run the Docker container in the background, run this command instead of the command above:
   docker-compose up -d
   ```

5. Create a `.env` file based on the example file `env.example`

   ```sh
   cp env.example .env
   ```

6. Run the `Prisma` migration to create the tables

   ```sh
   npx prisma db push
   ```

Finally, start the development server:

```bash
npm run dev
# or
yarn dev
```

## Folder Tree

```bash
├── docker-compose.yml
├── env.example
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── prisma
│   └── schema.prisma
├── public
│   └── favicon.png
├── README.md
├── src
│   ├── api
│   │   └── index.ts
│   ├── components
│   │   ├── app
│   │   │   ├── AccountMenu.tsx
│   │   │   ├── AppBar
│   │   │   │   ├── AppBarButton.tsx
│   │   │   │   ├── buttons
│   │   │   │   │   ├── GetDiscordBotButton.tsx
│   │   │   │   │   └── GetTwitchBotButton.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── AppContainer.tsx
│   │   │   ├── AppDrawer.tsx
│   │   │   ├── AppSearch.tsx
│   │   │   ├── AppSnackbar.tsx
│   │   │   ├── BotActivity.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── index.tsx
│   │   │   └── SystemMessage.tsx
│   │   ├── auth
│   │   │   ├── AuthContainer.tsx
│   │   │   ├── AuthDialog.tsx
│   │   │   └── LinkAccount.tsx
│   │   ├── button
│   │   │   └── DeleteAccount.tsx
│   │   ├── common
│   │   │   ├── AppBarTitle.tsx
│   │   │   ├── Header.tsx
│   │   │   └── VersionText.tsx
│   │   ├── FormTitle.tsx
│   │   ├── landing
│   │   │   ├── LandingAppBar.tsx
│   │   │   ├── LandingButton.tsx
│   │   │   ├── LandingContainer.tsx
│   │   │   ├── LandingFooter.tsx
│   │   │   ├── LandingGrid.tsx
│   │   │   └── LandingTexts.tsx
│   │   ├── LibraryText.tsx
│   │   ├── loading
│   │   │   ├── LoadingBox.tsx
│   │   │   └── Loading.tsx
│   │   ├── Offset.tsx
│   │   ├── tab
│   │   │   ├── BotManagement
│   │   │   │   └── index.tsx
│   │   │   └── SettingTopTab.tsx
│   │   ├── tabpanel
│   │   │   ├── HorizontalTabPanel.tsx
│   │   │   └── VerticalTabPanel.tsx
│   │   ├── Tooltip.tsx
│   │   └── TypingEffect.tsx
│   ├── env
│   │   ├── client.mjs
│   │   ├── schema.mjs
│   │   └── server.mjs
│   ├── forms
│   │   ├── PrivacyForm.tsx
│   │   ├── SecurityForm.tsx
│   │   └── TwitchBotForm.tsx
│   ├── pages
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth].ts
│   │   │   ├── cmd
│   │   │   │   └── index.ts
│   │   │   ├── discord
│   │   │   ├── features.ts
│   │   │   ├── restricted.ts
│   │   │   ├── trpc
│   │   │   │   └── [trpc].ts
│   │   │   └── twitch
│   │   │       └── get-bot.ts
│   │   ├── app
│   │   │   ├── index.tsx
│   │   │   └── settings.tsx
│   │   ├── _app.tsx
│   │   ├── auth
│   │   │   ├── index.tsx
│   │   │   └── signin.tsx
│   │   ├── cookie-policy.tsx
│   │   ├── credits.tsx
│   │   ├── eula.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── privacy-policy.tsx
│   │   └── terms.tsx
│   ├── server
│   │   ├── common
│   │   │   └── get-server-auth-session.ts
│   │   ├── db
│   │   │   └── client.ts
│   │   ├── router
│   │   │   ├── botactivities.ts
│   │   │   ├── check.ts
│   │   │   ├── context.ts
│   │   │   ├── example.ts
│   │   │   ├── index.ts
│   │   │   ├── protected-example-router.ts
│   │   │   ├── protected-router.ts
│   │   │   ├── security.ts
│   │   │   └── twitchbot.ts
│   │   └── trpc.ts
│   ├── styles
│   │   ├── globals.css
│   │   └── index.ts
│   ├── types
│   │   ├── index.ts
│   │   └── next-auth.d.ts
│   ├── utils
│   │   ├── functions.ts
│   │   ├── session.ts
│   │   ├── theme.ts
│   │   └── trpc.ts
│   └── validation
│       ├── color.ts
│       ├── senchaconfig.ts
│       └── twitchbotconfig.ts
├── tsconfig.json
└── vercel.json
```

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](../../CONTRIBUTING.md) first.
