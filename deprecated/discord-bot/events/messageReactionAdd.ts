import {
  Client,
  GuildMember,
  MessageReaction,
  PartialMessageReaction,
} from "discord.js";
import { selectByNameCallback } from "../utils/helpers";
import { addRole } from "../utils/memberFunctions";
import { isGoodMorningMessage, reactWithSun } from "../utils/reactionHelpers";

export default {
  name: "messageReactionAdd",
  async execute(
    reaction: MessageReaction | PartialMessageReaction,
    user: GuildMember,
    client: Client,
  ) {
    // Fetch the message content.
    if (reaction.message.partial) await reaction.message.fetch();

    const rulesMessageStartsWith = process.env
      .REACTION_RULES_MESSAGE_STARTSWITH as string;

    const messageContent = reaction.message.content as string;

    if (isGoodMorningMessage(messageContent)) {
      reactWithSun(reaction);
    }

    // Check if the message content starts with the string in the REACTION_RULES_MESSAGE_STARTSWITH variable.
    if (!messageContent.startsWith(rulesMessageStartsWith)) return;

    // Get the channelId and emoji name from the reaction.
    const msgChannelId = reaction.message.channelId;
    const emojiName = reaction.emoji.name;

    // Get the guild.
    const guild = client.guilds.cache.first();

    if (!guild) return;

    const reactionRulesChannelName = process.env
      .REACTION_RULES_CHANNEL_NAME as string;

    // Find the rules channel with the Name REACTION_RULES_CHANNEL_NAME.
    const rulesChannel = client.channels.cache.find(
      selectByNameCallback(reactionRulesChannelName),
    );

    if (!rulesChannel) return;

    // Check if the rulesChannel exists and if the ID of the rulesChannel is the same as the channel ID of the reacted message, and emojiName is the same as REACTION_EMOJI_NAME.
    if (
      rulesChannel.id !== msgChannelId ||
      emojiName !== process.env.REACTION_EMOJI_NAME
    )
      return;

    const reactionRoleName = process.env.REACTION_ROLE_NAME as string;

    // Find the role with the name REACTION_ROLE_NAME.
    const role = guild.roles.cache.find(selectByNameCallback(reactionRoleName));

    // Check if the role exists. If not, it will return.
    if (!role) return;

    // Get the member who reacted to the message.
    const member = guild.members.cache.get(user.id);

    if (!member) return;

    // Add role to member.
    addRole(member, role);
  },
};
