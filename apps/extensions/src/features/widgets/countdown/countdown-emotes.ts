import {
  parse7tvSet,
  parseBttv,
  parseFfz,
} from '#/features/widgets/chat-widget/use-channel-emotes';
import { fetchJson } from '#/lib/fetch-json';
import { getKickChannelInfo } from '#/lib/kick';

export interface ChannelEmote {
  name: string;
  url: string;
  /** Smaller variant for the picker grid; the full URL is what gets picked. */
  thumb: string;
  /** Which of the streamer's channels owns it. */
  platform: 'twitch' | 'kick';
  /**
   * Where it was read from: the platform's own subscriber emotes, or the channel's own
   * 7TV set, BTTV channel emotes or FFZ room.
   */
  provider: 'Twitch' | 'Kick' | '7TV' | 'BTTV' | 'FFZ';
  /** Only subscribers may use it in chat. Always false for third-party sets. */
  subOnly?: boolean;
}

type SevenTvSet = { emotes?: { id: string; name: string }[] };
type BttvUser = { channelEmotes?: { id: string; code: string }[] };
type FfzRoom = {
  sets?: Record<string, { emoticons?: { name: string; urls: Record<string, string> }[] }>;
};
type TemotesEmote = { code?: unknown; urls?: { size?: unknown; url?: unknown }[] };
type KickEmotesPayload = {
  emotes?: { id?: unknown; name?: unknown; subscribers_only?: unknown }[];
}[];

/** Fetches JSON, or undefined when the channel has none (or the request failed). */
type Get = <T>(url: string) => Promise<T | undefined>;

const toEmote = (
  name: string,
  url: string,
  platform: ChannelEmote['platform'],
  provider: ChannelEmote['provider'],
  subOnly = false,
): ChannelEmote => ({ name, url, thumb: thumbUrl(url), platform, provider, subOnly });

/**
 * The 1x variant of a picked emote URL for the picker grid, so browsing hundreds of emotes
 * doesn't pull full-size images. Unknown CDNs fall back to the picked URL itself.
 */
export function thumbUrl(url: string): string {
  return url
    .replace(/\/2x\.webp$/, '/1x.webp')
    .replace(/\/emote\/(\d+)\/2$/, '/emote/$1/1')
    .replace(/\/default\/(light|dark)\/2\.0$/, '/default/$1/1.0');
}

// The streamer's own channel emotes only: the platform's subscriber emotes first, then the
// channel's own 7TV set, BTTV channel emotes (never the shared pool) and the FFZ room sets.
// Global sets stay out, like the icon picker promises.
async function loadTwitchChannel(get: Get, login: string) {
  const [native, users] = await Promise.all([
    get<TemotesEmote[]>(
      `https://emotes.adamcy.pl/v1/channel/${encodeURIComponent(login)}/emotes/twitch`,
    ),
    get<{ id: string }[]>(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(login)}`),
  ]);
  const map = new Map<string, ChannelEmote>();
  for (const emote of native ?? []) {
    const name = typeof emote.code === 'string' ? emote.code : '';
    const url = emote.urls?.find((entry) => entry.size === '2x')?.url ?? emote.urls?.[0]?.url;
    if (name && typeof url === 'string' && url)
      map.set(name, toEmote(name, url, 'twitch', 'Twitch'));
  }
  const id = users?.[0]?.id;
  if (!id) return [...map.values()];
  const [sevenTvUser, bttvUser, ffzRoom] = await Promise.all([
    get<{ emote_set?: SevenTvSet }>(`https://7tv.io/v3/users/twitch/${id}`),
    get<BttvUser>(`https://api.betterttv.net/3/cached/users/twitch/${id}`),
    get<FfzRoom>(`https://api.frankerfacez.com/v1/room/id/${id}`),
  ]);
  // Later lists win a name clash, but never over the platform's own subscriber emotes.
  for (const [list, provider] of [
    [parse7tvSet(sevenTvUser?.emote_set), '7TV'],
    [parseBttv(bttvUser?.channelEmotes), 'BTTV'],
    [parseFfz(Object.values(ffzRoom?.sets ?? {})), 'FFZ'],
  ] as const) {
    for (const [name, url] of list)
      if (!map.has(name)) map.set(name, toEmote(name, url, 'twitch', provider));
  }
  return [...map.values()];
}

// BTTV and FFZ only exist on Twitch, so Kick channel emotes come from Kick itself plus the
// 7TV set linked to the Kick account. The emotes call needs no login; the v1 channels call
// also resolves the slug to a user id for the 7TV lookup.
async function loadKickChannel(get: Get, slug: string) {
  const [native, info] = await Promise.all([
    get<KickEmotesPayload>(`https://kick.com/emotes/${encodeURIComponent(slug)}`),
    getKickChannelInfo(slug).catch(() => null),
  ]);
  const map = new Map<string, ChannelEmote>();
  const own = Array.isArray(native) ? (native[0]?.emotes ?? []) : [];
  for (const emote of own) {
    const name = typeof emote.name === 'string' ? emote.name : '';
    const id = typeof emote.id === 'number' ? emote.id : null;
    if (name && id !== null)
      map.set(
        name,
        toEmote(
          name,
          `https://files.kick.com/emotes/${id}/fullsize`,
          'kick',
          'Kick',
          emote.subscribers_only === true,
        ),
      );
  }
  const userId = info?.userId;
  if (userId) {
    const user = await get<{ emote_set?: SevenTvSet }>(`https://7tv.io/v3/users/kick/${userId}`);
    for (const [name, url] of parse7tvSet(user?.emote_set))
      if (!map.has(name)) map.set(name, toEmote(name, url, 'kick', '7TV'));
  }
  return [...map.values()];
}

// Many per platform; the picker scrolls, and OBS only ever loads the one that gets picked.
const MAX_PER_PLATFORM = 300;

/**
 * The streamer's own channel emotes for the icon picker: each platform's subscriber emotes
 * first, then the channel's own 7TV set (both platforms), BTTV channel emotes and FFZ room
 * (Twitch). Empty when no channel is filled in or nothing loaded. Partial results still
 * show, so one failing provider doesn't hide the rest.
 */
export async function loadChannelEmotes(twitch: string, kick: string): Promise<ChannelEmote[]> {
  const get: Get = <T>(url: string) => fetchJson<T>(url).catch(() => undefined);
  const [twitchEmotes, kickEmotes] = await Promise.all([
    twitch.trim() ? loadTwitchChannel(get, twitch.trim()).catch(() => []) : [],
    kick.trim() ? loadKickChannel(get, kick.trim()).catch(() => []) : [],
  ]);
  const take = (list: ChannelEmote[]) => list.slice(0, MAX_PER_PLATFORM);
  return [...take(twitchEmotes), ...take(kickEmotes)];
}
