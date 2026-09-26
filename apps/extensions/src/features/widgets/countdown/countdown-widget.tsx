import type { CSSProperties, ReactNode } from 'react';
import { fillBackground, fillLayers, trackBackground } from '#/features/presets/bar';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, type Skin, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import {
  type CountdownScene,
  type CountdownSettings,
  sceneIcon,
  sceneIconUrl,
} from '#/lib/countdown-url';
import { useI18n } from '#/lib/i18n';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { formatCountdown } from './countdown-clock';
import { useCountdown } from './use-countdown';

/** Design size; the overlay scales to fill whatever browser source size it gets. */
const STAGE = { width: 1280, height: 720 };

/** The clock breathes over the last minute, so a glance says the break is nearly over. */
const URGENT_MS = 60_000;
const BAR_WIDTH = 620;
const BAR_HEIGHT = 16;

const CSS = `
.cd-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.cd-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.cd-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.55)}
.cd-title{font-weight:800;letter-spacing:.16em;text-transform:uppercase;font-style:italic}
@keyframes cd-urgent{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.035);opacity:.86}}
@keyframes cd-in{0%{transform:translateY(14px);opacity:0}100%{transform:translateY(0);opacity:1}}
`;

interface CountdownWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<CountdownSettings, 'platforms'>;
  simulate?: boolean;
  previewId?: string;
}

export function CountdownWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  previewId,
}: CountdownWidgetProps) {
  const { t } = useI18n();
  const scale = useFitScale(STAGE);
  const {
    left,
    progress,
    ended,
    doneHidden,
    cancelled,
    scene,
    title: chatTitle,
    note: chatNote,
  } = useCountdown({
    twitch: twitchChannel,
    kick: kickChannel,
    values: {
      time: settings.time,
      at: settings.at,
      scene: settings.scene,
      doneHold: settings.doneHold,
    },
    simulate,
    previewId,
  });
  const skin = skinFor(settings.preset);
  const hue = hueFor(settings.color, 1);
  const done = ended && settings.ending === 'text';

  // Chat text wins when a mod set it; otherwise the setup page text, otherwise the scene wording.
  const headline = chatTitle ?? settings.title;
  const note = chatNote ?? settings.note;
  const title = done
    ? settings.done || t(`countdown.scenes.${scene}.done`)
    : headline || t(`countdown.scenes.${scene}.title`);

  // The hold time hides the message at zero; `hide` leaves the scene bare right away.
  // A cancelled countdown stays hidden until the next chat command or settings change.
  const hidden = cancelled || (ended && settings.ending === 'hide') || (done && doneHidden);
  const customIcon = sceneIcon(settings, scene);
  const emoteUrl = sceneIconUrl(settings, scene);

  return (
    <SkinProvider skin={skin}>
      <div
        className="cd-root"
        data-testid="countdown"
        data-ended={ended}
        data-scene={scene}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('cd', skin)}</style>
        {/* `hide` leaves the scene bare once the break is over, so nothing sits over the game. */}
        {!hidden && (
          <div className="cd-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
            <Card look={settings.look} hue={hue} motion={settings.motion}>
              {emoteUrl ? (
                <img
                  src={emoteUrl}
                  alt=""
                  aria-hidden="true"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  data-testid="countdown-emote"
                  style={{ objectFit: 'contain' }}
                />
              ) : customIcon ? (
                <CustomIcon text={customIcon} />
              ) : (
                <SceneIcon scene={scene} hue={hue} />
              )}
              {done ? (
                <span
                  className="cd-title cd-shadow"
                  style={{ fontSize: 76, lineHeight: 1.1, textAlign: 'center', maxWidth: 900 }}
                >
                  {title}
                </span>
              ) : (
                <>
                  <span className="cd-title cd-shadow" style={{ fontSize: 40, opacity: 0.92 }}>
                    {title}
                  </span>
                  <Clock left={left} hue={hue} motion={settings.motion} />
                  {settings.bar && <Bar progress={progress} hue={hue} />}
                </>
              )}
              {note && (
                <span
                  className="cd-shadow"
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    textAlign: 'center',
                    maxWidth: 820,
                    color: skin?.muted ?? 'rgba(255,255,255,.72)',
                  }}
                >
                  {note}
                </span>
              )}
            </Card>
          </div>
        )}
      </div>
    </SkinProvider>
  );
}

