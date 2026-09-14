import { type CSSProperties, useEffect, useState } from 'react';
import type { SubathonColor, SubathonSettings, SubathonStyle } from '#/lib/subathon-url';
import { useFitScale } from '../use-fit-scale';
import type { SubathonPlatform } from './subathon-events';
import { formatClock, formatDelta } from './subathon-timer';
import { POP_MS, type SubathonHit, type SubathonPop, useSubathon } from './use-subathon';

/** Design size; the overlay scales to fill whatever browser source size it gets. */
const STAGE = { width: 800, height: 300 };

export const SUBATHON_FONT =
  'https://fonts.googleapis.com/css2?family=Oxanium:wght@500;700;800&display=swap';
const FONT_FAMILY = "'Oxanium', ui-sans-serif, system-ui, sans-serif";

const HUES: Record<Exclude<SubathonColor, 'hp'>, number> = {
  green: 142,
  purple: 265,
  red: 356,
  gold: 42,
  cyan: 188,
  pink: 322,
};

/** Accent hue. `hp` goes green, then amber, then red as the clock runs down. */
export function hueFor(color: SubathonColor, health: number): number {
  if (color !== 'hp') return HUES[color];
  const h = Math.max(0, Math.min(1, health));
  if (h >= 0.6) return HUES.green;
  if (h >= 0.3) return HUES.gold + ((h - 0.3) / 0.3) * (HUES.green - HUES.gold);
  return (h / 0.3) * HUES.gold;
}

// Every style keeps a band on top for the rising pops, so they stay inside the source.
const POP_BAND = 100;
// Health bar layout, bottom up: margin, the title and time row, a gap, the bar; pops above it.
const BAR_BOTTOM = 36;
const INFO_ROW_HEIGHT = 44;
const BAR_GAP = 12;
const BAR_HEIGHT = 64;
const BAR_TOP = STAGE.height - BAR_BOTTOM - INFO_ROW_HEIGHT - BAR_GAP - BAR_HEIGHT;

// Segment lines on the health bar, every 10%.
const TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

// A heal's white ghost fades in 900ms while the fill eases in; a loss's red ghost lingers longer.
const HEAL_MS = 900;
const HURT_MS = 1300;

const LOW_HEALTH = 0.2;
const CRITICAL_HEALTH = 0.07;

const CSS = `
.sa-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.sa-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.sa-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.55)}
.sa-title{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-style:italic}
@keyframes sa-beat{0%,40%,100%{transform:scale(1)}15%{transform:scale(1.28)}28%{transform:scale(1.1)}}
@keyframes sa-pulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.45)}}
@keyframes sa-shake{0%,100%{transform:translate(0,0)}20%{transform:translate(-3px,1px)}40%{transform:translate(3px,-1px)}60%{transform:translate(-2px,-1px)}80%{transform:translate(2px,1px)}}
@keyframes sa-ghost{0%{opacity:1}100%{opacity:0}}
@keyframes sa-flash{0%{opacity:.9}100%{opacity:0}}
@keyframes sa-sheen{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}
@keyframes sa-pop{0%{transform:translate(-50%,12px) scale(.6);opacity:0}12%{transform:translate(-50%,-6px) scale(1.12);opacity:1}24%{transform:translate(-50%,-12px) scale(1)}78%{opacity:1}100%{transform:translate(-50%,-40px) scale(.96);opacity:0}}
@keyframes sa-ko{0%{transform:translate(-50%,-50%) scale(3) rotate(-8deg);opacity:0}55%{transform:translate(-50%,-50%) scale(.92) rotate(-8deg);opacity:1}70%{transform:translate(-50%,-50%) scale(1.06) rotate(-8deg)}100%{transform:translate(-50%,-50%) scale(1) rotate(-8deg);opacity:1}}
@keyframes sa-blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes sa-stripes{0%{transform:translateX(0)}100%{transform:translateX(28px)}}
`;

/** True for a moment after time is added, while the heal animations play. */
function useHealing(hit: SubathonHit | null): boolean {
  const [healing, setHealing] = useState(false);
  useEffect(() => {
    // A loss right after a heal ends the heal early, so its flash doesn't play on the loss.
    if (!hit?.heal) {
      setHealing(false);
      return;
    }
    setHealing(true);
    const timer = window.setTimeout(() => setHealing(false), HEAL_MS);
    return () => window.clearTimeout(timer);
  }, [hit]);
  return healing;
}

