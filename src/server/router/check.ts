import { t } from "../trpc";
import { authedProcedure } from "./protected-router";

export const checkRouter = t.router({
  checkTwitchAcc: authedProcedure.query(async ({ ctx }) => {
    const twitchAcc = await ctx.prisma.account.findFirst({
      where: { userId: ctx.session.user.id, provider: "twitch" },
      select: { providerAccountId: true },
    });

    if (twitchAcc) return true;

    return false;
  }),
});
