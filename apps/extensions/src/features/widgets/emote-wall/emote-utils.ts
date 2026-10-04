import type { ChannelEmote } from '#/features/widgets/countdown/countdown-emotes';
import { parseTwitchEmoteRanges } from '#/lib/twitch-emotes';
export const KICK_EMOTE_RE = /\[emote:(\d+):([\w\d\-_]+)\]/g;

export const kickEmoteUrl = (id: string) =>
  `https://files.kick.com/emotes/${id}/fullsize`;

export const twitchEmoteUrl = (id: string, size: '1.0' | '2.0' | '3.0' = '3.0') =>
  `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/${size}`;

export const sevenTvEmoteUrl = (id: string) =>
  `https://cdn.7tv.app/emote/${id}/4x.webp`;

export const bttvEmoteUrl = (id: string) =>
  `https://cdn.betterttv.net/emote/${id}/3x.webp`;

// Twitch CDN and Kick CDN urls carry the native emote id: either numeric
// ("25") or new-format ("emotesv2_9563d7c..."). Third-party urls
// (`cdn.7tv.app/emote/`, `cdn.betterttv.net/emote/`, `cdn.frankerfacez.com/emote/`,
// all `/emote/` singular) never match, so third-party emotes fall out on their own.
/** `platform:id` for a native chat emote url, or null when it has none. */
const NATIVE_EMOTE_ID_RE = /\/(?:emoticons\/v2|emotes)\/(emotesv2_[0-9a-fA-F]+|\d+)(?:\/|$)/;

export function nativeEmoteKey(platform: 'twitch' | 'kick', url: string): string | null {
  const id = NATIVE_EMOTE_ID_RE.exec(url)?.[1];
  return id ? `${platform}:${id}` : null;
}

/**
 * Lookup keys for a channel's subscriber emotes: the channel's native Twitch
 * set plus the subscriber-only Kick emotes. 7TV/BTTV/FFZ sets stay out on
 * purpose: anyone may use them, so they are not subscriber emotes.
 */
export function channelSubEmoteKeys(emotes: readonly ChannelEmote[]): Set<string> {
  const keys = new Set<string>();
  for (const emote of emotes) {
    if (emote.provider !== 'Twitch' && !(emote.provider === 'Kick' && emote.subOnly)) continue;
    const id = NATIVE_EMOTE_ID_RE.exec(emote.url)?.[1];
    if (id) keys.add(`${emote.platform}:${id}`);
  }
  return keys;
}

export type SubscriberChatInput = {
  platform: 'twitch' | 'kick';
  badges?: string[];
};

/**
 * Subscriber check from parsed chat badges (same conventions as raffle):
 * Twitch badges look like `subscriber/12`, Kick badges like
 * `subscriber/6` (or bare `subscriber`). Founders and the broadcaster
 * count as subscribers. Gift badges (`sub_gifter`) do not.
 */
export function isSubscriberMessage(input: SubscriberChatInput): boolean {
  const badges = input.badges ?? [];
  for (const badge of badges) {
    const base = badge.toLowerCase().split('/')[0];
    if (base === 'subscriber' || base === 'sub' || base === 'founder') {
      return true;
    }
    if (base === 'broadcaster') {
      return true;
    }
  }
  return false;
}

export const HYPE_WINDOW_MS = 15_000;
export const HYPE_MIN_USERS = 2;
export const SPAM_WINDOW_MS = 10_000;
/** More same-emote repeats than this by one user in the window counts as spam. */
export const SPAM_MAX_REPEATS = 2;
/** More emote messages than this by one user in the window counts as spam. */
export const SPAM_MAX_MESSAGES = 3;

export type HypeSighting = { user: string; at: number };
export type HypeState = Map<string, { sightings: HypeSighting[]; lastFiredAt: number }>;

