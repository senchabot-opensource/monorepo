import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/server/db/client";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { Response } from "src/types/response";
import { IGetAllConfig } from "src/types";

const getAllConfig = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<any>>,
) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user.id;

  if (!userId) return;

  const discordAccount = await prisma.account.findFirst({
    where: { userId: userId, provider: "discord" },
    select: { providerAccountId: true },
  });

  const discordAccId = discordAccount?.providerAccountId;
  if (!discordAccId) return;

  const configs = await prisma.discordBotConfigs.findMany({
    where: { serverId: discordAccId },
  });

  if (!configs) {
    return res.status(404).json({
      success: false,
      errorMessage: "Error while getting all configs",
    });
  }

  return res.json({ data: configs, success: true });
};

export default getAllConfig;
