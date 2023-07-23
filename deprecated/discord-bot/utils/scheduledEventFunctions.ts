import { GuildManager, Message } from "discord.js";
import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";
import { ICreateLiveStreamEventParams } from "../types";
import { getURL } from "../utils/helpers";
import { env } from "../utils/env";

import dayjs from "dayjs";
import { announcementChannels } from "..";

export const createLiveStreamEventFromMessage = (
  message: Message,
  params: ICreateLiveStreamEventParams,
) => {
  if (!message.guild || !message.author.bot) return;
  if (!announcementChannels.includes(message.channelId)) return;

  const msgContent = message.content;

  const eventStartTime = dayjs().add(30, "seconds").toISOString();
  const eventEndTime = dayjs().add(8, "hour").toISOString();

  let url = getURL(params.platformDomain, msgContent);

  const firstMsgEmbedTitle = message.embeds[0]?.title;
  const firstMsgEmbedUrl = message.embeds[0]?.url;

  let eventName = msgContent.substring(0, 20);

  if (firstMsgEmbedTitle) {
    eventName = firstMsgEmbedTitle;
    if (firstMsgEmbedUrl) {
      url = firstMsgEmbedUrl;
    }
  }

  if (url == "" || !url.includes(params.platformDomain)) return; // TODO: Check the url is correct if url is not empty

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
        if (!event.creator?.bot) return;

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
