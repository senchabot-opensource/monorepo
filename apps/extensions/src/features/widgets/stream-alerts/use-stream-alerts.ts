import { useCallback, useEffect, useRef, useState } from 'react';
import { ALERT_KINDS, type AlertSettings } from '#/lib/stream-alerts-url';
import type { SubathonEvent, SubathonPlatform } from '../subathon/subathon-events';
import { KickEventSource, TwitchEventSource } from '../subathon/subathon-sources';
import { useKickIds } from '../subathon/use-subathon';
import { playAlertSound } from './alert-sound';
import { passesFilters, type StreamAlert } from './stream-alert';

export interface ShownAlert {
  /** New for every alert, so the same alert twice in a row replays its animation. */
  id: number;
  alert: StreamAlert;
  sound: boolean;
}

/** Setup page test buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:stream-alerts-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it plays it. */
export type PreviewMessage = { type: 'alert'; preview: string; alert: StreamAlert };

// A breath between two alerts, so the next one reads as new.
export const ALERT_GAP_MS = 800;
// A gift bomb from many viewers shouldn't keep the queue busy for an hour.
const MAX_QUEUED = 30;
// A Kick sub without months waits this long for its other event, which live came up to 1.4 s later.
export const KICK_MONTHS_WAIT_MS = 1500;
const SIM_IDLE_MS = 1500;
const SIM_TICK_MS = 250;
// After a test button's alert, sample alerts hold off a little longer, so it isn't cut short.
const SIM_QUIET_AFTER_TEST_MS = 3000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
// Words that read the same in every alert language.
const SIM_MESSAGES = ['', 'GG!', 'Hype!', '<3', 'PogChamp'];
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** A random alert the settings would show, or null when every alert is off. */
function simulatedAlert(
  settings: AlertSettings,
  only: SubathonPlatform | undefined,
): StreamAlert | null {
  const platform = only ?? pick<SubathonPlatform>(['twitch', 'kick']);
  const name = pick(SIM_NAMES);
  const kinds = ALERT_KINDS.filter((kind) => settings.enabled[kind]);
  if (kinds.length === 0) return null;
  switch (pick(kinds)) {
    case 'sub':
      return {
        kind: 'sub',
        platform,
        name,
        tier: 1,
        months: pick([1, 3, 12]),
        message: pick(SIM_MESSAGES),
      };
    case 'gift':
      return {
        kind: 'gift',
        platform,
        name,
        tier: 1,
        count: Math.max(settings.minGift, pick([1, 5, 10])),
      };
    case 'bits': {
      const amount = Math.max(settings.minBits, pick([100, 500, 1000]));
      return { kind: 'bits', platform, name, amount, message: pick(SIM_MESSAGES) };
    }
    case 'raid':
      return {
        kind: 'raid',
        platform,
        name,
        viewers: Math.max(settings.minRaid, pick([12, 48, 230])),
      };
  }
}

interface UseStreamAlertsOptions {
  twitch?: string;
  kick?: string;
  settings: AlertSettings;
  /** Preview mode: silent simulated alerts and the setup page's test buttons, no chat. */
  simulate?: boolean;
  /** Preview only: simulate this platform's alerts; both when unset. */
  simPlatform?: SubathonPlatform;
  /** Preview only: takes test alerts sent with this id. The landing's demos have none. */
  previewId?: string;
}

/** The alert on screen, or null between alerts. Alerts show one at a time, in arrival order. */
export function useStreamAlerts({
  twitch,
  kick,
  settings,
  simulate = false,
  simPlatform,
  previewId,
}: UseStreamAlertsOptions) {
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const [current, setCurrent] = useState<ShownAlert | null>(null);
  const queue = useRef<ShownAlert[]>([]);
  // True from an alert's start until the gap after the last queued one ends.
  const busy = useRef(false);
  const nextId = useRef(0);
  const lastTestAt = useRef(0);
  // Kick subs waiting for their months, by lowercase name.
  const held = useRef(
    new Map<string, { alert: Extract<StreamAlert, { kind: 'sub' }>; timer: number }>(),
  );

  /** `interrupt` drops the queue and replaces the alert on screen. */
  const enqueue = useCallback((alert: StreamAlert, { sound = true, interrupt = false } = {}) => {
    if (!passesFilters(alert, settingsRef.current)) return;
    const shown = { id: ++nextId.current, alert, sound };
    if (interrupt) queue.current = [];
    if (!busy.current || interrupt) {
      busy.current = true;
      setCurrent(shown);
    } else if (queue.current.length < MAX_QUEUED) {
      queue.current.push(shown);
    }
  }, []);

  useEffect(() => {
    if (!current) return;
    const { theme, volume, duration } = settingsRef.current;
    if (current.sound) playAlertSound(theme, current.alert.kind, volume / 100);
    const timer = window.setTimeout(() => setCurrent(null), duration * 1000);
    return () => window.clearTimeout(timer);
  }, [current]);

  // After an alert: the next one in line after the gap, or idle.
  useEffect(() => {
    if (current || !busy.current) return;
    const timer = window.setTimeout(() => {
      const next = queue.current.shift();
      if (next) setCurrent(next);
      else busy.current = false;
    }, ALERT_GAP_MS);
    return () => window.clearTimeout(timer);
  }, [current]);

  const handleEvent = useCallback(
    (event: SubathonEvent) => {
      if (event.kind === 'command') return;
      if (event.kind !== 'sub' || event.platform !== 'kick' || event.again === 'shared') {
        enqueue(event);
        return;
      }
      const key = event.name.toLowerCase();
      const waiting = held.current.get(key);
      if (event.again === 'repeat') {
        // Too late, or the sub came with its months the first time: it's already queued.
        if (!waiting) return;
        window.clearTimeout(waiting.timer);
        held.current.delete(key);
        enqueue({ ...waiting.alert, months: event.months });
      } else if (event.months) {
        enqueue(event);
      } else {
        const timer = window.setTimeout(() => {
          held.current.delete(key);
          enqueue(event);
        }, KICK_MONTHS_WAIT_MS);
        held.current.set(key, { alert: event, timer });
      }
    },
    [enqueue],
  );

  useEffect(() => {
    const waiting = held.current;
    return () => {
      for (const { timer } of waiting.values()) window.clearTimeout(timer);
      waiting.clear();
    };
  }, []);

  const kickIds = useKickIds(kick, !simulate);
  // One effect per platform: a Kick lookup that lands later must not restart the Twitch reader.
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

  // Preview: a silent alert whenever the screen has been empty for a moment, unless a test
  // button's alert just played.
  useEffect(() => {
    if (!simulate) return;
    let idleSince = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (busy.current) {
        idleSince = now;
        return;
      }
      const quietUntil =
        lastTestAt.current + settingsRef.current.duration * 1000 + SIM_QUIET_AFTER_TEST_MS;
      if (now - idleSince < SIM_IDLE_MS || now < quietUntil) return;
      const alert = simulatedAlert(settingsRef.current, simPlatform);
      if (alert) enqueue(alert, { sound: false });
    }, SIM_TICK_MS);
    return () => window.clearInterval(timer);
  }, [simulate, simPlatform, enqueue]);

  // A test button's alert replaces whatever is showing, so the click answers right away.
  useEffect(() => {
    if (!simulate || !previewId || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.onmessage = ({ data }: MessageEvent<PreviewMessage>) => {
      if (data?.type !== 'alert' || data.preview !== previewId) return;
      lastTestAt.current = Date.now();
      enqueue(data.alert, { interrupt: true });
    };
    return () => channel.close();
  }, [simulate, previewId, enqueue]);

  return current;
}
