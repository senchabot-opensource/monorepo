import type { ReactNode } from 'react';

/** A titled block of controls in a settings panel; every group after the first gets a divider. */
export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-zinc-200 pt-3 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
