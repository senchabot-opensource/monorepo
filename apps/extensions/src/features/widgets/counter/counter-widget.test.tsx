import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type CounterSettings,
  type CounterSpec,
  DEFAULT_COUNTER_SETTINGS,
} from '#/lib/counter-url';
import { FakeWebSocket } from '#/test/browser';
import { storageKey } from './counter-state';
import { CounterWidget } from './counter-widget';
import { POP_MS, PREVIEW_CHANNEL } from './use-counter';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: '42', channelId: '7', userId: null, subscriberBadges: [] };

// The newest one: an unanswered connect or heartbeat makes the client swap in a new socket.
const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const receive = (host: string, data: string) => act(() => socket(host).receive(data));
const pusher = (channel: string, event: string, data: unknown) =>
  receive('pusher', JSON.stringify({ event, channel, data: JSON.stringify(data) }));
const twitchSays = (tags: string, text: string) =>
  receive(
    'twitch',
    `@${tags};room-id=1 :someone!someone@someone.tmi.twitch.tv PRIVMSG #streamer :${text}`,
  );
const modSays = (text: string) => twitchSays('badges=moderator/1;mod=1', text);
const kickSays = (badge: string | null, text: string) =>
  pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
    content: text,
    type: 'message',
    sender: { username: 'Someone', identity: { badges: badge ? [{ type: badge }] : [] } },
  });

const values = () =>
  screen.getAllByTestId('counter-value').map((value) => Number(value.textContent));
const pops = () => screen.queryAllByTestId('counter-pop').map((pop) => pop.textContent);

