import { createFileRoute } from '@tanstack/react-router';
import type { ComponentType } from 'react';
import { CtaBand } from '#/components/cta-band';
import { ExternalLink } from '#/components/external-link';
import { FaqList } from '#/components/faq-list';
import { GithubIcon, type IconProps } from '#/components/icons';
import { CommunityLinks } from '#/components/landing/community-links';
import {
  ArrowRightIcon,
  CheckIcon,
  CodeIcon,
  LinkIcon,
  NoWatermarkIcon,
  UserOffIcon,
} from '#/components/landing/landing-icons';
import { StreamScene } from '#/components/landing/stream-scene';
import { WidgetCard } from '#/components/landing/widget-card';
import { SiteLayout } from '#/components/site-layout';
import { StepsList } from '#/components/steps-list';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '#/components/ui/button-styles';
import { type Locale, type TranslationKey, translate, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { LINKS } from '#/lib/links';
import { pageUrl } from '#/lib/seo/head';
import { getSeoHead, PAGE_META } from '#/lib/seo/pages';
import { getItemListNode } from '#/lib/seo/structured-data';
import { OVERLAYS, TOOLS, WIDGETS, type WidgetPlatform } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/')({
  head: ({ params }) => {
    const locale = getParamsLocale(params);
    return getSeoHead(
      { path: '/', locale, meta: PAGE_META.home, image: 'home' },
      {
        faq: FAQ,
        mainEntity: getItemListNode({
          id: `${pageUrl('/', locale)}#widgets`,
          locale,
          name: WIDGET_LIST_NAME[locale],
          items: WIDGETS.map((widget) => ({
            name: translate(locale, widget.nameKey),
            path: widget.setupPath,
            description: translate(locale, widget.taglineKey),
          })),
        }),
      },
    );
  },
  component: Index,
});

const WIDGET_LIST_NAME: Record<Locale, string> = {
  en: 'Senchabot Extensions overlays and tools',
  tr: "Senchabot Extensions overlay'leri ve araçları",
};

const FAQ: FaqEntry[] = [
  ['home.faq1Q', 'home.faq1A'],
  ['home.faq2Q', 'home.faq2A'],
  ['home.faq3Q', 'home.faq3A'],
  ['home.faq4Q', 'home.faq4A'],
  ['home.faq5Q', 'home.faq5A'],
  ['home.faq6Q', 'home.faq6A'],
];

const HOW_STEPS: TranslationKey[] = ['home.howStep1', 'home.howStep2', 'home.howStep3'];

const SIZED_WIDGETS = WIDGETS.filter((widget) => widget.sourceSize);

const PLATFORM_MARKS: { platform: WidgetPlatform; label: string; color: string }[] = [
  { platform: 'twitch', label: 'Twitch', color: '#9146FF' },
  { platform: 'kick', label: 'Kick', color: '#53FC18' },
];

const TRUST_POINTS: {
  Icon: ComponentType<IconProps>;
  title: TranslationKey;
  text: TranslationKey;
  source?: boolean;
}[] = [
  { Icon: UserOffIcon, title: 'home.noLoginTitle', text: 'home.noLoginText' },
  { Icon: NoWatermarkIcon, title: 'home.noWatermarkTitle', text: 'home.noWatermarkText' },
  { Icon: CodeIcon, title: 'home.openSourceTitle', text: 'home.openSourceText', source: true },
  { Icon: LinkIcon, title: 'home.urlSettingsTitle', text: 'home.urlSettingsText' },
];

const LABEL_CLASS =
  'text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400';
const CARD_CLASS =
  'rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900';
const TEXT_LINK_CLASS =
  'rounded font-medium text-green-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400';

function SectionHeading({ id, title, lead }: { id: string; title: string; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <h2
        id={id}
        className="text-2xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-3xl dark:text-white"
      >
        {title}
      </h2>
      {lead && (
        <p className="mt-3 text-base leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
          {lead}
        </p>
      )}
    </div>
  );
}

function PlatformDot({ color, className = 'size-2' }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`rounded-full ${className}`}
      style={{ background: color }}
    />
  );
}

function Hero() {
  const { t } = useI18n();
  const checks: TranslationKey[] = ['home.trustFree', 'home.trustNoLogin', 'home.trustOpenSource'];
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(45% 55% at 78% 18%, rgba(34, 197, 94, 0.12), transparent 70%)',
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="text-4xl font-bold tracking-tight text-balance text-zinc-900 sm:text-5xl lg:text-[3.375rem] lg:leading-[1.05] dark:text-white"
          >
            {t('home.heroTitle')}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
            {t('home.heroLead')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#widgets" className={BUTTON_PRIMARY}>
              {t('home.browseWidgets')}
              <ArrowRightIcon className="size-4 rotate-90" />
            </a>
            <ExternalLink href={LINKS.source} className={BUTTON_SECONDARY}>
              <GithubIcon className="size-4" />
              {t('home.viewOnGithub')}
            </ExternalLink>
          </div>
          <ul
            aria-label={t('home.trustLabel')}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {checks.map((key) => (
              <li key={key} className="inline-flex items-center gap-1.5">
                <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                {t(key)}
              </li>
            ))}
            <li className="inline-flex items-center gap-1.5">
              <span className="flex gap-1 px-0.5">
                {PLATFORM_MARKS.map(({ platform, color }) => (
                  <PlatformDot key={platform} color={color} />
                ))}
              </span>
              {t('home.trustPlatforms')}
            </li>
          </ul>
        </div>
        <StreamScene />
      </div>
    </section>
  );
}

