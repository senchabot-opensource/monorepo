import { TRPCError } from "@trpc/server";
import { env } from "../../env/server.mjs";
import { t } from "../trpc";
import {
  TwitchBotConfigMutationInputValidation,
  TwitchBotConfigQueryInputValidation,
} from "../../validation/twitchbotconfig";

export const twitchBotRouter = t.router({
  add: t.procedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (userId) {
      const twitchAccount = await ctx.prisma.account.findFirst({
        where: {
          userId: userId,
          provider: "twitch",
        },
        select: { providerAccountId: true },
      });

      const twitchAccId = twitchAccount?.providerAccountId;
      if (!twitchAccId) return;

      const twitchChannel = await ctx.prisma.twitchChannel.findFirst({
        where: {
          channelId: twitchAccId,
        },
      });

      if (!twitchChannel) {
        const getClientCredentials = await fetch(
          "https://id.twitch.tv/oauth2/token?client_id=" +
            env.TWITCH_CLIENT_ID +
            "&client_secret=" +
            env.TWITCH_CLIENT_SECRET +
            "&grant_type=client_credentials",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        ).then(resp => resp.json());

        const getChannel = await fetch(
          "https://api.twitch.tv/helix/channels?broadcaster_id=" + twitchAccId,
          {
            headers: {
              "Client-ID": env.TWITCH_CLIENT_ID,
              Authorization: "Bearer " + getClientCredentials["access_token"],
            },
          },
        )
          .then(resp => resp.json())
          .then(data => data);

        const createChannel = await ctx.prisma.twitchChannel.create({
          data: {
            channelId: twitchAccId,
            channelName: getChannel.data[0].broadcaster_login,
            userId: userId,
          },
        });

        if (!createChannel) return;

        await ctx.prisma.botCommands.create({
          data: {
            commandName: "lurk",
            commandContent: "Teşekkürler! {user_name}",
            twitchChannelId: twitchAccId,
          },
        });
      } else {
        await ctx.prisma.twitchChannel.update({
          where: {
            id: twitchChannel.id,
          },
          data: {
            userId,
          },
        });
        throw new TRPCError({
          message: "Twitch channel already added",
          code: "CONFLICT",
        });
      }
    }
  }),

  setConfig: t.procedure
    .input(TwitchBotConfigMutationInputValidation)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) return;

      const { configs } = input;

      const twitchAccount = await ctx.prisma.account.findFirst({
        where: {
          userId: userId,
          provider: "twitch",
        },
        select: { providerAccountId: true },
      });

      const twitchAccId = twitchAccount?.providerAccountId;
      if (!twitchAccId) return;

      configs.forEach(async config => {
        const findConfig = await ctx.prisma.twitchBotConfigs.findFirst({
          where: {
            key: config.key,
            twitchChannelId: twitchAccId,
          },
        });

        if (findConfig) {
          await ctx.prisma.twitchBotConfigs.update({
            where: {
              id: findConfig.id,
            },
            data: {
              key: config.key,
              value: config.value,
            },
          });
          return;
        }

        await ctx.prisma.twitchBotConfigs.create({
          data: {
            key: config.key,
            value: config.value,
            twitchChannelId: twitchAccId,
            userId: userId,
          },
        });
      });
    }),

  getConfig: t.procedure
    .input(TwitchBotConfigQueryInputValidation)
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) return;

      const { key } = input;

      const twitchAccount = await ctx.prisma.account.findFirst({
        where: { userId: userId, provider: "twitch" },
        select: { providerAccountId: true },
      });

      const twitchAccId = twitchAccount?.providerAccountId;
      if (!twitchAccId) return;

      return await ctx.prisma.twitchBotConfigs.findFirst({
        where: { key: key, twitchChannelId: twitchAccId },
      });
    }),
  getAllConfigs: t.procedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) return;

    const twitchAccount = await ctx.prisma.account.findFirst({
      where: { userId: userId, provider: "twitch" },
      select: { providerAccountId: true },
    });

    const twitchAccId = twitchAccount?.providerAccountId;
    if (!twitchAccId) return;

    return await ctx.prisma.twitchBotConfigs.findMany({
      where: { twitchChannelId: twitchAccId },
    });
  }),
});
