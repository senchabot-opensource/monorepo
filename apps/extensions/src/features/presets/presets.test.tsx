import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { GoalWidget } from '#/features/widgets/goal/goal-widget';
import { PresetAlert } from '#/features/widgets/stream-alerts/themes/preset';
import { DEFAULT_GOAL_SETTINGS } from '#/lib/goal-url';
import { dictionaries, resolveKey } from '#/lib/i18n';
import { SITE_FONT_STACKS } from '#/lib/site-fonts';
import { getWidget } from '#/lib/widgets';
import { BUILTIN_PRESETS } from './builtin-presets';
import { Frame } from './frame';
import { type PresetData, presetSchema } from './preset-schema';
import { applyPresetToUrl, PRESET_WIDGETS, presetDemoUrl } from './preset-widgets';
import { findPreset, loadCommunityPresets, normalizePresetId, PRESETS } from './registry';
import { readSitePreset, writeSitePreset } from './site-preset';
import { fontHref, painter, type Skin, skinFor, toTone } from './skin';

const ORIGIN = 'https://extensions.senchabot.com';
const RIFT = BUILTIN_PRESETS.find((preset) => preset.id === 'rift') as PresetData;

describe('built-in presets', () => {
  it('all pass the schema community presets are held to, under unique ids', () => {
    for (const preset of BUILTIN_PRESETS) expect(presetSchema.parse(preset)).toEqual(preset);
    const ids = PRESETS.map((entry) => entry.data.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('classic');
  });

  it('have a description in every locale', () => {
    for (const preset of BUILTIN_PRESETS) {
      for (const [locale, dict] of Object.entries(dictionaries)) {
        const key = `presets.descriptions.${preset.id}`;
        expect(resolveKey(dict, key), `${preset.id} ${locale}`).toBeTruthy();
      }
    }
  });

  it("name every widget that takes one in the presets page's intro and FAQ, in every locale", () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const widget of PRESET_WIDGETS) {
        const name = resolveKey(dict, widget.nameKey) as string;
        expect(dict.presets.lead, `${widget.id} ${locale} lead`).toContain(name);
        expect(dict.presets.faq3A, `${widget.id} ${locale} FAQ`).toContain(name);
      }
    }
  });

  it("are named by game in the presets page's intro, in every locale", () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const preset of BUILTIN_PRESETS) {
        // The presets made just for fun have no game; the intro names them instead.
        const label = preset.game ?? preset.name;
        expect(dict.presets.pickText, `${label} ${locale}`).toContain(label);
      }
    }
  });

  it('keep Battlefield, Call of Duty and Cyberpunk out of their data, copy and docs', () => {
    // Conquest, Operator and Glitch are just for fun, with no game named anywhere.
    const named = /battlefield|call of duty|cyberpunk/i;
    for (const preset of BUILTIN_PRESETS) expect(JSON.stringify(preset)).not.toMatch(named);
    for (const [locale, dict] of Object.entries(dictionaries)) {
      expect(JSON.stringify(dict), locale).not.toMatch(named);
    }
    for (const file of [
      'community/README.md',
      '../../../public/llms.txt',
      '../../../public/llms-full.txt',
    ]) {
      expect(readFileSync(resolve(__dirname, file), 'utf8'), file).not.toMatch(named);
    }
  });

  it('asks Google Fonts for each font once, with its weights', () => {
    expect(fontHref(RIFT.fonts)).toBe(
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Nunito+Sans:wght@400..800&display=swap',
    );
    const blocks = findPreset('blocks')?.data as PresetData;
    expect(fontHref(blocks.fonts)).toBe(
      'https://fonts.googleapis.com/css2?family=Jersey+10:wght@400&display=swap',
    );
  });
});

