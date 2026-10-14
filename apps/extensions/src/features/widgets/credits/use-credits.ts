import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { SubathonEvent } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import { useViewerChat, type ViewerChatEvent } from '../viewer-chat/viewer-chat';
import {
  type CreditsData,
  creditChat,
  creditSupport,
  emptyCredits,
  loadCredits,
  parseCreditsCommand,
  storageKey,
} from './credits-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:credits-preview';
export type PreviewMessage = { type: 'roll'; preview: string };

/** Pause between two rolls when they loop. */
export const LOOP_PAUSE_MS = 3000;
/** Saves at most this often: a busy chat adds chatters many times a second. */
const SAVE_EVERY_MS = 2000;

const SAMPLE_NAMES = [
  'NightOwl',
  'pixelpanda',
  'ChatGremlin',
  'lunaa',
  'GG_Tobi',
  'mochi',
  'Rook',
  'Saitama',
  'Frieren',
  'moonlit',
  'kappa_kid',
  'pixelfox',
  'Denji',
  'Chopper',
  'Usopp',
  'Killua',
];

/** Credits for the preview: a few of everything, on both platforms. */
export function sampleCredits(): CreditsData {
  const people = (from: number, count: number, amount: (index: number) => number) =>
    SAMPLE_NAMES.slice(from, from + count).map((name, index) => ({
      platform: index % 2 ? ('kick' as const) : ('twitch' as const),
      name,
      amount: amount(index),
    }));
  return {
    subs: people(0, 5, (index) => [1, 6, 14, 2, 30][index]),
    gifts: people(5, 2, (index) => [10, 5][index]),
    cheers: people(7, 3, (index) => [2500, 1000, 300][index]),
    raids: people(10, 1, () => 87),
    mods: people(11, 2, () => 0),
    chatters: people(0, 16, () => 0),
    updatedAt: 0,
  };
}

interface ObsActiveEvent extends Event {
  detail?: { active?: boolean };
}

interface UseCreditsOptions {
  twitch?: string;
  kick?: string;
  loop: boolean;
  simulate?: boolean;
  previewId?: string;
}

export function useCredits({ twitch, kick, loop, simulate = false, previewId }: UseCreditsOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const [data, setData] = useState<CreditsData>(() =>
    simulate ? sampleCredits() : loadCredits(key, Date.now()),
  );
  // A new roll number restarts the roll from the bottom of the screen; null hides it.
  const [roll, setRoll] = useState<number | null>(null);
  const loopRef = useRef(loop);
  loopRef.current = loop;
  const loopTimer = useRef<number | undefined>(undefined);

  const start = useCallback(() => {
    window.clearTimeout(loopTimer.current);
    setRoll((current) => (current ?? 0) + 1);
  }, []);
  const stop = useCallback(() => {
    window.clearTimeout(loopTimer.current);
    setRoll(null);
  }, []);

  /** The roll reached its end: again after a pause when looping, else it's done. */
  const ended = useCallback(() => {
    if (!loopRef.current) {
      setRoll(null);
      return;
    }
    loopTimer.current = window.setTimeout(start, LOOP_PAUSE_MS);
  }, [start]);

  const handleSupport = useCallback(
    (event: SubathonEvent) => {
      if (event.kind === 'mod') {
        const command = parseCreditsCommand(event.text);
        if (command === 'roll') start();
        else if (command === 'stop') stop();
        else if (command === 'reset') setData(emptyCredits(Date.now()));
        return;
      }
      setData((current) => creditSupport(current, event, Date.now()));
    },
    [start, stop],
  );

  const handleChat = useCallback((event: ViewerChatEvent) => {
    setData((current) => creditChat(current, event, Date.now()));
  }, []);

  useSubEvents(twitch, kick, !simulate, handleSupport);
  useViewerChat(twitch, kick, !simulate, handleChat);

  // Saved now and then, and once more when the source goes away.
  const dataRef = useRef(data);
  dataRef.current = data;
  useEffect(() => {
    if (!key) return;
    const save = () => {
      try {
        window.localStorage.setItem(key, JSON.stringify(dataRef.current));
      } catch {
        // Storage blocked: the roll still works, it just won't survive a reload.
      }
    };
    const timer = window.setInterval(save, SAVE_EVERY_MS);
    return () => {
      window.clearInterval(timer);
      save();
    };
  }, [key]);

  // OBS tells a browser source when its scene goes live and when it leaves; anywhere else (the
  // setup page's preview, a browser tab) the roll starts at once.
  useEffect(() => {
    const obs = (window as unknown as { obsstudio?: unknown }).obsstudio;
    if (!obs) {
      start();
      return;
    }
    const onActive = (event: Event) => {
      if ((event as ObsActiveEvent).detail?.active) start();
      else stop();
    };
    window.addEventListener('obsSourceActiveChanged', onActive);
    return () => window.removeEventListener('obsSourceActiveChanged', onActive);
  }, [start, stop]);

  useEffect(() => () => window.clearTimeout(loopTimer.current), []);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type === 'roll') start();
  });

  return { data, roll, ended };
}
