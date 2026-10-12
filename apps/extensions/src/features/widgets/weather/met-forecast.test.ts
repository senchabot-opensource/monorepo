import { afterEach, describe, expect, it, vi } from 'vitest';
import { RetryableFetchError } from '#/lib/fetch-json';
import {
  cacheForecast,
  currentStep,
  dailySteps,
  type Forecast,
  type ForecastStep,
  fetchForecast,
  hourlySteps,
  MET_URL,
  nextFetchAt,
  readCachedForecast,
  readTimeseries,
} from './met-forecast';

const HOUR = 3_600_000;
const MINUTE = 60_000;
const T0 = Date.parse('2026-10-12T09:00:00Z');

/** A Locationforecast answer: one step per hour from `start`, with these temperatures. */
function metAnswer(temps: number[], start = T0) {
  return {
    type: 'Feature',
    properties: {
      meta: { updated_at: new Date(start).toISOString() },
      timeseries: temps.map((temp, index) => ({
        time: new Date(start + index * HOUR).toISOString().replace('.000', ''),
        data: {
          instant: {
            details: {
              air_temperature: temp,
              wind_speed: 2.5,
              wind_from_direction: 90,
              relative_humidity: 64.3,
            },
          },
          next_1_hours: { summary: { symbol_code: index === 0 ? 'rain' : 'cloudy' } },
          next_6_hours: { summary: { symbol_code: 'partlycloudy_day' } },
        },
      })),
    },
  };
}

