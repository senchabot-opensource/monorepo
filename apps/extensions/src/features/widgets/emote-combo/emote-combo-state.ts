import type { MessageEmote } from '../emote-wall/emote-utils';
import type { SubathonPlatform } from '../subathon/subathon-events';

/**
 * Emote combos: when chatters post the same emote one after another, it's a combo, counted once
 * per chatter.
 *
 * - A message counts for every emote it contains, emote-only or not, once each. 7TV, BTTV and FFZ
 *   emotes are counted by name, so the same 7TV emote in Twitch and Kick chat makes one combo;
 *   a platform's own emotes are counted by id on that platform.
 * - A chatter (platform and login) counts once per combo: sending it again, the broadcaster
 *   included, neither adds to the count nor keeps the combo going. Known bots never count.
 * - The combo goes on while a new chatter joins within `window` of the last one, and shows once
 *   `min` chatters are in. When the window runs out it shows its final count for FINALE_MS, then
 *   it's gone.
 * - With two combos going, the bigger one is on screen; on a tie, the one that got there first
 *   stays, so the screen doesn't flicker between them.
 * - The best combo of the stream is kept and saved. A mod or the broadcaster clears it with
 *   `!combo reset`; it also starts over after NEW_STREAM_HOURS without a combo.
 */

export const COMBO_COMMAND = '!combo';
export const RESET_WORD = 'reset';
/** How long a finished combo stays up with its final count, fade included. */
export const FINALE_MS = 3000;
/** A best combo set more than this long ago belongs to another stream. */
export const NEW_STREAM_HOURS = 12;
const NEW_STREAM_MS = NEW_STREAM_HOURS * 3_600_000;
/** Emotes counted at once; past it the one that went longest without a new chatter makes room. */
export const MAX_RUNNING = 200;

export interface Combo {
  emote: MessageEmote;
  /** `platform:login` of everyone counted. */
  chatters: ReadonlySet<string>;
  startedAt: number;
  /** When the last new chatter joined; the combo ends `window` after it. */
  lastAt: number;
}

export interface BestCombo {
  emote: MessageEmote;
  count: number;
  /** Tells the best combo's own run apart from a later combo of the same emote. */
  startedAt: number;
}

export interface ComboState {
  /** Every emote being counted, shown or not yet. */
  running: Combo[];
  /** The last combo that ended big enough to show, up with its final count until FINALE_MS. */
  finale: { combo: Combo; endedAt: number } | null;
  best: BestCombo | null;
  /** When a combo last reached the minimum; the best is dropped NEW_STREAM_HOURS after it. */
  updatedAt: number;
}

export interface ComboRules {
  windowMs: number;
  min: number;
}

/** A chat message, reduced to what combos need. */
export interface ComboChat {
  platform: SubathonPlatform;
  /** Lowercase login, which tells chatters apart. */
  login: string;
  /** A moderator or the broadcaster. */
  mod: boolean;
  /** Nightbot, StreamElements and the like. */
  bot: boolean;
  /** A reply: emotes in it count, but it's never a command. */
  aside: boolean;
  text: string;
  emotes: readonly MessageEmote[];
}

export const emptyCombos = (now = 0): ComboState => ({
  running: [],
  finale: null,
  best: null,
  updatedAt: now,
});

export const comboCount = (combo: Combo) => combo.chatters.size;

/**
 * The state at `now`: combos whose window ran out end, and a finale whose time is up goes. Of
 * the combos that end, the biggest one that reached the minimum becomes the finale, unless the
 * one still up is bigger.
 */
export function expireCombos(state: ComboState, rules: ComboRules, now: number): ComboState {
  const ended = state.running.filter((combo) => now - combo.lastAt >= rules.windowMs);
  let finale = state.finale && now - state.finale.endedAt < FINALE_MS ? state.finale : null;
  if (ended.length === 0 && finale === state.finale) return state;
  for (const combo of ended) {
    if (comboCount(combo) < rules.min) continue;
    if (!finale || comboCount(combo) >= comboCount(finale.combo)) finale = { combo, endedAt: now };
  }
  return {
    ...state,
    running: ended.length ? state.running.filter((combo) => !ended.includes(combo)) : state.running,
    finale,
  };
}

/** Ends every combo now, as if their windows had run out. The preview uses it between rounds. */
export const endAllCombos = (state: ComboState, rules: ComboRules, now: number): ComboState =>
  expireCombos(state, { ...rules, windowMs: 0 }, now);

/** True for `!combo reset`, in any case. */
export function isResetCommand(text: string): boolean {
  const words = text.trim().toLowerCase().split(/\s+/);
  return words.length === 2 && words[0] === COMBO_COMMAND && words[1] === RESET_WORD;
}

