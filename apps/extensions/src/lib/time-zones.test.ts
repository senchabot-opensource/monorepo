import { describe, expect, it } from 'vitest';
import { isTimeZone, zoneLabel } from './time-zones';

describe('isTimeZone', () => {
  it('knows IANA zones and nothing else', () => {
    expect(isTimeZone('Asia/Tokyo')).toBe(true);
    expect(isTimeZone('UTC')).toBe(true);
    expect(isTimeZone('')).toBe(false);
    expect(isTimeZone('Mars/Base')).toBe(false);
  });
});

describe('zoneLabel', () => {
  it('puts the city first, so typing a city finds it', () => {
    expect(zoneLabel('Europe/Istanbul')).toBe('Istanbul · Europe');
    expect(zoneLabel('America/Argentina/Buenos_Aires')).toBe('Buenos Aires · America/Argentina');
    expect(zoneLabel('UTC')).toBe('UTC');
  });
});
