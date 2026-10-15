import { describe, expect, it, vi } from 'vitest';
import { channelFromInput, kickDashName } from './channel-name';

describe('channelFromInput', () => {
  it.each([
    ['https://www.twitch.tv/senchabot', 'senchabot'],
    ['twitch.tv/senchabot', 'senchabot'],
    ['  www.twitch.tv/senchabot/  ', 'senchabot'],
    ['HTTPS://M.TWITCH.TV/SenchaBot', 'SenchaBot'],
    ['https://www.twitch.tv/senchabot/videos?filter=archives', 'senchabot'],
    ['https://www.twitch.tv/senchabot/clip/SomeClip-abc', 'senchabot'],
    ['https://www.twitch.tv/popout/senchabot/chat?popout=', 'senchabot'],
    ['https://www.twitch.tv/embed/senchabot/chat?parent=example.com', 'senchabot'],
    ['https://www.twitch.tv/moderator/senchabot', 'senchabot'],
    ['https://dashboard.twitch.tv/u/senchabot/stream-manager', 'senchabot'],
    ['https://player.twitch.tv/?channel=senchabot&parent=example.com', 'senchabot'],
    ['twitch.tv/s', 's'],
  ])('reads the Twitch channel of %s', (text, channel) => {
    expect(channelFromInput('twitch', text)).toBe(channel);
  });

  it.each([
    ['https://kick.com/sencha-fan', 'sencha-fan'],
    ['kick.com/sencha_fan', 'sencha_fan'],
    ['https://www.kick.com/senchabot/videos/0d6c1f6e', 'senchabot'],
    ['https://kick.com/senchabot?clip=clip_01', 'senchabot'],
    ['https://kick.com/popout/senchabot/chat', 'senchabot'],
    ['https://player.kick.com/senchabot', 'senchabot'],
  ])('reads the Kick channel of %s', (text, channel) => {
    expect(channelFromInput('kick', text)).toBe(channel);
  });

  it.each([
    ['twitch', 'senchabot'],
    ['twitch', 'Sencha_Bot '],
    ['twitch', 'twitch'],
    ['twitch', 'twitch.tv'],
    ['twitch', 'https://www.twitch.tv/'],
    ['twitch', 'https://www.twitch.tv/videos/2245'],
    ['twitch', 'https://www.twitch.tv/directory/category/just-chatting'],
    ['twitch', 'https://clips.twitch.tv/SomeClip'],
    ['twitch', 'https://dashboard.twitch.tv/stream-manager'],
    ['twitch', 'https://kick.com/senchabot'],
    ['twitch', 'https://www.twitch.tv/sencha-bot'],
    ['kick', 'sencha_fan'],
    ['kick', 'kick.com'],
    ['kick', 'https://kick.com/categories/just-chatting'],
    ['kick', 'https://kick.com/video/0d6c1f6e'],
    ['kick', 'https://twitch.tv/senchabot'],
    ['kick', 'https://example.com/senchabot'],
  ] as const)('leaves %s text that is no channel link as it is: %s', (platform, text) => {
    expect(channelFromInput(platform, text)).toBe(text);
  });
});

describe('kickDashName', () => {
  const answer = (statuses: Record<string, number>) =>
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const name = String(input).replace('https://kick.com/api/v1/channels/', '');
      return new Response('{}', { status: statuses[name] ?? 404 });
    });
  const asked = () => vi.mocked(fetch).mock.calls.map(([input]) => String(input));

  it('switches to - when kick.com has no channel with _ but has one with -', async () => {
    answer({ 'sencha-fan': 200 });
    expect(await kickDashName('Sencha_Fan')).toBe('sencha-fan');
    expect(asked()).toEqual([
      'https://kick.com/api/v1/channels/sencha_fan',
      'https://kick.com/api/v1/channels/sencha-fan',
    ]);
  });

  it('keeps a name with _ that is a channel, and asks only about it', async () => {
    answer({ sencha_fan: 200, 'sencha-fan': 200 });
    expect(await kickDashName('sencha_fan')).toBeNull();
    expect(asked()).toEqual(['https://kick.com/api/v1/channels/sencha_fan']);
  });

  it('keeps the name when neither spelling is a channel', async () => {
    answer({});
    expect(await kickDashName('sencha_fan')).toBeNull();
    expect(asked()).toHaveLength(2);
  });

  it("keeps the name when kick.com doesn't answer", async () => {
    answer({ sencha_fan: 403, 'sencha-fan': 200 });
    expect(await kickDashName('sencha_fan')).toBeNull();
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'));
    expect(await kickDashName('sencha_fan')).toBeNull();
    expect(asked()).toEqual([
      'https://kick.com/api/v1/channels/sencha_fan',
      'https://kick.com/api/v1/channels/sencha_fan',
    ]);
  });

  it('asks nothing about a name without _ or one that is no name', async () => {
    answer({});
    expect(await kickDashName('senchabot')).toBeNull();
    expect(await kickDashName('sencha-fan')).toBeNull();
    expect(await kickDashName('https://kick.com/sencha_fan')).toBeNull();
    expect(asked()).toEqual([]);
  });
});
