import { describe, expect, it } from 'vitest';
import {
  buildEventListPreviewUrl,
  buildEventListUrl,
  DEFAULT_EVENT_LIST_SETTINGS,
  EVENT_LIST_STAGE,
  type EventListSettings,
  eventListStage,
  MAX_ROWS,
  parseEventListUrl,
  readEventListSettings,
} from './event-list-url';
import { getWidget } from './widgets';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: EventListSettings = {
  platforms: 'both',
  preset: 'classic',
  color: 'gold',
  kinds: { sub: true, gift: false, bits: true, raid: false },
  rows: 8,
  newest: 'bottom',
  fade: 30,
  minBits: 100,
  minRaid: 5,
  title: 'Recent & Best',
};
const read = (query: string) => readEventListSettings(new URLSearchParams(query));

describe('buildEventListUrl', () => {
  it('is empty until a channel on a picked platform is filled in', () => {
    expect(buildEventListUrl(ORIGIN, DEFAULT_EVENT_LIST_SETTINGS, '', '', 'en')).toBe('');
  });

  it('writes only the channels and the language for default settings', () => {
    expect(
      buildEventListUrl(ORIGIN, DEFAULT_EVENT_LIST_SETTINGS, ' Streamer ', 'Kicker', 'tr'),
    ).toBe(`${ORIGIN}/widgets/event-list?twitch=streamer&kick=kicker&lang=tr`);
  });

  it('writes every changed setting', () => {
    const url = new URL(buildEventListUrl(ORIGIN, CUSTOM, 'streamer', '', 'en'));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      twitch: 'streamer',
      color: 'gold',
      gift: '0',
      raid: '0',
      rows: '8',
      newest: 'bottom',
      fade: '30',
      minbits: '100',
      minraid: '5',
      title: 'Recent & Best',
      lang: 'en',
    });
  });

  it('builds a preview that never names a channel and is paired with its page', () => {
    const url = new URL(buildEventListPreviewUrl(ORIGIN, CUSTOM, 'de', 'abc'));
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc');
    expect(url.searchParams.has('twitch')).toBe(false);
    expect(url.searchParams.get('lang')).toBe('de');
  });

  it('writes a preset instead of the color, which the preset brings', () => {
    const url = new URL(buildEventListUrl(ORIGIN, { ...CUSTOM, preset: 'rift' }, 'x', '', 'en'));
    expect(url.searchParams.get('preset')).toBe('rift');
    expect(url.searchParams.has('color')).toBe(false);
  });
});

describe('readEventListSettings', () => {
  it('falls back to the defaults for missing and garbage params', () => {
    const { ...settings } = read('color=teal&newest=middle&rows=x&fade=-1&minbits=0&gift=no');
    expect(settings).toEqual({
      ...(({ platforms: _, ...rest }) => rest)(DEFAULT_EVENT_LIST_SETTINGS),
      kinds: { sub: true, gift: false, bits: true, raid: true },
    });
  });

  it('clamps the rows into range', () => {
    expect(read('rows=1').rows).toBe(3);
    expect(read('rows=99').rows).toBe(MAX_ROWS);
  });
});

describe('parseEventListUrl', () => {
  it('reads back what buildEventListUrl wrote, with its language', () => {
    const parsed = parseEventListUrl(buildEventListUrl(ORIGIN, CUSTOM, 'Streamer', 'kicker', 'ja'));
    expect(parsed).toEqual({
      settings: CUSTOM,
      twitchChannel: 'streamer',
      kickChannel: 'kicker',
      locale: 'ja',
    });
  });

  it('is null for other widgets and garbage', () => {
    expect(parseEventListUrl(`${ORIGIN}/widgets/goal?twitch=x`)).toBeNull();
    expect(parseEventListUrl('nope')).toBeNull();
  });

  it('gives the registry the stage as the browser source size', () => {
    expect(getWidget('event-list').sourceSize).toEqual(EVENT_LIST_STAGE);
  });
});

describe('eventListStage', () => {
  it('keeps the default size up to six rows and grows past that', () => {
    expect(eventListStage(5)).toEqual(EVENT_LIST_STAGE);
    expect(eventListStage(6)).toEqual(EVENT_LIST_STAGE);
    expect(eventListStage(10)).toEqual({ width: EVENT_LIST_STAGE.width, height: 760 });
  });
});
