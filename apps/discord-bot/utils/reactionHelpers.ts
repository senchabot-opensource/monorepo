import { MessageReaction, PartialMessageReaction } from "discord.js";

export function reactMessageWithEmoji(
  reaction: MessageReaction | PartialMessageReaction,
  emojiName: string,
) {
  // Get the reaction's emoji.
  const emoji = reaction.emoji;

  // If the emoji names are not the same, return.
  if (emoji.name != emojiName) {
    return;
  }

  // React to the message with the emoji.
  reaction.message.react(emoji);
}
