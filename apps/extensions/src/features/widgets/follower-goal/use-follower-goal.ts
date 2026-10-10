import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addToGoal,
  applyGoalCommand,
  createGoal,
  followStart,
  type GoalState,
  isGoalState,
  progressOf,
} from '#/features/widgets/goal/goal-count';
import type { SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { useSubEvents } from '#/features/widgets/subathon/use-sub-events';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import { FollowerGoalClient } from '#/lib/follower-goal';

export interface FollowerEvent {
  kind: 'follow';
  platform: SubathonPlatform;
  name: string;
}

export interface FollowerGoalPop {
  id: number;
  amount: number;
  event: FollowerEvent;
}

export interface GoalHit {
  key: number;
  from: number;
  to: number;
  up: boolean;
}

export const storageKey = (twitch = '', kick = '') =>
  `senchabot.follower_goal:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

function loadState(key: string | null, start: number): GoalState {
  if (!key) return createGoal(start);
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    if (isGoalState(saved)) return followStart(saved, start);
  } catch {}
  return createGoal(start);
}

export const PREVIEW_CHANNEL = 'senchabot:follower-goal-preview';

export type FollowerPreviewMessage =
  | { type: 'follow'; preview: string; name?: string; platform?: SubathonPlatform }
  | { type: 'reach'; preview: string }
  | { type: 'reset'; preview: string };

export const POP_MS = 2600;
const MAX_POPS = 3;
export const CELEBRATE_MS = 4200;
const SIM_RESTART_MS = CELEBRATE_MS + 1500;
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function simulatedFollow(only?: SubathonPlatform): FollowerEvent {
  const platform = only ?? pick<SubathonPlatform>(['twitch', 'kick']);
  const name = pick(SIM_NAMES);
  return { kind: 'follow', platform, name };
}

export const FOLLOWER_GOAL_COMMAND = '!fgoal';

const GOAL_ACTIONS: Record<string, 'add' | 'remove' | 'set' | 'reset'> = {
  add: 'add',
  '+': 'add',
  remove: 'remove',
  '-': 'remove',
  set: 'set',
  reset: 'reset',
};

export function parseFollowerGoalCommand(message: string) {
  const [command, word = '', amount, ...rest] = message.trim().split(/\s+/);
  const cmd = command?.toLowerCase();
  if ((cmd !== '!fgoal' && cmd !== '!followgoal' && cmd !== '!goal') || rest.length > 0) return null;
  const action = GOAL_ACTIONS[word.toLowerCase()];
  if (!action) return null;
  if (action === 'reset') return amount === undefined ? { action } : null;
  if (amount === undefined) return action === 'set' ? null : { action, amount: 1 };
  if (!/^\d+$/.test(amount)) return null;
  const n = Number(amount);
  return n <= 10_000_000 ? { action, amount: n } : null;
}

interface UseFollowerGoalOptions {
  twitch?: string;
  kick?: string;
  token?: string;
  start: number;
  target: number;
  hideAfter: number | null;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function useFollowerGoal({
  twitch,
  kick,
  token,
  start,
  target,
  hideAfter,
  simulate = false,
  simPlatform,
  previewId,
}: UseFollowerGoalOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const settingsRef = useRef({ start, target });
  settingsRef.current = { start, target };

  const [state, setState] = useState<GoalState>(() => loadState(key, start));
  const stateRef = useRef(state);
  const [pops, setPops] = useState<FollowerGoalPop[]>([]);
  const [hit, setHit] = useState<GoalHit | null>(null);
  const [celebration, setCelebration] = useState<{
    key: number;
    event: FollowerEvent | null;
  } | null>(null);
  const popId = useRef(0);
  const lastTestAt = useRef(0);

  const commit = useCallback((next: GoalState, event?: FollowerEvent): number => {
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
    if (previous.count < target && next.count >= target) {
      setCelebration({ key: Date.now(), event: event ?? null });
    }
    return added;
  }, []);

  const handleFollow = useCallback(
    (event: FollowerEvent) => {
      const added = commit(addToGoal(stateRef.current, 1), event);
      if (added <= 0) return;
      const id = ++popId.current;
      setPops((list) => [...list.slice(-(MAX_POPS - 1)), { id, amount: added, event }]);
      window.setTimeout(() => setPops((list) => list.filter((pop) => pop.id !== id)), POP_MS);
    },
    [commit],
  );

  // Save state to localStorage
  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  // Clear celebration timer
  useEffect(() => {
    if (celebration === null) return;
    const timer = window.setTimeout(() => setCelebration(null), CELEBRATE_MS);
    return () => window.clearTimeout(timer);
  }, [celebration]);

  const reached = state.count >= target;
  const [completedHidden, setCompletedHidden] = useState(false);
  useEffect(() => {
    if (!reached || hideAfter === null) {
      setCompletedHidden(false);
      return;
    }
    if (hideAfter <= 0) {
      setCompletedHidden(true);
      return;
    }
    const timer = window.setTimeout(() => setCompletedHidden(true), hideAfter * 1000);
    return () => window.clearTimeout(timer);
  }, [reached, hideAfter]);

  // Connect to WebSocket client when not in simulate mode and token is provided
  useEffect(() => {
    if (simulate || !token?.trim()) return;

    const channel = (twitch || kick || '').trim();
    const client = new FollowerGoalClient(token, channel, (followEvent) => {
      handleFollow({
        kind: 'follow',
        platform: (followEvent.platform as SubathonPlatform) || 'twitch',
        name: followEvent.user,
      });
    });

    return () => client.disconnect();
  }, [simulate, token, twitch, kick, handleFollow]);


  // Mod commands in chat (!fgoal / !goal add, remove, set, reset)
  useSubEvents(twitch, kick, !simulate && Boolean(twitch || kick), (event) => {
    if (event.kind === 'mod') {
      const command = parseFollowerGoalCommand(event.text);
      if (command) commit(applyGoalCommand(stateRef.current, command, settingsRef.current.start));
    }
  });

  // Preview simulation loop
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
      if (!quiet) handleFollow(simulatedFollow(simPlatform));
      timer = window.setTimeout(step, 2200 + Math.random() * 2000);
    };
    timer = window.setTimeout(step, 1200);
    return () => window.clearTimeout(timer);
  }, [simulate, simPlatform, commit, handleFollow]);

  // Preview receiver for setup page test buttons
  usePreviewReceiver<FollowerPreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    lastTestAt.current = Date.now();
    if (message.type === 'follow') {
      handleFollow({
        kind: 'follow',
        platform: message.platform ?? simPlatform ?? 'twitch',
        name: message.name ?? pick(SIM_NAMES),
      });
    } else if (message.type === 'reach') {
      const event: FollowerEvent = {
        kind: 'follow',
        platform: simPlatform ?? 'twitch',
        name: pick(SIM_NAMES),
      };
      commit({ ...stateRef.current, count: settingsRef.current.target }, event);
    } else if (message.type === 'reset') {
      commit(createGoal(settingsRef.current.start));
    }
  });

  return {
    count: state.count,
    progress: progressOf(state.count, target),
    reached,
    completedHidden,
    celebration,
    pops,
    hit,
  };
}
