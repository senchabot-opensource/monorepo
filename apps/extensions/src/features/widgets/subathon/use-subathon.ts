import { useCallback, useEffect, useRef, useState } from 'react';
import type { Disconnectable } from '#/lib/basechat';
import { getKickChannelInfo } from '#/lib/kick';
import type { SubathonSettings } from '#/lib/subathon-url';
import type { SubathonEvent, SubTier } from './subathon-events';
import { KickSubathonSource, TwitchSubathonSource } from './subathon-sources';
import {
  addTime,
  applyCommand,
  createState,
  followSettings,
  healthOf,
  isEnded,
  isSubathonState,
  type SubathonState,
  timeLeft,
} from './subathon-timer';

export type SubathonValues = Pick<
  SubathonSettings,
  'start' | 'cap' | 'sub' | 'gift' | 'bits' | 'tiers' | 'autostart'
>;

// Tier 2 and Tier 3 cost about 2x and 5x a Tier 1 sub.
const TIER_WEIGHT: Record<SubTier, number> = { 1: 1, 2: 2, 3: 5 };

/** Time an event adds, in ms; 0 when its value is turned off. */
export function eventTime(event: SubathonEvent, values: SubathonValues): number {
  const weight = (tier: SubTier) => (values.tiers ? TIER_WEIGHT[tier] : 1);
  switch (event.kind) {
    case 'sub':
      return values.sub * weight(event.tier) * 1000;
    case 'gift':
      return values.gift * event.count * weight(event.tier) * 1000;
    case 'bits':
      return Math.round((values.bits * event.amount) / 100) * 1000;
    case 'command':
      return 0;
  }
}

/** Storage key per channel pair, so every Subathon source for the channel shares one clock. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.subathon:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

/**
 * The saved clock, or a new one from the settings. Until the clock first runs it follows the
 * URL, so changing the starting time before the subathon begins needs no reset.
 */
export function loadState(key: string | null, values: SubathonValues, now: number): SubathonState {
  const options = {
    base: values.start * 1000,
    cap: values.cap * 1000,
    autostart: values.autostart,
  };
  const fresh = createState(options.base, options.autostart, now, options.cap);
  if (!key) return fresh;
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    if (isSubathonState(saved)) return followSettings(saved, now, options);
  } catch {
    // Storage blocked or garbage: start over.
  }
  return fresh;
}

type TimedEvent = Exclude<SubathonEvent, { kind: 'command' }>;

export interface SubathonPop {
  id: number;
  ms: number;
  event: TimedEvent;
}

/** A change to show: `from` and `to` are health before and after, `heal` whether time was added. */
export interface SubathonHit {
  key: number;
  from: number;
  to: number;
  heal: boolean;
}

export interface KickIds {
  chatroomId: string;
  channelId: string | null;
}

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:subathon-preview';
export type PreviewMessage = { type: 'event'; event: SubathonEvent } | { type: 'toggle' };

// The preview's fast clock needs smooth steps; on stream the bar moves too slowly to see 100ms.
const SIM_TICK_MS = 100;
const LIVE_TICK_MS = 250;
// OBS can start before the network is up, and a subathon runs for days: keep trying Kick.
const KICK_LOOKUP_RETRY_MS = [5_000, 15_000, 30_000, 60_000];
export const POP_MS = 2600;
const MAX_POPS = 3;
// The preview drains the bar in about this long, whatever the starting time.
const SIM_DRAIN_MS = 40_000;
const SIM_MIN_CAPACITY_MS = 30 * 60_000;
const SIM_RESTART_MS = 3500;
// After a test button, simulated events hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];

function simulatedEvent(values: SubathonValues): TimedEvent | null {
  const kinds = (['sub', 'gift', 'bits'] as const).filter((kind) => values[kind] > 0);
  if (kinds.length === 0) return null;
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  const platform = Math.random() < 0.5 ? 'twitch' : 'kick';
  const name = SIM_NAMES[Math.floor(Math.random() * SIM_NAMES.length)];
  if (kind === 'sub') return { kind, platform, name, tier: 1 };
  if (kind === 'gift') {
    return { kind, platform, name, tier: 1, count: [1, 1, 3, 5][Math.floor(Math.random() * 4)] };
  }
  return { kind, platform, name, amount: [100, 250, 500][Math.floor(Math.random() * 3)] };
}

interface UseSubathonOptions {
  twitch?: string;
  kick?: string;
  /** Skips the Kick channel lookup, e.g. in tests. */
  kickIds?: KickIds | null;
  values: SubathonValues;
  /** Preview mode: simulated events on a fast clock, no chat and no saved state. */
  simulate?: boolean;
  /** Preview clock speed, e.g. 60 for a minute per second. Without it the bar drains in ~40 s. */
  simSpeed?: number;
}