function pruneHypeState(
  state: HypeState,
  now: number,
  windowMs: number,
): void {
  for (const [url, entry] of state) {
    entry.sightings = entry.sightings.filter((s) => now - s.at < windowMs);
    if (entry.sightings.length === 0) {
      state.delete(url);
    }
  }
}

/**
 * Hype gate: returns true once the same emote was sent by enough distinct
 * users within the window. Re-fires at most once per window while hype lasts.
 */
export function checkHype(
  state: HypeState,
  url: string,
  userLower: string,
  now: number,
  opts: { windowMs?: number; minUsers?: number } = {},
): boolean {
  const windowMs = opts.windowMs ?? HYPE_WINDOW_MS;
  const minUsers = opts.minUsers ?? HYPE_MIN_USERS;
  let entry = state.get(url);
  if (!entry) {
    entry = { sightings: [], lastFiredAt: Number.NEGATIVE_INFINITY };
    state.set(url, entry);
  }
  entry.sightings = entry.sightings.filter((s) => now - s.at < windowMs);
  entry.sightings.push({ user: userLower, at: now });
  if (state.size > 500) {
    pruneHypeState(state, now, windowMs);
  }
  const distinctUsers = new Set(entry.sightings.map((s) => s.user));
  if (distinctUsers.size >= minUsers && now - entry.lastFiredAt >= windowMs) {
    entry.lastFiredAt = now;
    return true;
  }
  return false;
}

export type SpamState = {
  /** `${user} ${url}` -> sighting timestamps (same-emote repeats). */
  byEmote: Map<string, number[]>;
  /** user -> emote-message timestamps (overall rate). */
  byUser: Map<string, number[]>;
};

export function createSpamState(): SpamState {
  return { byEmote: new Map(), byUser: new Map() };
}

function pruneTimes(times: number[], now: number, windowMs: number): number[] {
  return times.filter((at) => now - at < windowMs);
}

function sweepSpamState(state: SpamState, now: number, windowMs: number): void {
  for (const map of [state.byEmote, state.byUser]) {
    for (const [k, times] of map) {
      const fresh = pruneTimes(times, now, windowMs);
      if (fresh.length === 0) {
        map.delete(k);
      } else {
        map.set(k, fresh);
      }
    }
  }
}

/**
 * Spam filter for one user's emote message. Blocks the whole message when
 * the user exceeds the emote-message rate, otherwise drops only the
 * individually spammed (rapidly repeated same) emotes. Returns the allowed
 * urls, possibly empty. Sliding windows recover on their own.
 */
export function filterSpam(
  state: SpamState,
  userLower: string,
  urls: string[],
  now: number,
  opts: { windowMs?: number; maxRepeats?: number; maxMessages?: number } = {},
): string[] {
  if (urls.length === 0) return urls;
  const windowMs = opts.windowMs ?? SPAM_WINDOW_MS;
  const maxRepeats = opts.maxRepeats ?? SPAM_MAX_REPEATS;
  const maxMessages = opts.maxMessages ?? SPAM_MAX_MESSAGES;

  // Record sightings first so blocked attempts keep counting.
  for (const url of urls) {
    const key = `${userLower} ${url}`;
    state.byEmote.set(key, [
      ...pruneTimes(state.byEmote.get(key) ?? [], now, windowMs),
      now,
    ]);
  }
  state.byUser.set(
    userLower,
    pruneTimes(state.byUser.get(userLower) ?? [], now, windowMs),
  );
  state.byUser.get(userLower)?.push(now);

  if (state.byEmote.size + state.byUser.size > 1000) {
    sweepSpamState(state, now, windowMs);
  }

  // Per-user rate: too many emote messages in a short time.
  if ((state.byUser.get(userLower) ?? []).length > maxMessages) {
    return [];
  }

  // Same-emote repeats: drop only the spammed emotes.
  return urls.filter((url) => {
    const times = state.byEmote.get(`${userLower} ${url}`) ?? [];
    return times.length <= maxRepeats;
  });
}

export const MAX_EMOTES_PER_MESSAGE = 5;

