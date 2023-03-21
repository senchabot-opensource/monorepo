//import { createRouter } from "./context";
import { z } from "zod";
import { t } from "../trpc";

export const exampleRouter = t.router({
  hello: t.procedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getDcServerCount: t.procedure.query(
    async ({ ctx }) => await ctx.prisma.discordServer.count()
  ),
  getTwServercount: t.procedure.query(
    async ({ ctx }) => await ctx.prisma.twitchChannel.count()
  ),
});