const LOSSES: CounterSpec = {
  label: 'Losses',
  command: 'losses',
  icon: '❌',
  iconUrl: '',
  start: 0,
};
const WINS: CounterSpec = { label: 'Wins', command: 'wins', icon: '🏆', iconUrl: '', start: 0 };
const { platforms: _, ...DEFAULTS } = DEFAULT_COUNTER_SETTINGS;
const settings = (overrides: Partial<Omit<CounterSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  counters: [LOSSES, WINS],
  ...overrides,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('CounterWidget', () => {
  it('shows every counter with its label, icon and starting count', () => {
    render(
      <CounterWidget
        twitchChannel="streamer"
        settings={settings({ counters: [{ ...LOSSES, start: 12 }, WINS] })}
      />,
    );
    expect(screen.getByTestId('counter').dataset.layout).toBe('row');
    expect(screen.getAllByTestId('counter-label').map((label) => label.textContent)).toEqual([
      'Losses',
      'Wins',
    ]);
    expect(screen.getAllByTestId('counter-icon').map((icon) => icon.textContent)).toEqual([
      '❌',
      '🏆',
    ]);
    expect(values()).toEqual([12, 0]);
  });

  it('shows a channel emote instead of the icon, and nothing for a counter without either', () => {
    render(
      <CounterWidget
        twitchChannel="streamer"
        settings={settings({
          counters: [
            { ...LOSSES, iconUrl: 'https://cdn.7tv.app/emote/1/2x.webp' },
            { ...WINS, icon: '', label: '' },
          ],
          layout: 'stack',
        })}
      />,
    );
    expect(screen.getByTestId('counter').dataset.layout).toBe('stack');
    const icons = screen.getAllByTestId('counter-icon');
    expect(icons).toHaveLength(1);
    expect(icons[0].getAttribute('src')).toBe('https://cdn.7tv.app/emote/1/2x.webp');
    expect(screen.getAllByTestId('counter-label')).toHaveLength(1);
  });

  it("takes every form of a mod's command, each on its own counter", () => {
    render(<CounterWidget twitchChannel="streamer" settings={settings()} />);
    modSays('!losses');
    expect(values()).toEqual([1, 0]);
    modSays('!losses +3');
    modSays('!losses add 2');
    modSays('!losses +');
    expect(values()).toEqual([7, 0]);
    modSays('!losses -2');
    modSays('!losses remove');
    expect(values()).toEqual([4, 0]);
    modSays('!wins set 9');
    expect(values()).toEqual([4, 9]);
    modSays('!losses reset');
    expect(values()).toEqual([0, 9]);
    modSays('!losses -5');
    expect(values()).toEqual([0, 9]);
    // A repeat marked invisibly by 7TV counts again.
    modSays('!wins \u{E0000}');
    expect(values()).toEqual([0, 10]);
  });

  it('ignores viewers, VIPs, replies, Shared Chat partners and other commands', () => {
    render(<CounterWidget twitchChannel="streamer" settings={settings()} />);
    twitchSays('badges=subscriber/12;mod=0', '!losses');
    twitchSays('badges=vip/1;mod=0', '!losses');
    twitchSays('badges=moderator/1;mod=1;reply-parent-msg-id=abc', '!losses');
    twitchSays('badges=moderator/1;mod=1;source-room-id=2', '!losses');
    modSays('!goal add 1');
    modSays('!losses 5');
    modSays('!losses constructor');
    expect(values()).toEqual([0, 0]);
  });

  it('takes commands from Kick moderators and the broadcaster, not viewers', async () => {
    render(<CounterWidget kickChannel="kicker" settings={settings()} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    kickSays('moderator', '!losses');
    kickSays('broadcaster', '!wins +2');
    kickSays('subscriber', '!losses +5');
    kickSays(null, '!losses +5');
    expect(values()).toEqual([1, 2]);
  });

  it('saves each count by its command, and starts one over from a new starting count', () => {
    const first = render(<CounterWidget twitchChannel="streamer" settings={settings()} />);
    modSays('!losses +4');
    modSays('!wins +2');
    expect(
      JSON.parse(localStorage.getItem(storageKey('streamer', '', 'losses')) ?? 'null'),
    ).toEqual({ count: 4, start: 0 });
    first.unmount();

    // Reordered, with a new starting count for Wins only.
    render(
      <CounterWidget
        twitchChannel="streamer"
        settings={settings({ counters: [{ ...WINS, start: 10 }, LOSSES] })}
      />,
    );
    expect(values()).toEqual([10, 4]);
  });

  it('keeps counting when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<CounterWidget twitchChannel="streamer" settings={settings()} />);
    modSays('!losses');
    expect(values()).toEqual([1, 0]);
  });

  it('floats a change up for adding and removing, not for set and reset', () => {
    render(<CounterWidget twitchChannel="streamer" settings={settings()} />);
    modSays('!losses +3');
    expect(pops()).toEqual(['+3']);
    modSays('!losses -1');
    expect(pops()).toEqual(['+3', '−1']);
    modSays('!losses set 20');
    modSays('!losses reset');
    expect(pops()).toHaveLength(2);
    act(() => vi.advanceTimersByTime(POP_MS));
    expect(pops()).toEqual([]);
  });

  it('keeps at most three pops per counter, and none when they are off', () => {
    const { unmount } = render(<CounterWidget twitchChannel="streamer" settings={settings()} />);
    for (let i = 0; i < 5; i++) modSays('!losses');
    modSays('!wins');
    expect(pops()).toHaveLength(4);
    unmount();
    localStorage.clear();

    render(<CounterWidget twitchChannel="streamer" settings={settings({ pops: false })} />);
    modSays('!losses');
    expect(values()).toEqual([1, 0]);
    expect(pops()).toEqual([]);
  });

  it('never connects or saves in a preview, and counts there on its own', () => {
    // Every simulated change is then +1 on the second counter, 1.2 s in and 2.75 s apart.
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    render(<CounterWidget twitchChannel="streamer" settings={settings()} simulate />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(kickLookup).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1200 + 2750));
    expect(values()).toEqual([0, 2]);
    expect(localStorage.getItem(storageKey('streamer', '', 'wins'))).toBeNull();
  });

  it("plays the setup page's test commands in its own preview only", async () => {
    // Simulated changes, if one comes first, only touch the second counter.
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    render(<CounterWidget settings={settings()} simulate previewId="p1" />);
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({ type: 'command', preview: 'p2', text: '!losses +5' });
    channel.postMessage({ type: 'command', preview: 'p1', text: '!losses +3' });
    await vi.waitFor(() => expect(values()[0]).toBe(3));
    channel.close();
  });

  it('closes both chats when it goes away', async () => {
    const { unmount } = render(
      <CounterWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    await act(async () => {});
    const sockets = [socket('twitch'), socket('pusher')];
    unmount();
    for (const ws of sockets) expect(ws.readyState).toBe(FakeWebSocket.CLOSED);
  });
});
