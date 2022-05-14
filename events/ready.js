module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    const roleName = process.env.ROLE;
    const memberRole = guild.roles.cache.find((role) => role.name === roleName);

    guild.members.cache.forEach((member) => {
      const hasRole = member.roles.cache.some(
        (role) => role.id === memberRole.id
      );

      if (!hasRole) {
        console.log('GIVE "' + roleName + '" ROLE -> ' + member.displayName);
        member.roles.add(memberRole).catch(console.error);
      }
    });
  },
};
