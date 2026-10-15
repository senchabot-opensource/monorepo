import { type CSSProperties, Fragment } from 'react';
import { rgba } from '../color';
import type { Skin } from '../skin';
import { motionOk, useClockPhase } from './primitives';
import type {
  BurstFxProps,
  EffectModule,
  FxHit,
  PanelFxProps,
  PulseFxProps,
  TrackFxProps,
} from './types';

// Beacon: Defuse's tactical HUD. What a bar gains is swept by an amber scan line while a small red
// light double-blinks at its edge and an amber ping rings out. A reached goal blinks red across
// the bar, faster and faster, then flashes blue. Panels come in under an amber scan with their
// corner brackets flashing, and a tiny red light in their corner blinks on every panel at once.

/** The idle loop: one short blink at its start, in step with the clock across sources. */
const IDLE_MS = 2500;
/** When the win's red blinks land, in ms: faster and faster, like a timer running out. */
const TICKS = [0, 250, 450, 610, 740, 845, 925, 985];
/** How long each stays lit, shorter as they speed up. */
const LIT = [110, 100, 90, 80, 70, 60, 50, 45];
/** Then the blue flash. */
const FLASH_MS = 1060;

const at = (ms: number) => `${Math.round((ms / FLASH_MS) * 1000) / 10}%`;

/** On at every tick, off in between, for things that blink with the win's countdown. */
const ticks = (name: string, peak: number) =>
  `@keyframes ${name}{${TICKS.map((tick, index) => `${at(tick)}{opacity:${peak}}${at(tick + LIT[index])}{opacity:0}`).join('')}100%{opacity:0}}`;

const scan = (angle: number, head: number) =>
  `linear-gradient(${angle}deg,var(--pfx-a0) 0,var(--pfx-a0) calc(100% - var(--trail,40px)),var(--pfx-a3) calc(100% - 14px),var(--pfx-a) calc(100% - ${head * 2}px),#fff4dc calc(100% - ${head}px))`;

