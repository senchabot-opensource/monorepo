import { describe, expect, it } from 'vitest';
import { mergeEmotes, parse7tvSet, parseBttv, parseFfz } from './use-channel-emotes';

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
