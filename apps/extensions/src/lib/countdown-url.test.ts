import { describe, expect, it } from 'vitest';
import {
  buildCountdownPreviewUrl,
  buildCountdownUrl,
  type CountdownSettings,
  DEFAULT_COUNTDOWN_SETTINGS,
  ICON_MAX_LENGTH,
  MAX_COUNTDOWN_TIME,
  MAX_DONE_HOLD_SECONDS,
  NOTE_MAX_LENGTH,
  parseCountdownUrl,
  readAtTime,
  readCountdownSettings,
  TITLE_MAX_LENGTH,
} from './countdown-url';

const ORIGIN = 'https://extensions.senchabot.com';
const params = (url: string) => Object.fromEntries(new URL(url).searchParams);

describe('buildCountdownUrl', () => {
  it('needs no channel and always says which scene and language it is', () => {
    expect(buildCountdownUrl(ORIGIN, DEFAULT_COUNTDOWN_SETTINGS, '', '', 'en')).toBe(
      `${ORIGIN}/widgets/countdown?scene=starting&lang=en`,
    );
  });

  it('writes the channels, the preset and the text, and drops the color a preset replaces', () => {
    const settings: CountdownSettings = {
      ...DEFAULT_COUNTDOWN_SETTINGS,
      preset: 'dynasty',
      scene: 'break',
      time: 300,
      color: 'gold',
      title: '  Birazdan dönüyorum  ',
      note: 'Kahve molası',
      done: 'Geri döndüm',
      look: 'plain',
      ending: 'hide',
      bar: false,
      motion: false,
    };
    expect(params(buildCountdownUrl(ORIGIN, settings, ' Emircan ', 'EmircanKick', 'tr'))).toEqual({
      twitch: 'emircan',
      kick: 'emircankick',
      scene: 'break',
      time: '300',
      preset: 'dynasty',
      look: 'plain',
      title: 'Birazdan dönüyorum',
      note: 'Kahve molası',
      done: 'Geri döndüm',
      end: 'hide',
      bar: '0',
      motion: '0',
      lang: 'tr',
    });
    const classic = buildCountdownUrl(ORIGIN, { ...settings, preset: 'classic' }, '', '', 'en');
    expect(new URL(classic).searchParams.get('color')).toBe('gold');
  });

  it('writes a time of day instead of a length, and only a valid one', () => {
    const at = { ...DEFAULT_COUNTDOWN_SETTINGS, time: 1800, at: '9:05' };
    expect(params(buildCountdownUrl(ORIGIN, at, '', '', 'en'))).toEqual({
      scene: 'starting',
      at: '09:05',
      lang: 'en',
    });
    // Half-typed in the setup page's field: the length it falls back to is written instead.
    expect(params(buildCountdownUrl(ORIGIN, { ...at, at: '9:' }, '', '', 'en'))).toEqual({
      scene: 'starting',
      time: '1800',
      lang: 'en',
    });
  });

  it('makes the preview simulate without a channel', () => {
    const url = buildCountdownPreviewUrl(
      ORIGIN,
      { ...DEFAULT_COUNTDOWN_SETTINGS, platforms: 'kick' },
      'abc123',
      'en',
    );
    expect(params(url)).toMatchObject({ simulate: '1', preview: 'abc123', simplatform: 'kick' });
    expect(new URL(url).searchParams.has('kick')).toBe(false);
  });
});

describe('readAtTime', () => {
  it.each([
    ['21:00', '21:00'],
    ['9:05', '09:05'],
    [' 00:00 ', '00:00'],
    ['23:59', '23:59'],
  ])('reads %s as %s', (input, expected) => {
    expect(readAtTime(input)).toBe(expected);
  });

  it.each([
    '24:00',
    '21:60',
    '9',
    '9:5',
    '21.00',
    'abc',
    '',
    null,
    undefined,
  ])('leaves %s empty', (input) => {
    expect(readAtTime(input)).toBe('');
  });
});