const css = `.pfx-beacon-led{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff 0,#ff8080 22%,#ff2222 52%,#a30000);box-shadow:0 0 5px 1px rgba(255,40,40,.95),0 0 12px 3px rgba(255,30,30,.45)}
.pfx-beacon-clip{position:absolute;overflow:hidden;border-radius:inherit}
.pfx-beacon-scan{position:absolute;opacity:0;background:${scan(90, 2)}}
.pfx-beacon-scan.pfx-beacon-v{background:${scan(180, 1.5)}}
.pfx-beacon-ring{position:absolute;opacity:0;border:2px solid var(--pfx-a);border-radius:50%;box-shadow:0 0 8px var(--pfx-a6),inset 0 0 6px var(--pfx-a3)}
.pfx-beacon-ping{position:absolute;left:50%;top:50%;height:88%;aspect-ratio:1/1;opacity:0;border:2px solid var(--pfx-a);border-radius:50%;box-shadow:0 0 8px var(--pfx-a6)}
.pfx-beacon-ping.pfx-beacon-w{border-color:var(--pfx-w);box-shadow:0 0 10px var(--pfx-w6)}
.pfx-beacon-ping.pfx-beacon-thin{border-width:1px}
.pfx-beacon-bracket{position:absolute;opacity:0;border:0 solid var(--pfx-a)}
.pfx-beacon-bracket.pfx-beacon-red{border-color:#ff3b3b}
.pfx-beacon-tint{position:absolute;inset:0;opacity:0;background:rgba(255,40,40,.6)}
.pfx-beacon-flash{position:absolute;inset:0;opacity:0;border-radius:inherit;background:linear-gradient(180deg,#eef4ff,var(--pfx-w) 45%,var(--pfx-w6))}
.pfx-beacon-flash.pfx-beacon-soft{background:linear-gradient(180deg,rgba(238,244,255,.55),var(--pfx-w6) 45%,var(--pfx-w3))}
.pfx-beacon-glow{position:absolute;inset:0;opacity:0;border-radius:inherit;box-shadow:inset 0 0 16px 3px var(--pfx-w)}
.pfx-beacon-halo{position:absolute;opacity:0;box-shadow:0 0 24px 6px var(--pfx-w6)}
.pfx-beacon-spot{position:absolute;opacity:0;border-radius:50%;background:radial-gradient(closest-side,rgba(238,244,255,.75),var(--pfx-w6) 45%,var(--pfx-w0))}
${motionOk(`@keyframes pfx-beacon-blink2{0%{opacity:0}1%{opacity:1}20%{opacity:0}38%{opacity:1}57%,100%{opacity:0}}
@keyframes pfx-beacon-on{0%{opacity:0}1%,100%{opacity:1}}
@keyframes pfx-beacon-sweep-x{0%{opacity:0;transform:translateX(-100%)}2%{opacity:1}85%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(0)}}
@keyframes pfx-beacon-sweep-y{0%{opacity:0;transform:translateY(-100%)}2%{opacity:1}85%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(0)}}
@keyframes pfx-beacon-ring{0%{opacity:0;transform:scale(.2)}8%{opacity:1}100%{opacity:0;transform:scale(1)}}
@keyframes pfx-beacon-ping{0%{opacity:0;transform:translate(-50%,-50%) scale(.25)}10%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}
@keyframes pfx-beacon-flash{0%{opacity:0}5%{opacity:.9}100%{opacity:0}}
@keyframes pfx-beacon-glow{0%{opacity:0}6%{opacity:1}100%{opacity:0}}
@keyframes pfx-beacon-idle{0%{opacity:1}4%,100%{opacity:0}}
${ticks('pfx-beacon-ticks', 1)}
${ticks('pfx-beacon-tint', 0.35)}
.pfx-beacon-a-blink2{animation:pfx-beacon-blink2 var(--t,.62s) steps(1,end) var(--d,0s) backwards}
.pfx-beacon-a-on{animation:pfx-beacon-on var(--t,.1s) steps(1,end) var(--d,0s) backwards}
.pfx-beacon-a-sweepx{animation:pfx-beacon-sweep-x var(--t,.52s) linear var(--d,0s) backwards}
.pfx-beacon-a-sweepy{animation:pfx-beacon-sweep-y var(--t,.62s) cubic-bezier(.4,.1,.6,.95) var(--d,0s) backwards}
.pfx-beacon-a-ring{animation:pfx-beacon-ring var(--t,.8s) cubic-bezier(.2,.65,.35,1) var(--d,0s) backwards}
.pfx-beacon-a-ping{animation:pfx-beacon-ping var(--t,.7s) cubic-bezier(.2,.65,.35,1) var(--d,0s) backwards}
.pfx-beacon-a-flash{animation:pfx-beacon-flash var(--t,.8s) ease-out var(--d,0s) backwards}
.pfx-beacon-a-glow{animation:pfx-beacon-glow var(--t,1s) ease-out var(--d,0s) backwards}
.pfx-beacon-a-ticks{animation:pfx-beacon-ticks ${FLASH_MS}ms steps(1,end) var(--d,0s) backwards}
.pfx-beacon-a-tint{animation:pfx-beacon-tint ${FLASH_MS}ms steps(1,end) var(--d,0s) backwards}
.pfx-beacon-a-idle{animation:pfx-beacon-idle ${IDLE_MS}ms steps(1,end) var(--sync,0s) infinite}`)}`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const pct = (fraction: number) => `${Math.round(fraction * 10000) / 100}%`;

/** What a hit scans: its new segment, or a sliver at the edge when nothing grew. */
function segment(hit: FxHit): CSSProperties {
  const width = Math.abs(hit.to - hit.from);
  return width > 0.004
    ? { left: pct(Math.min(hit.from, hit.to)), width: pct(width) }
    : { left: `calc(${pct(hit.to)} - 5px)`, width: 10 };
}

/** A bar's red light, in the upper part of its track, at `x` (0 to 1) and kept inside it. */
const trackLed = (x: number): CSSProperties => ({
  left: `clamp(2px, calc(${pct(x)} - 3px), calc(100% - 8px))`,
  top: '18%',
  width: 6,
  height: 6,
});

/** The panel's corner light: top right, small, and inside the band on a stream frame. */
function cornerLed(size: number, ring?: number): CSSProperties {
  const dot = ring
    ? Math.round(Math.max(2, Math.min(4 * size, ring * 0.3)) * 10) / 10
    : Math.max(3, Math.round(4 * size));
  const gap = ring ? Math.round(ring * 3) / 10 : Math.round(5 * size);
  return {
    top: gap,
    right: gap,
    width: dot,
    height: dot,
    boxShadow: `0 0 ${Math.round(dot)}px ${Math.max(1, Math.round(dot / 4))}px rgba(255,40,40,.9)`,
  };
}

