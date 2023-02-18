import { Guild, GuildMember, PermissionFlagsBits, Role } from "discord.js";
import checkBotPermission from "./botFunctions";
import { env } from "./env";
import { selectByIdCallback, selectByNameCallback } from "./helpers";

function checkMemberRole(member: GuildMember, role: Role | undefined) {
  return role && member.roles.cache.some(selectByIdCallback(role.id));
}

export function addRole(member: GuildMember, memberRole: Role | undefined) {
  // Check if the bot has the Manage Roles permission.
  if (checkBotPermission(member.guild, PermissionFlagsBits.ManageRoles)) {
    const hasRole = checkMemberRole(member, memberRole);

    if (!hasRole && memberRole) {
      console.log(`ADD "${memberRole.name}" ROLE -> "${member.user.tag}".`);
      member.roles.add(memberRole).catch(console.error);
    }
  } else {
    console.log(`BOT DOES NOT HAVE PERMISSIONS TO "MANAGE ROLES".`);
  }
}

export function removeRole(member: GuildMember, memberRole: Role) {
  // Check if the bot has the Manage Roles permission.
  if (checkBotPermission(member.guild, PermissionFlagsBits.ManageRoles)) {
    const hasRole = checkMemberRole(member, memberRole);

    if (hasRole) {
      console.log(
        `REMOVE "${memberRole.name}" ROLE FROM "${member.user.tag}".`
      );
      member.roles.remove(memberRole).catch(console.error);
    }
  } else {
    console.log(`BOT DOES NOT HAVE PERMISSIONS TO "MANAGE ROLES".`);
  }
}

export async function addRoleAll(guild: Guild, memberRole: Role) {
  const guildMembers = await guild.members.fetch();

  guildMembers.forEach((member) => {
    const hasRole = checkMemberRole(member, memberRole);

    if (!hasRole && !member.user.bot) {
      addRole(member, memberRole);
    }
  });
}

export function checkMemberPermission(
  memberPermissions: any,
  permissionFlag: bigint
) {
  console.log(
    "memberPermissions.has(permissionFlag)",
    memberPermissions.has(permissionFlag)
  );
  return memberPermissions.has(permissionFlag);
}

export function checkExclusiveRole(guild: any, _member: any) {
  const subRoles = env.SUB_ROLES as string;

  const splitSubRoles = subRoles.split(",");

  if (!splitSubRoles.length) return;

  const exclusiveRoleName = env.EXCLUSIVE_ROLE_NAME;

  const exclusiveRole = guild.roles.cache.find(
    selectByNameCallback(exclusiveRoleName)
  );

  if (!exclusiveRole) {
    console.log("EXCLUSIVE ROLE NOT FOUND.");
    return;
  }

  const hasSubRoles = splitSubRoles.some((role) =>
    _member._roles.includes(role)
  );

  console.log(`${_member.user.tag} HAS ONE OF SUB ROLES? "${hasSubRoles}"`);

  if (hasSubRoles) {
    addRole(_member, exclusiveRole);
  } else {
    removeRole(_member, exclusiveRole);
  }
}
