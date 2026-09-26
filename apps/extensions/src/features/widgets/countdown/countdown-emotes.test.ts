import { beforeEach, describe, expect, it, vi } from 'vitest';
import { thumbUrl } from './countdown-emotes';

// fetchJson caches per URL, so each test gets a fresh module copy.
beforeEach(() => {
  vi.resetModules();
});
const load = async (twitch: string, kick: string) =>
  (await import('./countdown-emotes')).loadChannelEmotes(twitch, kick);

const twitchUser = (id: string) => ({ id, login: 'streamer', display_name: 'Streamer' });

function mockFetch(handler: (url: string) => unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      const body = handler(url);
      if (body instanceof Error) throw body;
      if (body === undefined) return new Response('{}', { status: 404 });
      return Response.json(body);
    }),
  );
}

describe('thumbUrl', () => {
  it.each([
    ['https://cdn.7tv.app/emote/e1/2x.webp', 'https://cdn.7tv.app/emote/e1/1x.webp'],
    ['https://cdn.betterttv.net/emote/b1/2x.webp', 'https://cdn.betterttv.net/emote/b1/1x.webp'],
    ['https://cdn.frankerfacez.com/emote/9/2', 'https://cdn.frankerfacez.com/emote/9/1'],
    [
      'https://static-cdn.jtvnw.net/emoticons/v2/1/default/light/2.0',
      'https://static-cdn.jtvnw.net/emoticons/v2/1/default/light/1.0',
    ],
    [
      'https://static-cdn.jtvnw.net/emoticons/v2/1/default/dark/2.0',
      'https://static-cdn.jtvnw.net/emoticons/v2/1/default/dark/1.0',
    ],
    ['https://files.kick.com/emotes/11/fullsize', 'https://files.kick.com/emotes/11/fullsize'],
    ['https://example.com/emote.png', 'https://example.com/emote.png'],
  ])('shrinks %s to %s', (url, thumb) => {
    expect(thumbUrl(url)).toBe(thumb);
  });
});

