import { NextApiRequest, NextApiResponse } from "next";

const get = (req: NextApiRequest, res: NextApiResponse) => {
  const defaultCmd = [
    "/event",
    "/invite",
    "/ping",
    "/purge",
    "/voice",
    "!ping",
    "!invite",
    "!senchabot",
    "!acmd",
    "!ucmd",
    "!dcmd",
    "!kampus",
    "!frontendship",
  ];
  res.status(200).json({ defaultCmd: defaultCmd });
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    get(req, res);
  }
};

export default handler;
