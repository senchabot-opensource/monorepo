import { type CSSProperties, useState } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { useI18n } from '#/lib/i18n';
import { type NowPlayingSettings, NOW_PLAYING_STAGE as STAGE } from '#/lib/now-playing-url';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { LASTFM_CREDIT } from './lastfm';
import type { Track } from './now-playing-api';
import { trackKey, useNowPlaying } from './use-now-playing';

/** Inset from the stage's edges, so the panel's ring and shadow aren't cut off. */
const EDGE = 12;
const CARD_HEIGHT = 136;
const PILL_HEIGHT = 72;
const RADIUS = 16;
/** How far the song fades once the music stops, for as long as it stays up. */
const DIMMED = 0.5;

type Paint = ReturnType<typeof painter>;

const CSS = `
.np-root{position:fixed;inset:0;overflow:hidden;pointer-events:none;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased}
.np-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.np-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.5)}
.np-title{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-style:italic}
.np-slot{position:absolute;left:${EDGE}px;max-width:${STAGE.width - 2 * EDGE}px;
  transition:opacity .5s ease,transform .6s cubic-bezier(.2,.9,.3,1.1);animation:np-enter .6s cubic-bezier(.2,.9,.3,1.1)}
.np-swap{animation:np-swap .45s ease-out}
.np-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.np-bars{display:inline-flex;align-items:flex-end;gap:3px;height:15px;flex-shrink:0}
.np-bars span{width:4px;height:100%;border-radius:2px;transform-origin:bottom;
  animation:np-eq .9s ease-in-out infinite alternate}
.np-paused .np-bars span{animation:none;transform:scaleY(.25)}
.np-paused .np-art{filter:grayscale(.75)}
.np-credit{font-size:11px;font-weight:600;letter-spacing:.04em;opacity:.75;white-space:nowrap}
@keyframes np-enter{from{opacity:0;transform:translateX(-48px)}}
@keyframes np-swap{from{opacity:0;transform:translateY(10px)}}
@keyframes np-eq{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
`;

/** Each bar bounces at its own pace, so together they never line up. */
const BARS = [
  { duration: 0.9, delay: 0 },
  { duration: 0.7, delay: -0.35 },
  { duration: 1.05, delay: -0.6 },
  { duration: 0.8, delay: -0.2 },
];

interface NowPlayingWidgetProps {
  settings: NowPlayingSettings;
  /** Sample songs, never asking a service: the landing page and the setup page's preview. */
  demo?: boolean;
  previewId?: string;
}

export function NowPlayingWidget({ settings, demo = false, previewId }: NowPlayingWidgetProps) {
  const scale = useFitScale(STAGE);
  const { t } = useI18n();
  const { track, visible, playing } = useNowPlaying({
    source: settings.source,
    user: settings.user,
    hide: settings.hide,
    demo,
    previewId,
  });
  const skin = skinFor(settings.preset);
  const hsl = painter(skin, hueFor(settings.color, 1));
  const pill = settings.layout === 'pill';
  const height = pill ? PILL_HEIGHT : CARD_HEIGHT;
  // Last.fm's terms ask for credit wherever its data shows.
  const credit = settings.source === 'lastfm' ? LASTFM_CREDIT : null;

  return (
    <SkinProvider skin={skin}>
      <div
        className={`np-root${playing ? '' : ' np-paused'}`}
        data-testid="now-playing"
        data-visible={visible}
        data-playing={playing}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('np', skin)}</style>
        <div className="np-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {track && (
            <div
              className="np-slot"
              style={{
                top: (STAGE.height - height) / 2,
                opacity: visible ? (playing ? 1 : DIMMED) : 0,
                transform: visible ? 'none' : 'translateX(-48px)',
              }}
            >
              {pill ? (
                <Pill track={track} settings={settings} hsl={hsl} credit={credit} />
              ) : (
                <Card
                  track={track}
                  settings={settings}
                  hsl={hsl}
                  credit={credit}
                  label={t('nowPlaying.overlay.label')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </SkinProvider>
  );
}

interface ViewProps {
  track: Track;
  settings: NowPlayingSettings;
  hsl: Paint;
  credit: string | null;
}

/** The panel behind the song: the preset's, or a dark one with a ring in the picked color. */
function usePanel(hsl: Paint, radius: number): CSSProperties {
  const skin = useSkin();
  if (skin) return panelStyle(skin, radius);
  return {
    borderRadius: radius,
    background: 'linear-gradient(180deg, rgba(20,20,26,.9) 0%, rgba(8,8,12,.94) 100%)',
    boxShadow: `0 0 0 2px ${hsl(85, 55, 0.5)}, 0 0 16px ${hsl(85, 50, 0.22)}, 0 6px 14px rgba(0,0,0,.4)`,
  };
}

function useTextColors() {
  const skin = useSkin();
  return {
    title: skin?.text ?? '#fff',
    artist: skin ? skin.text : 'rgba(255,255,255,.82)',
    album: skin?.muted ?? 'rgba(255,255,255,.58)',
  };
}

function Card({ track, settings, hsl, credit, label }: ViewProps & { label: string }) {
  const skin = useSkin();
  const panel = usePanel(hsl, RADIUS);
  const colors = useTextColors();
  return (
    <div
      style={{
        ...panel,
        position: 'relative',
        width: STAGE.width - 2 * EDGE,
        height: CARD_HEIGHT,
        boxSizing: 'border-box',
        padding: settings.art ? 12 : '12px 24px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        key={trackKey(track)}
        className="np-swap"
        style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, minWidth: 0 }}
      >
        {settings.art && <Cover track={track} size={CARD_HEIGHT - 24} radius={10} hsl={hsl} />}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingRight: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 2,
              color: hsl(90, 66),
            }}
          >
            <Bars color={hsl(90, 62)} />
            <span className="np-title np-shadow np-line" style={{ fontSize: 13 }}>
              {label}
            </span>
          </div>
          <div
            className="np-line np-shadow"
            data-testid="now-playing-title"
            style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, color: colors.title }}
          >
            {track.title}
          </div>
          {track.artist && (
            <div
              className="np-line np-shadow"
              data-testid="now-playing-artist"
              style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2, color: colors.artist }}
            >
              {track.artist}
            </div>
          )}
          {settings.album && track.album && (
            <div
              className="np-line"
              data-testid="now-playing-album"
              style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.2, color: colors.album }}
            >
              {track.album}
            </div>
          )}
        </div>
      </div>
      {credit && (
        <span
          className="np-credit"
          data-testid="now-playing-credit"
          style={{ position: 'absolute', right: 14, bottom: 8, color: colors.album }}
        >
          {credit}
        </span>
      )}
      {skin && <Frame skin={skin} radius={RADIUS} />}
    </div>
  );
}