const CORNERS = [
  ['top', 'left'],
  ['top', 'right'],
  ['bottom', 'left'],
  ['bottom', 'right'],
] as const;

/** The HUD's corner brackets, drawn again to flash; on a stream frame, inside the band. */
function Brackets({
  size,
  ring,
  big = false,
  red = false,
  animation,
  t,
}: {
  size: number;
  ring?: number;
  big?: boolean;
  red?: boolean;
  animation: string;
  t?: number;
}) {
  const arm = Math.round((big ? 18 : 12) * size);
  const line = ring
    ? Math.max(1, Math.min(2 * size, ring / 4))
    : Math.max(1.5, Math.round(2 * size));
  const inset = ring ? 0 : -1;
  return CORNERS.map(([v, h]) => (
    <span
      key={`${v}-${h}`}
      className={`pfx-beacon-bracket${red ? ' pfx-beacon-red' : ''} ${animation}`}
      style={
        {
          width: arm,
          height: arm,
          [v]: inset,
          [h]: inset,
          [v === 'top' ? 'borderTopWidth' : 'borderBottomWidth']: line,
          [h === 'left' ? 'borderLeftWidth' : 'borderRightWidth']: line,
          ...(t ? { '--t': `${t}ms` } : {}),
        } as Vars
      }
    />
  ));
}

/**
 * The amber scan line, top to bottom over the panel; on a stream frame it only shows in the side
 * bands, so it never crosses the picture.
 */
function Scan({
  size,
  ring,
  t,
  d = 0,
  trail,
}: {
  size: number;
  ring?: number;
  t: number;
  d?: number;
  trail: number;
}) {
  const line = (
    <span
      className="pfx-beacon-scan pfx-beacon-v pfx-beacon-a-sweepy"
      style={
        {
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
          '--trail': `${Math.round(trail * size)}px`,
          '--t': `${t}ms`,
          '--d': `${d}ms`,
        } as Vars
      }
    />
  );
  if (!ring) {
    return (
      <span className="pfx-beacon-clip" style={{ inset: 0 }}>
        {line}
      </span>
    );
  }
  return (
    <>
      <span className="pfx-beacon-clip" style={{ left: 0, top: 0, bottom: 0, width: ring }}>
        {line}
      </span>
      <span className="pfx-beacon-clip" style={{ right: 0, top: 0, bottom: 0, width: ring }}>
        {line}
      </span>
    </>
  );
}

function Panel({ mode, scale, pulse, win, ring }: PanelFxProps) {
  const big = mode === 'hero';
  const size = Math.min(1.4, Math.max(0.5, scale));
  // Every panel's light blinks on the same beat, like one device's.
  const sync = useClockPhase(IDLE_MS);
  const led = cornerLed(size, ring);
  const glow = ring
    ? {
        boxShadow: `inset 0 0 ${Math.round(ring * 0.8)}px ${Math.round(ring / 5)}px var(--pfx-w)`,
      }
    : undefined;
  return (
    <>
      <Brackets
        size={size}
        ring={ring}
        big={big}
        animation="pfx-beacon-a-blink2"
        t={big ? 720 : 560}
      />
      <Scan size={size} ring={ring} t={big ? 860 : 620} d={70} trail={big ? 72 : 44} />
      {big && (
        <span
          className="pfx-beacon-led pfx-beacon-a-blink2"
          style={{ ...led, '--d': '380ms' } as Vars}
        />
      )}
      {mode === 'full' && (
        <span
          className="pfx-beacon-led pfx-beacon-a-idle"
          style={{ ...led, '--sync': `${sync}ms` } as Vars}
        />
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <Scan size={size} ring={ring} t={380} trail={32} />
          <span
            className="pfx-beacon-led pfx-beacon-a-blink2"
            style={{ ...led, '--t': '420ms' } as Vars}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {/* Red blinks, faster and faster, then the win color floods in. */}
          <Brackets size={size} ring={ring} red animation="pfx-beacon-a-ticks" />
          <span className="pfx-beacon-led pfx-beacon-a-ticks" style={led} />
          <span
            className="pfx-beacon-glow pfx-beacon-a-glow"
            style={{ ...glow, '--d': `${FLASH_MS}ms`, '--t': '1.1s' } as Vars}
          />
          {!ring && (
            <span
              className="pfx-beacon-flash pfx-beacon-soft pfx-beacon-a-flash"
              style={{ '--d': `${FLASH_MS}ms`, '--t': '.7s' } as Vars}
            />
          )}
        </Fragment>
      )}
    </>
  );
}

