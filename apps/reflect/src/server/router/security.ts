import { t } from "../trpc";
import { authedProcedure } from "./protected-router";

export const securityRouter = t.router({
  deleteMyAccount: authedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id; //getUserId(ctx);

    if (userId) {
      await ctx.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    }
  }),
  getAccounts: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    if (!userId) return;

    const accounts = await ctx.prisma.account.findMany({
      where: { userId: userId },
      select: {
        provider: true,
      },
    });

    return accounts;
  }),
});
