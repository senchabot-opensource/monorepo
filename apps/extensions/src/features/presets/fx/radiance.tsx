import { type CSSProperties, Fragment, useMemo } from 'react';
import { rgba } from '../color';
import type { Skin } from '../skin';
import { between, motionOk, rng, seedOf } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Radiance: Realm's holy light. What a bar gains glows golden-white, and a shaft of light rises
// from its edge with stars drifting up it. Panels come in on a warm glow from below, like a prize
// just found, and now and then a star twinkles on their crown; a win raises a pillar of light
// with soft rays turning slowly behind it.

/** The idle loop; each panel plays it at its own moment. */
const IDLE_MS = 10_000;

const css = `.pfx-radiance-glow{position:absolute;top:0;bottom:0;opacity:0;background:linear-gradient(180deg,rgba(255,254,244,.95),rgba(255,242,196,.85) 40%,var(--pfx-g5))}
.pfx-radiance-edge{position:absolute;top:0;bottom:0;width:4px;margin-left:-2px;opacity:0;background:#fffdf2;box-shadow:0 0 10px 3px var(--pfx-g7)}
.pfx-radiance-shaft{position:absolute;opacity:0;transform-origin:50% 100%;background:radial-gradient(20% 100% at 50% 100%,rgba(255,255,248,.95),rgba(255,250,225,.55) 50%,rgba(255,250,225,0)),radial-gradient(50% 95% at 50% 100%,var(--pfx-g5),var(--pfx-g2) 55%,var(--pfx-g0))}
.pfx-radiance-star{position:absolute;width:var(--s,14px);height:var(--s,14px);margin:calc(var(--s,14px)*-.5) 0 0 calc(var(--s,14px)*-.5);opacity:0;background:radial-gradient(closest-side,var(--pfx-g5),var(--pfx-g0))}
.pfx-radiance-star::before{content:'';position:absolute;inset:0;clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);background:radial-gradient(closest-side,#fff 35%,#fff2bf 65%,var(--pfx-g))}
.pfx-radiance-rise{position:absolute;inset:0;opacity:0;border-radius:inherit;transform-origin:50% 100%;background:linear-gradient(0deg,var(--pfx-g5),var(--pfx-a3) 22%,var(--pfx-g2) 40%,var(--pfx-g0) 80%)}
.pfx-radiance-flare{position:absolute;left:0;right:0;bottom:0;height:var(--h,10px);opacity:0;background:linear-gradient(90deg,var(--pfx-g0),#fffaf0 50%,var(--pfx-g0)) 50% 100%/100% var(--w,2px) no-repeat,radial-gradient(50% 100% at 50% 100%,var(--pfx-g5),var(--pfx-g0))}
.pfx-radiance-rim{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 16px 2px var(--pfx-g5)}
.pfx-radiance-rays{position:absolute;width:0;height:0;opacity:0}
.pfx-radiance-ray{position:absolute;left:0;top:0;height:var(--w,14px);margin-top:calc(var(--w,14px)*-.5);border-radius:50%;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,250,228,.55),var(--pfx-g3) 45%,var(--pfx-g0))}
.pfx-radiance-spot{position:absolute;inset:-20%;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(255,250,228,.5),var(--pfx-g3) 50%,var(--pfx-g0))}
.pfx-radiance-under{position:absolute;left:0;bottom:0;width:min(55%,200px);height:8px;opacity:0;transform-origin:0 100%;background:linear-gradient(90deg,#fffaf0,var(--pfx-g) 35%,var(--pfx-g0)) 0 100%/100% 2px no-repeat,radial-gradient(100% 100% at 0 100%,var(--pfx-g5),var(--pfx-g0))}
${motionOk(`@keyframes pfx-radiance-glow{0%{opacity:0}14%{opacity:1}100%{opacity:0}}
@keyframes pfx-radiance-shaft{0%{opacity:0;transform:scaleY(0)}14%{opacity:1}42%{transform:scaleY(1)}70%{opacity:.85}100%{opacity:0;transform:scaleY(1.04)}}
@keyframes pfx-radiance-float{0%{opacity:0;transform:translate(0,0) rotate(0deg) scale(.2)}20%{opacity:1;transform:translate(calc(var(--dx,0px)*.2),calc(var(--up,0px)*.2)) rotate(25deg) scale(1)}45%{transform:translate(calc(var(--dx,0px)*.45),calc(var(--up,0px)*.45)) rotate(45deg) scale(.55)}70%{opacity:1;transform:translate(calc(var(--dx,0px)*.7),calc(var(--up,0px)*.7)) rotate(70deg) scale(1)}100%{opacity:0;transform:translate(var(--dx,0px),var(--up,0px)) rotate(100deg) scale(.3)}}
@keyframes pfx-radiance-pop{0%{opacity:0;transform:translate(0,0) rotate(-30deg) scale(.1)}35%{opacity:1;transform:translate(calc(var(--dx,0px)*.7),calc(var(--up,0px)*.7)) rotate(10deg) scale(1.1)}100%{opacity:0;transform:translate(var(--dx,0px),var(--up,0px)) rotate(50deg) scale(.2)}}
@keyframes pfx-radiance-rise{0%{opacity:0;transform:scaleY(.1)}22%{opacity:1}55%{transform:scaleY(1)}100%{opacity:0;transform:scaleY(1)}}
@keyframes pfx-radiance-flare{0%{opacity:0;transform:scaleX(.3)}20%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-radiance-turn{0%{opacity:0;transform:rotate(-6deg) scale(.7)}25%{opacity:1}100%{opacity:0;transform:rotate(7deg) scale(1)}}
@keyframes pfx-radiance-under{0%{opacity:1;transform:scaleX(0)}45%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
@keyframes pfx-radiance-idle{0%,93%{opacity:0;transform:rotate(-30deg) scale(0)}96%{opacity:1;transform:rotate(0deg) scale(1)}99%,100%{opacity:0;transform:rotate(30deg) scale(0)}}
.pfx-radiance-a-glow{animation:pfx-radiance-glow var(--t,1.1s) ease-out var(--d,0s) backwards}
.pfx-radiance-a-shaft{animation:pfx-radiance-shaft var(--t,1.2s) ease-out var(--d,0s) backwards}
.pfx-radiance-a-float{animation:pfx-radiance-float var(--t,1.2s) ease-in-out var(--d,0s) backwards}
.pfx-radiance-a-pop{animation:pfx-radiance-pop var(--t,.7s) ease-out var(--d,0s) backwards}
.pfx-radiance-a-rise{animation:pfx-radiance-rise var(--t,1.3s) ease-out var(--d,0s) backwards}
.pfx-radiance-a-flare{animation:pfx-radiance-flare var(--t,.9s) ease-out var(--d,0s) backwards}
.pfx-radiance-a-turn{animation:pfx-radiance-turn var(--t,1.8s) linear var(--d,0s) backwards}
.pfx-radiance-a-under{animation:pfx-radiance-under var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-radiance-a-idle{animation:pfx-radiance-idle ${IDLE_MS}ms ease-in-out var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 10) / 10}px`;
const ms = (value: number) => `${Math.round(value)}ms`;

/** What a hit lights: its new segment, or a sliver at the edge when nothing grew (a poll vote). */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 5px)`, width: 10 };
}

