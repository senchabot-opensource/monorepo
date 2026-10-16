import { RetryableFetchError } from '#/lib/fetch-json';

/** Last.fm's terms ask apps to credit it where its data shows. */
export const LASTFM_CREDIT = 'Last.fm';

/** Past this, a name is no Last.fm username (Last.fm's own limit is 15). */
export const LASTFM_USER_MAX = 64;

/**
 * Last.fm's recent-tracks request for `user`. Only the site's server builds it: the API key is
 * a server secret (LASTFM_API_KEY), since a key in the page would reach every visitor.
 */
export function lastfmRecentTracksUrl(user: string, key: string): string {
  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user,
    api_key: key,
    format: 'json',
    limit: '1',
  });
  return `https://ws.audioscrobbler.com/2.0/?${params.toString()}`;
}

/**
 * Last.fm's answer as the site's server passes it on: the HTTP status, and on a 2xx the body as
 * text, which a server function can carry whatever Last.fm sends.
 */
export interface LastfmAnswer {
  status: number;
  text?: string;
}

/**
 * The server's answer read the way requestJson reads a response: the JSON, undefined for a 4xx
 * (no such user, or a site without a key), and RetryableFetchError for a busy or broken service.
 */
export function lastfmBody({ status, text }: LastfmAnswer): unknown {
  if (status === 429 || status >= 500) throw new RetryableFetchError(`Last.fm: ${status}`);
  if (status < 200 || status >= 300) return undefined;
  try {
    return JSON.parse(text ?? '');
  } catch {
    throw new RetryableFetchError('Last.fm: no JSON');
  }
}