/**
 * Kick native: message is emote-only when stripping all
 * `[emote:id:name]` tokens leaves only whitespace.
 */
export function getKickEmoteOnlyUrls(message: string): string[] | null {
  if (!message || !message.includes('[emote:')) return null;
  const ids: string[] = [];
  // Reset regex state (global flag is stateful)
  KICK_EMOTE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = KICK_EMOTE_RE.exec(message)) !== null) {
    ids.push(m[1]);
  }
  KICK_EMOTE_RE.lastIndex = 0;
  if (ids.length === 0) return null;

  const remainder = message.replace(KICK_EMOTE_RE, '').trim();
  KICK_EMOTE_RE.lastIndex = 0;
  if (remainder !== '') return null;

  return ids
    .slice(0, MAX_EMOTES_PER_MESSAGE)
    .map((id) => kickEmoteUrl(id));
}

/**
 * Twitch native: message is emote-only when every non-space
 * character is covered by an emote range from the `emotes` IRC tag.
 */
export function getTwitchNativeEmoteOnlyUrls(
  message: string,
  emotesTag?: string,
): string[] | null {
  const ranges = parseTwitchEmoteRanges(emotesTag);
  if (ranges.length === 0) return null;
  const trimmed = message.trim();
  if (!trimmed) return null;

  const chars = [...message];
  const covered = new Array<boolean>(chars.length).fill(false);
  for (const r of ranges) {
    for (let i = r.start; i <= r.end && i < covered.length; i++) {
      if (i >= 0) covered[i] = true;
    }
  }

  for (let i = 0; i < chars.length; i++) {
    if (chars[i].trim() === '') continue;
    if (!covered[i]) return null;
  }

  return ranges
    .slice(0, MAX_EMOTES_PER_MESSAGE)
    .map((r) => twitchEmoteUrl(r.id));
}

/**
 * Third-party (7TV/BTTV/FFZ): message is emote-only when every
 * whitespace-separated token is a known emote name. The map holds
 * name -> image URL, merged the chat widget's way (FFZ < BTTV < 7TV,
 * channel over global).
 */
export function getThirdPartyEmoteOnlyUrls(
  message: string,
  emoteMap: Map<string, string>,
): string[] | null {
  if (emoteMap.size === 0) return null;
  const trimmed = message.trim();
  if (!trimmed) return null;
  const tokens = trimmed.split(/\s+/);
  const urls: string[] = [];
  for (const token of tokens) {
    const url = emoteMap.get(token);
    if (!url) return null;
    urls.push(url);
  }
  return urls.length > 0 ? urls.slice(0, MAX_EMOTES_PER_MESSAGE) : null;
}

/** The 7TV-only name for the shared third-party check (BTTV/FFZ match the same way). */
export const getSevenTvEmoteOnlyUrls = getThirdPartyEmoteOnlyUrls;

export type EmoteChatInput = {
  message: string;
  platform: 'twitch' | 'kick';
  emotes?: string;
};

/**
 * Mixed check: supports messages like one native Twitch emote +
 * one third-party emote, or Kick native + third-party mix. Each token
 * must be either a native emote or a known third-party emote.
 */
