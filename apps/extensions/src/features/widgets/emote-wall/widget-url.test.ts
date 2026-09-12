import { describe, expect, it } from 'vitest';
import {
  buildEmoteWallParams,
  buildEmoteWallUrl,
  DEFAULT_EMOTE_WALL_OPTIONS,
  type EmoteWallUrlOptions,
  parseEmoteWallUrl,
} from './widget-url';

const ORIGIN = 'https://extensions.senchabot.com';

const defaults: EmoteWallUrlOptions = {
  twitch: '',
  kick: '',
  platforms: 'both',
  sevenTv: true,
  mode: 'calm',
  subsOnly: false,
  subDurationX2: false,
  showAllEmotes: false,
  hypeMode: false,
  spamBlock: true,
  size: '112',
  duration: '5',
  max: '25',
};

const url = (overrides: Partial<EmoteWallUrlOptions>) =>
  buildEmoteWallUrl(ORIGIN, { ...defaults, twitch: 'Sencha', ...overrides });

describe('buildEmoteWallUrl', () => {
  it('omits every param that equals the widget default', () => {
    expect(url({})).toBe(`${ORIGIN}/widgets/emote-wall?twitch=sencha`);
  });

  it.each([
    ['size', 'size'],
    ['duration', 'duration'],
    ['max', 'max'],
  ] as const)('omits %s when its field is empty', (field, param) => {
    expect(new URL(url({ [field]: '' })).searchParams.has(param)).toBe(false);
    expect(new URL(url({ [field]: '   ' })).searchParams.has(param)).toBe(false);
  });

  it('omits numeric params that are not numbers', () => {
    const params = new URL(url({ size: 'abc', duration: '-', max: 'NaN' })).searchParams;
    expect(params.has('size')).toBe(false);
    expect(params.has('duration')).toBe(false);
    expect(params.has('max')).toBe(false);
  });

  it('clamps out-of-range numbers into the widget range', () => {
    const low = new URL(url({ size: '8', duration: '0', max: '0' })).searchParams;
    expect(low.get('size')).toBe('32');
    expect(low.get('duration')).toBe('2');
    expect(low.get('max')).toBe('1');

    const high = new URL(url({ size: '999', duration: '99', max: '500' })).searchParams;
    expect(high.get('size')).toBe('256');
    expect(high.get('duration')).toBe('30');
    expect(high.get('max')).toBe('120');
  });

  it('keeps the existing param contract for non-default values', () => {
    expect(
      url({
        kick: ' SomeKick ',
        sevenTv: false,
        mode: 'bounce',
        subsOnly: true,
        subDurationX2: true,
        showAllEmotes: true,
        hypeMode: true,
        spamBlock: false,
        size: '160',
        duration: '12',
        max: '40',
      }),
    ).toBe(
      `${ORIGIN}/widgets/emote-wall?twitch=sencha&kick=somekick&sevenTv=false&mode=bounce` +
        '&subsOnly=true&subDurationX2=true&showAllEmotes=true&hypeMode=true&spamBlock=false' +
        '&size=160&duration=12&max=40',
    );
  });

  it('is empty when no channel is filled in', () => {
    expect(url({ twitch: '', kick: '' })).toBe('');
    expect(url({ twitch: '   ' })).toBe('');
  });

  it('is empty when the only channel belongs to an unselected platform', () => {
    expect(url({ platforms: 'kick', twitch: 'sencha', kick: '' })).toBe('');
    expect(url({ platforms: 'twitch', twitch: '', kick: 'sencha' })).toBe('');
  });

  it('drops the unselected platform channel but keeps the selected one', () => {
    expect(url({ platforms: 'kick', twitch: 'sencha', kick: 'kicker' })).toBe(
      `${ORIGIN}/widgets/emote-wall?kick=kicker`,
    );
    expect(url({ platforms: 'twitch', twitch: 'sencha', kick: 'kicker' })).toBe(
      `${ORIGIN}/widgets/emote-wall?twitch=sencha`,
    );
  });
});

describe('buildEmoteWallParams', () => {
  it('builds params without a channel for the mock preview', () => {
    expect(buildEmoteWallParams({ ...defaults, duration: '' }).toString()).toBe('');
  });
});

