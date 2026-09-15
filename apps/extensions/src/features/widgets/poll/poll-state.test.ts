import { describe, expect, it } from 'vitest';
import {
  castVote,
  cleanOptions,
  createPoll,
  endPoll,
  extendPoll,
  foldText,
  fromSaved,
  MAX_POLL_MS,
  parsePollCommand,
  parseVote,
  phaseOf,
  takesVotes,
  tally,
  toSaved,
  voterKey,
} from './poll-state';

const YES_NO = ['Yes', 'No'] as const;
const timing = { graceMs: 5000, holdMs: 30_000 };
const vote = (option: number, platform: 'twitch' | 'kick' = 'twitch', weight = 1) => ({
  option,
  weight,
  platform,
});

describe('parseVote', () => {
  const options = ['Minecraft', 'Valorant', 'Işık Oyunu'];

  it('reads a bare number, !number and !vote number', () => {
    expect(parseVote('2', options)).toBe(1);
    expect(parseVote(' 3 ', options)).toBe(2);
    expect(parseVote('!1', options)).toBe(0);
    expect(parseVote('!vote 2', options)).toBe(1);
    expect(parseVote('!VOTE   3', options)).toBe(2);
  });

  it("reads a vote sent again with a chat client's invisible suffix, and the keycap emoji", () => {
    // 7TV's and Chatterino's ways past Twitch's "identical message" block.
    expect(parseVote('1 \u{E0000}', options)).toBe(0);
    expect(parseVote('2 \u034F', options)).toBe(1);
    expect(parseVote('Minecraft \u{E0000}', options)).toBe(0);
    expect(parseVote('3\uFE0F\u20E3', options)).toBe(2);
  });

  it("doesn't count numbers inside other words, extra words or options that don't exist", () => {
    for (const message of [
      '4Head',
      '1 more game',
      '2 please',
      '4',
      '0',
      '12',
      '!vote',
      '1.5',
      '',
    ]) {
      expect(parseVote(message, options)).toBeNull();
    }
  });

  it("takes an option's own text in any case, with or without Turkish letters", () => {
    expect(parseVote('minecraft', options)).toBe(0);
    expect(parseVote('!vote VALORANT', options)).toBe(1);
    expect(parseVote('isik oyunu', options)).toBe(2);
    expect(parseVote('IŞIK   OYUNU', options)).toBe(2);
    expect(parseVote('ışık oyunu', options)).toBe(2);
    expect(parseVote('Minecraft pls', options)).toBeNull();
  });

  it("prefers an option's text over its number", () => {
    expect(parseVote('5', ['3', '5'])).toBe(1);
    expect(parseVote('2', ['3', '5'])).toBe(1);
  });
});

describe('foldText', () => {
  it('matches dotted and dotless i, accents and spacing alike', () => {
    expect(foldText('  İSTANBUL  ')).toBe('istanbul');
    expect(foldText('Çağrı  Şahin')).toBe('cagri sahin');
  });
});

