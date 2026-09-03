import { createFileRoute, Link } from '@tanstack/react-router';
import { type TranslationKey, useT } from '#/lib/i18n';
import { getLocaleLinks } from '#/lib/i18n/seo';

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
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Sub Sprout (Subscriber Goal Plants Overlay)',
              url: 'https://extensions.senchabot.com/setup/sub-growing-plant',
              description:
                'Free subscriber goal plants overlay that grows with new subscriptions on Twitch and Kick.',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Universal Chat (Multi-Chat Widget & Chat Box Overlay)',
              url: 'https://extensions.senchabot.com/setup/chat-widget',
              description:
                'Free customizable multi-chat widget and stream chat box overlay for Twitch and Kick with 7TV emotes.',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Raffle Picker (Chat Giveaway & Contest Tool)',
              url: 'https://extensions.senchabot.com/setup/raffle',
              description:
                'Free chat-based giveaway picker and live confetti winner overlay for Twitch and Kick.',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'OBS Bridge (Chat Scene Control & Broadcast Tool)',
              url: 'https://extensions.senchabot.com/setup/obs-bridge',
              description:
                'Free tool to control OBS Studio scenes and recording from chat commands.',
            },
            {
              '@type': 'ListItem',
              position: 5,
              name: 'Emote Wall (Floating Emote Overlay)',
              url: 'https://extensions.senchabot.com/setup/emote-wall',
              description:
                'Free floating emote overlay that shows emote-only Twitch, Kick, and 7TV chat messages at random screen positions with Calm drift or Chaos zip-across animations.',
            },
          ],
        },
      },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Are these customizable stream overlays really free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, all multi-chat widgets, subscriber goal plants, and stream overlays are 100% free, open-source, and watermark-free with no paid tiers.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need to create an account or sign in to use the chat box widget?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No login or account is required. Enter your Twitch or Kick channel name, customize your chat box or overlay, copy the URL, and paste it into OBS.',
              },
            },
            {
              '@type': 'Question',
              name: 'Which streaming software is supported?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Works with OBS, Streamlabs Desktop, XSplit, vMix, Lightstream, or any software that supports browser sources.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do I add a chat widget or subscriber goal plant that supports multiple platforms to OBS Studio?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Configure your widget, copy the URL, add a Browser Source in OBS Studio, and paste the URL.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the Emote Wall overlay and which messages trigger it?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Emote Wall is a free browser source overlay that turns emote-only Twitch, Kick, and 7TV chat messages into floating on-screen emotes. Only messages containing nothing but emotes trigger it; normal text messages are ignored. Choose Calm mode for emotes that pop up at random spots and drift away, or Chaos mode for emotes that zip across the screen from random edges.',
              },
            },
          ],
        },
      },
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
    title: 'Raffle Picker',
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

function Index() {
  const t = useT();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans dark:bg-zinc-950 dark:text-zinc-100">
      <header className="flex items-center justify-center py-10">
        <a
          className="inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-zinc-900 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white"
          href="https://senchabot.com"
          target="_blank"
          rel="noreferrer"
        >
          <div className="inline-flex size-10 shrink-0">
            <img src="/senchabot-logo.svg" alt="Senchabot" width={40} height={40} />
          </div>
          <span>Senchabot</span>
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
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
            <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                <span>{t('home.faq1Q')}</span>
                <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                {t('home.faq1A')}
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                <span>{t('home.faq2Q')}</span>
                <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                {t('home.faq2A')}
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                <span>{t('home.faq3Q')}</span>
                <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                {t('home.faq3A')}
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                <span>{t('home.faq4Q')}</span>
                <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                {t('home.faq4A')}
              </p>
            </details>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex justify-center mb-4">
            <a
              href="https://github.com/senchabot-opensource/monorepo/tree/dev/apps/extensions"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-green-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded dark:text-zinc-400 dark:hover:text-green-400"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              {t('home.footerGithub')}
            </a>
          </div>

          <div className="flex items-center justify-center gap-5 pt-2">
            <a
              href="https://x.com/senchabot"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded dark:hover:text-zinc-300"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/senchabot"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded dark:hover:text-zinc-300"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@senchabot"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded dark:hover:text-zinc-300"
              aria-label="YouTube"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://discord.com/invite/qUxwcjRzND"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded dark:hover:text-zinc-300"
              aria-label="Discord"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a
              href="https://reddit.com/r/Senchabot/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded dark:hover:text-zinc-300"
              aria-label="Subreddit"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0m5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701M9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249m5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249m-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484 1.106 3.447 1.106.963 0 2.605-.264 3.447-1.106a.331.331 0 0 0 0-.463.33.33 0 0 0-.464 0c-.547.547-1.877.79-2.983.79s-2.436-.243-2.983-.79a.326.326 0 0 0-.233-.095" />
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
