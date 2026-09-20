import { type CSSProperties, useEffect, useState } from 'react';
import { barFrameStyle, fillBackground, fillLayers, trackBackground } from '#/features/presets/bar';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, type Skin, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { useI18n } from '#/lib/i18n';
import type {
  SubathonSettings,
  SubathonStyle,
  SubathonTimeKey,
  SubathonTimeValues,
} from '#/lib/subathon-url';
import { KickIcon, TwitchIcon } from '../chat-widget/message-parts';
import { hueFor, OVERLAY_FONT_FAMILY as FONT_FAMILY, PLATFORM_COLORS } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import type { SubathonPlatform } from './subathon-events';
import { formatClock, formatDelta } from './subathon-timer';
import {
  BITS_PER_VALUE,
  POP_MS,
  type SubathonHit,
  type SubathonPop,
  useSubathon,
} from './use-subathon';

/** Design size; the overlay scales to fill whatever browser source size it gets. */
const STAGE = { width: 800, height: 300 };

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
@keyframes sa-rates-in{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:none}}
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
  /** The only platform the preview simulates; both when unset. */
  simPlatform?: SubathonPlatform;
  /** Pairs the preview with its setup page's test buttons. */
  previewId?: string;
}

export function SubathonWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simSpeed,
  simPlatform,
  previewId,
}: SubathonWidgetProps) {
  const scale = useFitScale(STAGE);
  const { left, health, paused, ended, pops, hit } = useSubathon({
    twitch: twitchChannel,
    kick: kickChannel,
    values: settings,
    simulate,
    simSpeed,
    simPlatform,
    previewId,
  });
  const healing = useHealing(hit);
  const shown = ended ? 0 : health;
  const platforms: SubathonPlatform[] = simulate
    ? simPlatform
      ? [simPlatform]
      : ['twitch', 'kick']
    : [...(twitchChannel ? ['twitch' as const] : []), ...(kickChannel ? ['kick' as const] : [])];
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
    rates: settings.rates ? rateRows(settings, platforms, left) : [],
  };
  const View = VIEWS[settings.style];
  const skin = skinFor(settings.preset);

  return (
    <SkinProvider skin={skin}>
      <div
        className="sa-root"
        data-testid="subathon"
        data-style={settings.style}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('sa', skin)}</style>
        <div className="sa-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <View {...view} />
        </div>
      </div>
    </SkinProvider>
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
  /** What each event adds, for viewers; empty when turned off. */
  rates: RateRow[];
}

const VIEWS: Record<SubathonStyle, (props: ViewProps) => React.JSX.Element> = {
  bar: HealthBarView,
  clock: ClockView,
  ring: RingView,
};


/** Color of the time left: red and blinking once it's over. */
const clockColor = (ended: boolean, skin: Skin | null): CSSProperties => ({
  color: ended ? '#f87171' : (skin?.text ?? '#fff'),
  animation: ended ? 'sa-blink 1s steps(2) infinite' : undefined,
});