describe('loadCommunityPresets', () => {
  const community = (id: string, overrides: object = {}) => ({
    ...RIFT,
    id,
    name: 'Test',
    ...overrides,
  });
  const taken = new Set(['classic', 'rift']);

  it('keeps a valid preset named after its file', () => {
    const loaded = loadCommunityPresets(
      { './community/neon-city.json': community('neon-city') },
      taken,
    );
    expect(loaded.map((preset) => preset.id)).toEqual(['neon-city']);
  });

  it('leaves out bad colors, fonts that could break a URL, misnamed files and taken ids', () => {
    const files = {
      './community/bad-color.json': community('bad-color', {
        colors: { ...RIFT.colors, accent: 'red; background:url(x)' },
      }),
      './community/bad-font.json': community('bad-font', {
        fonts: { ...RIFT.fonts, display: { ...RIFT.fonts.display, family: 'Evil&family=X' } },
      }),
      './community/other-name.json': community('mismatch'),
      './community/rift.json': community('rift'),
      './community/classic.json': community('classic'),
    };
    expect(loadCommunityPresets(files, taken)).toEqual([]);
  });

  it("accepts the README's example, so contributors start from a preset that loads", () => {
    const readme = readFileSync(resolve(__dirname, 'community/README.md'), 'utf8');
    const example = JSON.parse(readme.match(/```json\n([\s\S]*?)```/)?.[1] ?? 'null');
    expect(loadCommunityPresets({ './community/neon-city.json': example }, taken)).toHaveLength(1);
  });

  it('only takes https links for the author', () => {
    const file = community('linked', { author: { name: 'Me', url: 'javascript:alert(1)' } });
    expect(loadCommunityPresets({ './community/linked.json': file }, taken)).toEqual([]);
  });
});

describe('skins', () => {
  it('are null for classic, a typo or a removed preset, so overlays keep their own look', () => {
    expect(skinFor('classic')).toBeNull();
    expect(skinFor('nope')).toBeNull();
    expect(skinFor(null)).toBeNull();
    expect(skinFor(' RIFT ')?.id).toBe('rift');
    expect(normalizePresetId('nope')).toBe('classic');
  });

  it('turn hex colors into hue and saturation', () => {
    expect(toTone('#ff0000')).toEqual({ h: 0, s: 100 });
    expect(toTone('#0ac8b9')).toEqual({ h: 175.3, s: 90.5 });
    expect(toTone('#777777')).toEqual({ h: 0, s: 0 });
  });

  it("paint the overlay's own hsl() for classic and the preset's tone otherwise", () => {
    expect(painter(null, 265)(95, 72)).toBe('hsl(265 95% 72% / 1)');
    expect(painter(null, 42)(100, 60, 0.8)).toBe('hsl(42 100% 60% / 0.8)');
    const rift = skinFor('rift');
    expect(painter(rift, 265)(95, 72)).toBe('hsl(175.3 90.5% 72% / 1)');
    expect(painter(rift, 42, 'win')(95, 60)).toBe('hsl(40 45% 60% / 1)');
  });

  it('swap both fonts for a site font when asked, and keep the rest of the preset', () => {
    const own = skinFor('banner') as Skin;
    const roboto = skinFor('banner', true, 'roboto') as Skin;
    expect(roboto.display).toBe(SITE_FONT_STACKS.roboto);
    expect(roboto.body).toBe(SITE_FONT_STACKS.roboto);
    expect(roboto.fontHref).toBe(
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400..900&display=swap',
    );
    expect({ ...roboto, display: own.display, body: own.body, fontHref: own.fontHref }).toEqual(
      own,
    );
    // One object per look, so memoized parts don't redraw.
    expect(skinFor('banner', true, 'roboto')).toBe(roboto);
    expect(skinFor('banner')).toBe(own);
    const still = skinFor('banner', false, 'roboto');
    expect(still?.effect).toBe('none');
    expect(still?.display).toBe(SITE_FONT_STACKS.roboto);
    // The viewer's own font has nothing to load.
    expect(skinFor('banner', true, 'system')?.fontHref).toBe('');
    expect(skinFor('classic', true, 'roboto')).toBeNull();
  });
});

