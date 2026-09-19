import { describe, expect, it } from 'vitest';
import { parseIrcLine } from '#/lib/twitch';
import { kickPollEvent, twitchPollEvent } from './poll-chat';

const twitch = (raw: string) => {
  const line = parseIrcLine(raw);
  if (!line) throw new Error('bad line');
  return twitchPollEvent(line);
};
const privmsg = (tags: string, login: string, text: string) =>
  twitch(`@${tags};room-id=1 :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}`);

const kickMessage = (
  content: string,
  badges: { type: string; count?: number }[] = [],
  extra = {},
) =>
  kickPollEvent('App\\Events\\ChatMessageEvent', {
    id: 'm1',
    content,
    type: 'message',
    sender: { id: 5, username: 'Kicker_1', identity: { color: '#fff', badges } },
    ...extra,
  });

describe('twitchPollEvent', () => {
  it('passes a viewer message on with who sent it', () => {
    expect(privmsg('badges=;display-name=Viewer', 'viewer', ' 2 ')).toEqual({
      kind: 'message',
      platform: 'twitch',
      login: 'viewer',
      text: '2',
      mod: false,
      sub: false,
    });
  });

  it('marks mods, the broadcaster and subs', () => {
    expect(privmsg('badges=moderator/1;mod=1', 'm', '!poll end')).toMatchObject({ mod: true });
    expect(privmsg('badges=broadcaster/1', 'b', 'x')).toMatchObject({ mod: true, sub: true });
    expect(privmsg('badges=subscriber/12;subscriber=1', 's', 'x')).toMatchObject({
      mod: false,
      sub: true,
    });
    expect(privmsg('badges=founder/0', 'f', 'x')).toMatchObject({ sub: true });
  });

  it('strips a /me wrapper and a reply mention', () => {
    expect(privmsg('badges=', 'v', '\x01ACTION 3\x01')).toMatchObject({ text: '3' });
    expect(
      privmsg('badges=;reply-parent-display-name=Bob;reply-parent-user-login=bob', 'v', '@Bob 1'),
    ).toMatchObject({ text: '1' });
  });

  it("skips Shared Chat partners' messages", () => {
    expect(privmsg('badges=;source-room-id=2', 'viewer', '1')).toBeNull();
  });

  it('turns a timeout or ban into a ban, but not a whole-chat clear', () => {
    expect(
      twitch('@room-id=1;target-user-id=9 :tmi.twitch.tv CLEARCHAT #streamer :Spammer'),
    ).toEqual({
      kind: 'ban',
      platform: 'twitch',
      login: 'spammer',
    });
    expect(twitch('@room-id=1 :tmi.twitch.tv CLEARCHAT #streamer')).toBeNull();
  });
});

describe('kickPollEvent', () => {
  it('passes a chat message on with who sent it', () => {
    expect(kickMessage(' !vote 2 ')).toEqual({
      kind: 'message',
      platform: 'kick',
      login: 'kicker_1',
      text: '!vote 2',
      mod: false,
      sub: false,
    });
  });

  it('marks mods, the broadcaster and subs from badges', () => {
    expect(kickMessage('x', [{ type: 'moderator' }])).toMatchObject({ mod: true, sub: false });
    expect(kickMessage('x', [{ type: 'broadcaster' }])).toMatchObject({ mod: true, sub: true });
    expect(kickMessage('x', [{ type: 'subscriber', count: 3 }])).toMatchObject({ sub: true });
    // A gifter badge counts subs given, not a sub.
    expect(kickMessage('x', [{ type: 'sub_gifter', count: 5 }])).toMatchObject({ sub: false });
  });

  it('skips shared resubs', () => {
    expect(kickMessage('1', [], { type: 'celebration' })).toBeNull();
  });

  it('turns a ban or timeout into a ban', () => {
    expect(
      kickPollEvent('App\\Events\\UserBannedEvent', {
        user: { id: 1, username: 'Spammer', slug: 'spammer' },
        banned_by: { id: 0, username: 'Mod' },
        permanent: false,
      }),
    ).toEqual({ kind: 'ban', platform: 'kick', login: 'spammer' });
  });

  it('ignores other events and broken payloads', () => {
    expect(kickPollEvent('App\\Events\\SubscriptionEvent', { username: 'a' })).toBeNull();
    expect(kickPollEvent('App\\Events\\ChatMessageEvent', null)).toBeNull();
    expect(kickPollEvent('App\\Events\\ChatMessageEvent', { content: '1' })).toBeNull();
  });
});