/** Heartbeat speed in seconds by health, or null when it shouldn't beat. */
function beatFor(health: number, paused: boolean, ended: boolean): number | null {
  if (paused || ended) return null;
  if (health <= CRITICAL_HEALTH) return 0.55;
  if (health <= LOW_HEALTH) return 0.8;
  return 1.3;
}

interface SubathonWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<SubathonSettings, 'platforms'>;
  simulate?: boolean;
  simSpeed?: number;
}

export function SubathonWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simSpeed,
}: SubathonWidgetProps) {
  const scale = useFitScale(STAGE);
  const { left, health, paused, ended, pops, hit } = useSubathon({
    twitch: twitchChannel,
    kick: kickChannel,
    values: settings,
    simulate,
    simSpeed,
  });
  const healing = useHealing(hit);
  const shown = ended ? 0 : health;
  const view: ViewProps = {
    left,
    shown,
    paused,
    ended,
    low: !ended && health <= LOW_HEALTH,
    critical: !ended && health <= CRITICAL_HEALTH,
    beat: beatFor(health, paused, ended),
    hue: hueFor(settings.color, health),
    title: settings.title,
    percent: settings.percent ? `${ended ? 0 : Math.max(1, Math.ceil(health * 100))}%` : null,
    pops: settings.pops ? pops : [],
    hit,
    healing,
    ease: healing ? '.6s cubic-bezier(.2,.9,.3,1.1)' : '.25s linear',
  };
  const View = VIEWS[settings.style];

  return (
    <div className="sa-root" data-testid="subathon" data-style={settings.style}>
      <style>{CSS}</style>
      <div className="sa-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <View {...view} />
      </div>
    </div>
  );
}

interface ViewProps {
  left: number;
  /** Health to draw, 0 to 1: 0 once ended. */
  shown: number;
  paused: boolean;
  ended: boolean;
  low: boolean;
  critical: boolean;
  /** Heartbeat seconds, null when it shouldn't beat. */
  beat: number | null;
  hue: number;
  title: string;
  /** "72%", or null when the percentage is turned off. */
  percent: string | null;
  pops: SubathonPop[];
  hit: SubathonHit | null;
  /** Time was just added: plays the heal flash. */
  healing: boolean;
  /** Transition timing for the fill: springy right after a heal, linear while draining. */
  ease: string;
}

const VIEWS: Record<SubathonStyle, (props: ViewProps) => React.JSX.Element> = {
  bar: HealthBarView,
  clock: ClockView,
  ring: RingView,
};

const hsl = (hue: number, s: number, l: number, a = 1) => `hsl(${hue} ${s}% ${l}% / ${a})`;

/** Color of the time left: red and blinking once it's over. */
const clockColor = (ended: boolean): CSSProperties => ({
  color: ended ? '#f87171' : '#fff',
  animation: ended ? 'sa-blink 1s steps(2) infinite' : undefined,
});

function HeartIcon({ hue, beat }: { hue: number; beat: number | null }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      style={{
        filter: `drop-shadow(0 0 8px ${hsl(hue, 90, 55, 0.8)})`,
        animation: beat ? `sa-beat ${beat}s ease-in-out infinite` : undefined,
      }}
    >
      <path
        d="M12 21s-7.5-4.6-10-9.2C.3 8.5 2.2 4 6.3 4c2.4 0 4 1.4 5.7 3.4C13.7 5.4 15.3 4 17.7 4 21.8 4 23.7 8.5 22 11.8 19.5 16.4 12 21 12 21Z"
        fill={hsl(hue, 90, 58)}
        stroke="rgba(0,0,0,.55)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PauseChip() {
  return (
    <span
      role="img"
      aria-label="Paused"
      style={{
        display: 'inline-flex',
        gap: 5,
        padding: '7px 10px',
        borderRadius: 8,
        background: 'rgba(0,0,0,.6)',
        border: '1px solid rgba(255,255,255,.18)',
        animation: 'sa-blink 1.6s ease-in-out infinite',
      }}
    >
      <span style={{ width: 5, height: 16, borderRadius: 2, background: '#fff' }} />
      <span style={{ width: 5, height: 16, borderRadius: 2, background: '#fff' }} />
    </span>
  );
}

