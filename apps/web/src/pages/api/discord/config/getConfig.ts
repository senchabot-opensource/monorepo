import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "src/server/db/client";

const getConfig = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user.id;

  if (!userId) return;

  const { key } = req.body;

  const discordAccount = await prisma.account.findFirst({
    where: { userId: userId, provider: "discord" },
    select: { providerAccountId: true },
  });

  const discordAccId = discordAccount?.providerAccountId;
  if (!discordAccId) return;

  return await prisma.discordBotConfigs.findFirst({
    where: { key: key, serverId: discordAccId },
  });
};

export default getConfig;
