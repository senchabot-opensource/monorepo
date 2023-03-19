# Reflect Web App

Reflect is a web app to manage your bots and stream overlays.

## Reflect uses

- [Next.js](https://nextjs.org)
- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Material UI](https://mui.com)
- [tRPC](https://trpc.io)
- [Zod](https://zod.dev)

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/your-username/monorepo.git
cd monorepo
```

Next, install the dependencies:

```bash
npm install
# or
yarn install
```

Create a `.env` file based on the example file `.env.example`:

```bash
cp .env.example .env
```

Run the `Prisma` migration to create the tables:

```bash
npx prisma db push
```

## Docker

To run the app in a Docker container, run:

```bash
docker-compose up --build
```

Finally, start the development server:

```bash
npm run dev
# or
yarn dev
```

## Folder Tree

```bash
.
├── README.md
├── env.example
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── prisma
│   └── schema.prisma
├── public
│   └── favicon.png
├── src
│   ├── components
│   │   ├── FormTitle.tsx
│   │   ├── LibraryText.tsx
│   │   ├── Offset.tsx
│   │   ├── Tooltip.tsx
│   │   ├── TypingEffect.tsx
│   │   ├── app
│   │   │   ├── AccountMenu.tsx
│   │   │   ├── AppBar.tsx
│   │   │   ├── AppBarButton.tsx
│   │   │   ├── AppContainer.tsx
│   │   │   ├── AppDrawer.tsx
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppSearch.tsx
│   │   │   ├── AppSnackbar.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── index.tsx
│   │   ├── auth
│   │   │   ├── AuthContainer.tsx
│   │   │   ├── AuthDialog.tsx
│   │   │   └── LinkAccount.tsx
│   │   ├── button
│   │   │   └── DeleteAccount.tsx
│   │   ├── common
│   │   │   └── AppBarTitle.tsx
│   │   ├── landing
│   │   │   ├── LandingAppBar.tsx
│   │   │   ├── LandingButton.tsx
│   │   │   ├── LandingFooter.tsx
│   │   │   └── LandingTexts.tsx
│   │   ├── loading
│   │   │   ├── Loading.tsx
│   │   │   └── LoadingBox.tsx
│   │   ├── tab
│   │   │   ├── Display
│   │   │   │   └── index.tsx
│   │   │   └── SettingTopTab.tsx
│   │   └── tabpanel
│   │       ├── HorizontalTabPanel.tsx
│   │       └── VerticalTabPanel.tsx
│   ├── env
│   │   ├── client.mjs
│   │   ├── schema.mjs
│   │   └── server.mjs
│   ├── forms
│   │   ├── PrivacyForm.tsx
│   │   ├── SecurityForm.tsx
│   │   ├── SenchaDisplayForm.tsx
│   │   └── TwitchDisplayForm.tsx
│   ├── pages
│   │   ├── App.css
│   │   ├── _app.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth].ts
│   │   │   ├── restricted.ts
│   │   │   └── trpc
│   │   │       └── [trpc].ts
│   │   ├── app
│   │   │   ├── index.tsx
│   │   │   └── settings.tsx
│   │   ├── auth
│   │   │   ├── index.tsx
│   │   │   └── signin.tsx
│   │   ├── cookie-policy.tsx
│   │   ├── credits.tsx
│   │   ├── eula.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── privacy-policy.tsx
│   │   └── terms.tsx
│   ├── server
│   │   ├── common
│   │   │   └── get-server-auth-session.ts
│   │   ├── db
│   │   │   └── client.ts
│   │   ├── router
│   │   │   ├── bot.ts
│   │   │   ├── botactivities.ts
│   │   │   ├── check.ts
│   │   │   ├── context.ts
│   │   │   ├── example.ts
│   │   │   ├── index.ts
│   │   │   ├── protected-example-router.ts
│   │   │   ├── protected-router.ts
│   │   │   ├── security.ts
│   │   │   ├── sencha.ts
│   │   │   ├── theme.ts
│   │   │   └── twitch.ts
│   │   └── trpc.ts
│   ├── styles
│   │   ├── globals.css
│   │   └── index.ts
│   ├── types
│   │   ├── index.ts
│   │   └── next-auth.d.ts
│   ├── utils
│   │   ├── functions.ts
│   │   ├── session.ts
│   │   ├── theme.ts
│   │   └── trpc.ts
│   └── validation
│       ├── color.ts
│       └── senchaconfig.ts
└── tsconfig.json
```

## Contributing

Feel free to contribute to this project. Just create a pull request with your changes.
