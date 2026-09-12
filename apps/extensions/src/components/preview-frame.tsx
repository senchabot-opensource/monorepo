import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useI18n } from '#/lib/i18n';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

interface PreviewFrameProps {
  /** Page to show in the iframe. Nothing loads while it's empty. */
  src: string;
  /** Accessible iframe title. */
  title: string;
  /** Width / height, e.g. `16 / 9`. Without it the frame fills its parent, which needs a height. */
  aspect?: number;
  /** Shown until the iframe mounts; defaults to a "Loading preview" line. */
  placeholder?: ReactNode;
  /** For demos that play on their own: with reduced motion on, wait for a Play click. */
  motionSafe?: boolean;
  /** Background behind the page; overlays are transparent, so this is what shows through. */
  backgroundClassName?: string;
  className?: string;
}

/**
 * Non-interactive iframe preview. It only mounts once scrolled near the viewport, so pages
 * with several previews don't load them all up front, and it stays mounted afterwards.
 */
export function PreviewFrame({
  src,
  title,
  aspect,
  placeholder,
  motionSafe,
  backgroundClassName = 'bg-zinc-950/80',
  className = '',
}: PreviewFrameProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [played, setPlayed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const waitingForPlay = Boolean(motionSafe && reducedMotion && !played);
  const mounted = visible && Boolean(src) && !waitingForPlay;

  return (
    <div
      ref={ref}
      style={aspect ? { aspectRatio: aspect } : undefined}
      className={`relative w-full overflow-hidden rounded-lg border border-zinc-300 shadow-inner dark:border-zinc-800 ${
        aspect ? '' : 'h-full'
      } ${backgroundClassName} ${className}`}
    >
      {mounted ? (
        <iframe
          src={src}
          title={title}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-zinc-400">
          {waitingForPlay ? (
            <button
              type="button"
              onClick={() => setPlayed(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
              </svg>
              {t('common.playPreview')}
            </button>
          ) : (
            (placeholder ?? t('common.previewLoading'))
          )}
        </div>
      )}
    </div>
  );
}