interface Star {
  id: number;
  x: number | string;
  y: number | string;
  dx: number;
  up: number;
  size: number;
  t: number;
  d: number;
}

interface StarFlight {
  count: number;
  /** Where each one starts: px, or a percentage of the layer it's drawn in. */
  from: (next: () => number) => [number | string, number | string];
  /** How high it floats, in px, as a range. */
  rise: [number, number];
  /** Sideways drift, from -drift to +drift px. */
  drift: number;
  size: [number, number];
  ms: [number, number];
  delay?: number;
  /** Extra random delay, up to this many ms. */
  jitter?: number;
}

/** Four-point stars drifting up, the same every time for the same generator. */
function stars(next: () => number, flight: StarFlight): Star[] {
  return Array.from({ length: flight.count }, (_, id) => {
    const [x, y] = flight.from(next);
    return {
      id,
      x,
      y,
      dx: between(next, -flight.drift, flight.drift),
      up: -between(next, flight.rise[0], flight.rise[1]),
      size: between(next, flight.size[0], flight.size[1]),
      t: between(next, flight.ms[0], flight.ms[1]),
      d: (flight.delay ?? 0) + between(next, 0, flight.jitter ?? 0),
    };
  });
}

/** Stars bursting out of one point in every direction, `reach` px away. */
function sparkle(
  next: () => number,
  count: number,
  reach: [number, number],
  size: [number, number],
  jitter: number,
): Star[] {
  const turn = next() * Math.PI * 2;
  return Array.from({ length: count }, (_, id) => {
    const angle = turn + (id / count) * Math.PI * 2 + between(next, -0.3, 0.3);
    const distance = between(next, reach[0], reach[1]);
    return {
      id,
      x: '50%',
      y: '50%',
      dx: Math.cos(angle) * distance,
      up: Math.sin(angle) * distance,
      size: between(next, size[0], size[1]),
      t: between(next, 600, 850),
      d: between(next, 0, jitter),
    };
  });
}

