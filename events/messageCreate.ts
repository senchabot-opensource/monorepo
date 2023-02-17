import { Message } from "discord.js";

export default {
  name: "messageCreate",
  execute(message: Message) {
    const msgContent = message.content;
    console.log(msgContent);
  },
};
