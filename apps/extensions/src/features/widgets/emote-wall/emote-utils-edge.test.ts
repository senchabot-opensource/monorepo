import { describe, expect, it } from 'vitest';
import {
  checkHype,
  createSpamState,
  filterSpam,
  getAnyEmoteUrls,
  getEmoteOnlyUrls,
  getKickEmoteOnlyUrls,
  getSevenTvEmoteOnlyUrls,
  getTwitchNativeEmoteOnlyUrls,
  type HypeState,
  isSubscriberMessage,
  kickEmoteUrl,
  MAX_EMOTES_PER_MESSAGE,
  sevenTvEmoteUrl,
  twitchEmoteUrl,
} from './emote-utils';

const SEVEN = new Map([
  ['PEPE', 's1'],
  ['KEKW', 's2'],
  ['RainTime', 's3'],
]);

describe('emote-only detection', () => {
  it('rejects a row of 7TV emotes that ends in text, however many emotes lead', () => {
    const text = `${'KEKW '.repeat(MAX_EMOTES_PER_MESSAGE)}that was funny`;
    expect(getSevenTvEmoteOnlyUrls(text, SEVEN)).toBeNull();
    expect(getEmoteOnlyUrls({ message: text, platform: 'twitch' }, SEVEN)).toEqual([]);
    expect(getEmoteOnlyUrls({ message: text, platform: 'kick' }, SEVEN)).toEqual([]);
  });

  it('still caps a long emote-only 7TV row', () => {
    const text = 'KEKW '.repeat(MAX_EMOTES_PER_MESSAGE + 3).trim();
    expect(getSevenTvEmoteOnlyUrls(text, SEVEN)).toHaveLength(MAX_EMOTES_PER_MESSAGE);
  });

  it('rejects a long Kick emote row that ends in text', () => {
    const text = `${'[emote:1:a] '.repeat(8)}hi`;
    expect(getKickEmoteOnlyUrls(text)).toBeNull();
    expect(getEmoteOnlyUrls({ message: text, platform: 'kick' }, SEVEN)).toEqual([]);
  });

  it('rejects a long Twitch emote row that ends in text', () => {
    // Kappa x6 at 0-4, 6-10, ... then " hi".
    const text = `${'Kappa '.repeat(6)}hi`;
    const ranges = Array.from({ length: 6 }, (_, i) => `${i * 6}-${i * 6 + 4}`).join(',');
    expect(getTwitchNativeEmoteOnlyUrls(text, `25:${ranges}`)).toBeNull();
  });

  it('counts Twitch emote positions in code points, past an emoji', () => {
    // 😀 is one position to Twitch but two UTF-16 units to JS.
    const message = '😀 Kappa';
    expect(getAnyEmoteUrls({ message, platform: 'twitch', emotes: '25:2-6' }, null)).toEqual([
      twitchEmoteUrl('25'),
    ]);
    expect(getTwitchNativeEmoteOnlyUrls(message, '25:2-6')).toBeNull();
    const mixed = getEmoteOnlyUrls(
      { message: '😀😀 Kappa PEPE', platform: 'twitch', emotes: '25:3-7' },
      SEVEN,
    );
    expect(mixed).toEqual([]);
  });

  it('matches an emote after an emoji to its own text for the 7TV mix', () => {
    const message = 'PEPE 😀 Kappa';
    // Without the emoji being an emote, the message is not emote-only.
    expect(getEmoteOnlyUrls({ message, platform: 'twitch', emotes: '25:7-11' }, SEVEN)).toEqual([]);
    // 7TV + native, native after an emoji-free prefix.
    expect(
      getEmoteOnlyUrls({ message: 'PEPE Kappa', platform: 'twitch', emotes: '25:5-9' }, SEVEN),
    ).toEqual([sevenTvEmoteUrl('s1'), twitchEmoteUrl('25')]);
  });

  it('shows emotes in message order in the Twitch native + 7TV mix', () => {
    expect(
      getEmoteOnlyUrls(
        { message: 'Kappa PEPE Keepo', platform: 'twitch', emotes: '1902:11-15/25:0-4' },
        SEVEN,
      ),
    ).toEqual([twitchEmoteUrl('25'), sevenTvEmoteUrl('s1'), twitchEmoteUrl('1902')]);
  });

  it('ignores a broken Twitch emotes tag instead of throwing', () => {
    for (const tag of ['25', '25:', ':0-4', '25:a-b', '25:0-4,', '25:4-0', '25:0-400']) {
      expect(() =>
        getEmoteOnlyUrls({ message: 'Kappa', platform: 'twitch', emotes: tag }, SEVEN),
      ).not.toThrow();
      expect(() =>
        getAnyEmoteUrls({ message: 'Kappa', platform: 'twitch', emotes: tag }, SEVEN),
      ).not.toThrow();
    }
  });

  it('reads Kick emotes glued together and mixed with 7TV', () => {
    expect(getKickEmoteOnlyUrls('[emote:1:a][emote:2:b]')).toEqual([
      kickEmoteUrl('1'),
      kickEmoteUrl('2'),
    ]);
    expect(getEmoteOnlyUrls({ message: '[emote:1:a] PEPE', platform: 'kick' }, SEVEN)).toEqual([
      kickEmoteUrl('1'),
      sevenTvEmoteUrl('s1'),
    ]);
  });

  it('is not fooled by text shaped like a Kick emote on Twitch', () => {
    expect(getEmoteOnlyUrls({ message: '[emote:1:a]', platform: 'twitch' }, SEVEN)).toEqual([]);
  });

  it('keeps the Kick emote regex usable after an early break', () => {
    const many = Array.from({ length: 9 }, (_, i) => `[emote:${i}:e]`).join(' x ');
    getAnyEmoteUrls({ message: many, platform: 'kick' }, null);
    expect(getKickEmoteOnlyUrls('[emote:7:z]')).toEqual([kickEmoteUrl('7')]);
  });

  it('skips a 7TV emote whose name is also the Twitch native emote there', () => {
    const map = new Map([['Kappa', 'sevenKappa']]);
    expect(
      getAnyEmoteUrls({ message: 'hi Kappa', platform: 'twitch', emotes: '25:3-7' }, map),
    ).toEqual([twitchEmoteUrl('25')]);
  });
});

