function checkBotPermission(guild, permissionFlag) {
  return guild.me.permissions.has(permissionFlag);
}

module.exports = { checkBotPermission };
