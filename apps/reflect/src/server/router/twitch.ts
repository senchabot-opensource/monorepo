//import { z } from "zod";
//import { Config } from "../../utils/config.class";
import { getUserId } from "../../utils/session";
import { TwitchConfigInputValidation } from "../../validation/color";
import { t } from "../trpc";
//import { createRouter } from "./context";

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
        // let colorStyle = new Color().style;
        // colorStyle.color = senchaBg;
        // if()
        return await ctx.prisma.twitchConfig.create({
          data: {
            background,
            foreground,
            userId,
          },
        });
      }
    }),
  /*createChatColors: t.procedure
    .input(createColorInput)
    .mutation(async ({ input, ctx }) => {
      const { chatBg, chatFg } = input;

      const userId = getUserId(ctx);

      const colors = await ctx.prisma.colors.findFirst({
        where: { userId: userId },
      });

      if (colors) {
        return await ctx.prisma.colors.update({
          where: { id: colors?.id },
          data: {
            chatBg,
            chatFg,
            userId,
          },
        });
      } else {
        // let colorStyle = new Color().style;
        // colorStyle.color = senchaBg;
        // if()
        return await ctx.prisma.colors.create<{ data: any }>({
          data: {
            chatBg: chatBg,
            chatFg: chatFg,
            userId: userId,
          },
        });
      }
    }),*/
  /*createSenchaColors: t.procedure
    .input(createSenchaColorInput)
    .mutation(async ({ input, ctx }) => {
      const { senchaBg, senchaFg } = input;

      const userId = getUserId(ctx);

      const colors = await ctx.prisma.colors.findFirst({
        where: { userId: userId },
      });

      if (colors) {
        return await ctx.prisma.colors.update({
          where: { id: colors?.id },
          data: {
            senchaBg,
            senchaFg,
            userId,
          },
        });
      } else {
        // let colorStyle = new Color().style;
        // colorStyle.color = senchaBg;
        // if()
        return await ctx.prisma.colors.create<{ data: any }>({
          data: {
            senchaBg: senchaBg,
            senchaFg: senchaFg,
            userId: userId,
          },
        });
      }
    }),*/
});
