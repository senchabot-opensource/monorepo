const { giveRole } = require("../utils/memberFunctions");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    const roleName = process.env.ROLE;
    const memberRole = guild.roles.cache.find((role) => role.name === roleName);

    guild.members.cache.map((member) => {
      const hasRole = member.roles.cache.find(
        (role) => role.id === memberRole.id
      );

      if (!hasRole) {
        giveRole(member, memberRole);
      }
    });
  },
};
