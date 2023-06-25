import { Guild } from "discord.js";
import { deleteDiscordServerFromDB } from "../db/functions";

export default {
  name: "guildDelete",
  execute(guild: Guild) {
    deleteDiscordServerFromDB(guild);
  },
};
