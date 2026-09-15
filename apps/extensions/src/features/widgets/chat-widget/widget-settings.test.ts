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
      platformDisplay: 'name',
      font: 'mono',
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
      sevenTv: false,
      badges: false,
      timestamp: true,
      keep: true,
    };
    expect(parseWidgetUrl(widgetUrl(settings, 'foo', 'bar'))).toEqual({
      settings,
      twitchChannel: 'foo',
      kickChannel: 'bar',
    });
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

  it('rebuilds the same URL it was given', () => {
    const urls = [
      `${ORIGIN}/widgets/chat-widget?twitch=foo`,
      `${ORIGIN}/widgets/chat-widget?kick=bar&sevenTv=false&fontSize=30`,
      `${ORIGIN}/widgets/chat-widget?twitch=foo&kick=bar&background=true&bgOpacity=0.2&platformDisplay=name&animation=none`,
    ];
    for (const url of urls) expect(roundTrip(url)).toBe(url);
  });
});
