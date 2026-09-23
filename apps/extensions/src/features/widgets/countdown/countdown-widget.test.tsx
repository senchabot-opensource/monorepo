import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type CountdownSettings, DEFAULT_COUNTDOWN_SETTINGS } from '#/lib/countdown-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { CountdownWidget } from './countdown-widget';

const { platforms: _platforms, ...DEFAULTS } = DEFAULT_COUNTDOWN_SETTINGS;
const settings = (overrides: Partial<CountdownSettings> = {}) => ({ ...DEFAULTS, ...overrides });

const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/countdown');
const clock = () => screen.queryByTestId('countdown-clock')?.textContent;
const root = () => screen.getByTestId('countdown');
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

const twitchSocket = () => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes('twitch'));
  if (!found) throw new Error('no twitch socket');
  return found;
};
const modSays = (text: string) =>
  act(() =>
    twitchSocket().receive(
      `@display-name=Mod;mod=1;room-id=1 :mod!mod@mod.tmi.twitch.tv PRIVMSG #streamer :${text}`,
    ),
  );

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('CountdownWidget', () => {
  it("counts down from the length, under the scene's own headline", async () => {
    await render(<CountdownWidget settings={settings({ time: 600 })} />);
    expect(root().textContent).toContain('Starting Soon');
    expect(clock()).toBe('10:00');

    wait(62_000);
    expect(clock()).toBe('08:58');
  });

  it('shows the hours only once there is an hour left', async () => {
    await render(<CountdownWidget settings={settings({ time: 3660 })} />);
    expect(clock()).toBe('1:01:00');
    wait(61_000);
    expect(clock()).toBe('59:59');
  });

  it("takes the scene's wording and the streamer's own text", async () => {
    const { unmount } = await render(<CountdownWidget settings={settings({ scene: 'break' })} />);
    expect(root().textContent).toContain('Back Soon');
    expect(root().dataset.scene).toBe('break');
    unmount();

    await render(
      <CountdownWidget settings={settings({ title: 'Kahve molası', note: '5 dakika' })} />,
    );
    expect(root().textContent).toContain('Kahve molası');
    expect(root().textContent).toContain('5 dakika');
  });

  it('puts the end message where the clock was', async () => {
    await render(
      <CountdownWidget settings={settings({ time: 60, scene: 'starting', doneHold: 0 })} />,
    );
    wait(61_000);
    expect(root().dataset.ended).toBe('true');
    expect(clock()).toBeUndefined();
    expect(root().textContent).toContain("We're live!");
    // Shown always with a zero hold: still there a minute later.
    wait(60_000);
    expect(root().querySelector('.cd-stage')).not.toBeNull();
    expect(root().textContent).toContain("We're live!");
  });

  it('hides the end message after its hold time', async () => {
    await render(<CountdownWidget settings={settings({ time: 60, doneHold: 30 })} />);
    wait(61_000);
    expect(root().textContent).toContain("We're live!");
    wait(29_000);
    expect(root().querySelector('.cd-stage')).not.toBeNull();
    wait(1000);
    expect(root().querySelector('.cd-stage')).toBeNull();
  });

  it('hides the end message after 10 seconds by default', async () => {
    await render(<CountdownWidget settings={settings({ time: 60 })} />);
    wait(61_000);
    expect(root().textContent).toContain("We're live!");
    wait(10_000);
    expect(root().querySelector('.cd-stage')).toBeNull();
  });

  it('shows a custom icon instead of the scene icon', async () => {
    const { unmount } = await render(
      <CountdownWidget settings={settings({ scene: 'break', iconBreak: '☕' })} />,
    );
    expect(screen.getByTestId('countdown-icon').textContent).toBe('☕');
    expect(root().querySelector('svg')).toBeNull();
    unmount();

    // Each scene has its own icon: the break icon doesn't leak into starting.
    await render(<CountdownWidget settings={settings({ iconBreak: '☕' })} />);
    expect(screen.queryByTestId('countdown-icon')).toBeNull();
    expect(root().querySelector('svg')).not.toBeNull();
  });

  it('holds the clock at zero, or leaves the scene bare', async () => {
    const { unmount } = await render(
      <CountdownWidget settings={settings({ time: 60, ending: 'hold' })} />,
    );
    wait(61_000);
    expect(clock()).toBe('00:00');
    unmount();

    await render(<CountdownWidget settings={settings({ time: 60, ending: 'hide' })} />);
    expect(root().querySelector('.cd-stage')).not.toBeNull();
    wait(61_000);
    // Only the stylesheet is left, so nothing of the countdown sits over the game.
    expect(root().querySelector('.cd-stage')).toBeNull();
  });

  it('lets a mod add time, pause it and start it over from chat', async () => {
    await render(<CountdownWidget twitchChannel="streamer" settings={settings({ time: 600 })} />);
    act(() => twitchSocket().open());

    modSays('!countdown add 5m');
    expect(clock()).toBe('15:00');

    modSays('!countdown pause');
    wait(30_000);
    expect(clock()).toBe('15:00');

    modSays('!countdown reset');
    expect(clock()).toBe('10:00');
  });

  it('ignores a countdown command from someone who is not a mod', async () => {
    await render(<CountdownWidget twitchChannel="streamer" settings={settings({ time: 600 })} />);
    act(() => twitchSocket().open());
    act(() =>
      twitchSocket().receive(
        '@display-name=Viewer;room-id=1 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #streamer :!countdown add 5m',
      ),
    );
    expect(clock()).toBe('10:00');
  });

  it('lets a mod switch the scene with a headline and note from chat', async () => {
    await render(<CountdownWidget twitchChannel="streamer" settings={settings({ time: 600 })} />);
    act(() => twitchSocket().open());

    modSays('!countdown break 5m Lunch | Back soon');
    expect(root().dataset.scene).toBe('break');
    expect(clock()).toBe('05:00');
    expect(root().textContent).toContain('Lunch');
    expect(root().textContent).toContain('Back soon');

    modSays('!countdown title Dinner');
    expect(root().textContent).toContain('Dinner');

    modSays('!countdown note Be right back');
    expect(root().textContent).toContain('Be right back');

    // The next scene command clears the chat text again.
    modSays('!countdown starting 10m');
    expect(root().dataset.scene).toBe('starting');
    expect(root().textContent).toContain('Starting Soon');
    expect(root().textContent).not.toContain('Dinner');
  });

  it('marks the preset it was drawn in', async () => {
    await render(<CountdownWidget settings={settings({ preset: 'dynasty' })} />);
    expect(root().dataset.preset).toBe('dynasty');
  });
});
