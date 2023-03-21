import { getUserId } from "../../utils/session";
import { SenchaConfigInputValidation } from "../../validation/senchaconfig";
import { t } from "../trpc";

export const senchaRouter = t.router({
  get: t.procedure.query(async ({ ctx }) => {
    const userId = getUserId(ctx);
    const configs = await ctx.prisma.senchaConfig.findFirst({
      where: { userId: userId },
    });

    return configs;
  }),
  mutateConfig: t.procedure
    .input(SenchaConfigInputValidation)
    .mutation(async ({ input, ctx }) => {
      const { bootScene: strBootScene, background, foreground } = input;

      const bootScene = Number(strBootScene);

      const userId = getUserId(ctx);

      const findConfigs = await ctx.prisma.senchaConfig.findFirst({
        where: { userId: userId },
      });

      if (findConfigs) {
        return await ctx.prisma.senchaConfig.update({
          where: { id: findConfigs?.id },
          data: {
            bootScene,
            background,
            foreground,
            userId,
          },
        });
      } else {
        return await ctx.prisma.senchaConfig.create<{ data: any }>({
          data: {
            bootScene,
            background,
            foreground,
            userId,
          },
        });
      }
    }),
});
