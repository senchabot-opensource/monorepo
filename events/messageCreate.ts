import { Guild, Message } from "discord.js";
import { createLiveStreamEventFromMessage } from "../utils/scheduledEventFunctions";

export default {
  name: "messageCreate",
  execute(message: Message) {
    createLiveStreamEventFromMessage(message, {
      platformDomain: "twitch.tv",
    });
  },
};
