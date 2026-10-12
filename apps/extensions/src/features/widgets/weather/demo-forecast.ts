import type { Forecast, ForecastStep } from './met-forecast';

/** Sample weather the demos and the setup page's test buttons show, without asking MET. */
export const DEMO_SKIES = ['sun', 'clouds', 'rain', 'storm', 'snow', 'night'] as const;
export type DemoSky = (typeof DEMO_SKIES)[number];

/** What the landing page and a setup page with no place yet show. */
export const DEFAULT_DEMO_SKY: DemoSky = 'clouds';
/** The place a demo names when none is set. */
export const DEMO_PLACE = 'Istanbul';

interface Plan {
  /** MET symbol for now. */
  now: string;
  /** °C now. */
  temp: number;
  /** m/s */
  wind: number;
  humidity: number;
  /** Symbols for the coming hours, three hours each. */
  later: readonly string[];
  /** The 6-hour symbol of today and the next days. */
  days: readonly string[];
}

const PLANS: Record<DemoSky, Plan> = {
  sun: {
    now: 'clearsky_day',
    temp: 24,
    wind: 3,
    humidity: 38,
    later: ['clearsky_day', 'fair_day', 'fair_night', 'clearsky_night'],
    days: ['clearsky_day', 'fair_day', 'partlycloudy_day', 'clearsky_day'],
  },
  clouds: {
    now: 'partlycloudy_day',
    temp: 18,
    wind: 4,
    humidity: 62,
    later: ['partlycloudy_day', 'cloudy', 'lightrainshowers_day', 'fair_night'],
    days: ['partlycloudy_day', 'lightrain', 'fair_day', 'clearsky_day'],
  },
  rain: {
    now: 'rain',
    temp: 13,
    wind: 6,
    humidity: 91,
    later: ['rain', 'heavyrain', 'lightrain', 'cloudy'],
    days: ['rain', 'rainshowers_day', 'partlycloudy_day', 'fair_day'],
  },
  storm: {
    now: 'heavyrainandthunder',
    temp: 17,
    wind: 11,
    humidity: 93,
    later: ['rainandthunder', 'heavyrain', 'rainshowers_day', 'cloudy'],
    days: ['heavyrainandthunder', 'rainshowers_day', 'cloudy', 'partlycloudy_day'],
  },
  snow: {
    now: 'snow',
    temp: -3,
    wind: 5,
    humidity: 86,
    later: ['heavysnow', 'snow', 'lightsnow', 'cloudy'],
    days: ['snow', 'lightsnowshowers_day', 'cloudy', 'fair_day'],
  },
  night: {
    now: 'clearsky_night',
    temp: 11,
    wind: 2,
    humidity: 71,
    later: ['fair_night', 'partlycloudy_night', 'fair_day', 'clearsky_day'],
    days: ['fair_day', 'clearsky_day', 'partlycloudy_day', 'rainshowers_day'],
  },
};

const HOUR = 3_600_000;
const STEPS = 4 * 24;

// Warmest mid-afternoon, coolest before dawn, about 8 °C apart.
const swing = (hour: number) => 4 * Math.sin(((hour - 9) / 24) * 2 * Math.PI);

/** The sun by day and the moon by night, so the hours row doesn't show the sun at midnight. */
const byDaylight = (symbol: string, hour: number) =>
  symbol.replace(/_(day|night)$/, hour >= 6 && hour < 18 ? '_day' : '_night');

/** Four days of hourly sample weather from the start of this hour, on this computer's clock. */
export function demoForecast(sky: DemoSky, now: number): Forecast {
  const plan = PLANS[sky];
  const start = Math.floor(now / HOUR) * HOUR;
  const firstHour = new Date(start).getHours();
  const steps: ForecastStep[] = [];
  for (let index = 0; index < STEPS; index++) {
    const hour = firstHour + index;
    const day = Math.floor(hour / 24);
    steps.push({
      time: start + index * HOUR,
      temp:
        Math.round((plan.temp + swing(hour) - swing(firstHour) + (day % 2) - day / 2) * 10) / 10,
      wind: plan.wind + (index % 5) / 4,
      windFrom: (200 + index * 7) % 360,
      humidity: plan.humidity,
      symbol:
        index === 0
          ? plan.now
          : byDaylight(plan.later[Math.floor((index - 1) / 3) % plan.later.length], hour % 24),
      symbol6: plan.days[Math.min(day, plan.days.length - 1)],
    });
  }
  return { steps, fetchedAt: now, expires: Number.NaN };
}
