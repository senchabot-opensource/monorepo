import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '#/components/breadcrumb';
import { ExternalLink } from '#/components/external-link';
import { SiteLayout } from '#/components/site-layout';
import { toUtcDate } from '#/lib/dates';
import { type Locale, type TranslationKey, useI18n, useT } from '#/lib/i18n';
import { localizePath } from '#/lib/i18n/paths';
import { isExternalHref, parseRichText } from '#/lib/rich-text';

const LINK_CLASS =
  'rounded-sm font-medium text-green-700 underline decoration-green-600/30 underline-offset-2 transition-colors hover:decoration-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400 dark:decoration-green-400/30 dark:hover:decoration-green-400';

/** Reading column for long copy; `not-prose` blocks (steps, tables, callouts) opt out. */
export const PROSE_CLASS =
  'prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:leading-7 prose-li:leading-7 prose-a:no-underline prose-code:rounded prose-code:bg-zinc-200/60 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.875em] prose-code:font-medium prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-800';

/** Renders translated copy with its `code` spans and [label](href) links. */
export function Rich({ text }: { text: string }) {
  const { locale } = useI18n();
  return (
    <>
      {parseRichText(text).map((token, index) => {
        const key = `${index}-${token.type}`;
        if (token.type === 'code') return <code key={key}>{token.text}</code>;
        if (token.type === 'link') {
          return isExternalHref(token.href) ? (
            <ExternalLink key={key} href={token.href} className={LINK_CLASS}>
              {token.text}
            </ExternalLink>
          ) : (
            <Link key={key} to={localizePath(token.href, locale)} className={LINK_CLASS}>
              {token.text}
            </Link>
          );
        }
        return token.text;
      })}
    </>
  );
}

/** A paragraph of translated copy. */
export function P({ k }: { k: TranslationKey }) {
  const t = useT();
  return (
    <p>
      <Rich text={t(k)} />
    </p>
  );
}

export function Bullets({ items }: { items: readonly TranslationKey[] }) {
  const t = useT();
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <Rich text={t(item)} />
        </li>
      ))}
    </ul>
  );
}

/** Numbered steps at reading size; the list draws the numbers. */
export function Steps({ steps }: { steps: readonly TranslationKey[] }) {
  const t = useT();
  return (
    <ol className="not-prose my-6 space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-xs font-semibold text-green-700 dark:text-green-400"
          >
            {index + 1}
          </span>
          <span className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
            <Rich text={t(step)} />
          </span>
        </li>
      ))}
    </ol>
  );
}

export interface TableColumn {
  label: string;
  /** Monospace cells, e.g. commands. */
  code?: boolean;
  nowrap?: boolean;
}

/** Scrolls on its own below its natural width, so the page never scrolls sideways. */
export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: readonly TableColumn[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white">
          <tr>
            {columns.map((column) => (
              <th key={column.label} scope="col" className="px-4 py-2.5 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {rows.map((row, rowIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static rows that never reorder.
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const column = columns[cellIndex];
                const Cell = cellIndex === 0 ? 'th' : 'td';
                return (
                  <Cell
                    key={column?.label ?? cellIndex}
                    scope={cellIndex === 0 ? 'row' : undefined}
                    className={`px-4 py-2.5 align-top leading-6 text-zinc-700 dark:text-zinc-300 ${
                      cellIndex === 0 ? 'font-medium text-zinc-900 dark:text-white' : ''
                    } ${column?.code ? 'font-mono text-[0.8125rem]' : ''} ${
                      column?.nowrap ? 'whitespace-nowrap' : ''
                    }`}
                  >
                    {cell}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A warning the reader must not skim past. */
export function Callout({ title, text }: { title: string; text: string }) {
  return (
    <div
      role="note"
      className="not-prose my-6 rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:border-amber-500/25 dark:bg-amber-500/10"
    >
      <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{title}</p>
      <p className="mt-1 text-sm leading-6 text-amber-900/90 dark:text-amber-100/90">
        <Rich text={text} />
      </p>
    </div>
  );
}

export function formatDate(locale: Locale, date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(toUtcDate(date));
}

/** Site frame with breadcrumbs, the page H1 and an optional lead for content pages. */
export function ContentPage({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  meta,
  children,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  /** Answer-first intro; may carry inline markup. */
  lead?: string;
  /** Extra lines under the lead, e.g. date and covered widgets. */
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:pt-8 sm:pb-24">
        <Breadcrumb items={breadcrumbs} />
        <header className="mt-8 max-w-[42rem]">
          {eyebrow && (
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance text-zinc-900 sm:text-4xl dark:text-white">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              <Rich text={lead} />
            </p>
          )}
          {meta}
        </header>
        {children}
      </div>
    </SiteLayout>
  );
}

export function useLocaleDate(date: string, options: Intl.DateTimeFormatOptions) {
  const { locale } = useI18n();
  return formatDate(locale, date, options);
}
