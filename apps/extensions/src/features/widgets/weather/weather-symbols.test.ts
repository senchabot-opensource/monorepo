import { describe, expect, it } from 'vitest';
import { readSymbol } from './weather-symbols';

// Every MET Norway symbol, from https://github.com/metno/weathericons (legends.csv). Those
// marked with a variant come as _day, _night and _polartwilight.
const WITH_VARIANTS = [
  'clearsky',
  'fair',
  'partlycloudy',
  'heavyrainshowers',
  'heavyrainshowersandthunder',
  'heavysleetshowers',
  'heavysleetshowersandthunder',
  'heavysnowshowers',
  'heavysnowshowersandthunder',
  'lightrainshowers',
  'lightrainshowersandthunder',
  'lightsleetshowers',
  'lightsnowshowers',
  'lightssleetshowersandthunder',
  'lightssnowshowersandthunder',
  'rainshowers',
  'rainshowersandthunder',
  'sleetshowers',
  'sleetshowersandthunder',
  'snowshowers',
  'snowshowersandthunder',
];
const WITHOUT_VARIANTS = [
  'cloudy',
  'fog',
  'heavyrain',
  'heavyrainandthunder',
  'heavysleet',
  'heavysleetandthunder',
  'heavysnow',
  'heavysnowandthunder',
  'lightrain',
  'lightrainandthunder',
  'lightsleet',
  'lightsleetandthunder',
  'lightsnow',
  'lightsnowandthunder',
  'rain',
  'rainandthunder',
  'sleet',
  'sleetandthunder',
  'snow',
  'snowandthunder',
];

describe('readSymbol', () => {
  it('reads every MET symbol as what it says, and only "cloudy" as cloudy', () => {
    const codes = [
      ...WITH_VARIANTS.flatMap((base) => [`${base}_day`, `${base}_night`, `${base}_polartwilight`]),
      ...WITHOUT_VARIANTS,
    ];
    expect(codes).toHaveLength(83);
    for (const code of codes) {
      const { condition } = readSymbol(code);
      expect(condition === 'cloudy', code).toBe(code === 'cloudy');
    }
  });

  it('says sunny only while the sun is up', () => {
    expect(readSymbol('clearsky_day')).toMatchObject({
      condition: 'sunny',
      sky: { body: 'sun', clouds: 'none' },
    });
    expect(readSymbol('clearsky_night')).toMatchObject({
      condition: 'clear',
      sky: { body: 'moon' },
    });
    expect(readSymbol('clearsky_polartwilight').condition).toBe('clear');
    expect(readSymbol('fair_day').condition).toBe('mostlySunny');
    expect(readSymbol('fair_night').condition).toBe('mostlyClear');
    expect(readSymbol('partlycloudy_night')).toMatchObject({
      condition: 'partlyCloudy',
      sky: { body: 'moon', clouds: 'some' },
    });
  });

  it('tells rain by how hard it falls, and showers by the sun between them', () => {
    expect(readSymbol('lightrain')).toMatchObject({
      condition: 'lightRain',
      sky: { precipitation: 'rain', intensity: 'light', body: null, clouds: 'overcast' },
    });
    expect(readSymbol('rain').condition).toBe('rain');
    expect(readSymbol('heavyrain').condition).toBe('heavyRain');
    expect(readSymbol('rainshowers_day')).toMatchObject({
      condition: 'showers',
      sky: { body: 'sun', clouds: 'some', precipitation: 'rain' },
    });
  });

  it('puts thunder before rain, sleet and snow', () => {
    expect(readSymbol('heavyrainandthunder')).toMatchObject({
      condition: 'thunder',
      sky: { thunder: true, precipitation: 'rain', intensity: 'heavy' },
    });
    // MET's own spelling, with an extra s.
    expect(readSymbol('lightssleetshowersandthunder_night')).toMatchObject({
      condition: 'thunder',
      sky: { precipitation: 'sleet', intensity: 'light', body: 'moon' },
    });
  });

  it('reads sleet, snow and fog', () => {
    expect(readSymbol('heavysleet')).toMatchObject({
      condition: 'sleet',
      sky: { precipitation: 'sleet', intensity: 'heavy' },
    });
    expect(readSymbol('snowshowers_day')).toMatchObject({
      condition: 'snow',
      sky: { precipitation: 'snow', body: 'sun' },
    });
    expect(readSymbol('fog')).toMatchObject({ condition: 'fog', sky: { fog: true } });
  });

  it('reads a code it has never seen as cloudy rather than failing', () => {
    expect(readSymbol('meteorshower').condition).toBe('cloudy');
  });
});