function WorksWith() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="works-with-title"
      className="border-y border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <h2 id="works-with-title" className="sr-only">
        {t('home.worksWithTitle')}
      </h2>
      <dl className="mx-auto flex max-w-6xl flex-col items-center gap-x-10 gap-y-4 px-4 py-6 text-center sm:flex-row sm:justify-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <dt className={LABEL_CLASS}>{t('common.platforms')}</dt>
          <dd className="flex items-center gap-5">
            {PLATFORM_MARKS.map(({ platform, label, color }) => (
              <span
                key={platform}
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-900 dark:text-white"
              >
                <PlatformDot color={color} className="size-2.5" />
                {label}
              </span>
            ))}
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-zinc-200 sm:border-l sm:pl-10 dark:border-zinc-800">
          <dt className={LABEL_CLASS}>{t('home.worksWithApps')}</dt>
          <dd className="text-[15px] font-medium text-zinc-900 dark:text-white">
            {t('home.worksWithAppsText')}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Gallery() {
  const { t } = useI18n();
  const groups = [
    { key: 'overlays', widgets: OVERLAYS, lead: 'home.overlaysLead', columns: 'lg:grid-cols-3' },
    { key: 'tools', widgets: TOOLS, lead: 'home.toolsLead', columns: '' },
  ] as const;
  return (
    <section id="widgets" aria-labelledby="widgets-title" className="scroll-mt-20">
      <SectionHeading
        id="widgets-title"
        title={t('home.galleryTitle')}
        lead={t('home.galleryLead')}
      />
      <div className="mt-10 space-y-14">
        {groups.map((group) => (
          <div key={group.key}>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {t(`widgets.${group.key}`)}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t(group.lead)}</p>
            </div>
            <ul className={`grid gap-5 sm:grid-cols-2 ${group.columns}`}>
              {group.widgets.map((widget) => (
                <li key={widget.id} className="flex">
                  <WidgetCard widget={widget} headingLevel="h4" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="how-title"
      className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <div>
        <SectionHeading id="how-title" title={t('home.howTitle')} lead={t('home.howLead')} />
        <div className="mt-8 max-w-xl">
          <StepsList steps={HOW_STEPS} />
        </div>
      </div>
      <div className={`${CARD_CLASS} p-6`}>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          {t('home.sizesTitle')}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t('home.sizesNote')}</p>
        <table className="mt-4 w-full text-sm">
          <thead className="sr-only">
            <tr>
              <th scope="col">{t('home.sizesWidget')}</th>
              <th scope="col">{t('home.sizesValue')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {SIZED_WIDGETS.map((widget) => (
              <tr key={widget.id}>
                <th
                  scope="row"
                  className="py-3 text-left font-medium text-zinc-800 dark:text-zinc-200"
                >
                  <span className="flex items-center gap-2.5">
                    <widget.Icon className="size-4 shrink-0 text-green-600 dark:text-green-400" />
                    {t(widget.nameKey)}
                  </span>
                </th>
                <td className="py-3 text-right font-mono text-[13px] text-zinc-600 tabular-nums dark:text-zinc-400">
                  {widget.sourceSize?.width} × {widget.sourceSize?.height}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Trust() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="trust-title">
      <SectionHeading id="trust-title" title={t('home.trustTitle')} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map(({ Icon, title, text, source }) => (
          <li key={title} className={`${CARD_CLASS} flex flex-col p-6`}>
            <span className="flex size-10 items-center justify-center rounded-xl bg-green-500/10 text-green-700 dark:text-green-400">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
              {t(title)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t(text)}
            </p>
            {source && (
              <p className="mt-auto pt-4 text-sm">
                <ExternalLink href={LINKS.source} className={TEXT_LINK_CLASS}>
                  {t('common.nav.github')}
                </ExternalLink>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  const more: [href: string, label: string][] = [
    [LINKS.discord, 'Discord'],
    [LINKS.discussions, t('common.footer.discussions')],
  ];
  return (
    <section
      aria-labelledby="faq-title"
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16"
    >
      <div>
        <SectionHeading id="faq-title" title={t('common.faqTitle')} />
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{t('home.faqMore')}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {more.map(([href, label]) => (
            <li key={href}>
              <ExternalLink href={href} className={TEXT_LINK_CLASS}>
                {label}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="max-w-2xl">
        <FaqList entries={FAQ} />
      </div>
    </section>
  );
}

function Index() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      <Hero />
      <WorksWith />
      <div className="mx-auto max-w-6xl space-y-24 px-4 py-20 sm:space-y-28 sm:py-24">
        <Gallery />
        <HowItWorks />
        <Trust />
        <CtaBand
          title={t('home.senchabotTitle')}
          text={t('home.senchabotText')}
          actions={[{ label: t('home.senchabotCta'), href: LINKS.senchabot, external: true }]}
        />
        <section aria-labelledby="community-title">
          <SectionHeading
            id="community-title"
            title={t('home.communityTitle')}
            lead={t('home.communityLead')}
          />
          <div className="mt-8">
            <CommunityLinks />
          </div>
        </section>
        <Faq />
      </div>
    </SiteLayout>
  );
}
