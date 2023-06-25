import { Guild } from "discord.js";
import { addDiscordServerToDB } from "../utils/dbFunctions";

export default {
  name: "guildCreate",
  execute(guild: Guild) {
    addDiscordServerToDB(guild);
  },
};
