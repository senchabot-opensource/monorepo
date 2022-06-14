module.exports = {
  name: "guildMemberUpdate",
  execute(member) {
    console.log("guildMemberUpdate", member.user.username);
  },
};
