import { LocaleLink } from '#/components/locale-link';
import type { SitePath } from '#/lib/i18n/paths';

export interface BreadcrumbItem {
  label: string;
  href?: SitePath;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center space-x-2 text-sm text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-zinc-400 dark:text-zinc-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast || !item.href ? (
                <span
                  className={isLast ? 'font-medium text-zinc-700 dark:text-zinc-300' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : item.href === '/' ? (
                <LocaleLink
                  to={item.href}
                  title={item.label}
                  aria-label={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100/70 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:border-green-500/40 dark:hover:text-green-400"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
                    />
                  </svg>
                  {item.label}
                </LocaleLink>
              ) : (
                <LocaleLink
                  to={item.href}
                  className="transition-colors hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded dark:hover:text-green-400 dark:focus-visible:ring-offset-zinc-950"
                >
                  {item.label}
                </LocaleLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