function HeartIcon({ hue, beat }: { hue: number; beat: number | null }) {
  const hsl = painter(useSkin(), hue);
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      style={{
        filter: `drop-shadow(0 0 8px ${hsl(90, 55, 0.8)})`,
        animation: beat ? `sa-beat ${beat}s ease-in-out infinite` : undefined,
      }}
    >
      <path
        d="M12 21s-7.5-4.6-10-9.2C.3 8.5 2.2 4 6.3 4c2.4 0 4 1.4 5.7 3.4C13.7 5.4 15.3 4 17.7 4 21.8 4 23.7 8.5 22 11.8 19.5 16.4 12 21 12 21Z"
        fill={hsl(90, 58)}
        stroke="rgba(0,0,0,.55)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PauseChip() {
  const skin = useSkin();
  return (
    <span
      role="img"
      aria-label="Paused"
      style={{
        display: 'inline-flex',
        gap: 5,
        padding: '7px 10px',
        borderRadius: skin ? 8 * skin.radius : 8,
        background: skin ? skin.panel2 : 'rgba(0,0,0,.6)',
        border: `1px solid ${skin ? skin.frame2 : 'rgba(255,255,255,.18)'}`,
        animation: 'sa-blink 1.6s ease-in-out infinite',
      }}
    >
      <span style={{ width: 5, height: 16, borderRadius: 2, background: skin?.text ?? '#fff' }} />
      <span style={{ width: 5, height: 16, borderRadius: 2, background: skin?.text ?? '#fff' }} />
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
  const hsl = painter(useSkin(), hue);
  if (!hit || !healing) return null;
  return (
    <div
      key={hit.key}
      style={{
        position: 'absolute',
        inset: -2,
        borderRadius: radius,
        boxShadow: `0 0 ${spread * 4}px ${spread}px ${hsl(100, 70, 0.9)}`,
        animation: 'sa-flash .7s ease-out forwards',
        pointerEvents: 'none',
      }}
    />
  );
}


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
  const skin = useSkin();
  const hsl = painter(skin, hue);
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
              color: hsl(100, 78),
              WebkitTextStroke: `1.5px ${hsl(80, 22)}`,
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
              background: skin ? skin.panel2 : 'rgba(0,0,0,.7)',
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

type RateKind = 'sub' | 'gift' | 'bits';

interface RateRow {
  platforms: SubathonPlatform[];
  items: { kind: RateKind; seconds: number }[];
}

const RATE_KINDS: RateKind[] = ['sub', 'gift', 'bits'];
const RATE_KEYS: Record<SubathonPlatform, Record<RateKind, SubathonTimeKey>> = {
  twitch: { sub: 'tsub', gift: 'tgift', bits: 'bits' },
  kick: { sub: 'ksub', gift: 'kgift', bits: 'kicks' },
};

/** One row per platform, or one for both when their values match. Events set to 0 are left out. */
function rateRows(values: SubathonTimeValues, platforms: SubathonPlatform[], remainingMs: number): RateRow[] {
  const useTier2 = values.shift > 0 && remainingMs >= values.shift * 1000;
  const val = (platform: SubathonPlatform, kind: RateKind) => {
    const key = RATE_KEYS[platform][kind];
    return useTier2 ? values[`${key}2` as keyof SubathonTimeValues] as number : values[key];
  };

  const rows = platforms
    .map((platform) => ({
      platforms: [platform],
      items: RATE_KINDS.map((kind) => ({
        kind,
        seconds: val(platform, kind),
      })).filter((item) => item.seconds > 0),
    }))
    .filter((row) => row.items.length > 0);
  const [first, second] = rows;
  const same =
    second &&
    first.items.length === second.items.length &&
    first.items.every(
      (item, i) => item.kind === second.items[i].kind && item.seconds === second.items[i].seconds,
    );
  return same ? [{ platforms: ['twitch', 'kick'], items: first.items }] : rows;
}

// Long enough to read a row of three, short enough that the other platform's row comes soon.
const RATES_TURN_MS = 6000;

/** "Sub +15 min · Gift Sub +10 min · 500 Bits +25 min"; two rows take turns. */
function RateStrip({ rows }: { rows: RateRow[] }) {
  const { t } = useI18n();
  const skin = useSkin();
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    if (rows.length < 2) return;
    const timer = window.setInterval(() => setTurn((n) => n + 1), RATES_TURN_MS);
    return () => window.clearInterval(timer);
  }, [rows.length]);

  const index = turn % rows.length;
  const row = rows[index];
  const amount = BITS_PER_VALUE;
  const label = (kind: RateKind) => {
    if (kind === 'sub') return t('subathon.rateSub');
    if (kind === 'gift') return t('subathon.rateGift');
    if (row.platforms.length > 1) return t('subathon.rateBitsKicks', { amount });
    return t(row.platforms[0] === 'twitch' ? 'subathon.rateBits' : 'subathon.rateKicks', {
      amount,
    });
  };
  const time = (seconds: number) =>
    seconds % 3600 === 0
      ? `+${seconds / 3600} ${t('subathon.unitHours')}`
      : seconds % 60 === 0
        ? `+${seconds / 60} ${t('subathon.unitMinutes')}`
        : `+${formatDelta(seconds * 1000)}`;

  return (
    <div
      key={index}
      data-testid="subathon-rates"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '4px 14px',
        borderRadius: skin ? 999 * skin.radius : 999,
        background: skin ? skin.panel2 : 'rgba(0,0,0,.62)',
        border: `1px solid ${skin ? skin.frame2 : 'rgba(255,255,255,.14)'}`,
        fontSize: 17,
        fontWeight: 700,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        animation: rows.length > 1 ? 'sa-rates-in .45s ease-out' : undefined,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {row.platforms.map((platform) =>
          platform === 'twitch' ? (
            <TwitchIcon key={platform} style={{ color: PLATFORM_COLORS.twitch }} />
          ) : (
            <KickIcon key={platform} style={{ color: PLATFORM_COLORS.kick }} />
          ),
        )}
      </span>
      {row.items.map((item) => (
        <span key={item.kind}>
          <span style={{ color: skin?.muted ?? 'rgba(255,255,255,.7)' }}>{label(item.kind)}</span>{' '}
          <span style={{ color: skin?.text ?? '#fff' }}>{time(item.seconds)}</span>
        </span>
      ))}
    </div>
  );
}

