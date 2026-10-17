import { act, render, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GoalWidget } from '#/features/widgets/goal/goal-widget';
import { DEFAULT_GOAL_SETTINGS } from '#/lib/goal-url';
import { BUILTIN_PRESETS } from '../builtin-presets';
import { Frame, panelStyle } from '../frame';
import { EFFECTS, presetSchema } from '../preset-schema';
import { presetEffect } from '../registry';
import { type Skin, skinCss, skinFor, toSkin } from '../skin';
import { BarFxBurst, BarFxTrack, FrameFx, FxPulse, useChangeCount, useRises } from './engine';
import { BASE_CSS, rng, seedOf, throwSparks } from './primitives';
import { EFFECT_MODULES } from './registry';

const skin = (id: string, fx?: boolean) => skinFor(id, fx) as Skin;
const MODULES = Object.values(EFFECT_MODULES);

/** The CSS with every reduced-motion-safe block cut out, braces balanced. */
function outsideMotionBlocks(css: string): string {
  const open = '@media (prefers-reduced-motion:no-preference){';
  let rest = css;
  let out = '';
  for (let start = rest.indexOf(open); start !== -1; start = rest.indexOf(open)) {
    out += rest.slice(0, start);
    let depth = 1;
    let index = start + open.length;
    for (; index < rest.length && depth > 0; index++) {
      if (rest[index] === '{') depth++;
      if (rest[index] === '}') depth--;
    }
    rest = rest.slice(index);
  }
  return out + rest;
}

const keyframes = (css: string) => [...css.matchAll(/@keyframes ([\w-]+)/g)].map((m) => m[1]);