function Track({ hit, hits, win }: TrackFxProps) {
  return (
    <>
      {hit && hits > 0 && (
        <Fragment key={`h${hits}`}>
          <span
            className="pfx-beacon-scan pfx-beacon-a-sweepx"
            style={{ ...segment(hit), top: 0, bottom: 0, '--trail': '36px' } as Vars}
          />
          <span className="pfx-beacon-led pfx-beacon-a-blink2" style={trackLed(hit.to)} />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          {/* A row of red lights blinks left to right, faster and faster, then the bar flashes blue. */}
          <span className="pfx-beacon-tint pfx-beacon-a-tint" />
          {TICKS.map((tick, index) => (
            <span
              key={tick}
              className="pfx-beacon-led pfx-beacon-a-on"
              style={
                {
                  ...trackLed((index + 0.5) / TICKS.length),
                  '--d': `${tick}ms`,
                  '--t': `${LIT[index]}ms`,
                } as Vars
              }
            />
          ))}
          <span
            className="pfx-beacon-flash pfx-beacon-a-flash"
            style={{ '--d': `${FLASH_MS}ms` } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

function Burst({ hit, hits, win, left, right, y, height }: BurstFxProps) {
  const ring = Math.round(height * 1.8);
  return (
    <>
      {hit && hits > 0 && (
        // One amber ping from where the bar's edge landed.
        <span
          key={`h${hits}`}
          className="pfx-beacon-ring pfx-beacon-a-ring"
          style={{
            left: Math.round(left + (right - left) * hit.to - ring / 2),
            top: Math.round(y - ring / 2),
            width: ring,
            height: ring,
          }}
        />
      )}
      {win > 0 && (
        // The blue flash spills out around the bar.
        <span
          key={`w${win}`}
          className="pfx-beacon-halo pfx-beacon-a-glow"
          style={
            {
              left: left - 6,
              top: y - height / 2 - 6,
              width: right - left + 12,
              height: height + 12,
              '--d': `${FLASH_MS}ms`,
            } as Vars
          }
        />
      )}
    </>
  );
}

function Pulse({ pulse, win, enter, round }: PulseFxProps) {
  return (
    <>
      {enter && (
        // A short amber scan along the chat line's bottom edge.
        <span className="pfx-beacon-clip" style={{ left: 0, right: 0, bottom: 0, height: 2 }}>
          <span
            className="pfx-beacon-scan pfx-beacon-a-sweepx"
            style={{ inset: 0, '--trail': '48px' } as Vars}
          />
        </span>
      )}
      {pulse > 0 && (
        <Fragment key={`p${pulse}`}>
          <span className="pfx-beacon-ping pfx-beacon-a-ping" />
          <span
            className="pfx-beacon-ping pfx-beacon-thin pfx-beacon-a-ping"
            style={{ '--d': '150ms' } as Vars}
          />
        </Fragment>
      )}
      {win > 0 && (
        <Fragment key={`w${win}`}>
          <span
            className="pfx-beacon-spot pfx-beacon-a-glow"
            style={round ? { inset: '10%' } : { inset: '-15%' }}
          />
          <span
            className="pfx-beacon-ping pfx-beacon-w pfx-beacon-a-ping"
            style={{ '--t': '.9s' } as Vars}
          />
          <span
            className="pfx-beacon-ping pfx-beacon-w pfx-beacon-thin pfx-beacon-a-ping"
            style={{ '--d': '160ms', '--t': '.9s' } as Vars}
          />
        </Fragment>
      )}
    </>
  );
}

export const beacon: EffectModule = {
  id: 'beacon',
  css,
  // The lights are red whatever the preset; the scan is its accent and the flash its win color.
  vars: (skin: Skin) => ({
    '--pfx-a': skin.colors.accent,
    '--pfx-a6': rgba(skin.colors.accent, 0.6),
    '--pfx-a3': rgba(skin.colors.accent, 0.3),
    '--pfx-a0': rgba(skin.colors.accent, 0),
    '--pfx-w': skin.colors.win,
    '--pfx-w6': rgba(skin.colors.win, 0.6),
    '--pfx-w3': rgba(skin.colors.win, 0.3),
    '--pfx-w0': rgba(skin.colors.win, 0),
  }),
  Panel,
  Track,
  Burst,
  Pulse,
};
