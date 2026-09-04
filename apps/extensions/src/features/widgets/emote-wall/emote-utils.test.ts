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
  isSubscriberMessage,
  type HypeState,
} from './emote-utils';

describe('getKickEmoteOnlyUrls', () => {
  it('detects a single kick emote-only message', () => {
    expect(getKickEmoteOnlyUrls('[emote:123:kappa]')).toEqual([
      'https://files.kick.com/emotes/123/fullsize',
    ]);
  });

  it('detects multiple kick emotes separated by spaces', () => {
    expect(
      getKickEmoteOnlyUrls('[emote:1:a] [emote:2:b]'),
    ).toEqual([
      'https://files.kick.com/emotes/1/fullsize',
      'https://files.kick.com/emotes/2/fullsize',
    ]);
  });

  it('rejects mixed text + emote', () => {
    expect(getKickEmoteOnlyUrls('hello [emote:1:a]')).toBeNull();
    expect(getKickEmoteOnlyUrls('[emote:1:a] hello')).toBeNull();
  });

  it('rejects plain text', () => {
    expect(getKickEmoteOnlyUrls('hello world')).toBeNull();
    expect(getKickEmoteOnlyUrls('')).toBeNull();
  });

  it('caps emotes per message', () => {
    const msg = Array.from(
      { length: 10 },
      (_, i) => `[emote:${i}:e]`,
    ).join(' ');
    expect(getKickEmoteOnlyUrls(msg)).toHaveLength(5);
  });
});

describe('getTwitchNativeEmoteOnlyUrls', () => {
  it('detects single native emote covering whole message', () => {
    // "Kappa" is 5 chars -> 0-4
    expect(getTwitchNativeEmoteOnlyUrls('Kappa', '25:0-4')).toEqual([
      'https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0',
    ]);
  });

  it('detects repeated same emote', () => {
    expect(
      getTwitchNativeEmoteOnlyUrls('Kappa Kappa', '25:0-4,6-10'),
    ).toHaveLength(2);
  });

  it('rejects text + emote', () => {
    expect(getTwitchNativeEmoteOnlyUrls('hello Kappa', '25:6-10')).toBeNull();
  });

  it('returns null without emotes tag', () => {
    expect(getTwitchNativeEmoteOnlyUrls('Kappa')).toBeNull();
  });
});

describe('getSevenTvEmoteOnlyUrls', () => {
  const map = new Map([
    ['PEPE', 'abc123'],
    ['DANCE', 'def456'],
  ]);

  it('detects single 7tv emote', () => {
    expect(getSevenTvEmoteOnlyUrls('PEPE', map)).toEqual([
      'https://cdn.7tv.app/emote/abc123/4x.webp',
    ]);
  });

  it('detects multiple 7tv emotes', () => {
    expect(getSevenTvEmoteOnlyUrls('PEPE DANCE', map)).toHaveLength(2);
  });

  it('rejects unknown words', () => {
    expect(getSevenTvEmoteOnlyUrls('PEPE hello', map)).toBeNull();
  });

  it('requires exact word match', () => {
    expect(getSevenTvEmoteOnlyUrls('PEPE!', map)).toBeNull();
  });
});

describe('getEmoteOnlyUrls', () => {
  it('handles kick emote-only', () => {
    expect(
      getEmoteOnlyUrls(
        { message: '[emote:9:x]', platform: 'kick' },
        null,
      ),
    ).toHaveLength(1);
  });

  it('handles twitch native emote-only', () => {
    expect(
      getEmoteOnlyUrls(
        { message: 'Kappa', platform: 'twitch', emotes: '25:0-4' },
        null,
      ),
    ).toHaveLength(1);
  });

  it('falls back to 7tv for twitch', () => {
    const map = new Map([['PEPE', '1']]);
    expect(
      getEmoteOnlyUrls({ message: 'PEPE', platform: 'twitch' }, map),
    ).toHaveLength(1);
  });

  it('returns empty for normal chat', () => {
    expect(
      getEmoteOnlyUrls({ message: 'hello world', platform: 'twitch' }, null),
    ).toEqual([]);
    expect(
      getEmoteOnlyUrls(
        { message: 'hello world', platform: 'kick' },
        new Map([['PEPE', '1']]),
      ),
    ).toEqual([]);
  });

  it('handles mixed twitch native + 7tv', () => {
    const map = new Map([['PEPE', 'seven1']]);
    // "Kappa PEPE": Kappa 0-4, space at 5, PEPE 6-9
    const urls = getEmoteOnlyUrls(
      { message: 'Kappa PEPE', platform: 'twitch', emotes: '25:0-4' },
      map,
    );
    expect(urls).toHaveLength(2);
  });

  it('rejects mixed emote + normal text', () => {
    const map = new Map([['PEPE', 'seven1']]);
    expect(
      getEmoteOnlyUrls(
        { message: 'Kappa hello', platform: 'twitch', emotes: '25:0-4' },
        map,
      ),
    ).toEqual([]);
  });
});

