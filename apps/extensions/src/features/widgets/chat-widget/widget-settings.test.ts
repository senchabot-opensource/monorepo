import { describe, expect, it } from 'vitest';
import {
  buildWidgetParams,
  DEFAULT_SETTINGS,
  parseWidgetUrl,
  type Settings,
} from './widget-settings';

const ORIGIN = 'https://extensions.senchabot.com';

const widgetUrl = (settings: Settings, twitch: string, kick: string) =>
  `${ORIGIN}/widgets/chat-widget?${buildWidgetParams(settings, twitch, kick)}`;

const roundTrip = (url: string) => {
  const parsed = parseWidgetUrl(url);
  if (!parsed) throw new Error(`not parsed: ${url}`);
  return widgetUrl(parsed.settings, parsed.twitchChannel, parsed.kickChannel);
};

describe('parseWidgetUrl', () => {
  it('rejects text that is not a chat widget URL', () => {
    expect(parseWidgetUrl('')).toBeNull();
    expect(parseWidgetUrl('senchabot')).toBeNull();
    expect(parseWidgetUrl(`${ORIGIN}/widgets/emote-wall?twitch=senchabot`)).toBeNull();
    expect(parseWidgetUrl(`${ORIGIN}/setup/chat-widget`)).toBeNull();
  });

  it('accepts any origin, a trailing slash and surrounding whitespace', () => {
    expect(parseWidgetUrl('  http://localhost:3000/widgets/chat-widget/?twitch=a  ')).toMatchObject(
      { twitchChannel: 'a' },
    );
  });

  it('loads the defaults for a URL with only channels', () => {
    expect(parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?twitch=foo&kick=bar`)).toEqual({
      settings: DEFAULT_SETTINGS,
      twitchChannel: 'foo',
      kickChannel: 'bar',
    });
  });

  it('restores every setting the setup page writes', () => {
    const settings: Settings = {
      platforms: 'both',
      preset: 'classic',
      platformDisplay: 'name',
      font: 'mono',
      userFont: 'serif',
      fontSize: '24',
      layout: 'card',
      orientation: 'horizontal',
      animation: 'typing',
      background: true,
      bgOpacity: '0.8',
      itemBackground: true,
      platformAccent: true,
      boldUsernames: true,
      boldMessages: true,
      textShadow: 'strong',
      sevenTv: false,
      bttv: false,
      ffz: false,
      badges: false,
      timestamp: true,
      duration: 'keep',
      hideBots: true,
      hideCommands: true,
      highlights: ['mention', 'announcement'],
    };
    expect(parseWidgetUrl(widgetUrl(settings, 'foo', 'bar'))).toEqual({
      settings,
      twitchChannel: 'foo',
      kickChannel: 'bar',
    });
  });

  it('keeps the old shadow for a URL without one, and for one it does not know', () => {
    expect(widgetUrl(DEFAULT_SETTINGS, 'foo', '')).toBe(`${ORIGIN}/widgets/chat-widget?twitch=foo`);
    const read = (shadow: string) =>
      parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?twitch=foo&shadow=${shadow}`)?.settings
        .textShadow;
    expect(read('none')).toBe('none');
    expect(read('huge')).toBe('normal');
  });

  it('leaves the username font out while it matches the message font', () => {
    const classic = { ...DEFAULT_SETTINGS, font: 'mono' as const, userFont: 'mono' as const };
    expect(widgetUrl(classic, 'foo', '')).toBe(
      `${ORIGIN}/widgets/chat-widget?twitch=foo&font=mono`,
    );
    expect(widgetUrl({ ...classic, userFont: 'serif' }, 'foo', '')).toBe(
      `${ORIGIN}/widgets/chat-widget?twitch=foo&font=mono&userFont=serif`,
    );
  });

  it('reads a URL from before the split as the username following the message font', () => {
    const parsed = parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?twitch=foo&font=mono`)?.settings;
    expect(parsed).toMatchObject({ font: 'mono', userFont: 'mono' });
  });

  it("starts a preset URL on the preset's own pair and writes only what differs", () => {
    const url = `${ORIGIN}/widgets/chat-widget?twitch=foo&preset=rift`;
    expect(parseWidgetUrl(url)?.settings).toMatchObject({
      font: 'presetMessage',
      userFont: 'presetName',
    });
    expect(roundTrip(url)).toBe(url);
    // Both boxes on the preset's name font, for a streamer who wants one font everywhere.
    const oneFont = `${url}&font=presetName`;
    expect(parseWidgetUrl(oneFont)?.settings).toMatchObject({
      font: 'presetName',
      userFont: 'presetName',
    });
    expect(roundTrip(oneFont)).toBe(oneFont);
  });

  it('ignores a preset font named by a classic URL', () => {
    const parsed = parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?twitch=foo&font=presetName`);
    expect(parsed?.settings).toMatchObject({ font: 'inter', userFont: 'inter' });
  });

  it('picks the single platform when only one channel is set', () => {
    const twitchOnly = parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?twitch=foo`);
    const kickOnly = parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?kick=bar`);
    expect(twitchOnly?.settings.platforms).toBe('twitch');
    expect(kickOnly?.settings.platforms).toBe('kick');
  });

  it('keeps both platforms when a single-channel URL has a platform indicator', () => {
    const url = `${ORIGIN}/widgets/chat-widget?twitch=foo&platformDisplay=none`;
    expect(parseWidgetUrl(url)?.settings.platforms).toBe('both');
    expect(roundTrip(url)).toBe(url);
  });

  it('falls back to defaults for values the widget would not accept', () => {
    const parsed = parseWidgetUrl(
      `${ORIGIN}/widgets/chat-widget?twitch=foo&font=comic&fontSize=0&bgOpacity=3&layout=grid`,
    );
    expect(parsed?.settings).toMatchObject({
      font: DEFAULT_SETTINGS.font,
      fontSize: DEFAULT_SETTINGS.fontSize,
      bgOpacity: DEFAULT_SETTINGS.bgOpacity,
      layout: DEFAULT_SETTINGS.layout,
    });
  });

  it('reads the highlight selection, with none and unknown values', () => {
    const highlightsOf = (value: string) =>
      parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?twitch=foo&highlights=${value}`)?.settings
        .highlights;
    expect(highlightsOf('reply,mention')).toEqual(['mention', 'reply']);
    expect(highlightsOf('none')).toEqual([]);
    expect(highlightsOf('subs')).toEqual(DEFAULT_SETTINGS.highlights);
  });

  it('reads the message duration, with keep=true meaning never remove', () => {
    const durationOf = (query: string) =>
      parseWidgetUrl(`${ORIGIN}/widgets/chat-widget?twitch=foo&${query}`)?.settings.duration;
    expect(durationOf('duration=120')).toBe('120');
    expect(durationOf('keep=true')).toBe('keep');
    expect(durationOf('duration=7')).toBe(DEFAULT_SETTINGS.duration);
  });

  it('rebuilds the same URL it was given', () => {
    const urls = [
      `${ORIGIN}/widgets/chat-widget?twitch=foo`,
      `${ORIGIN}/widgets/chat-widget?kick=bar&sevenTv=false&fontSize=30`,
      `${ORIGIN}/widgets/chat-widget?twitch=foo&kick=bar&background=true&bgOpacity=0.2&platformDisplay=name&animation=none`,
      `${ORIGIN}/widgets/chat-widget?twitch=foo&keep=true&hideBots=true`,
      `${ORIGIN}/widgets/chat-widget?kick=bar&duration=60&hideCommands=true`,
      `${ORIGIN}/widgets/chat-widget?twitch=foo&highlights=mention%2CfirstMessage`,
    ];
    for (const url of urls) expect(roundTrip(url)).toBe(url);
  });
});
