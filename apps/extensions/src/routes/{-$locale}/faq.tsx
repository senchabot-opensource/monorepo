import { createFileRoute } from '@tanstack/react-router';
import { ContentPage } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { FaqList } from '#/components/faq-list';
import { CONTENT_META } from '#/lib/guides';
import { type TranslationKey, translate, useT } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { LINKS } from '#/lib/links';
import { getSeoHead } from '#/lib/seo/pages';

const FAQ_GROUPS: readonly { id: string; title: TranslationKey; entries: readonly FaqEntry[] }[] = [
  {
    id: 'cost-and-account',
    title: 'faqPage.groups.basics',
    entries: [
      ['faqPage.freeQ', 'faqPage.freeA'],
      ['faqPage.loginQ', 'faqPage.loginA'],
      ['faqPage.affiliatedQ', 'faqPage.affiliatedA'],
    ],
  },
  {
    id: 'apps-and-platforms',
    title: 'faqPage.groups.platforms',
    entries: [
      ['faqPage.appsQ', 'faqPage.appsA'],
      ['faqPage.platformsQ', 'faqPage.platformsA'],
      ['faqPage.emptyQ', 'faqPage.emptyA'],
    ],
  },
  {
    id: 'widget-urls-and-privacy',
    title: 'faqPage.groups.urls',
    entries: [
      ['faqPage.editQ', 'faqPage.editA'],
      ['faqPage.oldUrlsQ', 'faqPage.oldUrlsA'],
      ['faqPage.privacyQ', 'faqPage.privacyA'],
    ],
  },
  {
    id: 'support',
    title: 'faqPage.groups.help',
    entries: [['faqPage.bugQ', 'faqPage.bugA']],
  },
];

export const Route = createFileRoute('/{-$locale}/faq')({
  head: () =>
    getSeoHead(
      { path: '/faq', meta: CONTENT_META.faq, image: 'guides' },
      {
        breadcrumbs: [{ name: translate('en', 'faqPage.breadcrumb') }],
        faq: FAQ_GROUPS.flatMap((group) => group.entries),
      },
    ),
  component: FaqPage,
});

function FaqPage() {
  const t = useT();
  return (
    <ContentPage
      breadcrumbs={[{ label: t('common.home'), href: '/' }, { label: t('faqPage.breadcrumb') }]}
      title={t('faqPage.title')}
      lead={t('faqPage.lead')}
    >
      <div className="mt-10 max-w-[42rem] space-y-12">
        {FAQ_GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={group.id}>
            <h2
              id={group.id}
              className="mb-4 scroll-mt-20 text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
            >
              {t(group.title)}
            </h2>
            <FaqList entries={group.entries} />
          </section>
        ))}
      </div>
      <div className="mt-16">
        <CtaBand
          title={t('faqPage.ctaTitle')}
          text={t('faqPage.ctaText')}
          actions={[
            { label: t('faqPage.ctaGuides'), to: '/guides' },
            { label: t('faqPage.ctaIssue'), href: LINKS.newIssue, external: true },
          ]}
        />
      </div>
    </ContentPage>
  );
}
