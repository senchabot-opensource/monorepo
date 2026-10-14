import type { CSSProperties } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import {
  type Corner,
  type LowerThirdSettings,
  LOWER_THIRD_STAGE as STAGE,
} from '#/lib/lower-third-url';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { useLowerThird } from './use-lower-third';

const MARGIN = 56;
const RADIUS = 10;

const CSS = `
.lt-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased}
.lt-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.lt-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 16px rgba(0,0,0,.5)}
.lt-title{font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-style:italic}
@keyframes lt-line{0%{transform:translateY(10px);opacity:0}100%{transform:none;opacity:1}}
`;

const PLACE: Record<Corner, CSSProperties> = {
  bl: { left: MARGIN, bottom: MARGIN, transformOrigin: 'left bottom' },
  br: { right: MARGIN, bottom: MARGIN, transformOrigin: 'right bottom' },
  tl: { left: MARGIN, top: MARGIN, transformOrigin: 'left top' },
  tr: { right: MARGIN, top: MARGIN, transformOrigin: 'right top' },
};

interface LowerThirdWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<LowerThirdSettings, 'platforms'>;
  simulate?: boolean;
  previewId?: string;
}

export function LowerThirdWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  previewId,
}: LowerThirdWidgetProps) {
  const scale = useFitScale(STAGE);
  const { visible, line, lineKey } = useLowerThird({
    twitch: twitchChannel,
    kick: kickChannel,
    timing: settings,
    simulate,
    previewId,
  });
  const skin = skinFor(settings.preset);
  const right = settings.corner === 'br' || settings.corner === 'tr';

  return (
    <SkinProvider skin={skin}>
      <div
        className="lt-root"
        data-testid="lower-third"
        data-visible={visible}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('lt', skin)}</style>
        <div className="lt-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <div
            style={{
              position: 'absolute',
              ...PLACE[settings.corner],
              // Slides in from its own side and fades; opacity and transform only.
              transform: `scale(${settings.size / 100}) translateX(${visible ? 0 : right ? 60 : -60}px)`,
              opacity: visible ? 1 : 0,
              transition: 'transform .55s cubic-bezier(.2,.9,.3,1.1), opacity .45s ease',
            }}
          >
            <Bar
              title={settings.title}
              line={line}
              lineKey={lineKey}
              color={settings.color}
              right={right}
            />
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

function Bar({
  title,
  line,
  lineKey,
  color,
  right,
}: {
  title: string;
  line: string;
  lineKey: string;
  color: LowerThirdSettings['color'];
  right: boolean;
}) {
  const skin = useSkin();
  const hsl = painter(skin, hueFor(color, 1));
  const panel: CSSProperties = skin
    ? panelStyle(skin, RADIUS)
    : {
        borderRadius: RADIUS,
        background: 'linear-gradient(180deg, rgba(20,20,26,.9) 0%, rgba(8,8,12,.94) 100%)',
        boxShadow: `0 14px 34px rgba(0,0,0,.45), 0 0 0 1px ${hsl(85, 55, 0.35)}`,
      };
  return (
    <div
      style={{
        ...panel,
        position: 'relative',
        display: 'flex',
        flexDirection: right ? 'row-reverse' : 'row',
        alignItems: 'stretch',
        minWidth: 420,
        maxWidth: 1100,
        overflow: 'hidden',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 12,
          flexShrink: 0,
          background: `linear-gradient(180deg, ${hsl(90, 62)}, ${hsl(85, 40)})`,
          boxShadow: `0 0 18px ${hsl(90, 55, 0.6)}`,
        }}
      />
      <div
        style={{
          padding: '16px 26px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          minWidth: 0,
          textAlign: right ? 'right' : 'left',
        }}
      >
        {title && (
          <span
            className="lt-title lt-shadow"
            data-testid="lower-third-title"
            style={{
              fontSize: 46,
              lineHeight: 1.05,
              color: skin?.text ?? '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </span>
        )}
        {line && (
          <span
            key={lineKey}
            data-testid="lower-third-line"
            style={{
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.2,
              color: title ? (skin?.muted ?? 'rgba(255,255,255,.82)') : (skin?.text ?? '#fff'),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              animation: 'lt-line .45s ease-out both',
            }}
          >
            {line}
          </span>
        )}
      </div>
      {skin && <Frame skin={skin} radius={RADIUS} />}
    </div>
  );
}
