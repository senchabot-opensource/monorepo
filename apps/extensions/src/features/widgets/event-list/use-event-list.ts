import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { SubathonEvent, SubathonPlatform } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import {
  addEvent,
  type EventEntry,
  isClearCommand,
  loadEntries,
  storageKey,
} from './event-list-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:event-list-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it plays it. */
export type PreviewMessage = { type: 'event'; preview: string; event: SubathonEvent };

// After a test button, simulated events hold off so the click's event stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

export function simulatedEvent(only?: SubathonPlatform, name = pick(SIM_NAMES)): SubathonEvent {
  const platform = only ?? pick<SubathonPlatform>(['twitch', 'kick']);
  const roll = Math.random();
  if (roll < 0.4) return { kind: 'sub', platform, name, tier: 1, months: pick([1, 1, 3, 7, 14]) };
  if (roll < 0.6) return { kind: 'gift', platform, name, tier: 1, count: pick([1, 5, 10]) };
  if (roll < 0.85) return { kind: 'bits', platform, name, amount: pick([100, 500, 1000]) };
  return { kind: 'raid', platform, name, viewers: pick([12, 48, 230]) };
}

/** The preview's names, everyone in turn from a random start, so no one shows twice in a row. */
function simNames() {
  let turn = Math.floor(Math.random() * SIM_NAMES.length);
  return () => SIM_NAMES[turn++ % SIM_NAMES.length];
}

/** What a preview opens with: a few events from the last minute, so it never starts empty. */
function sampleEntries(nextName: () => string, only?: SubathonPlatform): EventEntry[] {
  const now = Date.now();
  let list: EventEntry[] = [];
  for (let id = 1; id <= 4; id++) {
    list = addEvent(list, simulatedEvent(only, nextName()), id, now - (5 - id) * 12_000) ?? list;
  }
  return list;
}

interface UseEventListOptions {
  twitch?: string;
  kick?: string;
  /** Seconds an event stays; 0 keeps it. While above 0 the list rechecks every second. */
  fade: number;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function useEventList({
  twitch,
  kick,
  fade,
  simulate = false,
  simPlatform,
  previewId,
}: UseEventListOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  // One turn order for the whole preview: the opening events and every one after.
  const [nextSimName] = useState(simNames);
  const [entries, setEntries] = useState<EventEntry[]>(() =>
    simulate ? sampleEntries(nextSimName, simPlatform) : loadEntries(key),
  );
  const nextId = useRef(entries.reduce((max, entry) => Math.max(max, entry.id), 0));
  const lastTestAt = useRef(0);
  const [now, setNow] = useState(() => Date.now());

  const handleEvent = useCallback((event: SubathonEvent) => {
    if (event.kind === 'mod') {
      if (isClearCommand(event.text)) setEntries([]);
      return;
    }
    const at = Date.now();
    setNow(at);
    setEntries((list) => addEvent(list, event, ++nextId.current, at) ?? list);
  }, []);

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(entries));
    } catch {
      // Storage blocked: the list still works, it just won't survive a reload.
    }
  }, [key, entries]);

  // Faded rows go once their time is up.
  useEffect(() => {
    if (fade <= 0) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [fade]);

  useSubEvents(twitch, kick, !simulate, handleEvent);

  // Preview: an event every few seconds, unless a test button just sent one.
  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    const step = () => {
      if (Date.now() - lastTestAt.current >= SIM_QUIET_AFTER_TEST_MS) {
        handleEvent(simulatedEvent(simPlatform, nextSimName()));
      }
      timer = window.setTimeout(step, 2500 + Math.random() * 1500);
    };
    timer = window.setTimeout(step, 600);
    return () => window.clearTimeout(timer);
  }, [simulate, simPlatform, handleEvent, nextSimName]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'event') return;
    lastTestAt.current = Date.now();
    handleEvent(message.event);
  });

  return { entries, now };
}
