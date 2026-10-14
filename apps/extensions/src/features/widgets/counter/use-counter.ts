import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { CounterSpec } from '#/lib/counter-url';
import { applyGoalCommand, type GoalState } from '../goal/goal-count';
import type { SubathonEvent } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import { loadCount, parseCounterCommand, storageKey } from './counter-state';

/** A rising "+3" or "−1" over one counter. */
export interface CounterPop {
  id: number;
  /** Which counter, by its place in the URL. */
  index: number;
  /** Signed: negative when the count went down. */
  amount: number;
}

/** A change to show on a counter's value: `key` replays the animation, `up` picks which. */
export interface CounterBump {
  key: number;
  up: boolean;
}

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:counter-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it plays it. */
export type PreviewMessage = { type: 'command'; preview: string; text: string };

export const POP_MS = 2200;
/** Pops per counter on screen at once; a fast run of commands drops the oldest. */
const MAX_POPS = 3;
// After a test button, simulated changes hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;

interface UseCounterOptions {
  twitch?: string;
  kick?: string;
  counters: readonly CounterSpec[];
  /** Preview mode: simulated changes, no chat and no saved counts. */
  simulate?: boolean;
  /** Pairs the preview with its setup page's test buttons. */
  previewId?: string;
}

export function useCounter({
  twitch,
  kick,
  counters,
  simulate = false,
  previewId,
}: UseCounterOptions) {
  const keys = counters.map((counter) =>
    simulate ? null : storageKey(twitch, kick, counter.command),
  );
  const load = () => counters.map((counter, index) => loadCount(keys[index], counter.start));
  const [states, setStates] = useState<GoalState[]>(load);
  // New counters, commands or starting counts load again, as a reload with the new URL would.
  const signature = JSON.stringify([keys, counters.map((counter) => counter.start)]);
  const [loaded, setLoaded] = useState(signature);
  if (loaded !== signature) {
    setLoaded(signature);
    setStates(load());
  }

  const statesRef = useRef(states);
  statesRef.current = states;
  const countersRef = useRef(counters);
  countersRef.current = counters;
  const keysRef = useRef(keys);
  keysRef.current = keys;
  const [pops, setPops] = useState<CounterPop[]>([]);
  const [bumps, setBumps] = useState<(CounterBump | null)[]>([]);
  const popId = useRef(0);
  const lastTestAt = useRef(0);

  // Stable, so the chat readers keep their connections; the counters come in through refs.
  const handleEvent = useCallback((event: SubathonEvent) => {
    if (event.kind !== 'mod') return;
    const list = countersRef.current;
    const found = parseCounterCommand(
      event.text,
      list.map((counter) => counter.command),
    );
    if (!found) return;
    const { index, command } = found;
    const previous = statesRef.current[index];
    if (!previous) return;
    const next = applyGoalCommand(previous, command, list[index].start);
    const states = statesRef.current.map((state, at) => (at === index ? next : state));
    statesRef.current = states;
    setStates(states);
    const change = next.count - previous.count;
    if (change === 0) return;
    setBumps((current) => {
      const copy = [...current];
      copy[index] = { key: Date.now(), up: change > 0 };
      return copy;
    });
    // Set and reset jump to a number: only adding and removing float a "+3" or "−1".
    if (command.action !== 'add' && command.action !== 'remove') return;
    const id = ++popId.current;
    setPops((current) => {
      const others = current.filter((pop) => pop.index !== index);
      const mine = current.filter((pop) => pop.index === index).slice(-(MAX_POPS - 1));
      return [...others, ...mine, { id, index, amount: change }];
    });
    window.setTimeout(() => setPops((current) => current.filter((pop) => pop.id !== id)), POP_MS);
  }, []);

  // The keys change only with the signature above, which loads new states, so `states` is enough.
  useEffect(() => {
    states.forEach((state, index) => {
      const key = keysRef.current[index];
      if (!key) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Storage blocked: the count still works, it just won't survive a reload.
      }
    });
  }, [states]);

  useSubEvents(twitch, kick, !simulate, handleEvent);

  // Preview: now and then a counter goes up, and sometimes down, the way a run of games would.
  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    const step = () => {
      const quiet = Date.now() - lastTestAt.current < SIM_QUIET_AFTER_TEST_MS;
      const list = countersRef.current;
      if (!quiet && list.length > 0) {
        const index = Math.floor(Math.random() * list.length);
        const down = Math.random() < 0.15 && (statesRef.current[index]?.count ?? 0) > 0;
        handleEvent({
          kind: 'mod',
          platform: 'twitch',
          text: `!${list[index].command} ${down ? '-1' : '+1'}`,
        });
      }
      timer = window.setTimeout(step, 2000 + Math.random() * 1500);
    };
    timer = window.setTimeout(step, 1200);
    return () => window.clearTimeout(timer);
  }, [simulate, handleEvent]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'command') return;
    lastTestAt.current = Date.now();
    handleEvent({ kind: 'mod', platform: 'twitch', text: message.text });
  });

  return { counts: states.map((state) => state.count), pops, bumps };
}
