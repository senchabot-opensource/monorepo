import { describe, expect, it } from 'vitest';
import {
  buildEmoteWallUrl,
  DEFAULT_EMOTE_WALL_OPTIONS,
  type EmoteWallUrlOptions,
  parseEmoteWallUrl,
} from '#/features/widgets/emote-wall/widget-url';
import { Route } from '#/routes/widgets/emote-wall';
import {
  asFixture,
  type FixtureCase,
  fixtureUrls,
  GARBAGE,
  GROUPS,
  readWidgetSearch,
} from './contract';
import json from './fixtures/emote-wall.json';

const fixture = asFixture<Partial<EmoteWallUrlOptions>, EmoteWallUrlOptions>(json);
const optionsOf = ({ input }: FixtureCase<Partial<EmoteWallUrlOptions>>): EmoteWallUrlOptions => ({
  ...fixture.defaults,
  ...input,
});

const url = (query: string) => `${fixture.origin}/widgets/emote-wall?${query}`;

describe('Emote Wall setup URL', () => {
  it('keeps the setup defaults the old URLs were built from', () => {
    expect(DEFAULT_EMOTE_WALL_OPTIONS).toEqual(fixture.defaults);
  });

  it.each(GROUPS)('builds the pre-redesign URL for every "%s" fixture', (group) => {
    const cases = fixture.cases.filter((c) => c.group === group);
    expect(cases.length).toBeGreaterThan(0);
    expect(
      cases.map((c) => ({ input: c.input, url: buildEmoteWallUrl(fixture.origin, optionsOf(c)) })),
    ).toEqual(cases.map((c) => ({ input: c.input, url: c.expectedUrl })));
  });
});

describe('Emote Wall paste-to-edit', () => {
  it('rebuilds every setup URL from its own text', () => {
    const urls = fixtureUrls(fixture);
    const rebuilt = urls.map((text) => {
      const parsed = parseEmoteWallUrl(text);
      return parsed && buildEmoteWallUrl(fixture.origin, parsed);
    });
    expect(rebuilt).toEqual(urls);
  });

  it('ignores preview-only and unknown params', () => {
    const plain = url('twitch=foo&mode=chaos&size=64');
    expect(parseEmoteWallUrl(`${plain}&mock=true&lang=tr&utm_source=x`)).toEqual(
      parseEmoteWallUrl(plain),
    );
  });

  it('accepts any origin and a trailing slash', () => {
    const expected = parseEmoteWallUrl(url('kick=bar'));
    expect(parseEmoteWallUrl('http://localhost:3000/widgets/emote-wall?kick=bar')).toEqual(
      expected,
    );
    expect(parseEmoteWallUrl(`${fixture.origin}/widgets/emote-wall/?kick=bar`)).toEqual(expected);
  });

  it('reads a flag as off for the same values the widget does', () => {
    for (const off of ['false', '0', 'null', '']) {
      const text = url(`twitch=foo&sevenTv=${off}&spamBlock=${off}&hypeMode=${off}`);
      const widget = readWidgetSearch(Route, text);
      expect(parseEmoteWallUrl(text)).toMatchObject({
        sevenTv: false,
        spamBlock: false,
        hypeMode: false,
      });
      expect(widget).toMatchObject({ sevenTv: false, spamBlock: false, hypeMode: false });
    }
  });

  it('falls back to the default or clamps each value the widget would not accept', () => {
    expect(parseEmoteWallUrl(url('twitch=foo&mode=wild&size=abc&duration=0&max=999'))).toEqual({
      ...DEFAULT_EMOTE_WALL_OPTIONS,
      twitch: 'foo',
      platforms: 'twitch',
      duration: '2',
      max: '120',
    });
  });

  it('returns null without throwing for anything that is not an Emote Wall URL', () => {
    for (const text of [...GARBAGE, `${fixture.origin}/widgets/chat-widget?twitch=foo`]) {
      expect(() => parseEmoteWallUrl(text)).not.toThrow();
      expect(parseEmoteWallUrl(text)).toBeNull();
    }
  });
});

describe('Emote Wall widget reads every setup URL', () => {
  const clamp = (raw: string, min: number, max: number, fallback: number) => {
    const n = raw.trim() === '' ? Number.NaN : Number(raw);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };

  const intended = (c: FixtureCase<Partial<EmoteWallUrlOptions>>) => {
    const o = optionsOf(c);
    const channel = (value: string, skip: boolean) =>
      !skip && value.trim() ? value.trim().toLowerCase() : undefined;
    return {
      twitch: channel(o.twitch, o.platforms === 'kick'),
      kick: channel(o.kick, o.platforms === 'twitch'),
      sevenTv: o.sevenTv,
      mode: o.mode,
      subsOnly: o.subsOnly,
      subDurationX2: o.subDurationX2,
      showAllEmotes: o.showAllEmotes,
      hypeMode: o.hypeMode,
      spamBlock: o.spamBlock,
      size: clamp(o.size, 32, 256, 112),
      duration: clamp(o.duration, 2, 30, 5),
      max: clamp(o.max, 1, 120, 25),
      mock: undefined,
    };
  };

  it('parses every fixture URL into the options it was built from', () => {
    const cases = fixture.cases.filter((c) => c.expectedUrl);
    expect(cases.map((c) => readWidgetSearch(Route, c.expectedUrl))).toEqual(cases.map(intended));
  });
});
