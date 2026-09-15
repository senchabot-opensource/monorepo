import type { ReactNode } from 'react';
import { SiteFooter } from '#/components/site-footer';
import { SiteHeader } from '#/components/site-header';

/** Full header, a `#main` landmark and the footer: the frame for landing and content pages. */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
