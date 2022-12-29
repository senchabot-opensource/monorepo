const { selectByNameCallback } = require("../utils/helpers");
const { addRole, removeRole } = require("../utils/memberFunctions");

module.exports = {
  name: "guildMemberUpdate",
  async execute(member) {
    const userName = member.user.username;

    const subRoles = process.env.SUB_ROLES.split(",");

    const exclusiveRole = member.guild.roles.cache.find(
      selectByNameCallback(process.env.EXCLUSIVE_ROLE)
    );

    member.guild.members.fetch().then((members) =>
      members.some((_member) => {
        let hasSubRoles = false;
        if (_member.user.username === userName) {
          hasSubRoles = subRoles.some((role) => _member._roles.includes(role));

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
