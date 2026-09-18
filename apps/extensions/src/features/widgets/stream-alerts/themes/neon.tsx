import type { CSSProperties } from 'react';
import { diamond, EventIcon, hsl } from './shared';
import type { AlertViewProps } from './types';

// Oxanium has latin-ext, so Turkish headings (YENİ ABONE) keep their own glyphs.
export const NEON_FONT =
  'https://fonts.googleapis.com/css2?family=Oxanium:wght@500;600;800&display=swap';

// Banner outline on the 800×320 stage: pointed ends and a notch on top that holds the badge.
const BANNER = '64,160 108,98 346,98 362,114 438,114 454,98 692,98 736,160 692,222 108,222';
const BANNER_INNER =
  '77,160 113,106 343,106 359,122 441,122 457,106 687,106 723,160 687,214 113,214';
const BADGE = { x: 400, y: 76 };
const DIAMOND = (r: number) => diamond(BADGE.x, BADGE.y, r);
const SPARK_ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
// Motes that drift up off the banner while the alert holds: [x, delay s, size px].
const MOTES: [number, number, number][] = [
  [140, 0.2, 3],
  [212, 1.4, 2],
  [288, 0.7, 4],
  [356, 2.1, 2],
  [452, 1.1, 3],
  [520, 0.4, 2],
  [598, 1.8, 4],
  [664, 0.9, 3],
];

const ENTER_MS = 900;
const OUT_MS = 700;

const CSS = `
.na{position:absolute;inset:0;font-family:'Oxanium',ui-sans-serif,system-ui,sans-serif;color:#fff;
  -webkit-font-smoothing:antialiased}
.na svg{position:absolute;inset:0;overflow:visible}
.na svg *{transform-box:view-box}
.na-banner{transform-origin:400px 160px;animation:na-banner-in .52s cubic-bezier(.2,.9,.3,1) both}
.na-draw{stroke-dasharray:1;animation:na-draw .9s .1s cubic-bezier(.5,0,.2,1) both}
.na-badge{transform-origin:${BADGE.x}px ${BADGE.y}px;animation:na-badge-in .65s .15s cubic-bezier(.3,1.4,.5,1) both}
.na-spin{transform-origin:${BADGE.x}px ${BADGE.y}px;animation:na-spin 9s linear infinite}
.na-glow{animation:na-glow 1.6s ease-in-out ${ENTER_MS}ms infinite}
.na-burst{transform-origin:${BADGE.x}px ${BADGE.y}px;animation:na-burst .75s .3s ease-out both}
.na-spark{animation:na-spark .6s .3s ease-out both}
.na-sweep{animation:na-sweep 2.8s ${ENTER_MS}ms ease-in-out infinite}
.na-chev{animation:na-chev 1.2s ${ENTER_MS}ms ease-in-out infinite both}
.na-rise{animation:na-rise .5s cubic-bezier(.2,.8,.3,1) both}
.na-letter{display:inline-block;white-space:pre;animation:na-letter .42s cubic-bezier(.2,1.3,.4,1) both}
.na-mote{position:absolute;border-radius:1px;animation:na-mote 2.6s ease-out infinite both}
@keyframes na-banner-in{0%{transform:scaleX(.06);opacity:0}60%{transform:scaleX(1.03);opacity:1}100%{transform:scaleX(1)}}
@keyframes na-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes na-badge-in{0%{transform:translateY(-44px) scale(.2) rotate(-135deg);opacity:0}60%{transform:scale(1.15) rotate(8deg);opacity:1}100%{transform:none;opacity:1}}
@keyframes na-spin{to{transform:rotate(360deg)}}
@keyframes na-glow{0%,100%{opacity:.35}50%{opacity:.85}}
@keyframes na-burst{0%{transform:scale(.3);opacity:.95}100%{transform:scale(2.6);opacity:0}}
@keyframes na-spark{0%{transform:translateX(0);opacity:1}100%{transform:translateX(38px);opacity:0}}
@keyframes na-sweep{0%{transform:translateX(-300px) skewX(-20deg)}55%,100%{transform:translateX(1000px) skewX(-20deg)}}
@keyframes na-chev{0%,100%{opacity:.15}40%{opacity:1}}
@keyframes na-rise{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}
@keyframes na-letter{from{transform:translateY(16px) scale(.7);opacity:0}to{transform:none;opacity:1}}
@keyframes na-mote{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(-70px);opacity:0}}
/* Leaves like a neon sign switching off: two flickers, then it fades while drifting up. */
@keyframes na-out{0%{opacity:1;transform:none}16%{opacity:.25}24%{opacity:1}38%{opacity:.12}46%{opacity:.8}100%{opacity:0;transform:translateY(-18px)}}
`;

