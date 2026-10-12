/**
 * MET Norway's weather symbols (https://api.met.no/weatherapi/weathericon/2.0/documentation):
 * a code like `lightrainshowers_day` or `heavysnowandthunder`, read into the few kinds of weather
 * the overlay names and draws.
 */

/** What the overlay says, e.g. "Light rain"; each has a `weather.conditions.*` key. */
export const CONDITIONS = [
  'sunny',
  'clear',
  'mostlySunny',
  'mostlyClear',
  'partlyCloudy',
  'cloudy',
  'fog',
  'lightRain',
  'rain',
  'heavyRain',
  'showers',
  'sleet',
  'snow',
  'thunder',
] as const;
export type Condition = (typeof CONDITIONS)[number];

export type Precipitation = 'rain' | 'sleet' | 'snow';
export type Intensity = 'light' | 'normal' | 'heavy';

/** What the icon draws. */
export interface Sky {
  /** The sun or the moon, peeking out on fair, partly cloudy and showery weather. */
  body: 'sun' | 'moon' | null;
  /** No cloud, a small one, or a whole sky of them. */
  clouds: 'none' | 'few' | 'some' | 'overcast';
  precipitation: Precipitation | null;
  intensity: Intensity;
  thunder: boolean;
  fog: boolean;
}

export interface Weather {
  condition: Condition;
  sky: Sky;
}

// Codes end in _day, _night or _polartwilight where the sun or moon can show.
const VARIANT = /_(day|night|polartwilight)$/;

/** The weather a MET symbol code stands for; an unknown code reads as cloudy. */
export function readSymbol(code: string): Weather {
  const variant = code.match(VARIANT)?.[1] ?? null;
  const base = code.replace(VARIANT, '');
  // Twilight in the far north: the sun is below the horizon, so no "sunny".
  const night = variant === 'night' || variant === 'polartwilight';
  const body = variant === null ? null : night ? 'moon' : 'sun';
  const sky: Sky = {
    body,
    clouds: 'overcast',
    precipitation: null,
    intensity: base.startsWith('light') ? 'light' : base.startsWith('heavy') ? 'heavy' : 'normal',
    thunder: base.includes('thunder'),
    fog: base === 'fog',
  };

  if (base === 'clearsky')
    return { condition: night ? 'clear' : 'sunny', sky: { ...sky, clouds: 'none' } };
  if (base === 'fair')
    return { condition: night ? 'mostlyClear' : 'mostlySunny', sky: { ...sky, clouds: 'few' } };
  if (base === 'partlycloudy')
    return { condition: 'partlyCloudy', sky: { ...sky, clouds: 'some' } };
  if (base === 'fog') return { condition: 'fog', sky };

  // MET writes "sleet" in light sleet with thunder as "lightssleet", and snow as "lightssnow".
  const precipitation: Precipitation | null = base.includes('snow')
    ? 'snow'
    : base.includes('sleet')
      ? 'sleet'
      : base.includes('rain')
        ? 'rain'
        : null;
  if (!precipitation) return { condition: 'cloudy', sky };
  const wet = { ...sky, precipitation, clouds: body ? ('some' as const) : ('overcast' as const) };
  if (sky.thunder) return { condition: 'thunder', sky: wet };
  if (precipitation !== 'rain') return { condition: precipitation, sky: wet };
  if (base.includes('showers')) return { condition: 'showers', sky: wet };
  const condition =
    sky.intensity === 'light' ? 'lightRain' : sky.intensity === 'heavy' ? 'heavyRain' : 'rain';
  return { condition, sky: wet };
}
