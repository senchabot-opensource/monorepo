import { useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import { requestJson, retryDelay } from '#/lib/fetch-json';
import type { NowPlayingSource } from '#/lib/now-playing-url';
import { DEMO_TRACKS } from './demo-tracks';
import { nowPlayingRequestUrl, parseNowPlaying, type Track } from './now-playing-api';

/** The setup page's test buttons reach its preview on this channel. */
export const PREVIEW_CHANNEL = 'senchabot:now-playing-preview';

/**
 * `next`: the next sample song. `stop`: the music stops. `live`: back to what the preview's URL
 * shows, sample songs or the profile's real one.
 */
export type PreviewMessage = { type: 'next' | 'stop' | 'live'; preview: string };

/** How often the overlay asks what's playing: well inside ListenBrainz's 30 requests per 10 s. */
export const POLL_MS = 12_000;
/**
 * How often while its scene is off. OBS tells the page when the scene comes back, and it asks at
 * once then; it still asks now and then, in case a streaming app never says it's shown.
 */
export const HIDDEN_POLL_MS = 60_000;
/** How long the demo plays each sample song. */
export const DEMO_MS = 8_000;

/** Same song, same cover: a new answer about it shouldn't replay its entrance. */
export const trackKey = (track: Track | null | undefined) =>
  track ? [track.title, track.artist, track.album, track.cover ?? ''].join('\n') : String(track);

/**
 * What `user` plays now on `source`, asked every POLL_MS while the page is shown: the song, null
 * for nothing, undefined before the first answer. A failed request keeps the last answer and
 * tries again later and later; a 4xx (no such user) counts as nothing playing.
 */
function useLiveTrack(
  source: NowPlayingSource,
  user: string,
  enabled: boolean,
): Track | null | undefined {
  const [track, setTrack] = useState<Track | null | undefined>(undefined);

  useEffect(() => {
    setTrack(undefined);
    const url = enabled ? nowPlayingRequestUrl(source, user) : null;
    if (!url) return;
    let stopped = false;
    let asking = false;
    let attempt = 0;
    let timer: number | undefined;
    const wait = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(ask, ms);
    };
    const pace = () => (document.hidden ? HIDDEN_POLL_MS : POLL_MS);
    const ask = async () => {
      if (asking) return;
      asking = true;
      try {
        const answer = await requestJson<unknown>(url);
        if (stopped) return;
        attempt = 0;
        const next = parseNowPlaying(source, answer);
        setTrack((current) => (trackKey(current) === trackKey(next) ? current : next));
        wait(pace());
      } catch {
        // No network yet, rate limited or a bad minute at the service: back off.
        if (stopped) return;
        wait(pace() + retryDelay(attempt));
        attempt += 1;
      } finally {
        asking = false;
      }
    };
    const onVisibility = () => {
      if (!document.hidden) wait(0);
    };
    document.addEventListener('visibilitychange', onVisibility);
    ask();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [source, user, enabled]);

  return track;
}

/**
 * The song on screen. A new one shows at once. Once nothing plays, the last one stays for
 * `hideSeconds` and then goes; with 0 it stays, and `playing` turns false so it can dim.
 */
function usePresence(current: Track | null | undefined, hideSeconds: number) {
  const [shown, setShown] = useState<Track | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (current) {
      setShown(current);
      setGone(false);
      return;
    }
    // undefined: no answer yet, so nothing to act on.
    if (current === null && hideSeconds > 0) {
      const timer = window.setTimeout(() => setGone(true), hideSeconds * 1000);
      return () => window.clearTimeout(timer);
    }
  }, [current, hideSeconds]);

  return { track: shown, visible: shown !== null && !gone, playing: Boolean(current) };
}

interface UseNowPlayingOptions {
  source: NowPlayingSource;
  user: string;
  hide: number;
  /** Sample songs instead of a real profile: the landing page and the setup page's preview. */
  demo: boolean;
  /** Pairs a setup page's preview with its test buttons. */
  previewId?: string;
}

/**
 * The song to show and whether it is up: sample songs in demos and from the test buttons, else
 * the profile's, which is never asked for while samples play.
 */
export function useNowPlaying({ source, user, hide, demo, previewId }: UseNowPlayingOptions) {
  // `url`: what the URL asks for. `sample`: a sample song from a test button. `stopped`: none.
  const [mode, setMode] = useState<'url' | 'sample' | 'stopped'>('url');
  const [sample, setSample] = useState(0);
  const sampleRef = useRef(sample);
  sampleRef.current = sample;

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, true, (message) => {
    if (message.type === 'next') {
      setSample((sampleRef.current + 1) % DEMO_TRACKS.length);
      setMode('sample');
    } else if (message.type === 'stop') setMode('stopped');
    else if (message.type === 'live') setMode('url');
  });

  const cycling = mode === 'url' && demo;
  useEffect(() => {
    if (!cycling) return;
    const timer = window.setInterval(
      () => setSample((index) => (index + 1) % DEMO_TRACKS.length),
      DEMO_MS,
    );
    return () => window.clearInterval(timer);
  }, [cycling]);

  const live = useLiveTrack(source, user, mode === 'url' && !demo);
  let current: Track | null | undefined;
  if (mode === 'stopped') current = null;
  else if (mode === 'sample' || demo) current = DEMO_TRACKS[sample];
  else current = live;
  return usePresence(current, hide);
}
