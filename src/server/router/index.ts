// src/server/router/index.ts
//import { createRouter } from "./context";
//import superjson from "superjson";

import { t } from "../trpc";
import { twitchBotRouter } from "./bot";
import { botRouter } from "./botactivities";
import { checkRouter } from "./check";
import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { securityRouter } from "./security";
import { senchaRouter } from "./sencha";
import { themeRouter } from "./theme";
import { twitchRouter } from "./twitch";

// Update tRPC to 10: Removed the createRouter and superjson import above, Add the t import in ../trpc
export const appRouter = t.router({
  example: exampleRouter,
  theme: themeRouter,
  sencha: senchaRouter,
  twitch: twitchRouter,
  bot: botRouter,
  twitchBot: twitchBotRouter,
  check: checkRouter,
  security: securityRouter,
  auth: protectedExampleRouter,
});

/*.merge("example.", exampleRouter)
  .merge("colors.", colorsRouter)
  .merge("auth.", protectedExampleRouter);
*/
// export type definition of API
export type AppRouter = typeof appRouter;
