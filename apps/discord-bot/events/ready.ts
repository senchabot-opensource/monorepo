import { Client } from "discord.js";
import { env } from "../utils/env";
import { selectByNameCallback } from "../utils/helpers";
import { checkExclusiveRole, addRoleAll } from "../utils/memberFunctions";
import { addDiscordServerToDB } from "../db/functions";

export default {
  name: "ready",
  once: true,
  async execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    client.guilds.cache.forEach(async guild => {
      addDiscordServerToDB(guild);
    });

    const roleName = env.ROLE_NAME;
    const exclusiveRoleName = env.EXCLUSIVE_ROLE_NAME;
    const guildId = env.GUILDID as string;

    const guild = client.guilds.cache.get(guildId); // first()

    if (!guild) return;

    if (roleName) {
      const memberRole = guild.roles.cache.find(selectByNameCallback(roleName));

      if (memberRole) {
        addRoleAll(guild, memberRole);
      }
    }

    if (exclusiveRoleName) {
      const guildMembers = await guild.members.fetch();

      guildMembers.forEach((_member: any) => {
        checkExclusiveRole(guild, _member);
      });
    }
  },
};
