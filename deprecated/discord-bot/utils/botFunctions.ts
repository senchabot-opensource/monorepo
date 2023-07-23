export default function checkBotPermission(guild: any, permissionFlag: bigint) {
  // FIXME: always returns true
  return guild.members.me.permissions.has(permissionFlag);
}
