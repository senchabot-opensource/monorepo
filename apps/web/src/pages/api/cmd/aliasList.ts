import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const getAliasList = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user.id;

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

  const commandAlias = await prisma.botCommandAliases.findMany({
    where: {
      OR: [
        { discordServerId: { in: dcServersArray } },
        { twitchChannelId: twitchAccount?.providerAccountId },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return res.send({ data: commandAlias });
};

export default getAliasList;
