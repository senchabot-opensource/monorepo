import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import { KickChat } from './kick';
import { TwitchChat } from './twitch';

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

const twitchLines = (...lines: string[]) => {
  const client = new TwitchChat('channel', (m) => received.push(m));
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
