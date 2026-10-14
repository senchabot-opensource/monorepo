import { useEffect } from 'react';
import { useKickChannel } from '#/hooks/use-kick-channel';
import { getKickSubStatus, isSubscriber, KNOWN_BOTS } from '#/hooks/use-raffle-chat';
import { KickPusherReader, kickChatroomChannel, TwitchIrcReader } from '#/lib/chat-readers';
import { withoutAction, withoutBypassSuffix } from '#/lib/chat-text';
import { type IrcLine, isTwitchReply } from '#/lib/twitch';
import type { SubathonPlatform } from '../subathon/subathon-events';

/**
 * Every chat message with who wrote it, for the widgets that list or answer viewers (End
 * Credits, Viewer Queue, Task List), and who got timed out or banned.
 */
export type ViewerChatEvent =
  | {
      kind: 'message';
      platform: SubathonPlatform;
      /** Lowercase login, which tells viewers apart. */
      login: string;
      /** As the viewer writes it, for the screen. */
      name: string;
      text: string;
      /** A moderator or the broadcaster. */
      mod: boolean;
      broadcaster: boolean;
      /** Subscriber or founder, or the broadcaster. */
      sub: boolean;
      /** A reply or a resub shared in chat: chat all the same, but never a command. */
      aside: boolean;
      /** Nightbot, StreamElements and the like. */
      bot: boolean;
    }
  | { kind: 'ban'; platform: SubathonPlatform; login: string };

export type ViewerMessage = Extract<ViewerChatEvent, { kind: 'message' }>;

/** One Twitch IRC line as a viewer chat event, or null. */
export function twitchViewerEvent(line: IrcLine): ViewerChatEvent | null {
  const { tags } = line;
  // In a Shared Chat session the partner channels' messages come through too.
  const sourceRoom = tags['source-room-id'];
  if (sourceRoom && sourceRoom !== tags['room-id']) return null;

  if (line.command === 'CLEARCHAT') {
    const login = line.params[1]?.toLowerCase();
    return login ? { kind: 'ban', platform: 'twitch', login } : null;
  }
  if (line.command !== 'PRIVMSG') return null;

  const login = line.source.split('!')[0].toLowerCase();
  const raw = line.params[1];
  if (!login || raw === undefined) return null;
  const badges = tags.badges ?? '';
  const broadcaster = /(^|,)broadcaster\//.test(badges);
  return {
    kind: 'message',
    platform: 'twitch',
    login,
    name: tags['display-name'] || login,
    text: withoutAction(withoutBypassSuffix(raw)).trim(),
    mod: broadcaster || tags.mod === '1' || /(^|,)moderator\//.test(badges),
    broadcaster,
    sub: isSubscriber(tags),
    aside: isTwitchReply(tags),
    bot: KNOWN_BOTS.has(login),
  };
}

type KickRecord = Record<string, unknown>;
const record = (value: unknown): KickRecord | null =>
  value && typeof value === 'object' ? (value as KickRecord) : null;
const text = (value: unknown): string => (typeof value === 'string' ? value : '');
// Kick sends an emote as [emote:id:name] where Twitch sends its name.
const KICK_EMOTE = /\[emote:\d+:([^\]]*)\]/g;

/** One Kick Pusher event from chatrooms.{id}.v2 (payload already parsed), or null. */
export function kickViewerEvent(eventName: string, data: unknown): ViewerChatEvent | null {
  const payload = record(data);
  if (!payload) return null;
  switch (eventName) {
    case 'App\\Events\\ChatMessageEvent': {
      const sender = record(payload.sender);
      const name = text(sender?.username);
      if (!name) return null;
      const rawBadges = record(sender?.identity)?.badges;
      const badges = (Array.isArray(rawBadges) ? rawBadges : []).map((badge) => {
        const { type, count } = record(badge) ?? {};
        return { type: text(type), count: typeof count === 'number' ? count : undefined };
      });
      const broadcaster = badges.some((badge) => badge.type === 'broadcaster');
      const login = name.toLowerCase();
      return {
        kind: 'message',
        platform: 'kick',
        login,
        name,
        text: withoutBypassSuffix(text(payload.content)).replace(KICK_EMOTE, '$1').trim(),
        mod: broadcaster || badges.some((badge) => badge.type === 'moderator'),
        broadcaster,
        sub: getKickSubStatus(badges).isSub,
        aside: payload.type === 'reply' || payload.type === 'celebration',
        bot: KNOWN_BOTS.has(login),
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

type EventCallback = (event: ViewerChatEvent) => void;

/** Anonymous Twitch IRC reader for every message and every timeout or ban. */
export class TwitchViewerSource extends TwitchIrcReader<ViewerChatEvent> {
  constructor(channel: string, onEvent: EventCallback) {
    super(channel, twitchViewerEvent, onEvent);
  }
}

/** Kick Pusher reader for every message and every timeout or ban. */
export class KickViewerSource extends KickPusherReader<ViewerChatEvent> {
  constructor(chatroomId: string, onEvent: EventCallback) {
    super([kickChatroomChannel(chatroomId)], kickViewerEvent, onEvent);
  }
}

/**
 * Reads every chat message from both chats while `enabled`. `onEvent` should be stable: a new
 * one reconnects.
 */
export function useViewerChat(
  twitch: string | undefined,
  kick: string | undefined,
  enabled: boolean,
  onEvent: EventCallback,
) {
  const chatroomId = useKickChannel(kick, enabled).channel?.chatroomId;

  // One effect per platform, so a Kick lookup that lands later leaves Twitch connected.
  useEffect(() => {
    if (!enabled || !twitch) return;
    const source = new TwitchViewerSource(twitch, onEvent);
    return () => source.disconnect();
  }, [enabled, twitch, onEvent]);

  useEffect(() => {
    if (!enabled || !chatroomId) return;
    const source = new KickViewerSource(chatroomId, onEvent);
    return () => source.disconnect();
  }, [enabled, chatroomId, onEvent]);
}
