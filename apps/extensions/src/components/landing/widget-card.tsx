import { LocaleLink } from '#/components/locale-link';
import { PlatformChips } from '#/components/platform-chips';
import { PreviewFrame } from '#/components/preview-frame';
import { useI18n } from '#/lib/i18n';
import type { WidgetEntry } from '#/lib/widgets';
import { getDemoSrc } from './demo-url';
import { ArrowRightIcon, CheckIcon } from './landing-icons';
import { FLUSH_FRAME_CLASS, STAGE_STYLE } from './stream-scene';
import { hasToolVisual, TOOL_FEATURES, ToolVisual } from './tool-visuals';

/**
 * Card shape in the gallery grid, from the live demo's browser-source size: a portrait source (a
 * chat column) gets a card two rows tall, a strip (a goal bar) one two columns wide. Tools are
 * two by two with a flat picture each, so they never span.
 */
export type CardShape = 'standard' | 'tall' | 'wide';

export function getCardShape(widget: WidgetEntry): CardShape {
  if (widget.kind === 'tool') return 'standard';
  const size = widget.demoUrl ? widget.sourceSize : null;
  if (!size) return 'standard';
  const ratio = size.width / size.height;
  if (ratio < 1) return 'tall';
  if (ratio >= 2) return 'wide';
  return 'standard';
}

/** True when the cards fill whole rows at every column count the grid uses. */
const fillsRows = (shapes: CardShape[], columns: readonly number[]) => {
  const cells = shapes.reduce((sum, shape) => sum + (shape === 'standard' ? 1 : 2), 0);
  return columns.every((count) => cells % count === 0);
};

/**
 * Shapes for one gallery grid of the given column counts. A set one cell short (four overlays
 * beside the tall chat column) widens its last standard card. One that would still leave a hole
 * drops the wide cards first, then the tall one, then every span, so the grid stays even instead
 * of showing a lone card. The tall chat column goes last: it reads as the gallery's anchor.
 */
export function getGalleryShapes(
  widgets: readonly WidgetEntry[],
  columns: readonly number[],
): CardShape[] {
  const shapes = widgets.map(getCardShape);
  if (fillsRows(shapes, columns)) return shapes;
  const last = shapes.lastIndexOf('standard');
  const widened = shapes.map((shape, index) => (index === last ? 'wide' : shape));
  if (last >= 0 && fillsRows(widened, columns)) return widened;
  for (const dropped of ['wide', 'tall'] as const) {
    const fewer = shapes.map((shape) => (shape === dropped ? 'standard' : shape));
    if (fillsRows(fewer, columns)) return fewer;
  }
  return shapes.map(() => 'standard');
}

// Standard overlays are 4:3: Sub Sprout's demo sizes its pot by width, so a flatter box clips it.
// A tall card fills its two grid rows once there is more than one column.
const PREVIEW_CLASS: Record<CardShape, string> = {
  standard: 'aspect-[4/3]',
  tall: 'aspect-[4/3] sm:aspect-auto sm:flex-1',
  wide: '',
};

interface WidgetCardProps {
  widget: WidgetEntry;
  /** Level of the widget name heading, to fit the page outline. */
  headingLevel?: 'h2' | 'h3' | 'h4';
  shape?: CardShape;
}

/**
 * Gallery card for one registry widget: a lazy live demo when it has one, or a static picture,
 * then name, tagline, a tool's feature chips and platforms. The whole card links to setup.
 */
export function WidgetCard({
  widget,
  headingLevel: Heading = 'h3',
  shape = 'standard',
}: WidgetCardProps) {
  const { t } = useI18n();
  // A tool's own picture explains it better than its overlay squeezed into a flat card.
  const hasDemo = Boolean(widget.demoUrl) && !hasToolVisual(widget.id);
  const features = TOOL_FEATURES[widget.id];
  const name = t(widget.nameKey);
  const size = widget.sourceSize;
  // A wide card shows the strip at its own aspect ratio.
  const previewStyle =
    shape === 'wide' && size
      ? { ...STAGE_STYLE, aspectRatio: `${size.width} / ${size.height}` }
      : STAGE_STYLE;

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-zinc-300 hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div
        className={`relative border-b border-zinc-200 dark:border-zinc-800 ${
          // Tools are flatter, so the four of them take two short rows under the overlays.
          widget.kind === 'overlay' ? PREVIEW_CLASS[shape] : 'aspect-[2/1] lg:aspect-[5/2]'
        }`}
        style={previewStyle}
      >
        {hasDemo ? (
          <div className="absolute inset-0">
            <PreviewFrame
              src={getDemoSrc(widget, 'card')}
              title={t('home.demoTitle', { name })}
              backgroundClassName="bg-transparent"
              className={FLUSH_FRAME_CLASS}
            />
          </div>
        ) : (
          <ToolVisual id={widget.id} />
        )}
      </div>

      <div className={`flex flex-col p-5 ${shape === 'tall' ? '' : 'flex-1'}`}>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-green-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-green-400">
            <widget.Icon className="size-5" />
          </span>
          <Heading className="text-base font-semibold text-zinc-900 dark:text-white">
            <LocaleLink
              to={widget.setupPath}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {name}
            </LocaleLink>
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
