import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import { KickChat } from './kick';
import { parseTags, TwitchChat } from './twitch';

// Lines and payloads below were captured from live Twitch IRC and Kick Pusher, names replaced.

class FakeWebSocket {
  static last: FakeWebSocket;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  constructor() {
    FakeWebSocket.last = this;
  }
  send() {}
  close() {}
}

let received: ChatMessagesType[];

beforeEach(() => {
  received = [];
  vi.stubGlobal('WebSocket', FakeWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const twitchModeration = {
  deleteMessage: vi.fn(),
  banUser: vi.fn(),
  clearAll: vi.fn(),
};

const twitchLines = (...lines: string[]) => {
  vi.clearAllMocks();
  const client = new TwitchChat(
    'channel',
    (m) => received.push(m),
    twitchModeration.deleteMessage,
    twitchModeration.banUser,
    twitchModeration.clearAll,
  );
  FakeWebSocket.last.onmessage?.({ data: lines.join('\r\n') });
  client.disconnect();
  return received;
};

const kickEvent = (event: string, payload: unknown) => {
  const client = new KickChat('1', (m) => received.push(m));
  FakeWebSocket.last.onmessage?.({
    data: JSON.stringify({ event, data: JSON.stringify(payload) }),
  });
  client.disconnect();
  return received;
};

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

describe('TwitchChat', () => {
  it('reads a reply and drops the "@parent " prefix, keeping emotes aligned', () => {
    const [msg] = twitchLines(
      '@badge-info=;badges=;color=#36FF00;display-name=Viewer;emotes=41:10-17;first-msg=0;id=a1;reply-parent-display-name=Parent_1;reply-parent-msg-body=car\\sgoes\\sfast;reply-parent-msg-id=p1;reply-parent-user-login=parent_1;tmi-sent-ts=1789165490905 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #channel :@Parent_1 Kreygasm',
    );
    expect(msg).toMatchObject({
      message: 'Kreygasm',
      emotes: '41:0-7',
      replyTo: { user: 'Parent_1', message: 'car goes fast' },
    });
  });

  it('flags a first-time chatter and a Highlight My Message', () => {
    const [first, highlighted] = twitchLines(
      '@badges=;color=;display-name=NewPerson;emotes=;first-msg=1;id=f1;returning-chatter=0;tmi-sent-ts=1789165471091 :newperson!newperson@newperson.tmi.twitch.tv PRIVMSG #channel :glorp',
      '@badges=;color=;display-name=Fan;emotes=;first-msg=0;id=h1;msg-id=highlighted-message;tmi-sent-ts=1789165438708 :fan!fan@fan.tmi.twitch.tv PRIVMSG #channel :look at this',
    );
    expect(first).toMatchObject({ firstMessage: true, variant: undefined });
    expect(highlighted).toMatchObject({ variant: 'highlighted', firstMessage: undefined });
  });

  it('turns an announcement USERNOTICE into a message with its color', () => {
    const [msg] = twitchLines(
      '@badge-info=;badges=moderator/1,partner/1;color=#1976D2;display-name=Fossabot;emotes=;flags=;id=n1;login=fossabot;mod=1;msg-id=announcement;msg-param-color=PRIMARY;room-id=1;subscriber=0;system-msg=;tmi-sent-ts=1789165459544;user-id=2;user-type=mod;vip=0 :tmi.twitch.tv USERNOTICE #channel :Download the BetterTTV extension!',
    );
    expect(msg).toMatchObject({
      id: 'n1',
      user: 'Fossabot',
      message: 'Download the BetterTTV extension!',
      variant: 'announcement',
      announcementColor: 'PRIMARY',
      badges: ['moderator/1', 'partner/1'],
    });
  });

  it('leaves subs and other USERNOTICEs out', () => {
    expect(
      twitchLines(
        '@badge-info=subscriber/4;badges=subscriber/3;display-name=Subber;id=s1;login=subber;msg-id=resub;msg-param-cumulative-months=4;tmi-sent-ts=1789165478997 :tmi.twitch.tv USERNOTICE #channel',
        '@display-name=Watcher;id=w1;login=watcher;msg-id=viewermilestone;tmi-sent-ts=1789165472656 :tmi.twitch.tv USERNOTICE #channel :Yay',
      ),
    ).toEqual([]);
  });

  it('removes only the timed-out user on CLEARCHAT with a target', () => {
    twitchLines(
      '@ban-duration=350;room-id=1;target-user-id=2;tmi-sent-ts=1642719320727 :tmi.twitch.tv CLEARCHAT #channel :Ronni',
    );
    expect(twitchModeration.banUser).toHaveBeenCalledWith('ronni');
    expect(twitchModeration.clearAll).not.toHaveBeenCalled();
  });

  it('clears everything on CLEARCHAT without a target', () => {
    twitchLines('@room-id=1;tmi-sent-ts=1642715695392 :tmi.twitch.tv CLEARCHAT #channel');
    expect(twitchModeration.clearAll).toHaveBeenCalledOnce();
    expect(twitchModeration.banUser).not.toHaveBeenCalled();
  });

  it('deletes the message named by CLEARMSG', () => {
    twitchLines(
      '@login=viewer;room-id=;target-msg-id=m1;tmi-sent-ts=1642720582342 :tmi.twitch.tv CLEARMSG #channel :what a great day',
    );
    expect(twitchModeration.deleteMessage).toHaveBeenCalledWith('m1');
  });

  it('shows chat text that names a moderation command as a normal message', () => {
    const messages = twitchLines(
      '@badges=;display-name=Viewer;id=c1;tmi-sent-ts=1789165490905 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #channel :a CLEARCHAT b',
      '@badges=;display-name=Viewer;id=c2;tmi-sent-ts=1789165490906 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #channel :a CLEARMSG b',
    );
    expect(messages.map((m) => m.message)).toEqual(['a CLEARCHAT b', 'a CLEARMSG b']);
    expect(twitchModeration.clearAll).not.toHaveBeenCalled();
    expect(twitchModeration.banUser).not.toHaveBeenCalled();
    expect(twitchModeration.deleteMessage).not.toHaveBeenCalled();
  });

  it('does not read a raw IRC line typed into a resub message', () => {
    expect(
      twitchLines(
        '@badges=subscriber/3;display-name=Subber;id=s1;login=subber;msg-id=resub;tmi-sent-ts=1789165478997 :tmi.twitch.tv USERNOTICE #channel :@badges=broadcaster/1;display-name=TheStreamer;id=fake1 :x!x PRIVMSG #channel :hi',
      ),
    ).toEqual([]);
  });
});

describe('KickChat', () => {
  const sender = {
    id: 1,
    username: 'Viewer',
    slug: 'viewer',
    identity: { color: '#B9D6F6', badges: [] },
  };

  it('reads a reply from its metadata', () => {
    const [msg] = kickEvent('App\\Events\\ChatMessageEvent', {
      id: 'k1',
      chatroom_id: 1,
      content: 'why steal from me',
      type: 'reply',
      created_at: '2026-09-11T22:23:49+00:00',
      sender,
      metadata: {
        original_sender: { id: 2, username: 'Parent_1' },
        original_message: { id: 'p1', content: 'chat was fast [emote:3307478:confused]' },
        message_ref: '1789165428779',
      },
    });
    expect(msg).toMatchObject({
      message: 'why steal from me',
      replyTo: { user: 'Parent_1', message: 'chat was fast [emote:3307478:confused]' },
    });
  });

  it('keeps a plain message without reply context', () => {
    const [msg] = kickEvent('App\\Events\\ChatMessageEvent', {
      id: 'k2',
      chatroom_id: 1,
      content: 'hello',
      type: 'message',
      created_at: '2026-09-11T22:23:48+00:00',
      sender,
      metadata: { message_ref: '1789165427696' },
    });
    expect(msg.replyTo).toBeUndefined();
  });
});
