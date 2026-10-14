import { describe, expect, it } from 'vitest';
import { isWeatherToggle, toggleStorageKey } from './use-weather-toggle';

describe('isWeatherToggle', () => {
  it("takes the IRL HUD's command with the weather and nothing after it", () => {
    expect(isWeatherToggle('!h weather')).toBe(true);
    expect(isWeatherToggle('!hud weather')).toBe(true);
    expect(isWeatherToggle(' !H WEATHER ')).toBe(true);
  });

  it('turns down the HUD parts, anything after the weather and other commands', () => {
    expect(isWeatherToggle('!h map')).toBe(false);
    expect(isWeatherToggle('!h weather off')).toBe(false);
    expect(isWeatherToggle('!h')).toBe(false);
    expect(isWeatherToggle('!weather')).toBe(false);
    expect(isWeatherToggle('!hw weather')).toBe(false);
  });
});

describe('toggleStorageKey', () => {
  it('keeps one hidden state per channel pair, whatever the case', () => {
    expect(toggleStorageKey(' Streamer ')).toBe('senchabot.weather:streamer:');
    expect(toggleStorageKey('', 'KickName')).toBe('senchabot.weather::kickname');
  });
});
