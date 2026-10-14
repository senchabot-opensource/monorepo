import type { CSSProperties } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { useI18n } from '#/lib/i18n';
import { type QueueSettings, queueStage } from '#/lib/queue-url';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor, PLATFORM_COLORS } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import type { QueueEntry } from './queue-state';
import { useQueue } from './use-queue';

const RADIUS = 16;

const CSS = `
.qu-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.qu-stage{position:absolute;left:50%;top:50%;transform-origin:center}
.qu-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.5)}
.qu-title{font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-style:italic}
@keyframes qu-in{0%{transform:translateX(-24px);opacity:0}100%{transform:none;opacity:1}}
`;

interface QueueWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<QueueSettings, 'platforms'>;
  simulate?: boolean;
  previewId?: string;
}

export function QueueWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  previewId,
}: QueueWidgetProps) {
  const stage = queueStage(settings.rows);
  const scale = useFitScale(stage);
  const { t } = useI18n();
  const state = useQueue({
    twitch: twitchChannel,
    kick: kickChannel,
    rules: settings,
    simulate,
    previewId,
  });
  const skin = skinFor(settings.preset);
  const hsl = painter(skin, hueFor(settings.color, 1));
  const shown = state.waiting.slice(0, settings.rows);
  const more = state.waiting.length - shown.length;
  const panel: CSSProperties = skin
    ? panelStyle(skin, RADIUS)
    : {
        borderRadius: RADIUS,
        background: 'linear-gradient(180deg, rgba(20,20,26,.9) 0%, rgba(8,8,12,.94) 100%)',
        boxShadow: `0 0 0 2px ${hsl(85, 55, 0.5)}, 0 0 30px ${hsl(85, 50, 0.25)}, 0 14px 34px rgba(0,0,0,.45)`,
      };

  return (
    <SkinProvider skin={skin}>
      <div className="qu-root" data-testid="queue" data-open={state.open} data-preset={skin?.id}>
        <style>{CSS + skinCss('qu', skin)}</style>
        <div
          className="qu-stage"
          style={{
            width: stage.width,
            height: stage.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div
            style={{
              ...panel,
              position: 'absolute',
              inset: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                className="qu-title qu-shadow"
                data-testid="queue-title"
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 24,
                  color: skin?.text ?? '#fff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {settings.title}
              </span>
              <span
                data-testid="queue-status"
                style={{
                  flexShrink: 0,
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: state.open ? 'rgba(34,197,94,.85)' : 'rgba(239,68,68,.85)',
                }}
              >
                {t(state.open ? 'queue.overlay.open' : 'queue.overlay.closed')}
              </span>
              <span
                data-testid="queue-count"
                className="qu-shadow"
                style={{ flexShrink: 0, fontSize: 22, fontWeight: 800, color: hsl(90, 72) }}
              >
                {state.waiting.length}
              </span>
            </div>

            {state.playing.length > 0 && (
              <div>
                <Heading>{t('queue.overlay.playing')}</Heading>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {state.playing.map((entry) => (
                    <span
                      key={`${entry.platform}:${entry.login}`}
                      data-testid="queue-playing"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        maxWidth: '100%',
                        padding: '5px 12px',
                        borderRadius: 999,
                        fontSize: 18,
                        fontWeight: 800,
                        color: '#fff',
                        background: hsl(80, 40, 0.85),
                        animation: 'qu-in .4s ease-out both',
                      }}
                    >
                      <Dot entry={entry} />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {entry.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <Heading>{t('queue.overlay.next')}</Heading>
              {shown.length === 0 ? (
                <p
                  data-testid="queue-empty"
                  className="qu-shadow"
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                    color: skin?.muted ?? 'rgba(255,255,255,.7)',
                  }}
                >
                  {state.open
                    ? t('queue.overlay.joinHint', { join: settings.join })
                    : t('queue.overlay.closedHint')}
                </p>
              ) : (
                <ol
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {shown.map((entry, index) => (
                    <Row
                      key={`${entry.platform}:${entry.login}`}
                      entry={entry}
                      place={index + 1}
                      hsl={hsl}
                    />
                  ))}
                </ol>
              )}
              {more > 0 && (
                <p
                  data-testid="queue-more"
                  style={{
                    margin: '8px 0 0',
                    fontSize: 16,
                    fontWeight: 700,
                    color: skin?.muted ?? 'rgba(255,255,255,.7)',
                  }}
                >
                  {t('queue.overlay.more', { count: more })}
                </p>
              )}
            </div>

            {state.open && shown.length > 0 && (
              <p
                className="qu-shadow"
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: skin?.muted ?? 'rgba(255,255,255,.65)',
                }}
              >
                {t('queue.overlay.joinHint', { join: settings.join })}
              </p>
            )}
            {skin && <Frame skin={skin} radius={RADIUS} />}
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

function Heading({ children }: { children: string }) {
  const skin = useSkin();
  return (
    <div
      className="qu-title"
      style={{ marginBottom: 8, fontSize: 14, color: skin?.muted ?? 'rgba(255,255,255,.6)' }}
    >
      {children}
    </div>
  );
}

function Dot({ entry }: { entry: QueueEntry }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 9,
        height: 9,
        flexShrink: 0,
        borderRadius: '50%',
        background: PLATFORM_COLORS[entry.platform],
      }}
    />
  );
}

function Row({
  entry,
  place,
  hsl,
}: {
  entry: QueueEntry;
  place: number;
  hsl: ReturnType<typeof painter>;
}) {
  const skin = useSkin();
  return (
    <li
      data-testid="queue-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 34,
        animation: 'qu-in .4s ease-out both',
      }}
    >
      <span
        style={{
          width: 30,
          flexShrink: 0,
          textAlign: 'right',
          fontSize: 18,
          fontWeight: 800,
          color: hsl(90, 70),
        }}
      >
        {place}
      </span>
      <Dot entry={entry} />
      <span
        className="qu-shadow"
        style={{
          minWidth: 0,
          fontSize: 20,
          fontWeight: 700,
          color: skin?.text ?? '#fff',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.name}
      </span>
      {entry.note && (
        <span
          style={{
            marginLeft: 'auto',
            minWidth: 0,
            fontSize: 15,
            fontWeight: 600,
            color: skin?.muted ?? 'rgba(255,255,255,.65)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {entry.note}
        </span>
      )}
    </li>
  );
}