const step = (hoursFromT0: number, overrides: Partial<ForecastStep> = {}): ForecastStep => ({
  time: T0 + hoursFromT0 * HOUR,
  temp: 10 + hoursFromT0,
  wind: 1,
  windFrom: 0,
  humidity: 50,
  symbol: 'cloudy',
  symbol6: 'cloudy',
  ...overrides,
});
const forecastOf = (steps: ForecastStep[], fetchedAt = T0): Forecast => ({
  steps,
  fetchedAt,
  expires: Number.NaN,
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('readTimeseries', () => {
  it('keeps what the overlay shows, oldest first, and skips broken steps', () => {
    const answer = metAnswer([11.2, 12.5]);
    const series = answer.properties.timeseries as unknown[];
    series.unshift({ time: 'yesterday', data: { instant: { details: { air_temperature: 3 } } } });
    series.push({
      time: '2026-10-12T15:00:00Z',
      data: {
        instant: { details: { air_temperature: 9 } },
        next_6_hours: { summary: { symbol_code: 'snow' } },
      },
    });
    expect(readTimeseries(answer)).toEqual([
      {
        time: T0,
        temp: 11.2,
        wind: 2.5,
        windFrom: 90,
        humidity: 64.3,
        symbol: 'rain',
        symbol6: 'partlycloudy_day',
      },
      expect.objectContaining({ time: T0 + HOUR, temp: 12.5, symbol: 'cloudy' }),
      // Far out there are only 6-hour symbols; the step uses that one.
      expect.objectContaining({ time: T0 + 6 * HOUR, symbol: 'snow', wind: 0, humidity: 0 }),
    ]);
  });

  it('reads anything else as no steps', () => {
    expect(readTimeseries(null)).toEqual([]);
    expect(readTimeseries({ properties: {} })).toEqual([]);
  });
});

describe('fetchForecast', () => {
  const answer = (status: number, body: unknown = metAnswer([12]), headers = {}) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status, headers }));

  it('asks with a plain GET, so the browser sends no CORS preflight', async () => {
    const fetchMock = answer(200, metAnswer([12]), { Expires: 'Mon, 12 Oct 2026 09:41:03 GMT' });
    vi.stubGlobal('fetch', fetchMock);
    const forecast = await fetchForecast(41.0082, 28.9784);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${MET_URL}?lat=41.0082&lon=28.9784`);
    expect(init.headers).toBeUndefined();
    expect(init.method).toBeUndefined();
    expect(forecast?.steps).toHaveLength(1);
    expect(forecast?.expires).toBe(Date.parse('2026-10-12T09:41:03Z'));
  });

  it('retries a busy or broken server, and gives up quietly on a refusal', async () => {
    vi.stubGlobal('fetch', answer(429));
    await expect(fetchForecast(1, 2)).rejects.toBeInstanceOf(RetryableFetchError);
    vi.stubGlobal('fetch', answer(503));
    await expect(fetchForecast(1, 2)).rejects.toBeInstanceOf(RetryableFetchError);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(fetchForecast(1, 2)).rejects.toBeInstanceOf(RetryableFetchError);
    vi.stubGlobal('fetch', answer(403));
    await expect(fetchForecast(1, 2)).resolves.toBeNull();
  });
});

describe('nextFetchAt', () => {
  it("waits for MET's Expires, between 10 minutes and an hour", () => {
    const now = T0;
    expect(nextFetchAt(now + 31 * MINUTE, now)).toBe(now + 31 * MINUTE);
    expect(nextFetchAt(now + MINUTE, now)).toBe(now + 10 * MINUTE);
    expect(nextFetchAt(now - HOUR, now)).toBe(now + 10 * MINUTE);
    expect(nextFetchAt(now + 5 * HOUR, now)).toBe(now + HOUR);
    expect(nextFetchAt(Number.NaN, now)).toBe(now + 30 * MINUTE);
  });
});

describe('the forecast saved in OBS', () => {
  it('comes back for the same place until it is a day old', () => {
    const forecast = { steps: [step(0)], fetchedAt: T0, expires: T0 + 30 * MINUTE };
    cacheForecast(41.0082, 28.9784, forecast);
    expect(readCachedForecast(41.0082, 28.9784, T0 + HOUR)).toEqual(forecast);
    expect(readCachedForecast(41.0082, 28.9785, T0 + HOUR)).toBeNull();
    expect(readCachedForecast(41.0082, 28.9784, T0 + 25 * HOUR)).toBeNull();
  });

  it('keeps a missing Expires missing', () => {
    cacheForecast(1, 2, forecastOf([step(0)]));
    expect(readCachedForecast(1, 2, T0)?.expires).toBeNaN();
  });

  it('reads garbage as nothing', () => {
    localStorage.setItem('senchabot.weather:1,2', '{not json');
    expect(readCachedForecast(1, 2, T0)).toBeNull();
  });
});

describe('currentStep', () => {
  const forecast = forecastOf([step(0), step(1), step(2)]);

  it('is the latest hour that has started', () => {
    expect(currentStep(forecast, T0 + 90 * MINUTE)?.time).toBe(T0 + HOUR);
    expect(currentStep(forecast, T0 + 5 * HOUR)?.time).toBe(T0 + 2 * HOUR);
    // A computer clock running a little behind still gets the first hour.
    expect(currentStep(forecast, T0 - MINUTE)?.time).toBe(T0);
  });

  it('is nothing once the forecast is a day old, rather than old weather as "now"', () => {
    expect(currentStep(forecast, T0 + 25 * HOUR)).toBeNull();
  });
});

describe('hourlySteps', () => {
  const day = forecastOf(Array.from({ length: 30 }, (_, hours) => step(hours)));

  it('takes every third hour on the local clock after the current one', () => {
    // 09:40 UTC is 12:40 in Istanbul: the row starts at 15:00 there.
    const now = T0 + 40 * MINUTE;
    const utc = hourlySteps(day, now, 'UTC').map((s) => new Date(s.time).getUTCHours());
    expect(utc).toEqual([12, 15, 18, 21]);
    const istanbul = hourlySteps(day, now, 'Europe/Istanbul').map((s) =>
      new Date(s.time).getUTCHours(),
    );
    expect(istanbul).toEqual([12, 15, 18, 21]);
    // Kolkata is half an hour off UTC: 10:00 UTC is 15:30 there, so the row starts at it.
    const india = hourlySteps(day, now, 'Asia/Kolkata').map((s) => new Date(s.time).getUTCHours());
    expect(india).toEqual([10, 13, 16, 19]);
  });

  it('keeps three hours apart where MET has only every sixth', () => {
    const sparse = forecastOf([step(0), step(6), step(12), step(18), step(24)]);
    expect(hourlySteps(sparse, T0, 'UTC').map((s) => new Date(s.time).getUTCHours())).toEqual([
      15, 21, 3, 9,
    ]);
  });
});

describe('dailySteps', () => {
  it('groups by the local day, with its high, low and midday symbol', () => {
    // From 09:00 UTC on the 12th for two days, the 6-hour symbol saying which hour it is.
    const steps = Array.from({ length: 48 }, (_, hours) =>
      step(hours, {
        temp: hours < 15 ? hours : -hours,
        symbol6: `h${(9 + hours) % 24}`,
      }),
    );
    const days = dailySteps(forecastOf(steps), T0, 'UTC');
    expect(days).toHaveLength(3);
    expect(days[0]).toMatchObject({ time: T0, today: true, high: 14, low: 0, symbol: 'h12' });
    expect(days[1]).toMatchObject({ high: -15, low: -38, symbol: 'h12' });
    // In Istanbul the 12th ends three hours sooner, at 21:00 UTC.
    const istanbul = dailySteps(forecastOf(steps), T0, 'Europe/Istanbul');
    expect(istanbul[0]).toMatchObject({ high: 11, low: 0 });
    expect(istanbul[1]).toMatchObject({ time: T0 + 12 * HOUR, high: 14, low: -35 });
  });

  it('skips today once fewer than six hours of it are left, so it never shows a flat high and low', () => {
    const steps = Array.from({ length: 24 * 5 }, (_, hours) => step(hours));
    // 19:00 UTC: five hours of the 12th left.
    const late = dailySteps(forecastOf(steps, T0 + 10 * HOUR), T0 + 10 * HOUR, 'UTC');
    expect(late).toHaveLength(4);
    expect(late.map((day) => day.today)).toEqual([false, false, false, false]);
    expect(new Date(late[0].time).toISOString()).toBe('2026-10-13T00:00:00.000Z');
    // 18:00 UTC: six hours left, so today stays.
    const evening = dailySteps(forecastOf(steps, T0 + 9 * HOUR), T0 + 9 * HOUR, 'UTC');
    expect(evening.map((day) => day.today)).toEqual([true, false, false, false]);
  });

  it('stops at four days', () => {
    const steps = Array.from({ length: 24 * 8 }, (_, hours) => step(hours));
    expect(dailySteps(forecastOf(steps), T0, 'UTC')).toHaveLength(4);
  });
});
