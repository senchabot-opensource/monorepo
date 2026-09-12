import { createFileRoute } from '@tanstack/react-router';
import { ContentPage, Rich } from '#/components/content-page';
import { GuideCard } from '#/components/guide-article';
import { CONTENT_META, GUIDES, GUIDES_PATH } from '#/lib/guides';
import { translate, useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { pageUrl } from '#/lib/seo/head';
import { getSeoHead } from '#/lib/seo/pages';
import { getItemListNode } from '#/lib/seo/structured-data';

export const Route = createFileRoute('/{-$locale}/guides/')({
  head: ({ params }) => {
    const locale = getParamsLocale(params);
    return getSeoHead(
      { path: GUIDES_PATH, locale, meta: CONTENT_META.guides, image: 'guides' },
      {
        breadcrumbs: [{ name: translate(locale, 'guides.breadcrumb') }],
        mainEntity: getItemListNode({
          id: `${pageUrl(GUIDES_PATH, locale)}#guides`,
          locale,
          name: translate(locale, 'guides.index.title'),
          items: GUIDES.map((guide) => ({
            name: translate(locale, guide.titleKey),
            path: guide.path,
          })),
        }),
      },
    );
  },
  component: GuidesIndex,
});

function GuidesIndex() {
  const t = useT();
  return (
    <ContentPage
      breadcrumbs={[{ label: t('common.home'), href: '/' }, { label: t('guides.breadcrumb') }]}
      title={t('guides.index.title')}
      lead={t('guides.index.lead')}
    >
      <ul aria-label={t('guides.index.listLabel')} className="mt-10 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <li key={guide.id}>
            <GuideCard guide={guide} headingLevel="h2" />
          </li>
        ))}
      </ul>
      <p className="mt-10 max-w-[42rem] text-base leading-7 text-zinc-600 dark:text-zinc-400">
        <Rich text={t('guides.index.moreText')} />
      </p>
    </ContentPage>
  );
}
