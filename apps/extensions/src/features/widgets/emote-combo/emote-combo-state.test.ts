import { afterEach, describe, expect, it } from 'vitest';
import type { MessageEmote } from '../emote-wall/emote-utils';
import {
  applyComboChat,
  type ComboChat,
  type ComboState,
  emptyCombos,
  endAllCombos,
  expireCombos,
  FINALE_MS,
  isResetCommand,
  loadCombos,
  MAX_RUNNING,
  NEW_STREAM_HOURS,
  shownCombo,
  storageKey,
} from './emote-combo-state';

const RULES = { windowMs: 8000, min: 3 };
const KAPPA: MessageEmote = { key: 'twitch:25', name: 'Kappa', url: 'https://k/25' };
const PEPE: MessageEmote = { key: 'name:PepePls', name: 'PepePls', url: 'https://7tv/pepe' };
const KEKW: MessageEmote = { key: 'kick:37226', name: 'KEKW', url: 'https://kick/37226' };

const chat = (
  login: string,
  emotes: MessageEmote[],
  extra: Partial<ComboChat> = {},
): ComboChat => ({
  platform: 'twitch',
  login,
  mod: false,
  bot: false,
  aside: false,
  text: emotes.map((emote) => emote.name).join(' '),
  emotes,
  ...extra,
});

/** Messages one second apart from t=0, unless they name their own time. */
function play(
  messages: (ComboChat | [at: number, chat: ComboChat])[],
  state: ComboState = emptyCombos(),
  rules = RULES,
) {
  return messages.reduce<ComboState>((current, message, index) => {
    const [at, next] = Array.isArray(message) ? message : [index * 1000, message];
    return applyComboChat(current, next, rules, at);
  }, state);
}

const shown = (state: ComboState, min = RULES.min) => {
  const combo = shownCombo(state, min);
  return combo && { emote: combo.combo.emote.name, count: combo.count, ended: combo.ended };
};

afterEach(() => {
  localStorage.clear();
});

describe('applyComboChat', () => {
  it('counts each chatter once and shows the combo from the minimum on', () => {
    let state = play([chat('a', [KAPPA]), chat('b', [KAPPA])]);
    expect(shown(state)).toBeNull();
    state = play([chat('a', [KAPPA]), chat('a', [KAPPA]), chat('b', [KAPPA]), chat('c', [KAPPA])]);
    expect(shown(state)).toEqual({ emote: 'Kappa', count: 3, ended: false });
  });

  it('counts a message with the emote in a sentence, once however often it repeats', () => {
    const state = play([
      chat('a', [KAPPA], { text: 'that was Kappa Kappa Kappa' }),
      chat('b', [KAPPA, PEPE]),
      chat('c', [KAPPA]),
    ]);
    expect(shown(state)?.count).toBe(3);
  });

  it('tells the same login on Twitch and Kick apart', () => {
    const state = play([
      chat('same', [PEPE]),
      chat('same', [PEPE], { platform: 'kick' }),
      chat('other', [PEPE], { platform: 'kick' }),
    ]);
    expect(shown(state)?.count).toBe(3);
  });

  it('makes one combo of a 7TV emote from both chats, and keeps native emotes apart', () => {
    const state = play([
      chat('a', [PEPE]),
      chat('b', [PEPE], { platform: 'kick' }),
      chat('c', [PEPE]),
      chat('d', [KEKW], { platform: 'kick' }),
    ]);
    expect(state.running.map((combo) => [combo.emote.key, combo.chatters.size])).toEqual([
      ['name:PepePls', 3],
      ['kick:37226', 1],
    ]);
  });

  it('never counts bots, and the broadcaster only once', () => {
    const state = play([
      chat('nightbot', [KAPPA], { bot: true }),
      chat('streamer', [KAPPA], { mod: true }),
      chat('streamer', [KAPPA], { mod: true }),
      chat('streamer', [KAPPA], { mod: true }),
      chat('viewer', [KAPPA]),
    ]);
    expect(state.running[0].chatters.size).toBe(2);
    expect(shown(state)).toBeNull();
  });

  it('goes on while new chatters join within the window, and starts over after it', () => {
    const state = play([
      [0, chat('a', [KAPPA])],
      [7000, chat('b', [KAPPA])],
      [14_500, chat('c', [KAPPA])],
      // 8 s after c: too late, a fresh combo starts.
      [22_500, chat('d', [KAPPA])],
    ]);
    expect(state.running).toHaveLength(1);
    expect(state.running[0].chatters.size).toBe(1);
    expect(state.running[0].startedAt).toBe(22_500);
  });

  it('keeps the window from being stretched by a chatter who is already in', () => {
    const state = play([
      [0, chat('a', [KAPPA])],
      [5000, chat('a', [KAPPA])],
      [9000, chat('b', [KAPPA])],
    ]);
    expect(state.running[0].chatters.size).toBe(1);
    expect(state.running[0].startedAt).toBe(9000);
  });
});

