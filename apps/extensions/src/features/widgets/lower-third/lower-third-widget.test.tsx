import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LOWER_THIRD_SETTINGS, type LowerThirdSettings } from '#/lib/lower-third-url';
import { FakeWebSocket } from '#/test/browser';
import { LowerThirdWidget } from './lower-third-widget';
import { PREVIEW_CHANNEL } from './use-lower-third';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const modSays = (text: string) =>
  act(() => {
    const ws = [...FakeWebSocket.instances]
      .reverse()
      .find((socket) => socket.url.includes('twitch'));
    ws?.receive(
      `@badges=moderator/1;mod=1;room-id=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :${text}`,
    );
  });
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));
const visible = () => screen.getByTestId('lower-third').dataset.visible;
const line = () => screen.queryByTestId('lower-third-line')?.textContent;

const { platforms: _, ...DEFAULTS } = DEFAULT_LOWER_THIRD_SETTINGS;
const settings = (overrides: Partial<Omit<LowerThirdSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  title: 'Senchabot',
  lines: ['One', 'Two'],
  rotate: 5,
  ...overrides,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('LowerThirdWidget', () => {
  it('shows the title and turns through the lines', () => {
    render(<LowerThirdWidget settings={settings()} />);
    expect(screen.getByTestId('lower-third-title').textContent).toBe('Senchabot');
    expect(visible()).toBe('true');
    expect(line()).toBe('One');
    wait(5000);
    expect(line()).toBe('Two');
    wait(5000);
    expect(line()).toBe('One');
  });

  it('comes and goes on a timer', () => {
    render(<LowerThirdWidget settings={settings({ hold: 10, pause: 20 })} />);
    expect(visible()).toBe('true');
    wait(10_250);
    expect(visible()).toBe('false');
    wait(20_000);
    expect(visible()).toBe('true');
  });

  it('takes mod commands when it has a channel', () => {
    render(<LowerThirdWidget twitchChannel="streamer" settings={settings()} />);
    modSays('!lt Back in 5!');
    expect(line()).toBe('Back in 5!');
    wait(12_000);
    expect(line()).toBe('Back in 5!');
    modSays('!lt clear');
    expect(['One', 'Two']).toContain(line());
    modSays('!lt hide');
    expect(visible()).toBe('false');
    modSays('!lt show');
    expect(visible()).toBe('true');
    // A viewer's command changes nothing.
    act(() => {
      const ws = [...FakeWebSocket.instances]
        .reverse()
        .find((socket) => socket.url.includes('twitch'));
      ws?.receive('@badges=;room-id=1 :v!v@v.tmi.twitch.tv PRIVMSG #streamer :!lt hide');
    });
    expect(visible()).toBe('true');
  });

  it('connects to no chat without a channel, and plays test commands in its preview', async () => {
    render(<LowerThirdWidget settings={settings()} simulate previewId="p1" />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({ type: 'command', preview: 'p1', text: '!lt Pinned' });
    await vi.waitFor(() => expect(line()).toBe('Pinned'));
    channel.close();
  });
});
