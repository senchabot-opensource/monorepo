// import { RetryableFetchError, requestJson } from '#/lib/fetch-json';
import { RetryableFetchError } from '#/lib/fetch-json';
import type { NowPlayingSource } from '#/lib/now-playing-url';
import { LASTFM_USER_MAX, type LastfmAnswer, lastfmBody } from './lastfm';
import { getLastfmRecentTracks } from './lastfm-server';

/** A song to show. */
export interface Track {
  title: string;
  /** Empty when the service doesn't name one. */
  artist: string;
  album: string;
  /** The cover image, or null for a tile with a music note. */
  cover: string | null;
  /** A sample song's cover: two hues for a drawn tile instead of an image. */
  tile?: readonly [number, number];
}

/** Display names, which are also the services' own spelling. */
export const SOURCE_NAMES: Record<NowPlayingSource, string> = {
  // listenbrainz: 'ListenBrainz',
  lastfm: 'Last.fm',
};

// Longer than any real title; keeps a broken answer from filling the screen.
const TEXT_MAX = 200;
// ListenBrainz is off for now (it didn't work); its code stays here, commented out.
// const MBID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// The grey star Last.fm sends for a song it has no cover for.
const LASTFM_PLACEHOLDER = '2a96cbd8b46e442fc41c2b86b821562f';
const LASTFM_SIZES = ['small', 'medium', 'large', 'extralarge', 'mega'];

type Json = Record<string, unknown>;

const record = (value: unknown): Json | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Json) : null;

const text = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, TEXT_MAX) : '';

/** The Cover Art Archive's 250px front cover of a MusicBrainz release; it may not have one. */
export const coverArtUrl = (mbid: string) =>
  `https://coverartarchive.org/release/${mbid.toLowerCase()}/front-250`;

// /**
//  * The song in ListenBrainz's playing-now answer, or null. The cover comes from the release the
//  * listen is matched to, when it is: the mapping's release with cover art first, then the one the
//  * player sent.
//  */
// export function parseListenBrainz(json: unknown): Track | null {
//   const listens = record(record(json)?.payload)?.listens;
//   if (!Array.isArray(listens)) return null;
//   const meta = record(record(listens[0])?.track_metadata);
//   const title = text(meta?.track_name);
//   if (!meta || !title) return null;
//   const mapping = record(meta.mbid_mapping);
//   const info = record(meta.additional_info);
//   const mbid = [mapping?.caa_release_mbid, info?.release_mbid, mapping?.release_mbid].find(
//     (value): value is string => typeof value === 'string' && MBID.test(value),
//   );
//   return {
//     title,
//     artist: text(meta.artist_name),
//     album: text(meta.release_name),
//     cover: mbid ? coverArtUrl(mbid) : null,
//   };
// }

/** The biggest real cover in Last.fm's image list, or null. */
function lastfmCover(images: unknown): string | null {
  if (!Array.isArray(images)) return null;
  let best: string | null = null;
  let bestRank = -1;
  for (const [index, image] of images.entries()) {
    const url = text(record(image)?.['#text']);
    if (!url.startsWith('https://') || url.includes(LASTFM_PLACEHOLDER)) continue;
    const size = LASTFM_SIZES.indexOf(text(record(image)?.size));
    const rank = size === -1 ? index : size;
    if (rank >= bestRank) {
      best = url;
      bestRank = rank;
    }
  }
  return best;
}

/** Text from a Last.fm field that is a string, `{ '#text' }`, or `{ name }` in extended answers. */
function lastfmName(value: unknown): string {
  if (typeof value === 'string') return text(value);
  const field = record(value);
  return text(field?.['#text']) || text(field?.name);
}

/**
 * The song in Last.fm's recent tracks, or null unless the first one is playing now. Last.fm
 * sends a lone track as an object instead of a list of one.
 */
export function parseLastfm(json: unknown): Track | null {
  const tracks = record(record(json)?.recenttracks)?.track;
  const first = record(Array.isArray(tracks) ? tracks[0] : tracks);
  const playing = record(first?.['@attr'])?.nowplaying;
  if (!first || (playing !== 'true' && playing !== true)) return null;
  const title = text(first.name);
  if (!title) return null;
  return {
    title,
    artist: lastfmName(first.artist),
    album: lastfmName(first.album),
    cover: lastfmCover(first.image),
  };
}

/** The song `source` says is playing now, from its answer; null for nothing or garbage. */
export const parseNowPlaying = (_source: NowPlayingSource, json: unknown): Track | null =>
  // source === 'lastfm' ? parseLastfm(json) : parseListenBrainz(json);
  parseLastfm(json);

// /** ListenBrainz's playing-now request for `user`; null without a user. It needs no key. */
// export function listenbrainzRequestUrl(user: string): string | null {
//   const name = user.trim();
//   return name
//     ? `https://api.listenbrainz.org/1/user/${encodeURIComponent(name)}/playing-now`
//     : null;
// }

/**
 * The service's answer about `user`, read like requestJson: its JSON, undefined for a 4xx or no
 * user, RetryableFetchError when it's worth asking again. Last.fm is asked through the site's
 * server, which keeps the API key.
 */
export async function requestNowPlaying(_source: NowPlayingSource, user: string): Promise<unknown> {
  const name = user.trim();
  // if (source === 'listenbrainz') {
  //   const url = listenbrainzRequestUrl(name);
  //   return url ? requestJson<unknown>(url) : undefined;
  // }
  if (!name || name.length > LASTFM_USER_MAX) return undefined;
  let answer: LastfmAnswer;
  try {
    answer = await getLastfmRecentTracks({ data: { user: name } });
  } catch (error) {
    // The site's server can't be reached, or failed: like the network being down.
    throw new RetryableFetchError(`Last.fm: ${error}`);
  }
  return lastfmBody(answer);
}

/**
 * One look at what `user` plays now, for the setup page's Check: the song, null for nothing, or
 * `missing` when the service has no such public profile. Rejects when the service can't be
 * reached, like requestJson.
 */
export async function checkNowPlaying(
  source: NowPlayingSource,
  user: string,
): Promise<Track | null | 'missing'> {
  if (!user.trim()) return 'missing';
  const json = await requestNowPlaying(source, user);
  // A 4xx, or a Last.fm error such as "User not found" or a private profile.
  if (json === undefined || record(json)?.error !== undefined) return 'missing';
  return parseNowPlaying(source, json);
}
