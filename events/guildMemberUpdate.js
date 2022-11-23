const { addRole } = require("../utils/memberFunctions");

module.exports = {
  name: "guildMemberUpdate",
  async execute(member) {
    const userName = member.user.username;

    const subRoles = process.env.SUB_ROLES.split(",");

    const exclusiveRole = member.guild.roles.cache.find(
      (r) => r.name === process.env.EXCLUSIVE_ROLE
    );

    let hasSubRoles = false;

    member.guild.members.fetch().then((members) =>
      members.some((_member) => {
        if (_member.user.username === userName) {
          hasSubRoles = subRoles.some((role) => _member._roles.includes(role));

          console.log(
            `${member.user.username} HAS ONE OF SUB ROLES? "${hasSubRoles}"`
          );

          if (hasSubRoles) {
            addRole(member, exclusiveRole);
          }
        }
      })
    );
  },
};
