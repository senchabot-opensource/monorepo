import type { CSSProperties } from 'react';
import { barFrameStyle, fillBackground, fillLayers, trackBackground } from '#/features/presets/bar';
import { Frame } from '#/features/presets/frame';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import type { GoalSettings } from '#/lib/goal-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { hueFor, OVERLAY_FONT_FAMILY as FONT_FAMILY, PLATFORM_COLORS } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { CELEBRATE_MS, type GoalHit, type GoalPop, POP_MS, useGoal } from './use-goal';

/** Design size; the overlay scales to fill whatever browser source size it gets. */
const STAGE = { width: 800, height: 260 };

// Bottom up: margin, the bar, a gap, the title and count row; the rising pops use the rest.
const BAR_BOTTOM = 30;
const BAR_HEIGHT = 56;
const BAR_GAP = 10;
const INFO_ROW_HEIGHT = 44;
const POP_BAND = STAGE.height - BAR_BOTTOM - BAR_HEIGHT - BAR_GAP - INFO_ROW_HEIGHT;
const BAR_CENTER = STAGE.height - BAR_BOTTOM - BAR_HEIGHT / 2;

// A small goal gets a segment per sub; past this many, lines every 10%.
const MAX_SEGMENTS = 20;
const GOLD_HUE = 42;
const SPARK_COUNT = 14;
const SPARKS = Array.from({ length: SPARK_COUNT }, (_, index) => index);

const CSS = `
.sg-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.sg-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.sg-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.55)}
.sg-title{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-style:italic}
@keyframes sg-ghost{0%{opacity:1}100%{opacity:0}}
@keyframes sg-sheen{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}
@keyframes sg-stripes{0%{transform:translateX(0)}100%{transform:translateX(28px)}}
@keyframes sg-bump{0%{transform:scale(1)}30%{transform:scale(1.22)}100%{transform:scale(1)}}
@keyframes sg-pop{0%{transform:translate(-50%,12px) scale(.6);opacity:0}12%{transform:translate(-50%,-6px) scale(1.12);opacity:1}24%{transform:translate(-50%,-12px) scale(1)}78%{opacity:1}100%{transform:translate(-50%,-40px) scale(.96);opacity:0}}
@keyframes sg-glow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.5)}}
@keyframes sg-trophy{0%{transform:translate(-50%,-50%) scale(2.6) rotate(-14deg);opacity:0}45%{transform:translate(-50%,-50%) scale(.9) rotate(4deg);opacity:1}60%{transform:translate(-50%,-50%) scale(1.08) rotate(-2deg)}75%{transform:translate(-50%,-50%) scale(1) rotate(0)}88%{opacity:1}100%{transform:translate(-50%,-62%) scale(.9);opacity:0}}
@keyframes sg-ring{0%{transform:translate(-50%,-50%) scale(.2);opacity:.95}100%{transform:translate(-50%,-50%) scale(3.4);opacity:0}}
@keyframes sg-spark{0%{transform:rotate(var(--a)) translateY(-18px) scale(1);opacity:1}100%{transform:rotate(var(--a)) translateY(var(--d)) scale(.3);opacity:0}}
`;


interface GoalWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<GoalSettings, 'platforms'>;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function GoalWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simPlatform,
  previewId,
}: GoalWidgetProps) {
  const scale = useFitScale(STAGE);
  const { count, progress, reached, celebration, pops, hit } = useGoal({
    twitch: twitchChannel,
    kick: kickChannel,
    start: settings.start,
    target: settings.target,
    simulate,
    simPlatform,
    previewId,
  });
  const hue = hueFor(settings.color, 1);
  const skin = skinFor(settings.preset);

  return (
    <SkinProvider skin={skin}>
      <div className="sg-root" data-testid="goal" data-reached={reached} data-preset={skin?.id}>
        <style>{CSS + skinCss('sg', skin)}</style>
        <div className="sg-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {settings.pops && <PopBand pops={pops} hue={hue} x={progress * 100} />}
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
            <InfoRow
              title={settings.title}
              count={count}
              target={settings.target}
              hue={hue}
              reached={reached}
              hit={hit}
            />
            <Bar
              progress={progress}
              target={settings.target}
              hue={hue}
              hit={hit}
              celebrating={celebration !== null}
            />
          </div>
          {celebration !== null && <Celebration key={celebration} />}
        </div>
      </div>
    </SkinProvider>
  );
}

