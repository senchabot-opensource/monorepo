import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LEADERBOARD_SETTINGS, type LeaderboardSettings } from '#/lib/leaderboard-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { storageKey } from './leaderboard-state';
import { LeaderboardWidget } from './leaderboard-widget';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const socket = () => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes('twitch'));
  if (!found) throw new Error('no twitch socket');
  return found;
};
const receive = (line: string) => act(() => socket().receive(line));
const gift = (name: string, count: number) =>
  receive(
    `@display-name=${name};msg-id=submysterygift;msg-param-mass-gift-count=${count};msg-param-community-gift-id=${name}${count};msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #streamer`,
  );
const cheer = (name: string, bits: number) =>
  receive(
    `@display-name=${name};bits=${bits};room-id=1 :${name.toLowerCase()}!x@x.tmi.twitch.tv PRIVMSG #streamer :Cheer${bits}`,
  );
const rows = () => screen.queryAllByTestId('leaderboard-row').map((row) => row.textContent);

const { platforms: _, ...DEFAULTS } = DEFAULT_LEADERBOARD_SETTINGS;
const settings = (overrides: Partial<Omit<LeaderboardSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/leaderboard');

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('LeaderboardWidget', () => {
  it('ranks the top gifters, biggest first', async () => {
    await render(<LeaderboardWidget twitchChannel="streamer" settings={settings()} />);
    expect(screen.getByTestId('leaderboard-empty').textContent).toBe('No gifts yet');
    gift('Small', 1);
    gift('Big', 10);
    gift('Small', 5);
    expect(rows()).toEqual(['1Big10 gifted', '2Small6 gifted']);
    expect(screen.getByTestId('leaderboard-title').textContent).toBe('Top Gifters');
  });

  it('ranks Bits on the cheers board and keeps only the places asked for', async () => {
    await render(
      <LeaderboardWidget
        twitchChannel="streamer"
        settings={settings({ board: 'cheers', rows: 3, title: '' })}
      />,
    );
    for (const [name, bits] of [
      ['A', 100],
      ['B', 500],
      ['C', 300],
      ['D', 50],
    ] as const)
      cheer(name, bits);
    expect(rows()).toEqual(['1B500', '2C300', '3A100']);
    expect(screen.queryByTestId('leaderboard-title')).toBeNull();
  });

  it('shows the latest of each kind, and a mod resets it all', async () => {
    await render(
      <LeaderboardWidget twitchChannel="streamer" settings={settings({ board: 'latest' })} />,
    );
    cheer('Cheery', 250);
    receive(
      '@display-name=Raider;msg-id=raid;msg-param-displayName=Raider;msg-param-viewerCount=33;room-id=1 :tmi.twitch.tv USERNOTICE #streamer',
    );
    const latest = () =>
      Object.fromEntries(
        screen
          .getAllByTestId('leaderboard-latest')
          .map((row) => [row.dataset.kind, row.querySelector('dd')?.textContent]),
      );
    expect(latest()).toEqual({
      sub: 'No one yet',
      gift: 'No one yet',
      cheer: 'Cheery250 Bits',
      raid: 'Raider33 viewers',
    });
    receive(
      '@badges=moderator/1;mod=1;room-id=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :!top reset',
    );
    expect(latest().cheer).toBe('No one yet');
  });

  it('keeps the totals through a reload', async () => {
    const first = await render(
      <LeaderboardWidget twitchChannel="streamer" settings={settings()} />,
    );
    gift('Keeper', 3);
    first.unmount();
    expect(JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null').gifts).toHaveLength(
      1,
    );
    await render(<LeaderboardWidget twitchChannel="streamer" settings={settings()} />);
    expect(rows()).toEqual(['1Keeper3 gifted']);
  });

  it('starts the preview with a full board and never connects', async () => {
    await render(<LeaderboardWidget settings={settings({ board: 'cheers' })} simulate />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(rows().length).toBeGreaterThan(0);
  });
});
