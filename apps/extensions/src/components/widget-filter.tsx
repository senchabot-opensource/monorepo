import { useId } from 'react';
import { useI18n } from '#/lib/i18n';
import {
  type CategoryFilter,
  inCategory,
  WIDGET_CATEGORIES,
  type WidgetEntry,
} from '#/lib/widgets';

interface WidgetFilterProps {
  /** The widgets being filtered; categories none of them has get no pill. */
  widgets: readonly WidgetEntry[];
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  /** Smaller pills, for a menu. */
  compact?: boolean;
  className?: string;
}

/**
 * Category pills over a list of widgets: All, then each category that has one here, with its
 * count. Radios under the pills, so it's one tab stop with arrow keys, like SegmentedControl,
 * but the pills wrap on a narrow screen.
 */
export function WidgetFilter({
  widgets,
  value,
  onChange,
  compact = false,
  className = '',
}: WidgetFilterProps) {
  const { t } = useI18n();
  const name = useId();
  const options = [
    { value: 'all' as CategoryFilter, count: widgets.length },
    ...WIDGET_CATEGORIES.map((category) => ({
      value: category as CategoryFilter,
      count: inCategory(widgets, category).length,
    })).filter((option) => option.count > 0),
  ];
  const shown = inCategory(widgets, value).length;

  return (
    <fieldset className={`min-w-0 ${className}`}>
      <legend className="sr-only">{t('common.filterWidgets')}</legend>
      <div className={`flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white font-medium ${compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'} text-zinc-700 transition-colors select-none hover:border-zinc-300 hover:text-zinc-900 has-checked:border-green-600 has-checked:bg-green-600 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-green-500 has-focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white dark:has-checked:border-green-500 dark:has-checked:bg-green-500 dark:has-checked:text-zinc-950 dark:has-focus-visible:ring-offset-zinc-950`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {t(`widgets.categories.${option.value}`)}{' '}
            <span className="rounded-full bg-zinc-100 px-1.5 text-xs tabular-nums text-zinc-500 group-has-checked:bg-white/20 group-has-checked:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:group-has-checked:bg-zinc-950/15 dark:group-has-checked:text-zinc-950">
              {option.count}
            </span>
          </label>
        ))}
      </div>
      {/* Quiet until the filter changes; then a screen reader hears how many are left. */}
      <p aria-live="polite" className="sr-only">
        {value === 'all' ? '' : t('common.filterShowing', { count: shown, total: widgets.length })}
      </p>
    </fieldset>
  );
}
