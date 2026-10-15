import { describe, expect, it } from 'vitest';
import { BUILTIN_PRESETS } from '#/features/presets/builtin-presets';
import { presetEffect } from '#/features/presets/registry';
import {
  buildWidgetParams,
  DEFAULT_SETTINGS as DEFAULT_CHAT_BOX_SETTINGS,
  parseWidgetUrl,
} from '#/features/widgets/chat-widget/widget-settings';
import { buildCountdownUrl, DEFAULT_COUNTDOWN_SETTINGS, parseCountdownUrl } from './countdown-url';
import { buildCounterUrl, DEFAULT_COUNTER_SETTINGS, parseCounterUrl } from './counter-url';
import { buildCreditsUrl, DEFAULT_CREDITS_SETTINGS, parseCreditsUrl } from './credits-url';
import {
  buildEmoteComboUrl,
  DEFAULT_EMOTE_COMBO_SETTINGS,
  parseEmoteComboUrl,
} from './emote-combo-url';
import {
  buildEventListUrl,
  DEFAULT_EVENT_LIST_SETTINGS,
  parseEventListUrl,
} from './event-list-url';
import { buildFeaturedUrl, DEFAULT_FEATURED_SETTINGS, parseFeaturedUrl } from './featured-url';
import {
  buildFollowerGoalUrl,
  DEFAULT_FOLLOWER_GOAL_SETTINGS,
  parseFollowerGoalUrl,
} from './follower-goal-url';
import { buildFrameUrl, DEFAULT_FRAME_SETTINGS, parseFrameUrl } from './frame-url';
import {
  buildGoalPreviewUrl,
  buildGoalUrl,
  DEFAULT_BITS_GOAL_SETTINGS,
  DEFAULT_GOAL_SETTINGS,
  parseGoalUrl,
} from './goal-url';
import {
  buildLeaderboardUrl,
  DEFAULT_LEADERBOARD_SETTINGS,
  parseLeaderboardUrl,
} from './leaderboard-url';
import {
  buildLowerThirdUrl,
  DEFAULT_LOWER_THIRD_SETTINGS,
  parseLowerThirdUrl,
} from './lower-third-url';
import {
  buildNowPlayingUrl,
  DEFAULT_NOW_PLAYING_SETTINGS,
  parseNowPlayingUrl,
} from './now-playing-url';
import { buildPollUrl, DEFAULT_POLL_SETTINGS, parsePollUrl } from './poll-url';
import { FONT_PARAM, FX_PARAM, readFont, readFx, writePreset } from './preset-url';
import { buildQueueUrl, DEFAULT_QUEUE_SETTINGS, parseQueueUrl } from './queue-url';
import type { SiteFont } from './site-fonts';
import {
  buildSocialsPreviewUrl,
  buildSocialsUrl,
  DEFAULT_SOCIALS_SETTINGS,
  parseSocialsUrl,
} from './socials-url';
import {
  buildSpinWheelUrl,
  DEFAULT_SPIN_WHEEL_SETTINGS,
  parseSpinWheelUrl,
} from './spin-wheel-url';
import {
  buildStreamAlertsUrl,
  DEFAULT_STREAM_ALERTS_SETTINGS,
  parseStreamAlertsUrl,
} from './stream-alerts-url';
import { buildSubathonUrl, DEFAULT_SUBATHON_SETTINGS, parseSubathonUrl } from './subathon-url';
import { buildTasksUrl, DEFAULT_TASKS_SETTINGS, parseTasksUrl } from './tasks-url';

const ORIGIN = 'https://extensions.senchabot.com';
const paramsOf = (url: string) => new URL(url).searchParams;

/** What these tests change on a widget: its preset, the preset's effect switch and its font. */
type Look = { preset?: string; fx?: boolean; font?: SiteFont };

interface Overlay {
  name: string;
  /** The widget URL with `look` over the defaults, on a channel where the widget needs one. */
  url: (look: Look) => string;
  /** The settings a setup page loads back from the pasted URL. */
  read: (url: string) => { fx?: boolean; font?: string } | null | undefined;
}

