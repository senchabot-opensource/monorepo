import {
  Client,
  GuildMember,
  MessageReaction,
  PartialMessageReaction,
} from "discord.js";
import { env } from "../utils/env";
import { selectByNameCallback } from "../utils/helpers";

const { removeRole } = require("../utils/memberFunctions");

export default {
  name: "messageReactionRemove",
  async execute(
    reaction: MessageReaction | PartialMessageReaction,
    user: GuildMember,
    client: Client
  ) {
    // Fetch the message content.
    if (reaction.message.partial) await reaction.message.fetch();
    const messageContent = reaction.message.content as string;

    const reactionRulesMessageStartsWith =
      env.REACTION_RULES_MESSAGE_STARTSWITH as string;
    // Check if the message content starts with the string in the REACTION_RULES_MESSAGE_STARTSWITH variable.
    if (!messageContent.startsWith(reactionRulesMessageStartsWith)) return;

    // Get the channelId and emoji name from the reaction.
    const msgChannelId = reaction.message.channelId;
    const emojiName = reaction.emoji.name;

    // Get the guild.
    const guild = client.guilds.cache.first();

    if (!guild) return;

    // Find the rules channel with the Name REACTION_RULES_CHANNEL_NAME.
    const rulesChannel = client.channels.cache.find(
      selectByNameCallback(env.REACTION_RULES_CHANNEL_NAME)
    );

    if (!rulesChannel) return;

    // Check if the rulesChannel exists and if the ID of the rulesChannel is the same as the channel ID of the reacted message, and emojiName is the same as REACTION_EMOJI_NAME.
    if (
      rulesChannel.id !== msgChannelId ||
      emojiName !== env.REACTION_EMOJI_NAME
    )
      return;

    // Find the role with the name REACTION_ROLE_NAME.
    const role = guild.roles.cache.find(
      selectByNameCallback(env.REACTION_ROLE_NAME)
    );

    // Check if the role exists. If not, it will return.
    if (!role) return;

    // Get the member who reacted to the message.
    const member = guild.members.cache.get(user.id);

    // Remove role from member.
    removeRole(member, role);
  },
};
