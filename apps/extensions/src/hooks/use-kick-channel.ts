import { useEffect, useState } from 'react';
import { retryDelay } from '#/lib/fetch-json';
import { getKickChannelInfo, type KickChannelInfo } from '#/lib/kick';

export type KickChannel = KickChannelInfo & { chatroomId: string };

export interface KickChannelLookup {
  /** Set once kick.com has answered with the channel. */
  channel: KickChannel | null;
  /** kick.com said the channel doesn't exist. Lookups go on, slower, like after any failure. */
  notFound: boolean;
}

const PENDING: KickChannelLookup = { channel: null, notFound: false };

/**
 * The Kick channel's ids and badges, looked up again until kick.com answers: its API answers
 * 403/5xx at times, and OBS can load a source before the network is up.
 */
export function useKickChannel(slug: string | undefined, enabled = true): KickChannelLookup {
  const [lookup, setLookup] = useState<KickChannelLookup>(PENDING);
  const name = slug?.trim() ?? '';

  useEffect(() => {
    setLookup(PENDING);
    if (!enabled || !name) return;
    let cancelled = false;
    let timer: number | undefined;
    const run = async (attempt: number) => {
      const info = await getKickChannelInfo(name);
      if (cancelled) return;
      if (info.chatroomId) {
        setLookup({ channel: { ...info, chatroomId: info.chatroomId }, notFound: false });
        return;
      }
      setLookup({ channel: null, notFound: info.notFound });
      timer = window.setTimeout(() => run(attempt + 1), retryDelay(attempt));
    };
    run(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [name, enabled]);

  return lookup;
}
