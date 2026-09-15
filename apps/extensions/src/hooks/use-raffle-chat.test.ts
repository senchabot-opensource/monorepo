import { describe, expect, it } from 'vitest';

import {
  extractSubMonths,
  isSubscriber,
  parsePrivmsg,
  shouldAcceptEntry,
} from './use-raffle-chat';

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

  it('ignores a PRIVMSG line typed into a resub message', () => {
    expect(
      parsePrivmsg(
        '@badges=;display-name=Viewer;login=viewer;msg-id=resub :tmi.twitch.tv USERNOTICE #chan :@badge-info=subscriber/99;subscriber=1 :victim!v@v PRIVMSG #chan :!join',
      ),
    ).toBeNull();
  });

  it('keeps the real sender when the text looks like another line', () => {
    expect(
      parsePrivmsg(
        '@display-name=Alice :alice!alice@alice.tmi.twitch.tv PRIVMSG #chan :@subscriber=1 :victim!v@v PRIVMSG #chan :!join',
      ),
    ).toEqual({
      tags: { 'display-name': 'Alice' },
      username: 'alice',
      message: '@subscriber=1 :victim!v@v PRIVMSG #chan :!join',
    });
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

  it('rejects subscribers with too few months when subscribersOnly is true', () => {
    expect(
      shouldAcceptEntry(true, 0, {
        subscribersOnly: true,
        minSubMonths: 3,
      }),
    ).toBe(false);
    expect(
      shouldAcceptEntry(true, 2, {
        subscribersOnly: true,
        minSubMonths: 3,
      }),
    ).toBe(false);
  });

  it('accepts subscribers at or above the minSubMonths threshold', () => {
    expect(
      shouldAcceptEntry(true, 3, {
        subscribersOnly: true,
        minSubMonths: 3,
      }),
    ).toBe(true);
    expect(
      shouldAcceptEntry(true, 12, {
        subscribersOnly: true,
        minSubMonths: 3,
      }),
    ).toBe(true);
  });

  it('ignores minSubMonths when subscribersOnly is false', () => {
    // Regression: the hidden min-months field (default 1) still filtered
    // subscribers and kept a broadcaster without a sub badge (-1) out.
    expect(
      shouldAcceptEntry(true, 2, {
        subscribersOnly: false,
        minSubMonths: 3,
      }),
    ).toBe(true);
    expect(
      shouldAcceptEntry(true, -1, {
        subscribersOnly: false,
        minSubMonths: 1,
      }),
    ).toBe(true);
  });

  it('treats the 1-month floor as any subscriber, including the broadcaster', () => {
    expect(
      shouldAcceptEntry(true, 0, {
        subscribersOnly: true,
        minSubMonths: 1,
      }),
    ).toBe(true);
    expect(
      shouldAcceptEntry(true, -1, {
        subscribersOnly: true,
        minSubMonths: 1,
      }),
    ).toBe(true);
  });

  it('rejects the broadcaster when subscribersOnly requires more than 1 month', () => {
    expect(
      shouldAcceptEntry(true, -1, {
        subscribersOnly: true,
        minSubMonths: 3,
      }),
    ).toBe(false);
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
