// @ts-expect-error
import { env } from 'cloudflare:workers';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { LASTFM_USER_MAX, type LastfmAnswer, lastfmRecentTracksUrl } from './lastfm';

// Last.fm's API key stays on the server: a VITE_ variable would be built into the page.
const LOOKUP_TIMEOUT_MS = 8_000;

const lastfmKey = (): string => {
  const key: unknown = env?.LASTFM_API_KEY;
  return typeof key === 'string' ? key.trim() : '';
};

/**
 * Whether the site can read Last.fm at all. Without a key the setup page used to offer ListenBrainz;
 * that's off for now, so nothing asks.
 */
export const getLastfmAvailable = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => lastfmKey() !== '',
);

/**
 * `user`'s latest track from Last.fm, asked with the site's key: Last.fm's status, and its body
 * on a 2xx. No key reads as 404, and a Last.fm that can't be reached as 502, worth retrying.
 */
export const getLastfmRecentTracks = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ user: z.string().trim().min(1).max(LASTFM_USER_MAX) }))
  .handler(async ({ data }): Promise<LastfmAnswer> => {
    const key = lastfmKey();
    if (!key) return { status: 404 };
    try {
      const response = await fetch(lastfmRecentTracksUrl(data.user, key), {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      });
      if (!response.ok) return { status: response.status };
      return { status: response.status, text: await response.text() };
    } catch {
      return { status: 502 };
    }
  });
