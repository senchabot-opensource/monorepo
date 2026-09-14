import type { CSSProperties } from 'react';
import { diamond, EventIcon, hsl } from './shared';
import type { AlertViewProps } from './types';

// Both have latin-ext, so Turkish words keep their own glyphs.
export const CELESTIAL_FONT =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Cormorant+Garamond:ital,wght@1,500;1,600&display=swap';

// A card with cut-in corners on the 800×320 box, as a gold-line frame.
const FRAME =
  'M124 72H676A14 14 0 0 0 690 86V208A14 14 0 0 0 676 222H124A14 14 0 0 0 110 208V86A14 14 0 0 0 124 72Z';
const FRAME_INNER =
  'M129 79H671A11 11 0 0 0 682 90V204A11 11 0 0 0 671 215H129A11 11 0 0 0 118 204V90A11 11 0 0 0 129 79Z';
const BADGE = { x: 400, y: 222 };
const DIAMOND = (r: number) => diamond(BADGE.x, BADGE.y, r);
// Four-point sparkles around the card: [x, y, size, delay s].
const SPARKLES: [number, number, number, number][] = [
  [70, 147, 11, 0.5],
  [730, 147, 11, 0.62],
  [150, 50, 7, 0.74],
  [652, 244, 7, 0.86],
  [96, 236, 6, 0.98],
  [706, 56, 6, 1.1],
  [262, 262, 5, 1.22],
  [540, 36, 5, 1.34],
];
// Faint stars inside the card: [x, y, radius, delay s].
const STARS: [number, number, number, number][] = [
  [150, 100, 1.2, 0.2],
  [186, 188, 0.9, 1.4],
  [228, 124, 1.4, 0.8],
  [270, 200, 1, 2.1],
  [318, 96, 0.9, 1.1],
  [352, 176, 1.2, 0.4],
  [448, 104, 1, 1.7],
  [480, 192, 1.3, 0.6],
  [530, 120, 0.9, 2.4],
  [566, 196, 1.1, 1.2],
  [612, 98, 1.3, 0.1],
  [648, 170, 1, 1.9],
];
const SPARKLE = 'M0-1C.1-.3.3-.1 1 0 .3.1.1.3 0 1-.1.3-.3.1-1 0-.3-.1-.1-.3 0-1Z';

const ENTER_MS = 1100;
const OUT_MS = 800;
// One lap of the lights around the frame, seconds.
const TRACE_S = 4.5;

const CSS = `
.ce{position:absolute;inset:0;color:#fff;-webkit-font-smoothing:antialiased}
.ce svg{position:absolute;inset:0;overflow:visible}
.ce svg *{transform-box:fill-box;transform-origin:center}
.ce-card{animation:ce-rise .7s cubic-bezier(.2,.7,.3,1) both}
.ce-draw{stroke-dasharray:1;animation:ce-draw 1.1s cubic-bezier(.6,0,.3,1) both}
.ce-trace{stroke-dasharray:.07 .93;animation:ce-trace ${TRACE_S}s linear infinite}
.ce-badge{animation:ce-badge .6s .45s cubic-bezier(.3,1.5,.5,1) both}
.ce-halo{animation:ce-halo 2.4s ease-out ${ENTER_MS}ms infinite both}
.ce-sparkle{animation:ce-sparkle-in .6s cubic-bezier(.3,1.6,.5,1) both,ce-twinkle 2.4s ease-in-out infinite}
.ce-star{animation:ce-star 3s ease-in-out infinite both}
.ce-in{animation:ce-in .6s cubic-bezier(.2,.7,.3,1) both}
.ce-letter{display:inline-block;white-space:pre;animation:ce-in .55s cubic-bezier(.2,.7,.3,1) both}
@keyframes ce-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes ce-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ce-trace{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ce-badge{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}
@keyframes ce-halo{0%{opacity:.7;transform:scale(.8)}100%{opacity:0;transform:scale(1.9)}}
@keyframes ce-sparkle-in{from{opacity:0;transform:scale(0) rotate(-90deg)}to{opacity:1;transform:none}}
@keyframes ce-twinkle{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes ce-star{0%,100%{opacity:.25}50%{opacity:.9}}
@keyframes ce-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
/* Leaves quietly: a slow fade that settles down, like the card sinking out of the sky. */
@keyframes ce-out{to{opacity:0;transform:translateY(12px)}}
`;

const SERIF = "'Cormorant Garamond', Georgia, serif";
const DISPLAY = "'Cinzel', Georgia, serif";

/** Font size that fits a name of this many characters inside the card. Cinzel runs wide. */
const nameSize = (length: number) => Math.round(Math.max(20, Math.min(36, 520 / (length * 0.78))));

