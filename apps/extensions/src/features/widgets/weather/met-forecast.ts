import { RetryableFetchError } from '#/lib/fetch-json';

/**
 * MET Norway's Locationforecast (https://api.met.no/weatherapi/locationforecast/2.0/documentation):
 * free, no key, data under CC BY 4.0, so the overlay credits it. Its terms let a low-volume site
 * ask from the browser with a simple request (no custom headers, so no CORS preflight) that
 * the page's Origin identifies, and ask again only after the `Expires` time it answers with.
 */
export const MET_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';

const TIMEOUT_MS = 10_000;
/** Never sooner than this, even when MET's `Expires` is: the forecast changes about hourly. */
const MIN_REFRESH_MS = 10 * 60_000;
/** Never later than this, so a far-off `Expires` doesn't leave the overlay on old weather. */
const MAX_REFRESH_MS = 60 * 60_000;
/** When MET gives no usable `Expires`, or says no without a reason worth retrying soon. */
const DEFAULT_REFRESH_MS = 30 * 60_000;
/** A forecast older than this is too stale to show as "now". */
const STALE_MS = 24 * 3_600_000;
const CACHE_PREFIX = 'senchabot.weather:';

/** One hour of the forecast (further out, six), trimmed to what the overlay shows. */
export interface ForecastStep {
  /** Start of the hour, ms since the epoch. */
  time: number;
  /** °C */
  temp: number;
  /** m/s */
  wind: number;
  /** Degrees the wind blows from: 0 is from the north, 90 from the east. */
  windFrom: number;
  /** Relative humidity, % */
  humidity: number;
  /** Symbol for the next hour, or the next 6 hours where MET has no hourly one. */
  symbol: string | null;
  /** Symbol for the next 6 hours, which the days row reads. */
  symbol6: string | null;
}

export interface Forecast {
  steps: ForecastStep[];
  /** When it was fetched, ms since the epoch. */
  fetchedAt: number;
  /** When MET says to ask again, ms since the epoch; NaN when it didn't say. */
  expires: number;
}

interface MetTimestep {
  time?: string;
  data?: {
    instant?: {
      details?: {
        air_temperature?: number;
        wind_speed?: number;
        wind_from_direction?: number;
        relative_humidity?: number;
      };
    };
    next_1_hours?: { summary?: { symbol_code?: string } };
    next_6_hours?: { summary?: { symbol_code?: string } };
  };
}

interface MetForecast {
  properties?: { timeseries?: MetTimestep[] };
}

const number = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

/** The steps of a Locationforecast answer, oldest first, skipping any without a temperature. */
export function readTimeseries(json: unknown): ForecastStep[] {
  const series = (json as MetForecast | null)?.properties?.timeseries;
  if (!Array.isArray(series)) return [];
  const steps: ForecastStep[] = [];
  for (const step of series) {
    const time = Date.parse(step?.time ?? '');
    const details = step?.data?.instant?.details;
    const temp = details?.air_temperature;
    if (!Number.isFinite(time) || typeof temp !== 'number' || !Number.isFinite(temp)) continue;
    const symbol6 = step.data?.next_6_hours?.summary?.symbol_code ?? null;
    steps.push({
      time,
      temp,
      wind: number(details?.wind_speed, 0),
      windFrom: number(details?.wind_from_direction, 0),
      humidity: number(details?.relative_humidity, 0),
      symbol: step.data?.next_1_hours?.summary?.symbol_code ?? symbol6,
      symbol6,
    });
  }
  return steps.sort((a, b) => a.time - b.time);
}

export const forecastUrl = (lat: number, lon: number) => `${MET_URL}?lat=${lat}&lon=${lon}`;

/**
 * The forecast for (lat, lon), or null when MET turns the request down (a 4xx), which asking
 * again right away won't change. Throws RetryableFetchError for no network, 429 or a 5xx.
 */
export async function fetchForecast(lat: number, lon: number): Promise<Forecast | null> {
  const url = forecastUrl(lat, lon);
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    throw new RetryableFetchError(`${url}: ${error}`);
  }
  if (response.status === 429 || response.status >= 500) {
    throw new RetryableFetchError(`${url}: ${response.status}`);
  }
  if (!response.ok) return null;
  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    throw new RetryableFetchError(`${url}: ${error}`);
  }
  const steps = readTimeseries(json);
  if (steps.length === 0) return null;
  // Expires is a CORS-safelisted header, so the page can read it.
  const expires = Date.parse(response.headers.get('Expires') ?? '');
  return { steps, fetchedAt: Date.now(), expires };
}

/** When to ask MET again: at its `Expires`, kept between 10 minutes and an hour from now. */
export function nextFetchAt(expires: number, now: number): number {
  if (!Number.isFinite(expires)) return now + DEFAULT_REFRESH_MS;
  return Math.min(now + MAX_REFRESH_MS, Math.max(now + MIN_REFRESH_MS, expires));
}

/** When to ask again after MET said no (a 4xx): not soon, so a blocked overlay goes quiet. */
export const afterRefusal = (now: number) => now + DEFAULT_REFRESH_MS;

