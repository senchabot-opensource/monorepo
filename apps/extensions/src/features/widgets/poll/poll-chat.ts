import { getKickSubStatus, isSubscriber } from '#/hooks/use-raffle-chat';
import { withoutBypassSuffix } from '#/lib/chat-text';
import { type IrcLine, stripReplyMention } from '#/lib/twitch';
import type { SubathonPlatform } from '../subathon/subathon-events';

/** What the poll reads from chat: every message, and who got timed out or banned. */
export type PollChatEvent =
  | {
      kind: 'message';
      platform: SubathonPlatform;
      /** Lowercase login, which tells voters apart. */
      login: string;
      text: string;
      mod: boolean;
      /** Subscriber or founder, or the broadcaster. */
      sub: boolean;
    }
  | { kind: 'ban'; platform: SubathonPlatform; login: string };

// A /me message arrives wrapped as \x01ACTION ...\x01.
const ACTION = '\x01ACTION ';
const withoutAction = (text: string) =>
  text.startsWith(ACTION) && text.endsWith('\x01') ? text.slice(ACTION.length, -1) : text;

/** One Twitch IRC line as a poll event, or null. */
export function twitchPollEvent(line: IrcLine): PollChatEvent | null {
  const { tags } = line;
  // In a Shared Chat session the partner channels' messages come through too.
  const sourceRoom = tags['source-room-id'];
  if (sourceRoom && sourceRoom !== tags['room-id']) return null;

  if (line.command === 'CLEARCHAT') {
    // A timeout or ban names the user; without one the whole chat was cleared, which says
    // nothing about the votes.
    const login = line.params[1]?.toLowerCase();
    return login ? { kind: 'ban', platform: 'twitch', login } : null;
  }
  if (line.command !== 'PRIVMSG') return null;

  const login = line.source.split('!')[0].toLowerCase();
  const raw = line.params[1];
  if (!login || raw === undefined) return null;
  // A reply starts with "@parent ", so "@bob 2" still votes 2.
  const parents = [tags['reply-parent-display-name'], tags['reply-parent-user-login']];
  const { message } = stripReplyMention(
    withoutAction(withoutBypassSuffix(raw)).trim(),
    undefined,
    parents,
  );
  const badges = tags.badges ?? '';
  return {
    kind: 'message',
    platform: 'twitch',
    login,
    text: message,
    mod: tags.mod === '1' || /(^|,)(broadcaster|moderator)\//.test(badges),
    sub: isSubscriber(tags),
  };
}

type KickRecord = Record<string, unknown>;
const record = (value: unknown): KickRecord | null =>
  value && typeof value === 'object' ? (value as KickRecord) : null;
const text = (value: unknown): string => (typeof value === 'string' ? value : '');

/** One Kick Pusher event from chatrooms.{id}.v2 (payload already parsed) as a poll event. */
export function kickPollEvent(eventName: string, data: unknown): PollChatEvent | null {
  const payload = record(data);
  if (!payload) return null;
  switch (eventName) {
    case 'App\\Events\\ChatMessageEvent': {
      // A shared resub arrives as a chat message too; its text is the viewer's resub message.
      if (payload.type === 'celebration') return null;
      const sender = record(payload.sender);
      const login = text(sender?.username).toLowerCase();
      if (!login) return null;
      const rawBadges = record(sender?.identity)?.badges;
      const badges = (Array.isArray(rawBadges) ? rawBadges : []).map((badge) => {
        const { type, count } = record(badge) ?? {};
        return { type: text(type), count: typeof count === 'number' ? count : undefined };
      });
      return {
        kind: 'message',
        platform: 'kick',
        login,
        text: withoutBypassSuffix(text(payload.content)).trim(),
        mod: badges.some((badge) => badge.type === 'broadcaster' || badge.type === 'moderator'),
        sub: getKickSubStatus(badges).isSub,
      };
    }
    // Timeouts come as UserBannedEvent too, with permanent: false.
    case 'App\\Events\\UserBannedEvent': {
      const login = text(record(payload.user)?.username).toLowerCase();
      return login ? { kind: 'ban', platform: 'kick', login } : null;
    }
    default:
      return null;
  }
}
