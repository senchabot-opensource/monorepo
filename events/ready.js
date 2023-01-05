const { selectByNameCallback } = require("../utils/helpers");
const { addRoleAll, addRole, removeRole } = require("../utils/memberFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const roleName = process.env.ROLE_NAME;
    const exclusiveRoleName = process.env.EXCLUSIVE_ROLE_NAME;

    const guild = client.guilds.cache.get(process.env.GUILDID); // first()

    if (roleName) {
      const memberRole = guild.roles.cache.find(selectByNameCallback(roleName));

      if (!memberRole) return;

      addRoleAll(guild, memberRole);
    }

    if (exclusiveRoleName) {
      const subRoles = process.env.SUB_ROLES.split(",");

      const exclusiveRole = guild.roles.cache.find(
        selectByNameCallback(exclusiveRoleName)
      );

      if (!exclusiveRole) return;

      const guildMembers = await guild.members.fetch();

      guildMembers.forEach((_member) => {
        const hasSubRoles = subRoles.some((role) =>
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
