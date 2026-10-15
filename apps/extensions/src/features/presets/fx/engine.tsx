import { type CSSProperties, useId, useMemo, useState } from 'react';
import type { Skin } from '../skin';
import { BASE_CSS, seedOf } from './primitives';
import { fxModule } from './registry';
import type { EffectModule, FrameFxMode, FxHit } from './types';

export { fxModule };

const VARS = new WeakMap<Skin, CSSProperties>();

/** The custom properties an effect's CSS reads, made once per skin. */
export function fxVars(skin: Skin, module: EffectModule): CSSProperties {
  let vars = VARS.get(skin);
  if (!vars) {
    vars = module.vars(skin) as CSSProperties;
    VARS.set(skin, vars);
  }
  return vars;
}

/** The shared rules and the effect's own. React hoists each into <head> once, by its href. */
function FxStyles({ module }: { module: EffectModule }) {
  return (
    <>
      <style href="pfx-base" precedence="pfx">
        {BASE_CSS}
      </style>
      <style href={`pfx-${module.id}`} precedence="pfx">
        {module.css}
      </style>
    </>
  );
}

/**
 * How many times `value` changed to something other than null, undefined or false. The value it
 * mounts with doesn't count, so an overlay that loads mid-goal doesn't celebrate. Give it a key or
 * a primitive: an object made during render is new every time.
 */
export function useChangeCount(value: unknown): number {
  const [seen, setSeen] = useState(value);
  const [count, setCount] = useState(0);
  if (!Object.is(seen, value)) {
    setSeen(value);
    if (value !== null && value !== undefined && value !== false) {
      setCount(count + 1);
      return count + 1;
    }
  }
  return count;
}

/**
 * How many times a number went up since mount: a `pulse` that ignores it going down, e.g. a task
 * ticked off but not one unticked.
 */
export function useRises(value: number): number {
  const [state, setState] = useState({ value, rises: 0 });
  if (value !== state.value) {
    const next = { value, rises: state.rises + (value > state.value ? 1 : 0) };
    setState(next);
    return next.rises;
  }
  return state.rises;
}

/**
 * The latest hit as it was when its key came in, and how many came in since mount. Kept, so a
 * poll's strike stays where it landed while the other options' shares move on.
 */
function useHits(hit: FxHit | null): [FxHit | null, number] {
  const [state, setState] = useState(() => ({
    key: hit?.key as unknown,
    hit: null as FxHit | null,
    count: 0,
  }));
  if (hit && !Object.is(state.key, hit.key)) {
    const next = { key: hit.key, hit, count: state.count + 1 };
    setState(next);
    return [next.hit, next.count];
  }
  return [state.hit, state.count];
}

/** A 0 to 1 number fixed for this element. */
function useSeed(): number {
  const id = useId();
  return useMemo(() => seedOf(id), [id]);
}

/**
 * A panel's effect, drawn by Frame over the panel: as it comes in, now and then while idle, and
 * when `pulse` changes or `win` turns on. Nothing for a skin without an effect.
 */
export function FrameFx({
  skin,
  radius,
  scale = 1,
  mode = 'full',
  pulse,
  win,
  ring,
}: {
  skin: Skin;
  radius: number;
  scale?: number;
  mode?: Exclude<FrameFxMode, 'off'>;
  pulse?: unknown;
  win?: unknown;
  ring?: number;
}) {
  const seed = useSeed();
  const pulses = useChangeCount(pulse ?? null);
  const wins = useChangeCount(win ?? null);
  const module = fxModule(skin);
  if (!module) return null;
  const { Panel } = module;
  return (
    <span
      aria-hidden="true"
      className="pfx"
      data-fx={module.id}
      data-fx-part="panel"
      style={{ ...fxVars(skin, module), inset: 0, borderRadius: radius }}
    >
      <FxStyles module={module} />
      <Panel
        skin={skin}
        seed={seed}
        mode={mode}
        radius={radius}
        scale={scale}
        pulse={pulses}
        win={wins}
        ring={ring}
      />
    </span>
  );
}

/**
 * A bar's effect as it grows, inside its track: after the fill, before the ticks. `hit` is the
 * bar's latest gain; `win` turns on when the goal is reached.
 */
export function BarFxTrack({
  skin,
  hit,
  win,
}: {
  skin: Skin | null;
  hit: FxHit | null;
  win?: unknown;
}) {
  const seed = useSeed();
  const [last, hits] = useHits(hit);
  const wins = useChangeCount(win ?? null);
  const module = skin ? fxModule(skin) : null;
  if (!skin || !module) return null;
  const { Track } = module;
  return (
    <span
      aria-hidden="true"
      className="pfx"
      data-fx={module.id}
      data-fx-part="track"
      style={{ ...fxVars(skin, module), inset: 0 }}
    >
      <FxStyles module={module} />
      <Track skin={skin} seed={seed} hit={last} hits={hits} win={wins} />
    </span>
  );
}

/**
 * The particles a growing bar throws, drawn on the stage so they can leave it: a tactical
 * preset clips the bar's box, and the box is slanted. The bar spans `left` to `right` px, centered
 * on `y`.
 */
export function BarFxBurst({
  skin,
  hit,
  win,
  left,
  right,
  y,
  height,
}: {
  skin: Skin | null;
  hit: FxHit | null;
  win?: unknown;
  left: number;
  right: number;
  y: number;
  height: number;
}) {
  const seed = useSeed();
  const [last, hits] = useHits(hit);
  const wins = useChangeCount(win ?? null);
  const module = skin ? fxModule(skin) : null;
  if (!skin || !module?.Burst) return null;
  const { Burst } = module;
  return (
    <span
      aria-hidden="true"
      className="pfx"
      data-fx={module.id}
      data-fx-part="burst"
      style={{ ...fxVars(skin, module), inset: 0 }}
    >
      <FxStyles module={module} />
      <Burst
        skin={skin}
        seed={seed}
        hit={last}
        hits={hits}
        win={wins}
        left={left}
        right={right}
        y={y}
        height={height}
      />
    </span>
  );
}

/**
 * The effect over a number when it goes up (`pulse` changes) or wins, or once as it mounts with
 * `enter`. Its parent must be positioned.
 */
export function FxPulse({
  skin,
  pulse,
  win,
  enter = false,
  round = false,
}: {
  skin: Skin | null;
  pulse?: unknown;
  win?: unknown;
  enter?: boolean;
  round?: boolean;
}) {
  const seed = useSeed();
  const pulses = useChangeCount(pulse ?? null);
  const wins = useChangeCount(win ?? null);
  const module = skin ? fxModule(skin) : null;
  if (!skin || !module) return null;
  const { Pulse } = module;
  return (
    <span
      aria-hidden="true"
      className="pfx"
      data-fx={module.id}
      data-fx-part="pulse"
      style={{ ...fxVars(skin, module), inset: 0, borderRadius: round ? '50%' : undefined }}
    >
      <FxStyles module={module} />
      <Pulse skin={skin} seed={seed} pulse={pulses} win={wins} enter={enter} round={round} />
    </span>
  );
}
