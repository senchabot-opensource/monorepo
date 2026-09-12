import { createFileRoute, Link } from '@tanstack/react-router';
import { SiteLayout } from '#/components/site-layout';
import { type TranslationKey, translate, useT } from '#/lib/i18n';
import { type FaqEntry, getFaqJsonLd, getLocaleLinks, SITE_URL } from '#/lib/i18n/seo';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title:
          'Free Customizable Stream Overlays, Browser Sources & Stream Tools (No Login) — Senchabot Extensions',
      },
      {
        name: 'description',
        content:
          '100% Free customizable stream overlays, multi-chat widgets, subscriber goal plants, floating emote wall overlays, transparent chat box overlays, and interactive stream tools for Twitch & Kick. Works with OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources. Zero login required.',
      },
      {
        name: 'keywords',
        content:
          'customizable stream overlays, multi-chat widgets, subscriber goal plants, chat box, stream chat box, emote wall, floating emotes, emote overlay, twitch emote overlay, kick emote overlay, 7tv emote overlay, free streaming widgets, stream tools, obs studio overlays, streamlabs desktop, xsplit broadcaster, vmix, lightstream, prism live studio, twitch widgets free, kick widgets free, free obs overlays, sub goal plant, stream raffle picker, obs bridge',
      },
      {
        property: 'og:title',
        content:
          'Free Customizable Stream Overlays, Browser Sources & Stream Tools (No Login Required) — Senchabot Extensions',
      },
      {
        property: 'og:description',
        content:
          '100% Free customizable stream overlays, multi-chat widgets, subscriber goal plants, floating emote wall overlays, chat box overlays, and stream tools for Twitch & Kick. Add to OBS Studio, Streamlabs Desktop, XSplit, or any browser source in seconds.',
      },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:url',
        content: 'https://extensions.senchabot.com',
      },
      {
        property: 'og:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
      { name: 'twitter:card', content: 'summary' },
      {
        name: 'twitter:title',
        content:
          'Free Customizable Stream Overlays, Browser Sources & Stream Tools (No Login Required)',
      },
      {
        name: 'twitter:description',
        content:
          '100% Free customizable stream overlays, multi-chat widgets, subscriber goal plants, floating emote wall overlays, and interactive stream tools for Twitch & Kick. Works with OBS Studio, Streamlabs Desktop, XSplit, vMix, and any browser source.',
      },
      {
        name: 'twitter:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Senchabot Extensions',
          description:
            'Free, open-source customizable stream overlays, multi-chat widgets, subscriber goal plants, floating emote wall overlays, chat box overlays, and stream tools for Twitch and Kick streamers. Works with OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, and any software supporting browser sources with no login required.',
          url: 'https://extensions.senchabot.com',
          publisher: {
            '@type': 'Organization',
            name: 'Senchabot',
            url: 'https://senchabot.com',
            logo: 'https://extensions.senchabot.com/senchabot-logo.svg',
          },
        },
      },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Free Customizable Stream Overlays, Browser Sources & Stream Tools',
          itemListElement: EXTENSIONS.map((ext, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: ext.title,
            url: `${SITE_URL}${ext.to}`,
            description: translate('en', `home.${ext.descriptionKey}` as TranslationKey),
          })),
        },
      },
      { 'script:ld+json': getFaqJsonLd(FAQ) },
    ],
    links: getLocaleLinks('/'),
  }),
  component: Index,
});

const EXTENSIONS = [
  {
    to: '/setup/sub-growing-plant' as const,
    icon: '🌱',
    tagKey: 'tagObsSource' as TranslationKey,
    tagColor: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
    title: 'Sub Sprout',
    descriptionKey: 'cardSubSprout' as TranslationKey,
  },
  {
    to: '/setup/chat-widget' as const,
    icon: '💬',
    tagKey: 'tagObsSource' as TranslationKey,
    tagColor: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
    title: 'Chat Box',
    descriptionKey: 'cardChatBox' as TranslationKey,
  },
  {
    to: '/setup/raffle' as const,
    icon: '🎉',
    tagKey: 'tagGiveaway' as TranslationKey,
    tagColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
    title: 'Raffle',
    descriptionKey: 'cardRaffle' as TranslationKey,
  },
  {
    to: '/setup/emote-wall' as const,
    icon: '😂',
    tagKey: 'tagObsSource' as TranslationKey,
    tagColor: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
    title: 'Emote Wall',
    descriptionKey: 'cardEmoteWall' as TranslationKey,
  },
  {
    to: '/setup/obs-bridge' as const,
    icon: '🔌',
    tagKey: 'tagControlTool' as TranslationKey,
    tagColor: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
    title: 'OBS Bridge',
    descriptionKey: 'cardObsBridge' as TranslationKey,
  }
];

const FAQ: FaqEntry[] = [
  ['home.faq1Q', 'home.faq1A'],
  ['home.faq2Q', 'home.faq2A'],
  ['home.faq3Q', 'home.faq3A'],
  ['home.faq4Q', 'home.faq4A'],
];

function Index() {
  const t = useT();

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 border border-zinc-200 px-3.5 py-1 text-xs font-medium text-zinc-600 mb-5 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300">
            <span className="inline-block size-2 rounded-full bg-green-500" />
            {t('home.heroBadge')}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 mb-4 tracking-tight dark:text-white">
            {t('home.heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed dark:text-zinc-400">
            {t('home.heroLead')}
          </p>
        </div>

        {/* Extensions Grid */}
        <section aria-label={t('home.sectionLabel')} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EXTENSIONS.map((ext) => (
              <Link
                key={ext.to}
                to={ext.to}
                className="group flex flex-col justify-between rounded-xl bg-white/90 p-6 border border-zinc-200 shadow-md transition-all hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:bg-zinc-900/90 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{ext.icon}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${ext.tagColor}`}
                    >
                      {t(`home.${ext.tagKey}` as TranslationKey)}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-green-600 transition-colors dark:text-white dark:group-hover:text-green-400">
                    {ext.title}
                  </h2>
                  <p className="text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {t(`home.${ext.descriptionKey}` as TranslationKey)}
                  </p>
                </div>
                <div className="mt-5 flex items-center text-xs font-semibold text-green-600 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300">
                  <span>{t('home.openSetup')}</span>
                  <span className="ml-1 text-zinc-500 font-normal">
                    · {t('home.noLoginHint')} &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick FAQ Section */}
        <section className="max-w-2xl mx-auto mb-16">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4 text-center dark:text-white">
            {t('home.faqTitle')}
          </h2>
          <div className="space-y-3">
            {FAQ.map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                  <span>{t(question)}</span>
                  <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">
                    ▼
                  </span>
                </summary>
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {t(answer)}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
