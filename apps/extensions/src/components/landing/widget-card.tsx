import { Link } from '@tanstack/react-router';
import { PlatformChips } from '#/components/platform-chips';
import { PreviewFrame, usePrefersReducedMotion } from '#/components/preview-frame';
import { useI18n } from '#/lib/i18n';
import type { WidgetEntry } from '#/lib/widgets';
import { getDemoSrc } from './demo-url';
import { ArrowRightIcon, CheckIcon } from './landing-icons';
import { FLUSH_FRAME_CLASS, STAGE_STYLE } from './stream-scene';
import { TOOL_FEATURES, ToolVisual } from './tool-visuals';

interface WidgetCardProps {
  widget: WidgetEntry;
  /** Level of the widget name heading, to fit the page outline. */
  headingLevel?: 'h2' | 'h3' | 'h4';
}

/**
 * Gallery card for one registry widget: a lazy live demo for overlays or a static picture with
 * feature chips for tools, then name, tagline and platforms. The whole card links to setup.
 */
export function WidgetCard({ widget, headingLevel: Heading = 'h3' }: WidgetCardProps) {
  const { t } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const isOverlay = widget.kind === 'overlay';
  const features = TOOL_FEATURES[widget.id];
  const name = t(widget.nameKey);

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-zinc-300 hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* With reduced motion the preview waits for a Play click, so it has to sit above the
          card-wide link; otherwise the link covers it and a click opens the setup page. */}
      <div
        className={`relative border-b border-zinc-200 dark:border-zinc-800 ${
          isOverlay ? 'aspect-[4/3]' : 'aspect-[2/1]'
        } ${isOverlay && reducedMotion ? 'z-10' : ''}`}
        style={STAGE_STYLE}
      >
        {isOverlay ? (
          <div className="absolute inset-0">
            <PreviewFrame
              src={getDemoSrc(widget)}
              title={t('home.demoTitle', { name })}
              motionSafe
              backgroundClassName="bg-transparent"
              className={FLUSH_FRAME_CLASS}
            />
          </div>
        ) : (
          <ToolVisual id={widget.id} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-green-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-green-400">
            <widget.Icon className="size-5" />
          </span>
          <Heading className="text-base font-semibold text-zinc-900 dark:text-white">
            <Link
              to={widget.setupPath}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {name}
            </Link>
          </Heading>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t(widget.taglineKey)}
        </p>
        {features && (
          <ul aria-label={t('home.toolFeatures')} className="mt-4 flex flex-wrap gap-1.5">
            {features.map((feature) => (
              <li
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300"
              >
                <CheckIcon className="size-3.5 shrink-0 text-green-600 dark:text-green-400" />
                {t(feature)}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <PlatformChips platforms={widget.platforms} />
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-400"
          >
            {t('home.setUp')}
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </article>
  );
}
