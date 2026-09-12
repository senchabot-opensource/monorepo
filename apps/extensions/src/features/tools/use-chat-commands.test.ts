import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessagesType } from '../widgets/chat-widget/chat-messages';
import { parseCommandUsers, resolveCommandUsers } from './command-users';
import { type ObsBridgeCustomCommands, resolveObsCommands } from './obs-bridge-config';
import { useChat } from './use-chat';

const { obs, chat } = vi.hoisted(() => ({
  obs: {
    calls: [] as unknown[][],
    scenes: [] as string[],
    handlers: new Map<string, () => Promise<void> | void>(),
  },
  chat: {} as Record<'twitch' | 'kick', (m: ChatMessagesType) => void>,
}));

vi.mock('obs-websocket-js', () => ({
  OBSWebSocket: class {
    on(event: string, handler: () => void) {
      obs.handlers.set(event, handler);
    }
    async connect() {}
    async disconnect() {}
    async call(request: string, data?: unknown) {
      if (request === 'GetSceneList') {
        return { scenes: obs.scenes.map((sceneName) => ({ sceneName })) };
      }
      obs.calls.push(data === undefined ? [request] : [request, data]);
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

const say = (message: string, user = 'mod', platform: 'twitch' | 'kick' = 'twitch') => {
  const now = new Date();
  chat[platform]({
    id: `${user}-${message}`,
    platform,
    user,
    message,
    timestamp: now,
    receivedAt: now,
  });
};

/** Starts the bridge as the tool page does, then waits for OBS to report its scenes. */
const bridge = async (
  commands: ObsBridgeCustomCommands = {},
  commandUser = 'twitch:mod',
  channels: { twitch?: string; kick?: string } = { twitch: 'channel' },
) => {
  const allowed = resolveCommandUsers(parseCommandUsers(commandUser), {
    twitch: Boolean(channels.twitch),
    kick: Boolean(channels.kick),
  }).allowed;
  renderHook(() =>
    useChat(
      'Main',
      'BRB',
      channels.twitch,
      channels.kick,
      null,
      undefined,
      allowed,
      undefined,
      undefined,
      resolveObsCommands(commands),
    ),
  );
  await obs.handlers.get('Identified')?.();
};

const scene = (sceneName: string) => ['SetCurrentProgramScene', { sceneName }];

beforeEach(() => {
  obs.calls = [];
  obs.scenes = ['Main', 'BRB', 'Gaming Setup', 'Gaming', 'Just Chatting', ' Outro '];
  obs.handlers.clear();
});

describe('OBS Bridge command matching', () => {
  it('runs each default command on an exact match', async () => {
    await bridge();
    for (const message of [
      '!startstream',
      '!stopstream',
      '!startrecord',
      '!stoprecord',
      'brb',
      'back',
    ]) {
      say(message);
    }
    expect(obs.calls).toEqual([
      ['StartStream'],
      ['StopStream'],
      ['StartRecord'],
      ['StopRecord'],
      scene('BRB'),
      scene('Main'),
    ]);
  });

  it('ignores case and surrounding spaces', async () => {
    await bridge();
    say('  !StartRecord ');
    say('BRB');
    expect(obs.calls).toEqual([['StartRecord'], scene('BRB')]);
  });

  it('does not run a command followed by more text or glued to other text', async () => {
    await bridge();
    for (const message of ['!startrecord now', 'brb 5 min', 'brbb', 'going back', '!stopstreams']) {
      say(message);
    }
    expect(obs.calls).toEqual([]);
  });

  it('uses custom commands, trimmed and in any case, instead of the defaults', async () => {
    await bridge({ cmdBrb: ' AFK ', cmdStartStream: '!Live' });
    say('brb');
    say('!startstream');
    say('afk');
    say('!LIVE');
    say('back');
    expect(obs.calls).toEqual([scene('BRB'), ['StartStream'], scene('Main')]);
  });

  it('falls back to the default for a blank custom command', async () => {
    await bridge({ cmdBack: '   ' });
    say('back');
    expect(obs.calls).toEqual([scene('Main')]);
  });

  it('ignores commands from users who are not allowed', async () => {
    await bridge();
    say('brb', 'viewer');
    expect(obs.calls).toEqual([]);
  });
});

describe('OBS Bridge scene command', () => {
  it('prefers an exact scene name over an earlier partial match', async () => {
    await bridge();
    say('!scene gaming');
    expect(obs.calls).toEqual([scene('Gaming')]);
  });

  it('falls back to the first scene containing the text', async () => {
    await bridge();
    say('!scene chat');
    say('!SCENE setup');
    expect(obs.calls).toEqual([scene('Just Chatting'), scene('Gaming Setup')]);
  });

  it('compares scene names trimmed but switches to the name as OBS has it', async () => {
    await bridge();
    say('!scene   outro  ');
    expect(obs.calls).toEqual([scene(' Outro ')]);
  });

  it('does nothing without a name, without a match, or without a space', async () => {
    await bridge();
    say('!scene');
    say('!scene   ');
    say('!scene lobby');
    say('!scenegaming');
    expect(obs.calls).toEqual([]);
  });

  it('uses a custom scene prefix', async () => {
    await bridge({ cmdScene: '!Sahne' });
    say('!scene gaming');
    say('!sahne Gaming');
    expect(obs.calls).toEqual([scene('Gaming')]);
  });
});

describe('OBS Bridge commandUser param', () => {
  it('reads platform-tagged names, including names with a colon', () => {
    expect(parseCommandUsers('twitch:Mod1, KICK:x:y ,youtube:bob')).toEqual([
      { platform: 'twitch', name: 'mod1' },
      { platform: 'kick', name: 'x:y' },
      // An unknown prefix is part of an old untagged name.
      { platform: null, name: 'youtube:bob' },
    ]);
  });

  it('drops empty names and repeats', () => {
    expect(parseCommandUsers('twitch:,kick: ,bob,BOB, ,,twitch:bob')).toEqual([
      { platform: null, name: 'bob' },
      { platform: 'twitch', name: 'bob' },
    ]);
  });

  it('lets a legacy untagged name run commands when the link has one platform', async () => {
    await bridge({}, 'Mod', { kick: '123' });
    say('brb', 'mod', 'kick');
    expect(obs.calls).toEqual([scene('BRB')]);
  });
});
