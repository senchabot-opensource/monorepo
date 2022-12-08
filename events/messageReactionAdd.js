const { client } = require("..");
const { addRole } = require("../utils/memberFunctions");

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user) {
    // Fetch the message content.
    if (reaction.message.partial) await reaction.message.fetch();

    // Check if the message content starts with the string in the REACTION_RULES_MESSAGE_STARTSWITH variable.
    if (
      !reaction.message.content.startsWith(
        process.env.REACTION_RULES_MESSAGE_STARTSWITH
      )
    )
      return;

    // Get the channelId and emoji name from the reaction.
    const msgChannelId = reaction.message.channelId;
    const emojiName = reaction.emoji.name;

    // Get the guild.
    const guild = client.guilds.cache.first();

    // Find the rules channel with the Name REACTION_RULES_CHANNEL_NAME.
    const rulesChannel = client.channels.cache.find(
      (ch) => ch.name === process.env.REACTION_RULES_CHANNEL_NAME
    );

    // Check if the rulesChannel exists and if the ID of the rulesChannel is the same as the channel ID of the reacted message, and emojiName is the same as REACTION_EMOJI_NAME.
    if (
      rulesChannel.id !== msgChannelId ||
      emojiName !== process.env.REACTION_EMOJI_NAME
    )
      return;

    // Find the role with the name REACTION_ROLE_NAME.
    const role = guild.roles.cache.find(
      (role) => role.name === process.env.REACTION_ROLE_NAME
    );

    // Check if the role exists. If not, it will return.
    if (!role) return;

    // Get the member who reacted to the message.
    const member = guild.members.cache.get(user.id);

    // Add role to member.
    addRole(member, role);
  },
};
