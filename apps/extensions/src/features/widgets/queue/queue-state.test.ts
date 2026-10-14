import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_QUEUE_SETTINGS } from '#/lib/queue-url';
import type { ViewerMessage } from '../viewer-chat/viewer-chat';
import {
  applyChat,
  emptyQueue,
  loadQueue,
  NOTE_MAX_LENGTH,
  type QueueState,
  storageKey,
} from './queue-state';

const rules = DEFAULT_QUEUE_SETTINGS;
const say = (
  name: string,
  text: string,
  overrides: Partial<ViewerMessage> = {},
): ViewerMessage => ({
  kind: 'message',
  platform: 'twitch',
  login: name.toLowerCase(),
  name,
  text,
  mod: false,
  broadcaster: false,
  sub: false,
  aside: false,
  bot: false,
  ...overrides,
});
const run = (state: QueueState, ...messages: ViewerMessage[]) =>
  messages.reduce((current, message) => applyChat(current, message, rules), state);
const names = (list: { name: string }[]) => list.map((entry) => entry.name);

describe('applyChat', () => {
  it('lines viewers up in order, once each, with their note', () => {
    const state = run(
      emptyQueue(),
      say('A', '!join'),
      say('B', '!JOIN Steve the Builder'),
      say('A', '!join again'),
    );
    expect(names(state.waiting)).toEqual(['A', 'B']);
    expect(state.waiting[1].note).toBe('Steve the Builder');
  });

  it('cuts long notes and lets the same name on another platform in', () => {
    const long = 'x'.repeat(NOTE_MAX_LENGTH + 10);
    const state = run(
      emptyQueue(),
      say('A', `!join ${long}`),
      say('A', '!join', { platform: 'kick' }),
    );
    expect(state.waiting[0].note).toHaveLength(NOTE_MAX_LENGTH);
    expect(state.waiting).toHaveLength(2);
  });

  it('calls viewers up with !next, the group size or a number', () => {
    let state = run(emptyQueue(), ...['A', 'B', 'C', 'D'].map((name) => say(name, '!join')));
    state = run(state, say('Mod', '!next', { mod: true }));
    expect(names(state.playing)).toEqual(['A']);
    expect(names(state.waiting)).toEqual(['B', 'C', 'D']);
    state = run(state, say('Mod', '!next 2', { mod: true }));
    expect(names(state.playing)).toEqual(['B', 'C']);
    // A viewer's !next, a reply and nonsense change nothing.
    state = run(
      state,
      say('V', '!next'),
      say('Mod', '!next', { mod: true, aside: true }),
      say('Mod', '!next lots', { mod: true }),
    );
    expect(names(state.waiting)).toEqual(['D']);
    const grouped = applyChat(state, say('Mod', '!next', { mod: true }), { ...rules, group: 5 });
    expect(names(grouped.playing)).toEqual(['D']);
  });

  it('lets viewers leave and mods remove, close, open and clear', () => {
    let state = run(emptyQueue(), say('A', '!join'), say('B', '!join'), say('C', '!join'));
    state = run(state, say('A', '!leave'), say('Mod', '!queue remove @c', { mod: true }));
    expect(names(state.waiting)).toEqual(['B']);
    state = run(state, say('Mod', '!queue close', { mod: true }), say('D', '!join'));
    expect(state.open).toBe(false);
    expect(names(state.waiting)).toEqual(['B']);
    state = run(
      state,
      say('Mod', '!QUEUE open', { mod: true }),
      say('Mod', '!queue clear', { mod: true }),
    );
    expect(state).toEqual({ open: true, waiting: [], playing: [] });
  });

  it('keeps to subscribers and the limit when asked, and drops bots and banned viewers', () => {
    const strict = { ...rules, subsOnly: true, max: 1 };
    let state = applyChat(emptyQueue(), say('A', '!join'), strict);
    state = applyChat(state, say('B', '!join', { sub: true }), strict);
    state = applyChat(state, say('C', '!join', { sub: true }), strict);
    expect(names(state.waiting)).toEqual(['B']);
    state = run(state, say('Nightbot', '!join', { bot: true }));
    expect(names(state.waiting)).toEqual(['B']);
    state = applyChat(state, { kind: 'ban', platform: 'twitch', login: 'b' }, rules);
    expect(state.waiting).toEqual([]);
  });

  it('uses the join word from the settings', () => {
    const custom = { ...rules, join: '!play' };
    const state = applyChat(
      applyChat(emptyQueue(), say('A', '!join'), custom),
      say('B', '!play'),
      custom,
    );
    expect(names(state.waiting)).toEqual(['B']);
  });
});

describe('loadQueue', () => {
  afterEach(() => localStorage.clear());

  it('reads back a saved queue and starts a fresh one on garbage', () => {
    const key = storageKey('Streamer', 'Kicker');
    expect(key).toBe('senchabot.queue:streamer:kicker');
    const saved = {
      open: false,
      waiting: [{ platform: 'kick', login: 'a', name: 'A', note: '' }, { bad: 1 }],
      playing: [],
    };
    localStorage.setItem(key, JSON.stringify(saved));
    expect(loadQueue(key)).toEqual({ ...saved, waiting: [saved.waiting[0]] });
    localStorage.setItem(key, '"nope"');
    expect(loadQueue(key)).toEqual(emptyQueue());
    expect(loadQueue(null)).toEqual(emptyQueue());
  });
});
