import type { IrcLine } from '#/lib/twitch';
import { kickSubChannels, kickSubCount } from '../sub-sprout/kick-sub-events';
import { parseCommand, type SubathonCommand } from './subathon-timer';

export type SubathonPlatform = 'twitch' | 'kick';
export type SubTier = 1 | 2 | 3;

/** Something that adds time: a sub, gifted subs, or Bits or Kicks. */
export type TimedEvent =
  | { kind: 'sub'; platform: SubathonPlatform; name: string; tier: SubTier }
  | { kind: 'gift'; platform: SubathonPlatform; name: string; count: number; tier: SubTier }
  | { kind: 'bits'; platform: SubathonPlatform; name: string; amount: number };

/** Something that changes the clock: a timed event or a mod command. */
export type SubathonEvent =
  | TimedEvent
  | { kind: 'command'; platform: SubathonPlatform; command: SubathonCommand };

// Twitch's msg-param-sub-plan. Prime is a Tier 1 sub.
const TIERS: Record<string, SubTier> = { Prime: 1, '1000': 1, '2000': 2, '3000': 3 };
const tierOf = (plan: string | undefined): SubTier => TIERS[plan ?? ''] ?? 1;

const positiveInt = (value: unknown): number => {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

/**
 * One Twitch IRC line as a subathon event, or null. A gift bundle arrives as one submysterygift
 * with the total, then one subgift per recipient, all with the same msg-param-community-gift-id
 * (checked on live chat). The bundle counts once; `bundles` holds how many of its subgifts are
 * still to come, so those are skipped. A subgift outside a bundle counts on its own.
 */
export function twitchEvent(line: IrcLine, bundles: Map<string, number>): SubathonEvent | null {
  const { tags } = line;
  const name = tags['display-name'] || tags.login || '';
  // In a Shared Chat session the partner channels' messages come through too, marked with their
  // own source-room-id. Their cheers and mods aren't ours.
  const sourceRoom = tags['source-room-id'];
  if (sourceRoom && sourceRoom !== tags['room-id']) return null;

  if (line.command === 'PRIVMSG') {
    const bits = positiveInt(tags.bits);
    if (bits > 0) return { kind: 'bits', platform: 'twitch', name, amount: bits };
    const badges = tags.badges ?? '';
    const isMod = tags.mod === '1' || /(^|,)(broadcaster|moderator)\//.test(badges);
    const command = isMod ? parseCommand(line.params[1] ?? '') : null;
    return command ? { kind: 'command', platform: 'twitch', command } : null;
  }

  if (line.command !== 'USERNOTICE') return null;
  const tier = tierOf(tags['msg-param-sub-plan']);
  switch (tags['msg-id']) {
    case 'sub':
    case 'resub':
      return { kind: 'sub', platform: 'twitch', name, tier };
    case 'submysterygift':
    case 'anonsubmysterygift': {
      const count = positiveInt(tags['msg-param-mass-gift-count']) || 1;
      const id = tags['msg-param-community-gift-id'];
      if (id) bundles.set(id, count);
      return { kind: 'gift', platform: 'twitch', name, count, tier };
    }
    case 'subgift':
    case 'anonsubgift': {
      const id = tags['msg-param-community-gift-id'];
      const pending = id ? bundles.get(id) : undefined;
      if (id && pending !== undefined) {
        if (pending <= 1) bundles.delete(id);
        else bundles.set(id, pending - 1);
        return null;
      }
      return { kind: 'gift', platform: 'twitch', name, count: 1, tier };
    }
    default:
      return null;
  }
}

/**
 * Sub Sprout's channels plus channel_{channel}, where Kicks and ChannelSubscriptionEvent come.
 * That one takes the channel id, not the chatroom id.
 */
export const kickSubathonChannels = (chatroomId: string, channelId: string | null): string[] => [
  ...kickSubChannels(chatroomId),
  ...(channelId ? [`channel_${channelId}`] : []),
];

type KickRecord = Record<string, unknown>;
const record = (value: unknown): KickRecord | null =>
  value && typeof value === 'object' ? (value as KickRecord) : null;
const text = (value: unknown): string => (typeof value === 'string' ? value : '');

/** What a Kick event keeps between messages to count every sub and gift once. */
export interface KickDedupe {
  /** Ids of gifted-sub events whose later chunks are still to come. */
  giftChunks: Set<string>;
  /** Gifted-sub payloads seen lately, with when. */
  gifts: Map<string, number>;
  /** gift_transaction_id of every Kicks gift already counted. */
  kicks: Set<string>;
  /** When each subscriber's sub was counted, by lowercase username. */
  subs: Map<string, number>;
}

export const createKickDedupe = (): KickDedupe => ({
  giftChunks: new Set(),
  gifts: new Map(),
  kicks: new Set(),
  subs: new Map(),
});

// Both sub events for one sub arrive within the same second.
const KICK_SUB_PAIR_MS = 60_000;
// Same window as Sub Sprout: Kick can deliver one gift event twice in a row.
const KICK_GIFT_REPEAT_MS = 10_000;
const KICKS_SEEN_MAX = 500;

/** Whether `key` was seen within `windowMs`; if not, it's recorded now. Older keys are dropped. */
function seenRecently(seen: Map<string, number>, key: string, now: number, windowMs: number) {
  for (const [old, at] of seen) {
    if (now - at > windowMs) seen.delete(old);
  }
  if (seen.has(key)) return true;
  seen.set(key, now);
  return false;
}

/** One Kick Pusher event (payload already parsed from JSON) as a subathon event, or null. */
export function kickEvent(
  eventName: string,
  data: unknown,
  dedupe: KickDedupe,
  now = Date.now(),
): SubathonEvent | null {
  const payload = record(data);
  if (!payload) return null;
  switch (eventName) {
    // A paid sub comes as SubscriptionEvent, ChannelSubscriptionEvent or both: live traffic had
    // subs with only one either way, and gift recipients get neither. So either counts, once.
    case 'App\\Events\\SubscriptionEvent':
    case 'App\\Events\\ChannelSubscriptionEvent': {
      const name = text(payload.username);
      if (name && seenRecently(dedupe.subs, name.toLowerCase(), now, KICK_SUB_PAIR_MS)) return null;
      return { kind: 'sub', platform: 'kick', name, tier: 1 };
    }
    case 'GiftedSubscriptionsEvent': {
      if (seenRecently(dedupe.gifts, JSON.stringify(payload), now, KICK_GIFT_REPEAT_MS))
        return null;
      const count = kickSubCount(eventName, payload, dedupe.giftChunks);
      return count > 0
        ? { kind: 'gift', platform: 'kick', name: text(payload.gifter_username), count, tier: 1 }
        : null;
    }
    case 'KicksGifted': {
      const amount = positiveInt(record(payload.gift)?.amount);
      const id = text(payload.gift_transaction_id);
      if (amount <= 0 || (id && dedupe.kicks.has(id))) return null;
      if (id) {
        dedupe.kicks.add(id);
        // Only recent ids matter for spotting a repeat.
        if (dedupe.kicks.size > KICKS_SEEN_MAX) {
          dedupe.kicks.delete(dedupe.kicks.values().next().value as string);
        }
      }
      return {
        kind: 'bits',
        platform: 'kick',
        name: text(record(payload.sender)?.username),
        amount,
      };
    }
    case 'App\\Events\\ChatMessageEvent': {
      const sender = record(payload.sender);
      const badges = record(sender?.identity)?.badges;
      const isMod =
        Array.isArray(badges) &&
        badges.some((badge) => ['broadcaster', 'moderator'].includes(text(record(badge)?.type)));
      const command = isMod ? parseCommand(text(payload.content)) : null;
      return command ? { kind: 'command', platform: 'kick', command } : null;
    }
    default:
      return null;
  }
}
