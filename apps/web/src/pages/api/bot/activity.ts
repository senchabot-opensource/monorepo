import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const getBotActivities = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session) return;

  const userId = session.user?.id;

  if (!userId) return;

  const twitchAccount = await prisma.account.findFirst({
    where: {
      userId: userId,
      provider: "twitch",
    },
    select: {
      providerAccountId: true,
    },
  });

  const discordUserId = await prisma.account.findFirst({
    where: { userId: userId, provider: "discord" },
    select: {
      providerAccountId: true,
    },
  });

  const dcServersArray: string[] = [];

  if (discordUserId) {
    const discordServer = await prisma.discordServer.findMany({
      where: {
        serverOwner: discordUserId.providerAccountId,
      },
      select: {
        serverId: true,
      },
    });

    discordServer.forEach(server => dcServersArray.push(server.serverId));
  }

  const botActivities = await prisma.botActionActivities.findMany({
    where: {
      OR: [
        { botPlatformId: { in: dcServersArray }, botPlatformType: "discord" },
        {
          botPlatformId: twitchAccount?.providerAccountId,
          botPlatformType: "twitch",
        },
      ],
    },
    take: 10,
    orderBy: { activityDate: "desc" },
  });

  res.send({ data: botActivities });
};

export default getBotActivities;
