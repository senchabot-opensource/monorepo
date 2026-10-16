import { describe, expect, it } from 'vitest';
import {
  buildHudPreviewUrl,
  buildHudUrl,
  DEFAULT_HUD_SETTINGS,
  type HudSettings,
  isItemName,
  isPlaceName,
  MAX_EVENT_MONEY,
  MAX_ITEMS,
  MAX_MONEY,
  MAX_PLACES,
  parseHudUrl,
  readHudSettings,
} from './irl-hud-url';

const ORIGIN = 'https://extensions.senchabot.com';
const settings = (overrides: Partial<HudSettings> = {}): HudSettings => ({
  ...DEFAULT_HUD_SETTINGS,
  ...overrides,
});
const read = (query: string) => readHudSettings(new URLSearchParams(query));

describe('buildHudUrl', () => {
  it('is empty until a channel is filled in', () => {
    expect(buildHudUrl(ORIGIN, settings(), '', '')).toBe('');
    expect(buildHudUrl(ORIGIN, settings({ platforms: 'kick' }), 'streamer', '')).toBe('');
  });

  it('writes only the channels at the defaults', () => {
    expect(buildHudUrl(ORIGIN, settings(), ' Streamer ', 'Kicker')).toBe(
      `${ORIGIN}/widgets/irl-hud?twitch=streamer&kick=kicker`,
    );
  });

  it('writes every changed setting and reads it back the same', () => {
    const changed = settings({
      platforms: 'both',
      style: 'modern',
      corner: 'bl',
      size: 150,
      start: 350,
      tsub: 500,
      tgift: 250,
      bits: 0,
      traid: 5,
      ksub: 300,
      kgift: 200,
      kicks: 40,
      kraid: 0,
      follow: 25,
      tiers: false,
      clock: false,
      h12: true,
      tz: 'Europe/Istanbul',
      radar: true,
      radarCorner: 'tr',
      map: 'real',
      places: [
        { name: 'park1', lat: 41.02561, lon: 28.97436 },
        { name: 'Kadıköy', lat: 40.99, lon: 29.02 },
      ],
      move: 'stay',
      items: [
        { name: 'water', price: 100 },
        { name: 'Energy Drink', price: 2500 },
      ],
      pops: false,
    });
    const url = buildHudUrl(ORIGIN, changed, 'streamer', 'kicker', 'senchabot-token');
    expect(url).toContain('style=modern');
    expect(url).toContain('follow=25');
    expect(url).toContain('radarCorner=tr');
    expect(new URL(url).searchParams.get('places')).toBe(
      'park1:41.02561,28.97436;Kadıköy:40.99,29.02',
    );
    expect(url).toContain('tz=Europe%2FIstanbul');
    expect(parseHudUrl(url)).toEqual({
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
      token: 'senchabot-token',
      settings: changed,
    });
  });

  it('leaves the mini-map settings out while the mini-map is off', () => {
    const places = [{ name: 'park1', lat: 1, lon: 2 }];
    const off = settings({ radar: false, radarCorner: 'tr', map: 'real', places });
    expect(buildHudUrl(ORIGIN, off, 'x', '')).toBe(`${ORIGIN}/widgets/irl-hud?twitch=x&radar=0`);
  });

  it('writes saved places with any map, rounded to about a meter, for chat to switch to', () => {
    const places = [{ name: 'park1', lat: 41.0256149, lon: -0.123456789 }];
    const park = new URL(buildHudUrl(ORIGIN, settings({ map: 'park', places }), 'x', ''));
    expect(park.searchParams.get('map')).toBe('park');
    expect(park.searchParams.get('places')).toBe('park1:41.02561,-0.12346');
    // Without a place yet the real map is asked for anyway; the overlay walks the city until then.
    expect(buildHudUrl(ORIGIN, settings({ map: 'real' }), 'x', '')).toBe(
      `${ORIGIN}/widgets/irl-hud?twitch=x&map=real`,
    );
  });

  it('makes a preview that simulates and never names a channel', () => {
    const url = new URL(buildHudPreviewUrl(ORIGIN, settings({ platforms: 'kick' }), 'abc'));
    expect(url.pathname).toBe('/widgets/irl-hud');
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc');
    expect(url.searchParams.get('simplatform')).toBe('kick');
    expect(url.searchParams.has('twitch')).toBe(false);
  });
});