describe('expireCombos', () => {
  const three = () => play([chat('a', [KAPPA]), chat('b', [KAPPA]), chat('c', [KAPPA])]);

  it('shows the final count once the window runs out, then lets it go', () => {
    const state = three();
    expect(expireCombos(state, RULES, 9999)).toBe(state);
    const ended = expireCombos(state, RULES, 10_000);
    expect(ended.running).toEqual([]);
    expect(shown(ended)).toEqual({ emote: 'Kappa', count: 3, ended: true });
    expect(expireCombos(ended, RULES, 10_000 + FINALE_MS - 1)).toBe(ended);
    expect(shown(expireCombos(ended, RULES, 10_000 + FINALE_MS))).toBeNull();
  });

  it('lets a combo under the minimum go without a finale', () => {
    const state = play([chat('a', [KAPPA]), chat('b', [KAPPA])]);
    const ended = expireCombos(state, RULES, 60_000);
    expect(ended.running).toEqual([]);
    expect(ended.finale).toBeNull();
  });

  it('ends everything at once for the preview', () => {
    const state = endAllCombos(three(), RULES, 2500);
    expect(state.running).toEqual([]);
    expect(shown(state)).toEqual({ emote: 'Kappa', count: 3, ended: true });
  });
});

describe('shownCombo', () => {
  it('shows the bigger of two combos, and the first to a count on a tie', () => {
    let state = play([
      chat('a', [KAPPA]),
      chat('b', [KAPPA]),
      chat('c', [KAPPA]),
      chat('d', [PEPE]),
      chat('e', [PEPE]),
      chat('f', [PEPE]),
    ]);
    expect(shown(state)?.emote).toBe('Kappa');
    state = applyComboChat(state, chat('g', [PEPE]), RULES, 6000);
    expect(shown(state)).toEqual({ emote: 'PepePls', count: 4, ended: false });
    state = applyComboChat(state, chat('h', [KAPPA]), RULES, 6500);
    expect(shown(state)?.emote).toBe('PepePls');
  });

  it('keeps a bigger finale up over a smaller combo still going', () => {
    let state = play([
      [0, chat('a', [KAPPA])],
      [100, chat('b', [KAPPA])],
      [200, chat('c', [KAPPA])],
      [300, chat('d', [KAPPA])],
      [5000, chat('e', [PEPE])],
      [5100, chat('f', [PEPE])],
      [5200, chat('g', [PEPE])],
    ]);
    state = expireCombos(state, RULES, 8300);
    expect(shown(state)).toEqual({ emote: 'Kappa', count: 4, ended: true });
    state = expireCombos(state, RULES, 8300 + FINALE_MS);
    expect(shown(state)).toEqual({ emote: 'PepePls', count: 3, ended: false });
  });
});

