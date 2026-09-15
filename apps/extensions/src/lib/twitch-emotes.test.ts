import { describe, expect, it } from 'vitest';
import { parseTwitchEmoteRanges } from './twitch-emotes';

describe('parseTwitchEmoteRanges', () => {
  it('reads every range of every emote, sorted by position', () => {
    expect(
      parseTwitchEmoteRanges('25:10-14,0-4/emotesv2_4c3b4ed516de493bbcd2df2f5d450f49:6-8'),
    ).toEqual([
      { id: '25', start: 0, end: 4 },
      { id: 'emotesv2_4c3b4ed516de493bbcd2df2f5d450f49', start: 6, end: 8 },
      { id: '25', start: 10, end: 14 },
    ]);
  });

  it('returns nothing for an empty or missing tag', () => {
    expect(parseTwitchEmoteRanges(undefined)).toEqual([]);
    expect(parseTwitchEmoteRanges('')).toEqual([]);
  });

  it('skips parts it cannot read and keeps the rest', () => {
    expect(parseTwitchEmoteRanges('25:0-4,/x:/:1-2/1:a-b/2:3-4')).toEqual([
      { id: '25', start: 0, end: 4 },
      { id: '2', start: 3, end: 4 },
    ]);
  });
});