const cacheKey = (lat: number, lon: number) => `${CACHE_PREFIX}${lat},${lon}`;

/**
 * The forecast OBS saved for (lat, lon), so a reload or a scene switch shows the weather at once
 * and doesn't ask MET before its `Expires`. Null when there is none or it's too old to show.
 */
export function readCachedForecast(lat: number, lon: number, now = Date.now()): Forecast | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(cacheKey(lat, lon)) ?? 'null');
    if (!saved || !Array.isArray(saved.steps) || !Number.isFinite(saved.fetchedAt)) return null;
    if (now - saved.fetchedAt > STALE_MS) return null;
    return {
      steps: saved.steps as ForecastStep[],
      fetchedAt: saved.fetchedAt,
      expires: Number.isFinite(saved.expires) ? saved.expires : Number.NaN,
    };
  } catch {
    return null;
  }
}

export function cacheForecast(lat: number, lon: number, forecast: Forecast) {
  try {
    window.localStorage.setItem(
      cacheKey(lat, lon),
      // JSON has no NaN; a missing Expires is saved as null and read back as NaN.
      JSON.stringify({
        ...forecast,
        expires: Number.isFinite(forecast.expires) ? forecast.expires : null,
      }),
    );
  } catch {
    // Storage full or blocked: the overlay still works, it just asks again after a reload.
  }
}

/** The step for right now: the latest one that has started. Null once the forecast is stale. */
export function currentStep(forecast: Forecast, now: number): ForecastStep | null {
  if (now - forecast.fetchedAt > STALE_MS) return null;
  let current: ForecastStep | null = null;
  for (const step of forecast.steps) {
    if (step.time > now) break;
    current = step;
  }
  return current ?? forecast.steps[0] ?? null;
}

/** Year, month, day and hour of `time` in `timeZone` (empty for the computer's own). */
function localParts(format: Intl.DateTimeFormat, time: number) {
  const parts = Object.fromEntries(
    format.formatToParts(new Date(time)).map((part) => [part.type, part.value]),
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) % 24 };
}

const partsFormat = (timeZone: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone || undefined,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  });

export const FORECAST_SLOTS = 4;
const HOURS_APART = 3;

/**
 * The hours row: after the current step, every third hour on the local clock (15:00, 18:00…),
 * so the row reads like a forecast and not like the next few minutes.
 */
export function hourlySteps(
  forecast: Forecast,
  now: number,
  timeZone: string,
  count = FORECAST_SLOTS,
): ForecastStep[] {
  const current = currentStep(forecast, now);
  if (!current) return [];
  const format = partsFormat(timeZone);
  const picked: ForecastStep[] = [];
  for (const step of forecast.steps) {
    if (step.time <= current.time) continue;
    const last = picked[picked.length - 1];
    if (
      last
        ? step.time - last.time < HOURS_APART * 3_600_000
        : localParts(format, step.time).hour % HOURS_APART !== 0
    )
      continue;
    picked.push(step);
    if (picked.length === count) break;
  }
  return picked;
}

/** A day in the days row. */
export interface ForecastDay {
  /** A moment in that day, for its weekday name. */
  time: number;
  /** The day it is now, named "Today" rather than by its weekday. */
  today: boolean;
  high: number;
  low: number;
  /** The midday symbol: the 6-hour one closest to noon. */
  symbol: string | null;
}

/** Late in the day there's too little of today left for a high and a low, so the row skips it. */
const MIN_HOURS_LEFT_TODAY = 6;

/**
 * The days row: today and the days after it on the local calendar, with highs and lows. MET's
 * forecast starts at this hour, so today's high and low are for what's left of it.
 */
export function dailySteps(
  forecast: Forecast,
  now: number,
  timeZone: string,
  count = FORECAST_SLOTS,
): ForecastDay[] {
  const current = currentStep(forecast, now);
  if (!current) return [];
  const format = partsFormat(timeZone);
  const days = new Map<string, { step: ForecastStep; hour: number }[]>();
  for (const step of forecast.steps) {
    if (step.time < current.time) continue;
    const { day, hour } = localParts(format, step.time);
    let hours = days.get(day);
    if (!hours) {
      if (days.size === count + 1) break;
      hours = [];
      days.set(day, hours);
    }
    hours.push({ step, hour });
  }
  const all = [...days.values()];
  const shown = all[0].length < MIN_HOURS_LEFT_TODAY && all.length > 1 ? all.slice(1) : all;
  return shown.slice(0, count).map((hours) => {
    const temps = hours.map(({ step }) => step.temp);
    let noon: ForecastStep | null = null;
    let distance = Number.POSITIVE_INFINITY;
    for (const { step, hour } of hours) {
      const away = Math.abs(hour - 12);
      if (step.symbol6 && away < distance) {
        noon = step;
        distance = away;
      }
    }
    return {
      time: hours[0].step.time,
      today: hours === all[0],
      high: Math.max(...temps),
      low: Math.min(...temps),
      symbol: noon?.symbol6 ?? hours[0].step.symbol,
    };
  });
}
