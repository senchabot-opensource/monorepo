import { describe, expect, it } from 'vitest';
import type { FeaturedMode } from '#/lib/featured-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import {
  applyChat,
  cutKickText,
  emptyState,
  expire,
  type FeaturedChatEvent,
  type FeaturedMessage,
  type FeaturedState,
  findLastMessage,
  loadState,
  QUESTION_MAX_LENGTH,
  QUESTIONS_MAX,
  RECENT_MAX,
  savedState,
  sliceTwitchText,
  storageKey,
} from './featured-state';

let nextId = 0;
const say = (
  name: string,
  text: string,
  options: Partial<FeaturedMessage> & { platform?: SubathonPlatform } = {},
): FeaturedMessage => {
  nextId++;
  return {
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
    id: `m${nextId}`,
    badges: [],
    display: text,
    ...options,
  };
};
const mod = (text: string, platform: SubathonPlatform = 'twitch') =>
  say('Mod', text, { mod: true, platform });

const play = (events: FeaturedChatEvent[], mode: FeaturedMode = 'both', start = emptyState()) =>
  events.reduce<FeaturedState>(
    (state, event, index) => applyChat(state, event, mode, index),
    start,
  );
const questions = (state: FeaturedState) => state.questions.map((line) => line.message);

describe('the last message of each chatter', () => {
  it('keeps one per chatter and platform, newest last', () => {
    const state = play([
      say('Alpha', 'first'),
      say('Beta', 'hello'),
      say('Alpha', 'second'),
      say('Alpha', 'from kick', { platform: 'kick' }),
    ]);
    expect(state.recent.map((line) => [line.platform, line.login, line.message])).toEqual([
      ['twitch', 'beta', 'hello'],
      ['twitch', 'alpha', 'second'],
      ['kick', 'alpha', 'from kick'],
    ]);
  });

  it('skips bots, replies and commands', () => {
    const state = play([
      say('Nightbot', 'Follow the channel!', { bot: true }),
      say('Alpha', '@beta it is !join', { aside: true }),
      say('Gamma', '!join'),
    ]);
    expect(state.recent).toEqual([]);
  });

  it('forgets the quietest chatter past the cap', () => {
    const events = Array.from({ length: RECENT_MAX + 1 }, (_, index) => say(`v${index}`, 'hi'));
    const state = play(events);
    expect(state.recent).toHaveLength(RECENT_MAX);
    expect(state.recent[0].login).toBe('v1');
  });

  it('keeps what draws the message: color, badges and emotes', () => {
    const state = play([
      say('Alpha', 'hi Kappa', { color: '#FF0000', badges: ['vip/1'], emotes: '25:3-7' }),
    ]);
    expect(state.recent[0]).toEqual({
      id: expect.any(String),
      platform: 'twitch',
      login: 'alpha',
      name: 'Alpha',
      color: '#FF0000',
      badges: ['vip/1'],
      message: 'hi Kappa',
      emotes: '25:3-7',
    });
  });
});

describe('!feature', () => {
  it('puts a viewer’s last message up for a mod, by name with or without @, in any case', () => {
    const chat = [say('Alpha', 'old'), say('Alpha', 'latest'), say('Beta', 'hi')];
    for (const command of ['!feature @Alpha', '!feature alpha', '!FEATURE @ALPHA']) {
      const state = play([...chat, mod(command)]);
      expect(state.shown).toMatchObject({ kind: 'feature', name: 'Alpha', message: 'latest' });
    }
  });

  it('finds a viewer by display name as well as login', () => {
    const state = play([
      say('お命頂戴', 'こんにちは', { login: 'oinotityoudai' }),
      mod('!feature お命頂戴'),
    ]);
    expect(state.shown?.message).toBe('こんにちは');
  });

  it('takes the newest message when the name chats on both platforms', () => {
    const twitchFirst = play([
      say('Same', 'on twitch'),
      say('Same', 'on kick', { platform: 'kick' }),
      mod('!feature @same'),
    ]);
    expect(twitchFirst.shown).toMatchObject({ platform: 'kick', message: 'on kick' });
    const kickFirst = play([
      say('Same', 'on kick', { platform: 'kick' }),
      say('Same', 'on twitch'),
      mod('!feature @same', 'kick'),
    ]);
    expect(kickFirst.shown).toMatchObject({ platform: 'twitch', message: 'on twitch' });
  });

  it('ignores viewers, and names that never chatted', () => {
    expect(play([say('Alpha', 'hi'), say('Beta', '!feature @alpha')]).shown).toBeNull();
    expect(play([say('Alpha', 'hi'), mod('!feature @nobody')]).shown).toBeNull();
  });

  it('hides what is up with !feature alone or !feature off', () => {
    const up = play([say('Alpha', 'hi'), mod('!feature @alpha')]);
    expect(applyChat(up, mod('!feature'), 'both', 9).shown).toBeNull();
    expect(applyChat(up, mod('!feature off'), 'both', 9).shown).toBeNull();
  });

  it('starts the hide timer again when a mod features the same message twice', () => {
    const state = play([say('Alpha', 'hi'), mod('!feature @alpha'), mod('!feature @alpha')]);
    expect(state.shown?.at).toBe(2);
  });
});