/** The panel everything sits in, or nothing at all with the plain look. */
function Card({
  look,
  hue,
  motion,
  children,
}: {
  look: CountdownSettings['look'];
  hue: number;
  motion: boolean;
  children: ReactNode;
}) {
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const inner: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 18,
    animation: motion ? 'cd-in .5s ease-out' : undefined,
  };
  const layout: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  if (look === 'plain') {
    return (
      <div style={layout}>
        <div style={inner}>{children}</div>
      </div>
    );
  }
  const panel: CSSProperties = skin
    ? panelStyle(skin, 26, 1.4)
    : {
        borderRadius: 26,
        background: 'linear-gradient(180deg, rgba(18,18,24,.88) 0%, rgba(8,8,12,.92) 100%)',
        boxShadow: `0 0 0 2px ${hsl(85, 55, 0.55)}, 0 0 60px ${hsl(85, 50, 0.35)}, 0 18px 50px rgba(0,0,0,.5)`,
      };
  return (
    <div style={layout}>
      <div style={{ ...inner, ...panel, padding: '54px 92px' }}>
        {children}
        {skin && <Frame skin={skin} radius={26} scale={1.4} />}
      </div>
    </div>
  );
}

function Clock({ left, hue, motion }: { left: number; hue: number; motion: boolean }) {
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const urgent = motion && left > 0 && left <= URGENT_MS;
  return (
    <span
      className="cd-shadow"
      data-testid="countdown-clock"
      style={{
        fontSize: 164,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '.02em',
        color: skin?.text ?? '#fff',
        textShadow: `0 0 34px ${hsl(90, 55, 0.5)}, 0 3px 0 rgba(0,0,0,.6)`,
        animation: urgent ? 'cd-urgent 1s ease-in-out infinite' : undefined,
      }}
    >
      {formatCountdown(left)}
    </span>
  );
}

function Bar({ progress, hue }: { progress: number; hue: number }) {
  const skin = useSkin();
  const hsl = painter(skin, hue);
  const layers = fillLayers(skin);
  return (
    <div
      style={{
        position: 'relative',
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        borderRadius: skin ? 8 * skin.radius : 8,
        overflow: 'hidden',
        background: skin ? trackBackground(skin) : 'linear-gradient(180deg, #16161c, #07070a)',
        boxShadow: 'inset 0 0 0 2px rgba(0,0,0,.7)',
      }}
    >
      {/* Slid, not resized, so the drain stays on the compositor, as in Subathon Timer. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${(progress - 1) * 100}%)`,
          background: skin
            ? fillBackground(skin, hsl)
            : `linear-gradient(180deg, ${hsl(95, 70)} 0%, ${hsl(88, 50)} 100%)`,
          transition: 'transform .3s linear',
        }}
      >
        {layers.gloss && (
          <div
            style={{
              position: 'absolute',
              inset: '2px 0 auto 0',
              height: '38%',
              background: 'linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,0))',
            }}
          />
        )}
      </div>
    </div>
  );
}

const ICON_SIZE = 72;

/** The streamer's own icon, an emoji or a few characters, instead of the scene's mark. */
function CustomIcon({ text }: { text: string }) {
  return (
    <span
      data-testid="countdown-icon"
      aria-hidden="true"
      style={{ fontSize: ICON_SIZE, lineHeight: 1, textAlign: 'center' }}
    >
      {text}
    </span>
  );
}

/** One flat mark per scene: a play button, a mug, a heart. No game or platform art. */
function SceneIcon({ scene, hue }: { scene: CountdownScene; hue: number }) {
  const skin: Skin | null = useSkin();
  const hsl = painter(skin, hue);
  const stroke = 'rgba(0,0,0,.55)';
  const fill = hsl(90, 62);
  const paths: Record<CountdownScene, ReactNode> = {
    starting: (
      <>
        <circle cx="12" cy="12" r="9.2" fill="none" stroke={fill} strokeWidth="1.8" />
        <path
          d="M10 8.2 16 12l-6 3.8Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </>
    ),
    break: (
      <>
        <path
          d="M4.5 8.5h11v6.2a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 10h1.8a2.4 2.4 0 0 1 0 4.8h-1.8"
          fill="none"
          stroke={fill}
          strokeWidth="1.6"
        />
        <path
          d="M7.5 5.6c0-1 1-1.4 1-2.4M11 5.6c0-1 1-1.4 1-2.4"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
    ending: (
      <path
        d="M12 20s-7-4.6-7-9.2A4 4 0 0 1 12 8.4 4 4 0 0 1 19 10.8C19 15.4 12 20 12 20Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 14px ${hsl(90, 55, 0.6)})` }}
    >
      {paths[scene]}
    </svg>
  );
}