describe('parseEmoteWallUrl', () => {
  const roundTrip = (text: string) => {
    const parsed = parseEmoteWallUrl(text);
    if (!parsed) throw new Error(`not parsed: ${text}`);
    return buildEmoteWallUrl(ORIGIN, parsed);
  };

  it('matches the widget defaults', () => {
    expect(DEFAULT_EMOTE_WALL_OPTIONS).toEqual(defaults);
  });

  it('rejects text that is not an Emote Wall URL', () => {
    expect(parseEmoteWallUrl('')).toBeNull();
    expect(parseEmoteWallUrl('sencha')).toBeNull();
    expect(parseEmoteWallUrl(`${ORIGIN}/widgets/chat-widget?twitch=sencha`)).toBeNull();
    expect(parseEmoteWallUrl(`${ORIGIN}/setup/emote-wall`)).toBeNull();
  });

  it('accepts any origin, a trailing slash and surrounding whitespace', () => {
    expect(parseEmoteWallUrl('  http://localhost:3000/widgets/emote-wall/?kick=a  ')).toMatchObject(
      {
        kick: 'a',
        platforms: 'kick',
      },
    );
  });

  it('loads the defaults for a URL with only channels', () => {
    expect(parseEmoteWallUrl(`${ORIGIN}/widgets/emote-wall?twitch=foo&kick=bar`)).toEqual({
      ...defaults,
      twitch: 'foo',
      kick: 'bar',
    });
  });

  it('picks the single platform when only one channel is set', () => {
    expect(parseEmoteWallUrl(`${ORIGIN}/widgets/emote-wall?twitch=foo`)?.platforms).toBe('twitch');
    expect(parseEmoteWallUrl(`${ORIGIN}/widgets/emote-wall?kick=bar`)?.platforms).toBe('kick');
  });

  it('restores every setting the setup page writes', () => {
    const options: EmoteWallUrlOptions = {
      twitch: 'foo',
      kick: 'bar',
      platforms: 'both',
      sevenTv: false,
      mode: 'chaos',
      subsOnly: true,
      subDurationX2: true,
      showAllEmotes: true,
      hypeMode: true,
      spamBlock: false,
      size: '200',
      duration: '12',
      max: '60',
    };
    expect(parseEmoteWallUrl(buildEmoteWallUrl(ORIGIN, options))).toEqual(options);
  });

  it('reads flags the way the widget does', () => {
    const flagsOf = (query: string) => parseEmoteWallUrl(`${ORIGIN}/widgets/emote-wall?${query}`);
    expect(flagsOf('sevenTv=0&spamBlock=')).toMatchObject({ sevenTv: false, spamBlock: false });
    expect(flagsOf('subsOnly=1&hypeMode=yes')).toMatchObject({ subsOnly: true, hypeMode: true });
  });

  it('falls back to defaults or clamps values the widget would not accept', () => {
    expect(
      parseEmoteWallUrl(
        `${ORIGIN}/widgets/emote-wall?twitch=foo&mode=zoom&size=abc&duration=99&max=0`,
      ),
    ).toMatchObject({ mode: 'calm', size: '112', duration: '30', max: '1' });
  });

  it('ignores preview and unknown params', () => {
    expect(
      roundTrip(`${ORIGIN}/widgets/emote-wall?twitch=foo&mock=true&lang=tr&utm_source=x`),
    ).toBe(`${ORIGIN}/widgets/emote-wall?twitch=foo`);
  });

  it('rebuilds the same URL it was given', () => {
    const urls = [
      `${ORIGIN}/widgets/emote-wall?twitch=foo`,
      `${ORIGIN}/widgets/emote-wall?kick=bar&sevenTv=false&mode=bounce`,
      `${ORIGIN}/widgets/emote-wall?twitch=foo&kick=bar&subsOnly=true&subDurationX2=true&size=160`,
      `${ORIGIN}/widgets/emote-wall?twitch=foo&showAllEmotes=true&hypeMode=true&spamBlock=false`,
      `${ORIGIN}/widgets/emote-wall?kick=bar&mode=chaos&duration=12&max=40`,
      `${ORIGIN}/widgets/emote-wall?twitch=foo&kick=bar&sevenTv=false&mode=bounce&subsOnly=true&subDurationX2=true&showAllEmotes=true&hypeMode=true&spamBlock=false&size=256&duration=30&max=120`,
    ];
    for (const url of urls) expect(roundTrip(url)).toBe(url);
  });
});
