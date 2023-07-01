import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { Response } from "src/types/response";

const deleteAccount = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<boolean>>,
) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) return;

  const userId = session.user.id; //getUserId(ctx);

  if (userId) {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.json({ data: true, success: true });
  }

  res.status(404).json({ success: false, errorMessage: "User not found" });
};

export default deleteAccount;
