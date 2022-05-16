function giveRole(member, memberRole) {
  console.log(`GIVE ${memberRole.name} ROLE -> ${member.displayName}`);
  member.roles.add(memberRole).catch(console.error);
}

module.exports = { giveRole };