/** The Kick chatroom and channel ids, looked up again until kick.com answers. */
function useKickIds(kick: string | undefined, known: KickIds | null | undefined, enabled: boolean) {
  const [ids, setIds] = useState<KickIds | null>(null);
  const lookUp = enabled && Boolean(kick) && !known;
  useEffect(() => {
    setIds(null);
    if (!lookUp || !kick) return;
    let cancelled = false;
    let timer: number | undefined;
    const lookup = async (attempt: number) => {
      const info = await getKickChannelInfo(kick);
      if (cancelled) return;
      if (info.chatroomId) {
        setIds({ chatroomId: info.chatroomId, channelId: info.channelId });
        return;
      }
      const delay = KICK_LOOKUP_RETRY_MS[Math.min(attempt, KICK_LOOKUP_RETRY_MS.length - 1)];
      timer = window.setTimeout(() => lookup(attempt + 1), delay);
    };
    lookup(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [kick, lookUp]);
  return known ?? ids;
}

export function useSubathon({
  twitch,
  kick,
  kickIds,
  values,
  simulate = false,
  simSpeed,
}: UseSubathonOptions) {
  // The preview runs a fast virtual clock so the bar visibly drains.
  const rate = !simulate
    ? 1
    : simSpeed && simSpeed > 0
      ? simSpeed
      : Math.max(SIM_MIN_CAPACITY_MS, values.start * 1000) / SIM_DRAIN_MS;
  const originRef = useRef(Date.now());
  const clock = useCallback(
    () => originRef.current + (Date.now() - originRef.current) * rate,
    [rate],
  );

  const key = simulate ? null : storageKey(twitch, kick);
  const kickIdsFound = useKickIds(kick, kickIds, !simulate);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const [state, setState] = useState<SubathonState>(() =>
    loadState(key, simulate ? { ...values, autostart: true } : values, clock()),
  );
  const stateRef = useRef(state);
  const [now, setNow] = useState(clock);
  const [pops, setPops] = useState<SubathonPop[]>([]);
  const [hit, setHit] = useState<SubathonHit | null>(null);
  const popId = useRef(0);
  const lastTestAt = useRef(0);

  const commit = useCallback(
    (next: SubathonState) => {
      const at = clock();
      const previous = stateRef.current;
      stateRef.current = next;
      setState(next);
      setNow(at);
      const added = timeLeft(next, at) - timeLeft(previous, at);
      if (added !== 0) {
        setHit({
          key: Date.now(),
          from: healthOf(previous, at),
          to: healthOf(next, at),
          heal: added > 0,
        });
      }
    },
    [clock],
  );

  const handleEvent = useCallback(
    (event: SubathonEvent) => {
      const current = valuesRef.current;
      const at = clock();
      if (event.kind === 'command') {
        commit(
          applyCommand(stateRef.current, event.command, at, {
            base: current.start * 1000,
            cap: current.cap * 1000,
            autostart: current.autostart,
          }),
        );
        return;
      }
      if (isEnded(stateRef.current, at)) return;
      const previous = stateRef.current;
      const next = addTime(previous, eventTime(event, current), at, current.cap * 1000);
      // At the cap nothing gets through, so there's nothing to show either.
      const ms = timeLeft(next, at) - timeLeft(previous, at);
      if (ms <= 0) return;
      commit(next);
      const id = ++popId.current;
      setPops((list) => [...list.slice(-(MAX_POPS - 1)), { id, ms, event }]);
      window.setTimeout(() => setPops((list) => list.filter((pop) => pop.id !== id)), POP_MS);
    },
    [clock, commit],
  );

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage blocked: the clock still runs, it just won't survive a reload.
    }
  }, [key, state]);

  const running = state.endsAt !== null && !isEnded(state, now);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setNow(clock()), simulate ? SIM_TICK_MS : LIVE_TICK_MS);
    return () => window.clearInterval(timer);
  }, [running, clock, simulate]);

  useEffect(() => {
    if (simulate) return;
    const sources: Disconnectable[] = [];
    if (twitch) sources.push(new TwitchSubathonSource(twitch, handleEvent));
    const chatroomId = kickIdsFound?.chatroomId;
    const channelId = kickIdsFound?.channelId ?? null;
    if (kick && chatroomId) {
      sources.push(new KickSubathonSource(chatroomId, channelId, handleEvent));
    }
    return () => {
      for (const source of sources) source.disconnect();
    };
  }, [simulate, twitch, kick, kickIdsFound?.chatroomId, kickIdsFound?.channelId, handleEvent]);

  // Preview: a sub, gift or cheer every few seconds; once out of time, show the end and restart.
  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    const step = () => {
      if (isEnded(stateRef.current, clock())) {
        timer = window.setTimeout(() => {
          const { start, cap } = valuesRef.current;
          commit(createState(start * 1000, true, clock(), cap * 1000));
          timer = window.setTimeout(step, 1200);
        }, SIM_RESTART_MS);
        return;
      }
      const event =
        Date.now() - lastTestAt.current > SIM_QUIET_AFTER_TEST_MS &&
        simulatedEvent(valuesRef.current);
      if (event) handleEvent(event);
      timer = window.setTimeout(step, 2200 + Math.random() * 2000);
    };
    timer = window.setTimeout(step, 1200);
    return () => window.clearTimeout(timer);
  }, [simulate, clock, commit, handleEvent]);

  useEffect(() => {
    if (!simulate || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.onmessage = ({ data }: MessageEvent<PreviewMessage>) => {
      lastTestAt.current = Date.now();
      if (data?.type === 'toggle') {
        const action = stateRef.current.endsAt === null ? 'start' : 'pause';
        handleEvent({ kind: 'command', platform: 'twitch', command: { action } });
      } else if (data?.type === 'event') {
        handleEvent(data.event);
      }
    };
    return () => channel.close();
  }, [simulate, handleEvent]);

  return {
    left: timeLeft(state, now),
    health: healthOf(state, now),
    paused: state.endsAt === null,
    ended: isEnded(state, now),
    pops,
    hit,
  };
}
