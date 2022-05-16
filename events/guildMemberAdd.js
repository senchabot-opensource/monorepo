const { giveRole } = require("../utils/memberFunctions");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    // console.log("guildMemberAdd event", member.displayName);
    const roleName = process.env.ROLE;
    let memberRole = member.guild.roles.cache.find((r) => r.name === roleName);

    giveRole(member, memberRole);
  },
};