describe('the best combo', () => {
  it('keeps the biggest combo of the stream and marks it while it is on screen', () => {
    let state = play([
      chat('a', [KAPPA]),
      chat('b', [KAPPA]),
      chat('c', [KAPPA]),
      chat('d', [KAPPA]),
    ]);
    expect(state.best).toMatchObject({ emote: KAPPA, count: 4 });
    expect(shownCombo(state, RULES.min)?.record).toBe(true);
    state = expireCombos(state, RULES, 20_000);
    state = play(
      [
        // After the Kappa finale.
        [30_000, chat('e', [PEPE])],
        [30_100, chat('f', [PEPE])],
        [30_200, chat('g', [PEPE])],
      ],
      state,
    );
    expect(state.best).toMatchObject({ emote: KAPPA, count: 4 });
    expect(shownCombo(state, RULES.min)?.record).toBe(false);
  });

  it('never takes a combo under the minimum', () => {
    const state = play([chat('a', [KAPPA]), chat('b', [KAPPA])]);
    expect(state.best).toBeNull();
  });

  it('is cleared by a mod or the broadcaster with !combo reset, and only by them', () => {
    const state = play([chat('a', [KAPPA]), chat('b', [KAPPA]), chat('c', [KAPPA])]);
    const reset = (extra: Partial<ComboChat>) =>
      applyComboChat(state, chat('x', [], { text: '!combo reset', ...extra }), RULES, 3000).best;
    expect(reset({})).not.toBeNull();
    expect(reset({ mod: true, aside: true })).not.toBeNull();
    expect(reset({ mod: true })).toBeNull();
    expect(reset({ mod: true, text: '!COMBO Reset', platform: 'kick' })).toBeNull();
  });

  it('starts over after a long break, the next stream', () => {
    const state = play([chat('a', [KAPPA]), chat('b', [KAPPA]), chat('c', [KAPPA])]);
    const later = applyComboChat(
      state,
      chat('d', [PEPE]),
      RULES,
      2000 + NEW_STREAM_HOURS * 3_600_000 + 1,
    );
    expect(later.best).toBeNull();
  });
});

describe('isResetCommand', () => {
  it('reads only the exact command', () => {
    expect(isResetCommand(' !combo   reset ')).toBe(true);
    expect(isResetCommand('!combo')).toBe(false);
    expect(isResetCommand('!combo reset now')).toBe(false);
    expect(isResetCommand('!combos reset')).toBe(false);
  });
});

describe('limits', () => {
  it('makes room for a new emote by dropping the one that went longest without a chatter', () => {
    const emotes = Array.from({ length: MAX_RUNNING + 1 }, (_, i) => ({
      key: `name:E${i}`,
      name: `E${i}`,
      url: `https://e/${i}`,
    }));
    const state = emotes.reduce(
      (current, emote, i) => applyComboChat(current, chat(`u${i}`, [emote]), RULES, i),
      emptyCombos(),
    );
    expect(state.running).toHaveLength(MAX_RUNNING);
    expect(state.running.some((combo) => combo.emote.key === 'name:E0')).toBe(false);
  });
});

describe('loadCombos', () => {
  const key = storageKey('Streamer', 'Kicker');
  const save = (value: unknown) => localStorage.setItem(key, JSON.stringify(value));
  const best = { emote: KAPPA, count: 27, startedAt: 100 };

  it('keys the save by the channel pair, lowercased', () => {
    expect(key).toBe('senchabot.emote-combo:streamer:kicker');
  });

  it('brings back the best combo of the stream', () => {
    save({ best, updatedAt: 1000 });
    expect(loadCombos(key, 5000)).toEqual({ ...emptyCombos(1000), best });
  });

  it('starts fresh after NEW_STREAM_HOURS, or on garbage', () => {
    save({ best, updatedAt: 1000 });
    expect(loadCombos(key, 1001 + NEW_STREAM_HOURS * 3_600_000).best).toBeNull();
    save({ best: { emote: 'Kappa', count: 3 }, updatedAt: 1000 });
    expect(loadCombos(key, 2000).best).toBeNull();
    localStorage.setItem(key, '{oops');
    expect(loadCombos(key, 2000).best).toBeNull();
    expect(loadCombos(null, 2000)).toEqual(emptyCombos(2000));
  });
});
