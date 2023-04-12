import { t } from "../trpc";
import { authedProcedure } from "./protected-router";

export const botRouter = t.router({
  getUserTwitchChannels: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const twitchAccount = ctx.prisma.account.findMany({
      where: { userId: userId, provider: "twitch" },
      select: { providerAccountId: true },
    });

    const twitchAccs: string[] = [];
    (await twitchAccount).map(acc => twitchAccs.push(acc.providerAccountId));

    const twitchChannels = ctx.prisma.twitchChannel.findMany({
      where: {
        channelId: { in: twitchAccs },
      },
    });

    if ((await twitchChannels).length) return twitchChannels;
  }),
  getUserDiscordServers: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const discordAccount = await ctx.prisma.account.findFirst({
      where: { userId: userId, provider: "discord" },
      select: { providerAccountId: true },
    });

    if (!discordAccount) return;

    const discordServers = ctx.prisma.discordServer.findMany({
      where: { serverOwner: discordAccount.providerAccountId },
    });

    if (discordServers) {
      return discordServers;
    }
  }),
  getBotActivities: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    if (!userId) return;

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

    const botActivities = await ctx.prisma.botActionActivities.findMany({
      where: {
        OR: [
          { discordServerId: { in: dcServersArray } },
          { twitchChannelId: twitchAccount?.providerAccountId },
        ],
      },
      take: 10,
      orderBy: { activityDate: "desc" },
    });

    return botActivities;
  }),
});
