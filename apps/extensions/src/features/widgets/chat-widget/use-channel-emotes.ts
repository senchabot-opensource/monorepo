import { useState } from 'react';
import { useRetryingEffect } from '#/hooks/use-retrying-effect';
import { fetchJson } from '#/lib/fetch-json';

// Emote name -> image URL.
export type EmoteMap = Map<string, string>;
type EmoteList = [name: string, url: string][];

export interface EmoteProviders {
  sevenTv: boolean;
  bttv: boolean;
  ffz: boolean;
}

type SevenTvSet = { emotes?: { id: string; name: string }[] };
type BttvEmote = { id: string; code: string };
type FfzSet = { emoticons?: { name: string; urls: Record<string, string> }[] };

export const parse7tvSet = (set: SevenTvSet | undefined): EmoteList =>
  (set?.emotes ?? []).map((e) => [e.name, `https://cdn.7tv.app/emote/${e.id}/2x.webp`]);

export const parseBttv = (emotes: BttvEmote[] | undefined): EmoteList =>
  (emotes ?? []).map((e) => [e.code, `https://cdn.betterttv.net/emote/${e.id}/2x.webp`]);

export const parseFfz = (sets: FfzSet[]): EmoteList =>
  sets.flatMap((set) =>
    (set.emoticons ?? []).map((e): [string, string] => [e.name, e.urls['2'] ?? e.urls['1']]),
  );

// Later lists win on a name clash: channel emotes over global ones, 7TV over BTTV over FFZ.
export const mergeEmotes = (...lists: EmoteList[]): EmoteMap => new Map(lists.flat());

/** Fetches JSON, or undefined when the request failed (and should be tried again later). */
type Get = <T>(url: string) => Promise<T | undefined>;

async function loadTwitchEmotes(fetchJson: Get, login: string, providers: EmoteProviders) {
  const users = await fetchJson<{ id: string }[]>(
    `https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(login)}`,
  );
  const id = users?.[0]?.id;
  const [sevenTvGlobal, sevenTvUser, bttvGlobal, bttvUser, ffzGlobal, ffzRoom] = await Promise.all([
    providers.sevenTv ? fetchJson<SevenTvSet>('https://7tv.io/v3/emote-sets/global') : undefined,
    providers.sevenTv && id
      ? fetchJson<{ emote_set?: SevenTvSet }>(`https://7tv.io/v3/users/twitch/${id}`)
      : undefined,
    providers.bttv
      ? fetchJson<BttvEmote[]>('https://api.betterttv.net/3/cached/emotes/global')
      : undefined,
    providers.bttv && id
      ? fetchJson<{ channelEmotes?: BttvEmote[]; sharedEmotes?: BttvEmote[] }>(
          `https://api.betterttv.net/3/cached/users/twitch/${id}`,
        )
      : undefined,
    providers.ffz
      ? fetchJson<{ default_sets: number[]; sets: Record<string, FfzSet> }>(
          'https://api.frankerfacez.com/v1/set/global',
        )
      : undefined,
    providers.ffz && id
      ? fetchJson<{ sets?: Record<string, FfzSet> }>(
          `https://api.frankerfacez.com/v1/room/id/${id}`,
        )
      : undefined,
  ]);

  return {
    sevenTvChannel: parse7tvSet(sevenTvUser?.emote_set),
    map: mergeEmotes(
      parseFfz((ffzGlobal?.default_sets ?? []).map((set) => ffzGlobal?.sets?.[set] ?? {})),
      parseBttv(bttvGlobal),
      parse7tvSet(sevenTvGlobal),
      parseFfz(Object.values(ffzRoom?.sets ?? {})),
      parseBttv([...(bttvUser?.channelEmotes ?? []), ...(bttvUser?.sharedEmotes ?? [])]),
      parse7tvSet(sevenTvUser?.emote_set),
    ),
  };
}

// BTTV and FFZ only exist on Twitch, so Kick messages get 7TV alone: the set linked to the Kick
// account, or the Twitch one when the streamer only linked Twitch on 7TV.
async function loadKickEmotes(fetchJson: Get, kickUserId: string | null, twitchSevenTv: EmoteList) {
  const [global, user] = await Promise.all([
    fetchJson<SevenTvSet>('https://7tv.io/v3/emote-sets/global'),
    kickUserId
      ? fetchJson<{ emote_set?: SevenTvSet }>(`https://7tv.io/v3/users/kick/${kickUserId}`)
      : undefined,
  ]);
  const channel = user?.emote_set ? parse7tvSet(user.emote_set) : twitchSevenTv;
  return mergeEmotes(parse7tvSet(global), channel);
}

const EMPTY: Record<'twitch' | 'kick', EmoteMap> = { twitch: new Map(), kick: new Map() };

export function useChannelEmotes(
  twitchChannel: string | null | undefined,
  kickUserId: string | null | undefined,
  providers: EmoteProviders,
): Record<'twitch' | 'kick', EmoteMap> {
  const [emotes, setEmotes] = useState(EMPTY);
  const { sevenTv, bttv, ffz } = providers;

  // What loaded is shown right away; the requests that failed are tried again, since OBS can load
  // the source before the network is up.
  useRetryingEffect(
    async (isCurrent) => {
      let failed = false;
      const get: Get = <T>(url: string) =>
        fetchJson<T>(url).catch(() => {
          failed = true;
          return undefined;
        });
      const twitch = twitchChannel
        ? await loadTwitchEmotes(get, twitchChannel, { sevenTv, bttv, ffz })
        : { map: new Map<string, string>(), sevenTvChannel: [] };
      const kick = sevenTv
        ? await loadKickEmotes(get, kickUserId ?? null, twitch.sevenTvChannel)
        : new Map<string, string>();
      if (isCurrent()) setEmotes({ twitch: twitch.map, kick });
      return failed;
    },
    [twitchChannel, kickUserId, sevenTv, bttv, ffz],
  );

  return emotes;
}
