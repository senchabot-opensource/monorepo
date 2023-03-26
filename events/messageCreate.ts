import dayjs from "dayjs";
import { Guild, Message } from "discord.js";
import { TWITCH_EVENTS_CHANNELS } from "../config";
import { getURL } from "../utils/helpers";

export default {
  name: "messageCreate",
  execute(message: Message) {
    const guild = message.guild as Guild;
    const msgContent = message.content;

    if (!TWITCH_EVENTS_CHANNELS.includes(message.channelId)) return;

    const domain = "twitch.tv";
    if (!msgContent.includes(domain)) return;

    const eventStartTime = dayjs().add(1, "minute").toISOString();
    const eventEndTime = dayjs().add(8, "hour").toISOString();

    const url = getURL(domain, msgContent);

    let eventName = "";

    if (message.author.bot && message.embeds[0].title) {
      eventName = message.embeds[0].title;
    } else {
      eventName = msgContent
        .replace(/@(everyone|here)|\bhttps?:\/\/\S+/g, "")
        .trim();
    }

    const eventOptions = {
      name: eventName,
      scheduledStartTime: eventStartTime,
      scheduledEndTime: eventEndTime,
      privacyLevel: 2,
      entityType: 3,
      entityMetadata: { location: url },
    };
    const event = guild.scheduledEvents.create(eventOptions);
    event.then((e) => e.setLocation(url));
  },
};