describe('applyPresetToUrl', () => {
  it('adds the preset and keeps every other byte of the URL', () => {
    const url = `${ORIGIN}/widgets/goal?twitch=me&title=ROAD%20TO%20500&color=gold`;
    expect(applyPresetToUrl(`  ${url} `, 'realm')).toEqual({
      status: 'ok',
      url: `${url}&preset=realm`,
    });
  });

  it('swaps a preset for another and drops it for classic', () => {
    const url = `${ORIGIN}/widgets/chat-widget?preset=rift&twitch=me`;
    expect(applyPresetToUrl(url, 'blocks').url).toBe(
      `${ORIGIN}/widgets/chat-widget?twitch=me&preset=blocks`,
    );
    expect(applyPresetToUrl(url, 'classic').url).toBe(`${ORIGIN}/widgets/chat-widget?twitch=me`);
    expect(applyPresetToUrl(`${ORIGIN}/widgets/raffle-overlay`, 'agent').url).toBe(
      `${ORIGIN}/widgets/raffle-overlay?preset=agent`,
    );
  });

  it('leaves widgets without presets and anything else alone', () => {
    expect(applyPresetToUrl(`${ORIGIN}/widgets/emote-wall?twitch=me`, 'rift').status).toBe(
      'unsupported',
    );
    expect(applyPresetToUrl(`${ORIGIN}/tools/obs-bridge`, 'rift').status).toBe('unsupported');
    expect(applyPresetToUrl('not a url', 'rift')).toEqual({ status: 'invalid', url: 'not a url' });
    expect(applyPresetToUrl('https://example.com/?x=1', 'rift').status).toBe('invalid');
  });

  it('covers every widget whose overlay reads a preset, with a demo for each', () => {
    expect(PRESET_WIDGETS.map((widget) => presetDemoUrl(widget, 'rift'))).toEqual([
      '/widgets/goal?simulate=1&preset=rift',
      '/widgets/goal?simulate=1&type=bits&preset=rift',
      '/widgets/follower-goal?simulate=1&preset=rift',
      '/widgets/subathon?simulate=1&preset=rift',
      '/widgets/poll?simulate=1&preset=rift',
      '/widgets/stream-alerts?simulate=1&preset=rift',
      '/widgets/featured?simulate=1&preset=rift',
      `${getWidget('counter').demoUrl}&preset=rift`,
      '/widgets/frame?demo=1&preset=rift',
      '/widgets/countdown?simulate=1&preset=rift',
      '/widgets/socials?demo=1&preset=rift',
      '/widgets/now-playing?demo=1&preset=rift',
      '/widgets/spin-wheel?demo=1&sound=0&preset=rift',
      '/widgets/event-list?simulate=1&preset=rift',
      '/widgets/credits?simulate=1&preset=rift',
      '/widgets/queue?simulate=1&preset=rift',
      '/widgets/leaderboard?simulate=1&preset=rift',
      `${getWidget('lower-third').demoUrl}&preset=rift`,
      '/widgets/tasks?simulate=1&preset=rift',
      '/widgets/chat-widget?mock=true&preset=rift',
      '/widgets/emote-combo?simulate=1&preset=rift',
      '/widgets/raffle-overlay?demo=1&preset=rift',
    ]);
    expect(presetDemoUrl(getWidget('chat-box'), 'classic')).toBe('/widgets/chat-widget?mock=true');
  });

  it('adds a preset to a Follower Goal URL already in OBS', () => {
    expect(applyPresetToUrl(`${ORIGIN}/widgets/follower-goal?twitch=me`, 'banner')).toEqual({
      status: 'ok',
      url: `${ORIGIN}/widgets/follower-goal?twitch=me&preset=banner`,
    });
  });

  it('plays the Spin Wheel demo without sound, in the classic look too', () => {
    expect(presetDemoUrl(getWidget('spin-wheel'), 'classic')).toBe(
      '/widgets/spin-wheel?demo=1&sound=0',
    );
  });
});

describe('site preset', () => {
  afterEach(() => localStorage.clear());

  it('stores a known preset, forgets classic and reads anything else as classic', () => {
    expect(readSitePreset()).toBe('classic');
    writeSitePreset('flower');
    expect(readSitePreset()).toBe('flower');
    writeSitePreset('classic');
    expect(localStorage.getItem('preset')).toBeNull();
    localStorage.setItem('preset', 'deleted-one');
    expect(readSitePreset()).toBe('classic');
  });
});