function Stars({ list, pop }: { list: readonly Star[]; pop?: boolean }) {
  return list.map((star) => (
    <span
      key={star.id}
      className={`pfx-radiance-star ${pop ? 'pfx-radiance-a-pop' : 'pfx-radiance-a-float'}`}
      style={
        {
          left: star.x,
          top: star.y,
          '--s': px(star.size),
          '--dx': px(star.dx),
          '--up': px(star.up),
          '--t': ms(star.t),
          '--d': ms(star.d),
        } as Vars
      }
    />
  ));
}

interface Ray {
  id: number;
  angle: number;
  length: number;
  width: number;
}

/** Soft rays fanned from `from` to `to` degrees (0 points right, -90 up). */
function fan(
  next: () => number,
  count: number,
  from: number,
  to: number,
  length: [number, number],
  width: [number, number],
): Ray[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    angle: from + ((to - from) * id) / Math.max(1, count - 1) + between(next, -4, 4),
    length: between(next, length[0], length[1]),
    width: between(next, width[0], width[1]),
  }));
}

/** The rays turn a few degrees together, round the point they start from, as they fade. */
function Rays({
  list,
  x,
  y,
  t,
}: {
  list: readonly Ray[];
  x: number | string;
  y: number | string;
  t: string;
}) {
  return (
    <span
      className="pfx-radiance-rays pfx-radiance-a-turn"
      style={{ left: x, top: y, '--t': t } as Vars}
    >
      {list.map((ray) => (
        <span
          key={ray.id}
          className="pfx-radiance-ray"
          style={
            {
              width: Math.round(ray.length),
              transform: `rotate(${Math.round(ray.angle)}deg)`,
              '--w': px(ray.width),
            } as Vars
          }
        />
      ))}
    </span>
  );
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const band = ring ? Math.round(ring) : 0;
  const arrival = useMemo(
    () =>
      // Stars drift up off the bottom edge as it comes in: a couple, or a shower for a card.
      stars(rng(seed), {
        count: band ? 0 : big ? 8 : scale < 0.8 ? 0 : 2,
        from: (next) => [pct(between(next, 0.1, 0.9)), '100%'],
        rise: [24 * size, (big ? 80 : 46) * size],
        drift: 14 * size,
        size: [10 * size, 15 * size],
        ms: [1000, 1500],
        delay: 250,
        jitter: big ? 800 : 300,
      }),
    [seed, band, big, scale, size],
  );
  const glints = useMemo(
    () =>
      // A gain: three stars pop along the top edge, or inside a frame's top band.
      stars(rng(seedOf(`${seed}:${pulse}`)), {
        count: 3,
        from: (next) => [pct(between(next, 0.15, 0.85)), band ? band / 2 : 0],
        rise: band ? [0, 0] : [4 * size, 14 * size],
        drift: band ? 0 : 6 * size,
        size: band ? [band * 0.8, band] : [12 * size, 17 * size],
        ms: [600, 850],
        jitter: 220,
      }),
    [seed, pulse, band, size],
  );
  const [crown, rays] = useMemo((): [Star[], Ray[]] => {
    const next = rng(seedOf(`${seed}:w${win}`));
    if (band) {
      // Around a webcam the stars keep to the frame's top and bottom bands.
      return [
        stars(next, {
          count: 6,
          from: (n) => [
            pct(between(n, 0.08, 0.92)),
            n() < 0.5 ? band / 2 : `calc(100% - ${px(band / 2)})`,
          ],
          rise: [0, 0],
          drift: 0,
          size: [band * 0.8, band],
          ms: [650, 900],
          jitter: 900,
        }),
        [],
      ];
    }
    return [
      stars(next, {
        count: 5,
        from: (n) => [pct(between(n, 0.2, 0.8)), pct(between(n, 0.15, 0.85))],
        rise: [0, 12 * size],
        drift: 8 * size,
        size: [14 * size, 20 * size],
        ms: [650, 900],
        delay: 250,
        jitter: 900,
      }),
      fan(next, 10, 0, 324, [90 * size, 150 * size], [12 * size, 20 * size]),
    ];
  }, [seed, win, band, size]);
  const rim = band
    ? { boxShadow: `inset 0 0 ${Math.round(band * 0.8)}px var(--pfx-g5)` }
    : undefined;
  const flare = {
    '--h': px(Math.min(10 * size, band || 99)),
    '--w': px(Math.max(1, Math.round(2 * size))),
  };
  return (
    <>
      {/* A warm glow rises from the bottom edge and fades; around a webcam, only in its band. */}
      <span
        className="pfx-radiance-rise pfx-radiance-a-rise"
        style={
          { ...(band ? { top: 'auto', height: band } : {}), '--t': big ? '1.8s' : '1.3s' } as Vars
        }
      />
      <span
        className="pfx-radiance-flare pfx-radiance-a-flare"
        style={{ ...flare, '--t': big ? '1.2s' : '.9s' } as Vars}
      />
      <Stars list={arrival} />
      {big && (
        <span
          className="pfx-radiance-star pfx-radiance-a-pop"
          style={
            {
              left: '50%',
              top: band ? band / 2 : 0,
              '--s': px(band ? band : 26 * size),
              '--t': '.9s',
              '--d': '.7s',
            } as Vars
          }
        />
      )}
      {mode === 'full' && (
        // Now and then a star twinkles at the top center, on the frame's crown.
        <span
          className="pfx-radiance-star pfx-radiance-a-idle"
          style={
            {
              left: '50%',
              top: band ? band / 2 : 0,
              '--s': px(band ? Math.min(18 * size, band * 1.2) : 18 * size),
              '--sync': ms(-seed * IDLE_MS),
            } as Vars
          }
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-radiance-rim pfx-radiance-a-glow"
            style={{ ...rim, '--t': '.8s' } as Vars}
          />
          <Stars list={glints} pop />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-radiance-rim pfx-radiance-a-glow"
            style={{ ...rim, '--t': '1.8s' } as Vars}
          />
          {!band && (
            <>
              <Rays list={rays} x="50%" y="50%" t="1.9s" />
              <span
                className="pfx-radiance-shaft pfx-radiance-a-shaft"
                style={
                  {
                    left: '50%',
                    width: Math.round(80 * size),
                    marginLeft: -Math.round(40 * size),
                    top: '-35%',
                    bottom: 0,
                    '--t': '1.9s',
                  } as Vars
                }
              />
            </>
          )}
          <Stars list={crown} pop />
        </Fragment>
      )}
    </>
  );
}

