function checkBotPermission(guild, permissionFlag) {
  return guild.members.me.permissions.has(permissionFlag);
}

module.exports = { checkBotPermission };
