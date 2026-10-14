import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_WEATHER_SETTINGS, type WeatherSettings } from '#/lib/weather-url';
import { FakeWebSocket } from '#/test/browser';
import { en } from '#/test/queries';
import { renderWithProviders } from '#/test/render';
import { cacheForecast, readTimeseries } from './met-forecast';
import { PREVIEW_CHANNEL } from './use-weather';
import { toggleStorageKey } from './use-weather-toggle';
import { WeatherWidget } from './weather-widget';

const HOUR = 3_600_000;
const MINUTE = 60_000;
const T0 = Date.parse('2026-10-12T09:00:00Z');
const NOW = T0 + 20 * MINUTE;
const ISTANBUL = { lat: 41.0082, lon: 28.9784 };

/** A Locationforecast answer: hourly from T0, light rain now and cloudy after. */
const metAnswer = (temps: number[]) => ({
  properties: {
    timeseries: temps.map((temp, index) => ({
      time: new Date(T0 + index * HOUR).toISOString(),
      data: {
        instant: {
          details: {
            air_temperature: temp,
            wind_speed: 5,
            wind_from_direction: 180,
            relative_humidity: 81.6,
          },
        },
        next_1_hours: { summary: { symbol_code: index === 0 ? 'lightrain' : 'cloudy' } },
        next_6_hours: { summary: { symbol_code: 'partlycloudy_day' } },
      },
    })),
  },
});
const DAY = Array.from({ length: 36 }, (_, hours) => 12.4 + hours / 10);

const answer = (status: number, expires?: number) =>
  new Response(status === 200 ? JSON.stringify(metAnswer(DAY)) : '{}', {
    status,
    headers: expires ? { Expires: new Date(expires).toUTCString() } : {},
  });

const settings = (overrides: Partial<WeatherSettings> = {}): WeatherSettings => ({
  ...DEFAULT_WEATHER_SETTINGS,
  ...ISTANBUL,
  place: 'Istanbul',
  tz: 'UTC',
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/weather?lang=en');
const temp = () => screen.queryByTestId('weather-temp')?.textContent ?? null;
/** HUD text is drawn twice, its outline under its fill, so it is read from its data-value. */
const hudText = (testId: string) =>
  screen.queryByTestId(testId)?.getAttribute('data-value') ?? null;
/** The fill color of the outlined text that reads `text`. */
const fill = (text: string) =>
  (document.querySelector(`.ih-text[data-value="${text}"] > span:last-child`) as HTMLElement | null)
    ?.style.color;
const forecastRow = () => screen.queryByTestId('weather-forecast');
const shown = () => screen.getByTestId('weather').dataset.hidden === undefined;
const chatSays = (text: string, mod: boolean) => {
  // The newest one: a reload opens another.
  const socket = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes('twitch'));
  if (!socket) throw new Error('no twitch socket');
  const tags = mod ? '@badges=moderator/1;display-name=Mod;mod=1;room-id=1' : '@room-id=1';
  const who = mod ? 'mod' : 'viewer';
  act(() =>
    socket.receive(`${tags} :${who}!${who}@${who}.tmi.twitch.tv PRIVMSG #streamer :${text}`),
  );
};
const wait = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));
/** A distance from the scene's edge, in px at 1080p: the overlay scales with the window. */
const edge = (px: string) =>
  (Number.parseFloat(px) * 1080) / Math.min(window.innerWidth, window.innerHeight);

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
  });
  vi.setSystemTime(NOW);
  // A new Response each time: a body reads only once.
  fetchMock = vi.fn().mockImplementation(async () => answer(200, NOW + 31 * MINUTE));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  localStorage.clear();
});

