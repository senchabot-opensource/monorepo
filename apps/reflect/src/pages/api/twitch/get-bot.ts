import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { getTwitchBotWebhookFetchOptions } from "../../../utils/functions";
import { ITwitchBotWebhookData } from "../../../types";

const getTwitchBot = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    const userId = session.user?.id;
    const userName = session.user?.name;

    if (userId) {
      const twitchAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
          provider: "twitch",
        },
        select: { providerAccountId: true },
      });

      const twitchAccId = twitchAccount?.providerAccountId;
      if (!twitchAccId) return;

      const twitchChannel = await prisma.twitchChannel.findFirst({
        where: {
          channelId: twitchAccId,
        },
      });

      if (!twitchChannel) {
        const getClientCredentials = await fetch(
          "https://id.twitch.tv/oauth2/token?client_id=" +
            env.TWITCH_CLIENT_ID +
            "&client_secret=" +
            env.TWITCH_CLIENT_SECRET +
            "&grant_type=client_credentials",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        ).then(resp => resp.json());

        const getChannel = await fetch(
          "https://api.twitch.tv/helix/channels?broadcaster_id=" + twitchAccId,
          {
            headers: {
              "Client-ID": env.TWITCH_CLIENT_ID,
              Authorization: "Bearer " + getClientCredentials["access_token"],
            },
          },
        )
          .then(resp => resp.json())
          .then(data => data);

        const channelName = getChannel.data[0].broadcaster_login;

        const webhookData: ITwitchBotWebhookData = {
          token: env.WEBHOOK_TOKEN,
          event: "channel.join." + channelName,
          user_name: userName,
        };

        await fetch(
          env.TWITCH_BOT_HOST + "/webhook",
          getTwitchBotWebhookFetchOptions(webhookData),
        ).catch(e => console.log("WEBHOOK_ERROR"));

        const createChannel = await prisma.twitchChannel.create({
          data: {
            channelId: twitchAccId,
            channelName: channelName,
            userId: userId,
          },
        });

        if (!createChannel) return;

        await prisma.botCommands.create({
          data: {
            commandName: "lurk",
            commandContent: "Teşekkürler! {user_name}",
            twitchChannelId: twitchAccId,
          },
        });
        res.redirect(307, "/app");
      } else {
        await prisma.twitchChannel.update({
          where: {
            id: twitchChannel.id,
          },
          data: {
            userId,
          },
        });
        res.redirect(307, "/app");
      }
    }
  } else {
    res.send({
      hello: "You must be signed in to get the cute and adorable Twitch bot.",
    });
  }
};

export default getTwitchBot;
