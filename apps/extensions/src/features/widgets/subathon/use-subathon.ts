import { useCallback, useEffect, useRef, useState } from 'react';
import { getKickChannelInfo } from '#/lib/kick';
import type { SubathonSettings, SubathonTimeValues } from '#/lib/subathon-url';
import type { SubathonEvent, SubathonPlatform, SubTier, TimedEvent } from './subathon-events';
import { KickEventSource, TwitchEventSource } from './subathon-sources';
import {
  addTime,
  applyCommand,
  type ClockOptions,
  createState,
  followSettings,
  healthOf,
  isEnded,
  isSubathonState,
  type SubathonState,
  timeLeft,
} from './subathon-timer';

type SubathonValues = SubathonTimeValues &
  Pick<SubathonSettings, 'start' | 'cap' | 'autostart' | 'tiers'>;

// Tier 2 and Tier 3 cost about 2x and 5x a Tier 1 sub.
const TIER_WEIGHT: Record<SubTier, number> = { 1: 1, 2: 2, 3: 5 };

// The Bits and Kicks values are per this many, about the price of one sub.
const BITS_PER_VALUE = 500;

const clockOptions = (values: SubathonValues): ClockOptions => ({
  base: values.start * 1000,
  cap: values.cap * 1000,
  autostart: values.autostart,
});

/** Seconds an event adds by its platform's values; Twitch tiers weigh in when turned on. */
function valueFor(event: TimedEvent, values: SubathonValues): number {
  const kick = event.platform === 'kick';
  const weight = kick || event.kind === 'bits' || !values.tiers ? 1 : TIER_WEIGHT[event.tier];
  switch (event.kind) {
    case 'sub':
      return (kick ? values.ksub : values.tsub) * weight;
    case 'gift':
      return (kick ? values.kgift : values.tgift) * event.count * weight;
    case 'bits':
      return ((kick ? values.kicks : values.bits) * event.amount) / BITS_PER_VALUE;
  }
}

/** Time an event adds in ms (a 1 Bit cheer adds its share too); 0 when its value is off. */
const eventTime = (event: TimedEvent, values: SubathonValues) =>
  Math.round(valueFor(event, values) * 1000);

/** Storage key per channel pair, so every Subathon source for the channel shares one clock. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.subathon:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

/**
 * The saved clock, or a new one from the settings. Until the clock first runs it follows the
 * URL, so changing the starting time before the subathon begins needs no reset.
 */
function loadState(key: string | null, options: ClockOptions, now: number): SubathonState {
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
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** A random event the settings give time for, or null when every value is off. */
function simulatedEvent(values: SubathonValues): TimedEvent | null {
  const platform = pick<SubathonPlatform>(['twitch', 'kick']);
  const name = pick(SIM_NAMES);
  const events: TimedEvent[] = [
    { kind: 'sub', platform, name, tier: 1 },
    { kind: 'gift', platform, name, tier: 1, count: pick([1, 1, 3, 5]) },
    { kind: 'bits', platform, name, amount: pick([100, 250, 500]) },
  ];
  const enabled = events.filter((event) => eventTime(event, values) > 0);
  return enabled.length > 0 ? pick(enabled) : null;
}

/** The Kick chatroom and channel ids, looked up again until kick.com answers. */
export function useKickIds(kick: string | undefined, enabled: boolean) {
  const [ids, setIds] = useState<{ chatroomId: string; channelId: string | null } | null>(null);
  useEffect(() => {
    setIds(null);
    if (!enabled || !kick) return;
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
  }, [kick, enabled]);
  return ids;
}

interface UseSubathonOptions {
  twitch?: string;
  kick?: string;
  values: SubathonValues;
  /** Preview mode: simulated events on a fast clock, no chat and no saved state. */
  simulate?: boolean;
  /** Preview clock speed, e.g. 60 for a minute per second. Without it the bar drains in ~40 s. */
  simSpeed?: number;
}

export function useSubathon({
  twitch,
  kick,
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
  const kickIds = useKickIds(kick, !simulate);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const [state, setState] = useState<SubathonState>(() =>
    loadState(key, clockOptions(simulate ? { ...values, autostart: true } : values), clock()),
  );
  const stateRef = useRef(state);
  const [now, setNow] = useState(clock);
  const [pops, setPops] = useState<SubathonPop[]>([]);
  const [hit, setHit] = useState<SubathonHit | null>(null);
  const popId = useRef(0);
  const lastTestAt = useRef(0);

  /** Makes `next` the clock and returns how much time that added (negative when removed). */
  const commit = useCallback(
    (next: SubathonState): number => {
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
      return added;
    },
    [clock],
  );

  const handleEvent = useCallback(
    (event: SubathonEvent) => {
      const current = valuesRef.current;
      const at = clock();
      if (event.kind === 'command') {
        commit(applyCommand(stateRef.current, event.command, at, clockOptions(current)));
        return;
      }
      // A raid adds no time, and Kick's second word on a sub was counted with the first.
      if (event.kind === 'raid' || (event.kind === 'sub' && event.again)) return;
      if (isEnded(stateRef.current, at)) return;
      const ms = eventTime(event, current);
      // At the cap nothing gets through, so there's nothing to show either.
      const added = ms > 0 ? commit(addTime(stateRef.current, ms, at, current.cap * 1000)) : 0;
      if (added <= 0) return;
      const id = ++popId.current;
      setPops((list) => [...list.slice(-(MAX_POPS - 1)), { id, ms: added, event }]);
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

  // One effect per platform: a Kick lookup that lands later must not restart the Twitch reader,
  // which would lose Twitch events meanwhile and forget the gift bundles in flight.
  useEffect(() => {
    if (simulate || !twitch) return;
    const source = new TwitchEventSource(twitch, handleEvent);
    return () => source.disconnect();
  }, [simulate, twitch, handleEvent]);

  const chatroomId = kickIds?.chatroomId;
  const channelId = kickIds?.channelId ?? null;
  useEffect(() => {
    if (simulate || !chatroomId) return;
    const source = new KickEventSource(chatroomId, channelId, handleEvent);
    return () => source.disconnect();
  }, [simulate, chatroomId, channelId, handleEvent]);

  // Preview: an event every few seconds; once out of time, show the end and start over.
  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    const step = () => {
      if (isEnded(stateRef.current, clock())) {
        timer = window.setTimeout(() => {
          const options = { ...clockOptions(valuesRef.current), autostart: true };
          commit(applyCommand(stateRef.current, { action: 'reset' }, clock(), options));
          timer = window.setTimeout(step, 1200);
        }, SIM_RESTART_MS);
        return;
      }
      const quiet = Date.now() - lastTestAt.current < SIM_QUIET_AFTER_TEST_MS;
      const event = quiet ? null : simulatedEvent(valuesRef.current);
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
