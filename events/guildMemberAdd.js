const { selectByNameCallBack } = require("../utils/helpers");
const { addRole } = require("../utils/memberFunctions");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    // console.log("guildMemberAdd event", member.displayName);
    const roleName = process.env.ROLE;

    if (roleName) {
      let memberRole = member.guild.roles.cache.find(
        selectByNameCallBack(roleName)
      );

      addRole(member, memberRole);
    }
  },
};
