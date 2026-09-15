import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import { FakeWebSocket } from '#/test/browser';
import { getKickChannelInfo, KickChat } from './kick';

// Payloads below follow what Kick's Pusher sent on 2026-09-15 (60 channels, 32039 messages),
// names replaced.

let received: ChatMessagesType[];
const moderation = { deleteMessage: vi.fn(), banUser: vi.fn(), clearAll: vi.fn() };
let client: KickChat | null;

const socket = () => FakeWebSocket.instances[FakeWebSocket.instances.length - 1];

const push = (event: string, payload: unknown, channel = 'chatrooms.1.v2') =>
  socket().receive(JSON.stringify({ event, data: JSON.stringify(payload), channel }));

const sender = {
  id: 22416633,
  username: 'Arron1990',
  slug: 'arron1990',
  identity: {
    color: '#72ACED',
    badges: [
      { type: 'subscriber', text: 'Subscriber', count: 10, sort_order: 9 },
      { type: 'og', text: 'OG' },
    ],
  },
};

const chatMessage = (patch: Record<string, unknown> = {}) => ({
  id: '21ef3210-7749-484c-b64a-ccaa1827c36f',
  chatroom_id: 1,
  content: '[emote:37227:LULW]',
  type: 'message',
  created_at: '2026-09-15T17:39:33+00:00',
  sender,
  metadata: { message_ref: '1789493972822' },
  ...patch,
});

beforeEach(() => {
  received = [];
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  client = new KickChat(
    ' 1 ',
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

describe('KickChat', () => {
  it('subscribes to the trimmed chatroom on every new connection', () => {
    expect(socket().sent.map((s) => JSON.parse(s))).toEqual([
      { event: 'pusher:subscribe', data: { channel: 'chatrooms.1.v2' } },
    ]);
  });

  it('reads a message with its badges, color and time', () => {
    push('App\\Events\\ChatMessageEvent', chatMessage());
    expect(received).toEqual([
      {
        id: '21ef3210-7749-484c-b64a-ccaa1827c36f',
        user: 'Arron1990',
        message: '[emote:37227:LULW]',
        platform: 'kick',
        timestamp: new Date('2026-09-15T17:39:33+00:00'),
        receivedAt: new Date('2026-09-15T17:39:33+00:00'),
        color: '#72ACED',
        badges: ['subscriber/10', 'og'],
        replyTo: undefined,
      },
    ]);
  });

  it('drops the invisible suffix of a repeated message', () => {
    push('App\\Events\\ChatMessageEvent', chatMessage({ content: '!poll end \u{E0000}' }));
    expect(received[0].message).toBe('!poll end');
  });

  it('ignores a message without a sender or text', () => {
    push('App\\Events\\ChatMessageEvent', chatMessage({ sender: undefined }));
    push('App\\Events\\ChatMessageEvent', chatMessage({ content: null }));
    expect(received).toEqual([]);
  });

  it('deletes the message a MessageDeletedEvent names, not the event itself', () => {
    push('App\\Events\\MessageDeletedEvent', {
      id: '295a6167-d121-4472-b633-8271e3226837',
      message: { id: 'f66c440d-5eb7-4fcf-80d5-185eb75ff465' },
      aiModerated: false,
      violatedRules: [],
    });
    expect(moderation.deleteMessage).toHaveBeenCalledExactlyOnceWith(
      'f66c440d-5eb7-4fcf-80d5-185eb75ff465',
    );
  });

  it('removes a banned or timed-out user by username', () => {
    push('App\\Events\\UserBannedEvent', {
      id: '7c294b5d',
      user: { id: 123443459, username: 'Neggesh', slug: 'neggesh' },
      banned_by: { id: 0, username: 'NG_SUJAL', slug: 'ng_sujal' },
      permanent: true,
    });
    push('App\\Events\\UserBannedEvent', {
      id: '7c294b5e',
      user: { id: 1, username: 'Timed_Out', slug: 'timed-out' },
      banned_by: { id: 2, username: 'Mod', slug: 'mod' },
      permanent: false,
      duration: 5,
    });
    expect(moderation.banUser.mock.calls).toEqual([['neggesh'], ['timed_out']]);
  });

  it('does nothing on an unban', () => {
    push('App\\Events\\UserUnbannedEvent', {
      id: 'u',
      user: { id: 1, username: 'Neggesh', slug: 'neggesh' },
      unbanned_by: { id: 0, username: 'Mod', slug: 'mod' },
    });
    expect(moderation.banUser).not.toHaveBeenCalled();
  });

  it('clears the chat on ChatroomClearEvent', () => {
    push('App\\Events\\ChatroomClearEvent', { id: 'e07e2bf3' });
    expect(moderation.clearAll).toHaveBeenCalledOnce();
  });

  it('ignores pinned messages, Pusher frames and garbage', () => {
    push('App\\Events\\PinnedMessageCreatedEvent', { message: chatMessage() });
    socket().receive(
      JSON.stringify({
        event: 'pusher:connection_established',
        data: '{"socket_id":"1.2","activity_timeout":120}',
      }),
    );
    socket().receive(JSON.stringify({ event: 'pusher:pong', data: {} }));
    socket().receive('not json');
    socket().receive(JSON.stringify({ event: 'App\\Events\\ChatMessageEvent', data: '{broken' }));
    expect(received).toEqual([]);
    expect(moderation.deleteMessage).not.toHaveBeenCalled();
  });

  it('keeps the parent of a reply', () => {
    push(
      'App\\Events\\ChatMessageEvent',
      chatMessage({
        type: 'reply',
        content: 'no',
        metadata: {
          original_sender: { id: 2, username: 'Parent_1' },
          original_message: { id: 'p1', content: 'yes?' },
        },
      }),
    );
    expect(received[0].replyTo).toEqual({ user: 'Parent_1', message: 'yes?' });
  });
});

describe('getKickChannelInfo', () => {
  it('reads the ids and badges kick.com answers with', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 7,
          user_id: 8,
          chatroom: { id: 9 },
          subscriber_badges: [{ months: 1 }],
        }),
      ),
    );
    await expect(getKickChannelInfo(' streamer ')).resolves.toEqual({
      chatroomId: '9',
      channelId: '7',
      userId: '8',
      subscriberBadges: [{ months: 1 }],
      notFound: false,
    });
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('https://kick.com/api/v1/channels/streamer');
  });

  it('tells a missing channel from a failed lookup', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 404 }));
    await expect(getKickChannelInfo('nobody')).resolves.toMatchObject({
      chatroomId: null,
      notFound: true,
    });
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 403 }));
    await expect(getKickChannelInfo('blocked')).resolves.toMatchObject({
      chatroomId: null,
      notFound: false,
    });
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(getKickChannelInfo('offline')).resolves.toMatchObject({
      chatroomId: null,
      notFound: false,
    });
  });

  it('never puts a slash or query of a typed name into the path', async () => {
    await getKickChannelInfo('a/b?c');
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('https://kick.com/api/v1/channels/a%2Fb%3Fc');
  });
});
