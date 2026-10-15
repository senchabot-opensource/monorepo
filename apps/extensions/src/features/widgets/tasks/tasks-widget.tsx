import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { useRises } from '#/features/presets/fx/engine';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { useI18n } from '#/lib/i18n';
import { TASKS_STAGE as STAGE, type TasksSettings } from '#/lib/tasks-url';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor, PLATFORM_COLORS } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { type Member, progressOf, shownMembers } from './tasks-state';
import { useTasks } from './use-tasks';

const RADIUS = 16;
/** Seconds the list rests at the top and at the bottom before scrolling on. */
const REST_SECONDS = 3;

const CSS = `
.tk-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.tk-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.tk-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.5)}
.tk-title{font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-style:italic}
`;

interface TasksWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<TasksSettings, 'platforms'>;
  simulate?: boolean;
  previewId?: string;
}

export function TasksWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  previewId,
}: TasksWidgetProps) {
  const scale = useFitScale(STAGE);
  const { t } = useI18n();
  const state = useTasks({
    twitch: twitchChannel,
    kick: kickChannel,
    rules: settings,
    simulate,
    previewId,
  });
  const skin = skinFor(settings.preset, settings.fx, settings.font);
  const hsl = painter(skin, hueFor(settings.color, 1));
  const members = shownMembers(state);
  const { done, total } = progressOf(state);
  // A task ticked off plays the preset's effect; unticking one doesn't.
  const ticked = useRises(done);
  const panel: CSSProperties = skin
    ? panelStyle(skin, RADIUS)
    : {
        borderRadius: RADIUS,
        background: 'linear-gradient(180deg, rgba(20,20,26,.9) 0%, rgba(8,8,12,.94) 100%)',
        boxShadow: `0 0 0 2px ${hsl(85, 55, 0.5)}, 0 0 30px ${hsl(85, 50, 0.25)}, 0 14px 34px rgba(0,0,0,.45)`,
      };

  return (
    <SkinProvider skin={skin}>
      <div className="tk-root" data-testid="tasks" data-preset={skin?.id}>
        <style>{CSS + skinCss('tk', skin)}</style>
        <div className="tk-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <div
            style={{
              ...panel,
              position: 'absolute',
              inset: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span
                className="tk-title tk-shadow"
                data-testid="tasks-title"
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
                data-testid="tasks-progress"
                className="tk-shadow"
                style={{ flexShrink: 0, fontSize: 20, fontWeight: 800, color: hsl(90, 72) }}
              >
                {done}/{total}
              </span>
            </div>
            {members.length === 0 ? (
              <p
                data-testid="tasks-empty"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: skin?.muted ?? 'rgba(255,255,255,.7)',
                }}
              >
                {t('tasks.overlay.empty')}
              </p>
            ) : (
              <Scroller speed={settings.speed}>
                {members.map((member) => (
                  <MemberTasks
                    key={`${member.platform}:${member.login}`}
                    member={member}
                    hsl={hsl}
                  />
                ))}
              </Scroller>
            )}
            {skin && (
              <Frame skin={skin} radius={RADIUS} pulse={ticked} win={total > 0 && done === total} />
            )}
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

/**
 * The list in a window that shows what fits; a longer list scrolls down to its end, rests, and
 * comes back up, over and over.
 */
function Scroller({ speed, children }: { speed: number; children: React.ReactNode }) {
  const windowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  useLayoutEffect(() => {
    const room = windowRef.current?.clientHeight ?? 0;
    const height = listRef.current?.offsetHeight ?? 0;
    setOverflow(Math.max(0, height - room));
  });
  // One trip down and back, with a rest at each end: still, down, still, up.
  const travel = overflow / speed;
  const duration = 2 * (travel + REST_SECONDS);
  const rest = Math.round((REST_SECONDS / duration) * 1000) / 10;
  return (
    <div
      ref={windowRef}
      style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}
    >
      <div
        ref={listRef}
        data-testid="tasks-list"
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            animation: overflow > 0 ? `tk-pan ${duration}s ease-in-out infinite` : undefined,
          } as CSSProperties
        }
      >
        {overflow > 0 && (
          <style>{`@keyframes tk-pan{0%,${rest}%{transform:translateY(0)}50%,${50 + rest}%{transform:translateY(${-overflow}px)}100%{transform:translateY(0)}}`}</style>
        )}
        {children}
      </div>
    </div>
  );
}

function MemberTasks({ member, hsl }: { member: Member; hsl: ReturnType<typeof painter> }) {
  const skin = useSkin();
  return (
    <section
      data-testid="tasks-member"
      style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          aria-hidden="true"
          style={{
            width: 9,
            height: 9,
            flexShrink: 0,
            borderRadius: '50%',
            background: PLATFORM_COLORS[member.platform],
          }}
        />
        <span
          className="tk-shadow"
          style={{
            minWidth: 0,
            fontSize: 19,
            fontWeight: 800,
            color: member.broadcaster ? hsl(90, 72) : (skin?.text ?? '#fff'),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {member.name}
        </span>
      </div>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '0 0 0 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {member.tasks.map((task, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: a task's place is its number in chat.
            key={index}
            data-testid="tasks-task"
            data-done={task.done}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 17,
              lineHeight: 1.3,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 18,
                height: 18,
                marginTop: 2,
                flexShrink: 0,
                borderRadius: 5,
                display: 'grid',
                placeItems: 'center',
                fontSize: 13,
                fontWeight: 900,
                color: '#0b0b0f',
                border: task.done ? 'none' : `2px solid ${skin?.muted ?? 'rgba(255,255,255,.55)'}`,
                background: task.done ? hsl(90, 62) : 'transparent',
              }}
            >
              {task.done ? '✓' : ''}
            </span>
            <span
              style={{
                minWidth: 0,
                fontWeight: 600,
                color: task.done
                  ? (skin?.muted ?? 'rgba(255,255,255,.55)')
                  : (skin?.text ?? '#fff'),
                textDecoration: task.done ? 'line-through' : undefined,
                overflowWrap: 'anywhere',
              }}
            >
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
