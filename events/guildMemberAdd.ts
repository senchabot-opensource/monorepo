import { GuildMember, Role } from "discord.js";
import { env } from "../utils/env";
import { selectByNameCallback } from "../utils/helpers";
import { addRole } from "../utils/memberFunctions";

export default {
  name: "guildMemberAdd",
  execute(member: GuildMember) {
    // console.log("guildMemberAdd event", member.displayName);
    const roleName = env.ROLE_NAME;

    if (roleName) {
      let memberRole: Role | undefined = member.guild.roles.cache.find(
        selectByNameCallback(roleName)
      );

      addRole(member, memberRole);
    }
  },
};