describe('overlays in a preset', () => {
  const { platforms: _, ...goal } = DEFAULT_GOAL_SETTINGS;

  it('mark and frame Sub Goal in the preset, and leave classic unmarked', () => {
    const { unmount } = render(<GoalWidget simulate settings={{ ...goal, preset: 'realm' }} />);
    expect(screen.getByTestId('goal').dataset.preset).toBe('realm');
    unmount();
    render(<GoalWidget simulate settings={goal} />);
    expect(screen.getByTestId('goal').dataset.preset).toBeUndefined();
  });

  it("draw Sub Goal in the font its URL picks instead of the preset's own", () => {
    render(<GoalWidget simulate settings={{ ...goal, preset: 'banner', font: 'mono' }} />);
    const css = [...document.querySelectorAll('style')].map((style) => style.textContent).join('');
    expect(css).toContain(`font-family:${SITE_FONT_STACKS.mono}`);
    expect(document.querySelector('link[href*="family=JetBrains+Mono"]')).not.toBeNull();
  });

  it("keep the ornate frame's rivets and top gem unless an overlay leaves them out", () => {
    const realm = skinFor('realm') as NonNullable<ReturnType<typeof skinFor>>;
    const { container, rerender } = render(<Frame skin={realm} radius={20} />);
    expect(container.querySelectorAll('[data-stud]')).toHaveLength(5);
    rerender(<Frame skin={realm} radius={20} studs={false} />);
    expect(container.querySelectorAll('[data-stud]')).toHaveLength(0);
  });

  it("leave Flower's diamonds off a card's top and bottom, and keep them everywhere else", () => {
    const studs = (preset: string, card: boolean) => {
      const skin = skinFor(preset, false) as NonNullable<ReturnType<typeof skinFor>>;
      const { container, unmount } = render(<Frame skin={skin} radius={20} card={card} />);
      const count = container.querySelectorAll('[data-stud]').length;
      unmount();
      return count;
    };
    expect([studs('flower', true), studs('flower', false)]).toEqual([0, 2]);
    expect([studs('rift', true), studs('rift', false)]).toEqual([2, 2]);
  });

  it('leave every dot off the top and bottom edges of a plainEdges frame, in every preset', () => {
    const studs = (preset: string, plainEdges: boolean) => {
      const skin = skinFor(preset, false) as NonNullable<ReturnType<typeof skinFor>>;
      const { container, unmount } = render(
        <Frame skin={skin} radius={20} plainEdges={plainEdges} />,
      );
      const count = container.querySelectorAll('[data-stud]').length;
      unmount();
      return count;
    };
    // Diamonds, rivets and a gem, the tactical square, each drawn without plainEdges.
    expect(['rift', 'realm', 'glitch'].map((id) => studs(id, false))).toEqual([2, 5, 1]);
    for (const { id } of BUILTIN_PRESETS) expect(studs(id, true), id).toBe(0);
  });

  it("draw Pizza's frame as a plain crust: a rim and a line of sauce, nothing in the corners", () => {
    // Stilled, so only the frame's own lines are drawn.
    const pizza = skinFor('pizza', false) as NonNullable<ReturnType<typeof skinFor>>;
    expect(pizza.frameKind).toBe('crust');
    const { container } = render(<Frame skin={pizza} radius={20} />);
    const lines = container.firstElementChild as HTMLElement;
    expect(lines.children).toHaveLength(2);
    expect(container.querySelectorAll('[data-stud]')).toHaveLength(0);
  });

  it("draw Stream Alerts' preset card with the alert's words", () => {
    render(
      <PresetAlert
        skin={skinFor('ancient') as NonNullable<ReturnType<typeof skinFor>>}
        id={1}
        kind="gift"
        hue={0}
        heading="GIFTED SUBS"
        name="Mochi"
        detail="gifted 5 subs"
        message="GG"
        platformTag="KICK"
        durationMs={7000}
      />,
    );
    for (const text of ['GIFTED SUBS', 'Mochi', 'gifted 5 subs', '“GG”', 'KICK']) {
      expect(screen.getByText(text)).toBeTruthy();
    }
  });
});
