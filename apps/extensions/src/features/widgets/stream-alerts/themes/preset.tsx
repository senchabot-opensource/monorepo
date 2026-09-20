import type { CSSProperties } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import type { FrameKind, Motion } from '#/features/presets/preset-schema';
import { rgba, type Skin, shade, titleStyle } from '#/features/presets/skin';
import { EventIcon } from './shared';
import type { AlertViewProps } from './types';

// A card with a medallion on its left edge, drawn from the preset: its frame, fonts, colors and
// entrance. Fills the same 800×320 box as the other themes.
const CARD = { left: 150, top: 98, width: 500, height: 124 };
const EMBLEM = 92;
const TEXT_LEFT = CARD.left + EMBLEM / 2 + 22;
const OUT_MS = 600;

/** Card entrances, played on a wrapper so a frame's own clip-path is left alone. */
const ENTER: Record<Motion, string> = {
  unfold:
    '0%{transform:scaleX(.04);opacity:0}55%{transform:scaleX(1.02);opacity:1}100%{transform:none;opacity:1}',
  drop: '0%{transform:translateY(-70px);opacity:0}55%{transform:translateY(8px);opacity:1}78%{transform:translateY(-3px)}100%{transform:none;opacity:1}',
  scroll:
    '0%{transform:scaleY(.04);opacity:0}45%{opacity:1}60%{transform:scaleY(1.05)}100%{transform:none;opacity:1}',
  slam: '0%{transform:scale(1.9);opacity:0}50%{transform:scale(.95);opacity:1}64%{transform:scale(1.02) translateX(-4px)}78%{transform:translateX(4px)}100%{transform:none;opacity:1}',
  slide:
    '0%{transform:translateX(-140px) skewX(-14deg);opacity:0}70%{transform:translateX(10px) skewX(0);opacity:1}100%{transform:none;opacity:1}',
  wipe: '0%{clip-path:inset(0 100% 0 0);opacity:.4}100%{clip-path:inset(0 -10% 0 -10%);opacity:1}',
  pop: '0%{transform:scale(.2);opacity:0}100%{transform:none;opacity:1}',
};

const ENTER_TIMING: Record<Motion, string> = {
  unfold: '.55s cubic-bezier(.2,.9,.3,1)',
  drop: '.65s cubic-bezier(.3,.8,.4,1)',
  scroll: '.7s cubic-bezier(.2,.8,.3,1)',
  slam: '.55s cubic-bezier(.2,.9,.3,1)',
  slide: '.45s cubic-bezier(.2,.9,.3,1)',
  wipe: '.5s cubic-bezier(.6,0,.2,1)',
  pop: '.36s steps(4,end)',
};

const CSS = `
.pa{position:absolute;inset:0;-webkit-font-smoothing:antialiased;font-synthesis:none}
.pa-rise{animation:pa-rise .45s cubic-bezier(.2,.8,.3,1) both}
.pa-emblem{animation:pa-emblem .55s cubic-bezier(.3,1.5,.5,1) both}
.pa-sheen{animation:pa-sheen 1.4s ease-in-out both}
@keyframes pa-rise{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}
@keyframes pa-emblem{0%{transform:scale(.2) rotate(-40deg);opacity:0}100%{transform:none;opacity:1}}
@keyframes pa-sheen{0%{transform:translateX(-160px) skewX(-20deg)}100%{transform:translateX(640px) skewX(-20deg)}}
@keyframes pa-glow{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes pa-out{to{opacity:0;transform:translateY(-14px) scale(.98)}}
`;

/** Clip shapes of the medallion, per frame; null is a circle. */
const EMBLEM_SHAPES: Record<FrameKind, string | null> = {
  gilded: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
  ornate: null,
  lacquer: 'polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)',
  iron: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)',
  tactical: 'polygon(20% 0,100% 0,100% 80%,80% 100%,0 100%,0 20%)',
  hud: 'polygon(0 0,100% 0,100% 100%,0 100%)',
  pixel:
    'polygon(12% 0,88% 0,88% 6%,94% 6%,94% 12%,100% 12%,100% 88%,94% 88%,94% 94%,88% 94%,88% 100%,12% 100%,12% 94%,6% 94%,6% 88%,0 88%,0 12%,6% 12%,6% 6%,12% 6%)',
};

/** Font size that fits a name of this many characters beside the medallion. */
const nameSize = (length: number) => Math.round(Math.max(22, Math.min(40, 560 / (length * 0.62))));

