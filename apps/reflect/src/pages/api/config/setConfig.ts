import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const setConfig = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user?.id;

  if (!userId) return;

  const { configs } = req.body;

  const twitchAccount = await prisma.account.findFirst({
    where: {
      userId: userId,
      provider: "twitch",
    },
    select: { providerAccountId: true },
  });

  const twitchAccId = twitchAccount?.providerAccountId;
  if (!twitchAccId) return;

  configs.forEach(async (config: any) => {
    const findConfig = await prisma.twitchBotConfigs.findFirst({
      where: {
        key: config.key,
        twitchChannelId: twitchAccId,
      },
    });

    if (findConfig) {
      await prisma.twitchBotConfigs.update({
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

    await prisma.twitchBotConfigs.create({
      data: {
        key: config.key,
        value: config.value,
        twitchChannelId: twitchAccId,
        userId: userId,
      },
    });
  });
};

export default setConfig;