describe('WeatherWidget', () => {
  it('shows the weather for this hour from MET Norway, and credits it', async () => {
    await render(<WeatherWidget settings={settings()} />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toContain('lat=41.0082&lon=28.9784');
    expect(screen.getByText('Istanbul')).toBeTruthy();
    expect(screen.getByText(en('weather.conditions.lightRain'))).toBeTruthy();
    // Wind in km/h from m/s, and the humidity.
    expect(screen.getByText('18 km/h')).toBeTruthy();
    expect(screen.getByText('82%')).toBeTruthy();
    expect(screen.getByText(en('weather.credit', { source: 'MET Norway' }))).toBeTruthy();
    // Every third hour on the clock: 12:00, 15:00, 18:00 and 21:00 UTC.
    const labels = [...(forecastRow()?.querySelectorAll('.wx-slot-label') ?? [])];
    expect(labels.map((label) => label.textContent)).toEqual(['12:00', '15:00', '18:00', '21:00']);
  });

  it("asks again only when MET's Expires says, and saves the forecast in OBS", async () => {
    await render(<WeatherWidget settings={settings()} />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    expect(localStorage.getItem('senchabot.weather:41.0082,28.9784')).toContain('lightrain');

    await wait(30 * MINUTE);
    expect(fetchMock).toHaveBeenCalledOnce();
    await wait(2 * MINUTE);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('shows the saved forecast at once after a reload, without asking early', async () => {
    const steps = readTimeseries(metAnswer(DAY));
    cacheForecast(ISTANBUL.lat, ISTANBUL.lon, {
      steps,
      fetchedAt: NOW - 5 * MINUTE,
      expires: NOW + 20 * MINUTE,
    });
    await render(<WeatherWidget settings={settings()} />);
    expect(temp()).toBe('12°C');
    expect(fetchMock).not.toHaveBeenCalled();
    await wait(21 * MINUTE);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('moves on to the next hour by itself', async () => {
    await render(<WeatherWidget settings={settings()} />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    await wait(45 * MINUTE);
    // 10:05 UTC: the 10:00 step, 12.5 °C.
    expect(temp()).toBe('13°C');
    expect(screen.getByText(en('weather.conditions.cloudy'))).toBeTruthy();
  });

  it('retries a failed request with backoff, and waits half an hour after a refusal', async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(answer(403));
    await render(<WeatherWidget settings={settings()} />);
    expect(fetchMock).toHaveBeenCalledOnce();
    await wait(5_000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(temp()).toBeNull();
    await wait(29 * MINUTE);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await wait(MINUTE);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
  });

  it('converts to °F and mph, and fits one line as a pill', async () => {
    await render(<WeatherWidget settings={settings({ units: 'imperial', layout: 'pill' })} />);
    // 12.4 °C is 54.3 °F.
    await vi.waitFor(() => expect(temp()).toBe('54°F'));
    expect(forecastRow()).toBeNull();
    expect(screen.queryByText(/mph/)).toBeNull();
  });

  it('shows today and the next days with their highs and lows', async () => {
    await render(<WeatherWidget settings={settings({ forecast: 'days' })} />);
    await vi.waitFor(() => expect(forecastRow()).toBeTruthy());
    const labels = [...(forecastRow()?.querySelectorAll('.wx-slot-label') ?? [])];
    expect(labels.map((label) => label.textContent)).toEqual([en('weather.today'), 'Tue']);
    // The 12th from 09:00: 12.4 to 13.8 °C.
    expect(forecastRow()?.textContent).toContain('14°12°');
  });

  it('leaves out the details and the forecast when they are off', async () => {
    await render(<WeatherWidget settings={settings({ details: false, forecast: 'off' })} />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    expect(screen.queryByText('18 km/h')).toBeNull();
    expect(forecastRow()).toBeNull();
  });

  it('runs on sample weather in demos, without asking MET', async () => {
    await render(<WeatherWidget settings={DEFAULT_WEATHER_SETTINGS} demo />);
    expect(temp()).toBe('18°C');
    expect(screen.getByText('Istanbul')).toBeTruthy();
    expect(screen.getByText(en('weather.conditions.partlyCloudy'))).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows its setup page's test weather, then the real weather again", async () => {
    await render(<WeatherWidget settings={settings()} previewId="p1" />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({ type: 'sky', sky: 'snow', preview: 'p2' });
    channel.postMessage({ type: 'sky', sky: 'snow', preview: 'p1' });
    await vi.waitFor(() => expect(screen.getByText(en('weather.conditions.snow'))).toBeTruthy());
    expect(temp()).toBe('-3°C');
    channel.postMessage({ type: 'sky', sky: null, preview: 'p1' });
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    channel.close();
  });

  it("hides and shows on a mod's !h weather when the URL names a channel, through a reload", async () => {
    const first = await render(<WeatherWidget settings={settings()} twitchChannel="streamer" />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    expect(shown()).toBe(true);
    chatSays('!h weather', false);
    expect(shown()).toBe(true);
    chatSays('!h weather', true);
    expect(shown()).toBe(false);
    chatSays('!h weather now', true);
    expect(shown()).toBe(false);
    expect(JSON.parse(localStorage.getItem(toggleStorageKey('streamer')) ?? 'null')).toEqual({
      hidden: true,
    });
    first.unmount();

    await render(<WeatherWidget settings={settings()} twitchChannel="streamer" />);
    expect(shown()).toBe(false);
    chatSays('!HUD Weather', true);
    expect(shown()).toBe(true);
  });

  it("reads no chat without a channel, and takes its setup page's toggle", async () => {
    await render(<WeatherWidget settings={settings()} previewId="p1" />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    expect(FakeWebSocket.instances).toHaveLength(0);
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({ type: 'toggle', preview: 'p2' });
    channel.postMessage({ type: 'toggle', preview: 'p1' });
    await vi.waitFor(() => expect(shown()).toBe(false));
    channel.postMessage({ type: 'toggle', preview: 'p1' });
    await vi.waitFor(() => expect(shown()).toBe(true));
    channel.close();
  });

  it("draws the IRL HUD's Retro style on the pill: outlined text in its colors, with no background", async () => {
    await render(
      <WeatherWidget settings={settings({ style: 'retro', layout: 'pill', theme: 'light' })} />,
    );
    await vi.waitFor(() => expect(hudText('weather-temp')).toBe('12°C'));
    const root = screen.getByTestId('weather');
    expect(root.className).toBe('wx-root wx-hud ih-retro');
    // The grey of the HUD's clock, and the green of its cash for the weather in words.
    expect(fill('12°C')).toBe('rgb(225, 225, 225)');
    expect(fill(en('weather.conditions.lightRain'))).toBe('rgb(84, 142, 88)');
    expect(fill('Istanbul')).toBe('rgb(240, 240, 240)');
    expect(fill('MET Norway')).toBe('rgb(240, 240, 240)');
    // The weather icon in a black outline, like the text.
    const icons = [...root.querySelectorAll('svg.wx-icon')];
    expect(icons).toHaveLength(1);
    const id = icons[0].querySelector('filter')?.id;
    expect(id).toMatch(/^wx-outline[\w-]+$/);
    expect(icons[0].querySelector('g')?.getAttribute('filter')).toBe(`url(#${id})`);
  });

  it("fits the IRL HUD's Modern style on one line as a pill, lined up on its corner", async () => {
    await render(
      <WeatherWidget settings={settings({ style: 'modern', layout: 'pill', corner: 'tr' })} />,
    );
    await vi.waitFor(() => expect(hudText('weather-temp')).toBe('12°C'));
    expect(screen.getByTestId('weather').className).toBe('wx-root wx-hud ih-modern');
    expect(fill('12°C')).toBe('rgb(240, 240, 240)');
    expect(fill(en('weather.conditions.lightRain'))).toBe('rgb(114, 204, 114)');
    expect(forecastRow()).toBeNull();
    const box = screen.getByTestId('weather').querySelector('.wx-box') as HTMLElement;
    // The IRL HUD's distance from the edges, so the two line up.
    expect(edge(box.style.right)).toBeCloseTo(72);
  });

  it('keeps the card in the weather app look, whatever style the URL asks for', async () => {
    await render(<WeatherWidget settings={settings({ style: 'retro', theme: 'light' })} />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    const root = screen.getByTestId('weather');
    expect(root.className).toBe('wx-root wx-light');
    expect(root.querySelector('.ih-text, filter')).toBeNull();
    expect(forecastRow()?.querySelectorAll('.wx-slot')).toHaveLength(4);
  });

  it('keeps the weather app look by default, on its background and without outlines', async () => {
    await render(<WeatherWidget settings={settings()} />);
    await vi.waitFor(() => expect(temp()).toBe('12°C'));
    const root = screen.getByTestId('weather');
    expect(root.className).toBe('wx-root wx-dark');
    expect(root.querySelector('.ih-text, filter')).toBeNull();
    expect(edge((root.querySelector('.wx-box') as HTMLElement).style.left)).toBeCloseTo(64);
  });

  it('shows nothing until there is a place', async () => {
    await render(<WeatherWidget settings={DEFAULT_WEATHER_SETTINGS} />);
    expect(screen.getByTestId('weather').querySelector('.wx-box')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
