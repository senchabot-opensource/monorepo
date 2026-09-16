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

  it('gives every overlay a demo and no tool one', () => {
    for (const widget of OVERLAYS) expect(getDemoSrc(widget), widget.id).not.toBe('');
    for (const widget of TOOLS) expect(getDemoSrc(widget), widget.id).toBe('');
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
  it('derives the shape from the source size', () => {
    expect(OVERLAYS.map((widget) => [widget.id, getCardShape(widget)])).toEqual([
      ['chat-box', 'tall'],
      ['emote-wall', 'standard'],
      ['sub-sprout', 'standard'],
      ['subathon', 'wide'],
    ]);
    for (const widget of TOOLS) expect(getCardShape(widget), widget.id).toBe('standard');
  });

  it('keeps the bento spans while the overlays fill whole rows', () => {
    expect(getGalleryShapes(OVERLAYS)).toEqual(OVERLAYS.map(getCardShape));
  });

  it('drops the tall card, then every span, when a new overlay would leave a hole', () => {
    const extra = (id: string, width: number, height: number) =>
      ({ ...getWidget('emote-wall'), id, sourceSize: { width, height } }) as WidgetEntry;
    expect(getGalleryShapes([...OVERLAYS, extra('a', 1920, 1080)])).toEqual([
      'standard',
      'standard',
      'standard',
      'wide',
      'standard',
    ]);
    expect(getGalleryShapes([...OVERLAYS, extra('a', 800, 200), extra('b', 800, 200)])).toEqual(
      Array(6).fill('standard'),
    );
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
