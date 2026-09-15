import { type TranslationKey, useT } from '#/lib/i18n';

/** Numbered steps. The list draws the numbers, so step copy must not start with "1.". */
export function StepsList({ steps }: { steps: readonly TranslationKey[] }) {
  const t = useT();
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3">
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-xs font-semibold text-green-700 dark:text-green-400"
          >
            {index + 1}
          </span>
          <span className="pt-0.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(step)}
          </span>
        </li>
      ))}
    </ol>
  );
}