function HealthBarView(view: ViewProps) {
  const { left, shown, paused, ended, low, critical, hue, title, percent, hit, healing } = view;
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const layers = fillLayers(skin);
  const glow = `0 0 ${low ? 34 : 22}px ${hsl(90, 50, low ? 0.7 : 0.45)}`;
  const barStyle: CSSProperties = {
    position: 'relative',
    height: BAR_HEIGHT,
    transform: 'skewX(-14deg)',
    borderRadius: 6,
    padding: 4,
    background: 'linear-gradient(180deg, #2a2a33 0%, #0c0c10 100%)',
    boxShadow: `0 0 0 2px rgba(0,0,0,.85), ${glow}, inset 0 1px 0 rgba(255,255,255,.18)`,
    ...(skin && barFrameStyle(skin, glow)),
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
              borderRadius: skin ? 3 * skin.radius : 3,
              background: skin
                ? trackBackground(skin)
                : 'repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 14px, transparent 14px 28px), linear-gradient(180deg, #16161c, #07070a)',
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
                background: skin
                  ? fillBackground(skin, hsl)
                  : `linear-gradient(180deg, ${hsl(95, 72)} 0%, ${hsl(88, 52)} 42%, ${hsl(85, 34)} 100%)`,
                boxShadow: `inset -3px 0 0 ${hsl(100, 85)}`,
                transition: `transform ${view.ease}, background .4s`,
                filter: paused ? 'saturate(.35) brightness(.85)' : undefined,
                overflow: 'hidden',
              }}
            >
              {layers.stripes && (
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
              )}
              {layers.gloss && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 4,
                    height: '32%',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))',
                    borderRadius: 2,
                  }}
                />
              )}
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
                  width: layers.tickWidth,
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
                  // Undoes the bar's slant, so the digits stand upright.
                  transform: `translateY(-50%) skewX(${skin ? -skin.skew : 14}deg)`,
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
          {skin && <Frame skin={skin} radius={6} />}
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
            style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, ...clockColor(ended, skin) }}
          >
            {formatClock(left)}
          </span>
        </div>
        {/* In the margin under the title row, so the bar stays where it was without them. */}
        {view.rates.length > 0 && (
          <div style={{ position: 'absolute', left: 10, bottom: 2 }}>
            <RateStrip rows={view.rates} />
          </div>
        )}
      </div>
    </>
  );
}

