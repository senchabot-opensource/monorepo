import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";
import { Response } from "src/types/response";

const getTwitchChannels = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<any>>,
) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user.id;

  const twitchAccount = prisma.account.findMany({
    where: { userId: userId, provider: "twitch" },
    select: { providerAccountId: true },
  });

  if (!twitchAccount) return;

  const twitchAccs: string[] = [];
  (await twitchAccount).map(acc => twitchAccs.push(acc.providerAccountId));

  const twitchChannels = await prisma.twitchChannel.findMany({
    where: {
      channelId: { in: twitchAccs },
    },
  });

  if (!twitchChannels) {
    return res.status(404).json({
      success: false,
      errorMessage: "Error while getting Twitch channels",
    });
  }

  return res.send({ data: twitchChannels, success: true });
};

export default getTwitchChannels;
