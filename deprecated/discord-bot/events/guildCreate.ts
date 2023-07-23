import { Guild } from "discord.js";
import { addDiscordServerToDB } from "../db/functions";

export default {
  name: "guildCreate",
  execute(guild: Guild) {
    addDiscordServerToDB(guild);
  },
};