/** Font size that fits a name of this many characters on the banner. */
const nameSize = (length: number) => Math.round(Math.max(22, Math.min(40, 600 / (length * 0.72))));

export function NeonAlert({
  id,
  kind,
  hue,
  heading,
  name,
  detail,
  message,
  platformTag,
  durationMs,
}: AlertViewProps) {
  const accent = hsl(hue, 100, 62);
  const soft = hsl(hue, 100, 80);
  const letters = Array.from(name);
  const glowText: CSSProperties = {
    textShadow: `0 0 12px ${hsl(hue, 100, 55, 0.7)}, 0 2px 0 rgba(0,0,0,.6)`,
  };
  const gradient = `na-fill-${id}`;
  const clip = `na-clip-${id}`;
  const sweep = `na-sweepfill-${id}`;
  const glow = `na-glowfill-${id}`;

  return (
    <div
      className="na"
      style={{
        animation: `na-out ${OUT_MS}ms ${durationMs - OUT_MS}ms ease-in forwards`,
      }}
    >
      <style>{CSS}</style>
      <svg viewBox="0 0 800 320" width="800" height="320" aria-hidden="true">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={hsl(hue, 70, 15, 0.94)} />
            <stop offset="1" stopColor={hsl(hue, 80, 5, 0.96)} />
          </linearGradient>
          <linearGradient id={sweep} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={glow}>
            <stop offset="0" stopColor={hsl(hue, 100, 55)} stopOpacity=".24" />
            <stop offset="1" stopColor={hsl(hue, 100, 55)} stopOpacity="0" />
          </radialGradient>
          <clipPath id={clip}>
            <polygon points={BANNER} />
          </clipPath>
        </defs>

        <g className="na-banner">
          <polygon points={BANNER} fill={`url(#${gradient})`} />
          <g clipPath={`url(#${clip})`}>
            <ellipse cx="400" cy="165" rx="320" ry="80" fill={`url(#${glow})`} />
            <rect
              className="na-sweep"
              x="0"
              y="80"
              width="140"
              height="160"
              fill={`url(#${sweep})`}
            />
          </g>
          <polygon
            points={BANNER_INNER}
            fill="none"
            stroke={hsl(hue, 100, 70, 0.3)}
            strokeWidth="1"
          />
          {/* Stacked strokes fake the glow; a blur filter costs too much in OBS. */}
          {[
            [12, 0.1],
            [6, 0.22],
            [2.2, 1],
          ].map(([width, opacity]) => (
            <polygon
              key={width}
              className="na-draw"
              points={BANNER}
              pathLength={1}
              fill="none"
              stroke={accent}
              strokeOpacity={opacity}
              strokeWidth={width}
              strokeLinejoin="round"
            />
          ))}
          <path
            d="M136 98h92M572 98h92M364 222h72"
            stroke={soft}
            strokeWidth="4"
            strokeLinecap="square"
          />
        </g>

        {/* Chevrons on both ends, pulsing outward. */}
        {[0, 1, 2].map((i) => (
          <g key={i} className="na-chev" style={{ animationDelay: `${ENTER_MS + i * 150}ms` }}>
            <polyline
              points={`${50 - i * 16},146 ${36 - i * 16},160 ${50 - i * 16},174`}
              fill="none"
              stroke={accent}
              strokeWidth="3"
            />
            <polyline
              points={`${750 + i * 16},146 ${764 + i * 16},160 ${750 + i * 16},174`}
              fill="none"
              stroke={accent}
              strokeWidth="3"
            />
          </g>
        ))}

        <circle
          className="na-burst"
          cx={BADGE.x}
          cy={BADGE.y}
          r="34"
          fill="none"
          stroke={soft}
          strokeWidth="3"
        />
        {SPARK_ANGLES.map((angle) => (
          <g key={angle} transform={`rotate(${angle} ${BADGE.x} ${BADGE.y})`}>
            <line
              className="na-spark"
              x1={BADGE.x + 46}
              y1={BADGE.y}
              x2={BADGE.x + 60}
              y2={BADGE.y}
              stroke={soft}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ))}

        <g className="na-badge">
          <circle
            className="na-spin"
            cx={BADGE.x}
            cy={BADGE.y}
            r="50"
            fill="none"
            stroke={accent}
            strokeOpacity=".55"
            strokeWidth="2"
            strokeDasharray="5 11"
          />
          <polygon points={DIAMOND(40)} fill={accent} fillOpacity=".18" />
          <polygon points={DIAMOND(36)} fill={hsl(hue, 70, 10)} stroke={accent} strokeWidth="2.5" />
          <polygon
            points={DIAMOND(29)}
            fill="none"
            stroke={hsl(hue, 100, 75, 0.35)}
            strokeWidth="1"
          />
          <g transform={`translate(${BADGE.x - 15} ${BADGE.y - 15}) scale(1.25)`}>
            <g
              className="na-glow"
              transform="translate(12 12) scale(1.25) translate(-12 -12)"
              fill={accent}
            >
              <EventIcon kind={kind} />
            </g>
            <g fill="#fff">
              <EventIcon kind={kind} />
            </g>
          </g>
        </g>
      </svg>

      {MOTES.map(([x, delay, size]) => (
        <span
          key={x}
          className="na-mote"
          style={{
            left: x,
            top: 206,
            width: size,
            height: size,
            background: soft,
            animationDelay: `${ENTER_MS / 1000 + delay}s`,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 130,
          right: 130,
          top: 126,
          height: 68,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* A username isn't in the alert's language, so no Turkish case rules on it. */}
        <div
          lang="und"
          style={{
            fontSize: nameSize(letters.length),
            fontWeight: 800,
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
            ...glowText,
          }}
        >
          {letters.map((letter, index) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: letters repeat and never reorder.
              key={index}
              className="na-letter"
              style={{ animationDelay: `${420 + Math.min(index, 24) * 28}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div
          className="na-rise"
          style={{
            marginTop: 6,
            fontSize: 18,
            fontWeight: 600,
            color: soft,
            animationDelay: '780ms',
          }}
        >
          {detail}
        </div>
      </div>

      {platformTag && (
        <div
          className="na-rise"
          style={{
            position: 'absolute',
            right: 118,
            top: 196,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '.18em',
            color: hsl(hue, 100, 80, 0.75),
            animationDelay: '900ms',
          }}
        >
          {platformTag}
        </div>
      )}

      <div
        className="na-rise"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 232,
          textAlign: 'center',
          fontSize: 21,
          fontWeight: 800,
          letterSpacing: '.3em',
          textTransform: 'uppercase',
          color: soft,
          animationDelay: '380ms',
          ...glowText,
        }}
      >
        {heading}
      </div>

      {message && (
        <div
          className="na-rise"
          style={{
            position: 'absolute',
            left: 150,
            right: 150,
            top: 268,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.3,
            color: '#e2ebff',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 1px 0 rgba(0,0,0,.7), 0 0 10px rgba(0,0,0,.6)',
            animationDelay: '1000ms',
          }}
        >
          “{message}”
        </div>
      )}
    </div>
  );
}
