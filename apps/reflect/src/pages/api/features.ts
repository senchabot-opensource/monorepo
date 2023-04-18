import { NextApiRequest, NextApiResponse } from "next";

const get = (req: NextApiRequest, res: NextApiResponse) => {
  const featureList = [
    "Discord bot moderation commands (/purge, /event purge)",
    "String templates: {user_name} {random_number} {date} {cmd_date}",
    "Twitch bot custom commands: (!acmd, !ucmd, !dcmd)",
    "Bot activity log",
  ];
  res.status(200).json({ featureList: featureList });
};

const features = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    get(req, res);
  }
};

export default features;
