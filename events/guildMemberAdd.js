module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    // console.log("guildMemberAdd event", member.displayName);
    const roleName = process.env.ROLE;
    let memberRole = member.guild.roles.cache.find((r) => r.name === roleName);

    console.log('GIVE "' + roleName + '" ROLE -> ' + member.displayName);
    member.roles.add(memberRole).catch(console.error);
  },
};
