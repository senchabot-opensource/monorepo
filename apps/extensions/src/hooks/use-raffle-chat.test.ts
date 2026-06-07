import { describe, expect, it } from 'vitest';

import {
  extractSubMonths,
  isSubscriber,
  parsePrivmsg,
  parseTags,
  shouldAcceptEntry,
} from './use-raffle-chat';

describe('parseTags', () => {
  it('returns an empty object when input is undefined', () => {
    expect(parseTags(undefined)).toEqual({});
  });

  it('parses simple key=value pairs', () => {
    expect(parseTags('color=#FF0000;display-name=Alice')).toEqual({
      color: '#FF0000',
      'display-name': 'Alice',
    });
  });

  it('unescapes IRCv3 tag values', () => {
    expect(parseTags(String.raw`display-name=Alice\:Bob;foo=line\sone\ntwo`)).toEqual({
      'display-name': 'Alice;Bob',
      foo: 'line one\ntwo',
    });
  });

  it('handles keys with no value', () => {
    expect(parseTags('foo;bar=baz')).toEqual({ foo: '', bar: 'baz' });
  });
});

describe('extractSubMonths', () => {
  it('returns -1 for non-subscribers', () => {
    expect(extractSubMonths({})).toBe(-1);
    expect(extractSubMonths({ badges: 'vip/1' })).toBe(-1);
  });

  it('returns 0 when only the subscriber badge is present', () => {
    expect(extractSubMonths({ badges: 'subscriber/0' })).toBe(0);
    expect(extractSubMonths({ badges: 'founder/0' })).toBe(0);
  });

  it('returns months from badge-info', () => {
    expect(extractSubMonths({ 'badge-info': 'subscriber/12,founder/0' })).toBe(
      12,
    );
  });
});

describe('isSubscriber', () => {
  it('detects subscriber, founder, and broadcaster', () => {
    expect(isSubscriber({ badges: 'subscriber/3' })).toBe(true);
    expect(isSubscriber({ badges: 'founder/0' })).toBe(true);
    expect(isSubscriber({ badges: 'broadcaster/1' })).toBe(true);
  });

  it('rejects non-subscribers', () => {
    expect(isSubscriber({})).toBe(false);
    expect(isSubscriber({ badges: 'vip/1,moderator/1' })).toBe(false);
  });
});

describe('parsePrivmsg', () => {
  it('parses a message with tags and trims the body', () => {
    const raw =
      '@display-name=Alice;id=msg-1 :alice!alice@alice.tmi.twitch.tv PRIVMSG #channel :  !join   ';
    expect(parsePrivmsg(raw)).toEqual({
      tags: { 'display-name': 'Alice', id: 'msg-1' },
      username: 'alice',
      message: '!join',
    });
  });

  it('parses a message without tags', () => {
    expect(
      parsePrivmsg(':bob!bob@bob.tmi.twitch.tv PRIVMSG #chan :!join'),
    ).toEqual({
      tags: {},
      username: 'bob',
      message: '!join',
    });
  });

  it('returns null for non-PRIVMSG input', () => {
    expect(parsePrivmsg('PING :tmi.twitch.tv')).toBeNull();
    expect(parsePrivmsg('JOIN #chan')).toBeNull();
  });
});

describe('shouldAcceptEntry', () => {
  it('accepts non-subscribers when subscribersOnly is false, regardless of minSubMonths', () => {
    // Regression: previously, a non-subscriber (subMonths = -1) was rejected
    // whenever minSubMonths > 0, which excluded mods and regular chatters.
    expect(
      shouldAcceptEntry(false, -1, {
        subscribersOnly: false,
        minSubMonths: 1,
      }),
    ).toBe(true);
    expect(
      shouldAcceptEntry(false, -1, {
        subscribersOnly: false,
        minSubMonths: 12,
      }),
    ).toBe(true);
  });

  it('rejects non-subscribers when subscribersOnly is true', () => {
    expect(
      shouldAcceptEntry(false, -1, {
        subscribersOnly: true,
        minSubMonths: 0,
      }),
    ).toBe(false);
  });

  it('rejects subscribers with too few months when minSubMonths > 0', () => {
    expect(
      shouldAcceptEntry(true, 0, {
        subscribersOnly: false,
        minSubMonths: 3,
      }),
    ).toBe(false);
    expect(
      shouldAcceptEntry(true, 2, {
        subscribersOnly: false,
        minSubMonths: 3,
      }),
    ).toBe(false);
  });

  it('accepts subscribers at or above the minSubMonths threshold', () => {
    expect(
      shouldAcceptEntry(true, 3, {
        subscribersOnly: false,
        minSubMonths: 3,
      }),
    ).toBe(true);
    expect(
      shouldAcceptEntry(true, 12, {
        subscribersOnly: false,
        minSubMonths: 3,
      }),
    ).toBe(true);
  });

  it('accepts everyone when minSubMonths is 0 and subscribersOnly is false', () => {
    expect(
      shouldAcceptEntry(false, -1, {
        subscribersOnly: false,
        minSubMonths: 0,
      }),
    ).toBe(true);
    expect(
      shouldAcceptEntry(true, 0, {
        subscribersOnly: false,
        minSubMonths: 0,
      }),
    ).toBe(true);
  });
});