function Pill({ track, settings, hsl, credit }: ViewProps) {
  const skin = useSkin();
  const radius = PILL_HEIGHT / 2;
  const panel = usePanel(hsl, radius);
  const colors = useTextColors();
  const cover = PILL_HEIGHT - 20;
  return (
    <div
      style={{
        ...panel,
        position: 'relative',
        height: PILL_HEIGHT,
        maxWidth: STAGE.width - 2 * EDGE,
        boxSizing: 'border-box',
        padding: settings.art ? '10px 28px 10px 10px' : '10px 28px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        key={trackKey(track)}
        className="np-swap"
        style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}
      >
        {settings.art && <Cover track={track} size={cover} radius={cover / 2} hsl={hsl} />}
        <Bars color={hsl(90, 62)} />
        <div className="np-line np-shadow" style={{ minWidth: 0, fontSize: 22, lineHeight: 1.2 }}>
          <span data-testid="now-playing-title" style={{ fontWeight: 800, color: colors.title }}>
            {track.title}
          </span>
          {track.artist && (
            <>
              <span aria-hidden="true" style={{ color: colors.album, margin: '0 10px' }}>
                ·
              </span>
              <span
                data-testid="now-playing-artist"
                style={{ fontWeight: 600, fontSize: 19, color: colors.artist }}
              >
                {track.artist}
              </span>
            </>
          )}
        </div>
        {credit && (
          <span
            className="np-credit"
            data-testid="now-playing-credit"
            style={{ alignSelf: 'flex-end', color: colors.album }}
          >
            {credit}
          </span>
        )}
      </div>
      {skin && <Frame skin={skin} radius={radius} />}
    </div>
  );
}

function Bars({ color }: { color: string }) {
  return (
    <span className="np-bars" aria-hidden="true">
      {BARS.map(({ duration, delay }) => (
        <span
          key={duration}
          style={{
            background: color,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </span>
  );
}

/**
 * The song's cover; a drawn tile for a sample song; a music note when there's none, or when the
 * image doesn't load (the Cover Art Archive has no art for every release).
 */
function Cover({
  track,
  size,
  radius,
  hsl,
}: {
  track: Track;
  size: number;
  radius: number;
  hsl: Paint;
}) {
  const [failed, setFailed] = useState(false);
  const box: CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: radius,
    boxShadow: '0 4px 12px rgba(0,0,0,.4)',
  };
  if (track.cover && !failed) {
    return (
      <img
        className="np-art"
        data-testid="now-playing-cover"
        src={track.cover}
        alt=""
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{ ...box, objectFit: 'cover', background: 'rgba(0,0,0,.35)' }}
      />
    );
  }
  if (track.tile) {
    const [a, b] = track.tile;
    return (
      <span
        className="np-art"
        data-testid="now-playing-tile"
        style={{
          ...box,
          display: 'block',
          background: `radial-gradient(circle at 30% 30%, hsl(${a} 90% 74% / .95) 0 17%, transparent 18%),
            radial-gradient(circle at 74% 76%, hsl(${b} 90% 62% / .6) 0 30%, transparent 31%),
            linear-gradient(135deg, hsl(${a} 70% 48%), hsl(${b} 72% 28%))`,
        }}
      />
    );
  }
  return (
    <span
      className="np-art"
      data-testid="now-playing-note"
      style={{
        ...box,
        display: 'grid',
        placeItems: 'center',
        color: 'rgba(255,255,255,.92)',
        background: `linear-gradient(135deg, ${hsl(70, 46)}, ${hsl(60, 24)})`,
      }}
    >
      <NoteIcon size={Math.round(size * 0.46)} />
    </span>
  );
}

function NoteIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 17.5V6.3l11-2.2v11.2"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx={6.4} cy={17.6} rx={2.9} ry={2.4} fill="currentColor" />
      <ellipse cx={17.4} cy={15.4} rx={2.9} ry={2.4} fill="currentColor" />
    </svg>
  );
}
