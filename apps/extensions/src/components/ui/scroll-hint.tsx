import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '#/components/icons';
import { useI18n } from '#/lib/i18n';

/** Sub-pixel slack, so a scrollHeight that rounds up by a hair doesn't fake a scrollable box. */
const EDGE_SLACK_PX = 4;

type Edge = 'down' | 'up';

export interface ScrollHintProps {
  /** Classes for the wrapper; where the box scrolls it has to be a column flexbox. */
  className?: string;
  /** Classes for the scrolling box itself, including its `overflow-y-auto`. */
  scrollClassName?: string;
  children: ReactNode;
}

/**
 * Wraps a scrolling box with the arrow that says where the rest of the content is: down while
 * anything is still below, up once you reach the end, nothing at all when the box doesn't
 * scroll. Panels that only overflow on some screen sizes need no extra wiring — the arrow
 * follows the measurement, not the breakpoint.
 *
 * The arrow sits under the box rather than floating over it, so it never covers the control that
 * happens to be at the bottom edge.
 */
export function ScrollHint({ className, scrollClassName, children }: ScrollHintProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Measuring reads three already-settled layout values, so it runs inline rather than on a
    // frame: a shared requestAnimationFrame would also land in every test that counts frames.
    const measure = () => {
      const room = el.scrollHeight - el.clientHeight;
      if (room <= EDGE_SLACK_PX) setEdge(null);
      else setEdge(el.scrollTop >= room - EDGE_SLACK_PX ? 'up' : 'down');
    };

    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    // A box inside a closed dropdown or dialog mounts at display:none, where it measures as
    // unscrollable and no resize is reported when it opens. Coming into view is that signal.
    const visible = new IntersectionObserver(measure);
    visible.observe(el);
    // The box keeps its own size when a group folds open or a conditional setting appears, so the
    // content has to be watched as well or the arrow goes stale.
    const mutate = new MutationObserver(measure);
    mutate.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      el.removeEventListener('scroll', measure);
      resize.disconnect();
      visible.disconnect();
      mutate.disconnect();
    };
  }, []);

  const jump = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: edge === 'down' ? el.scrollHeight : 0, behavior: 'smooth' });
  };

  return (
    <div className={className}>
      <div ref={ref} className={scrollClassName}>
        {children}
      </div>
      {edge && (
        <button
          type="button"
          onClick={jump}
          aria-label={t(edge === 'down' ? 'common.scrollMore' : 'common.scrollTop')}
          className="mt-1 flex w-full shrink-0 items-center justify-center rounded-md py-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <ChevronDownIcon
            className={
              edge === 'down'
                ? 'size-4 animate-scroll-hint motion-reduce:animate-none'
                : 'size-4 rotate-180'
            }
          />
        </button>
      )}
    </div>
  );
}
