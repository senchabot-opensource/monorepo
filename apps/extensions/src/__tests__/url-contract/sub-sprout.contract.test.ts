import { describe, expect, it } from 'vitest';
import {
  buildSubSproutPreviewUrl,
  buildSubSproutUrl,
  DEFAULT_SUB_SPROUT_SETTINGS,
  parseSubSproutUrl,
  type SubSproutSettings,
} from '#/lib/sub-sprout-url';
import { Route } from '#/routes/widgets/sub-sprout-widget';
import {
  asFixture,
  type FixtureCase,
  fixtureUrls,
  GARBAGE,
  GROUPS,
  readWidgetSearch,
} from './contract';
import json from './fixtures/sub-sprout.json';

interface Input {
  twitchChannel: string;
  kickChannel: string;
  settings: Partial<SubSproutSettings>;
}

const fixture = asFixture<Input, SubSproutSettings>(json);
const settingsOf = (input: Input): SubSproutSettings => ({
  ...fixture.defaults,
  ...input.settings,
});
const build = ({ input }: FixtureCase<Input>) =>
  buildSubSproutUrl(fixture.origin, settingsOf(input), input.twitchChannel, input.kickChannel);

const url = (query: string) => `${fixture.origin}/widgets/sub-sprout-widget?${query}`;

// The channels the widget route hands to the widget, legacy `channel` + `platform` included.
const widgetChannels = (search: Record<string, unknown>) => ({
  twitch: search.twitch || (search.platform === 'twitch' ? search.channel : undefined),
  kick: search.kick || (search.platform === 'kick' ? search.channel : undefined),
});

describe('Sub Sprout setup URL', () => {
  it('keeps the setup defaults the old URLs were built from', () => {
    expect(DEFAULT_SUB_SPROUT_SETTINGS).toEqual(fixture.defaults);
  });

  it.each(GROUPS)('builds the pre-redesign URL for every "%s" fixture', (group) => {
    const cases = fixture.cases.filter((c) => c.group === group);
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.map((c) => ({ input: c.input, url: build(c) }))).toEqual(
      cases.map((c) => ({ input: c.input, url: c.expectedUrl })),
    );
  });

  // Intended change: the old page still showed a channel-less URL here, with Copy disabled.
  it('shows no URL when only the unpicked platform has a channel', () => {
    const settings = (platforms: SubSproutSettings['platforms']) => ({
      ...DEFAULT_SUB_SPROUT_SETTINGS,
      platforms,
      variety: 'rose' as const,
    });
    expect(buildSubSproutUrl(fixture.origin, settings('twitch'), '', 'bar')).toBe('');
    expect(buildSubSproutUrl(fixture.origin, settings('kick'), 'foo', '')).toBe('');
    expect(buildSubSproutUrl(fixture.origin, settings('both'), '  ', '  ')).toBe('');
  });

  it('previews with simulate=1 and no channel', () => {
    expect(
      buildSubSproutPreviewUrl(fixture.origin, { ...DEFAULT_SUB_SPROUT_SETTINGS, water: 'rain' }),
    ).toBe(url('water=rain&simulate=1'));
  });
});

