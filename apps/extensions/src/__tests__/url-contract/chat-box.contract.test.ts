import { describe, expect, it } from 'vitest';
import {
  buildWidgetParams,
  DEFAULT_SETTINGS,
  HIGHLIGHTS,
  parseHighlights,
  parseWidgetUrl,
  type Settings,
} from '#/features/widgets/chat-widget/widget-settings';
import { Route } from '#/routes/widgets/chat-widget';
import {
  asFixture,
  type FixtureCase,
  fixtureUrls,
  GARBAGE,
  GROUPS,
  readWidgetSearch,
} from './contract';
import json from './fixtures/chat-box.json';

interface Input {
  twitchChannel: string;
  kickChannel: string;
  settings: Partial<Settings>;
}

const fixture = asFixture<Input, Settings>(json);
const settingsOf = (input: Input): Settings => ({ ...fixture.defaults, ...input.settings });

// Mirrors widgetUrl in routes/setup/chat-widget.tsx, which assembles the URL inline.
const widgetUrl = (settings: Settings, twitch: string, kick: string) => {
  const params = buildWidgetParams(settings, twitch, kick);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${fixture.origin}/widgets/chat-widget?${params.toString()}`;
};
const build = ({ input }: FixtureCase<Input>) =>
  widgetUrl(settingsOf(input), input.twitchChannel, input.kickChannel);

const url = (query: string) => `${fixture.origin}/widgets/chat-widget?${query}`;

describe('Chat Box setup URL', () => {
  it('keeps the widget defaults the old URLs rely on', () => {
    expect(DEFAULT_SETTINGS).toEqual(fixture.defaults);
  });

  it.each(GROUPS)('builds the pre-redesign URL for every "%s" fixture', (group) => {
    const cases = fixture.cases.filter((c) => c.group === group);
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.map((c) => ({ input: c.input, url: build(c) }))).toEqual(
      cases.map((c) => ({ input: c.input, url: c.expectedUrl })),
    );
  });
});

describe('Chat Box paste-to-edit', () => {
  it('rebuilds every setup URL from its own text', () => {
    const urls = fixtureUrls(fixture);
    const rebuilt = urls.map((text) => {
      const parsed = parseWidgetUrl(text);
      return parsed && widgetUrl(parsed.settings, parsed.twitchChannel, parsed.kickChannel);
    });
    expect(rebuilt).toEqual(urls);
  });

  it('reads the legacy keep=true as the "keep" duration, winning over duration', () => {
    expect(parseWidgetUrl(url('twitch=foo&keep=true'))?.settings.duration).toBe('keep');
    expect(parseWidgetUrl(url('twitch=foo&keep=true&duration=60'))?.settings.duration).toBe('keep');
    expect(parseWidgetUrl(url('twitch=foo&keep=false&duration=60'))?.settings.duration).toBe('60');
  });

  it('reads a URL from before highlights existed as every highlight on', () => {
    expect(parseWidgetUrl(url('twitch=foo'))?.settings.highlights).toEqual([...HIGHLIGHTS]);
    expect(parseWidgetUrl(url('twitch=foo&highlights=none'))?.settings.highlights).toEqual([]);
  });

  it('ignores preview-only and unknown params', () => {
    const plain = url('twitch=foo&kick=bar&font=mono&keep=true');
    expect(parseWidgetUrl(`${plain}&mock=true&mockRate=5&lang=tr&utm_source=x`)).toEqual(
      parseWidgetUrl(plain),
    );
  });

  it('accepts any origin and a trailing slash', () => {
    const expected = parseWidgetUrl(url('twitch=foo'));
    expect(parseWidgetUrl('http://localhost:3000/widgets/chat-widget?twitch=foo')).toEqual(
      expected,
    );
    expect(parseWidgetUrl(`${fixture.origin}/widgets/chat-widget/?twitch=foo`)).toEqual(expected);
    expect(parseWidgetUrl(`  ${url('twitch=foo')}  `)).toEqual(expected);
  });

  it('falls back to the default for each value the widget would not accept', () => {
    const parsed = parseWidgetUrl(
      url(
        'twitch=foo&font=comic&layout=grid&animation=spin&orientation=diagonal&platformDisplay=big' +
          '&fontSize=-3&bgOpacity=2&duration=7&highlights=bogus',
      ),
    );
    // Any platformDisplay param, even an invalid one, is only written for both platforms.
    expect(parsed?.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('returns null without throwing for anything that is not a Chat Box URL', () => {
    for (const text of [...GARBAGE, `${fixture.origin}/widgets/emote-wall?twitch=foo`]) {
      expect(() => parseWidgetUrl(text)).not.toThrow();
      expect(parseWidgetUrl(text)).toBeNull();
    }
  });
});

describe('Chat Box widget reads every setup URL', () => {
  // What the widget should end up doing for the settings a fixture URL was built from.
  const intended = ({ input }: FixtureCase<Input>) => {
    const s = settingsOf(input);
    const channel = (value: string, skip: boolean) =>
      !skip && value.trim() ? value.trim().toLowerCase() : undefined;
    return {
      twitch: channel(input.twitchChannel, s.platforms === 'kick'),
      kick: channel(input.kickChannel, s.platforms === 'twitch'),
      sevenTv: s.sevenTv,
      bttv: s.bttv,
      ffz: s.ffz,
      badges: s.badges,
      fontSize: Number(s.fontSize) > 0 ? Number(s.fontSize) : 18,
      background: s.background,
      bgOpacity: s.background ? Number(s.bgOpacity) : 0.5,
      itemBackground: s.itemBackground,
      platformAccent: s.platformAccent,
      boldUsernames: s.boldUsernames,
      boldMessages: s.boldMessages,
      orientation: s.orientation,
      // Only meaningful with both platforms, so single-platform URLs leave it at the default.
      platformDisplay: s.platforms === 'both' ? s.platformDisplay : 'icon',
      timestamp: s.timestamp,
      duration: s.duration === 'keep' ? 'keep' : Number(s.duration),
      hideBots: s.hideBots,
      hideCommands: s.hideCommands,
      highlights: HIGHLIGHTS.filter((h) => s.highlights.includes(h)),
      font: s.font,
      layout: s.layout,
      animation: s.animation,
      mock: undefined,
    };
  };

  // The same values as the widget component reads them from its search.
  const effective = (search: Record<string, unknown>) => ({
    twitch: search.twitch,
    kick: search.kick,
    sevenTv: search.sevenTv,
    bttv: search.bttv,
    ffz: search.ffz,
    badges: search.badges,
    fontSize: search.fontSize,
    background: Boolean(search.background),
    bgOpacity: search.bgOpacity,
    itemBackground: Boolean(search.itemBackground),
    platformAccent: Boolean(search.platformAccent),
    boldUsernames: Boolean(search.boldUsernames),
    boldMessages: Boolean(search.boldMessages),
    orientation: search.orientation,
    platformDisplay: search.platformDisplay,
    timestamp: Boolean(search.timestamp),
    duration: search.keep ? 'keep' : (search.duration ?? 30),
    hideBots: Boolean(search.hideBots),
    hideCommands: Boolean(search.hideCommands),
    highlights: parseHighlights(search.highlights as string | undefined),
    font: search.font,
    layout: search.layout,
    animation: search.animation,
    mock: search.mock,
  });

  it('parses every fixture URL into the settings it was built from', () => {
    const cases = fixture.cases.filter((c) => c.expectedUrl);
    expect(cases.map((c) => effective(readWidgetSearch(Route, c.expectedUrl)))).toEqual(
      cases.map(intended),
    );
  });

  it('shows the demo only when asked or when no channel is set', () => {
    expect(readWidgetSearch(Route, url('twitch=foo')).mock).toBeUndefined();
    expect(readWidgetSearch(Route, url('mock=true')).mock).toBe(true);
  });
});
