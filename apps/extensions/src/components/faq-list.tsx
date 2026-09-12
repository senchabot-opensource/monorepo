import { ChevronDownIcon } from '#/components/icons';
import { useT } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';

/**
 * Collapsible Q&A list. Pass the same `FaqEntry[]` to `getFaqJsonLd` in the route's head so
 * the FAQPage markup always matches what's on screen.
 */
export function FaqList({ entries }: { entries: readonly FaqEntry[] }) {
  const t = useT();
  return (
    <div className="space-y-3">
      {entries.map(([question, answer]) => (
        <details
          key={question}
          className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-medium text-zinc-700 group-hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-zinc-200 dark:group-hover:text-white [&::-webkit-details-marker]:hidden">
            <span>{t(question)}</span>
            <ChevronDownIcon className="size-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(answer)}
          </p>
        </details>
      ))}
    </div>
  );
}
