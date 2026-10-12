import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_WEATHER_SETTINGS, type WeatherSettings } from '#/lib/weather-url';
import { en } from '#/test/queries';
import { renderWithProviders } from '#/test/render';
import { cacheForecast, readTimeseries } from './met-forecast';
import { PREVIEW_CHANNEL } from './use-weather';
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
const forecastRow = () => screen.queryByTestId('weather-forecast');
const wait = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

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

  it('shows nothing until there is a place', async () => {
    await render(<WeatherWidget settings={DEFAULT_WEATHER_SETTINGS} />);
    expect(screen.getByTestId('weather').querySelector('.wx-box')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
