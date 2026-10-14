import { describe, expect, it } from 'vitest';
import { parseIrcLine } from '#/lib/twitch';
import { getMessageEmotes } from '../emote-wall/emote-utils';
import { kickEmoteChat, twitchEmoteChat } from './emote-combo-chat';

const line = (raw: string) => {
  const parsed = parseIrcLine(raw);
  if (!parsed) throw new Error('not an IRC line');
  return parsed;
};

describe('twitchEmoteChat', () => {
  it('keeps the emote positions with the viewer', () => {
    const chat = twitchEmoteChat(
      line(
        '@badges=moderator/1;display-name=Mod;emotes=25:0-4;mod=1;room-id=1 :mod!x@x.tmi.twitch.tv PRIVMSG #streamer :Kappa',
      ),
    );
    expect(chat?.viewer).toMatchObject({ login: 'mod', mod: true, bot: false });
    expect(chat?.input).toEqual({ platform: 'twitch', message: 'Kappa', emotes: '25:0-4' });
  });

  it('reads a /me message from its own text, where the positions count from', () => {
    const chat = twitchEmoteChat(
      line(
        '@display-name=A;emotes=25:4-8;room-id=1 :a!x@x.tmi.twitch.tv PRIVMSG #streamer :\u0001ACTION wow Kappa\u0001',
      ),
    );
    expect(chat && getMessageEmotes(chat.input)[0]?.name).toBe('Kappa');
  });

  it('leaves out Shared Chat messages from the partner channels', () => {
    expect(
      twitchEmoteChat(
        line(
          '@display-name=A;emotes=25:0-4;room-id=1;source-room-id=2 :a!x@x.tmi.twitch.tv PRIVMSG #streamer :Kappa',
        ),
      ),
    ).toBeNull();
  });
});

describe('kickEmoteChat', () => {
  it('keeps the [emote:id:name] tokens Kick sends', () => {
    const chat = kickEmoteChat('App\\Events\\ChatMessageEvent', {
      type: 'message',
      content: 'gg [emote:37226:KEKW]',
      sender: { username: 'Fan', identity: { badges: [{ type: 'moderator' }] } },
    });
    expect(chat?.viewer).toMatchObject({ platform: 'kick', login: 'fan', mod: true });
    expect(chat?.input).toEqual({ platform: 'kick', message: 'gg [emote:37226:KEKW]' });
  });

  it('reads nothing from other events', () => {
    expect(kickEmoteChat('App\\Events\\UserBannedEvent', { user: { username: 'x' } })).toBeNull();
  });
});
