import type { CSSProperties } from 'react';
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

const SPANS: Record<CardShape, { cols: number; rows: number }> = {
  standard: { cols: 1, rows: 1 },
  tall: { cols: 1, rows: 2 },
  wide: { cols: 2, rows: 1 },
};

/**
 * Whether the cards leave no empty cell in a grid `columns` wide. It lays them out the way
 * `grid-flow-row-dense` does, first free block from the top for each card, because counting
 * cells alone can come out even and still leave holes: three strips in a three-column grid
 * take a row each and leave the third column empty.
 */
function packs(shapes: CardShape[], columns: number): boolean {
  if (shapes.some((shape) => SPANS[shape].cols > columns)) return false;
  const rows: boolean[][] = [];
  const rowAt = (index: number) => (rows[index] ??= Array.from({ length: columns }, () => false));
  const free = (row: number, col: number, span: { cols: number; rows: number }) =>
    Array.from({ length: span.rows }, (_, r) => r).every((r) =>
      Array.from({ length: span.cols }, (_, c) => c).every((c) => !rowAt(row + r)[col + c]),
    );
  for (const shape of shapes) {
    const span = SPANS[shape];
    let placed = false;
    for (let row = 0; !placed; row++) {
      for (let col = 0; col <= columns - span.cols; col++) {
        if (!free(row, col, span)) continue;
        for (let r = 0; r < span.rows; r++) {
          for (let c = 0; c < span.cols; c++) rowAt(row + r)[col + c] = true;
        }
        placed = true;
        break;
      }
    }
  }
  return rows.every((row) => row.every(Boolean));
}

/** The last standard card widened, e.g. to fill a grid that is one cell short. */
const widenLast = (shapes: CardShape[]): CardShape[] => {
  const last = shapes.lastIndexOf('standard');
  return last < 0 ? shapes : shapes.map((shape, index) => (index === last ? 'wide' : shape));
};

/**
 * Shapes for the gallery grid at one column count, the first arrangement that leaves no hole. A
 * set one cell short (four overlays beside the tall chat column) widens its last standard card;
 * one that would still leave a hole drops the wide cards first, then the tall one, then every
 * span, so the grid stays even instead of showing a lone card.
 *
 * Each width is solved on its own, because one set of shapes rarely fills both the two and the
 * three column grid: seven overlays pack exactly into three columns as they are, while two
 * columns need the last card widened. The grid then swaps the spans per breakpoint.
 */
export function getGalleryShapes(widgets: readonly WidgetEntry[], columns: number): CardShape[] {
  const shapes = widgets.map(getCardShape);
  const tries = [
    shapes,
    widenLast(shapes),
    ...(['wide', 'tall'] as const).map((dropped) =>
      shapes.map((shape) => (shape === dropped ? 'standard' : shape)),
    ),
  ];
  return tries.find((candidate) => packs(candidate, columns)) ?? shapes.map(() => 'standard');
}

// Standard overlays are 4:3: Sub Sprout's demo sizes its pot by width, so a flatter box clips it.
// A tall card fills its two grid rows, a strip keeps its own source ratio, and both are set per
// breakpoint, because a card can be a strip in the two column grid and a plain cell in the three.
const PREVIEW_CLASS: Record<'sm' | 'lg', Record<CardShape, string>> = {
  sm: {
    standard: 'sm:aspect-[4/3] sm:flex-none',
    tall: 'sm:aspect-auto sm:flex-1',
    wide: 'sm:aspect-[var(--source-aspect)] sm:flex-none',
  },
  lg: {
    standard: 'lg:aspect-[4/3] lg:flex-none',
    tall: 'lg:aspect-auto lg:flex-1',
    wide: 'lg:aspect-[var(--source-aspect)] lg:flex-none',
  },
};

interface WidgetCardProps {
  widget: WidgetEntry;
  /** Level of the widget name heading, to fit the page outline. */
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** The card's shape in the two and the three column grid; one column is always standard. */
  shapes?: { sm: CardShape; lg: CardShape };
}

/**
 * Gallery card for one registry widget: a lazy live demo when it has one, or a static picture,
 * then name, tagline, a tool's feature chips and platforms. The whole card links to setup.
 */
export function WidgetCard({
  widget,
  headingLevel: Heading = 'h3',
  shapes = { sm: 'standard', lg: 'standard' },
}: WidgetCardProps) {
  const { t } = useI18n();
  // A tool's own picture explains it better than its overlay squeezed into a flat card.
  const hasDemo = Boolean(widget.demoUrl) && !hasToolVisual(widget.id);
  const features = TOOL_FEATURES[widget.id];
  const name = t(widget.nameKey);
  const size = widget.sourceSize;
  // Read by the wide shape's class, so the strip keeps its source ratio only where it is one.
  const previewStyle = size
    ? ({ ...STAGE_STYLE, '--source-aspect': `${size.width} / ${size.height}` } as CSSProperties)
    : STAGE_STYLE;

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-zinc-300 hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div
        className={`relative border-b border-zinc-200 dark:border-zinc-800 ${
          // Tools are flatter, so the four of them take two short rows under the overlays.
          widget.kind === 'overlay'
            ? `aspect-[4/3] ${PREVIEW_CLASS.sm[shapes.sm]} ${PREVIEW_CLASS.lg[shapes.lg]}`
            : 'aspect-[2/1] lg:aspect-[5/2]'
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

      <div
        className={`flex flex-1 flex-col p-5 ${shapes.sm === 'tall' ? 'sm:flex-none' : 'sm:flex-1'} ${
          shapes.lg === 'tall' ? 'lg:flex-none' : 'lg:flex-1'
        }`}
      >
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
