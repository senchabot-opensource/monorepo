import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import { YouTubeChat } from './youtube';

class FakeWebSocket {
  static last: FakeWebSocket;
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  sent: string[] = [];

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.last = this;
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {}
}

let received: ChatMessagesType[];
const moderation = {
  deleteMessage: vi.fn(),
  banUser: vi.fn(),
  clearAll: vi.fn(),
};

beforeEach(() => {
  received = [];
  vi.clearAllMocks();
  vi.stubGlobal('WebSocket', FakeWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('YouTubeChat', () => {
  it('connects to WebSocket with token and channel query params', () => {
    const client = new YouTubeChat(
      'UC1234567890',
      'test-token-jwt',
      (m) => received.push(m),
      moderation.deleteMessage,
      moderation.banUser,
      moderation.clearAll,
    );

    expect(FakeWebSocket.last).toBeDefined();
    expect(FakeWebSocket.last.url).toContain('token=test-token-jwt');
    expect(FakeWebSocket.last.url).toContain('channel=UC1234567890');
    client.disconnect();
  });

  it('receives and parses incoming chat message frame', () => {
    const client = new YouTubeChat(
      'UC1234567890',
      'test-token-jwt',
      (m) => received.push(m),
      moderation.deleteMessage,
      moderation.banUser,
      moderation.clearAll,
    );

    FakeWebSocket.last.onmessage?.({
      data: JSON.stringify({
        type: 'message',
        id: 'yt-msg-1',
        user: 'SuperFan',
        userLower: 'superfan',
        message: 'Hello stream! 👋',
        platform: 'youtube',
        timestamp: '2026-10-04T12:00:00Z',
        color: '#FF0000',
        badges: ['verified', 'sponsor'],
      }),
    });

    expect(received).toHaveLength(1);
    expect(received[0]).toMatchObject({
      id: 'yt-msg-1',
      user: 'SuperFan',
      userLower: 'superfan',
      message: 'Hello stream! 👋',
      platform: 'youtube',
      color: '#FF0000',
      badges: ['verified', 'sponsor'],
    });

    client.disconnect();
  });

  it('dispatches delete message event', () => {
    const client = new YouTubeChat(
      'UC1234567890',
      'test-token-jwt',
      (m) => received.push(m),
      moderation.deleteMessage,
      moderation.banUser,
      moderation.clearAll,
    );

    FakeWebSocket.last.onmessage?.({
      data: JSON.stringify({
        type: 'delete',
        deletedMessageId: 'yt-msg-999',
      }),
    });

    expect(moderation.deleteMessage).toHaveBeenCalledWith('yt-msg-999');
    client.disconnect();
  });

  it('dispatches ban user event', () => {
    const client = new YouTubeChat(
      'UC1234567890',
      'test-token-jwt',
      (m) => received.push(m),
      moderation.deleteMessage,
      moderation.banUser,
      moderation.clearAll,
    );

    FakeWebSocket.last.onmessage?.({
      data: JSON.stringify({
        type: 'ban',
        bannedUserChannel: 'spammer123',
      }),
    });

    expect(moderation.banUser).toHaveBeenCalledWith('spammer123');
    client.disconnect();
  });

  it('handles offline status frame without disconnecting or erroring', () => {
    const client = new YouTubeChat(
      'UC1234567890',
      'test-token-jwt',
      (m) => received.push(m),
      moderation.deleteMessage,
      moderation.banUser,
      moderation.clearAll,
    );

    expect(() => {
      FakeWebSocket.last.onmessage?.({
        data: JSON.stringify({
          type: 'status',
          status: 'offline',
          channel: 'UC1234567890',
        }),
      });
    }).not.toThrow();

    expect(received).toHaveLength(0);
    client.disconnect();
  });

  it('does not open websocket if token is empty', () => {
    const client = new YouTubeChat(
      'UC1234567890',
      '',
      (m) => received.push(m),
      moderation.deleteMessage,
      moderation.banUser,
      moderation.clearAll,
    );

    expect(FakeWebSocket.last).toBeUndefined();
    client.disconnect();
  });
});