const OVERLAYS: Overlay[] = [
  {
    name: 'Sub Goal',
    url: (look) => buildGoalUrl(ORIGIN, { ...DEFAULT_GOAL_SETTINGS, ...look }, 'streamer', ''),
    read: (url) => parseGoalUrl(url)?.settings,
  },
  {
    name: 'Bits & Kicks Goal',
    url: (look) => buildGoalUrl(ORIGIN, { ...DEFAULT_BITS_GOAL_SETTINGS, ...look }, 'streamer', ''),
    read: (url) => parseGoalUrl(url, 'bits')?.settings,
  },
  {
    name: 'Follower Goal',
    url: (look) =>
      buildFollowerGoalUrl(ORIGIN, { ...DEFAULT_FOLLOWER_GOAL_SETTINGS, ...look }, 'streamer', ''),
    read: (url) => parseFollowerGoalUrl(url)?.settings,
  },
  {
    name: 'Chat Poll',
    url: (look) =>
      buildPollUrl(ORIGIN, { ...DEFAULT_POLL_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parsePollUrl(url)?.settings,
  },
  {
    name: 'Featured Message',
    url: (look) =>
      buildFeaturedUrl(ORIGIN, { ...DEFAULT_FEATURED_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseFeaturedUrl(url)?.settings,
  },
  {
    name: 'Emote Combo',
    url: (look) =>
      buildEmoteComboUrl(
        ORIGIN,
        { ...DEFAULT_EMOTE_COMBO_SETTINGS, ...look },
        'streamer',
        '',
        'en',
      ),
    read: (url) => parseEmoteComboUrl(url)?.settings,
  },
  {
    name: 'Stream Alerts',
    url: (look) =>
      buildStreamAlertsUrl(
        ORIGIN,
        { ...DEFAULT_STREAM_ALERTS_SETTINGS, ...look },
        'streamer',
        '',
        'en',
      ),
    read: (url) => parseStreamAlertsUrl(url)?.settings,
  },
  {
    name: 'Counter',
    url: (look) =>
      buildCounterUrl(ORIGIN, { ...DEFAULT_COUNTER_SETTINGS, ...look }, 'streamer', ''),
    read: (url) => parseCounterUrl(url)?.settings,
  },
  {
    name: 'Subathon Timer',
    url: (look) =>
      buildSubathonUrl(ORIGIN, { ...DEFAULT_SUBATHON_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseSubathonUrl(url)?.settings,
  },
  {
    name: 'Stream Frames',
    url: (look) => buildFrameUrl(ORIGIN, { ...DEFAULT_FRAME_SETTINGS, ...look }),
    read: (url) => parseFrameUrl(url),
  },
  {
    name: 'Stream Countdown',
    url: (look) =>
      buildCountdownUrl(ORIGIN, { ...DEFAULT_COUNTDOWN_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseCountdownUrl(url)?.settings,
  },
  {
    name: 'Now Playing',
    url: (look) =>
      buildNowPlayingUrl(
        ORIGIN,
        { ...DEFAULT_NOW_PLAYING_SETTINGS, user: 'listener', ...look },
        'en',
      ),
    read: (url) => parseNowPlayingUrl(url)?.settings,
  },
  {
    name: 'Spin Wheel',
    url: (look) =>
      buildSpinWheelUrl(ORIGIN, { ...DEFAULT_SPIN_WHEEL_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseSpinWheelUrl(url)?.settings,
  },
  {
    name: 'Event List',
    url: (look) =>
      buildEventListUrl(ORIGIN, { ...DEFAULT_EVENT_LIST_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseEventListUrl(url)?.settings,
  },
  {
    name: 'End Credits',
    url: (look) =>
      buildCreditsUrl(ORIGIN, { ...DEFAULT_CREDITS_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseCreditsUrl(url)?.settings,
  },
  {
    name: 'Viewer Queue',
    url: (look) =>
      buildQueueUrl(ORIGIN, { ...DEFAULT_QUEUE_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseQueueUrl(url)?.settings,
  },
  {
    name: 'Top Supporters',
    url: (look) =>
      buildLeaderboardUrl(
        ORIGIN,
        { ...DEFAULT_LEADERBOARD_SETTINGS, ...look },
        'streamer',
        '',
        'en',
      ),
    read: (url) => parseLeaderboardUrl(url)?.settings,
  },
  {
    name: 'Lower Thirds',
    // Empty until there's something to show.
    url: (look) =>
      buildLowerThirdUrl(
        ORIGIN,
        { ...DEFAULT_LOWER_THIRD_SETTINGS, title: 'On air', ...look },
        'streamer',
        '',
      ),
    read: (url) => parseLowerThirdUrl(url)?.settings,
  },
  {
    name: 'Task List',
    url: (look) =>
      buildTasksUrl(ORIGIN, { ...DEFAULT_TASKS_SETTINGS, ...look }, 'streamer', '', 'en'),
    read: (url) => parseTasksUrl(url)?.settings,
  },
  {
    name: 'Chat Box',
    url: (look) =>
      `${ORIGIN}/widgets/chat-widget?${buildWidgetParams({ ...DEFAULT_CHAT_BOX_SETTINGS, ...look }, 'streamer', '')}`,
    read: (url) => parseWidgetUrl(url)?.settings,
  },
  {
    name: 'Socials',
    url: (look) => buildSocialsUrl(ORIGIN, { ...DEFAULT_SOCIALS_SETTINGS, twitter: 'me', ...look }),
    read: (url) => parseSocialsUrl(url),
  },
];

describe('writePreset', () => {
  const written = (preset: string, fx?: boolean) => {
    const params = new URLSearchParams();
    writePreset(params, preset, fx);
    return params.toString();
  };

  it('writes nothing for classic, whatever the effect switch says', () => {
    expect(written('classic')).toBe('');
    expect(written('classic', false)).toBe('');
  });

  it('writes fx=0 for every built-in game preset, since each has an effect to still', () => {
    for (const preset of BUILTIN_PRESETS) {
      expect(presetEffect(preset.id)).not.toBe('none');
      expect(written(preset.id, false)).toBe(`preset=${preset.id}&fx=0`);
    }
  });

  it('writes fx=0 only when a preset with an effect has it switched off', () => {
    expect(presetEffect('glitch')).toBe('glitch');
    expect(presetEffect('banner')).toBe('forge');
    expect(written('glitch', false)).toBe('preset=glitch&fx=0');
    expect(written('banner', false)).toBe('preset=banner&fx=0');
    expect(written('glitch', true)).toBe('preset=glitch');
    expect(written('glitch')).toBe('preset=glitch');
  });
});

describe('readFx', () => {
  const read = (query: string) => readFx(new URLSearchParams(query));

  it('reads 0 and false as off', () => {
    expect(read('fx=0')).toStrictEqual({ fx: false });
    expect(read('fx=false')).toStrictEqual({ fx: false });
  });

  it('adds nothing when the effect is on, or the URL predates the switch', () => {
    expect(read('fx=1')).toStrictEqual({});
    expect(read('fx=')).toStrictEqual({});
    expect(read('preset=glitch')).toStrictEqual({});
  });
});

describe('writePreset with a font', () => {
  const written = (preset: string, font?: SiteFont) => {
    const params = new URLSearchParams();
    writePreset(params, preset, true, font);
    return params.toString();
  };

  it('writes the font after the preset, and never for classic', () => {
    expect(written('banner', 'roboto')).toBe('preset=banner&font=roboto');
    expect(written('banner')).toBe('preset=banner');
    expect(written('classic', 'roboto')).toBe('');
  });
});

describe('readFont', () => {
  const read = (query: string) => readFont(new URLSearchParams(query));

  it('reads a known font under a preset', () => {
    expect(read('preset=banner&font=mono')).toStrictEqual({ font: 'mono' });
    expect(read('preset=glitch&font=system')).toStrictEqual({ font: 'system' });
  });

  it('adds nothing for an unknown font, or for a font without a preset', () => {
    expect(read('preset=banner&font=comic')).toStrictEqual({});
    expect(read('preset=banner')).toStrictEqual({});
    expect(read('font=roboto')).toStrictEqual({});
    expect(read('preset=nope&font=roboto')).toStrictEqual({});
  });
});

describe('the font in widget URLs', () => {
  // Chat Box picks its fonts in its own two boxes, with a `font` param of its own.
  const FONTED = OVERLAYS.filter((overlay) => overlay.name !== 'Chat Box');

  it.each(FONTED)('$name writes the font a preset is drawn in and reads it back', ({
    url,
    read,
  }) => {
    const roboto = url({ preset: 'banner', font: 'roboto' });
    expect(paramsOf(roboto).get(FONT_PARAM)).toBe('roboto');
    expect(read(roboto)?.font).toBe('roboto');
  });

  it.each(FONTED)("$name leaves the font out for a preset's own fonts and for classic", ({
    url,
    read,
  }) => {
    const looks: Look[] = [{}, { preset: 'banner' }, { font: 'roboto' }];
    for (const look of looks) {
      const own = url(look);
      expect(paramsOf(own).has(FONT_PARAM)).toBe(false);
      expect(read(own)).not.toHaveProperty('font');
    }
  });

  it('comes before the language on the Spin Wheel, after the effect switch', () => {
    const settings = {
      ...DEFAULT_SPIN_WHEEL_SETTINGS,
      preset: 'glitch',
      fx: false,
      font: 'nunito' as const,
    };
    const keys = [...paramsOf(buildSpinWheelUrl(ORIGIN, settings, 'streamer', '', 'en')).keys()];
    expect(keys.slice(-4)).toEqual(['preset', FX_PARAM, FONT_PARAM, 'lang']);
  });

  it('goes into a Socials URL once, after the preset', () => {
    const settings = { ...DEFAULT_SOCIALS_SETTINGS, twitter: 'me', preset: 'banner' };
    expect(buildSocialsUrl(ORIGIN, { ...settings, font: 'serif' })).toBe(
      `${ORIGIN}/widgets/socials?twitter=me&preset=banner&font=serif`,
    );
  });
});

describe('the effect switch in widget URLs', () => {
  it.each(OVERLAYS)('$name writes fx=0 for a stilled effect and reads it back', ({ url, read }) => {
    const off = url({ preset: 'glitch', fx: false });
    expect(paramsOf(off).get(FX_PARAM)).toBe('0');
    expect(read(off)?.fx).toBe(false);
  });

  it.each(OVERLAYS)('$name leaves fx out while it would change nothing', ({ url, read }) => {
    const looks: Look[] = [{}, { preset: 'glitch' }, { preset: 'glitch', fx: true }, { fx: false }];
    for (const look of looks) {
      const on = url(look);
      expect(paramsOf(on).has(FX_PARAM)).toBe(false);
      // Exactly the settings a URL from before the switch reads as.
      expect(read(on)).not.toHaveProperty('fx');
    }
  });

  it('carries the switch into the setup preview', () => {
    const settings = { ...DEFAULT_GOAL_SETTINGS, preset: 'glitch', fx: false };
    expect(paramsOf(buildGoalPreviewUrl(ORIGIN, settings, 'p1')).get(FX_PARAM)).toBe('0');
  });

  it('comes before the language on the Spin Wheel, which writes the language last', () => {
    const settings = { ...DEFAULT_SPIN_WHEEL_SETTINGS, preset: 'glitch', fx: false };
    const keys = [...paramsOf(buildSpinWheelUrl(ORIGIN, settings, 'streamer', '', 'en')).keys()];
    expect(keys.slice(-3)).toEqual(['preset', FX_PARAM, 'lang']);
  });

  it('never goes into a Socials URL as fx=true, which writes its text settings as they are', () => {
    const settings = { ...DEFAULT_SOCIALS_SETTINGS, twitter: 'me', preset: 'glitch' };
    expect(buildSocialsUrl(ORIGIN, { ...settings, fx: true })).toBe(
      `${ORIGIN}/widgets/socials?twitter=me&preset=glitch`,
    );
    expect(buildSocialsUrl(ORIGIN, { ...settings, fx: false })).toBe(
      `${ORIGIN}/widgets/socials?twitter=me&preset=glitch&fx=0`,
    );
    expect(buildSocialsPreviewUrl(ORIGIN, { ...settings, fx: false })).toBe(
      `${ORIGIN}/widgets/socials?twitter=me&preset=glitch&fx=0&demo=1`,
    );
  });
});
