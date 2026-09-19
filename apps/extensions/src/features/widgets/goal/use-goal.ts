import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { SubathonEvent, SubathonPlatform, TimedEvent } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import {
  addToGoal,
  applyGoalCommand,
  createGoal,
  followStart,
  type GoalState,
  isGoalState,
  parseGoalCommand,
  progressOf,
  subsIn,
} from './goal-count';

/** Storage key per channel pair, so every Sub Goal source for the channel shares one count. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.goal:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

/** The saved count, or a new one at the starting count. */
function loadState(key: string | null, start: number): GoalState {
  if (!key) return createGoal(start);
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    if (isGoalState(saved)) return followStart(saved, start);
  } catch {
    // Storage blocked or garbage: start over.
  }
  return createGoal(start);
}

export type SubEvent = Extract<TimedEvent, { kind: 'sub' | 'gift' }>;

export interface GoalPop {
  id: number;
  amount: number;
  event: SubEvent;
}

/** A change to show: `from` and `to` are progress before and after, `up` whether subs came in. */
export interface GoalHit {
  key: number;
  from: number;
  to: number;
  up: boolean;
}

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:goal-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it plays it. */
export type PreviewMessage = { type: 'event'; preview: string; event: SubathonEvent };

export const POP_MS = 2600;
const MAX_POPS = 3;
export const CELEBRATE_MS = 4200;
// The preview starts over a while after the goal is reached, once the celebration has played.
const SIM_RESTART_MS = CELEBRATE_MS + 1500;
// After a test button, simulated events hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function simulatedEvent(only?: SubathonPlatform): SubEvent {
  const platform = only ?? pick<SubathonPlatform>(['twitch', 'kick']);
  const name = pick(SIM_NAMES);
  return Math.random() < 0.7
    ? { kind: 'sub', platform, name, tier: 1 }
    : { kind: 'gift', platform, name, tier: 1, count: pick([1, 3, 5]) };
}

interface UseGoalOptions {
  twitch?: string;
  kick?: string;
  start: number;
  target: number;
  /** Preview mode: simulated subs, no chat and no saved count. */
  simulate?: boolean;
  /** The only platform the preview simulates; both when unset. */
  simPlatform?: SubathonPlatform;
  /** Pairs the preview with its setup page's test buttons. */
  previewId?: string;
}

export function useGoal({
  twitch,
  kick,
  start,
  target,
  simulate = false,
  simPlatform,
  previewId,
}: UseGoalOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const settingsRef = useRef({ start, target });
  settingsRef.current = { start, target };
  const [state, setState] = useState<GoalState>(() => loadState(key, start));
  const stateRef = useRef(state);
  const [pops, setPops] = useState<GoalPop[]>([]);
  const [hit, setHit] = useState<GoalHit | null>(null);
  // Set while the goal-reached celebration plays; a new key replays it.
  const [celebration, setCelebration] = useState<number | null>(null);
  const popId = useRef(0);
  const lastTestAt = useRef(0);

  /** Makes `next` the count and returns how many subs that added (negative when removed). */
  const commit = useCallback((next: GoalState): number => {
    const previous = stateRef.current;
    stateRef.current = next;
    setState(next);
    const { target } = settingsRef.current;
    const added = next.count - previous.count;
    if (added !== 0) {
      setHit({
        key: Date.now(),
        from: progressOf(previous.count, target),
        to: progressOf(next.count, target),
        up: added > 0,
      });
    }
    if (previous.count < target && next.count >= target) setCelebration(Date.now());
    return added;
  }, []);

  const handleEvent = useCallback(
    (event: SubathonEvent) => {
      if (event.kind === 'mod') {
        const command = parseGoalCommand(event.text);
        if (command) commit(applyGoalCommand(stateRef.current, command, settingsRef.current.start));
        return;
      }
      if (event.kind !== 'sub' && event.kind !== 'gift') return;
      const amount = subsIn(event);
      // At the top of the scale nothing gets through, so there's nothing to show either.
      const added = amount > 0 ? commit(addToGoal(stateRef.current, amount)) : 0;
      if (added <= 0) return;
      const id = ++popId.current;
      setPops((list) => [...list.slice(-(MAX_POPS - 1)), { id, amount: added, event }]);
      window.setTimeout(() => setPops((list) => list.filter((pop) => pop.id !== id)), POP_MS);
    },
    [commit],
  );

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage blocked: the count still works, it just won't survive a reload.
    }
  }, [key, state]);

  useEffect(() => {
    if (celebration === null) return;
    const timer = window.setTimeout(() => setCelebration(null), CELEBRATE_MS);
    return () => window.clearTimeout(timer);
  }, [celebration]);

  useSubEvents(twitch, kick, !simulate, handleEvent);

  // Preview: a sub or gift every few seconds; once the goal is reached, celebrate and start over.
  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    const step = () => {
      if (stateRef.current.count >= settingsRef.current.target) {
        timer = window.setTimeout(() => {
          commit(createGoal(settingsRef.current.start));
          timer = window.setTimeout(step, 1200);
        }, SIM_RESTART_MS);
        return;
      }
      const quiet = Date.now() - lastTestAt.current < SIM_QUIET_AFTER_TEST_MS;
      if (!quiet) handleEvent(simulatedEvent(simPlatform));
      timer = window.setTimeout(step, 2200 + Math.random() * 2000);
    };
    timer = window.setTimeout(step, 1200);
    return () => window.clearTimeout(timer);
  }, [simulate, simPlatform, commit, handleEvent]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'event') return;
    lastTestAt.current = Date.now();
    handleEvent(message.event);
  });

  return {
    count: state.count,
    progress: progressOf(state.count, target),
    reached: state.count >= target,
    celebration,
    pops,
    hit,
  };
}