describe('Sub Sprout paste-to-edit', () => {
  it('rebuilds every setup URL from its own text', () => {
    const urls = fixtureUrls(fixture);
    const rebuilt = urls.map((text) => {
      const parsed = parseSubSproutUrl(text);
      return (
        parsed &&
        buildSubSproutUrl(fixture.origin, parsed.settings, parsed.twitchChannel, parsed.kickChannel)
      );
    });
    expect(rebuilt).toEqual(urls);
  });

  it.each([
    ['channel=foo', { twitch: 'foo', kick: undefined }],
    ['channel=foo&platform=twitch', { twitch: 'foo', kick: undefined }],
    ['channel=foo&platform=kick', { twitch: undefined, kick: 'foo' }],
    ['channel=foo&platform=youtube', { twitch: 'foo', kick: undefined }],
    ['channel=foo&twitch=bar', { twitch: 'bar', kick: undefined }],
    ['channel=foo&platform=kick&kick=baz', { twitch: undefined, kick: 'baz' }],
  ])('reads the legacy %s like the widget does', (query, channels) => {
    const parsed = parseSubSproutUrl(url(query));
    expect({
      twitch: parsed?.twitchChannel || undefined,
      kick: parsed?.kickChannel || undefined,
    }).toEqual(channels);
    expect(widgetChannels(readWidgetSearch(Route, url(query)))).toEqual(channels);
  });

  it('rewrites a legacy URL in the current format', () => {
    const parsed = parseSubSproutUrl(url('channel=Foo&platform=kick&variety=rose&countfx=0'));
    expect(
      parsed &&
        buildSubSproutUrl(
          fixture.origin,
          parsed.settings,
          parsed.twitchChannel,
          parsed.kickChannel,
        ),
    ).toBe(url('kick=foo&variety=rose&countfx=0'));
  });

  it('reads a flag as off for the same values the widget does', () => {
    for (const off of ['0', 'false', 'off', 'no', 'OFF']) {
      const text = url(`twitch=foo&countfx=${off}&potlabel=${off}`);
      expect(parseSubSproutUrl(text)?.settings).toMatchObject({ countFx: false, potLabel: false });
      expect(readWidgetSearch(Route, text)).toMatchObject({ countfx: false, potlabel: false });
    }
  });

  it('ignores simulate and unknown params', () => {
    const plain = url('twitch=foo&variety=lotus&water=sparkle');
    expect(parseSubSproutUrl(`${plain}&simulate=1&lang=tr&utm_source=x`)).toEqual(
      parseSubSproutUrl(plain),
    );
  });

  it('falls back to the default for each value the widget would not accept', () => {
    expect(parseSubSproutUrl(url('twitch=foo&variety=oak&pick=all&water=flood'))?.settings).toEqual(
      { ...DEFAULT_SUB_SPROUT_SETTINGS, platforms: 'twitch' },
    );
  });

  it('returns null without throwing for anything that is not a Sub Sprout URL', () => {
    for (const text of [...GARBAGE, `${fixture.origin}/widgets/emote-wall?twitch=foo`]) {
      expect(() => parseSubSproutUrl(text)).not.toThrow();
      expect(parseSubSproutUrl(text)).toBeNull();
    }
  });
});

describe('Sub Sprout widget reads every setup URL', () => {
  const intended = ({ input }: FixtureCase<Input>) => {
    const s = settingsOf(input);
    const channel = (value: string, skip: boolean) =>
      !skip && value.trim() ? value.trim().toLowerCase() : undefined;
    return {
      twitch: channel(input.twitchChannel, s.platforms === 'kick'),
      kick: channel(input.kickChannel, s.platforms === 'twitch'),
      variety: s.variety,
      pick: s.pick,
      water: s.water,
      countFx: s.countFx,
      potLabel: s.potLabel,
      simulate: undefined,
    };
  };

  // Same fallbacks as the SubSproutWidget props.
  const effective = (search: Record<string, unknown>) => ({
    ...widgetChannels(search),
    variety: search.variety ?? 'classic',
    pick: search.pick ?? 'fixed',
    water: search.water ?? 'off',
    countFx: search.countfx ?? true,
    potLabel: search.potlabel ?? false,
    simulate: search.simulate,
  });

  it('parses every fixture URL into the settings it was built from', () => {
    const cases = fixture.cases.filter((c) => c.expectedUrl);
    expect(cases.map((c) => effective(readWidgetSearch(Route, c.expectedUrl)))).toEqual(
      cases.map(intended),
    );
  });

  it('keeps the count effect on unless countfx=0', () => {
    expect(readWidgetSearch(Route, url('twitch=foo')).countfx).toBeUndefined();
    expect(readWidgetSearch(Route, url('twitch=foo&countfx=0')).countfx).toBe(false);
    expect(readWidgetSearch(Route, url('twitch=foo&potlabel=1')).potlabel).toBe(true);
  });
});