function KnockOut({ size = 76 }: { size?: number }) {
  return (
    <div
      className="sa-title"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '.04em',
        color: '#fff',
        WebkitTextStroke: '3px #b91c1c',
        textShadow: '0 0 24px rgba(239,68,68,.9), 0 6px 0 #450a0a',
        animation: 'sa-ko .55s cubic-bezier(.2,.9,.3,1.2) both',
        pointerEvents: 'none',
      }}
    >
      K.O.
    </div>
  );
}

/** Glow around a shape that fades out right after time is added. */
function HealFlash({
  hit,
  healing,
  hue,
  radius,
  spread,
}: {
  hit: SubathonHit | null;
  healing: boolean;
  hue: number;
  radius: number | string;
  spread: number;
}) {
  if (!hit || !healing) return null;
  return (
    <div
      key={hit.key}
      style={{
        position: 'absolute',
        inset: -2,
        borderRadius: radius,
        boxShadow: `0 0 ${spread * 4}px ${spread}px ${hsl(hue, 100, 70, 0.9)}`,
        animation: 'sa-flash .7s ease-out forwards',
        pointerEvents: 'none',
      }}
    />
  );
}

const PLATFORM_COLORS: Record<SubathonPlatform, string> = { twitch: '#a970ff', kick: '#53fc18' };

function popDetail({ event }: SubathonPop): string {
  switch (event.kind) {
    case 'gift':
      return `🎁 ×${event.count}`;
    case 'bits':
      return `◆ ${event.amount}`;
    case 'sub':
      return event.tier > 1 ? `★ T${event.tier}` : '★';
  }
}

// Pops that land close together rise side by side instead of on top of each other. Keyed by
// pop id, so a pop keeps its spot when an older one disappears.
const POP_OFFSETS = [0, -17, 17];

/**
 * Floating "+1:00" numbers, like heals in a game, rising from the bottom of a band at the top of
 * the stage. `x` is where they start, in %.
 */
