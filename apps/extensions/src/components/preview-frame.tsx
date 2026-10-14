import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { type Locale, useI18n } from '#/lib/i18n';
import { withLangParam } from '#/lib/i18n/paths';
import type { SourceSize } from '#/lib/widgets';

/** A point of the canvas, 0–1 on each axis: { x: 0, y: 0 } is its top-left corner. */
export interface CanvasPoint {
  x: number;
  y: number;
}

/** Where a widget pinned to a scene corner (`tl`, `tr`, `bl`, `br`) sits on the canvas. */
export const CORNER_FOCUS: Record<'tl' | 'tr' | 'bl' | 'br', CanvasPoint> = {
  tl: { x: 0, y: 0 },
  tr: { x: 1, y: 0 },
  bl: { x: 0, y: 1 },
  br: { x: 1, y: 1 },
};

/** Marks the part of a page that a `fitBox` preview frames, such as the Weather widget's box. */
export const PREVIEW_BOX_SELECTOR = '[data-preview-box]';
// Share of the frame a fitted box fills, leaving a margin around it like the Socials card's.
const FIT_FILL = 0.84;

const ZOOMS = ['1', '2', '3'] as const;
type Zoom = (typeof ZOOMS)[number];
export type PreviewZoom = 1 | 2 | 3;

