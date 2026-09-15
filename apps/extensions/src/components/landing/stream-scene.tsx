import { type CSSProperties, useState } from 'react';
import { PreviewFrame, usePrefersReducedMotion } from '#/components/preview-frame';
import { useI18n } from '#/lib/i18n';
import { getWidget, type WidgetId } from '#/lib/widgets';
import { getDemoSrc } from './demo-url';

/**
 * Dark "stream" surface for overlay previews. It stays dark in light mode too: overlays are
 * transparent with white text, so they need a dark scene behind them to be readable.
 */
export const STAGE_STYLE: CSSProperties = {
  backgroundColor: '#09090b',
  backgroundImage:
    'radial-gradient(110% 80% at 0% 0%, rgba(34, 197, 94, 0.16), transparent 60%), linear-gradient(160deg, #27272a 0%, #111113 55%, #09090b 100%)',
};

const GRID_STYLE: CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px)',
  backgroundSize: '36px 36px',
  maskImage: 'linear-gradient(to bottom, black, transparent 80%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 80%)',
};

/** Overrides PreviewFrame's own card look so the demo sits flush on the stage. */
export const FLUSH_FRAME_CLASS = 'rounded-none! border-0! shadow-none!';

/** Faint grid and hills, so the scene reads as a game or camera shot under the overlays. */
function SceneBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0" style={GRID_STYLE} />
      <svg
        className="absolute inset-x-0 bottom-0 h-[42%] w-full"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 58C50 34 96 50 150 40s98-26 152-6 70 14 98 8v58H0Z"
          fill="#3f3f46"
          fillOpacity={0.35}
        />
        <path d="M0 78c64-18 124-4 196-14s136-16 204 4v32H0Z" fill="#18181b" fillOpacity={0.9} />
      </svg>
    </div>
  );
}

/**
 * Hero visual: Emote Wall, Chat Box and Sub Sprout demos layered like sources in one stream
 * scene. Phones only get the chat. With reduced motion, one Play button starts all three.
 */
export function StreamScene() {
  const { t } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const [played, setPlayed] = useState(false);
  const paused = reducedMotion && !played;

  const demo = (id: WidgetId) => {
    const widget = getWidget(id);
    return (
      <PreviewFrame
        src={paused ? '' : getDemoSrc(widget)}
        title={t('home.demoTitle', { name: t(widget.nameKey) })}
        placeholder={<span />}
        backgroundClassName="bg-transparent"
        className={FLUSH_FRAME_CLASS}
      />
    );
  };

  return (
    <figure className="min-w-0">
      <div className="rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40">
        <div
          className="relative h-96 overflow-hidden rounded-xl sm:aspect-video sm:h-auto"
          style={STAGE_STYLE}
        >
          <SceneBackdrop />
          <div className="absolute inset-0 max-sm:hidden">{demo('emote-wall')}</div>
          <div className="absolute bottom-[3%] left-[3%] h-[45%] w-[34%] max-sm:hidden">
            {demo('sub-sprout')}
          </div>
          <div className="absolute top-12 right-4 bottom-4 left-4 sm:top-[6%] sm:right-[3%] sm:bottom-[6%] sm:left-auto sm:w-[36%]">
            {demo('chat-box')}
          </div>
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
            {t('home.sceneLive')}
          </span>
          {paused && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40">
              <button
                type="button"
                onClick={() => setPlayed(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                </svg>
                {t('common.playPreview')}
              </button>
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-green-500 motion-safe:animate-pulse"
        />
        {t('home.sceneCaption')}
      </figcaption>
    </figure>
  );
}
