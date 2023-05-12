// src/server/router/index.ts
import { t } from "../trpc";
import { twitchBotRouter } from "./twitchbot";
import { botRouter } from "./botactivities";
import { checkRouter } from "./check";
import { exampleRouter } from "./example";
import { securityRouter } from "./security";
import { commandRouter } from "./command";

export const appRouter = t.router({
  example: exampleRouter,
  bot: botRouter,
  twitchBot: twitchBotRouter,
  check: checkRouter,
  security: securityRouter,
  command: commandRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