describe('!q', () => {
  it('lines questions up, without the command, one open question per viewer', () => {
    const state = play([
      say('Alpha', '!q what game is next?'),
      say('Beta', '!Q favorite snack?'),
      say('Alpha', '!q what keyboard do you use?'),
    ]);
    expect(questions(state)).toEqual(['what keyboard do you use?', 'favorite snack?']);
    expect(state.recent).toEqual([]);
  });

  it('ignores an empty question, and a viewer typing a mod word', () => {
    expect(play([say('Alpha', '!q'), say('Beta', '!q next')]).questions).toEqual([]);
  });

  it('cuts a long question with an ellipsis', () => {
    const long = 'a'.repeat(QUESTION_MAX_LENGTH + 50);
    const [line] = play([say('Alpha', `!q ${long}`)]).questions;
    expect([...line.message]).toHaveLength(QUESTION_MAX_LENGTH + 1);
    expect(line.message.endsWith('…')).toBe(true);
  });

  it('stops taking questions at the cap', () => {
    const events = Array.from({ length: QUESTIONS_MAX + 5 }, (_, index) =>
      say(`v${index}`, '!q hi'),
    );
    expect(play(events).questions).toHaveLength(QUESTIONS_MAX);
  });

  it('moves Twitch emote positions with the question and keeps Kick emote codes', () => {
    const [twitch] = play([say('Alpha', '!q is Kappa real', { emotes: '25:6-10' })]).questions;
    expect(twitch).toMatchObject({ message: 'is Kappa real', emotes: '25:3-7' });
    const [kick] = play([
      say('Beta', '!q LULW why', { platform: 'kick', display: '!q [emote:37227:LULW] why' }),
    ]).questions;
    expect(kick.message).toBe('[emote:37227:LULW] why');
  });

  it('lets mods show the next question, skip one, clear them and hide what is up', () => {
    const asked = play([say('A', '!q one'), say('B', '!q two'), say('C', '!q three')]);
    const next = applyChat(asked, mod('!q next'), 'both', 10);
    expect(next.shown).toMatchObject({ kind: 'question', message: 'one', at: 10 });
    expect(questions(next)).toEqual(['two', 'three']);
    const skipped = applyChat(next, mod('!q skip'), 'both', 11);
    expect(questions(skipped)).toEqual(['three']);
    expect(skipped.shown?.message).toBe('one');
    const cleared = applyChat(skipped, mod('!q clear'), 'both', 12);
    expect(cleared.questions).toEqual([]);
    expect(applyChat(cleared, mod('!q off'), 'both', 13).shown).toBeNull();
  });

  it('takes the answered question down on !q next with none left, but not a featured message', () => {
    const answered = play([say('A', '!q one'), mod('!q next'), mod('!q next')]);
    expect(answered.shown).toBeNull();
    const featured = play([say('A', 'hello'), mod('!feature @a'), mod('!q next')]);
    expect(featured.shown?.kind).toBe('feature');
  });

  it('ignores mod words from viewers', () => {
    const asked = play([say('A', '!q one')]);
    expect(applyChat(asked, say('B', '!q next'), 'both', 5)).toBe(asked);
    expect(applyChat(asked, say('B', '!q clear'), 'both', 5)).toBe(asked);
  });
});

