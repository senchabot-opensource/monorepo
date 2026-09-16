import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useI18n } from '#/lib/i18n';
import { withLangParam } from '#/lib/i18n/paths';
import type { SourceSize } from '#/lib/widgets';

interface PreviewFrameProps {
  /** Page to show in the iframe. Nothing loads while it's empty. */
  src: string;
  /** Accessible iframe title. */
  title: string;
  /** Width / height, e.g. `16 / 9`. Without it the frame fills its parent, which needs a height. */
  aspect?: number;
  /**
   * The page's native size, e.g. 1920×1080. It renders at that size and is scaled down to fit,
   * so pixel-sized content (a 112px emote) keeps its proportions.
   */
  canvas?: SourceSize;
  /** Shown until the iframe mounts; defaults to a "Loading preview" line. */
  placeholder?: ReactNode;
  /** Background behind the page; overlays are transparent, so this is what shows through. */
  backgroundClassName?: string;
  className?: string;
}

/**
 * Non-interactive iframe preview. It only mounts while it's near the viewport, so pages with
 * several previews run just the ones on screen.
 */
export function PreviewFrame({
  src,
  title,
  aspect,
  canvas,
  placeholder,
  backgroundClassName = 'bg-zinc-950/80',
  className = '',
}: PreviewFrameProps) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);
  const canvasWidth = canvas?.width;
  const canvasHeight = canvas?.height;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    // Each preview is a whole app instance, so a page with several of them (the landing runs six)
    // stutters if they all keep animating. Unmount the ones scrolled out of view.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '200px',
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !canvasWidth || !canvasHeight) return;
    const measure = () =>
      setScale(Math.min(element.clientWidth / canvasWidth, element.clientHeight / canvasHeight));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [canvasWidth, canvasHeight]);

  const mounted = visible && Boolean(src) && (!canvas || scale > 0);

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
          src={withLangParam(src, locale)}
          title={title}
          // Overlays can overflow a small frame by a pixel; OBS never shows their scrollbar, and
          // this non-interactive preview shouldn't either (in light mode it paints a white bar).
          scrolling="no"
          // Overlays are theme-neutral; the frame must match them or it stops being transparent.
          style={{
            colorScheme: 'normal',
            ...(canvas && {
              width: canvas.width,
              height: canvas.height,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }),
          }}
          className={`pointer-events-none absolute border-0 ${
            canvas ? 'top-1/2 left-1/2' : 'inset-0 h-full w-full'
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-zinc-400">
          {placeholder ?? t('common.previewLoading')}
        </div>
      )}
    </div>
  );
}
