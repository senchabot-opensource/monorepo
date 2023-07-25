import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

const getAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user.id;

  if (!userId) return;

  const accounts = await prisma.account.findMany({
    where: { userId: userId },
    select: {
      provider: true,
    },
  });

  return res.send({ data: accounts });
};

export default getAccount;