describe('isSubscriberMessage', () => {
  it('detects twitch subscribers and founders', () => {
    expect(
      isSubscriberMessage({ platform: 'twitch', badges: ['subscriber/12'] }),
    ).toBe(true);
    expect(
      isSubscriberMessage({ platform: 'twitch', badges: ['founder/0'] }),
    ).toBe(true);
    expect(
      isSubscriberMessage({ platform: 'twitch', badges: ['broadcaster/1'] }),
    ).toBe(true);
  });

  it('rejects twitch mods/vips without sub badge', () => {
    expect(
      isSubscriberMessage({ platform: 'twitch', badges: ['moderator/1'] }),
    ).toBe(false);
    expect(
      isSubscriberMessage({ platform: 'twitch', badges: ['vip/1'] }),
    ).toBe(false);
    expect(isSubscriberMessage({ platform: 'twitch', badges: [] })).toBe(false);
    expect(isSubscriberMessage({ platform: 'twitch' })).toBe(false);
  });

  it('detects kick subscribers', () => {
    expect(
      isSubscriberMessage({ platform: 'kick', badges: ['subscriber/6'] }),
    ).toBe(true);
    expect(isSubscriberMessage({ platform: 'kick', badges: ['subscriber'] })).toBe(
      true,
    );
    expect(
      isSubscriberMessage({ platform: 'kick', badges: ['broadcaster'] }),
    ).toBe(true);
  });

  it('rejects kick gifters and mods as non-subscribers', () => {
    expect(
      isSubscriberMessage({ platform: 'kick', badges: ['sub_gifter'] }),
    ).toBe(false);
    expect(isSubscriberMessage({ platform: 'kick', badges: ['moderator'] })).toBe(
      false,
    );
    expect(isSubscriberMessage({ platform: 'kick' })).toBe(false);
  });
});

describe('getAnyEmoteUrls', () => {
  it('extracts kick emotes mixed with text', () => {
    expect(
      getAnyEmoteUrls(
        { message: 'hello [emote:123:kappa] world', platform: 'kick' },
        null,
      ),
    ).toEqual(['https://files.kick.com/emotes/123/fullsize']);
  });

  it('extracts twitch native emotes mixed with text', () => {
    expect(
      getAnyEmoteUrls(
        { message: 'hello Kappa', platform: 'twitch', emotes: '25:6-10' },
        null,
      ),
    ).toEqual(['https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0']);
  });

  it('extracts 7tv emotes mixed with text', () => {
    const map = new Map([['PEPE', 'abc123']]);
    expect(
      getAnyEmoteUrls({ message: 'hello PEPE lol', platform: 'twitch' }, map),
    ).toEqual(['https://cdn.7tv.app/emote/abc123/4x.webp']);
  });

  it('extracts mixed native + 7tv from text messages', () => {
    const map = new Map([['PEPE', 'seven1']]);
    const urls = getAnyEmoteUrls(
      { message: 'hi Kappa and PEPE bye', platform: 'twitch', emotes: '25:3-7' },
      map,
    );
    expect(urls).toHaveLength(2);
  });

  it('returns empty when there are no emotes', () => {
    expect(
      getAnyEmoteUrls({ message: 'just chatting', platform: 'twitch' }, null),
    ).toEqual([]);
    expect(
      getAnyEmoteUrls(
        { message: 'just chatting', platform: 'kick' },
        new Map([['PEPE', '1']]),
      ),
    ).toEqual([]);
    expect(getAnyEmoteUrls({ message: '   ', platform: 'kick' }, null)).toEqual(
      [],
    );
  });

  it('caps emotes per message', () => {
    const msg = Array.from({ length: 10 }, (_, i) => `[emote:${i}:e]`).join(' hello ');
    expect(
      getAnyEmoteUrls({ message: msg, platform: 'kick' }, null),
    ).toHaveLength(5);
  });
});