describe('parsePollCommand', () => {
  it('reads a question with options', () => {
    expect(parsePollCommand('!poll Best map? | Dust | Mirage | Inferno', YES_NO)).toEqual({
      action: 'new',
      question: 'Best map?',
      options: ['Dust', 'Mirage', 'Inferno'],
      ms: null,
    });
  });

  it('reads a length before the question, but not a bare number', () => {
    expect(parsePollCommand('!poll 90s Next? | A | B', YES_NO)).toMatchObject({ ms: 90_000 });
    expect(parsePollCommand('!poll 1:30 Next? | A | B', YES_NO)).toMatchObject({ ms: 90_000 });
    expect(parsePollCommand('!poll 3 games or 4? | 3 | 4', YES_NO)).toMatchObject({
      question: '3 games or 4?',
      ms: null,
    });
  });

  it('makes a yes/no poll from a question alone', () => {
    expect(parsePollCommand('!POLL  2m Ranked tonight?', YES_NO)).toEqual({
      action: 'new',
      question: 'Ranked tonight?',
      options: ['Yes', 'No'],
      ms: 120_000,
    });
  });

  it('drops blank and repeated options and keeps six', () => {
    expect(parsePollCommand('!poll Q | A | | a | B', YES_NO)).toMatchObject({
      options: ['A', 'B'],
    });
    const many = parsePollCommand('!poll Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8', YES_NO);
    expect(many).toMatchObject({ options: ['1', '2', '3', '4', '5', '6'] });
    expect(parsePollCommand('!poll Q | only one', YES_NO)).toBeNull();
  });

  it('reads the commands', () => {
    expect(parsePollCommand('!poll start', YES_NO)).toEqual({ action: 'start', ms: null });
    expect(parsePollCommand('!poll start 45s', YES_NO)).toEqual({ action: 'start', ms: 45_000 });
    expect(parsePollCommand('!poll end', YES_NO)).toEqual({ action: 'end' });
    expect(parsePollCommand('!poll stop', YES_NO)).toEqual({ action: 'end' });
    expect(parsePollCommand('!poll cancel', YES_NO)).toEqual({ action: 'cancel' });
    expect(parsePollCommand('!poll extend 30s', YES_NO)).toEqual({ action: 'extend', ms: 30_000 });
    expect(parsePollCommand('!poll add 1m', YES_NO)).toEqual({ action: 'extend', ms: 60_000 });
  });

  it('ignores a mistyped command instead of making it a question', () => {
    for (const message of [
      '!poll extend 30 seconds',
      '!poll extend 30',
      '!poll extend',
      '!poll end now',
      '!poll start 5',
    ]) {
      expect(parsePollCommand(message, YES_NO)).toBeNull();
    }
    // With options it's a poll whatever its first word.
    expect(parsePollCommand('!poll End the stream? | Yes | No', YES_NO)).toMatchObject({
      action: 'new',
      question: 'End the stream?',
    });
  });

  it('ignores other messages', () => {
    for (const message of ['!poll', '!polls Q | A | B', 'poll Q | A | B', '!poll | ', '!vote 2']) {
      expect(parsePollCommand(message, YES_NO)).toBeNull();
    }
  });
});

describe('cleanOptions', () => {
  it('trims, shortens and drops repeats in any case', () => {
    expect(cleanOptions([' A ', 'a', '', 'x'.repeat(40)])).toEqual(['A', 'x'.repeat(30)]);
  });

  it('drops repeats that differ only in accents or Turkish i, and turns "|" into a space', () => {
    expect(cleanOptions(['Işık', 'isik', 'IŞIK', 'Á', 'a', 'x|y', '|'])).toEqual([
      'Işık',
      'Á',
      'x y',
    ]);
  });

  it("doesn't cut an emoji in half at the length limit", () => {
    expect(cleanOptions([`${'x'.repeat(29)}🍕🍔`])).toEqual([`${'x'.repeat(29)}🍕`]);
  });
});

describe('parsePollCommand edge cases', () => {
  it("doesn't cut an emoji in the question in half", () => {
    const command = parsePollCommand(`!poll ${'x'.repeat(79)}🍕🍔 | A | B`, YES_NO);
    expect(command).toMatchObject({ question: `${'x'.repeat(79)}🍕` });
  });

  it('reads a length with no question, a length with a yes/no question, and 0s as no timer', () => {
    expect(parsePollCommand('!poll 2m | A | B', YES_NO)).toEqual({
      action: 'new',
      question: '',
      options: ['A', 'B'],
      ms: 120_000,
    });
    expect(parsePollCommand('!poll 0s Q | A | B', YES_NO)).toMatchObject({ ms: 0 });
    expect(parsePollCommand('!poll 2h Q | A | B', YES_NO)).toMatchObject({ ms: MAX_POLL_MS });
    expect(parsePollCommand('!poll extend 1m 30s', YES_NO)).toEqual({
      action: 'extend',
      ms: 90_000,
    });
  });

  it('keeps a first word that only looks like a length in the question', () => {
    expect(parsePollCommand('!poll 5:00pm raid? | Yes | No', YES_NO)).toMatchObject({
      question: '5:00pm raid?',
      ms: null,
    });
  });

  it('turns down a poll whose options are all the same', () => {
    expect(parsePollCommand('!poll Q | a | A | á', YES_NO)).toBeNull();
    expect(parsePollCommand('!poll Q | | |', YES_NO)).toBeNull();
  });

  it('reads command words in any case and turns down end or cancel with extra words', () => {
    expect(parsePollCommand('!POLL END', YES_NO)).toEqual({ action: 'end' });
    expect(parsePollCommand('!poll Cancel', YES_NO)).toEqual({ action: 'cancel' });
    expect(parsePollCommand('!poll cancel it', YES_NO)).toBeNull();
    expect(parsePollCommand('!poll start 1m now', YES_NO)).toBeNull();
    expect(parsePollCommand('!poll extend 0s', YES_NO)).toBeNull();
  });
});

