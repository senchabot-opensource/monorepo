import { createFileRoute } from '@tanstack/react-router';
import { ContentPage, Rich } from '#/components/content-page';
import { GuideCard } from '#/components/guide-article';
import { getContentHead, pageUrl } from '#/lib/content-seo';
import { CONTENT_META, GUIDES, GUIDES_PATH } from '#/lib/guides';
import { translate, useT } from '#/lib/i18n';

export const Route = createFileRoute('/guides/')({
  head: () =>
    getContentHead({
      path: GUIDES_PATH,
      meta: CONTENT_META.guides,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: translate('en', 'guides.index.title'),
          itemListElement: GUIDES.map((guide, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: translate('en', guide.titleKey),
            url: pageUrl(guide.path),
          })),
        },
      ],
    }),
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
