import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type ChatMessagesType, chatMessagesCollection } from './chat-messages';
import { useUnifiedChat } from './use-unified-chat';

type Callbacks = {
  message: (m: ChatMessagesType) => void;
  ban: (userLower: string) => void;
  clear: () => void;
};

const { clients, fakeClient } = vi.hoisted(() => {
  const clients = {} as Record<'twitch' | 'kick', Callbacks>;
  const fakeClient = (platform: 'twitch' | 'kick') =>
    class {
      constructor(
        _channel: string,
        message: Callbacks['message'],
        _delete: unknown,
        ban: Callbacks['ban'],
        clear: Callbacks['clear'],
      ) {
        clients[platform] = { message, ban, clear };
      }
      disconnect() {}
    };
  return { clients, fakeClient };
});

vi.mock('#/lib/twitch', () => ({ TwitchChat: fakeClient('twitch') }));
vi.mock('#/lib/kick', () => ({ KickChat: fakeClient('kick') }));

const say = (platform: 'twitch' | 'kick', id: string, user: string, userLower?: string) =>
  clients[platform].message({
    id,
    platform,
    user,
    userLower,
    message: 'hi',
    timestamp: new Date(0),
    receivedAt: new Date(0),
  });

const shown = (...ids: string[]) => ids.filter((id) => chatMessagesCollection.has(id));

afterEach(() => {
  for (const id of ['t1', 't2', 'k1', 'k2']) {
    if (chatMessagesCollection.has(id)) chatMessagesCollection.delete(id);
  }
});

describe('useUnifiedChat moderation', () => {
  it('removes a Twitch user banned by login even when their display-name is another name', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('twitch', 't1', 'お命頂戴', 'oinotityoudai');
    clients.twitch.ban('oinotityoudai');
    expect(shown('t1')).toEqual([]);
    unmount();
  });

  it('keeps the same name on the other platform when one platform bans it', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('twitch', 't1', 'Bob', 'bob');
    say('kick', 'k1', 'Bob');
    clients.kick.ban('bob');
    expect(shown('t1', 'k1')).toEqual(['t1']);
    unmount();
  });

  it('clears only the platform whose chat was cleared', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('twitch', 't1', 'Ann', 'ann');
    say('kick', 'k1', 'Kim');
    say('kick', 'k2', 'Ann');
    clients.twitch.clear();
    expect(shown('t1', 'k1', 'k2')).toEqual(['k1', 'k2']);
    // The index for the cleared platform is gone, the other one still works.
    clients.kick.ban('ann');
    expect(shown('k1', 'k2')).toEqual(['k1']);
    unmount();
  });
});
