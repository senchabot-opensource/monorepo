import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "src/server/db/client";

const getConfig = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user.id;

  if (!userId) return;

  const { key } = req.body;

  const twitchAccount = await prisma.account.findFirst({
    where: { userId: userId, provider: "twitch" },
    select: { providerAccountId: true },
  });

  const twitchAccId = twitchAccount?.providerAccountId;
  if (!twitchAccId) return;

  return await prisma.twitchBotConfigs.findFirst({
    where: { key: key, twitchChannelId: twitchAccId },
  });
};

export default getConfig;
