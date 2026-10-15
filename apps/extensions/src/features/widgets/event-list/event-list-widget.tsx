import type { CSSProperties } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { type EventListSettings, eventListStage } from '#/lib/event-list-url';
import { useI18n } from '#/lib/i18n';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor, PLATFORM_COLORS } from '../overlay-style';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useFitScale } from '../use-fit-scale';
import { type EventEntry, shownEntries } from './event-list-state';
import { useEventList } from './use-event-list';

const SIDE = 14;
const GAP = 8;
const ROW_HEIGHT = 62;
const RADIUS = 12;
// The hue of each kind's icon disc in the classic look.
const KIND_HUES: Record<EventEntry['kind'], number> = { sub: 265, gift: 322, bits: 188, raid: 42 };
const KIND_ICONS: Record<EventEntry['kind'], string> = {
  sub: '★',
  gift: '🎁',
  bits: '◆',
  raid: '⚑',
};
// Kick green reads as one hue among the accent hues, so the platform color is a hue too.
const PLATFORM_HUES: Record<SubathonPlatform, number> = { twitch: 265, kick: 104 };

const CSS = `
.el-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.el-stage{position:absolute;left:50%;top:50%;transform-origin:center}
.el-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.5)}
.el-title{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-style:italic}
@keyframes el-in{0%{transform:translateX(-40px);opacity:0}60%{transform:translateX(4px);opacity:1}100%{transform:translateX(0)}}
`;

interface EventListWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<EventListSettings, 'platforms'>;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function EventListWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simPlatform,
  previewId,
}: EventListWidgetProps) {
  const stage = eventListStage(settings.rows);
  const scale = useFitScale(stage);
  const { entries, now } = useEventList({
    twitch: twitchChannel,
    kick: kickChannel,
    fade: settings.fade,
    simulate,
    simPlatform,
    previewId,
  });
  const skin = skinFor(settings.preset, settings.fx, settings.font);
  const shown = shownEntries(entries, settings, now);
  // Oldest first: on top the newest leads, at the bottom it trails like chat.
  const rows = settings.newest === 'top' ? [...shown].reverse() : shown;

  return (
    <SkinProvider skin={skin}>
      <div
        className="el-root"
        data-testid="event-list"
        data-newest={settings.newest}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('el', skin)}</style>
        <div
          className="el-stage"
          style={{
            width: stage.width,
            height: stage.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: SIDE,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: settings.newest === 'top' ? 'flex-start' : 'flex-end',
              gap: GAP,
            }}
          >
            {settings.title && (
              <div
                className="el-title el-shadow"
                data-testid="event-list-title"
                style={{
                  fontSize: 22,
                  padding: '0 4px',
                  color: skin?.text ?? '#fff',
                }}
              >
                {settings.title}
              </div>
            )}
            {rows.map((entry) => (
              <Row key={entry.id} entry={entry} color={settings.color} />
            ))}
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

function Row({ entry, color }: { entry: EventEntry; color: EventListSettings['color'] }) {
  const skin = useSkin();
  const { t, locale } = useI18n();
  const hue = color === 'platform' ? PLATFORM_HUES[entry.platform] : hueFor(color, 1);
  const hsl = painter(skin, hue);
  const kindHsl = painter(skin, color === 'platform' ? KIND_HUES[entry.kind] : hue);
  const panel: CSSProperties = skin
    ? panelStyle(skin, RADIUS)
    : {
        borderRadius: RADIUS,
        background: 'linear-gradient(180deg, rgba(20,20,26,.88) 0%, rgba(8,8,12,.92) 100%)',
        boxShadow: `inset 3px 0 0 ${color === 'platform' ? PLATFORM_COLORS[entry.platform] : hsl(85, 60)}, 0 8px 22px rgba(0,0,0,.4)`,
      };
  return (
    <div
      data-testid="event-row"
      data-kind={entry.kind}
      data-platform={entry.platform}
      style={{
        ...panel,
        position: 'relative',
        flexShrink: 0,
        height: ROW_HEIGHT,
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        animation: 'el-in .45s cubic-bezier(.2,.9,.3,1.2) both',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          fontSize: 18,
          color: '#fff',
          background: `radial-gradient(circle at 35% 30%, ${kindHsl(80, 62)}, ${kindHsl(80, 34)})`,
          boxShadow: `0 0 12px ${kindHsl(80, 50, 0.45)}`,
        }}
      >
        {KIND_ICONS[entry.kind]}
      </span>
      <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          className="el-shadow"
          data-testid="event-name"
          style={{
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.1,
            color: skin?.text ?? '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {entry.name}
        </span>
        <span
          data-testid="event-detail"
          style={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.2,
            color: skin?.muted ?? 'rgba(255,255,255,.72)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {detail(entry, t, locale)}
        </span>
      </span>
      {/* A row comes in with the effect; idle, a list of them would never stop. */}
      {skin && <Frame skin={skin} radius={RADIUS} plainEdges fx="enter" />}
    </div>
  );
}

type Translate = ReturnType<typeof useI18n>['t'];

/** The line under the name, in the overlay's language. */
export function detail(entry: EventEntry, t: Translate, locale: string): string {
  const amount = entry.amount.toLocaleString(locale);
  switch (entry.kind) {
    case 'sub':
      if (entry.amount > 1) return t('eventList.items.resub', { months: amount });
      return entry.tier > 1
        ? t('eventList.items.subTier', { tier: entry.tier })
        : t('eventList.items.sub');
    case 'gift':
      return entry.amount === 1
        ? t('eventList.items.giftOne')
        : t('eventList.items.gift', { count: amount });
    case 'bits':
      return t(entry.platform === 'kick' ? 'eventList.items.kicks' : 'eventList.items.bits', {
        amount,
      });
    case 'raid':
      return t('eventList.items.raid', { viewers: amount });
  }
}
