import { afterEach, describe, expect, it, vi } from 'vitest';
import { NOMINATIM_URL, parseCoordinates, searchPlaces } from './place-field';

afterEach(() => vi.unstubAllGlobals());

describe('parseCoordinates', () => {
  it('reads a pasted latitude and longitude, rounded to about a meter', () => {
    expect(parseCoordinates('41.0256149, 28.9744')).toEqual({
      lat: 41.02561,
      lon: 28.9744,
      name: '41.02561, 28.9744',
    });
    expect(parseCoordinates(' -33.8688 151.2093 ')).toMatchObject({ lat: -33.8688, lon: 151.2093 });
  });

  it('leaves place names and impossible numbers to the search', () => {
    expect(parseCoordinates('Galata Tower')).toBeNull();
    expect(parseCoordinates('91, 10')).toBeNull();
    expect(parseCoordinates('10, 200')).toBeNull();
    expect(parseCoordinates('41.0256')).toBeNull();
  });
});

describe('searchPlaces', () => {
  it('asks Nominatim in the page language and reads its answer', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            lat: '41.0256149',
            lon: '28.9741658',
            display_name: 'Galata Kulesi, Beyoğlu, İstanbul',
          },
          { lat: 'x', lon: '1', display_name: 'broken' },
        ]),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    expect(await searchPlaces('Galata', 'tr')).toEqual([
      { lat: 41.02561, lon: 28.97417, name: 'Galata Kulesi, Beyoğlu, İstanbul' },
    ]);
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(`${url.origin}${url.pathname}`).toBe(NOMINATIM_URL);
    expect(url.searchParams.get('q')).toBe('Galata');
    expect(url.searchParams.get('accept-language')).toBe('tr');
    expect(url.searchParams.get('limit')).toBe('5');
  });

  it('throws when Nominatim does not answer, so the field can say so', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(searchPlaces('Galata', 'en')).rejects.toThrow();
  });
});
