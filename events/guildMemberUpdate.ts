import { GuildMember } from "discord.js";
import { selectByNameCallback } from "../utils/helpers";
import { addRole, removeRole } from "../utils/memberFunctions";

export default {
  name: "guildMemberUpdate",
  async execute(member: GuildMember) {
    const userName = member.user.username;

    const subRoles = process.env.SUB_ROLES as string;

    const splitSubRoles = subRoles.split(",");

    const exclusiveRoleName = process.env.EXCLUSIVE_ROLE_NAME as string;

    const exclusiveRole = member.guild.roles.cache.find(
      selectByNameCallback(exclusiveRoleName)
    );

    if (!exclusiveRole) {
      console.log("EXCLUSIVE ROLE NOT FOUND.");
      return;
    }

    member.guild.members.fetch().then((members) =>
      members.some((_member: any) => {
        let hasSubRoles = false;
        if (_member.user.username === userName) {
          hasSubRoles = splitSubRoles.some((role) =>
            _member._roles.includes(role)
          );

          console.log(`${userName} HAS ONE OF SUB ROLES? "${hasSubRoles}"`);

          if (hasSubRoles) {
            addRole(member, exclusiveRole);
          } else {
            removeRole(member, exclusiveRole);
          }
        }
      })
    );
  },
};
