import { describe, expect, it } from 'vitest';
import { buildEmoteWallParams, buildEmoteWallUrl, type EmoteWallUrlOptions } from './widget-url';

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
