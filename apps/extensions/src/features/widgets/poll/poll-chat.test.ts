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

  it('strips a /me wrapper, also from a vote sent again through 7TV', () => {
    expect(privmsg('badges=', 'v', '\x01ACTION 3\x01')).toMatchObject({ text: '3' });
    expect(privmsg('badges=', 'v', '\x01ACTION 3 \u{E0000}\x01')).toMatchObject({ text: '3' });
  });

  it('ignores a reply, which answers someone instead of voting or running a command', () => {
    const reply = 'badges=moderator/1;mod=1;reply-parent-msg-id=p1;reply-parent-user-login=bob';
    expect(privmsg(`${reply};reply-parent-display-name=Bob`, 'v', '@Bob 1')).toBeNull();
    expect(privmsg(`${reply};reply-parent-display-name=Bob`, 'v', '@Bob !poll end')).toBeNull();
    // A client that sends a reply without the name in front.
    expect(privmsg(reply, 'v', '2')).toBeNull();
    // A mention typed by hand stays in the text, so it's no vote.
    expect(privmsg('badges=', 'v', '@someone 2')).toMatchObject({ text: '@someone 2' });
  });

  it('reads a lowercase login for an uppercase CLEARCHAT target and skips a Shared Chat ban', () => {
    expect(twitch('@room-id=1 :tmi.twitch.tv CLEARCHAT #streamer :MixedCase')).toMatchObject({
      login: 'mixedcase',
    });
    expect(
      twitch('@room-id=1;source-room-id=2 :tmi.twitch.tv CLEARCHAT #streamer :spammer'),
    ).toBeNull();
  });

  it('ignores lines that are neither chat nor a ban', () => {
    expect(twitch('@room-id=1 :tmi.twitch.tv ROOMSTATE #streamer')).toBeNull();
    expect(twitch('@msg-id=resub;room-id=1 :tmi.twitch.tv USERNOTICE #streamer :1')).toBeNull();
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

  // Kick sends an emote as [emote:id:name] (2591 of 5059 live messages, 2026-09-15); Twitch sends
  // its name, so a poll made on either one reads the same.
  it('reads a Kick emote as its name, as Twitch sends it', () => {
    expect(kickMessage('[emote:37226:KEKW]')).toMatchObject({ text: 'KEKW' });
    expect(
      kickMessage('!poll Best emote? [emote:37230:POLICE] | [emote:37226:KEKW] | LUL'),
    ).toMatchObject({ text: '!poll Best emote? POLICE | KEKW | LUL' });
  });

  it('ignores a Kick reply, as on Twitch', () => {
    expect(
      kickMessage('2', [], {
        type: 'reply',
        metadata: {
          original_sender: { id: 1, username: 'Bob' },
          original_message: { id: 'x', content: 'vote!' },
        },
      }),
    ).toBeNull();
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
