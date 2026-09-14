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
