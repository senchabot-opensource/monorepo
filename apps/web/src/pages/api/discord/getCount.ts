import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const getDiscordServerCount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  res.send({ data: await prisma.discordServer.count() });
};

export default getDiscordServerCount;