describe('loadChannelEmotes', () => {
  it('returns nothing without a channel', async () => {
    const fetch = vi.fn(async () => Response.json({}));
    vi.stubGlobal('fetch', fetch);
    expect(await load('', '')).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reads the Twitch channel sets, never the shared or global pools', async () => {
    mockFetch((url) => {
      if (url.startsWith('https://api.ivr.fi/')) return [twitchUser('1')];
      if (url === 'https://7tv.io/v3/users/twitch/1')
        return { emote_set: { emotes: [{ id: 'e1', name: 'catJAM' }] } };
      if (url === 'https://api.betterttv.net/3/cached/users/twitch/1')
        return {
          channelEmotes: [{ id: 'b1', code: 'sweet' }],
          sharedEmotes: [{ id: 'b2', code: 'shared' }],
        };
      if (url === 'https://api.frankerfacez.com/v1/room/id/1')
        return {
          sets: {
            1: {
              emoticons: [
                { name: 'ZrehplaR', urls: { '2': 'https://cdn.frankerfacez.com/emote/9/2' } },
              ],
            },
          },
        };
      return undefined;
    });
    const emotes = await load('streamer', '');
    // Native subscriber emotes first, then 7TV, BTTV, FFZ, so earlier lists win a name clash.
    expect(emotes).toEqual([
      {
        name: 'catJAM',
        url: 'https://cdn.7tv.app/emote/e1/2x.webp',
        thumb: 'https://cdn.7tv.app/emote/e1/1x.webp',
        platform: 'twitch',
        provider: '7TV',
        subOnly: false,
      },
      {
        name: 'sweet',
        url: 'https://cdn.betterttv.net/emote/b1/2x.webp',
        thumb: 'https://cdn.betterttv.net/emote/b1/1x.webp',
        platform: 'twitch',
        provider: 'BTTV',
        subOnly: false,
      },
      {
        name: 'ZrehplaR',
        url: 'https://cdn.frankerfacez.com/emote/9/2',
        thumb: 'https://cdn.frankerfacez.com/emote/9/1',
        platform: 'twitch',
        provider: 'FFZ',
        subOnly: false,
      },
    ]);
  });

  it('prefers the 7TV channel set on a name clash', async () => {
    mockFetch((url) => {
      if (url.startsWith('https://api.ivr.fi/')) return [twitchUser('1')];
      if (url === 'https://7tv.io/v3/users/twitch/1')
        return { emote_set: { emotes: [{ id: 'e1', name: 'KEKW' }] } };
      if (url === 'https://api.betterttv.net/3/cached/users/twitch/1')
        return { channelEmotes: [{ id: 'b1', code: 'KEKW' }] };
      return undefined;
    });
    const emotes = await load('streamer', '');
    expect(emotes).toEqual([
      {
        name: 'KEKW',
        url: 'https://cdn.7tv.app/emote/e1/2x.webp',
        thumb: 'https://cdn.7tv.app/emote/e1/1x.webp',
        platform: 'twitch',
        provider: '7TV',
        subOnly: false,
      },
    ]);
  });

  it('reads the Kick 7TV set through the channel lookup', async () => {
    mockFetch((url) => {
      if (url === 'https://kick.com/api/v1/channels/kicker')
        return { id: 7, user_id: 9, chatroom: { id: 42 }, subscriber_badges: [] };
      if (url === 'https://kick.com/emotes/kicker') return [];
      if (url === 'https://7tv.io/v3/users/kick/9')
        return { emote_set: { emotes: [{ id: 'e9', name: 'kickRave' }] } };
      return undefined;
    });
    expect(await load('', 'kicker')).toEqual([
      {
        name: 'kickRave',
        url: 'https://cdn.7tv.app/emote/e9/2x.webp',
        thumb: 'https://cdn.7tv.app/emote/e9/1x.webp',
        platform: 'kick',
        provider: '7TV',
        subOnly: false,
      },
    ]);
  });

  it('reads the Twitch subscriber emotes first', async () => {
    mockFetch((url) => {
      if (url === 'https://emotes.adamcy.pl/v1/channel/streamer/emotes/twitch')
        return [
          {
            code: 'streamLove',
            urls: [
              { size: '1x', url: 'https://static-cdn.jtvnw.net/emoticons/v2/1/default/light/1.0' },
              { size: '2x', url: 'https://static-cdn.jtvnw.net/emoticons/v2/1/default/light/2.0' },
            ],
          },
        ];
      if (url.startsWith('https://api.ivr.fi/')) return [twitchUser('1')];
      if (url === 'https://7tv.io/v3/users/twitch/1')
        return { emote_set: { emotes: [{ id: 'e1', name: 'streamLove' }] } };
      return undefined;
    });
    expect(await load('streamer', '')).toEqual([
      {
        name: 'streamLove',
        url: 'https://static-cdn.jtvnw.net/emoticons/v2/1/default/light/2.0',
        thumb: 'https://static-cdn.jtvnw.net/emoticons/v2/1/default/light/1.0',
        platform: 'twitch',
        provider: 'Twitch',
        subOnly: false,
      },
    ]);
  });

  it('reads the Kick channel emotes with their subscriber flag', async () => {
    mockFetch((url) => {
      if (url === 'https://kick.com/emotes/kicker')
        return [
          {
            emotes: [
              { id: 11, channel_id: 7, name: 'kickerLove', subscribers_only: true },
              { id: 12, channel_id: 7, name: 'kickerHi', subscribers_only: false },
            ],
          },
          { name: 'Global', id: 'Global', emotes: [] },
          { name: 'Emojis', id: 'Emoji', emotes: [] },
        ];
      if (url === 'https://kick.com/api/v1/channels/kicker')
        return { id: 7, user_id: 9, chatroom: { id: 42 }, subscriber_badges: [] };
      return undefined;
    });
    expect(await load('', 'kicker')).toEqual([
      {
        name: 'kickerLove',
        url: 'https://files.kick.com/emotes/11/fullsize',
        thumb: 'https://files.kick.com/emotes/11/fullsize',
        platform: 'kick',
        provider: 'Kick',
        subOnly: true,
      },
      {
        name: 'kickerHi',
        url: 'https://files.kick.com/emotes/12/fullsize',
        thumb: 'https://files.kick.com/emotes/12/fullsize',
        platform: 'kick',
        provider: 'Kick',
        subOnly: false,
      },
    ]);
  });

  it('shows what loaded when a provider fails', async () => {
    mockFetch((url) => {
      if (url.startsWith('https://api.ivr.fi/')) return [twitchUser('1')];
      if (url === 'https://7tv.io/v3/users/twitch/1')
        return { emote_set: { emotes: [{ id: 'e1', name: 'catJAM' }] } };
      throw new TypeError('Failed to fetch');
    });
    const emotes = await load('streamer', '');
    expect(emotes).toEqual([
      {
        name: 'catJAM',
        url: 'https://cdn.7tv.app/emote/e1/2x.webp',
        thumb: 'https://cdn.7tv.app/emote/e1/1x.webp',
        platform: 'twitch',
        provider: '7TV',
        subOnly: false,
      },
    ]);
  });
});
