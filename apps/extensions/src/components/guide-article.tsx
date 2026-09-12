import { type ReactNode, useId } from 'react';
import { ContentPage, PROSE_CLASS, useLocaleDate } from '#/components/content-page';
import { LocaleLink } from '#/components/locale-link';
import { GUIDES_PATH, GUIDES_PUBLISHED, type GuideEntry, getGuide } from '#/lib/guides';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getWidget } from '#/lib/widgets';

export interface GuideSection {
  /** Anchor id, stable across languages. */
  id: string;
  title: TranslationKey;
  content: ReactNode;
}

const CARD_CLASS =
  'group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700';

/** A guide as a card: its question, what it answers and the widgets it covers. */
export function GuideCard({
  guide,
  headingLevel = 'h3',
}: {
  guide: GuideEntry;
  headingLevel?: 'h2' | 'h3';
}) {
  const { t } = useI18n();
  const Heading = headingLevel;
  return (
    <LocaleLink to={guide.path} className={CARD_CLASS}>
      <span className="flex gap-1.5" aria-hidden="true">
        {guide.widgets.map((id) => {
          const widget = getWidget(id);
          return (
            <span
              key={id}
              className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-green-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-green-400"
            >
              <widget.Icon className="size-4" />
            </span>
          );
        })}
      </span>
      <Heading className="mt-4 text-base font-semibold text-balance text-zinc-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
        {t(guide.titleKey)}
      </Heading>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t(guide.summaryKey)}
      </p>
      <span className="mt-4 text-sm font-semibold text-green-700 dark:text-green-400">
        {t('guides.readGuide')} <span aria-hidden="true">→</span>
      </span>
    </LocaleLink>
  );
}

function GuideMeta({ guide }: { guide: GuideEntry }) {
  const { t } = useI18n();
  const published = useLocaleDate(GUIDES_PUBLISHED, { dateStyle: 'long' });
  // Split around the placeholder so the date can sit in a <time> wherever the language puts it.
  const [beforeDate, afterDate = ''] = t('guides.published').split('{date}');
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400">
      <p>
        {beforeDate}
        <time dateTime={GUIDES_PUBLISHED}>{published}</time>
        {afterDate}
      </p>
      <p className="flex flex-wrap items-center gap-2">
        <span>{t('guides.covers')}:</span>
        {guide.widgets.map((id) => {
          const widget = getWidget(id);
          return (
            <LocaleLink
              key={id}
              to={widget.setupPath}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-700 transition-colors hover:border-green-500/40 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-green-400"
            >
              <widget.Icon className="size-3.5 text-green-600 dark:text-green-400" />
              {t(widget.nameKey)}
            </LocaleLink>
          );
        })}
      </p>
    </div>
  );
}

/** Layout for every guide: header, sections with an "On this page" list, CTA, related guides. */
export function GuideArticle({
  guide,
  sections,
  cta,
}: {
  guide: GuideEntry;
  sections: readonly GuideSection[];
  cta: ReactNode;
}) {
  const { t } = useI18n();
  const id = useId();
  const related = guide.related.map(getGuide);

  return (
    <ContentPage
      breadcrumbs={[
        { label: t('common.home'), href: '/' },
        { label: t('guides.breadcrumb'), href: GUIDES_PATH },
        { label: t(guide.shortKey) },
      ]}
      eyebrow={t('guides.eyebrow')}
      title={t(guide.titleKey)}
      lead={t(guide.leadKey)}
      meta={<GuideMeta guide={guide} />}
    >
      <div className="mt-10 border-t border-zinc-200 pt-2 lg:grid lg:grid-cols-[minmax(0,42rem)_14rem] lg:justify-between lg:gap-12 dark:border-zinc-800">
        <article className={PROSE_CLASS}>
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id}>{t(section.title)}</h2>
              {section.content}
            </section>
          ))}
        </article>
        <aside className="max-lg:hidden">
          <nav aria-labelledby={`${id}-toc`} className="sticky top-20 pt-10">
            <p
              id={`${id}-toc`}
              className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white"
            >
              {t('guides.onThisPage')}
            </p>
            <ul className="mt-3 space-y-2 border-l border-zinc-200 dark:border-zinc-800">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block rounded-r border-l border-transparent py-0.5 pl-3 text-sm leading-snug text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white"
                  >
                    {t(section.title)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <div className="mt-16 space-y-14">
        {cta}
        <section aria-labelledby={`${id}-related`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id={`${id}-related`}
              className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
            >
              {t('guides.relatedTitle')}
            </h2>
            <LocaleLink
              to={GUIDES_PATH}
              className="rounded text-sm font-semibold text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
            >
              {t('guides.allGuides')} <span aria-hidden="true">→</span>
            </LocaleLink>
          </div>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((entry) => (
              <li key={entry.id}>
                <GuideCard guide={entry} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPage>
  );
}
