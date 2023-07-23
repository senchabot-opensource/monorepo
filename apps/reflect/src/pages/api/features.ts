import { NextApiRequest, NextApiResponse } from "next";

const get = (req: NextApiRequest, res: NextApiResponse) => {
  const featureList = [
    "Discord bot moderation commands (/purge, /event purge)",
    "String templates: {user.name} {cmd.author} {random_number} {date} {cmd.date} {channel.name}",
    "Twitch bot custom commands: (!acmd (Add command), !ucmd (Update command), !dcmd (Delete command))",
    "Twitch bot command aliases: (!acmda (Add command alias(es)), !dcmda (Delete command alias))",
    "Bot activity log (Command execution logs, Senchabot activity, Author of executed command)",
  ];
  res.status(200).json({ featureList: featureList });
};

const features = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    get(req, res);
  }
};

export default features;