function Track({ seed, hit, hits, win }: TrackFxProps) {
  const twinkle = useMemo(() => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return stars(next, {
      count: 4,
      from: (n) => [pct(between(n, 0.08, 0.92)), pct(between(n, 0.3, 0.7))],
      rise: [0, 0],
      drift: 0,
      size: [14, 18],
      ms: [650, 900],
      delay: 200,
      jitter: 900,
    });
  }, [seed, win]);
  // A poll's vote strikes the edge every half second or so: its glow is a quick flash.
  const thin = hit ? Math.abs(hit.to - hit.from) <= 0.004 : false;
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span
            className="pfx-radiance-glow pfx-radiance-a-glow"
            style={{ ...segment(hit), '--t': thin ? '.6s' : '1.1s' } as Vars}
          />
          <span
            className="pfx-radiance-edge pfx-radiance-a-glow"
            style={{ left: pct(hit.to), '--t': thin ? '.5s' : '.8s' } as Vars}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-radiance-glow pfx-radiance-a-glow"
            style={{ left: 0, right: 0, '--t': '1.8s' } as Vars}
          />
          <Stars list={twinkle} pop />
        </Fragment>
      )}
    </>
  );
}

function Burst({ seed, hit, hits, win, left, right, y, height }: BurstFxProps) {
  const x = left + (right - left) * (hit?.to ?? 0);
  const center = (left + right) / 2;
  // Light rises from the bar's bottom edge, so it washes over the bar as it goes up.
  const floor = y + height / 2;
  const rising = useMemo(() => {
    if (!hit) return [];
    const next = rng(seedOf(`${seed}:${hit.key}`));
    return stars(next, {
      count: 5,
      from: (n) => [x + between(n, -10, 10), y + between(n, -height / 2, height / 4)],
      rise: [36, 100],
      drift: 16,
      size: [12, 17],
      ms: [900, 1400],
      delay: 120,
      jitter: 420,
    });
  }, [seed, hit, x, y, height]);
  const [crown, rays] = useMemo((): [Star[], Ray[]] => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return [
      stars(next, {
        count: 6,
        from: (n) => [center + between(n, -70, 70), y + between(n, -height / 2, 0)],
        rise: [50, 140],
        drift: 30,
        size: [14, 20],
        ms: [1100, 1700],
        delay: 200,
        jitter: 700,
      }),
      // Rays fan over the bar only: below it the stage soon ends.
      fan(next, 8, -168, -12, [160, 240], [14, 24]),
    ];
  }, [seed, win, center, y, height]);
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span
            className="pfx-radiance-shaft pfx-radiance-a-shaft"
            style={{ left: x - 13, width: 26, top: floor - 128, height: 128 }}
          />
          <Stars list={rising} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Rays list={rays} x={center} y={y} t="2s" />
          <span
            className="pfx-radiance-shaft pfx-radiance-a-shaft"
            style={
              { left: center - 48, width: 96, top: floor - 230, height: 230, '--t': '1.9s' } as Vars
            }
          />
          <Stars list={crown} />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ seed, pulse, win, enter, round }: PulseFxProps) {
  const burst = useMemo(
    () => sparkle(rng(seedOf(`${seed}:${pulse}`)), 5, round ? [12, 20] : [18, 32], [11, 15], 140),
    [seed, pulse, round],
  );
  const [crown, rays] = useMemo((): [Star[], Ray[]] => {
    const next = rng(seedOf(`${seed}:w${win}`));
    return [
      sparkle(next, 6, round ? [14, 26] : [26, 48], [13, 18], 500),
      fan(next, 8, 0, 315, round ? [40, 60] : [60, 100], [10, 16]),
    ];
  }, [seed, win, round]);
  return (
    <>
      {enter && (
        // A chat line comes in with a short golden underline, a star where it ends.
        <>
          <span className="pfx-radiance-under pfx-radiance-a-under" />
          <span
            className="pfx-radiance-star pfx-radiance-a-pop"
            style={{ left: 'min(55%,200px)', top: '100%', '--s': '10px', '--d': '.35s' } as Vars}
          />
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span
            className="pfx-radiance-spot pfx-radiance-a-glow"
            style={{ ...(round ? { inset: 0 } : {}), '--t': '.8s' } as Vars}
          />
          <Stars list={burst} pop />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-radiance-spot pfx-radiance-a-glow"
            style={{ ...(round ? { inset: 0 } : {}), '--t': '1.6s' } as Vars}
          />
          <Rays list={rays} x="50%" y="50%" t="1.6s" />
          {!round && (
            <span
              className="pfx-radiance-shaft pfx-radiance-a-shaft"
              style={
                { left: '30%', right: '30%', top: '-60%', bottom: '10%', '--t': '1.5s' } as Vars
              }
            />
          )}
          <Stars list={crown} pop />
        </Fragment>
      )}
    </>
  );
}

export const radiance: EffectModule = {
  id: 'radiance',
  css,
  vars: (skin: Skin) => ({
    '--pfx-g': skin.colors.win,
    '--pfx-g7': rgba(skin.colors.win, 0.7),
    '--pfx-g5': rgba(skin.colors.win, 0.5),
    '--pfx-g3': rgba(skin.colors.win, 0.3),
    '--pfx-g2': rgba(skin.colors.win, 0.2),
    '--pfx-g0': rgba(skin.colors.win, 0),
    // The warm base of a glow rising from below.
    '--pfx-a3': rgba(skin.colors.accent, 0.3),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