function PopBand({
  pops,
  hue,
  x,
  height,
}: {
  pops: SubathonPop[];
  hue: number;
  x: number;
  height: number;
}) {
  const base = Math.min(70, Math.max(30, x));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height }}>
      {pops.map((pop) => (
        <div
          key={pop.id}
          style={{
            position: 'absolute',
            left: `${base + POP_OFFSETS[pop.id % POP_OFFSETS.length]}%`,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            animation: `sa-pop ${POP_MS}ms cubic-bezier(.2,.8,.3,1) both`,
            pointerEvents: 'none',
          }}
        >
          <span
            className="sa-shadow"
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: hsl(hue, 100, 78),
              WebkitTextStroke: `1.5px ${hsl(hue, 80, 22)}`,
            }}
          >
            +{formatDelta(pop.ms)}
          </span>
          <span
            style={{
              marginTop: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              maxWidth: 260,
              padding: '3px 10px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              background: 'rgba(0,0,0,.7)',
              border: `1px solid ${PLATFORM_COLORS[pop.event.platform]}66`,
            }}
          >
            <span style={{ color: PLATFORM_COLORS[pop.event.platform] }}>{popDetail(pop)}</span>
            {pop.event.name && (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pop.event.name}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function HealthBarView(view: ViewProps) {
  const { left, shown, paused, ended, low, critical, hue, title, percent, hit, healing } = view;
  const barStyle: CSSProperties = {
    position: 'relative',
    height: BAR_HEIGHT,
    transform: 'skewX(-14deg)',
    borderRadius: 6,
    padding: 4,
    background: 'linear-gradient(180deg, #2a2a33 0%, #0c0c10 100%)',
    boxShadow: `0 0 0 2px rgba(0,0,0,.85), 0 0 ${low ? 34 : 22}px ${hsl(hue, 90, 50, low ? 0.7 : 0.45)}, inset 0 1px 0 rgba(255,255,255,.18)`,
    animation: critical
      ? 'sa-shake .45s linear infinite'
      : low
        ? 'sa-pulse .9s ease-in-out infinite'
        : undefined,
  };

  return (
    <>
      <PopBand pops={view.pops} hue={hue} x={shown * 100} height={BAR_TOP} />
      <div
        style={{
          position: 'absolute',
          inset: '0 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: BAR_GAP,
          paddingBottom: BAR_BOTTOM,
        }}
      >
        <div style={barStyle}>
          <div
            style={{
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
              borderRadius: 3,
              background:
                'repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 14px, transparent 14px 28px), linear-gradient(180deg, #16161c, #07070a)',
            }}
          >
            {hit && (
              <div
                key={hit.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${Math.min(hit.from, hit.to) * 100}%`,
                  width: `${Math.abs(hit.to - hit.from) * 100}%`,
                  background: hit.heal ? '#ffffff' : '#ef4444',
                  animation: `sa-ghost ${hit.heal ? HEAL_MS : HURT_MS}ms ease-out forwards`,
                }}
              />
            )}
            {/* The bar drains nonstop, so a width transition would relayout every frame for as
                long as the overlay runs. Sliding a full-width fill stays on the compositor. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateX(${(shown - 1) * 100}%)`,
                background: `linear-gradient(180deg, ${hsl(hue, 95, 72)} 0%, ${hsl(hue, 88, 52)} 42%, ${hsl(hue, 85, 34)} 100%)`,
                boxShadow: `inset -3px 0 0 ${hsl(hue, 100, 85)}`,
                transition: `transform ${view.ease}, background .4s`,
                filter: paused ? 'saturate(.35) brightness(.85)' : undefined,
                overflow: 'hidden',
              }}
            >
              <div
                // One tile wider on the left, so sliding it a tile (a transform, unlike moving
                // background-position) never shows an edge.
                style={{
                  position: 'absolute',
                  inset: '0 0 0 -28px',
                  background:
                    'repeating-linear-gradient(115deg, rgba(255,255,255,.14) 0 10px, transparent 10px 20px)',
                  backgroundSize: '28px 100%',
                  animation: paused ? undefined : 'sa-stripes 1.2s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 4,
                  height: '32%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))',
                  borderRadius: 2,
                }}
              />
              {hit && healing && (
                // The fill is shifted left, so start the sweep where it becomes visible.
                <div
                  key={hit.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${(1 - shown) * 100}%`,
                    width: `${shown * 40}%`,
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent)',
                    animation: 'sa-sheen .8s ease-out forwards',
                  }}
                />
              )}
            </div>
            {TICKS.map((tick) => (
              <div
                key={tick}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${tick}%`,
                  width: 2,
                  background: 'rgba(0,0,0,.45)',
                }}
              />
            ))}
            {percent && (
              <span
                className="sa-shadow"
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%) skewX(14deg)',
                  fontSize: 26,
                  fontWeight: 800,
                  WebkitTextStroke: '1px rgba(0,0,0,.6)',
                }}
              >
                {percent}
              </span>
            )}
          </div>
          <HealFlash hit={hit} healing={healing} hue={hue} radius={8} spread={6} />
          {ended && <KnockOut />}
        </div>

        <div
          style={{
            height: INFO_ROW_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '0 10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <HeartIcon hue={hue} beat={view.beat} />
            {title && (
              <span
                className="sa-title sa-shadow"
                style={{
                  fontSize: 26,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </span>
            )}
            {paused && !ended && <PauseChip />}
          </div>
          <span
            className="sa-shadow"
            style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, ...clockColor(ended) }}
          >
            {formatClock(left)}
          </span>
        </div>
      </div>
    </>
  );
}

