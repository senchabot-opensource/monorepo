import { GuildManager, Message } from "discord.js";
import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";
import { TWITCH_EVENTS_CHANNELS } from "../config";
import { ICreateLiveStreamEventParams } from "../types";
import { getURL } from "../utils/helpers";
import { env } from "../utils/env";

import dayjs from "dayjs";

export const createLiveStreamEventFromMessage = (
  message: Message,
  params: ICreateLiveStreamEventParams,
) => {
  if (!message.guild) return;
  if (!TWITCH_EVENTS_CHANNELS.includes(message.channelId)) return;

  const msgContent = message.content;

  if (!msgContent.includes(params.platformDomain)) return;

  const eventStartTime = dayjs().add(30, "seconds").toISOString();
  const eventEndTime = dayjs().add(8, "hour").toISOString();

  const url = getURL(params.platformDomain, msgContent);

  const firstMsgEmbedTitle = message.embeds[0]?.title;
  const urlAndMentionRegex = /@(everyone|here)|\bhttps?:\/\/\S+/g;
  const processedMsgContent = msgContent.replace(urlAndMentionRegex, "").trim();

  let eventName = "";

  if (message.author.bot && firstMsgEmbedTitle) {
    eventName = firstMsgEmbedTitle;
  } else {
    eventName = processedMsgContent;
  }

  eventName = eventName.substring(0, 99);

  const eventOptions = {
    name: eventName,
    scheduledStartTime: eventStartTime,
    scheduledEndTime: eventEndTime,
    privacyLevel: 2,
    entityType: 3,
    entityMetadata: { location: url },
  };
  const event = message.guild.scheduledEvents.create(eventOptions);
  event.then(e => e.setLocation(url));
};

export async function checkScheduledEvents(guilds: GuildManager) {
  const authProvider = new AppTokenAuthProvider(
    env.TWITCH_CLIENT_ID || "",
    env.TWITCH_CLIENT_SECRET || "",
  );

  setInterval(async () => {
    guilds.cache.forEach(async guild => {
      const scheduledEvents = await guild.scheduledEvents.fetch();

      scheduledEvents.forEach(async event => {
        const location = event.entityMetadata?.location;
        const twitchUsernameRegex = /twitch\.tv\/(\w+)/;
        const twitchUsernameFromLocation =
          location && location.match(twitchUsernameRegex);

        if (!twitchUsernameFromLocation) return;

        const streamer = twitchUsernameFromLocation[1];

        const apiClient = new ApiClient({ authProvider: authProvider });
        const stream = await apiClient.streams.getStreamByUserName(streamer);

        if (!stream && event) {
          console.log(
            `Twitch stream is offline (${streamer}), deleting Discord scheduled event`,
          );
          event.delete();
        } else {
          console.log(
            `Twitch stream is live (${stream?.userName}: ${stream?.title})`,
          );
          if (stream?.title && !event.name.includes(stream.title)) {
            event.setName(stream.title.substring(0, 99));
          }
        }
      });
    });
  }, 60000); // check every minute
}
