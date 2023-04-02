import { Guild, Message } from "discord.js";
import { createLiveStreamEventFromMessage } from "../utils/scheduledEventFunctions";

export default {
  name: "messageCreate",
  execute(message: Message) {
    const guild = message.guild as Guild;
    const msgContent = message.content;

    createLiveStreamEventFromMessage(message, {
      platformDomain: "twitch.tv",
    });
  },
};
