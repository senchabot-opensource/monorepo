import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessagesType } from '../widgets/chat-widget/chat-messages';
import { parseCommandUsers, resolveCommandUsers } from './command-users';
import { useChat } from './use-chat';

const { obsCall, chat } = vi.hoisted(() => ({
  obsCall: vi.fn(),
  chat: {} as Record<'twitch' | 'kick', (m: ChatMessagesType) => void>,
}));

vi.mock('obs-websocket-js', () => ({
  OBSWebSocket: class {
    on() {}
    async connect() {}
    async disconnect() {}
    async call(request: string) {
      obsCall(request);
    }
  },
}));

vi.mock('#/lib/twitch', () => ({
  TwitchChat: class {
    constructor(_channel: string, onMessage: (m: ChatMessagesType) => void) {
      chat.twitch = onMessage;
    }
    disconnect() {}
  },
}));

vi.mock('#/lib/kick', () => ({
  KickChat: class {
    constructor(_channel: string, onMessage: (m: ChatMessagesType) => void) {
      chat.kick = onMessage;
    }
    disconnect() {}
  },
}));

const say = (platform: 'twitch' | 'kick', user: string, message: string) => {
  const now = new Date();
  chat[platform]({
    id: `${platform}-${user}`,
    platform,
    user,
    message,
    timestamp: now,
    receivedAt: now,
  });
};

const bridge = (commandUser: string) => {
  const allowed = resolveCommandUsers(parseCommandUsers(commandUser), {
    twitch: true,
    kick: true,
  }).allowed;
  renderHook(() =>
    useChat({
      mainScene: 'Main',
      brbScene: 'BRB',
      twitchChannel: 'channel',
      kickChannelId: '1',
      commandUsers: allowed,
    }),
  );
};

beforeEach(() => {
  obsCall.mockClear();
});

describe('useChat command users', () => {
  it('runs a command from the allowed user on the platform they were added for', () => {
    bridge('twitch:bob');
    say('twitch', 'Bob', '!stopstream');
    expect(obsCall).toHaveBeenCalledWith('StopStream');
  });

  it('ignores the same name on the other platform', () => {
    bridge('twitch:bob');
    say('kick', 'bob', '!stopstream');
    expect(obsCall).not.toHaveBeenCalled();
  });

  it('ignores an old untagged name while both platforms are connected', () => {
    bridge('bob');
    say('twitch', 'bob', '!stopstream');
    say('kick', 'bob', '!stopstream');
    expect(obsCall).not.toHaveBeenCalled();
  });
});