interface PreviewFrameProps {
  /** Page to show in the iframe. Nothing loads while it's empty. */
  src: string;
  /** Accessible iframe title. */
  title: string;
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
  /** Language for the page when it isn't the site's, e.g. Stream Alerts in its own language. */
  lang?: Locale;
  /** iframe permissions, e.g. `autoplay` so a click on the setup page can play its sound. */
  allow?: string;
  /**
   * With a `canvas`, adds 1×/2×/3× zoom for overlays drawn small in a corner of a big scene.
   * Zoomed in, the view opens on this point (it moves there again when the point changes) and can
   * be dragged around.
   */
  zoomFocus?: CanvasPoint;
  /** The zoom the preview opens at, with `zoomFocus`; 1× by default. */
  zoomStart?: PreviewZoom;
  /**
   * Shows a spinner until the page inside has loaded, not only until the frame mounts. For the
   * landing's demos, which load once; a setup page's preview reloads on every change, and a
   * spinner each time would flicker.
   */
  showLoading?: boolean;
  /**
   * With a `canvas`, frames the part of the page marked `data-preview-box` instead of the whole
   * canvas: scaled to fill the frame and centered, for an overlay that sits small in a corner of
   * its scene, like the gallery's Weather card. The page is hidden until the box is found.
   */
  fitBox?: boolean;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Non-interactive iframe preview. It only mounts while it's near the viewport, so pages with
 * several previews run just the ones on screen.
 */
export function PreviewFrame({
  src,
  title,
  canvas,
  placeholder,
  backgroundClassName = 'bg-zinc-950/80',
  className = '',
  lang,
  allow,
  zoomFocus,
  zoomStart = 1,
  showLoading = false,
  fitBox = false,
}: PreviewFrameProps) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<Zoom>(() => String(zoomStart) as Zoom);
  // The canvas point in the middle of the view, in canvas pixels; null is the zoom focus.
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ x: number; y: number; from: { x: number; y: number } } | null>(null);
  // The page the iframe last finished loading: a new src, or a remount, waits for its own load.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  // Where the page's `data-preview-box` sits on the canvas, for `fitBox`.
  const [fitRect, setFitRect] = useState<Rect | null>(null);
  const zoomLabelId = useId();
  const frameSrc = withLangParam(src, lang ?? locale);
  const canvasWidth = canvas?.width;
  const canvasHeight = canvas?.height;
  const focusX = zoomFocus?.x;
  const focusY = zoomFocus?.y;

  // A new focus, such as the widget moved to another corner, brings the view to it.
  useEffect(() => {
    if (focusX !== undefined && focusY !== undefined) setCenter(null);
  }, [focusX, focusY]);

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
    const measure = () => {
      setScale(Math.min(element.clientWidth / canvasWidth, element.clientHeight / canvasHeight));
      setBox({ width: element.clientWidth, height: element.clientHeight });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [canvasWidth, canvasHeight]);

  const mounted = visible && Boolean(src) && (!canvas || scale > 0);
  const loaded = mounted && loadedSrc === frameSrc;

  // Scrolled out of view the iframe unmounts, so back in view it loads from the start.
  useEffect(() => {
    if (mounted) return;
    setLoadedSrc(null);
    setFitRect(null);
  }, [mounted]);

  useEffect(() => {
    if (!fitBox || !loaded) return;
    const measure = () => {
      // Same origin, so the frame can look inside; the rect is in canvas pixels, since the
      // iframe's own viewport is the canvas and the scaling is a transform on the iframe.
      const rect = frameRef.current?.contentDocument
        ?.querySelector(PREVIEW_BOX_SELECTOR)
        ?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;
      const { x, y, width, height } = rect;
      setFitRect((current) =>
        current &&
        current.x === x &&
        current.y === y &&
        current.width === width &&
        current.height === height
          ? current
          : { x, y, width, height },
      );
    };
    measure();
    // The box changes with the page, like new weather or a longer place name.
    const timer = window.setInterval(measure, 500);
    return () => window.clearInterval(timer);
  }, [fitBox, loaded]);

  const fitted = fitBox && canvas && box.width > 0 ? fitRect : null;
  const ready = loaded && (!fitBox || fitted !== null);
  const zoomable = Boolean(canvas && zoomFocus) && !fitted;
  const zoomed = zoomable && zoom !== '1';
  const shown = fitted
    ? Math.min(
        (box.width * FIT_FILL) / fitted.width,
        (box.height * FIT_FILL) / fitted.height,
        // Never past the page's own pixels, which would blur it.
        1,
      )
    : zoomable
      ? scale * Number(zoom)
      : scale;

  /** Keeps the view on the canvas: a point too near an edge moves in until the edge lines up. */
  const clampCenter = (point: { x: number; y: number }) => {
    if (!canvas || shown <= 0) return point;
    const axis = (value: number, size: number, view: number) => {
      const half = view / shown / 2;
      return size <= half * 2 ? size / 2 : Math.min(Math.max(value, half), size - half);
    };
    return {
      x: axis(point.x, canvas.width, box.width),
      y: axis(point.y, canvas.height, box.height),
    };
  };

  const view =
    canvas &&
    (fitted
      ? // Past the canvas edge is only transparent page, so the box itself is centered.
        { x: fitted.x + fitted.width / 2, y: fitted.y + fitted.height / 2 }
      : clampCenter(
          center ??
            (zoomFocus
              ? { x: zoomFocus.x * canvas.width, y: zoomFocus.y * canvas.height }
              : { x: canvas.width / 2, y: canvas.height / 2 }),
        ));
  // How far the canvas's middle sits from the frame's, in frame pixels.
  const shiftX = canvas && view ? Math.round((canvas.width / 2 - view.x) * shown) : 0;
  const shiftY = canvas && view ? Math.round((canvas.height / 2 - view.y) * shown) : 0;
  const shift = shiftX || shiftY ? ` translate(${shiftX}px, ${shiftY}px)` : '';

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!view) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, from: view };
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || shown <= 0) return;
    setCenter(
      clampCenter({
        x: start.from.x - (event.clientX - start.x) / shown,
        y: start.from.y - (event.clientY - start.y) / shown,
      }),
    );
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div
      ref={ref}
      aria-busy={showLoading ? !ready : undefined}
      // Fills its parent, which needs a height.
      className={`relative w-full overflow-hidden rounded-lg border border-zinc-300 shadow-inner dark:border-zinc-800 h-full ${backgroundClassName} ${className}`}
    >
      {mounted ? (
        <iframe
          ref={frameRef}
          src={frameSrc}
          title={title}
          allow={allow}
          onLoad={() => setLoadedSrc(frameSrc)}
          // Overlays can overflow a small frame by a pixel; OBS never shows their scrollbar, and
          // this non-interactive preview shouldn't either (in light mode it paints a white bar).
          scrolling="no"
          // Overlays are theme-neutral; the frame must match them or it stops being transparent.
          style={{
            colorScheme: 'normal',
            ...(canvas && {
              width: canvas.width,
              height: canvas.height,
              transform: `translate(-50%, -50%)${shift} scale(${shown})`,
            }),
          }}
          className={`pointer-events-none absolute border-0 ${
            canvas ? 'top-1/2 left-1/2' : 'inset-0 h-full w-full'
          } ${
            // Until it's ready the page stays hidden, so it never shows half drawn or, fitted,
            // jumps from its corner to the middle.
            showLoading || fitBox
              ? `transition-opacity duration-300 motion-reduce:transition-none ${ready ? 'opacity-100' : 'opacity-0'}`
              : ''
          }`}
        />
      ) : (
        !showLoading && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-zinc-400">
            {placeholder ?? t('common.previewLoading')}
          </div>
        )
      )}
      {showLoading && !ready && (
        <div
          data-testid="preview-loading"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span
            aria-hidden="true"
            className="size-6 animate-spin rounded-full border-2 border-white/15 border-t-white/70 motion-reduce:animate-none"
          />
          <span className="sr-only">{t('common.previewLoading')}</span>
        </div>
      )}
      {mounted && zoomed && (
        // Pointer-only: the zoom buttons below are the keyboard's way in, and open on the widget.
        <div
          aria-hidden="true"
          title={t('common.previewDrag')}
          data-testid="preview-pan"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        />
      )}
      {zoomable && (
        <div className="absolute bottom-2 left-1/2 w-32 -translate-x-1/2">
          <span id={zoomLabelId} className="sr-only">
            {t('common.previewZoom')}
          </span>
          <SegmentedControl
            labelledBy={zoomLabelId}
            value={zoom}
            onChange={(value) => {
              setZoom(value);
              setCenter(null);
            }}
            options={ZOOMS.map((value) => ({ value, label: `${value}×` }))}
          />
        </div>
      )}
    </div>
  );
}
