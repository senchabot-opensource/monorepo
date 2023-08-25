# Senchabot Web App

Web application for managing Senchabot, its commands and configuring the bot.

## Senchabot Web App uses

- [React](https://react.dev/)
- [Next.js](https://nextjs.org)
- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Material UI](https://mui.com)
- [Zod](https://zod.dev)
- [React Hook Form](https://react-hook-form.com/)
- [emotion](https://emotion.sh/)
- [superjson](https://github.com/blitz-js/superjson)
- [Jotai](https://jotai.org/)

## Getting Started

1. If you have not configured the settings in the monorepo home directory, please navigate to the home directory and read the instructions in the readme file.

2. Start the development server

   ```sh
   npm run dev
   ```

## Folder Tree

```bash
├── env.example
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── public
│   └── favicon.png
├── README.md
├── src
│   ├── api
│   │   └── index.ts
│   ├── components
│   │   ├── app
│   │   │   ├── AccountMenu.tsx
│   │   │   ├── AppBar
│   │   │   │   ├── AppBarButton.tsx
│   │   │   │   ├── buttons
│   │   │   │   │   ├── DrawerButton.tsx
│   │   │   │   │   ├── GetDiscordBotButton.tsx
│   │   │   │   │   └── GetTwitchBotButton.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── AppContainer.tsx
│   │   │   ├── AppDrawer.tsx
│   │   │   ├── AppSearch.tsx
│   │   │   ├── AppSnackbar.tsx
│   │   │   ├── BotActivity.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── CommandList.tsx
│   │   │   └── SystemMessage.tsx
│   │   ├── auth
│   │   │   ├── AuthContainer.tsx
│   │   │   ├── AuthDialog.tsx
│   │   │   ├── AuthLoginButton.tsx
│   │   │   └── LinkAccount.tsx
│   │   ├── button
│   │   │   └── DeleteAccount.tsx
│   │   ├── common
│   │   │   ├── Logo.tsx
│   │   │   ├── Header.tsx
│   │   │   └── VersionText.tsx
│   │   ├── CustomAlert.tsx
│   │   ├── FormTitle.tsx
│   │   ├── landing
│   │   │   ├── LandingAppBar.tsx
│   │   │   ├── LandingButton.tsx
│   │   │   ├── LandingContainer.tsx
│   │   │   ├── LandingFooter.tsx
│   │   │   ├── LandingGrid.tsx
│   │   │   └── LandingTexts.tsx
│   │   ├── LibraryText.tsx
│   │   ├── loading
│   │   │   ├── LoadingBox.tsx
│   │   │   └── Loading.tsx
│   │   ├── Offset.tsx
│   │   ├── tab
│   │   │   ├── BotConfiguration
│   │   │   │   └── index.tsx
│   │   │   └── SettingTopTab.tsx
│   │   ├── tabpanel
│   │   │   ├── HorizontalTabPanel.tsx
│   │   │   └── VerticalTabPanel.tsx
│   │   ├── Tooltip.tsx
│   │   └── TypingEffect.tsx
│   ├── Context
│   │   └── ColorModeContext.tsx
│   ├── enums
│   │   └── index.ts
│   ├── env
│   │   ├── client.mjs
│   │   ├── schema.mjs
│   │   └── server.mjs
│   ├── forms
│   │   ├── PrivacyForm.tsx
│   │   ├── SecurityForm.tsx
│   │   └── TwitchBotForm.tsx
│   ├── pages
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth].ts
│   │   │   ├── bot
│   │   │   │   └── activity.ts
│   │   │   ├── cmd
│   │   │   │   ├── aliasList.ts
│   │   │   │   ├── delete.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── list.ts
│   │   │   ├── config
│   │   │   │   ├── getAllConfig.ts
│   │   │   │   ├── getConfig.ts
│   │   │   │   └── setConfig.ts
│   │   │   ├── deleteAccount.ts
│   │   │   ├── discord
│   │   │   │   ├── getCount.ts
│   │   │   │   └── getServerList.ts
│   │   │   ├── features.ts
│   │   │   ├── getAccount.ts
│   │   │   ├── restricted.ts
│   │   │   └── twitch
│   │   │       ├── findAccount.ts
│   │   │       ├── get-bot.ts
│   │   │       ├── getChannelList.ts
│   │   │       └── getCount.ts
│   │   ├── app
│   │   │   ├── command-list.tsx
│   │   │   ├── index.tsx
│   │   │   └── settings.tsx
│   │   ├── _app.tsx
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
│   │   └── db
│   │       └── client.ts
│   ├── styles
│   │   ├── globals.css
│   │   └── index.ts
│   ├── types
│   │   ├── index.ts
│   │   ├── next-auth.d.ts
│   │   └── response.ts
│   ├── utils
│   │   ├── functions.ts
│   │   ├── session.ts
│   │   └── theme.ts
│   └── validation
│       ├── color.ts
│       ├── senchaconfig.ts
│       └── twitchbotconfig.ts
├── tsconfig.json
└── vercel.json
```

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](../../CONTRIBUTING.md) first.