function StarIcon({ hue, hit }: { hue: number; hit: GoalHit | null }) {
  const hsl = painter(useSkin(), hue);
  return (
    <svg
      key={hit?.up ? hit.key : undefined}
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      style={{
        filter: `drop-shadow(0 0 8px ${hsl(90, 55, 0.8)})`,
        animation: hit?.up ? 'sg-bump .5s ease-out' : undefined,
      }}
    >
      <path
        d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8Z"
        fill={hsl(90, 60)}
        stroke="rgba(0,0,0,.55)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon({ size, glow }: { size: number; glow: string }) {
  const gold = painter(useSkin(), GOLD_HUE, 'win');
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 ${size / 4}px ${glow})`, overflow: 'visible' }}
    >
      <path
        d="M7 3.5h10v5a5 5 0 0 1-10 0Zm0 1.5H3.5v1.5A3.5 3.5 0 0 0 7 10m10-5h3.5v1.5A3.5 3.5 0 0 1 17 10m-5 3.5v3.5m-4 3.5h8l-1-3.5H9Z"
        fill={gold(95, 58)}
        stroke={gold(70, 22)}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9.5 5.5v3" stroke="rgba(255,255,255,.7)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function InfoRow({
  title,
  count,
  target,
  hue,
  reached,
  hit,
}: {
  title: string;
  count: number;
  target: number;
  hue: number;
  reached: boolean;
  hit: GoalHit | null;
}) {
  const skin = useSkin();
  const gold = painter(skin, GOLD_HUE, 'win');
  return (
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
        {reached ? (
          <TrophyIcon size={28} glow={gold(95, 55, 0.8)} />
        ) : (
          <StarIcon hue={hue} hit={hit} />
        )}
        {title && (
          <span
            className="sg-title sg-shadow"
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
      </div>
      <span
        className="sg-shadow"
        style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontWeight: 800, lineHeight: 1 }}
      >
        <span
          key={hit?.up ? hit.key : undefined}
          style={{
            fontSize: 44,
            color: reached ? gold(100, 72) : (skin?.text ?? '#fff'),
            transformOrigin: 'right bottom',
            animation: hit?.up ? 'sg-bump .5s ease-out' : undefined,
          }}
        >
          {count}
        </span>
        <span style={{ fontSize: 28, opacity: 0.7 }}>/ {target}</span>
      </span>
    </div>
  );
}

function Bar({
  progress,
  target,
  hue,
  hit,
  celebrating,
}: {
  progress: number;
  target: number;
  hue: number;
  hit: GoalHit | null;
  celebrating: boolean;
}) {
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const glow = celebrating ? painter(skin, GOLD_HUE, 'win') : hsl;
  const layers = fillLayers(skin);
  const segments = target <= MAX_SEGMENTS ? target : 10;
  const ticks = Array.from({ length: segments - 1 }, (_, index) => ((index + 1) / segments) * 100);
  const glowShadow = `0 0 ${celebrating ? 38 : 22}px ${glow(90, 50, celebrating ? 0.8 : 0.45)}`;
  const barStyle: CSSProperties = {
    position: 'relative',
    height: BAR_HEIGHT,
    transform: 'skewX(-14deg)',
    borderRadius: 6,
    padding: 4,
    background: 'linear-gradient(180deg, #2a2a33 0%, #0c0c10 100%)',
    boxShadow: `0 0 0 2px rgba(0,0,0,.85), ${glowShadow}, inset 0 1px 0 rgba(255,255,255,.18)`,
    ...(skin && barFrameStyle(skin, glowShadow)),
    animation: celebrating ? 'sg-glow .7s ease-in-out 5' : undefined,
    transition: 'box-shadow .4s',
  };

  return (
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
              background: hit.up ? '#ffffff' : '#ef4444',
              animation: `sg-ghost ${hit.up ? 900 : 1300}ms ease-out forwards`,
            }}
          />
        )}
        {/* Slid, not resized, so the fill's move stays on the compositor, as in Subathon Timer. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${(progress - 1) * 100}%)`,
            background: skin
              ? fillBackground(skin, hsl)
              : `linear-gradient(180deg, ${hsl(95, 72)} 0%, ${hsl(88, 52)} 42%, ${hsl(85, 34)} 100%)`,
            boxShadow: `inset -3px 0 0 ${hsl(100, 85)}`,
            transition: 'transform .7s cubic-bezier(.2,.9,.3,1.1)',
            overflow: 'hidden',
          }}
        >
          {layers.stripes && (
            <div
              // One tile wider on the left, so sliding it a tile never shows an edge.
              style={{
                position: 'absolute',
                inset: '0 0 0 -28px',
                background:
                  'repeating-linear-gradient(115deg, rgba(255,255,255,.14) 0 10px, transparent 10px 20px)',
                backgroundSize: '28px 100%',
                animation: 'sg-stripes 1.6s linear infinite',
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
                background: 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))',
                borderRadius: 2,
              }}
            />
          )}
          {hit?.up && (
            // The fill is shifted left, so start the sweep where it becomes visible.
            <div
              key={hit.key}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${(1 - progress) * 100}%`,
                width: `${progress * 40}%`,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent)',
                animation: 'sg-sheen .8s ease-out forwards',
              }}
            />
          )}
        </div>
        {ticks.map((tick) => (
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
      </div>
      {skin && <Frame skin={skin} radius={6} />}
    </div>
  );
}

/** A trophy that lands on the bar, with a ring and sparks bursting out of it. */
function Celebration() {
  const gold = painter(useSkin(), GOLD_HUE, 'win');
  const center: CSSProperties = { position: 'absolute', left: '50%', top: BAR_CENTER };
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      data-testid="goal-celebration"
    >
      <div
        style={{
          ...center,
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: `4px solid ${gold(100, 70)}`,
          boxShadow: `0 0 24px ${gold(100, 60, 0.8)}`,
          // Hidden until its delay is up; the burst waits for the trophy to land.
          opacity: 0,
          animation: 'sg-ring 1s ease-out .25s forwards',
        }}
      />
      {SPARKS.map((spark) => (
        <span
          key={spark}
          style={
            {
              ...center,
              width: 8,
              height: 18,
              marginLeft: -4,
              marginTop: -9,
              borderRadius: 4,
              background: spark % 2 ? gold(100, 70) : '#fff',
              opacity: 0,
              '--a': `${(spark / SPARK_COUNT) * 360}deg`,
              '--d': `${-90 - (spark % 3) * 26}px`,
              animation: `sg-spark .9s cubic-bezier(.2,.8,.3,1) ${0.25 + (spark % 3) * 0.06}s forwards`,
            } as CSSProperties
          }
        />
      ))}
      <div
        style={{
          ...center,
          animation: `sg-trophy ${CELEBRATE_MS}ms cubic-bezier(.2,.9,.3,1.2) both`,
        }}
      >
        <TrophyIcon size={104} glow={gold(100, 55, 0.9)} />
      </div>
    </div>
  );
}


// Pops that land close together rise side by side instead of on top of each other. Keyed by
// pop id, so a pop keeps its spot when an older one disappears.
const POP_OFFSETS = [0, -17, 17];

// A pop starts 12px below where it settles; this gap keeps it off the count row under the band.
const POP_GAP = 12;

/** Floating "+1" numbers with who they came from, rising from the fill's edge. */
function PopBand({ pops, hue, x }: { pops: GoalPop[]; hue: number; x: number }) {
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const base = Math.min(70, Math.max(30, x));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: POP_BAND - POP_GAP }}>
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
            animation: `sg-pop ${POP_MS}ms cubic-bezier(.2,.8,.3,1) both`,
            pointerEvents: 'none',
          }}
        >
          <span
            className="sg-shadow"
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: hsl(100, 78),
              WebkitTextStroke: `1.5px ${hsl(80, 22)}`,
            }}
          >
            +{pop.amount}
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
            <span style={{ color: PLATFORM_COLORS[pop.event.platform] }}>
              {pop.event.kind === 'gift' ? '🎁' : '★'}
            </span>
            {pop.event.name && (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pop.event.name}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
