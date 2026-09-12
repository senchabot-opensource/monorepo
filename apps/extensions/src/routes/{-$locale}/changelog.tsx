import { createFileRoute } from '@tanstack/react-router';
import { ContentPage, formatDate } from '#/components/content-page';
import { CHANGELOG, groupByMonth } from '#/lib/changelog';
import { CONTENT_META } from '#/lib/guides';
import { translate, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getSeoHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/changelog')({
  head: ({ params }) => {
    const locale = getParamsLocale(params);
    return getSeoHead(
      { path: '/changelog', locale, meta: CONTENT_META.changelog, image: 'guides' },
      { breadcrumbs: [{ name: translate(locale, 'changelog.breadcrumb') }] },
    );
  },
  component: ChangelogPage,
});

const MONTHS = groupByMonth(CHANGELOG);

const TAG_CLASS =
  'inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-px text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300';

function ChangelogPage() {
  const { locale, t } = useI18n();
  return (
    <ContentPage
      breadcrumbs={[{ label: t('common.home'), href: '/' }, { label: t('changelog.breadcrumb') }]}
      title={t('changelog.title')}
      lead={t('changelog.lead')}
    >
      <div className="mt-10 max-w-[42rem] space-y-12">
        {MONTHS.map(({ month, entries }) => (
          <section key={month} aria-labelledby={`month-${month}`}>
            <h2
              id={`month-${month}`}
              className="scroll-mt-20 border-b border-zinc-200 pb-2 text-xl font-bold tracking-tight text-zinc-900 capitalize dark:border-zinc-800 dark:text-white"
            >
              {formatDate(locale, month, { month: 'long', year: 'numeric' })}
            </h2>
            <ol className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
              {entries.map((entry) => (
                <li key={entry.key} className="flex gap-4 py-4">
                  <time
                    dateTime={entry.date}
                    className="w-14 shrink-0 pt-0.5 text-sm text-zinc-500 tabular-nums dark:text-zinc-400"
                  >
                    {formatDate(locale, entry.date, { day: 'numeric', month: 'short' })}
                  </time>
                  <div className="min-w-0">
                    <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
                      {t(entry.key)}
                    </p>
                    <p className="mt-1.5 flex flex-wrap gap-1.5">
                      {entry.widgets.length === 0 ? (
                        <span className={TAG_CLASS}>{t('changelog.site')}</span>
                      ) : (
                        entry.widgets.map((id) => (
                          <span key={id} className={TAG_CLASS}>
                            {t(getWidget(id).nameKey)}
                          </span>
                        ))
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </ContentPage>
  );
}
