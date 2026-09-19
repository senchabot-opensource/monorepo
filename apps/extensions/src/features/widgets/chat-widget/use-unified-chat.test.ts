import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type ChatMessagesType, chatMessagesCollection } from './chat-messages';
import { useUnifiedChat } from './use-unified-chat';

type Callbacks = {
  message: (m: ChatMessagesType) => void;
  remove: (id: string) => void;
  ban: (userLower: string) => void;
  clear: () => void;
  channel: string;
  disconnected: boolean;
};

const { clients, fakeClient } = vi.hoisted(() => {
  const clients = {} as Record<'twitch' | 'kick', Callbacks>;
  const fakeClient = (platform: 'twitch' | 'kick') =>
    class {
      private callbacks: Callbacks;
      constructor(
        channel: string,
        message: Callbacks['message'],
        remove: Callbacks['remove'],
        ban: Callbacks['ban'],
        clear: Callbacks['clear'],
      ) {
        this.callbacks = { message, remove, ban, clear, channel, disconnected: false };
        clients[platform] = this.callbacks;
      }
      disconnect() {
        this.callbacks.disconnected = true;
      }
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
  for (const key of [...chatMessagesCollection.keys()]) chatMessagesCollection.delete(key);
  for (const platform of ['twitch', 'kick'] as const) delete clients[platform];
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

describe('useUnifiedChat store', () => {
  it('keeps the newest 100 messages and forgets who wrote the dropped ones', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('twitch', 'old', 'Early', 'early');
    for (let i = 0; i < 100; i++) say('twitch', `n${i}`, 'Viewer', 'viewer');
    expect(chatMessagesCollection.size).toBe(100);
    expect(chatMessagesCollection.has('old')).toBe(false);
    // Banning someone whose messages already scrolled out finds nothing to remove.
    expect(() => clients.twitch.ban('early')).not.toThrow();
    clients.twitch.ban('viewer');
    expect(chatMessagesCollection.size).toBe(0);
    unmount();
  });

  it('bans every message of a user, including after one was deleted', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('twitch', 't1', 'Bob', 'bob');
    say('twitch', 't2', 'Bob', 'bob');
    say('twitch', 't3', 'Ann', 'ann');
    clients.twitch.remove('t1');
    expect(() => clients.twitch.ban('bob')).not.toThrow();
    expect(shown('t1', 't2', 't3')).toEqual(['t3']);
    unmount();
  });

  it('shrugs off moderation for messages it never had', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    expect(() => {
      clients.twitch.remove('nope');
      clients.kick.ban('nobody');
      clients.twitch.clear();
      clients.twitch.clear();
    }).not.toThrow();
    unmount();
  });

  it('bans a Kick user whose name has capitals', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('kick', 'k1', 'Neggesh');
    clients.kick.ban('neggesh');
    expect(shown('k1')).toEqual([]);
    unmount();
  });

  it('stamps each message with the time it arrived, not the time it was sent', () => {
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('twitch', 't1', 'Ann', 'ann');
    expect(chatMessagesCollection.get('t1')?.receivedAt.getTime()).toBeGreaterThan(0);
    expect(chatMessagesCollection.get('t1')?.timestamp.getTime()).toBe(0);
    unmount();
  });

  it('gives messages that arrive in the same millisecond times in arrival order', () => {
    vi.useFakeTimers({ now: 5_000 });
    const { unmount } = renderHook(() => useUnifiedChat('channel', '1'));
    say('twitch', 'c', 'Ann', 'ann');
    say('kick', 'a', 'Kim');
    say('twitch', 'b', 'Ann', 'ann');
    const at = (id: string) => chatMessagesCollection.get(id)?.receivedAt.getTime();
    expect([at('c'), at('a'), at('b')]).toEqual([5_000, 5_001, 5_002]);
    vi.setSystemTime(9_000);
    say('twitch', 'd', 'Ann', 'ann');
    expect(at('d')).toBe(9_000);
    unmount();
    vi.useRealTimers();
  });

  it('connects to nothing without channels, and trims what it gets', () => {
    const { rerender, unmount } = renderHook(
      ({ twitch, kick }: { twitch?: string; kick?: string | null }) => useUnifiedChat(twitch, kick),
      { initialProps: { twitch: '  ', kick: null } as { twitch?: string; kick?: string | null } },
    );
    expect(clients.twitch).toBeUndefined();
    expect(clients.kick).toBeUndefined();
    rerender({ twitch: ' streamer ', kick: ' 9 ' });
    expect(clients.twitch.channel).toBe('streamer');
    expect(clients.kick.channel).toBe('9');
    unmount();
  });

  it('keeps the Twitch connection when the Kick id arrives late, and closes both on unmount', () => {
    const { rerender, unmount } = renderHook(
      ({ kick }: { kick: string | null }) => useUnifiedChat('streamer', kick),
      { initialProps: { kick: null as string | null } },
    );
    const twitch = clients.twitch;
    rerender({ kick: '9' });
    expect(clients.twitch).toBe(twitch);
    expect(twitch.disconnected).toBe(false);
    const kick = clients.kick;
    unmount();
    expect(twitch.disconnected).toBe(true);
    expect(kick.disconnected).toBe(true);
  });
});