export function CelestialAlert({
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
  const line = hsl(hue, 70, 70);
  const light = hsl(hue, 85, 86);
  const letters = Array.from(name);
  const fill = `ce-fill-${id}`;
  const glow: CSSProperties = {
    textShadow: `0 0 14px ${hsl(hue, 80, 60, 0.55)}, 0 1px 0 rgba(0,0,0,.7)`,
  };

  return (
    <div
      className="ce"
      style={{ animation: `ce-out ${OUT_MS}ms ${durationMs - OUT_MS}ms ease-in forwards` }}
    >
      <style>{CSS}</style>
      <svg viewBox="0 0 800 320" width="800" height="320" aria-hidden="true">
        <defs>
          <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(234 45% 15%)" stopOpacity=".95" />
            <stop offset="1" stopColor="hsl(246 50% 7%)" stopOpacity=".96" />
          </linearGradient>
        </defs>

        {/* Hairlines out of both sides, ending in the big sparkles. */}
        <g className="ce-in" style={{ animationDelay: '600ms' }} stroke={line} strokeWidth="1">
          <path d="M84 147H104M696 147H716" strokeOpacity=".8" />
          <path d="M30 147H56M744 147H770" strokeOpacity=".45" />
          <path d="M300 262H372M428 262H500" strokeOpacity=".5" />
        </g>

        <g className="ce-card">
          <path d={FRAME} fill={`url(#${fill})`} />
          {STARS.map(([x, y, r, delay]) => (
            <circle
              key={`${x}-${y}`}
              className="ce-star"
              cx={x}
              cy={y}
              r={r}
              fill={light}
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
          <path
            className="ce-draw"
            d={FRAME}
            pathLength={1}
            fill="none"
            stroke={line}
            strokeWidth="2"
          />
          <path
            className="ce-draw"
            d={FRAME_INNER}
            pathLength={1}
            fill="none"
            stroke={line}
            strokeOpacity=".45"
            strokeWidth="1"
            style={{ animationDelay: '150ms' }}
          />
          {/* Two lights travel the frame half a lap apart, once it has been drawn. */}
          <g className="ce-in" style={{ animationDelay: `${ENTER_MS}ms` }}>
            {[0, -TRACE_S / 2].map((delay) => (
              <path
                key={delay}
                className="ce-trace"
                d={FRAME}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeOpacity=".85"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </g>
        </g>

        {SPARKLES.map(([x, y, size, delay]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${size})`}>
            <path
              className="ce-sparkle"
              d={SPARKLE}
              fill={light}
              style={{ animationDelay: `${delay}s, ${delay + 0.6}s` }}
            />
          </g>
        ))}

        <polygon
          className="ce-halo"
          points={DIAMOND(26)}
          fill="none"
          stroke={light}
          strokeWidth="1.5"
        />
        <g className="ce-badge">
          <polygon points={DIAMOND(27)} fill="hsl(242 48% 10%)" stroke={line} strokeWidth="2" />
          <polygon
            points={DIAMOND(21)}
            fill="none"
            stroke={line}
            strokeOpacity=".5"
            strokeWidth="1"
          />
          <g transform={`translate(${BADGE.x - 12} ${BADGE.y - 12})`} fill={light}>
            <EventIcon kind={kind} />
          </g>
        </g>
      </svg>

      <div
        className="ce-in"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 57,
          display: 'flex',
          justifyContent: 'center',
          animationDelay: '350ms',
        }}
      >
        <div
          style={{
            padding: '3px 26px 5px',
            whiteSpace: 'nowrap',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 21,
            letterSpacing: '.06em',
            color: light,
            background: 'hsl(240 48% 11%)',
            border: `1.5px solid ${line}`,
            boxShadow: `inset 0 0 0 3px hsl(240 48% 11%), inset 0 0 0 4px ${hsl(hue, 70, 70, 0.4)}`,
          }}
        >
          {heading}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 130,
          right: 130,
          top: 100,
          height: 94,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* A username isn't in the alert's language: Turkish would turn Cinzel's small-cap i into İ. */}
        <div
          lang="und"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: nameSize(letters.length),
            lineHeight: 1.1,
            letterSpacing: '.04em',
            whiteSpace: 'nowrap',
            color: '#fbf3dc',
            ...glow,
          }}
        >
          {letters.map((letter, index) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: letters repeat and never reorder.
              key={index}
              className="ce-letter"
              style={{ animationDelay: `${600 + Math.min(index, 24) * 45}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div
          className="ce-in"
          style={{
            marginTop: 4,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 22,
            color: light,
            animationDelay: '1000ms',
          }}
        >
          {detail}
        </div>
      </div>

      {platformTag && (
        <div
          className="ce-in"
          style={{
            position: 'absolute',
            right: 140,
            top: 196,
            fontFamily: DISPLAY,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.24em',
            color: hsl(hue, 70, 75, 0.7),
            animationDelay: '1100ms',
          }}
        >
          {platformTag}
        </div>
      )}

      {message && (
        <div
          className="ce-in"
          style={{
            position: 'absolute',
            left: 160,
            right: 160,
            top: 258,
            textAlign: 'center',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 19,
            lineHeight: 1.25,
            color: '#e9e4f5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 1px 0 rgba(0,0,0,.8), 0 0 10px rgba(0,0,0,.7)',
            animationDelay: '1200ms',
          }}
        >
          “{message}”
        </div>
      )}
    </div>
  );
}
