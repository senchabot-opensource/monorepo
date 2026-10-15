import { type CSSProperties, Fragment } from 'react';
import { rgba, shade } from '../color';
import type { Skin } from '../skin';
import { motionOk } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Capture: Conquest's objective HUD. A bar takes ground a stretch at a time: a bright band with a
// leading line sweeps over what it gained, and its edge sends out a radar ping. Panels lock in
// with corner brackets and now and then ping from a corner. A win is the objective taken: swept
// in the win color, with a big ring from the middle and a flash.

/** The idle loop; each panel pings at its own moment. */
const IDLE_MS = 8000;
/** The narrowest stretch a hit sweeps, in px, so a vote or a 1% step still reads. */
const SLIVER = 12;
/** When a win's sweep has covered the bar or panel and the rings and flash go off, in ms. */
const TAKEN = 560;

// A band is translucent with a white leading line; on a bar's fill it's brighter toward the line.
const css = `.pfx-capture-clip{position:absolute;overflow:hidden}
.pfx-capture-band{position:absolute;top:0;bottom:0;left:0;width:100%;opacity:0;background:linear-gradient(90deg,rgba(255,255,255,0),var(--pfx-a3) 75%,rgba(255,255,255,.55) calc(100% - 3px),#fff calc(100% - 3px))}
.pfx-capture-band.pfx-capture-w{background:linear-gradient(90deg,rgba(255,255,255,0),var(--pfx-w3) 75%,rgba(255,255,255,.55) calc(100% - 3px),#fff calc(100% - 3px))}
.pfx-capture-band.pfx-capture-bar{background:linear-gradient(90deg,rgba(255,255,255,0),var(--pfx-a3) 55%,var(--pfx-al) calc(100% - 10px),rgba(255,255,255,.85) calc(100% - 3px),#fff calc(100% - 3px))}
.pfx-capture-band.pfx-capture-bar.pfx-capture-w{background:linear-gradient(90deg,var(--pfx-w3),var(--pfx-w6) 70%,var(--pfx-wl) calc(100% - 10px),rgba(255,255,255,.85) calc(100% - 3px),#fff calc(100% - 3px))}
.pfx-capture-ring{position:absolute;box-sizing:border-box;border:2px solid var(--pfx-al);border-radius:50%;opacity:0;box-shadow:0 0 8px var(--pfx-a6),inset 0 0 6px var(--pfx-a3)}
.pfx-capture-ring.pfx-capture-w{border-color:var(--pfx-wl);box-shadow:0 0 10px var(--pfx-w6),inset 0 0 8px var(--pfx-w3)}
.pfx-capture-blip{position:absolute;border-radius:50%;opacity:0;background:radial-gradient(circle,#fff 0 20%,var(--pfx-al) 36%,var(--pfx-a6) 50%,rgba(255,255,255,0) 70%)}
.pfx-capture-blip.pfx-capture-w{background:radial-gradient(circle,#fff 0 20%,var(--pfx-wl) 36%,var(--pfx-w6) 50%,rgba(255,255,255,0) 70%)}
.pfx-capture-br{position:absolute;box-sizing:border-box;opacity:0;border:0 solid var(--pfx-al)}
.pfx-capture-br.pfx-capture-w{border-color:var(--pfx-wl)}
.pfx-capture-rim{position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;opacity:0;border:2px solid var(--pfx-al);box-shadow:inset 0 0 10px var(--pfx-a3)}
.pfx-capture-rim.pfx-capture-w{border-color:var(--pfx-wl);box-shadow:inset 0 0 10px var(--pfx-w3)}
.pfx-capture-wash{position:absolute;inset:0;border-radius:inherit;opacity:0;background:radial-gradient(ellipse at 50% 50%,var(--pfx-w3),rgba(255,255,255,0) 75%)}
.pfx-capture-glare{position:absolute;inset:0;opacity:0;background:linear-gradient(180deg,rgba(255,255,255,.8),var(--pfx-w6))}
.pfx-capture-spot{position:absolute;inset:0;border-radius:50%;opacity:0;background:radial-gradient(closest-side,var(--pfx-w6),var(--pfx-w3) 50%,rgba(255,255,255,0))}
${motionOk(`@keyframes pfx-capture-sweep{0%{opacity:1;transform:translateX(-100%);animation-timing-function:cubic-bezier(.3,.6,.35,1)}50%{opacity:1;transform:none}100%{opacity:0;transform:none}}
@keyframes pfx-capture-pass{0%{opacity:0;transform:translateX(-100%)}10%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(var(--to,250%))}}
@keyframes pfx-capture-ping{0%{opacity:0;transform:scale(.1)}8%{opacity:1}40%{opacity:.9}100%{opacity:0;transform:none}}
@keyframes pfx-capture-flash{0%{opacity:0}8%{opacity:1}100%{opacity:0}}
@keyframes pfx-capture-snap{0%{opacity:0;transform:translate(var(--x),var(--y))}5%{opacity:1;transform:translate(var(--x),var(--y));animation-timing-function:cubic-bezier(.3,1.6,.55,1)}28%{transform:none}62%{opacity:1}100%{opacity:0;transform:none}}
@keyframes pfx-capture-idle{0%,95%{opacity:0;transform:scale(.15)}95.5%{opacity:1}97.5%{opacity:.9}100%{opacity:0;transform:none}}
@keyframes pfx-capture-idle-dot{0%,95%{opacity:0}95.5%{opacity:1}98%{opacity:.8}100%{opacity:0}}
.pfx-capture-a-sweep{animation:pfx-capture-sweep var(--t,1.1s) linear var(--d,0s) backwards}
.pfx-capture-a-pass{animation:pfx-capture-pass var(--t,.6s) cubic-bezier(.45,.05,.35,1) var(--d,0s) backwards}
.pfx-capture-a-ping{animation:pfx-capture-ping var(--t,.8s) cubic-bezier(.2,.65,.3,1) var(--d,0s) backwards}
.pfx-capture-a-flash{animation:pfx-capture-flash var(--t,.5s) ease-out var(--d,0s) backwards}
.pfx-capture-a-snap{animation:pfx-capture-snap var(--t,1.1s) ease-out var(--d,0s) backwards}
.pfx-capture-a-idle{animation:pfx-capture-idle ${IDLE_MS}ms ease-out var(--sync,0s) infinite}
.pfx-capture-a-idledot{animation:pfx-capture-idle-dot ${IDLE_MS}ms linear var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;
const ms = (value: number) => `${Math.round(value)}ms`;

interface Area {
  key: string;
  style: CSSProperties;
}

const WHOLE: Area = { key: 'all', style: { inset: 0, borderRadius: 'inherit' } };

/** What a hit sweeps: the stretch it gained, ending at its edge, and at least a sliver. */
function stretch(hit: FxHit): Area {
  const width = `max(${SLIVER}px, ${pct(Math.abs(hit.to - hit.from))})`;
  const left = `calc(${pct(Math.max(hit.from, hit.to))} - ${width})`;
  return { key: 'hit', style: { top: 0, bottom: 0, left, width } };
}

/** Where a panel's sweeps go: all of it, or only the top and bottom of a frame's band. */
function areas(ring?: number): Area[] {
  return ring
    ? [
        { key: 'top', style: { left: 0, right: 0, top: 0, height: ring } },
        { key: 'bottom', style: { left: 0, right: 0, bottom: 0, height: ring } },
      ]
    : [WHOLE];
}

const band = (bar?: boolean, win?: boolean) =>
  `pfx-capture-band ${bar ? 'pfx-capture-bar ' : ''}${win ? 'pfx-capture-w ' : ''}`;

/** A band with a bright leading line that sweeps left to right until it covers its area. */
function Sweep({
  area,
  bar,
  win,
  t,
  d = 0,
}: {
  area: Area;
  bar?: boolean;
  win?: boolean;
  t: number;
  d?: number;
}) {
  return (
    <span className="pfx-capture-clip" style={area.style}>
      <span
        className={`${band(bar, win)}pfx-capture-a-sweep`}
        style={{ '--t': ms(t), '--d': ms(d) } as Vars}
      />
    </span>
  );
}

/** A shorter band, `share` of its area wide, that runs across it and is gone. */
function Pass({ area, share, bar, t }: { area: Area; share: number; bar?: boolean; t: number }) {
  return (
    <span className="pfx-capture-clip" style={area.style}>
      <span
        className={`${band(bar)}pfx-capture-a-pass`}
        style={{ width: pct(share), '--to': pct(1 / share), '--t': ms(t) } as Vars}
      />
    </span>
  );
}

interface Spot {
  x: number | string;
  y: number | string;
  win?: boolean;
  t: number;
  d?: number;
}

/** A ring that grows out of a point and fades, like a contact on radar; `h` makes it an ellipse. */
function Ping({
  x,
  y,
  w,
  h = w,
  line = 2,
  glow = true,
  win,
  t,
  d = 0,
}: Spot & { w: number; h?: number; line?: number; glow?: boolean }) {
  return (
    <span
      className={`pfx-capture-ring ${win ? 'pfx-capture-w ' : ''}pfx-capture-a-ping`}
      style={
        {
          left: x,
          top: y,
          width: w,
          height: h,
          marginLeft: -w / 2,
          marginTop: -h / 2,
          borderWidth: line,
          boxShadow: glow ? undefined : 'none',
          '--t': ms(t),
          '--d': ms(d),
        } as Vars
      }
    />
  );
}

/** The glowing dot a ping goes out from. */
function Blip({ x, y, size, win, t, d = 0 }: Spot & { size: number }) {
  return (
    <span
      className={`pfx-capture-blip ${win ? 'pfx-capture-w ' : ''}pfx-capture-a-flash`}
      style={
        {
          left: x,
          top: y,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          '--t': ms(t),
          '--d': ms(d),
        } as Vars
      }
    />
  );
}

const CORNERS = [
  { v: 'top', h: 'left' },
  { v: 'top', h: 'right' },
  { v: 'bottom', h: 'left' },
  { v: 'bottom', h: 'right' },
] as const;

/** Four corner brackets that start `out` px outside the panel and snap into its corners. */
function Brackets({
  size,
  line,
  out,
  win,
  t,
  d = 0,
}: {
  size: number;
  line: number;
  out: number;
  win?: boolean;
  t: number;
  d?: number;
}) {
  return CORNERS.map(({ v, h }) => (
    <span
      key={`${v}-${h}`}
      className={`pfx-capture-br ${win ? 'pfx-capture-w ' : ''}pfx-capture-a-snap`}
      style={
        {
          // Over the HUD frame's own brackets, which sit 1px outside the panel.
          [v]: -1,
          [h]: -1,
          width: size,
          height: size,
          borderTopWidth: v === 'top' ? line : 0,
          borderBottomWidth: v === 'bottom' ? line : 0,
          borderLeftWidth: h === 'left' ? line : 0,
          borderRightWidth: h === 'right' ? line : 0,
          '--x': `${h === 'left' ? -out : out}px`,
          '--y': `${v === 'top' ? -out : out}px`,
          '--t': ms(t),
          '--d': ms(d),
        } as Vars
      }
    />
  ));
}

function Panel({ seed, mode, scale, pulse, win, ring }: PanelFxProps) {
  const hero = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  const px = (n: number) => Math.max(1, Math.round(n * size));
  const strips = areas(ring);
  // Pings come from the top right corner: inside its bracket, or mid-band on a webcam's frame,
  // where they lose their outer glow so nothing spills onto the picture.
  const inset = ring ? Math.round(ring / 2) : px(9);
  const corner = { x: `calc(100% - ${inset}px)`, y: inset };
  const ping = ring ? Math.round(Math.min(ring * 0.9, px(18))) : px(18);
  const dot = px(7);
  const sync = { '--sync': ms(-seed * IDLE_MS) } as Vars;
  return (
    <>
      <Brackets
        size={px(hero ? 26 : 14)}
        line={px(hero ? 3 : 2)}
        out={px(hero ? 30 : 12)}
        t={hero ? 1500 : 1100}
      />
      {hero && (
        // A card comes in locked on, then taken: swept left to right as its rim flashes.
        <>
          {strips.map((area) => (
            <Sweep key={area.key} area={area} t={1400} d={250} />
          ))}
          <span
            className="pfx-capture-rim pfx-capture-a-flash"
            style={{ '--t': '700ms', '--d': '300ms', boxShadow: ring ? 'none' : undefined } as Vars}
          />
        </>
      )}
      {mode === 'full' && (
        <>
          <span
            className="pfx-capture-ring pfx-capture-a-idle"
            style={
              {
                ...sync,
                left: corner.x,
                top: corner.y,
                width: ping,
                height: ping,
                marginLeft: -ping / 2,
                marginTop: -ping / 2,
                borderWidth: Math.max(1, Math.round(ping / 10)),
                boxShadow: ring ? 'none' : undefined,
              } as Vars
            }
          />
          <span
            className="pfx-capture-blip pfx-capture-a-idledot"
            style={
              {
                ...sync,
                left: corner.x,
                top: corner.y,
                width: dot,
                height: dot,
                marginLeft: -dot / 2,
                marginTop: -dot / 2,
              } as Vars
            }
          />
        </>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          {strips.map((area) => (
            <Pass key={area.key} area={area} share={0.35} t={600} />
          ))}
          <Ping
            x={corner.x}
            y={corner.y}
            w={ring ? ping : px(26)}
            line={px(2)}
            glow={!ring}
            t={650}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {strips.map((area) => (
            <Sweep key={area.key} area={area} win t={1200} />
          ))}
          {ring ? (
            // Around a webcam the band takes it all: win-colored brackets lock on, the rim flashes.
            <>
              <Brackets size={px(18)} line={px(2)} out={px(10)} win t={1300} d={TAKEN - 150} />
              <span
                className="pfx-capture-rim pfx-capture-w pfx-capture-a-flash"
                style={{ '--t': '650ms', '--d': ms(TAKEN), boxShadow: 'none' } as Vars}
              />
            </>
          ) : (
            <>
              <span
                className="pfx-capture-wash pfx-capture-a-flash"
                style={{ '--t': '750ms', '--d': ms(TAKEN) } as Vars}
              />
              <Ping x="50%" y="50%" w={px(150)} line={px(3)} win t={1000} d={TAKEN} />
              <Ping x="50%" y="50%" w={px(96)} line={px(2)} win t={850} d={TAKEN + 160} />
            </>
          )}
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  // A poll's vote lands on the fill's edge without growing it: a quick sweep and a small ping.
  const strike = hit !== null && Math.abs(hit.to - hit.from) < 0.004;
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <Sweep area={stretch(hit)} bar t={strike ? 420 : 1100} />
          {strike && <Ping x={pct(hit.to)} y="50%" w={30} t={480} d={60} />}
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <Sweep area={WHOLE} bar win t={1300} />
          <span
            className="pfx-capture-glare pfx-capture-a-flash"
            style={{ '--t': '650ms', '--d': ms(TAKEN) } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

function Burst({ hit, hits, win, left, right, y, height }: BurstFxProps) {
  const edge = hit ? left + (right - left) * hit.to : left;
  const middle = (left + right) / 2;
  const ping = Math.round(Math.max(56, height * 1.7));
  const big = Math.round(Math.max(72, height * 2));
  return (
    <>
      {hit && hits > 0 && (
        // The edge pings as the sweep reaches it.
        <Fragment key={`h${hits}`}>
          <Blip x={edge} y={y} size={Math.round(height / 2)} t={600} d={280} />
          <Ping x={edge} y={y} w={ping} t={850} d={300} />
          <Ping x={edge} y={y} w={Math.round(ping * 0.6)} t={700} d={440} />
        </Fragment>
      )}
      {win > 0 && (
        // Objective taken: rings out of the bar's middle, the widest one along the bar.
        <Fragment key={`w${win}`}>
          <Blip x={middle} y={y} size={Math.round(height * 0.7)} win t={800} d={TAKEN} />
          <Ping
            x={middle}
            y={y}
            w={Math.round((right - left) * 0.55)}
            h={Math.round(height * 1.5)}
            win
            t={1000}
            d={TAKEN}
          />
          <Ping x={middle} y={y} w={big} line={3} win t={1000} d={TAKEN} />
          <Ping x={middle} y={y} w={Math.round(big * 0.62)} win t={850} d={TAKEN + 160} />
        </Fragment>
      )}
    </>
  );
}

function Pulse({ pulse, win, enter }: PulseFxProps) {
  return (
    <>
      {enter && (
        // A chat line comes in with a short sweep along its bottom edge, as bright as a bar's.
        <Pass
          area={{ key: 'line', style: { left: 0, right: 0, bottom: 0, height: 2 } }}
          share={0.4}
          bar
          t={700}
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Ping x="50%" y="50%" w={84} t={750} />
          <Ping x="50%" y="50%" w={52} t={600} d={110} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-capture-spot pfx-capture-a-flash"
            style={{ '--t': '900ms' } as Vars}
          />
          <Ping x="50%" y="50%" w={150} line={3} win t={1000} />
          <Ping x="50%" y="50%" w={104} win t={850} d={150} />
          <Ping x="50%" y="50%" w={64} win t={700} d={300} />
        </Fragment>
      )}
    </>
  );
}

export const capture: EffectModule = {
  id: 'capture',
  css,
  vars: (skin: Skin) => ({
    '--pfx-a3': rgba(skin.colors.accent, 0.3),
    '--pfx-a6': rgba(skin.colors.accent, 0.6),
    '--pfx-al': shade(skin.accent, 70),
    '--pfx-w3': rgba(skin.colors.win, 0.3),
    '--pfx-w6': rgba(skin.colors.win, 0.6),
    '--pfx-wl': shade(skin.win, 78),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