describe('readCountdownSettings', () => {
  it('falls back to the defaults for anything missing or mistyped', () => {
    const settings = readCountdownSettings(
      new URLSearchParams('scene=intro&end=maybe&look=fancy&color=beige&time=0&at=25:00'),
    );
    expect(settings).toMatchObject({
      scene: 'starting',
      ending: 'text',
      look: 'card',
      color: 'purple',
      time: DEFAULT_COUNTDOWN_SETTINGS.time,
      at: '',
      bar: true,
      motion: true,
    });
  });

  it('clamps the length to a day and cuts the text to its limit', () => {
    const settings = readCountdownSettings(
      new URLSearchParams(
        `time=999999&title=${'a'.repeat(60)}&note=${'b'.repeat(90)}&done=${'c'.repeat(60)}`,
      ),
    );
    expect(settings.time).toBe(MAX_COUNTDOWN_TIME);
    expect(settings.title).toHaveLength(TITLE_MAX_LENGTH);
    expect(settings.note).toHaveLength(NOTE_MAX_LENGTH);
    expect(settings.done).toHaveLength(TITLE_MAX_LENGTH);
  });

  it('writes the icons and done hold only when set, and reads them back', () => {
    expect(params(buildCountdownUrl(ORIGIN, DEFAULT_COUNTDOWN_SETTINGS, '', '', 'en'))).toEqual({
      scene: 'starting',
      lang: 'en',
    });
    const url = buildCountdownUrl(
      ORIGIN,
      {
        ...DEFAULT_COUNTDOWN_SETTINGS,
        iconStarting: '🎬',
        iconBreak: '☕',
        iconEnding: '💜',
        doneHold: 90,
      },
      '',
      '',
      'en',
    );
    expect(params(url)).toMatchObject({
      iconStarting: '🎬',
      iconBreak: '☕',
      iconEnding: '💜',
      doneHold: '90',
    });
    expect(parseCountdownUrl(url)?.settings).toMatchObject({
      iconStarting: '🎬',
      iconBreak: '☕',
      iconEnding: '💜',
      doneHold: 90,
    });
  });

  it('clamps the done hold and never splits an emoji icon', () => {
    const settings = readCountdownSettings(
      new URLSearchParams(`doneHold=99999&iconStarting=${'🔥'.repeat(20)}`),
    );
    expect(settings.doneHold).toBe(MAX_DONE_HOLD_SECONDS);
    expect(Array.from(settings.iconStarting)).toHaveLength(ICON_MAX_LENGTH);
    expect(readCountdownSettings(new URLSearchParams('doneHold=-5')).doneHold).toBe(
      DEFAULT_COUNTDOWN_SETTINGS.doneHold,
    );
  });

  it('writes the emote image only when set, and reads it back', () => {
    const url = buildCountdownUrl(
      ORIGIN,
      { ...DEFAULT_COUNTDOWN_SETTINGS, iconUrlBreak: 'https://cdn.7tv.app/emote/e1/2x.webp' },
      '',
      '',
      'en',
    );
    expect(params(url)).toMatchObject({ iconUrlBreak: 'https://cdn.7tv.app/emote/e1/2x.webp' });
    expect(parseCountdownUrl(url)?.settings).toMatchObject({
      iconUrlBreak: 'https://cdn.7tv.app/emote/e1/2x.webp',
      iconUrlStarting: '',
    });
  });
});

describe('parseCountdownUrl', () => {
  it('reads back what it wrote, channels and all', () => {
    const settings: CountdownSettings = {
      ...DEFAULT_COUNTDOWN_SETTINGS,
      platforms: 'both',
      scene: 'ending',
      at: '23:30',
      note: 'Yarın görüşürüz',
      ending: 'hold',
    };
    const url = buildCountdownUrl(ORIGIN, settings, 'emircan', 'emircankick', 'tr');
    expect(parseCountdownUrl(url)).toEqual({
      settings,
      twitchChannel: 'emircan',
      kickChannel: 'emircankick',
    });
  });

  it('turns down another widget and anything that is not a URL', () => {
    expect(parseCountdownUrl(`${ORIGIN}/widgets/subathon?twitch=emircan`)).toBeNull();
    expect(parseCountdownUrl('not a url')).toBeNull();
  });
});
