import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OBSWebSocket } from '#/test/fake-obs-websocket';
import type { ChatMessagesType } from '../widgets/chat-widget/chat-messages';
import { parseCommandUsers, resolveCommandUsers } from './command-users';
import { type ObsBridgeCustomCommands, resolveObsCommands } from './obs-bridge-config';
import { type ObsActivity, type ObsState, useChat } from './use-chat';

vi.mock('obs-websocket-js', () => import('#/test/fake-obs-websocket'));

const { chats } = vi.hoisted(() => ({
  chats: [] as {
    platform: 'twitch' | 'kick';
    channel: string;
    onMessage: (m: ChatMessagesType) => void;
    disconnected: boolean;
  }[],
}));

vi.mock('#/lib/twitch', () => ({
  TwitchChat: class {
    chat: (typeof chats)[number];
    constructor(channel: string, onMessage: (m: ChatMessagesType) => void) {
      this.chat = { platform: 'twitch', channel, onMessage, disconnected: false };
      chats.push(this.chat);
    }
    disconnect() {
      this.chat.disconnected = true;
    }
  },
}));

vi.mock('#/lib/kick', () => ({
  KickChat: class {
    chat: (typeof chats)[number];
    constructor(channel: string, onMessage: (m: ChatMessagesType) => void) {
      this.chat = { platform: 'kick', channel, onMessage, disconnected: false };
      chats.push(this.chat);
    }
    disconnect() {
      this.chat.disconnected = true;
    }
  },
}));

type Props = {
  commandUser?: string;
  commands?: ObsBridgeCustomCommands;
  mainScene?: string;
  brbScene?: string;
  url?: string;
  password?: string;
  twitch?: string;
  kick?: string;
};

const activity: ObsActivity[] = [];
const statuses: ObsState[] = [];
let scenes: string[] = [];

function bridge(initial: Props = {}) {
  const hook = renderHook(
    ({
      commandUser = 'twitch:mod,kick:kmod',
      commands = {},
      mainScene = 'Main',
      brbScene = 'BRB',
      url,
      password,
      twitch = 'streamer',
      kick = '668',
    }: Props) =>
      useChat({
        mainScene,
        brbScene,
        twitchChannel: twitch,
        kickChannelId: kick,
        obsWebsocketUrl: url,
        obsWebsocketPassword: password,
        commandUsers: resolveCommandUsers(parseCommandUsers(commandUser), {
          twitch: Boolean(twitch),
          kick: Boolean(kick),
        }).allowed,
        customCommands: resolveObsCommands(commands),
        onScenes: (next) => {
          scenes = next;
        },
        onStatus: (state) => statuses.push(state),
        onActivity: (entry) => activity.push(entry),
      }),
    { initialProps: initial },
  );
  return hook;
}

async function connect(names: string[]) {
  const obs = OBSWebSocket.latest;
  obs.scenes = names;
  // obs-websocket-js emits Identified before connect() resolves.
  await act(async () => {
    obs.emit('Identified');
    obs.accept();
  });
  return obs;
}

function say(
  message: string,
  user = 'mod',
  platform: 'twitch' | 'kick' = 'twitch',
  userLower?: string,
  replyTo?: ChatMessagesType['replyTo'],
) {
  const chat = chats.filter((c) => c.platform === platform && !c.disconnected).at(-1);
  if (!chat) throw new Error(`No ${platform} chat`);
  const now = new Date();
  act(() =>
    chat.onMessage({
      id: `${user}-${message}-${Math.random()}`,
      platform,
      user,
      userLower,
      message,
      timestamp: now,
      receivedAt: now,
      replyTo,
    }),
  );
}

const switches = (obs = OBSWebSocket.latest) =>
  obs.calls
    .filter(([request]) => request === 'SetCurrentProgramScene')
    .map(([, data]) => (data as { sceneName: string }).sceneName);

const requests = (obs = OBSWebSocket.latest) =>
  obs.calls.map(([request]) => request).filter((request) => request !== 'GetSceneList');

const flush = () => act(async () => {});

