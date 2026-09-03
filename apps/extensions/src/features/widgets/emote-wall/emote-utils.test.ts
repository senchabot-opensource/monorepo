import { describe, expect, it } from 'vitest';
import {
  getAnyEmoteUrls,
  getEmoteOnlyUrls,
  getKickEmoteOnlyUrls,
  getSevenTvEmoteOnlyUrls,
  getTwitchNativeEmoteOnlyUrls,
  isSubscriberMessage,
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
