import { describe, expect, it } from 'vitest';
import {
  channelWidgetUrl,
  clampedNumber,
  platformsOf,
  readCoercedFlag,
  readFlag,
  readWhole,
  readWidgetUrl,
  setChannels,
  setPreview,
} from './url-params';

describe('widget URL helpers', () => {
  it('writes only the picked platforms’ channels, trimmed and lowercased', () => {
    const params = new URLSearchParams();
    setChannels(params, 'twitch', ' Streamer ', 'kicker');
    expect(params.toString()).toBe('twitch=streamer');
    expect(channelWidgetUrl('https://x', '/widgets/goal', params)).toBe(
      'https://x/widgets/goal?twitch=streamer',
    );
    expect(channelWidgetUrl('https://x', '/widgets/goal', new URLSearchParams('color=red'))).toBe('');
  });

  it('marks a paired preview, and its platform only when one is picked', () => {
    const both = new URLSearchParams();
    setPreview(both, 'both', 'p1');
    expect(both.toString()).toBe('simulate=1&preview=p1');
    const kick = new URLSearchParams();
    setPreview(kick, 'kick', 'p1');
    expect(kick.get('simplatform')).toBe('kick');
  });

  it('reads a pasted widget URL and its channels, and nothing else', () => {
    expect(readWidgetUrl(' https://x/widgets/goal/?twitch=a ', '/widgets/goal')).toMatchObject({
      twitchChannel: 'a',
      kickChannel: '',
      platforms: 'twitch',
    });
    expect(readWidgetUrl('https://x/widgets/poll?twitch=a', '/widgets/goal')).toBeNull();
    expect(readWidgetUrl('not a url', '/widgets/goal')).toBeNull();
    expect(platformsOf('a', 'b')).toBe('both');
    expect(platformsOf('', '')).toBe('both');
  });

  it('reads flags with anything but an "off" word on', () => {
    expect(readFlag(null, true)).toBe(true);
    expect(readFlag(' Off ', true)).toBe(false);
    expect(readFlag('0', true)).toBe(false);
    expect(readFlag('yes', false)).toBe(true);
  });

  it('reads whole numbers, dropping or clamping ones below the minimum', () => {
    expect(readWhole('12.6', 5, { max: 100 })).toBe(13);
    expect(readWhole('500', 5, { max: 100 })).toBe(100);
    expect(readWhole('', 5, { max: 100 })).toBe(5);
    expect(readWhole('abc', 5, { max: 100 })).toBe(5);
    expect(readWhole('0', 5, { min: 1, max: 100 })).toBe(5);
    expect(readWhole('0', 5, { min: 1, max: 100, below: 'clamp' })).toBe(1);
  });
});

describe('widget URL helpers with awkward input', () => {
  it('leaves out blank channels and keeps both when both platforms are picked', () => {
    const params = new URLSearchParams();
    setChannels(params, 'both', '   ', ' Kicker ');
    expect(params.toString()).toBe('kick=kicker');
    const both = new URLSearchParams();
    setChannels(both, 'both', 'A', 'B');
    expect(both.toString()).toBe('twitch=a&kick=b');
  });

  it('encodes channel text that is not a plain name instead of breaking the query', () => {
    const params = new URLSearchParams();
    setChannels(params, 'twitch', 'a&b=c#d+e', '');
    params.set('color', 'red');
    const url = new URL(channelWidgetUrl('https://x', '/widgets/goal', params));
    expect(url.searchParams.get('twitch')).toBe('a&b=c#d+e');
    expect(url.searchParams.get('color')).toBe('red');
    expect(url.hash).toBe('');
  });

  it('reads a pasted URL with a hash, extra slashes or different case in the channel', () => {
    expect(
      readWidgetUrl('https://x/widgets/goal//?kick=Streamer#top', '/widgets/goal'),
    ).toMatchObject({
      kickChannel: 'Streamer',
      twitchChannel: '',
      platforms: 'kick',
    });
    expect(
      readWidgetUrl('https://x/widgets/goal?twitch=%20a%20&kick=b', '/widgets/goal'),
    ).toMatchObject({ twitchChannel: 'a', kickChannel: 'b', platforms: 'both' });
  });

  it('rejects an empty paste, a bare path and a path that only starts like the widget', () => {
    expect(readWidgetUrl('', '/widgets/goal')).toBeNull();
    expect(readWidgetUrl('/widgets/goal?twitch=a', '/widgets/goal')).toBeNull();
    expect(readWidgetUrl('https://x/widgets/goal-old?twitch=a', '/widgets/goal')).toBeNull();
  });

  it('reads flags case-insensitively and falls back only when the param is missing', () => {
    expect(readFlag(undefined, true)).toBe(true);
    expect(readFlag('FALSE', true)).toBe(false);
    expect(readFlag('No', true)).toBe(false);
    expect(readFlag('1', false)).toBe(true);
    expect(readCoercedFlag(null, true)).toBe(true);
    expect(readCoercedFlag(' False ', true)).toBe(false);
    expect(readCoercedFlag('null', true)).toBe(false);
    expect(readCoercedFlag('off', false)).toBe(true);
  });

  it('reads whole numbers in any notation Number() takes, and rejects the rest', () => {
    expect(readWhole('1e3', 5, { max: 5000 })).toBe(1000);
    expect(readWhole(' 42 ', 5, { max: 100 })).toBe(42);
    expect(readWhole('Infinity', 5, { max: 100 })).toBe(5);
    expect(readWhole('12px', 5, { max: 100 })).toBe(5);
    expect(readWhole('-3', 5, { max: 100 })).toBe(5);
    expect(readWhole('-3', 5, { max: 100, below: 'clamp' })).toBe(0);
    expect(readWhole('0', 5, { max: 100 })).toBe(0);
  });

  it('clamps route numbers into range and falls back on garbage', () => {
    const size = clampedNumber(32, 256, 112);
    expect(size.parse('64')).toBe(64);
    expect(size.parse(1000)).toBe(256);
    expect(size.parse('-5')).toBe(32);
    expect(size.parse('abc')).toBe(112);
    expect(size.parse('Infinity')).toBe(112);
    expect(clampedNumber(1, 10, undefined).parse('x')).toBeUndefined();
  });
});
