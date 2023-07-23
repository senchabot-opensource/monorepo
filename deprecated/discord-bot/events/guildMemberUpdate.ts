import { GuildMember } from "discord.js";
import { checkExclusiveRole } from "../utils/memberFunctions";

export default {
  name: "guildMemberUpdate",
  async execute(member: GuildMember) {
    const userName = member.user.username;

    const guildMembers = await member.guild.members.fetch();

    guildMembers
      .filter((member: GuildMember) => member.user.username === userName)
      .forEach((_member: any) => {
        checkExclusiveRole(member.guild, _member);
      });
  },
};
