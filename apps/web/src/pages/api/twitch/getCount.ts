import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const getTwitchChannelCount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  res.send({ data: await prisma.twitchChannel.count() });
};

export default getTwitchChannelCount;
