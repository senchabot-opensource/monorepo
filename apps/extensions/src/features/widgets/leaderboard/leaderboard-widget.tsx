import type { CSSProperties } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { useI18n } from '#/lib/i18n';
import { type LeaderboardSettings, leaderboardStage } from '#/lib/leaderboard-url';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor, PLATFORM_COLORS } from '../overlay-style';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useFitScale } from '../use-fit-scale';
import { LATEST_KINDS, type LatestKind, type Supporter, topOf } from './leaderboard-state';
import { useLeaderboard } from './use-leaderboard';

const RADIUS = 16;
// First, second and third place: gold, silver and bronze.
const MEDALS = ['#f5c542', '#cfd6e0', '#d08a4f'];

const CSS = `
.lb-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.lb-stage{position:absolute;left:50%;top:50%;transform-origin:center}
.lb-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.5)}
.lb-title{font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-style:italic}
@keyframes lb-bump{0%{transform:scale(1)}35%{transform:scale(1.06)}100%{transform:scale(1)}}
`;

interface LeaderboardWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<LeaderboardSettings, 'platforms'>;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function LeaderboardWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simPlatform,
  previewId,
}: LeaderboardWidgetProps) {
  const stage = leaderboardStage(settings);
  const scale = useFitScale(stage);
  const data = useLeaderboard({
    twitch: twitchChannel,
    kick: kickChannel,
    simulate,
    simPlatform,
    previewId,
  });
  const skin = skinFor(settings.preset);
  const hsl = painter(skin, hueFor(settings.color, 1));
  const panel: CSSProperties = skin
    ? panelStyle(skin, RADIUS)
    : {
        borderRadius: RADIUS,
        background: 'linear-gradient(180deg, rgba(20,20,26,.9) 0%, rgba(8,8,12,.94) 100%)',
        boxShadow: `0 0 0 2px ${hsl(85, 55, 0.5)}, 0 0 30px ${hsl(85, 50, 0.25)}, 0 14px 34px rgba(0,0,0,.45)`,
      };

  return (
    <SkinProvider skin={skin}>
      <div
        className="lb-root"
        data-testid="leaderboard"
        data-board={settings.board}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('lb', skin)}</style>
        <div
          className="lb-stage"
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
              gap: 12,
            }}
          >
            {settings.title && (
              <div
                className="lb-title lb-shadow"
                data-testid="leaderboard-title"
                style={{ fontSize: 24, color: skin?.text ?? '#fff' }}
              >
                {settings.title}
              </div>
            )}
            {settings.board === 'latest' ? (
              <Latest latest={data.latest} hsl={hsl} />
            ) : (
              <Top
                list={topOf(settings.board === 'gifts' ? data.gifts : data.cheers, settings.rows)}
                board={settings.board}
                hsl={hsl}
              />
            )}
            {skin && <Frame skin={skin} radius={RADIUS} />}
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

type Paint = ReturnType<typeof painter>;

function Dot({ platform }: { platform: SubathonPlatform }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 9,
        height: 9,
        flexShrink: 0,
        borderRadius: '50%',
        background: PLATFORM_COLORS[platform],
      }}
    />
  );
}

function Top({ list, board, hsl }: { list: Supporter[]; board: 'gifts' | 'cheers'; hsl: Paint }) {
  const skin = useSkin();
  const { t, locale } = useI18n();
  if (list.length === 0) {
    return (
      <p
        data-testid="leaderboard-empty"
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: skin?.muted ?? 'rgba(255,255,255,.7)',
        }}
      >
        {t(board === 'gifts' ? 'leaderboard.overlay.noGifts' : 'leaderboard.overlay.noCheers')}
      </p>
    );
  }
  return (
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
      {list.map((entry, index) => (
        <li
          key={`${entry.platform}:${entry.name.toLowerCase()}`}
          data-testid="leaderboard-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 40,
            padding: '0 10px',
            borderRadius: 10,
            background: index === 0 ? hsl(80, 45, 0.28) : 'rgba(255,255,255,.04)',
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              fontSize: 15,
              fontWeight: 800,
              color: index < 3 ? '#1a1a1a' : (skin?.text ?? '#fff'),
              background: index < 3 ? MEDALS[index] : 'rgba(255,255,255,.12)',
            }}
          >
            {index + 1}
          </span>
          <Dot platform={entry.platform} />
          <span
            className="lb-shadow"
            style={{
              minWidth: 0,
              flex: 1,
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
          <span
            key={entry.amount}
            className="lb-shadow"
            style={{
              flexShrink: 0,
              fontSize: 20,
              fontWeight: 800,
              color: hsl(90, 72),
              animation: 'lb-bump .5s ease-out',
            }}
          >
            {board === 'gifts'
              ? t('leaderboard.overlay.giftAmount', { count: entry.amount.toLocaleString(locale) })
              : entry.amount.toLocaleString(locale)}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Latest({ latest, hsl }: { latest: Partial<Record<LatestKind, Supporter>>; hsl: Paint }) {
  const skin = useSkin();
  const { t, locale } = useI18n();
  const value = (kind: LatestKind, entry: Supporter) => {
    const amount = entry.amount.toLocaleString(locale);
    switch (kind) {
      case 'sub':
        return entry.amount > 1 ? t('leaderboard.overlay.months', { months: amount }) : '';
      case 'gift':
        return t('leaderboard.overlay.giftAmount', { count: amount });
      case 'cheer':
        return t(
          entry.platform === 'kick' ? 'leaderboard.overlay.kicks' : 'leaderboard.overlay.bits',
          { amount },
        );
      case 'raid':
        return t('leaderboard.overlay.viewers', { viewers: amount });
    }
  };
  return (
    <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {LATEST_KINDS.map((kind) => {
        const entry = latest[kind];
        return (
          <div
            key={kind}
            data-testid="leaderboard-latest"
            data-kind={kind}
            style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <dt className="lb-title" style={{ fontSize: 13, color: hsl(90, 70) }}>
              {t(`leaderboard.overlay.latest.${kind}`)}
            </dt>
            <dd style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              {entry ? (
                <>
                  <Dot platform={entry.platform} />
                  <span
                    className="lb-shadow"
                    style={{
                      minWidth: 0,
                      fontSize: 22,
                      fontWeight: 800,
                      color: skin?.text ?? '#fff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.name}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: skin?.muted ?? 'rgba(255,255,255,.7)',
                    }}
                  >
                    {value(kind, entry)}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: skin?.muted ?? 'rgba(255,255,255,.55)',
                  }}
                >
                  {t('leaderboard.overlay.none')}
                </span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
