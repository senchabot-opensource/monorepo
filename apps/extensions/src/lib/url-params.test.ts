import { describe, expect, it } from 'vitest';
import {
  channelWidgetUrl,
  platformsOf,
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
