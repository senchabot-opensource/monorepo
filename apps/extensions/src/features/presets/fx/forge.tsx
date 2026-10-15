import { type CSSProperties, Fragment, useMemo } from 'react';
import { between, motionOk, rng, type SparkSpec, Sparks, seedOf, throwSparks } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Forge: Banner's handmade iron. What a bar gains comes out of the fire white-hot, takes three
// hammer strikes that throw sparks, and cools through orange into the bar's own color. Panels
// come in glowing from the forge, and now and then catch a torch's flicker and a rising ember.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 10_000;
/** When the hammer lands, in ms after a gain. */
const STRIKES = [0, 320, 640];

const css = `.pfx-forge-spark{background:linear-gradient(90deg,#fffdf2,#ffe08a 40%,#ff8a24);border-radius:2px;box-shadow:0 0 6px 1px rgba(255,150,40,.95)}
.pfx-forge-hot,.pfx-forge-heat,.pfx-forge-scale{position:absolute;top:0;bottom:0;opacity:0}
.pfx-forge-hot{background:linear-gradient(180deg,#fffef4,#fff1b8 45%,#ffc860)}
.pfx-forge-heat{background:linear-gradient(180deg,#ffd98a,#ff8a2a 40%,#c63c16)}
.pfx-forge-scale{background:radial-gradient(circle at 30% 40%,rgba(40,8,0,.42) 0 2px,transparent 3.5px) 0 0/13px 11px,radial-gradient(circle at 70% 75%,rgba(40,8,0,.32) 0 1.5px,transparent 3px) 5px 3px/9px 14px,radial-gradient(circle at 50% 50%,rgba(255,230,190,.2) 0 1px,transparent 2px) 2px 6px/7px 9px}
.pfx-forge-edge{position:absolute;top:0;bottom:0;width:12px;margin-left:-6px;opacity:0;background:linear-gradient(90deg,rgba(255,200,90,0),#fffbe8 40%,#fff 50%,#ffe08a 60%,rgba(255,170,60,0));box-shadow:0 0 14px 4px rgba(255,150,40,.85)}
.pfx-forge-rim{position:absolute;inset:0;border-radius:inherit;opacity:0;border:2px solid #fff1c2;box-shadow:inset 0 0 8px rgba(255,200,100,.9),0 0 10px rgba(255,140,40,.7)}
.pfx-forge-glow{position:absolute;inset:0;border-radius:inherit;opacity:0;box-shadow:inset 0 0 18px 3px rgba(255,110,30,.8)}
.pfx-forge-torch{position:absolute;inset:0;border-radius:inherit;opacity:0;box-shadow:inset 0 0 16px 2px rgba(255,150,50,.5)}
.pfx-forge-ember{position:absolute;bottom:0;opacity:0;border-radius:50%;background:radial-gradient(circle,#fff0c0,#ff8a2a 45%,rgba(255,90,20,0) 70%)}
.pfx-forge-under{position:absolute;left:0;right:0;bottom:0;height:2px;opacity:0;background:linear-gradient(90deg,rgba(255,140,40,0),#ffd27a 30%,#ff6a1f 70%,rgba(255,90,20,0))}
.pfx-forge-spot{position:absolute;inset:-25%;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,248,220,.85),rgba(255,170,60,.45) 50%,rgba(255,120,30,0))}
${motionOk(`@keyframes pfx-forge-fade{0%{opacity:1}100%{opacity:0}}
@keyframes pfx-forge-cool{0%{opacity:0}12%{opacity:.95}35%{opacity:.85}100%{opacity:0}}
@keyframes pfx-forge-scale{0%,25%{opacity:0}55%{opacity:.7}100%{opacity:0}}
@keyframes pfx-forge-strike{0%{opacity:1}9%{opacity:.15}24.6%{opacity:1}33%{opacity:.15}49.2%{opacity:1}58%{opacity:.2}100%{opacity:0}}
@keyframes pfx-forge-torch{0%,58%{opacity:0}61%{opacity:.75}63%{opacity:.35}66%{opacity:.85}69%{opacity:.4}72%{opacity:.7}76%{opacity:.3}84%,100%{opacity:0}}
@keyframes pfx-forge-rise{0%,60%{opacity:0;transform:none}63%{opacity:1}88%{opacity:.8}96%,100%{opacity:0;transform:translate(var(--dx),var(--up))}}
.pfx-forge-a-fade{animation:pfx-forge-fade var(--t,.45s) ease-out var(--d,0s) backwards}
.pfx-forge-a-cool{animation:pfx-forge-cool var(--t,1.4s) ease-in var(--d,0s) backwards}
.pfx-forge-a-scale{animation:pfx-forge-scale var(--t,2s) ease-out var(--d,0s) backwards}
.pfx-forge-a-strike{animation:pfx-forge-strike 1.3s linear var(--d,0s) backwards}
.pfx-forge-a-torch{animation:pfx-forge-torch ${IDLE_MS}ms linear var(--sync,0s) infinite}
.pfx-forge-a-rise{animation:pfx-forge-rise ${IDLE_MS}ms linear var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;

/** What a hit heats: its new segment, or a short stretch at the edge when nothing grew. */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 6px)`, width: 12 };
}

/** Sparks falling from a panel's top edge, for a win or a card that comes in big. */
function rain(next: () => number, count: number, size: number, firstId = 0): SparkSpec[] {
  return Array.from({ length: count }, (_, index) =>
    throwSparks(
      next,
      {
        count: 1,
        x: pct(between(next, 0.04, 0.96)),
        y: '0%',
        spread: 14 * size,
        rise: [4 * size, 20 * size],
        fall: [30 * size, 90 * size],
        ms: [700, 1150],
        jitter: 650,
        size,
      },
      firstId + index,
    ),
  ).flat();
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const [enter, ember] = useMemo(() => {
    const next = rng(seed);
    const right = next() < 0.5;
    const sparks = big
      ? rain(next, 22, size)
      : // One corner throws a few sparks as the panel comes out of the fire.
        throwSparks(next, {
          count: scale < 0.8 ? 3 : 5,
          x: right ? '100%' : '0%',
          y: '0%',
          spread: 40 * size,
          side: right ? 1 : -1,
          rise: [12 * size, 40 * size],
          fall: [20 * size, 60 * size],
          ms: [500, 820],
          jitter: 140,
          size,
        });
    return [sparks, { x: between(next, 0.12, 0.88), dx: between(next, -10, 10) }];
  }, [seed, big, scale, size]);
  const struck = useMemo(() => {
    const next = rng(seedOf(`${seed}:${pulse}`));
    return throwSparks(next, {
      count: 4,
      x: pct(between(next, 0.2, 0.8)),
      y: '0%',
      spread: 34 * size,
      rise: [10 * size, 34 * size],
      fall: [10 * size, 40 * size],
      ms: [480, 760],
      jitter: 60,
      size,
    });
  }, [seed, pulse, size]);
  const shower = useMemo(() => rain(rng(seedOf(`${seed}:w${win}`)), 24, size), [seed, win, size]);
  // A frame around a webcam keeps its glow inside its band, off the picture.
  const glow = ring
    ? { boxShadow: `inset 0 0 ${Math.round(ring)}px ${Math.round(ring / 4)}px rgba(255,110,30,.8)` }
    : undefined;
  return (
    <>
      <span
        className="pfx-forge-glow pfx-forge-a-cool"
        style={{ ...glow, '--t': big ? '2.2s' : '1.6s' } as Vars}
      />
      <span
        className="pfx-forge-rim pfx-forge-a-fade"
        style={{ '--t': big ? '.6s' : '.35s' } as Vars}
      />
      <Sparks sparks={enter} className="pfx-forge-spark" />
      {mode === 'full' && (
        <span
          className="pfx"
          style={
            {
              inset: 0,
              borderRadius: 'inherit',
              '--sync': `${-Math.round(seed * IDLE_MS)}ms`,
            } as Vars
          }
        >
          <span className="pfx-forge-torch pfx-forge-a-torch" style={glow} />
          {!ring && (
            <span
              className="pfx-forge-ember pfx-forge-a-rise"
              style={
                {
                  left: pct(ember.x),
                  width: Math.round(5 * size),
                  height: Math.round(5 * size),
                  '--dx': `${Math.round(ember.dx * size)}px`,
                  '--up': `${-Math.round(42 * size)}px`,
                } as Vars
              }
            />
          )}
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span className="pfx-forge-rim pfx-forge-a-fade" style={{ '--t': '.3s' } as Vars} />
          <Sparks sparks={struck} className="pfx-forge-spark" />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-forge-glow pfx-forge-a-cool"
            style={{ ...glow, '--t': '1.8s' } as Vars}
          />
          <Sparks sparks={shower} className="pfx-forge-spark" />
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  const whole = { left: 0, right: 0 };
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span className="pfx-forge-heat pfx-forge-a-cool" style={segment(hit)} />
          <span className="pfx-forge-hot pfx-forge-a-fade" style={segment(hit)} />
          <span className="pfx-forge-scale pfx-forge-a-scale" style={segment(hit)} />
          <span className="pfx-forge-edge pfx-forge-a-strike" style={{ left: pct(hit.to) }} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-forge-heat pfx-forge-a-cool"
            style={{ ...whole, '--t': '1.9s' } as Vars}
          />
          <span
            className="pfx-forge-hot pfx-forge-a-fade"
            style={{ ...whole, '--t': '.6s' } as Vars}
          />
          <span
            className="pfx-forge-scale pfx-forge-a-scale"
            style={{ ...whole, '--t': '2.6s' } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

function Burst({ seed, hit, hits, win, left, right, y }: BurstFxProps) {
  const struck = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    const x = left + (right - left) * hit.to;
    // Three strikes of the hammer, each throwing its own handful.
    return STRIKES.flatMap((delay, strike) =>
      throwSparks(
        next,
        {
          count: 6,
          x,
          y,
          spread: 96,
          rise: [36, 104],
          fall: [10, 60],
          ms: [560, 960],
          delay,
          jitter: 50,
          size: 1.5,
        },
        strike * 6,
      ),
    );
  }, [seed, hit, left, right, y]);
  const shower = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return Array.from({ length: 6 }, (_, index) =>
      throwSparks(
        next,
        {
          count: 6,
          x: left + (right - left) * ((index + 0.5) / 6),
          y,
          spread: 70,
          rise: [40, 120],
          fall: [10, 60],
          ms: [640, 1050],
          delay: index * 60,
          jitter: 260,
          size: 1.4,
        },
        index * 6,
      ),
    ).flat();
  }, [seed, win, left, right, y]);
  return (
    <>
      {hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Sparks sparks={struck} className="pfx-forge-spark" />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Sparks sparks={shower} className="pfx-forge-spark" />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter }: PulseFxProps) {
  const struck = useMemo(
    () =>
      throwSparks(rng(seedOf(`${seed}:${pulse}`)), {
        count: 4,
        x: '50%',
        y: '45%',
        spread: 34,
        rise: [14, 40],
        fall: [6, 30],
        ms: [480, 760],
        jitter: 80,
      }),
    [seed, pulse],
  );
  const shower = useMemo(
    () =>
      throwSparks(rng(seedOf(`${seed}:w${win}`)), {
        count: 9,
        x: '50%',
        y: '40%',
        spread: 60,
        rise: [24, 64],
        fall: [8, 40],
        ms: [600, 950],
        jitter: 300,
      }),
    [seed, win],
  );
  const flicked = useMemo(
    () =>
      throwSparks(rng(seed), {
        count: 2,
        x: '0%',
        y: '100%',
        spread: 26,
        side: 1,
        rise: [6, 18],
        fall: [4, 16],
        ms: [380, 600],
        jitter: 60,
        size: 0.7,
      }),
    [seed],
  );
  return (
    <>
      {enter && (
        // A chat line comes in with an ember underline that cools.
        <>
          <span className="pfx-forge-under pfx-forge-a-cool" style={{ '--t': '1.2s' } as Vars} />
          <Sparks sparks={flicked} className="pfx-forge-spark" />
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span className="pfx-forge-spot pfx-forge-a-fade" style={{ '--t': '.9s' } as Vars} />
          <Sparks sparks={struck} className="pfx-forge-spark" />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span className="pfx-forge-spot pfx-forge-a-fade" style={{ '--t': '1.6s' } as Vars} />
          <Sparks sparks={shower} className="pfx-forge-spark" />
        </Fragment>
      )}
    </>
  );
}

export const forge: EffectModule = {
  id: 'forge',
  css,
  // Fire is fire: white-hot, orange and iron whatever the preset's colors.
  vars: () => ({}),
  Panel,
  Track,
  Burst,
  Pulse,
};
