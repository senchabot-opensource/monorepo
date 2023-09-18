import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "src/server/db/client";
import { IConfig, ISetConfigInput } from "src/types";

interface SetConfigApiRequest extends NextApiRequest {
  body: ISetConfigInput;
}

const setConfig = async (req: SetConfigApiRequest, res: NextApiResponse) => {
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

  configs.forEach(async (config: IConfig) => {
    const findConfig = await prisma.twitchBotConfigs.findFirst({
      where: {
        key: config.key,
        twitchChannelId: twitchAccId,
      },
    });

    if (findConfig) {
      const updated = await prisma.twitchBotConfigs.update({
        where: {
          id: findConfig.id,
        },
        data: {
          key: config.key,
          value: config.value,
        },
      });
      if (!updated) {
        return res.send({ success: false });
      }
      return res.send({ success: true });
    }

    const created = await prisma.twitchBotConfigs.create({
      data: {
        key: config.key!,
        value: config.value!,
        twitchChannelId: twitchAccId,
        userId: userId,
      },
    });
    if (!created) {
      return res.send({ success: false });
    }

    return res.send({ success: true });
  });
};

export default setConfig;
