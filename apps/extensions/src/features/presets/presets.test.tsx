import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { GoalWidget } from '#/features/widgets/goal/goal-widget';
import { PresetAlert } from '#/features/widgets/stream-alerts/themes/preset';
import { DEFAULT_GOAL_SETTINGS } from '#/lib/goal-url';
import { BUILTIN_PRESETS } from './builtin-presets';
import { type PresetData, presetSchema } from './preset-schema';
import { applyPresetToUrl, PRESET_WIDGETS, presetDemoUrl } from './preset-widgets';
import { findPreset, loadCommunityPresets, normalizePresetId, PRESETS } from './registry';
import { readSitePreset, writeSitePreset } from './site-preset';
import { fontHref, painter, skinFor, toTone } from './skin';

const ORIGIN = 'https://extensions.senchabot.com';
const RIFT = BUILTIN_PRESETS.find((preset) => preset.id === 'rift') as PresetData;

describe('built-in presets', () => {
  it('all pass the schema community presets are held to, under unique ids', () => {
    for (const preset of BUILTIN_PRESETS) expect(presetSchema.parse(preset)).toEqual(preset);
    const ids = PRESETS.map((entry) => entry.data.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('classic');
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
      '/widgets/chat-widget?mock=true&preset=rift',
      '/widgets/stream-alerts?simulate=1&preset=rift',
      '/widgets/goal?simulate=1&preset=rift',
      '/widgets/subathon?simulate=1&preset=rift',
      '/widgets/poll?simulate=1&preset=rift',
      '/widgets/raffle-overlay?demo=1&preset=rift',
    ]);
    expect(presetDemoUrl(PRESET_WIDGETS[0], 'classic')).toBe('/widgets/chat-widget?mock=true');
  });
});

describe('site preset', () => {
  afterEach(() => localStorage.clear());

  it('stores a known preset, forgets classic and reads anything else as classic', () => {
    expect(readSitePreset()).toBe('classic');
    writeSitePreset('dynasty');
    expect(readSitePreset()).toBe('dynasty');
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
