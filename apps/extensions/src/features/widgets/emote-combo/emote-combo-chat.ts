import { withoutAction } from '#/lib/chat-text';
import type { IrcLine } from '#/lib/twitch';
import type { EmoteChatInput } from '../emote-wall/emote-utils';
import { kickViewerEvent, twitchViewerEvent, type ViewerMessage } from '../viewer-chat/viewer-chat';

/**
 * A chat message with its emotes still in it: the viewer's side as the other chat widgets read
 * it (mods, bots, Shared Chat), and the raw text with Twitch's emote positions or Kick's
 * [emote:id:name] tokens, read against the emote maps when it arrives.
 */
export interface EmoteChat {
  viewer: ViewerMessage;
  input: EmoteChatInput;
}

/** One Twitch IRC line as an emote chat message, or null. */
export function twitchEmoteChat(line: IrcLine): EmoteChat | null {
  const viewer = twitchViewerEvent(line);
  if (viewer?.kind !== 'message') return null;
  // A /me message's emote positions count from its text, not from the wrapper.
  const message = withoutAction(line.params[1] ?? '');
  return { viewer, input: { platform: 'twitch', message, emotes: line.tags.emotes || undefined } };
}

/** One Kick Pusher event from chatrooms.{id}.v2 as an emote chat message, or null. */
export function kickEmoteChat(eventName: string, data: unknown): EmoteChat | null {
  const viewer = kickViewerEvent(eventName, data);
  if (viewer?.kind !== 'message') return null;
  const content = (data as { content?: unknown }).content;
  return {
    viewer,
    input: { platform: 'kick', message: typeof content === 'string' ? content : '' },
  };
}