describe('isSubscriberMessage edge cases', () => {
  it('reads badges case-insensitively and ignores lookalikes', () => {
    expect(isSubscriberMessage({ platform: 'kick', badges: ['Subscriber/3'] })).toBe(true);
    expect(isSubscriberMessage({ platform: 'twitch', badges: ['sub-gift-leader/1'] })).toBe(false);
    expect(isSubscriberMessage({ platform: 'twitch', badges: ['subscriberx/1'] })).toBe(false);
  });
});

describe('spam and hype math', () => {
  it('counts every copy, so one message with the same emote more than twice is skipped', () => {
    // The setup tip: "The same emote more than twice in 10 seconds skips just that emote."
    expect(filterSpam(createSpamState(), 'alice', ['k', 'k', 'k'], 1000)).toEqual([]);
    expect(filterSpam(createSpamState(), 'alice', ['k', 'k', 'x'], 1000)).toEqual(['k', 'k', 'x']);
  });

  it('keeps counting within the window from the first sighting, not the last', () => {
    const state = createSpamState();
    filterSpam(state, 'alice', ['a'], 0);
    filterSpam(state, 'alice', ['a'], 9000);
    expect(filterSpam(state, 'alice', ['a'], 9999)).toEqual([]);
    // 10 s after the first, it has slid out.
    expect(filterSpam(state, 'alice', ['a'], 10_000)).toEqual([]);
    expect(filterSpam(state, 'alice', ['b'], 30_000)).toEqual(['b']);
  });

  it('forgets old users once the state grows', () => {
    const state = createSpamState();
    for (let i = 0; i < 1200; i++) filterSpam(state, `u${i}`, ['a'], i);
    filterSpam(state, 'late', ['a'], 60_000);
    expect(state.byUser.size + state.byEmote.size).toBeLessThan(10);
  });

  it('hype needs distinct users and fires on the second', () => {
    const state: HypeState = new Map();
    expect(checkHype(state, 'k', 'alice', 0)).toBe(false);
    expect(checkHype(state, 'k', 'alice', 1)).toBe(false);
    expect(checkHype(state, 'k', 'bob', 2)).toBe(true);
  });

  it('hype forgets a lone sighting older than the window', () => {
    const state: HypeState = new Map();
    checkHype(state, 'k', 'alice', 0);
    expect(checkHype(state, 'k', 'bob', 15_000)).toBe(false);
    expect(checkHype(state, 'k', 'carol', 15_001)).toBe(true);
  });

  it('hype state stays bounded', () => {
    const state: HypeState = new Map();
    for (let i = 0; i < 2000; i++) checkHype(state, `url${i}`, 'alice', i * 100);
    expect(state.size).toBeLessThanOrEqual(501);
  });
});
