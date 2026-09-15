import { describe, expect, it } from 'vitest';
import {
  buildPollPreviewUrl,
  buildPollUrl,
  DEFAULT_POLL_SETTINGS,
  MAX_DURATION_SECONDS,
  type PollSettings,
  parsePollUrl,
  readPollSettings,
  savedPoll,
} from './poll-url';

const ORIGIN = 'https://extensions.senchabot.com';
const settings = (overrides: Partial<PollSettings> = {}) => ({
  ...DEFAULT_POLL_SETTINGS,
  ...overrides,
});

describe('buildPollUrl', () => {
  it('is empty until a picked platform has a channel', () => {
    expect(buildPollUrl(ORIGIN, settings(), '', '', 'en')).toBe('');
    expect(buildPollUrl(ORIGIN, settings({ platforms: 'kick' }), 'Streamer', '', 'en')).toBe('');
  });

  it('writes only what differs from the defaults, and always the language', () => {
    expect(buildPollUrl(ORIGIN, settings(), ' Streamer ', 'kicker', 'tr')).toBe(
      `${ORIGIN}/widgets/poll?twitch=streamer&kick=kicker&lang=tr`,
    );
  });

  it('writes the ready-made poll without blank or repeated options', () => {
    const url = buildPollUrl(
      ORIGIN,
      settings({ question: ' Next game? ', options: ['Minecraft', '', 'minecraft', 'GTA & Co'] }),
      'streamer',
      '',
      'en',
    );
    const params = new URL(url).searchParams;
    expect(params.get('q')).toBe('Next game?');
    expect(params.get('o')).toBe('Minecraft|GTA & Co');
  });

  it('leaves out a ready-made poll with fewer than two options', () => {
    const url = buildPollUrl(
      ORIGIN,
      settings({ question: 'Q', options: ['A', ' '] }),
      's',
      '',
      'en',
    );
    expect(url).toBe(`${ORIGIN}/widgets/poll?twitch=s&lang=en`);
  });
});

describe('poll URL round trip', () => {
  it('reads back every setting', () => {
    const custom = settings({
      platforms: 'both',
      question: 'Best map?',
      options: ['Dust', 'Mirage', 'Inferno'],
      duration: 0,
      delay: 12,
      hold: 0,
      subsOnly: true,
      subWeight: 3,
      change: false,
      blind: true,
      color: 'gold',
      position: 'bottom',
    });
    const url = buildPollUrl(ORIGIN, custom, 'streamer', 'kicker', 'tr');
    expect(parsePollUrl(url)).toEqual({
      settings: custom,
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
      locale: 'tr',
    });
  });

  it('picks the platforms from the channels it has', () => {
    const url = buildPollUrl(ORIGIN, settings({ platforms: 'kick' }), '', 'kicker', 'en');
    expect(parsePollUrl(url)?.settings.platforms).toBe('kick');
  });

  it('turns down URLs of other widgets and non-URLs', () => {
    expect(parsePollUrl(`${ORIGIN}/widgets/goal?twitch=a`)).toBeNull();
    expect(parsePollUrl('not a url')).toBeNull();
  });
});

describe('readPollSettings', () => {
  it('falls back to the defaults for bad values and caps the rest', () => {
    const read = readPollSettings(
      new URLSearchParams('dur=-5&hold=abc&delay=999&subx=7&color=blue&pos=left&o=Only|'),
    );
    expect(read).toMatchObject({
      duration: DEFAULT_POLL_SETTINGS.duration,
      hold: DEFAULT_POLL_SETTINGS.hold,
      delay: 30,
      subWeight: 1,
      color: DEFAULT_POLL_SETTINGS.color,
      position: 'top',
      // One option isn't a poll, but the setup page still gets its two boxes.
      options: ['Only', ''],
    });
    expect(readPollSettings(new URLSearchParams('dur=99999')).duration).toBe(MAX_DURATION_SECONDS);
  });
});

describe('readPollSettings edge cases', () => {
  it("doesn't cut an emoji in half in a long question or option", () => {
    const params = new URLSearchParams();
    params.set('q', `${'x'.repeat(79)}🍕🍔`);
    params.set('o', `${'y'.repeat(29)}🍕🍔|B`);
    const read = readPollSettings(params);
    expect(read.question).toBe(`${'x'.repeat(79)}🍕`);
    expect(read.options).toEqual([`${'y'.repeat(29)}🍕`, 'B']);
  });

  it('keeps six options, drops repeats and never throws on garbage', () => {
    const read = readPollSettings(new URLSearchParams('o=A|B|C|D|E|F|G|H|a&subs=yes&subx=2.5'));
    expect(read.options).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(read.subsOnly).toBe(true);
    expect(read.subWeight).toBe(1);
    for (const search of ['dur=Infinity&hold=1e400&delay=NaN', 'color=__proto__&pos=constructor']) {
      expect(() => readPollSettings(new URLSearchParams(search))).not.toThrow();
    }
    expect(readPollSettings(new URLSearchParams('dur=Infinity')).duration).toBe(60);
  });

  it('reads back a Turkish ready-made poll with emoji, accents and "&"', () => {
    const custom = settings({ question: 'Hangi oyun? 🎮', options: ['Işık & Gölge', 'Çay', '🍕'] });
    const url = buildPollUrl(ORIGIN, custom, 'streamer', '', 'tr');
    expect(parsePollUrl(url)?.settings).toMatchObject({
      question: 'Hangi oyun? 🎮',
      options: ['Işık & Gölge', 'Çay', '🍕'],
    });
  });
});

describe('preview URL', () => {
  it('simulates, pairs with its page and keeps to the picked platform', () => {
    const url = new URL(
      buildPollPreviewUrl(ORIGIN, settings({ platforms: 'twitch' }), 'en', 'abc'),
    );
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc');
    expect(url.searchParams.get('simplatform')).toBe('twitch');
  });
});

describe('savedPoll', () => {
  it('needs two options, and a question is optional', () => {
    expect(savedPoll({ question: '', options: ['A', 'B'] })).toEqual({
      question: '',
      options: ['A', 'B'],
    });
    expect(savedPoll({ question: 'Q', options: ['A'] })).toBeNull();
  });
});