describe('checkHype', () => {
  it('fires only when distinct users double the emote', () => {
    const state: HypeState = new Map();
    expect(checkHype(state, 'url1', 'alice', 1000)).toBe(false);
    // Same user repeating does not hype.
    expect(checkHype(state, 'url1', 'alice', 2000)).toBe(false);
    // Second distinct user triggers.
    expect(checkHype(state, 'url1', 'bob', 3000)).toBe(true);
  });

  it('does not re-fire within the same window', () => {
    const state: HypeState = new Map();
    checkHype(state, 'url1', 'alice', 1000);
    expect(checkHype(state, 'url1', 'bob', 2000)).toBe(true);
    // Still hyped but cooling down.
    expect(checkHype(state, 'url1', 'carol', 3000)).toBe(false);
  });

  it('re-fires after the window passes', () => {
    const state: HypeState = new Map();
    checkHype(state, 'url1', 'alice', 1000);
    expect(checkHype(state, 'url1', 'bob', 2000)).toBe(true);
    expect(checkHype(state, 'url1', 'carol', 20_000)).toBe(false);
    expect(checkHype(state, 'url1', 'dave', 21_000)).toBe(true);
  });

  it('tracks emotes independently', () => {
    const state: HypeState = new Map();
    checkHype(state, 'url1', 'alice', 1000);
    expect(checkHype(state, 'url2', 'bob', 2000)).toBe(false);
    expect(checkHype(state, 'url1', 'bob', 3000)).toBe(true);
  });
});

describe('filterSpam', () => {
  it('blocks the 3rd same-emote repeat within the window', () => {
    const state = createSpamState();
    expect(filterSpam(state, 'alice', ['url1'], 1000)).toEqual(['url1']);
    expect(filterSpam(state, 'alice', ['url1'], 2000)).toEqual(['url1']);
    expect(filterSpam(state, 'alice', ['url1'], 3000)).toEqual([]);
  });

  it('blocks the 4th emote message with different emotes', () => {
    const state = createSpamState();
    expect(filterSpam(state, 'alice', ['url1'], 1000)).toEqual(['url1']);
    expect(filterSpam(state, 'alice', ['url2'], 2000)).toEqual(['url2']);
    expect(filterSpam(state, 'alice', ['url3'], 3000)).toEqual(['url3']);
    expect(filterSpam(state, 'alice', ['url4'], 4000)).toEqual([]);
  });

  it('drops only the spammed emote from a mixed message', () => {
    const state = createSpamState();
    filterSpam(state, 'alice', ['url1'], 1000);
    filterSpam(state, 'alice', ['url1'], 2000);
    // url1 is now spam, url2 is fresh.
    expect(filterSpam(state, 'alice', ['url1', 'url2'], 3000)).toEqual([
      'url2',
    ]);
  });

  it('tracks users independently', () => {
    const state = createSpamState();
    filterSpam(state, 'alice', ['url1'], 1000);
    filterSpam(state, 'alice', ['url1'], 2000);
    filterSpam(state, 'alice', ['url1'], 3000);
    expect(filterSpam(state, 'bob', ['url1'], 4000)).toEqual(['url1']);
  });

  it('recovers after the window slides past', () => {
    const state = createSpamState();
    filterSpam(state, 'alice', ['url1'], 1000);
    filterSpam(state, 'alice', ['url1'], 2000);
    expect(filterSpam(state, 'alice', ['url1'], 3000)).toEqual([]);
    expect(filterSpam(state, 'alice', ['url1'], 15_000)).toEqual(['url1']);
    expect(filterSpam(state, 'alice', ['url9'], 16_000)).toEqual(['url9']);
  });

  it('passes through empty input', () => {
    expect(filterSpam(createSpamState(), 'alice', [], 1000)).toEqual([]);
  });
});
