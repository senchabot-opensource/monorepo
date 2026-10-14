import { describe, expect, it } from 'vitest';
import { parseIrcLine } from '#/lib/twitch';
import { kickViewerEvent, twitchViewerEvent } from './viewer-chat';

const irc = (raw: string) => {
  const line = parseIrcLine(raw);
  if (!line) throw new Error('no line');
  return twitchViewerEvent(line);
};
const say = (tags: string, text: string, login = 'someone') =>
  irc(`@${tags};room-id=1 :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}`);

describe('twitchViewerEvent', () => {
  it('reads a message with the display name and who sent it', () => {
    expect(say('display-name=MoonLit;badges=subscriber/12', 'hello', 'moonlit')).toEqual({
      kind: 'message',
      platform: 'twitch',
      login: 'moonlit',
      name: 'MoonLit',
      text: 'hello',
      mod: false,
      broadcaster: false,
      sub: true,
      aside: false,
      bot: false,
    });
  });

  it('tells mods, the broadcaster, replies and bots apart', () => {
    expect(say('badges=moderator/1;mod=1', 'hi')).toMatchObject({ mod: true, broadcaster: false });
    expect(say('badges=broadcaster/1', 'hi')).toMatchObject({ mod: true, broadcaster: true });
    expect(say('reply-parent-msg-id=abc', '@x hi')).toMatchObject({ aside: true });
    expect(say('badges=', 'hi', 'nightbot')).toMatchObject({ bot: true });
  });

  it('strips the /me wrapper and the anti-repeat mark', () => {
    expect(say('badges=', '\x01ACTION waves\x01')).toMatchObject({ text: 'waves' });
    expect(say('badges=', '!join \u{E0000}')).toMatchObject({ text: '!join' });
  });

  it('drops Shared Chat partners and reads timeouts and bans', () => {
    expect(say('source-room-id=2', 'hi')).toBeNull();
    expect(irc('@room-id=1 :tmi.twitch.tv CLEARCHAT #streamer :Troll')).toEqual({
      kind: 'ban',
      platform: 'twitch',
      login: 'troll',
    });
    expect(irc('@room-id=1 :tmi.twitch.tv CLEARCHAT #streamer')).toBeNull();
  });
});

describe('kickViewerEvent', () => {
  const message = (data: Record<string, unknown>) =>
    kickViewerEvent('App\\Events\\ChatMessageEvent', {
      type: 'message',
      content: 'hi',
      sender: { username: 'PixelFox', identity: { badges: [] } },
      ...data,
    });

  it('reads a message with the name as written and its badges', () => {
    expect(
      message({
        content: 'gg [emote:123:KEKW]',
        sender: { username: 'PixelFox', identity: { badges: [{ type: 'subscriber', count: 3 }] } },
      }),
    ).toEqual({
      kind: 'message',
      platform: 'kick',
      login: 'pixelfox',
      name: 'PixelFox',
      text: 'gg KEKW',
      mod: false,
      broadcaster: false,
      sub: true,
      aside: false,
      bot: false,
    });
  });

  it('tells mods, the broadcaster, replies and shared resubs apart', () => {
    const badge = (type: string) => ({
      sender: { username: 'A', identity: { badges: [{ type }] } },
    });
    expect(message(badge('moderator'))).toMatchObject({ mod: true, broadcaster: false });
    expect(message(badge('broadcaster'))).toMatchObject({ mod: true, broadcaster: true });
    expect(message({ type: 'reply' })).toMatchObject({ aside: true });
    expect(message({ type: 'celebration' })).toMatchObject({ aside: true });
  });

  it('reads bans and ignores everything else', () => {
    expect(
      kickViewerEvent('App\\Events\\UserBannedEvent', { user: { username: 'Troll' } }),
    ).toEqual({
      kind: 'ban',
      platform: 'kick',
      login: 'troll',
    });
    expect(kickViewerEvent('App\\Events\\PinnedMessageCreatedEvent', {})).toBeNull();
    expect(message({ sender: {} })).toBeNull();
  });
});
