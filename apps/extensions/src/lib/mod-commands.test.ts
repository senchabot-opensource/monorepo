import { describe, expect, it } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { KickPusherReader, TwitchIrcReader } from './chat-readers';
import { KickChat, kickModCommand } from './kick';
import { type ModCommand, onModCommand, publishModCommand } from './mod-commands';
import { parseIrcLine, TwitchChat, twitchModCommand } from './twitch';

const line = (raw: string) => {
  const parsed = parseIrcLine(raw);
  if (!parsed) throw new Error(`Not an IRC line: ${raw}`);
  return parsed;
};
const PRIVMSG = (tags: string, text: string) =>
  `@${tags} :someone!someone@someone.tmi.twitch.tv PRIVMSG #streamer :${text}`;

const KICK_MESSAGE = (badges: string[], content: string, more: object = {}) => ({
  id: 'kick-1',
  type: 'message',
  content,
  sender: { username: 'Someone', identity: { badges: badges.map((type) => ({ type })) } },
  ...more,
});
const CHAT = 'App\\Events\\ChatMessageEvent';

/** Every command published while `run` runs. */
function heard(run: () => void): ModCommand[] {
  const commands: ModCommand[] = [];
  const stop = onModCommand((command) => commands.push(command));
  try {
    run();
  } finally {
    stop();
  }
  return commands;
}

describe('twitchModCommand', () => {
  it("reads a mod's or the broadcaster's ! message", () => {
    expect(
      twitchModCommand(line(PRIVMSG('badges=moderator/1;id=a;room-id=1', '!preset blocks'))),
    ).toEqual({ platform: 'twitch', id: 'a', text: '!preset blocks' });
    expect(
      twitchModCommand(line(PRIVMSG('badges=broadcaster/1;id=b;room-id=1', ' !preset rift '))),
    ).toEqual({ platform: 'twitch', id: 'b', text: '!preset rift' });
    // A lead moderator's badge isn't "moderator", but the mod tag is set.
    expect(
      twitchModCommand(line(PRIVMSG('badges=lead_moderator/1;id=c;mod=1;room-id=1', '!preset'))),
    ).toEqual({ platform: 'twitch', id: 'c', text: '!preset' });
  });

  it('leaves out viewers, replies, Shared Chat partners and messages without !', () => {
    for (const raw of [
      PRIVMSG('badges=subscriber/12;id=a;room-id=1', '!preset blocks'),
      PRIVMSG('badges=moderator/1;reply-parent-msg-id=x;room-id=1', '!preset blocks'),
      PRIVMSG('badges=moderator/1;room-id=1;source-room-id=2', '!preset blocks'),
      PRIVMSG('badges=moderator/1;room-id=1', 'gg !preset blocks'),
      '@msg-id=sub;room-id=1 :tmi.twitch.tv USERNOTICE #streamer :!preset blocks',
    ]) {
      expect(twitchModCommand(line(raw))).toBeNull();
    }
  });
});

describe('kickModCommand', () => {
  it("reads a mod's or the broadcaster's ! message", () => {
    expect(kickModCommand(CHAT, KICK_MESSAGE(['moderator'], '!preset blocks'))).toEqual({
      platform: 'kick',
      id: 'kick-1',
      text: '!preset blocks',
    });
    expect(kickModCommand(CHAT, KICK_MESSAGE(['broadcaster', 'og'], '!preset rift'))?.text).toBe(
      '!preset rift',
    );
  });

  it('leaves out viewers, replies, other events and messages without !', () => {
    expect(kickModCommand(CHAT, KICK_MESSAGE(['subscriber'], '!preset blocks'))).toBeNull();
    expect(
      kickModCommand(CHAT, KICK_MESSAGE(['moderator'], '!preset blocks', { type: 'reply' })),
    ).toBeNull();
    expect(kickModCommand(CHAT, KICK_MESSAGE(['moderator'], 'gg'))).toBeNull();
    expect(
      kickModCommand('App\\Events\\UserBannedEvent', KICK_MESSAGE(['moderator'], '!x')),
    ).toBeNull();
    expect(kickModCommand(CHAT, null)).toBeNull();
  });
});

describe('publishModCommand', () => {
  it('hands each command to every listener once, though two readers of the page get it', () => {
    const second: ModCommand[] = [];
    const stopSecond = onModCommand((command) => second.push(command));
    const command: ModCommand = { platform: 'twitch', id: 'once', text: '!preset blocks' };
    const first = heard(() => {
      publishModCommand(command);
      publishModCommand({ ...command });
      // The same id on the other platform is another message.
      publishModCommand({ ...command, platform: 'kick' });
      publishModCommand(null);
    });
    stopSecond();
    publishModCommand({ platform: 'twitch', id: 'after', text: '!preset rift' });
    expect(first.map((each) => each.platform)).toEqual(['twitch', 'kick']);
    expect(second).toEqual(first);
  });
});

describe('chat readers', () => {
  // The newest socket for a host: each reader opens its own.
  const socket = (host: string) => {
    const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
    if (!found) throw new Error(`No ${host} socket`);
    return found;
  };
  const pusherFrame = (data: unknown) =>
    JSON.stringify({ event: CHAT, channel: 'chatrooms.42.v2', data: JSON.stringify(data) });

  it("pass on mods' commands from every Twitch and Kick reader, the Chat Box's too", () => {
    const texts = heard(() => {
      const shared = new TwitchIrcReader(
        'streamer',
        () => null,
        () => {},
      );
      socket('twitch').receive(PRIVMSG('badges=moderator/1;id=t1;room-id=1', '!preset blocks'));
      shared.disconnect();
      const chatBox = new TwitchChat('streamer', () => {});
      socket('twitch').receive(PRIVMSG('badges=moderator/1;id=t2;room-id=1', '!preset rift'));
      socket('twitch').receive(PRIVMSG('id=t3;room-id=1', '!preset pizza'));
      chatBox.disconnect();
      const kickShared = new KickPusherReader(
        ['chatrooms.42.v2'],
        () => null,
        () => {},
      );
      socket('pusher').receive(
        pusherFrame({ ...KICK_MESSAGE(['moderator'], '!preset storm'), id: 'k1' }),
      );
      kickShared.disconnect();
      const kickChatBox = new KickChat('42', () => {});
      socket('pusher').receive(
        pusherFrame({ ...KICK_MESSAGE(['moderator'], '!preset boost'), id: 'k2' }),
      );
      kickChatBox.disconnect();
    }).map((command) => `${command.platform} ${command.text}`);
    expect(texts).toEqual([
      'twitch !preset blocks',
      'twitch !preset rift',
      'kick !preset storm',
      'kick !preset boost',
    ]);
  });
});