describe('parseVote edge cases', () => {
  it('reads a Turkish option typed in capitals with a dotted İ', () => {
    expect(parseVote('HAYİR', ['Evet', 'Hayır'])).toBe(1);
    expect(parseVote('!vote İSTANBUL', ['İzmir', 'İstanbul'])).toBe(1);
  });

  it("doesn't read signs or punctuation around a number as a vote", () => {
    for (const message of ['+2', '2.', '#2', '-1', '!!2', '! 2', '!vote2']) {
      expect(parseVote(message, ['A', 'B'])).toBeNull();
    }
  });
});

describe('poll', () => {
  it('counts one vote per voter and lets them change it only when allowed', () => {
    const poll = createPoll('Q', ['A', 'B'], 60_000, 0);
    const key = voterKey('twitch', 'Viewer');
    expect(castVote(poll, key, vote(0), false)).toBe(true);
    expect(castVote(poll, key, vote(1), false)).toBe(false);
    expect(castVote(poll, key, vote(1), true)).toBe(true);
    expect(castVote(poll, key, vote(1), true)).toBe(false);
    expect(tally(poll).counts).toEqual([0, 1]);
  });

  it('weights votes, splits them by platform and finds the leaders', () => {
    const poll = createPoll('Q', ['A', 'B', 'C'], 0, 0);
    castVote(poll, 'twitch:a', vote(0, 'twitch', 2), true);
    castVote(poll, 'kick:b', vote(1, 'kick'), true);
    castVote(poll, 'kick:c', vote(1, 'kick'), true);
    expect(tally(poll)).toEqual({
      counts: [2, 2, 0],
      total: 4,
      byPlatform: { twitch: 2, kick: 2 },
      leaders: [0, 1],
    });
    expect(tally(createPoll('Q', ['A', 'B'], 0, 0)).leaders).toEqual([]);
  });

  it('closes on time, takes late votes for the grace time, then shows and hides results', () => {
    const poll = createPoll('Q', ['A', 'B'], 60_000, 1000);
    expect(phaseOf(poll, 60_999, timing)).toBe('open');
    expect(phaseOf(poll, 61_000, timing)).toBe('closing');
    expect(takesVotes(poll, 65_999, timing)).toBe(true);
    expect(phaseOf(poll, 66_000, timing)).toBe('results');
    expect(takesVotes(poll, 66_000, timing)).toBe(false);
    expect(phaseOf(poll, 96_000, timing)).toBe('gone');
    // A hold of 0 keeps the results up.
    expect(phaseOf(poll, 10_000_000, { graceMs: 0, holdMs: 0 })).toBe('results');
  });

  it('runs without a timer until a mod ends it', () => {
    const poll = createPoll('Q', ['A', 'B'], 0, 0);
    expect(phaseOf(poll, 10_000_000, timing)).toBe('open');
    const ended = endPoll(poll, 5000);
    expect(phaseOf(ended, 5000, timing)).toBe('closing');
    expect(endPoll(ended, 9000).endedAt).toBe(5000);
  });

  it('extends an open timer, up to the longest poll from now', () => {
    const poll = createPoll('Q', ['A', 'B'], 60_000, 0);
    expect(extendPoll(poll, 30_000, 10_000).endsAt).toBe(90_000);
    expect(extendPoll(poll, MAX_POLL_MS, 10_000).endsAt).toBe(10_000 + MAX_POLL_MS);
    // Closed polls and polls without a timer stay as they are.
    expect(extendPoll(poll, 30_000, 70_000)).toBe(poll);
    const open = createPoll('Q', ['A', 'B'], 0, 0);
    expect(extendPoll(open, 30_000, 10)).toBe(open);
  });

  it('saves and loads a poll with its votes, and drops broken votes', () => {
    const poll = createPoll('Q', ['A', 'B'], 60_000, 1000);
    castVote(poll, 'kick:x', vote(1, 'kick', 3), true);
    const saved = JSON.parse(JSON.stringify(toSaved(poll)));
    expect(fromSaved(saved)).toEqual(poll);
    saved.votes.push(['kick:y', 7, 1], ['youtube:z', 0, 1], ['twitch:w', 0, 0], 'junk');
    expect(fromSaved(saved)?.votes.size).toBe(1);
    expect(fromSaved({ ...saved, options: ['only'] })).toBeNull();
    expect(fromSaved(null)).toBeNull();
  });
});
