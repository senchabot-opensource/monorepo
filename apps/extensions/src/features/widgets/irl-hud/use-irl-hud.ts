import { useCallback, useEffect, useRef, useState } from 'react';
import { useFollows } from '#/hooks/use-follows';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import {
  HUD_MOVES,
  type HudItem,
  type HudMap,
  type HudMoneyValues,
  type HudMove,
  type HudPlace,
} from '#/lib/irl-hud-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import {
  type ArrowSource,
  canGoIndoors,
  chosenView,
  MAP_RESET,
  mapNow,
  parseIndoorCommand,
  parseMapCommand,
  parseMoveCommand,
} from './hud-map';
import { parseBuyCommand } from './hud-market';
import {
  applyCashCommand,
  clampMoney,
  createHud,
  eventMoney,
  followStart,
  type HudEvent,
  type HudState,
  isHudState,
  parseCashCommand,
} from './hud-money';
import { parseToggleCommand, togglePart } from './hud-parts';

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

/**
 * A "+$100" next to the money: `name` is who sent it, or what was bought, and empty for a mod's
 * !hud cash. `declined` is a purchase the cash was short for: its price shows crossed out.
 */
export interface HudPop {
  id: number;
  amount: number;
  name: string;
  platform: SubathonPlatform;
  declined?: boolean;
}

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:irl-hud-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it plays it. */
export type PreviewMessage = { type: 'event'; preview: string; event: HudEvent };

export const POP_MS = 3000;
const MAX_POPS = 3;
// After a test button, simulated events hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

type HudValues = HudMoneyValues & { tiers: boolean };

/**
 * A random event the settings pay for, or null when every value is off. Follows play only when
 * the setup page has a Senchabot connection; its preview URL leaves `follow` at 0 without one.
 */
function simulatedEvent(values: HudValues, only?: SubathonPlatform): HudEvent | null {
  const platform = only ?? pick<SubathonPlatform>(['twitch', 'kick']);
  const name = pick(SIM_NAMES);
  const events: HudEvent[] = [
    { kind: 'sub', platform, name, tier: 1 },
    { kind: 'sub', platform, name, tier: 1 },
    { kind: 'gift', platform, name, tier: 1, count: pick([1, 3, 5]) },
    { kind: 'bits', platform, name, amount: pick([100, 250, 500]) },
    { kind: 'raid', platform, name, viewers: pick([12, 35, 80]) },
    { kind: 'follow', platform, name },
  ];
  const paying = events.filter((event) => eventMoney(event, values) > 0);
  return paying.length > 0 ? pick(paying) : null;
}

interface UseIrlHudOptions {
  twitch?: string;
  kick?: string;
  /** A Senchabot connection, which brings follows in; chat never shows them. */
  token?: string;
  start: number;
  values: HudValues;
  /** Saved places, which !hud map can switch the mini-map to. */
  places: HudPlace[];
  /** The URL's starting mini-map (see startKey); a choice made over another one is dropped. */
  startMap: string;
  /** The URL's starting movement; a chat choice made over another one is dropped. */
  startMove: HudMove;
  /** The market, for !hud buy. */
  items: HudItem[];
  /** What moves the arrow; a real place can only go indoors when it's GPS. */
  arrowSource?: ArrowSource;
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
  token,
  start,
  values,
  places,
  startMap,
  startMove,
  items,
  arrowSource = 'walk',
  simulate = false,
  simPlatform,
  previewId,
}: UseIrlHudOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const settingsRef = useRef({ start, values, places, startMap, startMove, items, arrowSource });
  settingsRef.current = { start, values, places, startMap, startMove, items, arrowSource };
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

  const pop = useCallback(
    (amount: number, name: string, platform: SubathonPlatform, declined = false) => {
      const id = ++nextId.current;
      setPops((list) => [
        ...list.slice(-(MAX_POPS - 1)),
        { id, amount, name, platform, ...(declined ? { declined } : {}) },
      ]);
      window.setTimeout(() => setPops((list) => list.filter((item) => item.id !== id)), POP_MS);
    },
    [],
  );

  const handleEvent = useCallback(
    (event: HudEvent) => {
      const current = settingsRef.current;
      if (event.kind === 'mod') {
        const part = parseToggleCommand(event.text);
        if (part) {
          commit({ ...stateRef.current, hidden: togglePart(stateRef.current.hidden, part) });
          return;
        }
        const indoor = parseIndoorCommand(event.text);
        if (indoor !== null) {
          // Where the arrow can't go indoors (a walked real place), the command does nothing.
          const map = mapNow(stateRef.current.map, current.places, current.startMap);
          if (!indoor || canGoIndoors(map, current.arrowSource))
            commit({ ...stateRef.current, indoor });
          return;
        }
        const move = parseMoveCommand(event.text);
        if (move) {
          commit({ ...stateRef.current, move: { choice: move, from: current.startMove } });
          return;
        }
        const purchase = parseBuyCommand(event.text, current.items);
        if (purchase) {
          const label =
            // A plain x: the HUD's font has no ×.
            purchase.count > 1 ? `${purchase.item.name} x${purchase.count}` : purchase.item.name;
          const wallet = stateRef.current;
          // Like a shop: without the cash for it, nothing is bought, and the price shows refused.
          if (wallet.money < purchase.total) {
            pop(-purchase.total, label, event.platform, true);
            return;
          }
          commit({ ...wallet, money: clampMoney(wallet.money - purchase.total) });
          pop(-purchase.total, label, event.platform);
          return;
        }
        const choice = parseMapCommand(event.text);
        // Going to a map the arrow can't be indoors on (a walked real place) leaves the building.
        const outdoors = (map: HudMap) =>
          canGoIndoors(map, current.arrowSource) ? {} : { indoor: false };
        if (choice === MAP_RESET) {
          const map = mapNow(undefined, current.places, current.startMap);
          commit({ ...stateRef.current, map: undefined, ...outdoors(map) });
          return;
        }
        if (choice !== null) {
          // A word that names no saved place or made-up map is ignored, like a typo.
          const view = chosenView(choice, current.places);
          if (view)
            commit({
              ...stateRef.current,
              map: { choice, from: current.startMap },
              ...outdoors(view.map),
            });
          return;
        }
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
  useFollows(token, twitch || kick, !simulate, handleEvent);

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

  // A choice made over another starting map no longer applies once the URL changed it.
  const mapChoice = state.map?.from === startMap ? state.map.choice : null;
  // Saved in OBS, so checked: only a known movement over the URL's current one applies.
  const savedMove = state.move?.from === startMove ? state.move.choice : null;
  const moveChoice = HUD_MOVES.find((move) => move === savedMove) ?? null;
  return {
    money: state.money,
    pops,
    mapChoice,
    move: moveChoice ?? startMove,
    indoor: state.indoor === true,
    hidden: state.hidden ?? [],
  };
}
