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

  const discordAccount = await prisma.account.findFirst({
    where: { userId: userId, provider: "discord" },
    select: { providerAccountId: true },
  });

  const discordAccId = discordAccount?.providerAccountId;
  if (!discordAccId) return;

  configs.forEach(async (config: IConfig) => {
    const findConfig = await prisma.discordBotConfigs.findFirst({
      where: {
        key: config.key,
        serverId: discordAccId,
      },
    });

    if (findConfig) {
      const updated = await prisma.discordBotConfigs.update({
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

    const created = await prisma.discordBotConfigs.create({
      data: {
        key: config.key!,
        value: config.value!,
        serverId: discordAccId,
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
