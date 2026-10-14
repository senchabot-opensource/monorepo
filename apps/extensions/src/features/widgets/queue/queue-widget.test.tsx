import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_QUEUE_SETTINGS, type QueueSettings } from '#/lib/queue-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { storageKey } from './queue-state';
import { QueueWidget } from './queue-widget';
import { PREVIEW_CHANNEL } from './use-queue';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: '42', channelId: '7', userId: null, subscriberBadges: [] };

const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const say = (login: string, text: string, tags = 'badges=') =>
  act(() =>
    socket('twitch').receive(
      `@display-name=${login};${tags};room-id=1 :${login.toLowerCase()}!x@x.tmi.twitch.tv PRIVMSG #streamer :${text}`,
    ),
  );
const modSays = (text: string) => say('Mod', text, 'badges=moderator/1;mod=1');
const waiting = () => screen.queryAllByTestId('queue-row').map((row) => row.textContent);
const playing = () => screen.queryAllByTestId('queue-playing').map((chip) => chip.textContent);

const { platforms: _, ...DEFAULTS } = DEFAULT_QUEUE_SETTINGS;
const settings = (overrides: Partial<Omit<QueueSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/queue');

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('QueueWidget', () => {
  it('shows who joined, numbered, and who a mod called up', async () => {
    await render(<QueueWidget twitchChannel="streamer" settings={settings()} />);
    expect(screen.getByTestId('queue-empty').textContent).toBe('Type !join to join');
    say('Alpha', '!join Steve');
    say('Beta', '!join');
    say('Gamma', '!join');
    expect(waiting()).toEqual(['1AlphaSteve', '2Beta', '3Gamma']);
    expect(screen.getByTestId('queue-count').textContent).toBe('3');
    modSays('!next 2');
    expect(playing()).toEqual(['Alpha', 'Beta']);
    expect(waiting()).toEqual(['1Gamma']);
  });

  it('counts viewers past the rows shown, and shows a closed queue', async () => {
    await render(<QueueWidget twitchChannel="streamer" settings={settings({ rows: 3 })} />);
    for (const name of ['A', 'B', 'C', 'D', 'E']) say(name, '!join');
    expect(waiting()).toHaveLength(3);
    expect(screen.getByTestId('queue-more').textContent).toBe('+2 more');
    modSays('!queue close');
    expect(screen.getByTestId('queue').dataset.open).toBe('false');
    expect(screen.getByTestId('queue-status').textContent).toBe('Closed');
  });

  it('joins from Kick chat too, and keeps the line through a reload', async () => {
    const first = await render(
      <QueueWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    await act(async () => {});
    act(() => socket('pusher').open());
    act(() =>
      socket('pusher').receive(
        JSON.stringify({
          event: 'App\\Events\\ChatMessageEvent',
          channel: 'chatrooms.42.v2',
          data: JSON.stringify({
            type: 'message',
            content: '!join',
            sender: { username: 'KickFan', identity: { badges: [] } },
          }),
        }),
      ),
    );
    expect(waiting()).toEqual(['1KickFan']);
    first.unmount();
    await render(
      <QueueWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    expect(waiting()).toEqual(['1KickFan']);
    expect(
      JSON.parse(localStorage.getItem(storageKey('streamer', 'kicker')) ?? 'null').waiting,
    ).toHaveLength(1);
  });

  it('starts the preview with a line and plays its test commands', async () => {
    await render(<QueueWidget settings={settings()} simulate previewId="p1" />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(waiting()).toHaveLength(6);
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({ type: 'chat', preview: 'p1', text: '!next', mod: true, name: 'Mod' });
    await vi.waitFor(() => expect(playing()).toHaveLength(1));
    channel.close();
  });
});
