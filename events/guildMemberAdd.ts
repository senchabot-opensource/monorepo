import { GuildMember, Role } from "discord.js";
import { selectByNameCallback } from "../utils/helpers";
import { addRole } from "../utils/memberFunctions";

export default {
  name: "guildMemberAdd",
  execute(member: GuildMember) {
    // console.log("guildMemberAdd event", member.displayName);
    const roleName = process.env.ROLE_NAME as string;

    if (roleName) {
      let memberRole: Role | undefined = member.guild.roles.cache.find(
        selectByNameCallback(roleName)
      );

      addRole(member, memberRole);
    }
  },
};
