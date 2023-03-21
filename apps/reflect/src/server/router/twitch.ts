import { getUserId } from "../../utils/session";
import { TwitchConfigInputValidation } from "../../validation/color";
import { t } from "../trpc";

export const twitchRouter = t.router({
  get: t.procedure.query(async ({ ctx }) => {
    const userId = getUserId(ctx);
    const configs = await ctx.prisma.twitchConfig.findFirst({
      where: { userId: userId },
    });

    return configs;
  }),
  mutateConfig: t.procedure
    .input(TwitchConfigInputValidation)
    .mutation(async ({ input, ctx }) => {
      const { background, foreground } = input;

      const userId = getUserId(ctx);

      const findConfigs = await ctx.prisma.twitchConfig.findFirst({
        where: { userId: userId },
      });

      if (findConfigs) {
        return await ctx.prisma.twitchConfig.update({
          where: { id: findConfigs?.id },
          data: {
            background,
            foreground,
            userId,
          },
        });
      } else {
        return await ctx.prisma.twitchConfig.create({
          data: {
            background,
            foreground,
            userId,
          },
        });
      }
    }),
});
