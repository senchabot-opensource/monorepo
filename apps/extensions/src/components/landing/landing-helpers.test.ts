import { describe, expect, it } from 'vitest';
import { getWidget, OVERLAYS, TOOLS, type WidgetEntry } from '#/lib/widgets';
import { getDemoSrc } from './demo-url';
import {
  formatStarCount,
  parseStarsResponse,
  readStarsCache,
  STARS_CACHE_TTL_MS,
  writeStarsCache,
} from './github-stars';
import { getCardShape, getGalleryShapes } from './widget-card';

describe('getDemoSrc', () => {
  it('keeps the registry demo params and adds the preview sizing', () => {
    const chat = new URL(getDemoSrc(getWidget('chat-box')), 'https://x.test');
    expect(chat.pathname).toBe('/widgets/chat-widget');
    expect(chat.searchParams.get('mock')).toBe('true');
    expect(chat.searchParams.get('fontSize')).toBe('12');

    const wall = new URL(getDemoSrc(getWidget('emote-wall')), 'https://x.test');
    expect(wall.searchParams.get('mock')).toBe('true');
    expect(wall.searchParams.get('size')).toBe('48');
  });

  it('turns off the Sub Sprout count badge, which dwarfs the plant in a small frame', () => {
    const params = new URL(getDemoSrc(getWidget('sub-sprout')), 'https://x').searchParams;
    expect(params.get('countfx')).toBe('0');
    expect(params.get('simulate')).toBe('true');
  });

  it('gives every overlay a demo, and of the tools the Subathon Timer and Chat Poll', () => {
    for (const widget of OVERLAYS) expect(getDemoSrc(widget), widget.id).not.toBe('');
    expect(TOOLS.filter((widget) => getDemoSrc(widget)).map((widget) => widget.id)).toEqual([
      'poll',
      'subathon',
    ]);
  });

  it('runs a bigger, busier chat in the tall gallery card than in the hero scene', () => {
    const chat = getWidget('chat-box');
    const card = new URL(getDemoSrc(chat, 'card'), 'https://x').searchParams;
    expect(card.get('fontSize')).toBe('15');
    expect(card.get('mockRate')).toBe('1.5');
    expect(card.get('mock')).toBe('true');
    expect(getDemoSrc(chat)).toBe(getDemoSrc(chat, 'scene'));
    const wall = getWidget('emote-wall');
    expect(getDemoSrc(wall, 'card')).toBe(getDemoSrc(wall));
  });
});

describe('gallery card shapes', () => {
  // A tall Chat Box and a wide goal strip: the bento the gallery was drawn for.
  const BENTO = (['chat-box', 'emote-wall', 'sub-sprout', 'goal'] as const).map(getWidget);
  const extra = (id: string, width: number, height: number) =>
    ({ ...getWidget('emote-wall'), id, sourceSize: { width, height } }) as WidgetEntry;
  const OVERLAY_COLUMNS = [2, 3];

  it('derives the shape from the live demo source size', () => {
    expect(OVERLAYS.map((widget) => [widget.id, getCardShape(widget)])).toEqual([
      ['chat-box', 'tall'],
      ['emote-wall', 'standard'],
      ['sub-sprout', 'standard'],
      ['stream-alerts', 'standard'],
      ['goal', 'wide'],
      ['frames', 'standard'],
      ['countdown', 'standard'],
    ]);
    // Tools never span, not even the Subathon strip.
    expect(TOOLS.map((widget) => [widget.id, getCardShape(widget)])).toEqual([
      ['poll', 'standard'],
      ['raffle', 'standard'],
      ['subathon', 'standard'],
      ['obs-bridge', 'standard'],
    ]);
  });

  it("anchors today's overlays on a 2x2 Chat Box, with two strips under it", () => {
    // Seven overlays: the chat column grown to 2x2 and the countdown widened fill both grids.
    expect(getGalleryShapes(OVERLAYS, OVERLAY_COLUMNS)).toEqual([
      'feature',
      'standard',
      'standard',
      'standard',
      'wide',
      'standard',
      'wide',
    ]);
  });

  it('keeps the bento spans while the overlays fill whole rows', () => {
    expect(getGalleryShapes(BENTO, OVERLAY_COLUMNS)).toEqual(BENTO.map(getCardShape));
  });

  it('widens the last standard card when the grid is one cell short', () => {
    // The four overlays before Sub Goal: Chat Box and three standard cards.
    const four = (['chat-box', 'emote-wall', 'sub-sprout', 'stream-alerts'] as const).map(
      getWidget,
    );
    expect(getGalleryShapes(four, OVERLAY_COLUMNS)).toEqual([
      'tall',
      'standard',
      'standard',
      'wide',
    ]);
    // The four tools fill the two-column grid as they are: Subathon beside OBS Bridge.
    expect(getGalleryShapes(TOOLS, [2])).toEqual(Array(4).fill('standard'));
  });

  it('drops the wide cards, then the tall one, then every span, when a new overlay would leave a hole', () => {
    // Two strips and a column: flattening the strips leaves a hole, flattening the column doesn't.
    const [chat, emote, , goal] = BENTO;
    expect(getGalleryShapes([chat, goal, extra('a', 800, 200), emote], OVERLAY_COLUMNS)).toEqual([
      'standard',
      'wide',
      'wide',
      'standard',
    ]);
    expect(
      getGalleryShapes([...BENTO, extra('a', 800, 200), extra('b', 800, 200)], OVERLAY_COLUMNS),
    ).toEqual(Array(6).fill('standard'));
  });
});

describe('star count cache', () => {
  const now = 1_700_000_000_000;

  it('returns a fresh count', () => {
    expect(readStarsCache(writeStarsCache(42, now - 1000), now)).toBe(42);
  });

  it('drops an expired count unless stale is allowed', () => {
    const raw = writeStarsCache(42, now - STARS_CACHE_TTL_MS - 1);
    expect(readStarsCache(raw, now)).toBeNull();
    expect(readStarsCache(raw, now, true)).toBe(42);
  });

  it('treats a timestamp from the future as expired', () => {
    expect(readStarsCache(writeStarsCache(42, now + 60_000), now)).toBeNull();
  });

  it('ignores missing or malformed entries', () => {
    expect(readStarsCache(null, now)).toBeNull();
    expect(readStarsCache('not json', now)).toBeNull();
    expect(readStarsCache('{"count":"42","fetchedAt":1}', now, true)).toBeNull();
    expect(readStarsCache('{"count":-1,"fetchedAt":1}', now, true)).toBeNull();
    expect(readStarsCache('{"count":42}', now, true)).toBeNull();
  });
});

describe('parseStarsResponse', () => {
  it('reads stargazers_count', () => {
    expect(parseStarsResponse({ stargazers_count: 17, forks: 3 })).toBe(17);
    expect(parseStarsResponse({ stargazers_count: 0 })).toBe(0);
  });

  it('rejects anything else', () => {
    expect(parseStarsResponse(null)).toBeNull();
    expect(parseStarsResponse({ message: 'API rate limit exceeded' })).toBeNull();
    expect(parseStarsResponse({ stargazers_count: '17' })).toBeNull();
  });
});

describe('formatStarCount', () => {
  it('writes the full number below 10k', () => {
    expect(formatStarCount(42, 'en')).toBe('42');
    expect(formatStarCount(1234, 'en')).toBe('1,234');
    expect(formatStarCount(1234, 'tr')).toBe('1.234');
  });

  it('shortens big numbers', () => {
    expect(formatStarCount(12_345, 'en')).toBe('12.3K');
  });
});