describe('preset effects', () => {
  it('have a module for every effect a preset can name', () => {
    expect(Object.keys(EFFECT_MODULES).sort()).toEqual(
      EFFECTS.filter((effect) => effect !== 'none').sort(),
    );
    for (const [id, module] of Object.entries(EFFECT_MODULES)) expect(module.id).toBe(id);
  });

  it('keep their keyframes apart', () => {
    const names = [
      BASE_CSS,
      ...MODULES.flatMap((m) => [m.css, m.titleCss?.('sg', 0) ?? '']),
    ].flatMap(keyframes);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each([
    ['base', BASE_CSS, 'pfx'],
    ...MODULES.flatMap((m) => [
      [m.id, m.css, `pfx-${m.id}`],
      [`${m.id} titles`, m.titleCss?.('sg', 0) ?? '', `pfx-${m.id}`],
    ]),
  ])('keep %s to CSS an OBS browser source runs, still for reduced motion', (_, css, prefix) => {
    expect(keyframes(css).every((name) => name.startsWith(`${prefix}-`))).toBe(true);
    // Chromium 103 (OBS 30): no individual transforms or color-mix, and nothing that repaints
    // the game capture behind it.
    expect(css).not.toMatch(/[;{\s](translate|scale|rotate)\s*:/);
    expect(css).not.toMatch(/color-mix|@property|will-change|:has\(|backdrop-filter/);
    expect(css).not.toMatch(/[;{\s]filter\s*:/);
    expect(outsideMotionBlocks(css)).not.toMatch(/animation|@keyframes/);
  });

  it.each(MODULES)('name every class of $id after it', (module) => {
    const classes = [...module.css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    expect(classes.every((name) => name.startsWith(`pfx-${module.id}-`) || name === 'pfx')).toBe(
      true,
    );
  });

  it('give every built-in game preset an effect of its own', () => {
    const effects = BUILTIN_PRESETS.map((preset) => preset.effect);
    expect(effects.every((effect) => effect && effect !== 'none')).toBe(true);
    expect(new Set(effects).size).toBe(effects.length);
    expect(presetEffect('glitch')).toBe('glitch');
    expect(presetEffect('banner')).toBe('forge');
    expect(presetEffect('classic')).toBe('none');
    expect(presetEffect('nope')).toBe('none');
  });

  it('are stilled by fx=0, on the same skin object every time', () => {
    expect(skin('glitch').effect).toBe('glitch');
    expect(skin('banner').effect).toBe('forge');
    expect(skin('glitch', false).effect).toBe('none');
    expect(skin('glitch', false)).toBe(skin('glitch', false));
    expect(skin('glitch', false)).not.toBe(skin('glitch'));
    expect(skin('glitch', undefined)).toBe(skin('glitch'));
    // A community preset can leave its effect out.
    expect(toSkin({ ...BUILTIN_PRESETS[0], effect: undefined }).effect).toBe('none');
  });

  it("put Glitch's titles on its beat once, and leave a still preset's alone", () => {
    const css = skinCss('sg', skin('glitch'));
    expect(css).toContain('--pfx-a:#00f0ff');
    expect(css).toMatch(
      /\.sg-title\{animation:pfx-glitch-title 9000ms steps\(1,end\) -?\d+ms infinite\}/,
    );
    // Written once per page: the same text on the next render, so the loop never jumps.
    expect(skinCss('sg', skin('glitch'))).toBe(css);
    expect(skinCss('sg', skin('glitch', false))).not.toContain('pfx');
    expect(skinCss('sg', skin('rift', false))).not.toContain('pfx');
  });

  it("flicker Aftermath's titles like a failing sign", () => {
    expect(skinCss('sg', skin('aftermath'))).toMatch(
      /\.sg-title\{animation:pfx-reclaim-title 11000ms steps\(1,end\) -?\d+ms infinite\}/,
    );
    expect(skinCss('sg', skin('aftermath', false))).not.toContain('pfx');
  });

  it("paint an effect's still texture under a panel: scanlines, stars or weathering", () => {
    expect(panelStyle(skin('glitch'), 6).background).toMatch(/^repeating-linear-gradient/);
    expect(panelStyle(skin('glitch', false), 6).background).toMatch(/^linear-gradient/);
    expect(panelStyle(skin('banner'), 6).background).toMatch(/^linear-gradient/);
    expect(panelStyle(skin('starway'), 6).background).toMatch(/^radial-gradient/);
    expect(panelStyle(skin('starway', false), 6).background).toMatch(/^linear-gradient/);
    expect(panelStyle(skin('aftermath'), 6).background).toMatch(/^radial-gradient/);
    expect(panelStyle(skin('aftermath', false), 6).background).toMatch(/^linear-gradient/);
    expect(panelStyle(skin('army'), 6).background).toMatch(/^radial-gradient/);
    expect(panelStyle(skin('army', false), 6).background).toMatch(/^linear-gradient/);
    // A texture is as faint as the box: none on one that's see-through.
    expect(panelStyle(skin('starway'), 6, 0.5, 0).background).toMatch(/^linear-gradient/);
    expect(panelStyle(skin('aftermath'), 6, 0.5, 0).background).toMatch(/^linear-gradient/);
    expect(panelStyle(skin('army'), 6, 0.5, 0).background).toMatch(/^linear-gradient/);
  });
});

describe('a framed panel', () => {
  it('plays the effect only for a preset that has one, with effects on', () => {
    const { container, rerender } = render(<Frame skin={skin('glitch')} radius={8} />);
    expect(container.querySelector('[data-fx="glitch"][data-fx-part="panel"]')).toBeTruthy();
    rerender(<Frame skin={skin('glitch', false)} radius={8} />);
    expect(container.querySelector('[data-fx]')).toBeNull();
    rerender(<Frame skin={skin('glitch')} radius={8} fx="off" />);
    expect(container.querySelector('[data-fx]')).toBeNull();
    rerender(<Frame skin={skin('realm', false)} radius={20} />);
    expect(container.querySelector('[data-fx]')).toBeNull();
    expect(container.querySelectorAll('[data-stud]')).toHaveLength(5);
    // An effect adds its layer without touching the frame's own ornaments.
    rerender(<Frame skin={skin('realm')} radius={20} />);
    expect(container.querySelectorAll('[data-stud]')).toHaveLength(5);
  });

  it("hoists each effect's rules into the head once, however many panels draw it", () => {
    render(
      <>
        <Frame skin={skin('banner')} radius={8} />
        <Frame skin={skin('banner')} radius={8} fx="enter" />
      </>,
    );
    expect(document.head.querySelectorAll('style[data-href="pfx-forge"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('style[data-href="pfx-base"]')).toHaveLength(1);
  });

  it('leaves the idle loop out of a list row', () => {
    const { container, rerender } = render(<Frame skin={skin('banner')} radius={8} />);
    expect(container.querySelector('.pfx-forge-a-torch')).toBeTruthy();
    rerender(<Frame skin={skin('banner')} radius={8} fx="enter" />);
    expect(container.querySelector('.pfx-forge-a-torch')).toBeNull();
  });
});

describe('effect triggers', () => {
  it("count changes to a value, but not the one they mount with or a value that's gone", () => {
    const { result, rerender } = renderHook(({ value }) => useChangeCount(value), {
      initialProps: { value: 'a' as unknown },
    });
    expect(result.current).toBe(0);
    rerender({ value: 'b' });
    expect(result.current).toBe(1);
    rerender({ value: null });
    rerender({ value: false });
    expect(result.current).toBe(1);
    rerender({ value: true });
    rerender({ value: 'b' });
    expect(result.current).toBe(3);
  });

  it('count a number going up, not down', () => {
    const { result, rerender } = renderHook(({ value }) => useRises(value), {
      initialProps: { value: 2 },
    });
    rerender({ value: 3 });
    rerender({ value: 1 });
    rerender({ value: 4 });
    expect(result.current).toBe(2);
  });

  it('throw the same particles for the same seed', () => {
    expect(seedOf('fx-1')).toBe(seedOf('fx-1'));
    expect(seedOf('fx-1')).not.toBe(seedOf('fx-2'));
    const spec = { count: 4, x: 10, y: 20, spread: 30, rise: [5, 9], fall: [1, 3], ms: [100, 200] };
    const once = throwSparks(rng(0.25), spec as Parameters<typeof throwSparks>[1]);
    expect(throwSparks(rng(0.25), spec as Parameters<typeof throwSparks>[1])).toEqual(once);
    expect(once).toHaveLength(4);
  });

  it("replay a bar's effect for a new hit, not the one it mounts with or a re-render", () => {
    const forge = skin('banner');
    const hit = (key: number) => ({ key, from: 0.2, to: 0.5 });
    const { container, rerender } = render(<BarFxTrack skin={forge} hit={hit(1)} />);
    const track = container.querySelector('[data-fx-part="track"]') as HTMLElement;
    expect(track.querySelector('.pfx-forge-hot')).toBeNull();
    rerender(<BarFxTrack skin={forge} hit={hit(2)} />);
    const first = track.querySelector('.pfx-forge-hot');
    expect(first).toBeTruthy();
    expect((first as HTMLElement).style.left).toBe('20%');
    rerender(<BarFxTrack skin={forge} hit={hit(2)} />);
    expect(track.querySelector('.pfx-forge-hot')).toBe(first);
    rerender(<BarFxTrack skin={forge} hit={hit(3)} />);
    expect(track.querySelector('.pfx-forge-hot')).not.toBe(first);
  });
});

describe("Sub Goal's demo", () => {
  const { platforms: _, ...goal } = DEFAULT_GOAL_SETTINGS;

  afterEach(() => {
    vi.useRealTimers();
  });

  it('forges each step of its bar in Banner, and stays plain with effects off', () => {
    vi.useFakeTimers();
    const { container, unmount } = render(
      <GoalWidget simulate settings={{ ...goal, preset: 'banner' }} />,
    );
    // The demo's first sub lands after 1.2 s.
    act(() => vi.advanceTimersByTime(1300));
    expect(container.querySelector('[data-fx-part="track"] .pfx-forge-hot')).toBeTruthy();
    expect(container.querySelector('[data-fx-part="burst"] .pfx-forge-spark')).toBeTruthy();
    unmount();

    const still = render(
      <GoalWidget simulate settings={{ ...goal, preset: 'banner', fx: false }} />,
    );
    act(() => vi.advanceTimersByTime(1300));
    expect(still.container.querySelector('[data-fx]')).toBeNull();
  });
});

describe("Starway's effect", () => {
  const starway = skin('starway');
  const bar = (hit: { key: number; from: number; to: number } | null, win = false) => (
    <BarFxBurst skin={starway} hit={hit} win={win} left={10} right={410} y={60} height={40} />
  );

  it("keeps its sky, and launches a comet off the fill's new edge once per hit", () => {
    const { container, rerender } = render(bar({ key: 1, from: 0.2, to: 0.5 }));
    const sky = container.querySelector('.pfx-cosmos-sky');
    expect(sky).toBeTruthy();
    expect(container.querySelector('.pfx-cosmos-comet')).toBeNull();
    rerender(bar({ key: 2, from: 0.2, to: 0.5 }));
    const comet = container.querySelector('.pfx-cosmos-comet');
    expect(comet).toBeTruthy();
    // It sets off from the fill's edge, 10 + 400 × 0.5 px along the stage.
    const flight = comet?.parentElement?.parentElement as HTMLElement;
    expect(flight.style.left).toBe('210px');
    expect(container.querySelector('.pfx-cosmos-sky')).toBe(sky);
    rerender(bar({ key: 2, from: 0.2, to: 0.5 }));
    expect(container.querySelector('.pfx-cosmos-comet')).toBe(comet);
  });

  it("spins up a galaxy for a win, and keeps a webcam frame's middle clear", () => {
    const { container, rerender } = render(bar(null));
    rerender(bar(null, true));
    expect(container.querySelectorAll('.pfx-cosmos-a-out').length).toBe(24);

    const frame = render(<FrameFx skin={starway} radius={0} ring={12} win={false} />);
    frame.rerender(<FrameFx skin={starway} radius={0} ring={12} win />);
    expect(frame.container.querySelector('.pfx-cosmos-a-out')).toBeNull();
    expect(frame.container.querySelectorAll('.pfx-cosmos-gold.pfx-cosmos-a-blink').length).toBe(5);
  });
});

describe("Aftermath's effect", () => {
  const aftermath = skin('aftermath');
  const bar = (hit: { key: number; from: number; to: number } | null, win = false) => (
    <BarFxBurst skin={aftermath} hit={hit} win={win} left={10} right={410} y={60} height={40} />
  );

  it("keeps its grass, and kicks up dust and fresh grass at the fill's new edge once per hit", () => {
    const { container, rerender } = render(bar({ key: 1, from: 0.2, to: 0.5 }));
    const grass = container.querySelector('.pfx-reclaim-back');
    expect(container.querySelectorAll('.pfx-reclaim-back')).toHaveLength(13);
    expect(container.querySelector('.pfx-reclaim-a-puff')).toBeNull();
    rerender(bar({ key: 2, from: 0.2, to: 0.5 }));
    // At the fill's edge, 10 + 400 × 0.5 px along the stage.
    const sprout = container.querySelector('.pfx-reclaim-a-shoot') as HTMLElement;
    expect(sprout.style.left).toBe('210px');
    const puff = container.querySelector('.pfx-reclaim-a-puff') as HTMLElement;
    expect(puff.style.left).toBe('210px');
    expect(container.querySelector('.pfx-reclaim-back')).toBe(grass);
    rerender(bar({ key: 2, from: 0.2, to: 0.5 }));
    expect(container.querySelector('.pfx-reclaim-a-puff')).toBe(puff);
  });

  it("brings the dawn up for a win, and keeps fireflies on a webcam frame's band", () => {
    const { container, rerender } = render(bar(null));
    rerender(bar(null, true));
    expect(container.querySelector('.pfx-reclaim-a-dawn')).toBeTruthy();
    expect(container.querySelectorAll('.pfx-reclaim-a-rise')).toHaveLength(16);

    const frame = render(<FrameFx skin={aftermath} radius={0} ring={12} win={false} />);
    frame.rerender(<FrameFx skin={aftermath} radius={0} ring={12} win />);
    const flies = [...frame.container.querySelectorAll<HTMLElement>('.pfx-reclaim-a-rise')];
    expect(flies).toHaveLength(6);
    // Each rises at most a quarter of the band, so none crosses into the picture.
    for (const fly of flies) {
      expect(Math.abs(Number.parseFloat(fly.style.getPropertyValue('--up')))).toBeLessThanOrEqual(
        3,
      );
    }
  });

  it("turns a rusty cog at the bar's start, three teeth a gain, each click from the last", () => {
    const { container, rerender } = render(bar({ key: 1, from: 0.2, to: 0.5 }));
    const ratchet = () => container.querySelector<HTMLElement>('.pfx-reclaim-a-ratchet');
    expect(container.querySelector('.pfx-reclaim-cog')).toBeTruthy();
    expect(ratchet()).toBeNull();
    rerender(bar({ key: 2, from: 0.2, to: 0.5 }));
    expect(ratchet()?.style.getPropertyValue('--turn')).toBe('90deg');
    rerender(bar({ key: 3, from: 0.5, to: 0.6 }));
    expect(ratchet()?.style.getPropertyValue('--from')).toBe('90deg');
    expect(ratchet()?.style.getPropertyValue('--turn')).toBe('180deg');
  });

  it('swings a warning sign onto a hero card', () => {
    const { container } = render(<Frame skin={aftermath} radius={8} fx="hero" />);
    expect(container.querySelector('.pfx-reclaim-sign')?.textContent).toBe('!');
  });

  it("grows the grass in the preset's own colors, or in its main color without them", () => {
    const grass = (look: Skin) => {
      const { container } = render(
        <BarFxBurst skin={look} hit={null} left={10} right={410} y={60} height={40} />,
      );
      const layer = container.querySelector('[data-fx-part="burst"]') as HTMLElement;
      return ['--pfx-g1', '--pfx-g2', '--pfx-s2'].map((name) => layer.style.getPropertyValue(name));
    };
    expect(grass(aftermath)).toEqual(['#3d4721', '#4b5320', '#5f5129']);
    const data = BUILTIN_PRESETS.find((preset) => preset.id === 'aftermath');
    if (!data) throw new Error('no Aftermath preset');
    const plain = { ...data, colors: { ...data.colors, fx: undefined } };
    expect(grass(toSkin(plain))).toEqual([
      expect.stringMatching(/^hsl\(/),
      expect.stringMatching(/^hsl\(/),
      expect.stringMatching(/^hsl\(/),
    ]);
    // Three at most, each a #rrggbb color.
    const fx = (colors: string[]) =>
      presetSchema.safeParse({ ...data, colors: { ...data.colors, fx: colors } }).success;
    expect(fx(['#3d4721'])).toBe(true);
    expect(fx(['#3d4721', '#4b5320', '#5f5129', '#000000'])).toBe(false);
    expect(fx(['green'])).toBe(false);
  });
});

describe("Army's effect", () => {
  const army = skin('army');

  it('grows the grass in its own colors, with a star plate for hero cards and steady titles', () => {
    const { container } = render(
      <BarFxBurst skin={army} hit={null} left={10} right={410} y={60} height={40} />,
    );
    const layer = container.querySelector('[data-fx-part="burst"]') as HTMLElement;
    expect(
      ['--pfx-g1', '--pfx-g2', '--pfx-s2'].map((name) => layer.style.getPropertyValue(name)),
    ).toEqual(['#28301a', '#556b2f', '#8f8456']);
    const card = render(<Frame skin={army} radius={8} fx="hero" />);
    const sign = card.container.querySelector('.pfx-army-sign');
    expect(sign?.querySelector('.pfx-army-board')).toBeTruthy();
    expect(sign?.textContent).toBe('');
    // No failing-light flicker on its titles, unlike Aftermath's.
    expect(skinCss('sg', army)).not.toContain('pfx-army-title');
  });
});

describe.each(MODULES.map((module) => [module.id]))('the %s effect', (id) => {
  const preset = BUILTIN_PRESETS.find((entry) => entry.effect === id);

  it('belongs to a built-in preset and draws every part through hits, pulses and wins', () => {
    expect(preset).toBeTruthy();
    const look = skin(preset?.id ?? '');
    const scene = (key: number, win: boolean) => (
      <div style={{ position: 'relative', width: 400, height: 200 }}>
        <Frame skin={look} radius={8} pulse={key} win={win} />
        <Frame skin={look} radius={8} fx="enter" />
        <Frame skin={look} radius={8} fx="hero" />
        <Frame skin={look} radius={8} scale={0.5} pulse={key} />
        <FrameFx skin={look} radius={0} ring={12} pulse={key} win={win} />
        <BarFxTrack skin={look} hit={{ key, from: 0.1, to: 0.1 + key / 10 }} win={win} />
        <BarFxTrack skin={look} hit={{ key, from: 0.5, to: 0.5 }} />
        <BarFxBurst
          skin={look}
          hit={{ key, from: 0.1, to: 0.1 + key / 10 }}
          win={win}
          left={10}
          right={390}
          y={40}
          height={40}
        />
        <FxPulse skin={look} pulse={key} win={win} />
        <FxPulse skin={look} enter round />
      </div>
    );
    const { container, rerender } = render(scene(1, false));
    for (const [key, win] of [
      [2, false],
      [3, true],
      [4, true],
      [5, false],
      [6, true],
    ] as const) {
      rerender(scene(key, win));
    }
    expect(container.querySelectorAll(`[data-fx="${id}"]`).length).toBeGreaterThanOrEqual(9);
  });
});
