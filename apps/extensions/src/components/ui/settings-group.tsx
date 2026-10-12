import type { ReactNode } from 'react';

/**
 * A titled block of controls in a settings panel; every group after the first gets a divider.
 * `hideTitle` keeps the heading for screen readers only, for a group that is alone in a tab
 * already named the same.
 */
export function SettingsGroup({
  title,
  hideTitle = false,
  children,
}: {
  title: string;
  hideTitle?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-zinc-200 pt-3 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <h2
        className={
          hideTitle
            ? 'sr-only'
            : 'text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400'
        }
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
