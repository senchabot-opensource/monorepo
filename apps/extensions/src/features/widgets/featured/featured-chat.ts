import { useEffect } from 'react';
import { type KickChannel, useKickChannel } from '#/hooks/use-kick-channel';
import { KickPusherReader, kickChatroomChannel, TwitchIrcReader } from '#/lib/chat-readers';
import { withoutBypassSuffix } from '#/lib/chat-text';
import type { IrcLine } from '#/lib/twitch';
import { kickViewerEvent, twitchViewerEvent } from '../viewer-chat/viewer-chat';
import type { FeaturedChatEvent } from './featured-state';

// One connection per chat gives both what the commands need (who is a mod, a reply, a bot) and
// what the screen needs (name color, badges, emotes).

/** One Twitch IRC line as a Featured Message event, or null. */
export function twitchFeaturedEvent(line: IrcLine): FeaturedChatEvent | null {
  if (line.command === 'CLEARMSG') {
    const id = line.tags['target-msg-id'];
    return id ? { kind: 'delete', platform: 'twitch', id } : null;
  }
  const event = twitchViewerEvent(line);
  if (event?.kind !== 'message') return event;
  const { tags } = line;
  return {
    ...event,
    id: tags.id || `twitch-${event.login}-${tags['tmi-sent-ts'] ?? Date.now()}`,
    color: tags.color || undefined,
    badges: tags.badges ? tags.badges.split(',') : [],
    // The text the emote positions count in: without the /me wrapper.
    display: event.text,
    emotes: tags.emotes || undefined,
  };
}

type KickRecord = Record<string, unknown>;
const record = (value: unknown): KickRecord | null =>
  value && typeof value === 'object' ? (value as KickRecord) : null;

/** One Kick Pusher event from chatrooms.{id}.v2 (payload already parsed), or null. */
export function kickFeaturedEvent(name: string, data: unknown): FeaturedChatEvent | null {
  const payload = record(data);
  if (
    name === 'App\\Events\\ChatMessageDeletedEvent' ||
    name === 'App\\Events\\MessageDeletedEvent'
  ) {
    const id = record(payload?.message)?.id ?? payload?.id;
    return typeof id === 'string' || typeof id === 'number'
      ? { kind: 'delete', platform: 'kick', id: String(id) }
      : null;
  }
  const event = kickViewerEvent(name, data);
  if (event?.kind !== 'message') return event;
  if (!payload) return null;
  const identity = record(record(payload.sender)?.identity);
  const rawBadges = Array.isArray(identity?.badges) ? identity.badges : [];
  const badges = rawBadges.flatMap((badge) => {
    const { type, count } = record(badge) ?? {};
    if (typeof type !== 'string' || !type) return [];
    return [typeof count === 'number' && count > 0 ? `${type}/${count}` : type];
  });
  const color = identity?.color;
  const content = typeof payload.content === 'string' ? payload.content : '';
  return {
    ...event,
    id: payload.id == null ? `kick-${event.login}-${Date.now()}` : String(payload.id),
    ...(typeof color === 'string' && color ? { color } : {}),
    badges,
    // Kick sends emotes as [emote:id:name] codes, which the overlay draws as images.
    display: withoutBypassSuffix(content).trim(),
  };
}

type EventCallback = (event: FeaturedChatEvent) => void;

/**
 * Reads both chats while `enabled`, and returns the Kick channel once kick.com answers: its
 * user id finds the 7TV emotes, its badges the subscriber badges. `onEvent` should be stable: a
 * new one reconnects.
 */
export function useFeaturedChat(
  twitch: string | undefined,
  kick: string | undefined,
  enabled: boolean,
  onEvent: EventCallback,
): KickChannel | null {
  const kickChannel = useKickChannel(kick, enabled).channel;
  const chatroomId = kickChannel?.chatroomId;

  // One effect per platform, so a Kick lookup that lands later leaves Twitch connected.
  useEffect(() => {
    if (!enabled || !twitch) return;
    const source = new TwitchIrcReader(twitch, twitchFeaturedEvent, onEvent);
    return () => source.disconnect();
  }, [enabled, twitch, onEvent]);

  useEffect(() => {
    if (!enabled || !chatroomId) return;
    const source = new KickPusherReader(
      [kickChatroomChannel(chatroomId)],
      kickFeaturedEvent,
      onEvent,
    );
    return () => source.disconnect();
  }, [enabled, chatroomId, onEvent]);

  return kickChannel;
}