beforeEach(() => {
  OBSWebSocket.instances = [];
  chats.length = 0;
  activity.length = 0;
  statuses.length = 0;
  scenes = [];
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('OBS Bridge scene list', () => {
  it('lists the scenes in the order OBS shows them, not obs-websocket’s bottom-to-top order', async () => {
    bridge();
    await connect(['Starting Soon', 'Main', 'BRB', 'Ending']);
    expect(scenes).toEqual(['Starting Soon', 'Main', 'BRB', 'Ending']);
  });

  it('switches to the topmost scene whose name contains the text, as the setup page promises', async () => {
    bridge();
    await connect(['Gaming', 'Gaming Setup', 'Main', 'BRB']);
    say('!scene gam');
    expect(switches()).toEqual(['Gaming']);
  });

  it('refreshes the list when OBS says it changed', async () => {
    bridge();
    const obs = await connect(['Main', 'BRB']);
    obs.scenes = ['Main', 'BRB', 'New One'];
    await act(async () => obs.emit('SceneListChanged', { scenes: [] }));
    expect(scenes).toEqual(['Main', 'BRB', 'New One']);
    say('!scene new one');
    expect(switches()).toEqual(['New One']);
  });

  it('switches to scenes whose names have spaces, symbols and emoji', async () => {
    bridge();
    await connect(['Oyun & Sohbet 🎮', 'Main (cam)', 'BRB [2]', 'İstanbul Gece']);
    say('!scene oyun & sohbet 🎮');
    say('!scene (cam)');
    say('!scene [2]');
    say('!scene .*');
    expect(switches()).toEqual(['Oyun & Sohbet 🎮', 'Main (cam)', 'BRB [2]']);
    expect(activity.at(-1)?.outcome).toEqual({ kind: 'noScene', query: '.*' });
  });

  it('ignores case with Turkish İ, I and ı too, in scene names and command names', async () => {
    bridge({ commands: { cmdBrb: '!geri' } });
    await connect(['Main', 'İstanbul Gece', 'BRB']);
    say('!scene istanbul');
    say('!SCENE İSTANBUL');
    say('!GERİ');
    expect(switches()).toEqual(['İstanbul Gece', 'İstanbul Gece', 'BRB']);
  });

  it('runs no command sent as a reply on either platform, which may be teaching someone', async () => {
    bridge();
    await connect(['Main', 'BRB']);
    const parent = { user: 'Viewer', message: 'how do I switch?' };
    say('brb', 'mod', 'twitch', 'mod', parent);
    say('!scene main', 'kmod', 'kick', 'kmod', parent);
    expect(switches()).toEqual([]);
    say('brb');
    expect(switches()).toEqual(['BRB']);
  });

  it('keeps several spaces between the command and the scene name', async () => {
    bridge();
    await connect(['Main', 'Just Chatting']);
    say('!scene    just chatting');
    expect(switches()).toEqual(['Just Chatting']);
  });

  it('says OBS is offline for a scene command before any scene list came in', async () => {
    bridge();
    say('!scene main');
    expect(switches()).toEqual([]);
    expect(activity.map((a) => a.outcome)).toEqual([
      { kind: 'failed', offline: true, message: '' },
    ]);
  });
});

describe('OBS Bridge requests', () => {
  it('reports a request OBS refuses with its reason', async () => {
    bridge();
    const obs = await connect(['Main']);
    vi.spyOn(obs, 'call').mockRejectedValueOnce(
      Object.assign(new Error('No source was found by the name of `BRB`.'), { code: 600 }),
    );
    say('brb');
    await flush();
    expect(activity.at(-1)?.outcome).toEqual({
      kind: 'failed',
      offline: false,
      message: 'No source was found by the name of `BRB`.',
    });
  });

  it('reports a command sent while OBS is still identifying as offline, without a crash', async () => {
    bridge();
    vi.spyOn(OBSWebSocket.latest, 'call').mockRejectedValue(new Error('Socket not identified'));
    say('!startstream');
    await flush();
    expect(activity.map((a) => a.outcome)).toEqual([
      { kind: 'failed', offline: true, message: 'Socket not identified' },
    ]);
  });

  it('numbers commands in the order they came in, even when OBS answers out of order', async () => {
    bridge();
    const obs = await connect(['Main', 'BRB']);
    let finishFirst = () => {};
    vi.spyOn(obs, 'call').mockImplementationOnce(
      () => new Promise((resolve) => (finishFirst = () => resolve({}))),
    );
    say('!startrecord');
    say('brb');
    await flush();
    await act(async () => finishFirst());
    expect(activity.map((a) => [a.id, a.outcome.kind === 'done' && a.outcome.action])).toEqual([
      [2, 'brb'],
      [1, 'startRecord'],
    ]);
  });

  it('forgets its wait on the connection once OBS answers, so nothing piles up', async () => {
    bridge();
    const obs = await connect(['Main', 'BRB']);
    const before = obs.listenerCount('ConnectionClosed');
    for (let i = 0; i < 5; i++) say('brb');
    await flush();
    expect(obs.listenerCount('ConnectionClosed')).toBe(before);
    expect(activity).toHaveLength(5);
  });
});

describe('OBS Bridge command users', () => {
  it('knows a Kick user whatever the case of their username in chat', async () => {
    bridge({ commandUser: 'kick:Liliuy_56' });
    await connect(['Main', 'BRB']);
    say('brb', 'Liliuy_56', 'kick');
    expect(switches()).toEqual(['BRB']);
  });

  it('shows the name as chat shows it, but checks the login', async () => {
    bridge({ commandUser: 'twitch:oinotityoudai' });
    await connect(['Main', 'BRB']);
    say('brb', 'お命頂戴', 'twitch', 'oinotityoudai');
    await flush();
    expect(activity.map((a) => [a.platform, a.user, a.text])).toEqual([
      ['twitch', 'お命頂戴', 'brb'],
    ]);
  });

  it('applies a changed user list and changed commands without reconnecting anything', async () => {
    const { rerender } = bridge({ commandUser: 'twitch:mod' });
    const obs = await connect(['Main', 'BRB']);
    say('brb', 'newmod');
    rerender({ commandUser: 'twitch:mod,twitch:newmod', commands: { cmdBrb: 'afk' } });
    say('brb', 'newmod');
    say('afk', 'newmod');
    expect(switches(obs)).toEqual(['BRB']);
    expect(OBSWebSocket.instances).toHaveLength(1);
    expect(chats.filter((c) => c.disconnected)).toEqual([]);
  });

  it('switches to Main and BRB picked after the bridge started', async () => {
    const { rerender } = bridge();
    await connect(['Main', 'BRB', 'Cam', 'AFK']);
    rerender({ mainScene: 'Cam', brbScene: 'AFK' });
    say('brb');
    say('back');
    expect(switches()).toEqual(['AFK', 'Cam']);
  });

  it('ignores a message with nothing but spaces', async () => {
    bridge();
    await connect(['Main', 'BRB']);
    say('   ');
    expect(requests()).toEqual([]);
    expect(activity).toEqual([]);
  });

  it('runs a custom command with non-Latin letters in any case', async () => {
    bridge({ commands: { cmdBrb: '!Mola', cmdScene: '!Sahne' } });
    await connect(['Main', 'BRB', 'Oyun']);
    say('!MOLA');
    say('!sahne OYUN');
    expect(switches()).toEqual(['BRB', 'Oyun']);
  });
});

describe('OBS Bridge OBS connection', () => {
  it('makes one new connection when the address changes, and the old one stops retrying', async () => {
    vi.useFakeTimers();
    const { rerender } = bridge({ url: '192.168.1.5:4455' });
    const first = OBSWebSocket.latest;
    await act(async () => first.refuse());
    rerender({ url: '192.168.1.6:4455' });
    expect(OBSWebSocket.instances).toHaveLength(2);
    expect(OBSWebSocket.latest.connectArgs).toEqual([['ws://192.168.1.6:4455', undefined]]);

    await act(async () => vi.advanceTimersByTime(20_000));
    expect(first.connectArgs).toHaveLength(1);
  });

  it('does not reconnect when the chat channels change', async () => {
    const { rerender } = bridge();
    await connect(['Main']);
    rerender({ twitch: 'other', kick: '' });
    expect(OBSWebSocket.instances).toHaveLength(1);
    expect(chats.map((c) => [c.platform, c.channel, c.disconnected])).toEqual([
      ['twitch', 'streamer', true],
      ['kick', '668', true],
      ['twitch', 'other', false],
    ]);
  });

  it('reconnects once after a live connection drops, and keeps retrying every 5s', async () => {
    vi.useFakeTimers();
    bridge();
    const obs = await connect(['Main']);
    await act(async () => obs.emit('ConnectionClosed', { code: 1006, message: '' }));
    expect(statuses.at(-1)).toMatchObject({ status: 'disconnected', code: 1006 });

    await act(async () => vi.advanceTimersByTime(5_000));
    expect(obs.connectArgs).toHaveLength(2);
    // The library fires ConnectionClosed for the failed attempt too; that must not add a retry.
    await act(async () => {
      obs.emit('ConnectionClosed', { code: 1006, message: '' });
      obs.refuse();
    });
    await act(async () => vi.advanceTimersByTime(5_000));
    expect(obs.connectArgs).toHaveLength(3);
    expect(statuses.at(-1)).toMatchObject({ status: 'failed', attempt: 2, retryAt: null });
  });

  it('counts attempts up while OBS keeps refusing, and back to zero once connected', async () => {
    vi.useFakeTimers();
    bridge();
    const obs = OBSWebSocket.latest;
    await act(async () => obs.refuse());
    await act(async () => vi.advanceTimersByTime(5_000));
    await act(async () => obs.refuse(4009, 'Authentication failed.'));
    expect(statuses.at(-1)).toMatchObject({
      status: 'failed',
      attempt: 2,
      code: 4009,
      reason: 'Authentication failed.',
    });
    await act(async () => vi.advanceTimersByTime(5_000));
    await act(async () => obs.accept());
    expect(statuses.at(-1)).toMatchObject({ status: 'connected', attempt: 0, code: null });
  });

  it('stops everything on unmount, even with a connection attempt still running', async () => {
    vi.useFakeTimers();
    const { unmount } = bridge();
    const obs = OBSWebSocket.latest;
    const disconnect = vi.spyOn(obs, 'disconnect');
    unmount();
    const reported = statuses.length;
    await act(async () => obs.refuse());
    await act(async () => vi.advanceTimersByTime(30_000));
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(obs.connectArgs).toHaveLength(1);
    expect(statuses).toHaveLength(reported);
    expect(chats.every((c) => c.disconnected)).toBe(true);
  });

  it('reports a command left waiting when the page closes', async () => {
    const { unmount } = bridge();
    const obs = await connect(['Main', 'BRB']);
    obs.holdCalls = true;
    say('!startstream');
    vi.spyOn(obs, 'disconnect').mockImplementation(async () => {
      obs.emit('ConnectionClosed', { code: 1000, message: '' });
    });
    unmount();
    await flush();
    expect(activity.map((a) => a.outcome.kind)).toEqual(['failed']);
    expect(obs.listenerCount('ConnectionClosed')).toBe(1);
  });
});
