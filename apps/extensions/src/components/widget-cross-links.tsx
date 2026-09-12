import { Link } from '@tanstack/react-router';
import { useI18n } from '#/lib/i18n';
import { WIDGETS, type WidgetId } from '#/lib/widgets';

/** Cards linking to the setup page of every registry widget except `exclude`. */
export function WidgetCrossLinks({ exclude }: { exclude?: WidgetId }) {
  const { t } = useI18n();
  const widgets = WIDGETS.filter((widget) => widget.id !== exclude);
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {widgets.map((widget) => (
        <li key={widget.id}>
          <Link
            to={widget.setupPath}
            className="group flex h-full gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-green-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-green-400">
              <widget.Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-zinc-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                {t(widget.nameKey)}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-zinc-500 dark:text-zinc-400">
                {t(widget.taglineKey)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