function ClockView(view: ViewProps) {
  const { left, shown, paused, ended, low, hue, title, percent } = view;
  const [h, m, s] = formatClock(left).split(':');
  const colon = (
    <span style={{ opacity: paused ? 0.5 : 0.85, margin: '0 2px', position: 'relative', top: -6 }}>
      :
    </span>
  );

  return (
    <>
      <PopBand pops={view.pops} hue={hue} x={50} height={POP_BAND} />
      <div
        style={{
          position: 'absolute',
          inset: `${POP_BAND}px 0 0`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        {title && (
          <span className="sa-title sa-shadow" style={{ fontSize: 24, color: hsl(hue, 95, 72) }}>
            {title}
          </span>
        )}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '6px 34px 10px',
            borderRadius: 22,
            background: 'linear-gradient(180deg, rgba(24,24,30,.86), rgba(8,8,11,.9))',
            border: `2px solid ${hsl(hue, 90, 60, 0.55)}`,
            boxShadow: `0 0 ${low ? 40 : 26}px ${hsl(hue, 90, 50, low ? 0.6 : 0.35)}, inset 0 1px 0 rgba(255,255,255,.12)`,
            animation: low && !paused ? 'sa-pulse .9s ease-in-out infinite' : undefined,
          }}
        >
          {paused && !ended && <PauseChip />}
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '.02em',
              textShadow: `0 0 22px ${hsl(hue, 90, 55, 0.55)}`,
              ...clockColor(ended),
            }}
          >
            {h}
            {colon}
            {m}
            {colon}
            {s}
          </span>
          <HealFlash hit={view.hit} healing={view.healing} hue={hue} radius={22} spread={8} />
        </div>
        {percent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 440 }}>
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 99,
                background: 'rgba(0,0,0,.6)',
                overflow: 'hidden',
                boxShadow: '0 0 0 1px rgba(255,255,255,.12)',
              }}
            >
              {/* Slid, not resized, for the same reason as the health bar's fill. */}
              <div
                style={{
                  height: '100%',
                  transform: `translateX(${(shown - 1) * 100}%)`,
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${hsl(hue, 85, 45)}, ${hsl(hue, 95, 68)})`,
                  boxShadow: `0 0 12px ${hsl(hue, 95, 60, 0.8)}`,
                  transition: `transform ${view.ease}`,
                }}
              />
            </div>
            <span
              className="sa-shadow"
              style={{ fontSize: 18, fontWeight: 700, width: 52, textAlign: 'right' }}
            >
              {percent}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

const RING_SIZE = 196;
const RING_STROKE = 18;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function RingView(view: ViewProps) {
  const { left, shown, paused, ended, low, hue, title, percent } = view;
  const angle = shown * 2 * Math.PI - Math.PI / 2;
  const center = RING_SIZE / 2;

  return (
    <>
      <PopBand pops={view.pops} hue={hue} x={58} height={POP_BAND} />
      <div
        style={{
          position: 'absolute',
          inset: `${POP_BAND}px 0 0`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: RING_SIZE,
            height: RING_SIZE,
            animation: low && !paused ? 'sa-pulse .9s ease-in-out infinite' : undefined,
          }}
        >
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            aria-hidden="true"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="sa-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={hsl(hue, 95, 72)} />
                <stop offset="1" stopColor={hsl(hue, 85, 42)} />
              </linearGradient>
            </defs>
            <circle
              cx={center}
              cy={center}
              r={RING_RADIUS + RING_STROKE / 2 + 4}
              fill="rgba(8,8,11,.82)"
            />
            <circle
              cx={center}
              cy={center}
              r={RING_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,.1)"
              strokeWidth={RING_STROKE}
            />
            <circle
              cx={center}
              cy={center}
              r={RING_RADIUS}
              fill="none"
              stroke="url(#sa-ring)"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - shown)}
              transform={`rotate(-90 ${center} ${center})`}
              style={{
                filter: `drop-shadow(0 0 10px ${hsl(hue, 95, 55, 0.8)})`,
                transition: `stroke-dashoffset ${view.ease}`,
                opacity: paused ? 0.55 : 1,
              }}
            />
            {shown > 0 && (
              <circle
                cx={center + RING_RADIUS * Math.cos(angle)}
                cy={center + RING_RADIUS * Math.sin(angle)}
                r={RING_STROKE / 2 - 3}
                fill="#fff"
                style={{ filter: `drop-shadow(0 0 6px ${hsl(hue, 100, 75)})` }}
              />
            )}
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {ended ? null : paused ? (
              <PauseChip />
            ) : percent ? (
              <span className="sa-shadow" style={{ fontSize: 42, fontWeight: 800 }}>
                {percent}
              </span>
            ) : (
              <HeartIcon hue={hue} beat={view.beat} />
            )}
          </div>
          <HealFlash hit={view.hit} healing={view.healing} hue={hue} radius="50%" spread={10} />
          {ended && <KnockOut size={54} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          {title && (
            <span className="sa-title sa-shadow" style={{ fontSize: 24, color: hsl(hue, 95, 72) }}>
              {title}
            </span>
          )}
          <span
            className="sa-shadow"
            style={{ fontSize: 72, fontWeight: 800, lineHeight: 1, ...clockColor(ended) }}
          >
            {formatClock(left)}
          </span>
        </div>
      </div>
    </>
  );
}
