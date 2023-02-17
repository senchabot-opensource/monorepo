import { Client } from "discord.js";
import { selectByNameCallback } from "../utils/helpers";
import { checkExclusiveRole, addRoleAll } from "../utils/memberFunctions";

export default {
  name: "ready",
  once: true,
  async execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    const roleName = process.env.ROLE_NAME as string;
    const exclusiveRoleName = process.env.EXCLUSIVE_ROLE_NAME as string;
    const guildId = process.env.GUILDID as string;

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
