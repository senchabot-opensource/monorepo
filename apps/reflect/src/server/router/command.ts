import { z } from "zod";
import { t } from "../trpc";
import { authedProcedure } from "./protected-router";

export const commandRouter = t.router({
  deleteCommand: authedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const userId = ctx.session.user.id;

      const twitchAccount = await ctx.prisma.account.findFirst({
        where: {
          userId: userId,
          provider: "twitch",
        },
        select: {
          providerAccountId: true,
        },
      });

      const discordUserId = await ctx.prisma.account.findFirst({
        where: { userId: userId, provider: "discord" },
        select: {
          providerAccountId: true,
        },
      });

      const dcServersArray: string[] = [];

      if (discordUserId) {
        const discordServer = await ctx.prisma.discordServer.findMany({
          where: {
            serverOwner: discordUserId.providerAccountId,
          },
          select: {
            serverId: true,
          },
        });

        discordServer.forEach(server => dcServersArray.push(server.serverId));
      }

      const command = await ctx.prisma.botCommands.findFirst({
        where: {
          id: id,
          OR: [
            { discordServerId: { in: dcServersArray } },
            { twitchChannelId: twitchAccount?.providerAccountId },
          ],
        },
        select: {
          id: true,
        },
      });

      if (!command) return;

      return await ctx.prisma.botCommands.delete({
        where: {
          id: command.id,
        },
      });
    }),
  getCommandList: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const twitchAccount = await ctx.prisma.account.findFirst({
      where: {
        userId: userId,
        provider: "twitch",
      },
      select: {
        providerAccountId: true,
      },
    });

    const discordUserId = await ctx.prisma.account.findFirst({
      where: { userId: userId, provider: "discord" },
      select: {
        providerAccountId: true,
      },
    });

    const dcServersArray: string[] = [];

    if (discordUserId) {
      const discordServer = await ctx.prisma.discordServer.findMany({
        where: {
          serverOwner: discordUserId.providerAccountId,
        },
        select: {
          serverId: true,
        },
      });

      discordServer.forEach(server => dcServersArray.push(server.serverId));
    }

    const botCommands = await ctx.prisma.botCommands.findMany({
      where: {
        OR: [
          { discordServerId: { in: dcServersArray } },
          { twitchChannelId: twitchAccount?.providerAccountId },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return botCommands;
  }),
  getAliasList: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const twitchAccount = await ctx.prisma.account.findFirst({
      where: {
        userId: userId,
        provider: "twitch",
      },
      select: {
        providerAccountId: true,
      },
    });

    const discordUserId = await ctx.prisma.account.findFirst({
      where: { userId: userId, provider: "discord" },
      select: {
        providerAccountId: true,
      },
    });

    const dcServersArray: string[] = [];

    if (discordUserId) {
      const discordServer = await ctx.prisma.discordServer.findMany({
        where: {
          serverOwner: discordUserId.providerAccountId,
        },
        select: {
          serverId: true,
        },
      });

      discordServer.forEach(server => dcServersArray.push(server.serverId));
    }

    const commandAlias = await ctx.prisma.botCommandAliases.findMany({
      where: {
        OR: [
          { discordServerId: { in: dcServersArray } },
          { twitchChannelId: twitchAccount?.providerAccountId },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return commandAlias;
  }),
});
