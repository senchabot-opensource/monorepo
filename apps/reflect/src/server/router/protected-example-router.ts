import { t } from "../trpc";
import { authedProcedure } from "./protected-router";
//import { createProtectedRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = t.router({
  getSession: authedProcedure.query(({ ctx }) => ctx.session),
  getSecretMessage: authedProcedure.query(
    ({ ctx }) =>
      "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever."
  ),
});
