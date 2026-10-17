import { describe, expect, it } from 'vitest';
import {
  buildNowPlayingPreviewUrl,
  buildNowPlayingUrl,
  cleanUsername,
  DEFAULT_NOW_PLAYING_SETTINGS,
  MAX_HIDE,
  NOW_PLAYING_STAGE,
  type NowPlayingSettings,
  parseNowPlayingUrl,
  readNowPlayingSettings,
} from './now-playing-url';
import { getWidget } from './widgets';

const ORIGIN = 'https://extensions.senchabot.com';
const CUSTOM: NowPlayingSettings = {
  source: 'lastfm',
  user: 'night owl',
  layout: 'pill',
  art: false,
  album: false,
  hide: 0,
  preset: 'classic',
  color: 'cyan',
};
const read = (query: string) => readNowPlayingSettings(new URLSearchParams(query));
const withUser = (user: string) => ({ ...DEFAULT_NOW_PLAYING_SETTINGS, user });

describe('buildNowPlayingUrl', () => {
  it('is empty until a username is filled in', () => {
    expect(buildNowPlayingUrl(ORIGIN, DEFAULT_NOW_PLAYING_SETTINGS, 'en')).toBe('');
    expect(buildNowPlayingUrl(ORIGIN, withUser('   '), 'en')).toBe('');
  });

  it('writes only the username and the language for default settings', () => {
    expect(buildNowPlayingUrl(ORIGIN, withUser(' Listener '), 'tr')).toBe(
      `${ORIGIN}/widgets/now-playing?user=Listener&lang=tr`,
    );
  });

  it('writes every changed setting', () => {
    const url = new URL(buildNowPlayingUrl(ORIGIN, CUSTOM, 'en'));
    // Last.fm is the only source and the default, so it isn't written.
    expect(Object.fromEntries(url.searchParams)).toEqual({
      // source: 'lastfm',
      user: 'night owl',
      layout: 'pill',
      art: '0',
      album: '0',
      hide: '0',
      color: 'cyan',
      lang: 'en',
    });
  });

  it('writes a preset instead of the color, which the preset brings', () => {
    const url = new URL(buildNowPlayingUrl(ORIGIN, { ...CUSTOM, preset: 'rift' }, 'en'));
    expect(url.searchParams.get('preset')).toBe('rift');
    expect(url.searchParams.has('color')).toBe(false);
  });

  it('takes the name out of a pasted profile link', () => {
    const url = new URL(
      // buildNowPlayingUrl(ORIGIN, withUser('https://listenbrainz.org/user/Night%20Owl/'), 'en'),
      buildNowPlayingUrl(ORIGIN, withUser('https://www.last.fm/user/Night%20Owl/'), 'en'),
    );
    expect(url.searchParams.get('user')).toBe('Night Owl');
  });
});

describe('buildNowPlayingPreviewUrl', () => {
  it('plays sample songs, paired with its page', () => {
    const url = new URL(buildNowPlayingPreviewUrl(ORIGIN, CUSTOM, 'de', 'abc'));
    expect(url.searchParams.get('demo')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('abc');
    expect(url.searchParams.get('lang')).toBe('de');
    expect(url.searchParams.get('layout')).toBe('pill');
  });

  it('shows the real song only when asked and there is a username', () => {
    const live = new URL(buildNowPlayingPreviewUrl(ORIGIN, CUSTOM, 'en', 'abc', true));
    expect(live.searchParams.has('demo')).toBe(false);
    expect(live.searchParams.get('user')).toBe('night owl');
    const nobody = new URL(
      buildNowPlayingPreviewUrl(ORIGIN, DEFAULT_NOW_PLAYING_SETTINGS, 'en', 'abc', true),
    );
    expect(nobody.searchParams.get('demo')).toBe('1');
  });
});

describe('readNowPlayingSettings', () => {
  it('falls back to the defaults for missing and garbage params', () => {
    expect(read('')).toEqual(DEFAULT_NOW_PLAYING_SETTINGS);
    // ListenBrainz is off for now: an old URL that names it reads Last.fm.
    expect(read('source=listenbrainz&user=mira').source).toBe('lastfm');
    expect(
      read('source=spotify&layout=round&art=maybe&album=no&hide=soon&color=teal&preset=nope'),
    ).toEqual({ ...DEFAULT_NOW_PLAYING_SETTINGS, album: false });
  });

  it('keeps 0 as never hiding, and caps how long a song stays', () => {
    expect(read('hide=0').hide).toBe(0);
    expect(read('hide=25').hide).toBe(25);
    expect(read('hide=999').hide).toBe(MAX_HIDE);
    expect(read('hide=-5').hide).toBe(DEFAULT_NOW_PLAYING_SETTINGS.hide);
  });

  it('reads the username the way it was written, trimmed', () => {
    expect(read('user=%20DJ_Mira%20').user).toBe('DJ_Mira');
    expect(read(`user=${'x'.repeat(100)}`).user).toHaveLength(64);
  });
});

describe('cleanUsername', () => {
  it('takes a name, an @name or a Last.fm profile link', () => {
    expect(cleanUsername('  mira ')).toBe('mira');
    expect(cleanUsername('@mira')).toBe('mira');
    expect(cleanUsername('https://www.last.fm/user/Mira_99')).toBe('Mira_99');
    expect(cleanUsername('last.fm/user/mira/library?page=2')).toBe('mira');
    expect(cleanUsername('https://www.lastfm.de/user/mira')).toBe('mira');
    // expect(cleanUsername('listenbrainz.org/user/mira')).toBe('mira');
  });
});

describe('parseNowPlayingUrl', () => {
  it('reads back what buildNowPlayingUrl wrote, with its language', () => {
    expect(parseNowPlayingUrl(buildNowPlayingUrl(ORIGIN, CUSTOM, 'ja'))).toEqual({
      settings: CUSTOM,
      locale: 'ja',
    });
    const preset = { ...withUser('mira'), preset: 'rift' };
    expect(parseNowPlayingUrl(buildNowPlayingUrl(ORIGIN, preset, 'en'))?.settings).toEqual(preset);
  });

  it('is null for other widgets and garbage', () => {
    expect(parseNowPlayingUrl(`${ORIGIN}/widgets/weather?lat=1&lon=2`)).toBeNull();
    expect(parseNowPlayingUrl('nope')).toBeNull();
  });

  it('gives the registry the stage as the browser source size', () => {
    expect(getWidget('now-playing').sourceSize).toEqual(NOW_PLAYING_STAGE);
  });
});
