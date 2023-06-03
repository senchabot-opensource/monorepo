import { MessageReaction, PartialMessageReaction } from "discord.js";
import { GOOD_MORNING_REGEXP, SUN_WITH_FACE_EMOJI } from "../config";

export const isGoodMorningMessage = (msg: string): boolean =>
  GOOD_MORNING_REGEXP.test(msg);

export const reactWithSun = (
  reaction: MessageReaction | PartialMessageReaction,
) => reactMessageWithEmoji(reaction, SUN_WITH_FACE_EMOJI);

function reactMessageWithEmoji(
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
