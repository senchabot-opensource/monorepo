import { describe, expect, it } from 'vitest';
import { DEFAULT_STREAM_ALERTS_SETTINGS } from '#/lib/stream-alerts-url';
import { parseIrcLine } from '#/lib/twitch';
import { twitchEvent } from '../subathon/subathon-events';
import { cleanMessage, isAnonymous, MESSAGE_MAX_LENGTH, passesFilters } from './stream-alert';

const bits = (platform: 'twitch' | 'kick', message: string) =>
  ({ kind: 'bits', platform, name: 'Fan', amount: 100, message }) as const;

describe('passesFilters', () => {
  const settings = { ...DEFAULT_STREAM_ALERTS_SETTINGS, minGift: 5, minBits: 100, minRaid: 10 };

  it('holds each alert to its own minimum', () => {
    const gift = (count: number) =>
      ({ kind: 'gift', platform: 'kick', name: 'G', count, tier: 1 }) as const;
    expect(passesFilters(gift(4), settings)).toBe(false);
    expect(passesFilters(gift(5), settings)).toBe(true);
    expect(passesFilters({ ...bits('twitch', ''), amount: 99 }, settings)).toBe(false);
    expect(passesFilters(bits('twitch', ''), settings)).toBe(true);
    const raid = (viewers: number) =>
      ({ kind: 'raid', platform: 'twitch', name: 'R', viewers }) as const;
    expect(passesFilters(raid(9), settings)).toBe(false);
    expect(passesFilters(raid(10), settings)).toBe(true);
  });

  it('drops alerts that are turned off', () => {
    const off = { ...settings, enabled: { ...settings.enabled, sub: false } };
    expect(passesFilters({ kind: 'sub', platform: 'twitch', name: 'S', tier: 1 }, off)).toBe(false);
  });
});

describe('isAnonymous', () => {
  it("knows each platform's anonymous gifter", () => {
    const gift = (platform: 'twitch' | 'kick', name: string) =>
      ({ kind: 'gift', platform, name, count: 1, tier: 1 }) as const;
    expect(isAnonymous(gift('twitch', 'AnAnonymousGifter'))).toBe(true);
    expect(isAnonymous(gift('kick', 'Anonymous'))).toBe(true);
    expect(isAnonymous(gift('twitch', 'Anonymous'))).toBe(false);
  });
});

describe('cleanMessage', () => {
  it('drops Twitch cheermotes but keeps the words around them', () => {
    // Live cheers read like this: the amount as cheermotes, then the message.
    const cheer = { ...bits('twitch', 'Cheer1 Cheer1 uni5 4Head25 great stream 2026'), amount: 32 };
    expect(cleanMessage(cheer)).toBe('great stream 2026');
  });

  it('keeps words like ps5 that only look like cheermotes', () => {
    expect(cleanMessage(bits('twitch', 'Cheer100 new ps5 top10'))).toBe('new ps5 top10');
  });

  it('reads a /me cheer without its ACTION wrapper', () => {
    const line = parseIrcLine(
      '@bits=100;display-name=Fan;room-id=1 :fan!fan@fan.tmi.twitch.tv PRIVMSG #c :\x01ACTION Cheer100 gg\x01',
    );
    const event = line && twitchEvent(line, new Map());
    expect(event && event.kind === 'bits' && cleanMessage(event)).toBe('gg');
  });

  it('keeps an emoji whole where the message is cut', () => {
    // Cut by UTF-16 unit, the third character from the end would be half an emoji.
    const text = cleanMessage(bits('kick', `${'a'.repeat(MESSAGE_MAX_LENGTH - 2)}😀😀😀`));
    expect(text).toBe(`${'a'.repeat(MESSAGE_MAX_LENGTH - 2)}😀…`);
  });

  it('keeps words that only look like cheermotes on Kick', () => {
    expect(cleanMessage(bits('kick', 'gg2 all'))).toBe('gg2 all');
  });

  it('turns Kick emotes into their names', () => {
    expect(cleanMessage(bits('kick', 'nice[emote:37226:KEKW]'))).toBe('nice KEKW');
  });

  it('leaves links out', () => {
    expect(
      cleanMessage(bits('kick', 'go to https://evil.example/x or www.spam.io and bit.ly/abc now')),
    ).toBe('go to or and now');
  });

  it('cuts a long message', () => {
    const text = cleanMessage(bits('kick', 'word '.repeat(60)));
    expect(text).toHaveLength(MESSAGE_MAX_LENGTH);
    expect(text.endsWith('…')).toBe(true);
  });

  it("keeps a resub message's words, even ones shaped like cheermotes", () => {
    const resub = {
      kind: 'sub',
      platform: 'twitch',
      name: 'S',
      tier: 1,
      message: 'gg2 all',
    } as const;
    expect(cleanMessage(resub)).toBe('gg2 all');
  });

  it('is empty for alerts without a message', () => {
    expect(cleanMessage({ kind: 'sub', platform: 'twitch', name: 'S', tier: 1 })).toBe('');
  });
});
