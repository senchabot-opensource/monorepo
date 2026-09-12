import { describe, expect, it } from 'vitest';
import { stripReplyMention } from '#/lib/twitch';
import type { ChatMessagesType } from './chat-messages';
import { getHighlightKind as getKind } from './highlights';
import { HIGHLIGHTS, type Highlight } from './widget-settings';

const ALL = new Set(HIGHLIGHTS);
const getHighlightKind = (
  msg: ChatMessagesType,
  channels: string[],
  enabled: ReadonlySet<Highlight> = ALL,
) => getKind(msg, channels, enabled);

const message = (overrides: Partial<ChatMessagesType>): ChatMessagesType => ({
  id: '1',
  user: 'viewer',
  message: 'hello',
  platform: 'twitch',
  timestamp: new Date(0),
  receivedAt: new Date(0),
  ...overrides,
});

describe('getHighlightKind', () => {
  it('leaves ordinary messages alone', () => {
    expect(getHighlightKind(message({}), ['senchabot'])).toBeNull();
    expect(getHighlightKind(message({ message: 'hi @someone_else' }), ['senchabot'])).toBeNull();
  });

  it('spots a mention of either channel, in any case', () => {
    expect(getHighlightKind(message({ message: 'gg @SenchaBot!' }), ['senchabot'])).toBe('mention');
    expect(getHighlightKind(message({ message: 'hey @Salah_Abdullah' }), ['salah-abdullah'])).toBe(
      'mention',
    );
  });

  it('counts a reply to the channel as a mention', () => {
    const reply = message({ replyTo: { user: 'Senchabot', message: 'hi' } });
    expect(getHighlightKind(reply, ['senchabot'])).toBe('mention');
  });

  it('does not match a name that only starts with the channel name', () => {
    expect(getHighlightKind(message({ message: '@senchabotfan hi' }), ['senchabot'])).toBeNull();
  });

  it('ranks announcement and highlight above mention, and mention above first message', () => {
    const mentioning = { message: '@senchabot hi', firstMessage: true };
    expect(
      getHighlightKind(message({ ...mentioning, variant: 'announcement' }), ['senchabot']),
    ).toBe('announcement');
    expect(
      getHighlightKind(message({ ...mentioning, variant: 'highlighted' }), ['senchabot']),
    ).toBe('highlighted');
    expect(getHighlightKind(message(mentioning), ['senchabot'])).toBe('mention');
    expect(getHighlightKind(message({ firstMessage: true }), ['senchabot'])).toBe('firstMessage');
  });
});

describe('getHighlightKind with some types turned off', () => {
  it('skips a turned-off type and falls through to the next one that applies', () => {
    const msg = message({ message: '@senchabot hi', variant: 'announcement', firstMessage: true });
    expect(getHighlightKind(msg, ['senchabot'], new Set(['mention', 'firstMessage']))).toBe(
      'mention',
    );
    expect(getHighlightKind(msg, ['senchabot'], new Set(['firstMessage']))).toBe('firstMessage');
    expect(getHighlightKind(msg, ['senchabot'], new Set())).toBeNull();
  });
});

describe('stripReplyMention', () => {
  it('removes the "@parent " prefix Twitch adds to replies', () => {
    expect(
      stripReplyMention('@Zombie63 he just might', undefined, ['Zombie63', 'zombie63']),
    ).toEqual({ message: 'he just might', emotes: undefined });
  });

  it('falls back to the login and leaves other text untouched', () => {
    expect(stripReplyMention('@zombie63 hi', undefined, ['Zombie63', 'zombie63']).message).toBe(
      'hi',
    );
    expect(stripReplyMention('hi @Zombie63', undefined, ['Zombie63']).message).toBe('hi @Zombie63');
    expect(stripReplyMention('@Zombie63', undefined, ['Zombie63']).message).toBe('@Zombie63');
  });

  it('moves emote positions back by the prefix length', () => {
    // "@Bob Kappa hi Kappa": Kappa at 5-9 and 14-18, prefix "@Bob " is 5 code points.
    expect(stripReplyMention('@Bob Kappa hi Kappa', '25:5-9,14-18', ['Bob'])).toEqual({
      message: 'Kappa hi Kappa',
      emotes: '25:0-4,9-13',
    });
  });

  it('counts the prefix in code points, like Twitch does', () => {
    expect(stripReplyMention('@𝓑ob Kappa', '25:5-9', ['𝓑ob'])).toEqual({
      message: 'Kappa',
      emotes: '25:0-4',
    });
  });
});