describe('readHudSettings', () => {
  it('falls back to the defaults for missing or broken values', () => {
    const { platforms: _, ...defaults } = DEFAULT_HUD_SETTINGS;
    expect(read('')).toEqual(defaults);
    expect(
      read(
        'style=neon&corner=middle&radarCorner=up&map=moon&size=big&start=lots&tsub=x&tz=Mars/Base',
      ),
    ).toEqual(defaults);
  });

  it('clamps numbers into range', () => {
    expect(read('size=10').size).toBe(50);
    expect(read('size=900').size).toBe(200);
    expect(read('start=-500').start).toBe(0);
    expect(read('start=5000000000').start).toBe(MAX_MONEY);
    expect(read('tsub=99999999').tsub).toBe(MAX_EVENT_MONEY);
    expect(read('bits=12.6').bits).toBe(13);
  });

  it('reads saved places, skipping broken, reserved and repeated ones', () => {
    const places = (value: string) => read(`places=${encodeURIComponent(value)}`).places;
    expect(places('park1:41.0256,28.9744;park2:-33.86,151.2')).toEqual([
      { name: 'park1', lat: 41.0256, lon: 28.9744 },
      { name: 'park2', lat: -33.86, lon: 151.2 },
    ]);
    expect(
      places('two words:1,2;urban:1,2;Reset:1,2;far:95,2;x:1;:1,2;park1:1,2;PARK1:3,4'),
    ).toEqual([{ name: 'park1', lat: 1, lon: 2 }]);
    const many = Array.from({ length: 12 }, (_, i) => `p${i}:1,2`).join(';');
    expect(places(many)).toHaveLength(MAX_PLACES);
  });

  it('reads market items, skipping broken, priceless and repeated ones', () => {
    const items = (value: string) => read(`items=${encodeURIComponent(value)}`).items;
    expect(items('water:100;Energy  Drink :2500')).toEqual([
      { name: 'water', price: 100 },
      { name: 'Energy Drink', price: 2500 },
    ]);
    expect(items('free:0;3:5;a;b:-1;c:1.5;WATER:1;water:2;water:3')).toEqual([
      { name: 'WATER', price: 1 },
    ]);
    expect(items('huge:5000000')).toEqual([]);
    const many = Array.from({ length: 25 }, (_, i) => `item${i}:1`).join(';');
    expect(items(many)).toHaveLength(MAX_ITEMS);
  });

  it('reads the arrow movement, walking by default', () => {
    expect(read('move=run').move).toBe('run');
    expect(read('move=fly').move).toBe('walk');
  });

  it('reads the one place of an older URL as place1', () => {
    expect(read('map=real&lat=41.0256&lon=28.9744').places).toEqual([
      { name: 'place1', lat: 41.0256, lon: 28.9744 },
    ]);
    expect(read('lat=41&lon=').places).toEqual([]);
    expect(read('lat=95&lon=10').places).toEqual([]);
    // A list in the URL wins over the old pair.
    expect(read('lat=1&lon=2&places=a:3,4').places).toEqual([{ name: 'a', lat: 3, lon: 4 }]);
  });

  it('reads flags the way the other widgets do', () => {
    expect(read('clock=0&radar=off&pops=false&h12=1&tiers=no')).toMatchObject({
      clock: false,
      radar: false,
      pops: false,
      h12: true,
      tiers: false,
    });
  });
});

describe('parseHudUrl', () => {
  it('rejects other widgets and text that is not a URL', () => {
    expect(parseHudUrl(`${ORIGIN}/widgets/subathon?twitch=streamer`)).toBeNull();
    expect(parseHudUrl('irl hud')).toBeNull();
  });

  it('picks the platform from the channels it has', () => {
    expect(parseHudUrl(`${ORIGIN}/widgets/irl-hud?kick=kicker`)?.settings.platforms).toBe('kick');
  });
});

describe('isPlaceName', () => {
  it('takes one short word in any script, but not the words !hud map already uses', () => {
    for (const name of ['park1', 'Kadıköy', 'north_side', 'home-2', '公園']) {
      expect(isPlaceName(name)).toBe(true);
    }
    for (const name of ['', 'two words', 'a:b', 'urban', 'Park', 'reset', 'x'.repeat(21)]) {
      expect(isPlaceName(name)).toBe(false);
    }
  });
});

describe('isItemName', () => {
  it('takes words with a letter in them, up to 24 characters', () => {
    for (const name of ['water', 'Energy Drink', '7up', 'su', '水', '  coffee  ']) {
      expect(isItemName(name)).toBe(true);
    }
    for (const name of ['', '3', '12 34', 'a:b', 'semi;colon', 'x'.repeat(25)]) {
      expect(isItemName(name)).toBe(false);
    }
  });
});