function ClockView(view: ViewProps) {
  const { left, shown, paused, ended, low, hue, title, percent } = view;
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const glow = `0 0 ${low ? 40 : 26}px ${hsl(90, 50, low ? 0.6 : 0.35)}`;
  const panel = skin && panelStyle(skin, 22);
  // The rates take a row, so the clock shrinks to keep it all under the pop band.
  const compact = view.rates.length > 0;
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
          gap: compact ? 6 : 10,
        }}
      >
        {title && (
          <span className="sa-title sa-shadow" style={{ fontSize: 24, color: hsl(95, 72) }}>
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
            border: `2px solid ${hsl(90, 60, 0.55)}`,
            boxShadow: `${glow}, inset 0 1px 0 rgba(255,255,255,.12)`,
            ...(panel && {
              ...panel,
              border: undefined,
              boxShadow: [panel.boxShadow, glow].filter(Boolean).join(','),
            }),
            animation: low && !paused ? 'sa-pulse .9s ease-in-out infinite' : undefined,
          }}
        >
          {paused && !ended && <PauseChip />}
          <span
            style={{
              fontSize: compact ? 72 : 96,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '.02em',
              textShadow: `0 0 22px ${hsl(90, 55, 0.55)}`,
              ...clockColor(ended, skin),
            }}
          >
            {h}
            {colon}
            {m}
            {colon}
            {s}
          </span>
          <HealFlash hit={view.hit} healing={view.healing} hue={hue} radius={22} spread={8} />
          {skin && <Frame skin={skin} radius={22} />}
        </div>
        {percent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 440 }}>
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: skin ? 99 * skin.radius : 99,
                background: skin ? skin.track : 'rgba(0,0,0,.6)',
                overflow: 'hidden',
                boxShadow: '0 0 0 1px rgba(255,255,255,.12)',
              }}
            >
              {/* Slid, not resized, for the same reason as the health bar's fill. */}
              <div
                style={{
                  height: '100%',
                  transform: `translateX(${(shown - 1) * 100}%)`,
                  borderRadius: skin ? 99 * skin.radius : 99,
                  background: `linear-gradient(90deg, ${hsl(85, 45)}, ${hsl(95, 68)})`,
                  boxShadow: `0 0 12px ${hsl(95, 60, 0.8)}`,
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
        {view.rates.length > 0 && <RateStrip rows={view.rates} />}
      </div>
    </>
  );
}

const RING_SIZE = 196;
const RING_STROKE = 18;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
// The backdrop disc and the stroke's glow reach past the ring's box; centered in the 200px under
// the pop band, the 800x300 source cut the ring's bottom flat.
const RING_BOTTOM_ROOM = 16;

function RingView(view: ViewProps) {
  const { left, shown, paused, ended, low, hue, title, percent } = view;
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const angle = shown * 2 * Math.PI - Math.PI / 2;
  const center = RING_SIZE / 2;

  return (
    <>
      <PopBand pops={view.pops} hue={hue} x={58} height={POP_BAND} />
      <div
        style={{
          position: 'absolute',
          inset: `${POP_BAND}px 0 ${RING_BOTTOM_ROOM}px`,
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
                <stop offset="0" stopColor={hsl(95, 72)} />
                <stop offset="1" stopColor={hsl(85, 42)} />
              </linearGradient>
            </defs>
            <circle
              cx={center}
              cy={center}
              r={RING_RADIUS + RING_STROKE / 2 + 4}
              fill={skin ? skin.panel2 : 'rgba(8,8,11,.82)'}
              stroke={skin?.frame}
              strokeWidth={skin ? 2 : undefined}
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
              strokeLinecap={skin && skin.radius === 0 ? 'butt' : 'round'}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - shown)}
              transform={`rotate(-90 ${center} ${center})`}
              style={{
                filter: `drop-shadow(0 0 10px ${hsl(95, 55, 0.8)})`,
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
                style={{ filter: `drop-shadow(0 0 6px ${hsl(100, 75)})` }}
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
            <span className="sa-title sa-shadow" style={{ fontSize: 24, color: hsl(95, 72) }}>
              {title}
            </span>
          )}
          <span
            className="sa-shadow"
            style={{ fontSize: 72, fontWeight: 800, lineHeight: 1, ...clockColor(ended, skin) }}
          >
            {formatClock(left)}
          </span>
          {view.rates.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <RateStrip rows={view.rates} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
