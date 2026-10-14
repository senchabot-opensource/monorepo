/**
 * Last.fm's API key, built in from VITE_LASTFM_API_KEY. Last.fm gives every app one key and it
 * ships in the page like the rest of the code; a build without one can only read ListenBrainz.
 * Read on each call, so tests can stub it.
 */
export const lastfmApiKey = (): string => String(import.meta.env.VITE_LASTFM_API_KEY ?? '').trim();

/** Whether this build can read Last.fm at all. */
export const hasLastfm = () => lastfmApiKey() !== '';

/** Last.fm's terms ask apps to credit it where its data shows. */
export const LASTFM_CREDIT = 'Last.fm';
