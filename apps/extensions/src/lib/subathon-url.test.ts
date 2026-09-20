import { describe, expect, it } from 'vitest';
import {
  buildSubathonPreviewUrl,
  buildSubathonUrl,
  DEFAULT_SUBATHON_SETTINGS,
  MAX_SECONDS,
  parseSubathonUrl,
  readSubathonSettings,
  type SubathonSettings,
} from './subathon-url';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: SubathonSettings = {
  platforms: 'both',
  preset: 'classic',
  style: 'ring',
  color: 'purple',
  title: 'SUB-A-THON 2026',
  start: 7200,
  cap: 86400,
  tsub: 120,
  tgift: 90,
  bits: 0,
  ksub: 30,
  kgift: 45,
  kicks: 10,
  tiers: false,
  autostart: true,
  percent: false,
  pops: false,
};

describe('buildSubathonUrl', () => {
  it('is empty until a channel on a picked platform is filled in', () => {
    expect(buildSubathonUrl(ORIGIN, DEFAULT_SUBATHON_SETTINGS, '', '')).toBe('');
    expect(
      buildSubathonUrl(ORIGIN, { ...DEFAULT_SUBATHON_SETTINGS, platforms: 'kick' }, 'streamer', ''),
    ).toBe('');
  });

  it('writes only the channels for default settings', () => {
    expect(buildSubathonUrl(ORIGIN, DEFAULT_SUBATHON_SETTINGS, ' Streamer ', 'KickName')).toBe(
      `${ORIGIN}/widgets/subathon?twitch=streamer&kick=kickname`,
    );
  });

  it('writes every changed setting under its URL name', () => {
    const url = new URL(buildSubathonUrl(ORIGIN, CUSTOM, 'streamer', ''));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      style: 'ring',
      color: 'purple',
      title: 'SUB-A-THON 2026',
      time: '7200',
      cap: '86400',
      tsub: '120',
      tgift: '90',
      bits: '0',
      ksub: '30',
      kgift: '45',
      kicks: '10',
      tiers: '0',
      autostart: '1',
      pct: '0',
      pops: '0',
    });
  });

  it('keeps an emptied title, since that hides it', () => {
    const url = new URL(
      buildSubathonUrl(ORIGIN, { ...DEFAULT_SUBATHON_SETTINGS, title: '' }, 'streamer', ''),
    );
    expect(url.searchParams.get('title')).toBe('');
  });
});

describe('buildSubathonPreviewUrl', () => {
  it('simulates without a channel, at the given speed', () => {
    const url = new URL(buildSubathonPreviewUrl(ORIGIN, CUSTOM, 'p1', 60));
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('simspeed')).toBe('60');
    expect(url.searchParams.has('twitch')).toBe(false);
    expect(url.searchParams.get('style')).toBe('ring');
  });

  it("pairs with its page's test buttons and simulates only the picked platform", () => {
    const both = new URL(buildSubathonPreviewUrl(ORIGIN, DEFAULT_SUBATHON_SETTINGS, 'p1'));
    expect(both.searchParams.get('preview')).toBe('p1');
    expect(both.searchParams.has('simplatform')).toBe(false);
    const kick = { ...DEFAULT_SUBATHON_SETTINGS, platforms: 'kick' as const };
    expect(
      new URL(buildSubathonPreviewUrl(ORIGIN, kick, 'p1')).searchParams.get('simplatform'),
    ).toBe('kick');
  });
});

describe('parseSubathonUrl', () => {
  it('round-trips every setting', () => {
    const parsed = parseSubathonUrl(buildSubathonUrl(ORIGIN, CUSTOM, 'streamer', 'kicker'));
    expect(parsed).toEqual({ twitchChannel: 'streamer', kickChannel: 'kicker', settings: CUSTOM });
  });

  it('picks the platform from the channels it has', () => {
    const twitchOnly = buildSubathonUrl(ORIGIN, DEFAULT_SUBATHON_SETTINGS, 'streamer', '');
    expect(parseSubathonUrl(twitchOnly)?.settings.platforms).toBe('twitch');
    const kickOnly = `${ORIGIN}/widgets/subathon?kick=kicker`;
    expect(parseSubathonUrl(kickOnly)?.settings.platforms).toBe('kick');
  });

  it('falls back to defaults for values the widget would not accept', () => {
    const parsed = parseSubathonUrl(
      `${ORIGIN}/widgets/subathon?twitch=a&style=pie&color=teal&time=-5&tsub=abc&cap=99999999999&pct=yes`,
    );
    expect(parsed?.settings).toMatchObject({
      style: 'bar',
      color: 'hp',
      start: DEFAULT_SUBATHON_SETTINGS.start,
      tsub: DEFAULT_SUBATHON_SETTINGS.tsub,
      cap: MAX_SECONDS,
      percent: true,
    });
  });

  it('rejects other URLs', () => {
    expect(parseSubathonUrl('not a url')).toBeNull();
    expect(parseSubathonUrl(`${ORIGIN}/widgets/sub-sprout-widget?twitch=a`)).toBeNull();
  });
});

describe('readSubathonSettings', () => {
  it('reads the off words the other widgets accept', () => {
    for (const off of ['0', 'false', 'off', 'no']) {
      expect(readSubathonSettings(new URLSearchParams(`pops=${off}`)).pops).toBe(false);
    }
  });

  it('starts at least a minute in', () => {
    expect(readSubathonSettings(new URLSearchParams('time=0')).start).toBe(60);
  });

  it('cuts an overlong title', () => {
    const title = readSubathonSettings(new URLSearchParams(`title=${'x'.repeat(50)}`)).title;
    expect(title).toHaveLength(32);
  });
});
