function checkBotRole(guild, permissionFlag) {
  return guild.me.permissions.has(permissionFlag);
}

module.exports = { checkBotRole };
