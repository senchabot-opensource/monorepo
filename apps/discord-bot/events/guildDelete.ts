import { Guild } from "discord.js";
import { deleteDiscordServerFromDB } from "../utils/dbFunctions";

export default {
  name: "guildDelete",
  execute(guild: Guild) {
    deleteDiscordServerFromDB(guild);
  },
};
