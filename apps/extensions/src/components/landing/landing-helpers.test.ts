import { describe, expect, it } from 'vitest';
import { dealPresets, randomPreset } from '#/features/presets/random';
import { findPreset, PRESETS } from '#/features/presets/registry';
import { getWidget, OVERLAYS, TOOLS, type WidgetEntry } from '#/lib/widgets';
import { dealLandingPresets, LANDING_PICKS, LANDING_REST, readsPreset } from './demo-presets';
import { getDemoSrc } from './demo-url';
import {
  formatStarCount,
  parseStarsResponse,
  readStarsCache,
  STARS_CACHE_TTL_MS,
  writeStarsCache,
} from './github-stars';
import { hasToolVisual } from './tool-visuals';
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

  it('gives every overlay a demo, and of the tools the Subathon Timer, Chat Poll and Viewer Queue', () => {
    for (const widget of OVERLAYS) expect(getDemoSrc(widget), widget.id).not.toBe('');
    expect(TOOLS.filter((widget) => getDemoSrc(widget)).map((widget) => widget.id)).toEqual([
      'poll',
      'queue',
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

  it('shows the weather as the pill in its gallery card, in the Modern HUD style', () => {
    const weather = new URL(getDemoSrc(getWidget('weather'), 'card'), 'https://x').searchParams;
    expect(Object.fromEntries(weather)).toEqual({
      demo: '1',
      layout: 'pill',
      size: '200',
      style: 'modern',
    });
  });

  it('dresses a demo in a preset, after its own params, and leaves classic out', () => {
    const counter = getWidget('counter');
    const src = getDemoSrc(counter, 'card', 'pizza');
    expect(src).toBe(`${getDemoSrc(counter, 'card')}&preset=pizza`);
    const chat = new URL(getDemoSrc(getWidget('chat-box'), 'card', 'flower'), 'https://x');
    expect(chat.searchParams.get('fontSize')).toBe('15');
    expect(chat.searchParams.get('preset')).toBe('flower');
    expect(getDemoSrc(counter, 'card', 'classic')).toBe(getDemoSrc(counter, 'card'));
  });

  it('knows which demos can wear a preset', () => {
    expect(readsPreset(getWidget('counter'))).toBe(true);
    expect(readsPreset(getWidget('chat-box'))).toBe(true);
    expect(readsPreset(getWidget('emote-wall'))).toBe(false);
    expect(readsPreset(getWidget('weather'))).toBe(false);
  });

  it('draws the IRL HUD and the weather alike where they share a scene', () => {
    const together = (id: 'irl-hud' | 'weather') =>
      new URL(getDemoSrc(getWidget(id), 'together'), 'https://x').searchParams;
    expect(together('irl-hud').get('style')).toBe('modern');
    expect(together('weather').get('style')).toBe('modern');
    expect(together('irl-hud').get('size')).toBe(together('weather').get('size'));
    expect(together('weather').get('layout')).toBe('pill');
  });
});

describe('random presets', () => {
  const ids = PRESETS.map((entry) => entry.data.id);
  // A seeded stand-in for Math.random, so a failure can be replayed.
  const seeded = (seed: number) => () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  it('deals every preset once before any repeats, never the same one twice in a row', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const dealt = dealPresets(ids.length * 2 + 3, { random: seeded(seed) });
      expect(new Set(dealt.slice(0, ids.length)), `seed ${seed}`).toEqual(new Set(ids));
      expect(dealt.every((id, index) => index === 0 || id !== dealt[index - 1])).toBe(true);
      expect(dealt).not.toContain('classic');
    }
  });

  it('deals a different order from one visit to the next', () => {
    const orders = new Set(
      Array.from({ length: 5 }, (_, seed) =>
        dealPresets(ids.length, { random: seeded(seed + 1) }).join(),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  // The gallery's cards that wear a preset, in the order the home page deals and shows them.
  const LANDING = [...OVERLAYS, ...TOOLS]
    .filter((widget) => widget.demoUrl && !hasToolVisual(widget.id) && readsPreset(widget))
    .map((widget) => widget.id);

  it('deals each landing demo its own picks or one of the rest, never two neighbors alike', () => {
    const named = [...LANDING_REST, ...Object.values(LANDING_PICKS).flat()];
    for (const id of named) expect(findPreset(id)?.data.id, id).toBe(id);
    for (const id of Object.keys(LANDING_PICKS)) expect(LANDING, id).toContain(id);
    for (let seed = 1; seed <= 200; seed++) {
      const dealt = dealLandingPresets(LANDING, seeded(seed));
      for (const key of LANDING) {
        expect(LANDING_PICKS[key] ?? LANDING_REST, `${key}, seed ${seed}`).toContain(dealt[key]);
      }
      const order = LANDING.map((key) => dealt[key]);
      expect(order.every((id, index) => index === 0 || id !== order[index - 1])).toBe(true);
    }
  });

  it('goes through all of the rest before repeating one, and through every pick over visits', () => {
    const plain = ['a', 'b', 'c', 'd', 'e', 'f'] as const;
    const seen: Record<string, Set<string>> = { goal: new Set(), 'event-list': new Set() };
    for (let seed = 1; seed <= 30; seed++) {
      const dealt = dealLandingPresets(plain, seeded(seed));
      expect(new Set(plain.slice(0, 4).map((key) => dealt[key]))).toEqual(new Set(LANDING_REST));
      const picks = dealLandingPresets(['goal', 'event-list'] as const, seeded(seed));
      seen.goal.add(picks.goal);
      seen['event-list'].add(picks['event-list']);
    }
    expect(seen.goal).toEqual(new Set(LANDING_PICKS.goal));
    expect(seen['event-list']).toEqual(new Set(LANDING_PICKS['event-list']));
  });

  it('rolls any preset but the current one', () => {
    expect(randomPreset('classic', () => 0)).toBe(ids[0]);
    expect(randomPreset('classic', () => 0.999)).toBe(ids.at(-1));
    expect(randomPreset(ids[0], () => 0)).toBe(ids[1]);
    for (let seed = 1; seed <= 50; seed++) {
      expect(randomPreset('pizza', seeded(seed))).not.toBe('pizza');
    }
  });
});

describe('gallery card shapes', () => {
  // A tall Chat Box and a wide goal strip: the bento the gallery was drawn for.
  const BENTO = (['chat-box', 'emote-wall', 'sub-sprout', 'goal'] as const).map(getWidget);
  const extra = (id: string, width: number, height: number) =>
    ({
      ...getWidget('emote-wall'),
      id,
      sourceSize: { width, height },
    }) as WidgetEntry;
  // The overlay grid is two columns from sm and three from lg; each width is solved on its own.
  const OVERLAY_COLUMNS = [2, 3] as const;

  it('derives the shape from the live demo source size', () => {
    expect(OVERLAYS.map((widget) => [widget.id, getCardShape(widget)])).toEqual([
      ['chat-box', 'tall'],
      ['event-list', 'tall'],
      ['emote-wall', 'standard'],
      ['emote-combo', 'standard'],
      ['sub-sprout', 'standard'],
      ['irl-hud', 'standard'],
      ['weather', 'standard'],
      ['follower-goal', 'wide'],
      ['bits-goal', 'wide'],
      ['leaderboard', 'standard'],
      ['stream-alerts', 'standard'],
      ['credits', 'standard'],
      ['socials', 'wide'],
      ['counter', 'wide'],
      ['goal', 'wide'],
      ['countdown', 'standard'],
      ['featured', 'wide'],
      ['now-playing', 'wide'],
      ['frames', 'standard'],
      ['lower-third', 'standard'],
      ['tasks', 'tall'],
    ]);
    // Tools never span, not even the Subathon strip.
    expect(TOOLS.map((widget) => [widget.id, getCardShape(widget)])).toEqual([
      ['poll', 'standard'],
      ['queue', 'standard'],
      ['raffle', 'standard'],
      ['subathon', 'standard'],
      ['obs-bridge', 'standard'],
      ['spin-wheel', 'standard'],
    ]);
  });

  it("lays today's overlays out in the gallery's rows", () => {
    // At three columns, row by row: the Chat Box column with Event List, Emote Wall, Emote Combo and
    // Sub Sprout beside it; the IRL HUD strip and Weather; the Follower Goal, Bits & Kicks Goal and
    // Top Supporters; the Stream Alerts strip and End Credits; Socials and the Counter strip; the
    // Sub Goal strip and Stream Countdown; Featured Message and the Now Playing strip; Stream
    // Frames, Lower Thirds and Task List. 27 cells, nine full rows.
    const rows = [
      ['chat-box', 'tall'],
      ['event-list', 'standard'],
      ['emote-wall', 'standard'],
      ['emote-combo', 'standard'],
      ['sub-sprout', 'standard'],
      ['irl-hud', 'wide'],
      ['weather', 'standard'],
      ['follower-goal', 'standard'],
      ['bits-goal', 'standard'],
      ['leaderboard', 'standard'],
      ['stream-alerts', 'wide'],
      ['credits', 'standard'],
      ['socials', 'standard'],
      ['counter', 'wide'],
      ['goal', 'wide'],
      ['countdown', 'standard'],
      ['featured', 'standard'],
      ['now-playing', 'wide'],
      ['frames', 'standard'],
      ['lower-third', 'standard'],
      ['tasks', 'standard'],
    ];
    const shapes = (columns: number) =>
      getGalleryShapes(OVERLAYS, columns).map((shape, index) => [OVERLAYS[index].id, shape]);
    expect(shapes(3)).toEqual(rows);
    // Two columns are a cell over, so Stream Alerts goes back to its own plain card there.
    expect(shapes(2)).toEqual(
      rows.map(([id, shape]) => [id, id === 'stream-alerts' ? 'standard' : shape]),
    );
  });

  it('keeps the bento spans while the overlays fill whole rows', () => {
    for (const columns of OVERLAY_COLUMNS) {
      expect(getGalleryShapes(BENTO, columns), `${columns} columns`).toEqual(
        BENTO.map(getCardShape),
      );
    }
  });

  it('widens the last standard card when the grid is one cell short', () => {
    // Chat Box, two plain cards and the Stream Alerts strip fill two rows at either width.
    const four = (['chat-box', 'emote-wall', 'sub-sprout', 'stream-alerts'] as const).map(
      getWidget,
    );
    for (const columns of OVERLAY_COLUMNS) {
      expect(getGalleryShapes(four, columns), `${columns} columns`).toEqual([
        'tall',
        'standard',
        'standard',
        'wide',
      ]);
    }
    // Five tools would leave two columns a cell short, so the last widens; six fill them.
    expect(getGalleryShapes(TOOLS.slice(0, 5), 2)).toEqual([...Array(4).fill('standard'), 'wide']);
    expect(getGalleryShapes(TOOLS, 2)).toEqual(Array(6).fill('standard'));
  });

  it('never widens a card whose demo would stretch its row', () => {
    // One cell short, but every standard card here is a 16:9 or square demo with no strip cut.
    const short = (['chat-box', 'emote-wall', 'sub-sprout', 'credits'] as const).map(getWidget);
    expect(getGalleryShapes(short, 3)).not.toContain('wide');
  });

  it('drops the wide cards, then the tall one, then every span, when a new overlay would leave a hole', () => {
    // Two strips and a column: flattening the strips leaves a hole, flattening the column doesn't.
    const [chat, emote, , goal] = BENTO;
    expect(getGalleryShapes([chat, goal, extra('a', 800, 200), emote], 3)).toEqual([
      'standard',
      'wide',
      'wide',
      'standard',
    ]);
    expect(getGalleryShapes([...BENTO, extra('a', 800, 200), extra('b', 800, 200)], 3)).toEqual(
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
