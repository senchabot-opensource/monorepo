import { Client, GuildMember, Role } from "discord.js";
import { selectByNameCallback } from "../utils/helpers";
import { addRole, addRoleAll, removeRole } from "../utils/memberFunctions";

export default {
  name: "ready",
  once: true,
  async execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    const roleName = process.env.ROLE_NAME as string;
    const exclusiveRoleName = process.env.EXCLUSIVE_ROLE_NAME as string;
    const subRoles = process.env.SUB_ROLES as string;
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
      const splitSubRoles = subRoles.split(",");

      if (!splitSubRoles.length) return;

      const exclusiveRole = guild.roles.cache.find(
        selectByNameCallback(exclusiveRoleName)
      );

      if (!exclusiveRole) {
        console.log("EXCLUSIVE ROLE NOT FOUND.");
        return;
      }

      const guildMembers = await guild.members.fetch();

      guildMembers.forEach((_member: any) => {
        const hasSubRoles = splitSubRoles.some((role) =>
          _member._roles.includes(role)
        );

        console.log(
          `${_member.user.tag} HAS ONE OF SUB ROLES? "${hasSubRoles}"`
        );

        if (hasSubRoles) {
          addRole(_member, exclusiveRole);
        } else {
          removeRole(_member, exclusiveRole);
        }
      });
    }
  },
};
