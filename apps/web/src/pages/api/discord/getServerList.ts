import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";
import { Response } from "src/types/response";

const getDiscordServers = async (
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

  if (!discordAccount) return;

  const discordServers = await prisma.discordServer.findMany({
    where: { serverOwner: discordAccount.providerAccountId },
  });

  if (!discordServers) {
    return res.status(404).json({
      success: false,
      errorMessage: "Error while getting Discord servers",
    });
  }

  return res.send({ data: discordServers, success: true });
};

export default getDiscordServers;