/** The state after one chat message at `now`. */
export function applyComboChat(
  state: ComboState,
  chat: ComboChat,
  rules: ComboRules,
  now: number,
): ComboState {
  let next = expireCombos(state, rules, now);
  // OBS can run the same source for days: a best from an earlier stream goes.
  if (next.best && now - next.updatedAt > NEW_STREAM_MS) next = { ...next, best: null };
  if (chat.bot) return next;
  if (!chat.aside && isResetCommand(chat.text)) {
    return chat.mod && next.best ? { ...next, best: null } : next;
  }
  if (chat.emotes.length === 0) return next;

  const who = `${chat.platform}:${chat.login}`;
  let running = next.running;
  const counted: Combo[] = [];
  for (const emote of chat.emotes) {
    const at = running.findIndex((combo) => combo.emote.key === emote.key);
    if (at >= 0) {
      const combo = running[at];
      if (combo.chatters.has(who)) continue;
      const grown = { ...combo, chatters: new Set(combo.chatters).add(who), lastAt: now };
      running = running.map((entry, i) => (i === at ? grown : entry));
      counted.push(grown);
    } else {
      if (running.length >= MAX_RUNNING) running = withoutStalest(running);
      const started = { emote, chatters: new Set([who]), startedAt: now, lastAt: now };
      running = [...running, started];
      counted.push(started);
    }
  }
  if (counted.length === 0) return next;

  let { best, updatedAt } = next;
  for (const combo of counted) {
    const count = comboCount(combo);
    if (count < rules.min) continue;
    updatedAt = now;
    if (!best || count > best.count) {
      best = { emote: combo.emote, count, startedAt: combo.startedAt };
    }
  }
  return { ...next, running, best, updatedAt };
}

function withoutStalest(running: Combo[]): Combo[] {
  let stalest = 0;
  for (let i = 1; i < running.length; i++) {
    if (running[i].lastAt < running[stalest].lastAt) stalest = i;
  }
  return running.filter((_, i) => i !== stalest);
}

const isBestRun = (best: BestCombo, combo: Combo) =>
  best.emote.key === combo.emote.key && best.startedAt === combo.startedAt;

export interface ShownCombo {
  combo: Combo;
  count: number;
  /** Its window ran out: the final count, about to fade. */
  ended: boolean;
  /** It's the stream's best combo. */
  record: boolean;
}

/** The combo on screen: the biggest that reached the minimum, or null. */
export function shownCombo(state: ComboState, min: number): ShownCombo | null {
  const candidates = state.running
    .filter((combo) => comboCount(combo) >= min)
    .map((combo) => ({ combo, ended: false }));
  if (state.finale) candidates.push({ combo: state.finale.combo, ended: true });
  let shown: (typeof candidates)[number] | null = null;
  for (const candidate of candidates) {
    const count = comboCount(candidate.combo);
    if (
      !shown ||
      count > comboCount(shown.combo) ||
      (count === comboCount(shown.combo) && candidate.combo.lastAt < shown.combo.lastAt)
    ) {
      shown = candidate;
    }
  }
  if (!shown) return null;
  const { best } = state;
  return {
    ...shown,
    count: comboCount(shown.combo),
    record: Boolean(best && isBestRun(best, shown.combo)),
  };
}

/** Storage key per channel pair, so every Emote Combo source for the channel shares one best. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.emote-combo:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

const isEmote = (value: unknown): value is MessageEmote => {
  if (!value || typeof value !== 'object') return false;
  const emote = value as Record<string, unknown>;
  return (
    typeof emote.key === 'string' && typeof emote.name === 'string' && typeof emote.url === 'string'
  );
};

/**
 * The saved best combo in a fresh state, or none when there is none, it's garbage, or it's from
 * a stream more than NEW_STREAM_HOURS ago.
 */
export function loadCombos(key: string | null, now: number): ComboState {
  if (!key) return emptyCombos(now);
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null') as Record<
      string,
      unknown
    > | null;
    if (!saved || typeof saved.updatedAt !== 'number') return emptyCombos(now);
    if (now - saved.updatedAt > NEW_STREAM_MS) return emptyCombos(now);
    const best = saved.best as Record<string, unknown> | null;
    if (
      !best ||
      !isEmote(best.emote) ||
      typeof best.count !== 'number' ||
      typeof best.startedAt !== 'number'
    ) {
      return emptyCombos(now);
    }
    return {
      ...emptyCombos(saved.updatedAt),
      best: {
        emote: { key: best.emote.key, name: best.emote.name, url: best.emote.url },
        count: Math.max(0, Math.round(best.count)),
        startedAt: best.startedAt,
      },
    };
  } catch {
    return emptyCombos(now);
  }
}