function Emblem({ skin, kind }: { skin: Skin; kind: AlertViewProps['kind'] }) {
  const clip = EMBLEM_SHAPES[skin.frameKind];
  const shape: CSSProperties = clip ? { clipPath: clip } : { borderRadius: '50%' };
  const ring = 5;
  return (
    <div
      className="pa-emblem"
      style={{
        position: 'absolute',
        left: CARD.left - EMBLEM / 2,
        top: CARD.top + (CARD.height - EMBLEM) / 2,
        width: EMBLEM,
        height: EMBLEM,
        animationDelay: '.22s',
        filter: `drop-shadow(0 0 14px ${shade(skin.accent, 50, 0.55)})`,
      }}
    >
      <div
        style={{
          ...shape,
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(160deg, ${skin.frame} 0%, ${skin.frame2} 100%)`,
        }}
      />
      <div
        style={{
          ...shape,
          position: 'absolute',
          inset: ring,
          background: `radial-gradient(circle at 50% 35%, ${shade(skin.accent, 42)} 0%, ${shade(skin.accent, 18)} 70%, ${shade(skin.accent, 10)} 100%)`,
        }}
      />
      <svg
        viewBox="0 0 24 24"
        width={40}
        height={40}
        aria-hidden="true"
        style={{ position: 'absolute', left: EMBLEM / 2 - 20, top: EMBLEM / 2 - 20 }}
      >
        <g
          fill={shade(skin.accent, 70)}
          transform="translate(12 12) scale(1.22) translate(-12 -12)"
          style={{ animation: 'pa-glow 1.6s ease-in-out 1s infinite' }}
        >
          <EventIcon kind={kind} />
        </g>
        <g fill={skin.text}>
          <EventIcon kind={kind} />
        </g>
      </svg>
    </div>
  );
}

/** Stream Alerts in the look of whichever preset the overlay was given. */
export function PresetAlert({
  skin,
  kind,
  heading,
  name,
  detail,
  message,
  platformTag,
  durationMs,
}: AlertViewProps & { skin: Skin }) {
  const letters = Array.from(name).length;
  const rise = (delay: number): CSSProperties => ({ animationDelay: `${delay}ms` });
  return (
    <div
      className="pa"
      style={{
        color: skin.text,
        fontFamily: skin.body,
        animation: `pa-out ${OUT_MS}ms ${durationMs - OUT_MS}ms ease-in forwards`,
      }}
    >
      <style>{`${CSS}@keyframes pa-enter{${ENTER[skin.motion]}}`}</style>
      <div
        style={{
          position: 'absolute',
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: CARD.height,
          transformOrigin: 'center',
          animation: `pa-enter ${ENTER_TIMING[skin.motion]} both`,
        }}
      >
        <div style={{ ...panelStyle(skin, 12), position: 'absolute', inset: 0 }}>
          {skin.frameKind !== 'pixel' && (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div
                className="pa-sheen"
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: 90,
                  background: `linear-gradient(90deg, transparent, ${rgba(skin.frame, 0.18)}, transparent)`,
                  animationDelay: '.7s',
                }}
              />
            </div>
          )}
          <Frame skin={skin} radius={12} />
        </div>
      </div>

      <Emblem skin={skin} kind={kind} />

      <div
        style={{
          position: 'absolute',
          left: TEXT_LEFT,
          right: 800 - CARD.left - CARD.width + 26,
          top: CARD.top,
          height: CARD.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textShadow: skin.textShadow,
        }}
      >
        <div
          className="pa-rise"
          style={{
            ...titleStyle(skin),
            ...rise(300),
            fontFamily: skin.display,
            fontSize: 15,
            fontWeight: 700,
            // A little extra over the preset's own tracking: it's a small label.
            letterSpacing: `${skin.title.tracking + 0.08}em`,
            color: shade(skin.win, 70),
            whiteSpace: 'nowrap',
          }}
        >
          {heading}
        </div>
        {/* A username isn't in the alert's language, so no Turkish case rules on it. */}
        <div
          lang="und"
          className="pa-rise"
          style={{
            ...rise(420),
            fontFamily: skin.display,
            fontSize: nameSize(letters),
            fontWeight: 800,
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
        <div
          className="pa-rise"
          style={{ ...rise(540), fontSize: 17, fontWeight: 600, color: skin.muted }}
        >
          {detail}
        </div>
      </div>

      {platformTag && (
        <div
          className="pa-rise"
          style={{
            ...rise(640),
            position: 'absolute',
            right: 800 - CARD.left - CARD.width + 16,
            top: CARD.top + 12,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '.18em',
            color: rgba(skin.muted, 0.85),
          }}
        >
          {platformTag}
        </div>
      )}

      {message && (
        <div
          className="pa-rise"
          style={{
            ...rise(760),
            position: 'absolute',
            left: CARD.left,
            right: 800 - CARD.left - CARD.width,
            top: CARD.top + CARD.height + 16,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 1px 0 rgba(0,0,0,.7), 0 0 10px rgba(0,0,0,.6)',
          }}
        >
          “{message}”
        </div>
      )}
    </div>
  );
}