describe('modes', () => {
  it('turns !q off in feature mode', () => {
    const state = play([say('A', '!q one'), say('B', 'hi'), mod('!feature @b')], 'feature');
    expect(state.questions).toEqual([]);
    expect(state.shown?.message).toBe('hi');
  });

  it('turns !feature off in Q&A mode, and remembers no chat', () => {
    const state = play([say('B', 'hi'), mod('!feature @b'), say('A', '!q one')], 'qa');
    expect(state.recent).toEqual([]);
    expect(state.shown).toBeNull();
    expect(questions(state)).toEqual(['one']);
  });
});

describe('moderation', () => {
  it('takes a banned viewer’s message, questions and screen time away', () => {
    const state = play([
      say('Alpha', 'hi'),
      say('Alpha', '!q question'),
      say('Beta', '!q other'),
      mod('!feature @alpha'),
      { kind: 'ban', platform: 'twitch', login: 'alpha' },
    ]);
    expect(state.recent.map((line) => line.login)).toEqual([]);
    expect(questions(state)).toEqual(['other']);
    expect(state.shown).toBeNull();
  });

  it('only bans on the platform it happened on', () => {
    const state = play([
      say('Alpha', 'kick side', { platform: 'kick' }),
      { kind: 'ban', platform: 'twitch', login: 'alpha' },
    ]);
    expect(state.recent).toHaveLength(1);
  });

  it('takes a deleted message off the screen and out of the questions', () => {
    const hi = say('Alpha', 'hi');
    const question = say('Beta', '!q oops');
    const up = play([hi, question, mod('!feature @alpha')]);
    const deleted = play(
      [
        { kind: 'delete', platform: 'twitch', id: hi.id },
        { kind: 'delete', platform: 'twitch', id: question.id },
      ],
      'both',
      up,
    );
    expect(deleted.shown).toBeNull();
    expect(deleted.recent).toEqual([]);
    expect(deleted.questions).toEqual([]);
  });

  it('keeps the same state for a ban of a viewer it never saw', () => {
    const state = play([say('Alpha', 'hi')]);
    expect(applyChat(state, { kind: 'ban', platform: 'kick', login: 'zed' }, 'both', 1)).toBe(
      state,
    );
  });
});

describe('expire', () => {
  it('hides what is up, unless something newer went up meanwhile', () => {
    const up = play([say('A', 'one'), say('B', 'two'), mod('!feature @a')]);
    const shown = up.shown;
    if (!shown) throw new Error('nothing up');
    expect(expire(up, shown).shown).toBeNull();
    const replaced = applyChat(up, mod('!feature @b'), 'both', 10);
    expect(expire(replaced, shown)).toBe(replaced);
  });
});

describe('text cutting', () => {
  it('cuts Twitch text without splitting an emote', () => {
    expect(sliceTwitchText('ab Kappa cd', '25:3-7', 0, 5)).toEqual({ message: 'ab…' });
    expect(sliceTwitchText('ab Kappa cd', '25:3-7', 0, 9)).toEqual({
      message: 'ab Kappa…',
      emotes: '25:3-7',
    });
  });

  it('counts Kick emotes by their names and drops one the cut would split', () => {
    expect(cutKickText('hi [emote:1:LULW] there', 7)).toBe('hi [emote:1:LULW]…');
    expect(cutKickText('hi [emote:1:LULW] there', 5)).toBe('hi…');
    expect(cutKickText('short', 50)).toBe('short');
  });
});

describe('findLastMessage', () => {
  it('needs a name', () => {
    expect(findLastMessage(play([say('A', 'x')]).recent, '@')).toBeNull();
  });
});

describe('storage', () => {
  it('saves the questions and what is up, not the chat', () => {
    const state = play([say('A', 'hi'), say('B', '!q one'), say('C', '!q two'), mod('!q next')]);
    const key = storageKey(' Streamer ', 'Kicker');
    expect(key).toBe('senchabot.featured:streamer:kicker');
    localStorage.setItem(key, savedState(state));
    const loaded = loadState(key);
    expect(loaded.recent).toEqual([]);
    expect(questions(loaded)).toEqual(['two']);
    expect(loaded.shown).toMatchObject({ kind: 'question', message: 'one' });
  });

  it('starts empty from nothing or garbage', () => {
    expect(loadState(null)).toEqual(emptyState());
    localStorage.setItem('k', '{not json');
    expect(loadState('k')).toEqual(emptyState());
    localStorage.setItem('k', JSON.stringify({ questions: [{ id: 1 }], shown: { kind: 'x' } }));
    expect(loadState('k')).toEqual(emptyState());
  });
});
