import { describe, expect, it } from 'vitest';
import {
  buildStreamAlertsPreviewUrl,
  buildStreamAlertsUrl,
  DEFAULT_STREAM_ALERTS_SETTINGS,
  parseStreamAlertsUrl,
  readStreamAlertsSettings,
  type StreamAlertsSettings,
} from './stream-alerts-url';

const ORIGIN = 'https://extensions.senchabot.com';
const { platforms: _, ...DEFAULTS } = DEFAULT_STREAM_ALERTS_SETTINGS;

describe('buildStreamAlertsUrl', () => {
  it('stays empty without a channel on a picked platform', () => {
    expect(buildStreamAlertsUrl(ORIGIN, DEFAULT_STREAM_ALERTS_SETTINGS, '', '', 'en')).toBe('');
    const twitchOnly = { ...DEFAULT_STREAM_ALERTS_SETTINGS, platforms: 'twitch' as const };
    expect(buildStreamAlertsUrl(ORIGIN, twitchOnly, '', 'kickname', 'en')).toBe('');
  });

  it('writes only what differs from the defaults, plus the language', () => {
    expect(
      buildStreamAlertsUrl(ORIGIN, DEFAULT_STREAM_ALERTS_SETTINGS, ' Streamer ', 'kicker', 'tr'),
    ).toBe(`${ORIGIN}/widgets/stream-alerts?twitch=streamer&kick=kicker&lang=tr`);
  });

  it('round-trips every setting through parseStreamAlertsUrl', () => {
    const settings: StreamAlertsSettings = {
      platforms: 'kick',
      theme: 'celestial',
      color: 'gold',
      enabled: { sub: true, gift: false, bits: true, raid: false },
      headings: { sub: 'WELCOME', gift: '', bits: '100', raid: 'Raid!' },
      minGift: 5,
      minBits: 250,
      minRaid: 10,
      duration: 12,
      volume: 0,
      message: false,
    };
    const url = buildStreamAlertsUrl(ORIGIN, settings, '', 'kicker', 'tr');
    expect(parseStreamAlertsUrl(url)).toEqual({
      settings,
      twitchChannel: '',
      kickChannel: 'kicker',
      locale: 'tr',
    });
  });
});

describe('buildStreamAlertsPreviewUrl', () => {
  it('simulates without channels, and only the picked platform', () => {
    const both = new URL(
      buildStreamAlertsPreviewUrl(ORIGIN, DEFAULT_STREAM_ALERTS_SETTINGS, 'en', 'p1'),
    );
    expect(both.searchParams.get('simulate')).toBe('1');
    expect(both.searchParams.get('preview')).toBe('p1');
    expect(both.searchParams.has('simplatform')).toBe(false);
    expect(both.searchParams.has('twitch')).toBe(false);

    const kick = { ...DEFAULT_STREAM_ALERTS_SETTINGS, platforms: 'kick' as const };
    expect(
      new URL(buildStreamAlertsPreviewUrl(ORIGIN, kick, 'en', 'p1')).searchParams.get(
        'simplatform',
      ),
    ).toBe('kick');
  });
});

describe('readStreamAlertsSettings', () => {
  it('falls back to the defaults on missing or broken values', () => {
    expect(readStreamAlertsSettings(new URLSearchParams())).toEqual(DEFAULTS);
    // A negative minimum clamps to 1, the default; anything but an "off" word keeps an alert on.
    const broken = new URLSearchParams('theme=x&color=teal&dur=abc&vol=&mingift=-3&sub=nope');
    expect(readStreamAlertsSettings(broken)).toEqual(DEFAULTS);
  });

  it('clamps numbers and cuts long headings', () => {
    const params = new URLSearchParams(
      `dur=99&vol=500&minbits=0&hsub=${'A'.repeat(40)}&gift=0&msg=off`,
    );
    const settings = readStreamAlertsSettings(params);
    expect(settings.duration).toBe(20);
    expect(settings.volume).toBe(100);
    expect(settings.minBits).toBe(1);
    expect(settings.headings.sub).toHaveLength(24);
    expect(settings.enabled.gift).toBe(false);
    expect(settings.message).toBe(false);
  });
});

