import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  mergeEmotes,
  parse7tvSet,
  parseBttv,
  parseFfz,
  useChannelEmotes,
} from './use-channel-emotes';

// Shapes trimmed from live 7TV, BTTV and FFZ API responses.

describe('emote parsers', () => {
  it('builds CDN URLs for 7TV and BTTV', () => {
    expect(parse7tvSet({ emotes: [{ id: '01G3WEGZN0000ET2J0MQP5YJ0G', name: 'GAMBA' }] })).toEqual([
      ['GAMBA', 'https://cdn.7tv.app/emote/01G3WEGZN0000ET2J0MQP5YJ0G/2x.webp'],
    ]);
    expect(parseBttv([{ id: '54fa8f1401e468494b85b537', code: ':tf:' }])).toEqual([
      [':tf:', 'https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/2x.webp'],
    ]);
  });

  it('takes the 2x FFZ URL, falling back to 1x', () => {
    expect(
      parseFfz([
        {
          emoticons: [
            {
              name: 'ZrehplaR',
              urls: {
                '1': 'https://cdn.frankerfacez.com/emote/9/1',
                '2': 'https://cdn.frankerfacez.com/emote/9/2',
              },
            },
            { name: 'Tiny', urls: { '1': 'https://cdn.frankerfacez.com/emote/10/1' } },
          ],
        },
      ]),
    ).toEqual([
      ['ZrehplaR', 'https://cdn.frankerfacez.com/emote/9/2'],
      ['Tiny', 'https://cdn.frankerfacez.com/emote/10/1'],
    ]);
  });

  it('copes with missing sets', () => {
    expect(parse7tvSet(undefined)).toEqual([]);
    expect(parseBttv(undefined)).toEqual([]);
    expect(parseFfz([{}])).toEqual([]);
  });

  it('lets later lists win a name clash', () => {
    const map = mergeEmotes([['KEKW', 'ffz']], [['KEKW', 'bttv']], [['KEKW', '7tv']]);
    expect(map.get('KEKW')).toBe('7tv');
  });
});

describe('useChannelEmotes', () => {
  it('loads the emotes once the network answers, when OBS started the source before it', async () => {
    vi.useFakeTimers();
    let online = false;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (!online) throw new TypeError('Failed to fetch');
        if (url.startsWith('https://api.ivr.fi/')) return Response.json([{ id: '1' }]);
        if (url === 'https://7tv.io/v3/users/twitch/1') {
          return Response.json({ emote_set: { emotes: [{ id: 'e1', name: 'catJAM' }] } });
        }
        return new Response('{}', { status: 404 });
      }),
    );
    const { result } = renderHook(() =>
      useChannelEmotes('streamer', null, { sevenTv: true, bttv: false, ffz: false }),
    );
    await act(async () => {});
    expect(result.current.twitch.size).toBe(0);

    online = true;
    await act(async () => vi.advanceTimersByTime(5_000));
    expect(result.current.twitch.get('catJAM')).toBe('https://cdn.7tv.app/emote/e1/2x.webp');
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});