export function getEmoteOnlyUrls(
  input: EmoteChatInput,
  thirdPartyMap?: Map<string, string> | null,
): string[] {
  const { message, platform } = input;
  const trimmed = message.trim();
  if (!trimmed) return [];

  // Fast paths first.
  if (platform === 'kick') {
    const kickOnly = getKickEmoteOnlyUrls(message);
    if (kickOnly) return kickOnly;
  } else {
    const twitchOnly = getTwitchNativeEmoteOnlyUrls(message, input.emotes);
    if (twitchOnly) return twitchOnly;
  }

  if (thirdPartyMap && thirdPartyMap.size > 0) {
    const thirdPartyOnly = getThirdPartyEmoteOnlyUrls(message, thirdPartyMap);
    if (thirdPartyOnly) return thirdPartyOnly;
  }

  // Mixed native + third-party token check.
  const tokens = trimmed.split(/\s+/);
  if (tokens.length <= 1) return [];

  if (platform === 'twitch') {
    const ranges = parseTwitchEmoteRanges(input.emotes);
    const nativeTexts = new Map<string, string[]>();
    const chars = [...message];
    for (const r of ranges) {
      const text = chars.slice(r.start, r.end + 1).join('');
      const list = nativeTexts.get(text) ?? [];
      list.push(r.id);
      nativeTexts.set(text, list);
    }
    if (nativeTexts.size === 0) return [];

    const urls: string[] = [];
    const consumed = new Map<string, number>();
    for (const token of tokens) {
      const thirdPartyUrl = thirdPartyMap?.get(token);
      if (thirdPartyUrl) {
        urls.push(thirdPartyUrl);
        continue;
      }
      const ids = nativeTexts.get(token);
      if (ids && ids.length > 0) {
        const used = consumed.get(token) ?? 0;
        if (used < ids.length) {
          urls.push(twitchEmoteUrl(ids[used]));
          consumed.set(token, used + 1);
          continue;
        }
      }
      return [];
    }
    return urls.slice(0, MAX_EMOTES_PER_MESSAGE);
  }

  // Kick mixed: tokens are either [emote:id:name] or third-party names.
  const urls: string[] = [];
  for (const token of tokens) {
    KICK_EMOTE_RE.lastIndex = 0;
    const single = new RegExp(
      `^\\[emote:(\\d+):([\\w\\d\\-_]+)\\]$`,
    ).exec(token);
    if (single) {
      urls.push(kickEmoteUrl(single[1]));
      continue;
    }
    const thirdPartyUrl = thirdPartyMap?.get(token);
    if (thirdPartyUrl) {
      urls.push(thirdPartyUrl);
      continue;
    }
    return [];
  }
  KICK_EMOTE_RE.lastIndex = 0;
  return urls.length > 0
    ? urls.slice(0, MAX_EMOTES_PER_MESSAGE)
    : [];
}

/**
 * Lenient extraction: returns every emote found in the message even when
 * mixed with normal text. Used by the "show emotes in messages too" option.
 */
export function getAnyEmoteUrls(
  input: EmoteChatInput,
  thirdPartyMap?: Map<string, string> | null,
): string[] {
  const { message, platform } = input;
  const trimmed = message.trim();
  if (!trimmed) return [];

  const urls: string[] = [];

  if (platform === 'kick') {
    KICK_EMOTE_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = KICK_EMOTE_RE.exec(message)) !== null) {
      urls.push(kickEmoteUrl(m[1]));
      if (urls.length >= MAX_EMOTES_PER_MESSAGE) break;
    }
    KICK_EMOTE_RE.lastIndex = 0;
  } else {
    const ranges = parseTwitchEmoteRanges(input.emotes);
    for (const r of ranges) {
      urls.push(twitchEmoteUrl(r.id));
      if (urls.length >= MAX_EMOTES_PER_MESSAGE) break;
    }
  }

  if (urls.length < MAX_EMOTES_PER_MESSAGE && thirdPartyMap && thirdPartyMap.size > 0) {
    // Skip tokens already covered by a native emote to avoid doubles.
    const nativeTexts = new Set<string>();
    if (platform === 'twitch') {
      const chars = [...message];
      for (const r of parseTwitchEmoteRanges(input.emotes)) {
        nativeTexts.add(chars.slice(r.start, r.end + 1).join(''));
      }
    }
    for (const token of trimmed.split(/\s+/)) {
      if (nativeTexts.has(token)) continue;
      const url = thirdPartyMap.get(token);
      if (url) {
        urls.push(url);
        if (urls.length >= MAX_EMOTES_PER_MESSAGE) break;
      }
    }
  }

  return urls.slice(0, MAX_EMOTES_PER_MESSAGE);
}
