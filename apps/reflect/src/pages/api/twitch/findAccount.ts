import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";
import { Response } from "src/types/response";

const findAccount = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<boolean>>,
) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) {
    return res.status(404).json({
      success: false,
      errorMessage: "User session not found.",
    });
  }

  const twitchAcc = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "twitch" },
    select: { providerAccountId: true },
  });

  return res.send({ data: !!twitchAcc, success: true });
};

export default findAccount;