describe('parseStreamAlertsUrl', () => {
  it('rejects other widgets and text that is not a URL', () => {
    expect(parseStreamAlertsUrl(`${ORIGIN}/widgets/subathon?twitch=a`)).toBeNull();
    expect(parseStreamAlertsUrl('streamer')).toBeNull();
  });
});

describe('Stream Alerts URL edge cases', () => {
  const read = (query: string) => readStreamAlertsSettings(new URLSearchParams(query));

  it('never throws on garbage, and every value stays in range', () => {
    const garbage = [
      'dur=Infinity&vol=-Infinity&mingift=1e400&minbits=NaN&minraid=--1',
      'dur=0x10&vol=1e2&mingift=%20&theme=__proto__&color=constructor',
      'sub=&gift=%00&hsub=%E0%A4%A&msg=',
      'dur=3.4&vol=99.5&minraid=-0',
    ];
    for (const query of garbage) {
      const settings = read(query);
      expect(settings.duration).toBeGreaterThanOrEqual(3);
      expect(settings.duration).toBeLessThanOrEqual(20);
      expect(settings.volume).toBeGreaterThanOrEqual(0);
      expect(settings.volume).toBeLessThanOrEqual(100);
      for (const key of ['minGift', 'minBits', 'minRaid'] as const) {
        expect(Number.isInteger(settings[key])).toBe(true);
        expect(settings[key]).toBeGreaterThanOrEqual(0);
      }
      expect(['neon', 'celestial']).toContain(settings.theme);
    }
  });

  it('rounds fractions to whole numbers', () => {
    expect(read('dur=3.4&vol=99.5')).toMatchObject({ duration: 3, volume: 100 });
  });

  it('reads an empty flag as on, like any word but an off word', () => {
    expect(read('sub=&msg=').enabled.sub).toBe(true);
    expect(read('msg=').message).toBe(true);
    expect(read('sub=OFF&gift=No&bits=FALSE&raid=0').enabled).toEqual({
      sub: false,
      gift: false,
      bits: false,
      raid: false,
    });
  });

  it('round-trips headings with URL-special characters and non-Latin text', () => {
    const headings = { sub: 'A&B=C?#%', gift: 'Hediye 🎁', bits: 'YENİ ÇİZ', raid: '+ raid +' };
    const url = buildStreamAlertsUrl(
      ORIGIN,
      { ...DEFAULT_STREAM_ALERTS_SETTINGS, headings },
      'streamer',
      '',
      'en',
    );
    expect(parseStreamAlertsUrl(url)?.settings.headings).toEqual(headings);
  });

  it('writes a heading of only spaces as no heading', () => {
    const url = buildStreamAlertsUrl(
      ORIGIN,
      { ...DEFAULT_STREAM_ALERTS_SETTINGS, headings: { ...DEFAULTS.headings, sub: '   ' } },
      'streamer',
      '',
      'en',
    );
    expect(new URL(url).searchParams.has('hsub')).toBe(false);
  });

  it('round-trips the minimums at both ends of their range', () => {
    for (const [minGift, minBits, minRaid] of [
      [1, 1, 0],
      [100_000, 100_000, 100_000],
    ]) {
      const settings = { ...DEFAULT_STREAM_ALERTS_SETTINGS, minGift, minBits, minRaid };
      const url = buildStreamAlertsUrl(ORIGIN, settings, 'streamer', '', 'en');
      expect(parseStreamAlertsUrl(url)?.settings).toMatchObject({ minGift, minBits, minRaid });
    }
  });

  it('keeps no locale from a URL without a valid lang', () => {
    expect(parseStreamAlertsUrl(`${ORIGIN}/widgets/stream-alerts?twitch=a&lang=xx`)?.locale).toBe(
      null,
    );
  });

  it('reads a preview URL back without its preview params', () => {
    const preview = buildStreamAlertsPreviewUrl(
      ORIGIN,
      { ...DEFAULT_STREAM_ALERTS_SETTINGS, theme: 'celestial', platforms: 'kick' },
      'tr',
      'p9',
    );
    const parsed = parseStreamAlertsUrl(preview);
    expect(parsed?.settings.theme).toBe('celestial');
    expect(parsed?.twitchChannel).toBe('');
    expect(parsed?.kickChannel).toBe('');
  });
});
