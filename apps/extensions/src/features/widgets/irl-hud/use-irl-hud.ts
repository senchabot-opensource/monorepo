import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { HudMoneyValues } from '#/lib/irl-hud-url';
import type { SubathonEvent, SubathonPlatform } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import {
  applyCashCommand,
  clampMoney,
  createHud,
  eventMoney,
  followStart,
  type HudState,
  isHudState,
  parseCashCommand,
} from './hud-money';

/** Storage key per channel pair, so every HUD source for the channel shares one wallet. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.irl-hud:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

/** The saved HUD, or a new one at the starting amount. */
function loadState(key: string | null, start: number): HudState {
  if (!key) return createHud(start);
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    if (isHudState(saved)) return followStart(saved, start);
  } catch {
    // Storage blocked or garbage: start over.
  }
  return createHud(start);
}

/** A "+$100" next to the money: `name` is who sent it, empty for a mod's !hud cash. */
export interface HudPop {
  id: number;
  amount: number;
  name: string;
  platform: SubathonPlatform;
}

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:irl-hud-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it plays it. */
export type PreviewMessage = { type: 'event'; preview: string; event: SubathonEvent };

export const POP_MS = 3000;
const MAX_POPS = 3;
// After a test button, simulated events hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

type HudValues = HudMoneyValues & { tiers: boolean };

/** A random event the settings pay for, or null when every value is off. */
function simulatedEvent(values: HudValues, only?: SubathonPlatform): SubathonEvent | null {
  const platform = only ?? pick<SubathonPlatform>(['twitch', 'kick']);
  const name = pick(SIM_NAMES);
  const events: SubathonEvent[] = [
    { kind: 'sub', platform, name, tier: 1 },
    { kind: 'sub', platform, name, tier: 1 },
    { kind: 'gift', platform, name, tier: 1, count: pick([1, 3, 5]) },
    { kind: 'bits', platform, name, amount: pick([100, 250, 500]) },
    { kind: 'raid', platform, name, viewers: pick([12, 35, 80]) },
  ];
  const paying = events.filter((event) => eventMoney(event, values) > 0);
  return paying.length > 0 ? pick(paying) : null;
}

interface UseIrlHudOptions {
  twitch?: string;
  kick?: string;
  start: number;
  values: HudValues;
  /** Preview mode: simulated events, no chat and no saved money. */
  simulate?: boolean;
  /** The only platform the preview simulates; both when unset. */
  simPlatform?: SubathonPlatform;
  /** Pairs the preview with its setup page's test buttons. */
  previewId?: string;
}

export function useIrlHud({
  twitch,
  kick,
  start,
  values,
  simulate = false,
  simPlatform,
  previewId,
}: UseIrlHudOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const settingsRef = useRef({ start, values });
  settingsRef.current = { start, values };
  const [state, setState] = useState<HudState>(() => loadState(key, start));
  const stateRef = useRef(state);
  const [pops, setPops] = useState<HudPop[]>([]);
  const nextId = useRef(0);
  const lastTestAt = useRef(0);

  const commit = useCallback((next: HudState) => {
    const previous = stateRef.current;
    stateRef.current = next;
    setState(next);
    return next.money - previous.money;
  }, []);

  const pop = useCallback((amount: number, name: string, platform: SubathonPlatform) => {
    const id = ++nextId.current;
    setPops((list) => [...list.slice(-(MAX_POPS - 1)), { id, amount, name, platform }]);
    window.setTimeout(() => setPops((list) => list.filter((item) => item.id !== id)), POP_MS);
  }, []);

  const handleEvent = useCallback(
    (event: SubathonEvent) => {
      const current = settingsRef.current;
      if (event.kind === 'mod') {
        const command = parseCashCommand(event.text);
        if (!command) return;
        const changed = commit(applyCashCommand(stateRef.current, command, current.start));
        // Adding and removing float the difference; set and reset just roll the counter.
        if (changed !== 0 && (command.action === 'add' || command.action === 'remove'))
          pop(changed, '', event.platform);
        return;
      }
      const amount = eventMoney(event, current.values);
      if (amount <= 0) return;
      const previous = stateRef.current;
      const added = commit({ ...previous, money: clampMoney(previous.money + amount) });
      // At the top of the counter no money gets through, so there's no amount to show.
      if (added > 0) pop(added, event.name, event.platform);
    },
    [commit, pop],
  );

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage blocked: the HUD still works, it just won't survive a reload.
    }
  }, [key, state]);

  useSubEvents(twitch, kick, !simulate, handleEvent);

  // Preview: something pays out every few seconds.
  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    const step = () => {
      const quiet = Date.now() - lastTestAt.current < SIM_QUIET_AFTER_TEST_MS;
      const event = quiet ? null : simulatedEvent(settingsRef.current.values, simPlatform);
      if (event) handleEvent(event);
      timer = window.setTimeout(step, 2200 + Math.random() * 2000);
    };
    timer = window.setTimeout(step, 1200);
    return () => window.clearTimeout(timer);
  }, [simulate, simPlatform, handleEvent]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'event') return;
    lastTestAt.current = Date.now();
    handleEvent(message.event);
  });

  return { money: state.money, pops };
}
