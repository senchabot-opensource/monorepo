const { Permissions } = require("discord.js");
const { checkBotPermission } = require("./botFunctions");

function giveRole(member, memberRole) {
  if (checkBotPermission(member.guild, Permissions.FLAGS.MANAGE_ROLES)) {
    console.log(`GIVE "${memberRole.name}" ROLE -> "${member.displayName}".`);
    member.roles.add(memberRole).catch(console.error);
  } else {
    console.log(`BOT DOES NOT HAVE PERMISSIONS TO "MANAGE ROLES".`);
  }
}

function checkMemberPermission(memberPermissions, permissionFlag) {
  return memberPermissions.has(permissionFlag);
}

module.exports = { giveRole, checkMemberPermission };
