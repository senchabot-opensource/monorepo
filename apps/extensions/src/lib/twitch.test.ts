import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import { FakeWebSocket } from '#/test/browser';
import { parseIrcLine, parseTags, stripReplyMention, TwitchChat } from './twitch';

// Lines below follow what live Twitch IRC sent on 2026-09-15 (50 channels, 7637 PRIVMSGs), names
// replaced.

let received: ChatMessagesType[];
const moderation = { deleteMessage: vi.fn(), banUser: vi.fn(), clearAll: vi.fn() };
let client: TwitchChat | null;

beforeEach(() => {
  received = [];
  vi.spyOn(console, 'log').mockImplementation(() => {});
  client = new TwitchChat(
    'channel',
    (m) => received.push(m),
    moderation.deleteMessage,
    moderation.banUser,
    moderation.clearAll,
  );
  socket().open();
});

afterEach(() => {
  client?.disconnect();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const socket = () => FakeWebSocket.instances[FakeWebSocket.instances.length - 1];

const privmsg = (text: string, tags = '') =>
  `@badges=;color=#FF0000;display-name=Viewer;emotes=;id=${Math.random()};tmi-sent-ts=1789165490905${tags} :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #channel :${text}`;

describe('parseTags', () => {
  it('keeps an "=" inside a value, which Twitch does not escape', () => {
    // A reply to a message with a YouTube link, as sent live.
    expect(
      parseTags(
        String.raw`reply-parent-msg-body=watch\shttps://www.youtube.com/watch?v=79qhVR6ZZ2k;id=a`,
      ),
    ).toEqual({
      'reply-parent-msg-body': 'watch https://www.youtube.com/watch?v=79qhVR6ZZ2k',
      id: 'a',
    });
  });

  it('reads an escaped backslash before an "s" or an "n" as a backslash', () => {
    // IRCv3 message-tags: "\\" is one backslash, so "\\s" is a backslash and an "s", not a space.
    expect(parseTags(String.raw`body=C:\\server\\new`)).toEqual({
      body: String.raw`C:\server\new`,
    });
    expect(parseTags(String.raw`body=a\\\sb`)).toEqual({ body: String.raw`a\ b` });
  });

  it('unescapes every IRCv3 sequence', () => {
    expect(parseTags(String.raw`v=a\:b\sc\\d\re\nf`)).toEqual({ v: 'a;b c\\d\re\nf' });
  });

  it('drops an unknown escape to its character and a trailing lone backslash', () => {
    expect(parseTags(String.raw`v=a\bc\\`)).toEqual({ v: 'abc\\' });
    expect(parseTags('v=abc\\')).toEqual({ v: 'abc' });
  });

  it('reads an empty value, a missing value and skips empty tags', () => {
    expect(parseTags('a=;b;;c=1')).toEqual({ a: '', b: '', c: '1' });
  });
});

describe('parseIrcLine', () => {
  it('splits tags, source, command and params', () => {
    expect(
      parseIrcLine('@id=1 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #channel :hi there'),
    ).toEqual({
      tags: { id: '1' },
      source: 'viewer!viewer@viewer.tmi.twitch.tv',
      command: 'PRIVMSG',
      params: ['#channel', 'hi there'],
    });
  });

  it('keeps a message that starts with a colon', () => {
    expect(parseIrcLine(':v!v@v.tmi.twitch.tv PRIVMSG #channel ::) hi')?.params).toEqual([
      '#channel',
      ':) hi',
    ]);
  });

  it('reads a line without tags or source, and a numeric reply', () => {
    expect(parseIrcLine('PING :tmi.twitch.tv')).toMatchObject({
      command: 'PING',
      params: ['tmi.twitch.tv'],
    });
    expect(
      parseIrcLine(':justinfan1.tmi.twitch.tv 353 justinfan1 = #channel :justinfan1')?.params,
    ).toEqual(['justinfan1', '=', '#channel', 'justinfan1']);
  });

  it('keeps an empty trailing param', () => {
    expect(parseIrcLine(':v!v@v PRIVMSG #channel :')?.params).toEqual(['#channel', '']);
  });

  it('returns null for an empty line', () => {
    expect(parseIrcLine('')).toBeNull();
  });
});

describe('stripReplyMention', () => {
  it('moves emotes back by the prefix in code points, not UTF-16 units', () => {
    expect(stripReplyMention('@加藤 Kappa', '25:4-8', ['加藤'])).toEqual({
      message: 'Kappa',
      emotes: '25:0-4',
    });
    expect(stripReplyMention('@😀x Kappa', '25:4-8', ['😀x'])).toEqual({
      message: 'Kappa',
      emotes: '25:0-4',
    });
  });

  it('leaves a message that does not start with the mention alone', () => {
    expect(stripReplyMention('hi @Parent', '25:0-1', ['Parent'])).toEqual({
      message: 'hi @Parent',
      emotes: '25:0-1',
    });
  });

  it('matches the login when the display-name is not what was typed', () => {
    expect(stripReplyMention('@parent_1 hi', undefined, ['Parent_1', 'parent_1'])).toEqual({
      message: 'hi',
      emotes: undefined,
    });
  });
});

describe('TwitchChat lines', () => {
  it('reads every line of a frame that carries several', () => {
    socket().receive(`${privmsg('one')}\r\n${privmsg('two')}\r\n${privmsg('three')}\r\n`);
    expect(received.map((m) => m.message)).toEqual(['one', 'two', 'three']);
  });

  it('reads a /me message without its ACTION wrapper', () => {
    socket().receive(`${privmsg('\x01ACTION waves at chat\x01')}\r\n`);
    expect(received[0]?.message).toBe('waves at chat');
  });

  it('keeps the emotes of a /me message on their words', () => {
    // Twitch counts /me emote positions from after "\x01ACTION " (checked live: ":)" at 43-44).
    socket().receive(
      `${privmsg('\x01ACTION [Trivia] bmwenjoyer69 has started a trivia :) Question\x01', ';emotes=1:43-44')}\r\n`,
    );
    const [msg] = received;
    expect(msg.message).toBe('[Trivia] bmwenjoyer69 has started a trivia :) Question');
    expect(msg.emotes).toBe('1:43-44');
    expect([...msg.message].slice(43, 45).join('')).toBe(':)');
  });

  it('reads a /me message whose client left out the closing \\x01', () => {
    socket().receive(`${privmsg('\x01ACTION dances')}\r\n`);
    expect(received[0]?.message).toBe('dances');
  });

  it('reads a repeated /me message marked by Chatterino or 7TV', () => {
    socket().receive(`${privmsg('\x01ACTION waves \u034f\x01')}\r\n`);
    expect(received[0]?.message).toBe('waves');
  });

  it('shows the whole reply context when the parent message has an "=" in it', () => {
    socket().receive(
      `${privmsg(
        '@Parent go watch',
        String.raw`;reply-parent-display-name=Parent;reply-parent-msg-body=see\shttps://www.youtube.com/watch?v=79qhVR6ZZ2k;reply-parent-user-login=parent`,
      )}\r\n`,
    );
    expect(received[0]?.replyTo?.message).toBe('see https://www.youtube.com/watch?v=79qhVR6ZZ2k');
  });

  it('drops an empty or whitespace-only message', () => {
    socket().receive(`${privmsg('   ')}\r\n${privmsg('')}\r\n`);
    expect(received).toEqual([]);
  });

  it('falls back to the login when a display-name is empty', () => {
    socket().receive(
      '@badges=;display-name=;id=x;tmi-sent-ts=1 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #channel :hi\r\n',
    );
    expect(received[0]).toMatchObject({ user: 'viewer', userLower: 'viewer' });
  });

  it('answers a PING and ignores the PONG to its own', () => {
    socket().receive('PING :tmi.twitch.tv\r\n');
    expect(socket().sent.at(-1)).toBe('PONG');
    socket().receive(':tmi.twitch.tv PONG tmi.twitch.tv :tmi.twitch.tv\r\n');
    expect(received).toEqual([]);
  });

  it('ignores the join and room state lines', () => {
    socket().receive(
      ':justinfan1!justinfan1@justinfan1.tmi.twitch.tv JOIN #channel\r\n@emote-only=0;room-id=1 :tmi.twitch.tv ROOMSTATE #channel\r\n:justinfan1.tmi.twitch.tv 366 justinfan1 #channel :End of /NAMES list\r\n',
    );
    expect(received).toEqual([]);
  });

  it('ignores binary frames', () => {
    socket().onmessage?.(new MessageEvent('message', { data: new ArrayBuffer(4) }));
    expect(received).toEqual([]);
  });

  it('skips what follows RECONNECT in the same frame, from the connection being retired', () => {
    socket().receive(`:tmi.twitch.tv RECONNECT\r\n${privmsg('late')}\r\n`);
    expect(received).toEqual([]);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('joins the channel it was given, trimmed', () => {
    client?.disconnect();
    client = new TwitchChat('  Streamer ', () => {});
    socket().open();
    expect(socket().sent).toContain('JOIN #Streamer');
    expect(socket().sent.slice(0, 3)).toEqual([
      'CAP REQ :twitch.tv/tags twitch.tv/commands',
      'PASS SCHMOOPIIE',
      expect.stringMatching(/^NICK justinfan\d+$/),
    ]);
  });

  it('bans by the login CLEARCHAT names and deletes by CLEARMSG in one frame', () => {
    socket().receive(
      '@room-id=1;target-user-id=2;tmi-sent-ts=1 :tmi.twitch.tv CLEARCHAT #channel :SomeOne\r\n@login=x;target-msg-id=m1;tmi-sent-ts=1 :tmi.twitch.tv CLEARMSG #channel :bye\r\n',
    );
    expect(moderation.banUser).toHaveBeenCalledWith('someone');
    expect(moderation.deleteMessage).toHaveBeenCalledWith('m1');
  });

  it('gives an announcement without a known color the channel color', () => {
    socket().receive(
      '@badges=;display-name=Mod;id=n1;login=mod;msg-id=announcement;msg-param-color=RAINBOW;tmi-sent-ts=1 :tmi.twitch.tv USERNOTICE #channel :hello\r\n',
    );
    expect(received[0]).toMatchObject({
      variant: 'announcement',
      announcementColor: 'PRIMARY',
      userLower: 'mod',
    });
  });
});
