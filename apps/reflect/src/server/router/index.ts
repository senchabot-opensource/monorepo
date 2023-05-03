// src/server/router/index.ts
import { t } from "../trpc";
import { twitchBotRouter } from "./twitchbot";
import { botRouter } from "./botactivities";
import { checkRouter } from "./check";
import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { securityRouter } from "./security";
import { commandRouter } from "./command";

// Update tRPC to 10: Removed the createRouter and superjson import above, Add the t import in ../trpc
export const appRouter = t.router({
  example: exampleRouter,
  bot: botRouter,
  twitchBot: twitchBotRouter,
  check: checkRouter,
  security: securityRouter,
  auth: protectedExampleRouter,
  command: commandRouter,
});

/*.merge("example.", exampleRouter)
  .merge("colors.", colorsRouter)
  .merge("auth.", protectedExampleRouter);
*/
// export type definition of API
export type AppRouter = typeof appRouter;
