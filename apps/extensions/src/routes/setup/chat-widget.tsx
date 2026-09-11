import { createFileRoute, Link } from '@tanstack/react-router';
import { type ReactNode, useDeferredValue, useEffect, useId, useMemo, useState } from 'react';
import { Breadcrumb } from '#/components/breadcrumb';
import { FieldLabel } from '#/components/ui/field-label';
import { InfoTip } from '#/components/ui/info-tip';
import { NumberField } from '#/components/ui/number-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { Select, type SelectOption } from '#/components/ui/select';
import { Switch } from '#/components/ui/switch';
import { YoutubeTutorial } from '#/components/youtube-tutorial';
import {
  type Animation,
  buildWidgetParams,
  DEFAULT_SETTINGS,
  type Font,
  type Layout,
  type Orientation,
  type PlatformDisplay,
  type Platforms,
  parseWidgetUrl,
  type Settings,
} from '#/features/widgets/chat-widget/widget-settings';
import { useI18n } from '#/lib/i18n';
import { getLocaleLinks } from '#/lib/i18n/seo';

export const Route = createFileRoute('/setup/chat-widget')({
  head: () => ({
    meta: [
      {
        title:
          'Free Multi-Chat Widget & Stream Chat Box for Twitch & Kick (No Login Required) — Chat Box | Senchabot',
      },
      {
        name: 'description',
        content:
          'Combine Twitch and Kick chat into one free multi-chat widget and stream chat box overlay. 100% Free & No Login Required. Supports 7TV emotes, badges, custom fonts, animations, and customizable stream overlays for OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources.',
      },
      {
        name: 'keywords',
        content:
          'chat box, stream chat box, multi-chat widgets, customizable stream overlays, stream tools, free twitch kick chat overlay, multi-stream chat overlay no login, unified chat widget free, combined chat overlay obs, streamlabs chat box, xsplit chat widget, cross-platform stream chat free',
      },
      {
        property: 'og:title',
        content:
          'Free Multi-Chat Widget & Stream Chat Box for Twitch & Kick (No Login Required) — Chat Box | Senchabot',
      },
      {
        property: 'og:description',
        content:
          '100% Free multi-chat widget and stream chat box overlay merging Twitch and Kick into a single feed. No login or account required. 7TV emotes and badges included.',
      },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:url',
        content: 'https://extensions.senchabot.com/setup/chat-widget',
      },
      {
        property: 'og:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
      { name: 'twitter:card', content: 'summary' },
      {
        name: 'twitter:title',
        content: 'Free Multi-Chat Widget & Stream Chat Box for Twitch & Kick (No Login Required)',
      },
      {
        name: 'twitter:description',
        content:
          'Combine Twitch and Kick chat in OBS Studio, Streamlabs Desktop, XSplit, or any software supporting browser sources. Zero login required. 100% Free with 7TV emotes and badge support.',
      },
      {
        name: 'twitter:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Chat Box - Free Multi-Chat Widget & Stream Chat Box',
          description:
            'A free customizable multi-chat widget and stream chat box overlay that merges Twitch and Kick chat into a single on-stream feed with 7TV emotes, badges, and customizable themes.',
          url: 'https://extensions.senchabot.com/setup/chat-widget',
          applicationCategory: 'MultimediaApplication',
          operatingSystem:
            'All, OBS Studio, Streamlabs Desktop, XSplit Broadcaster, vMix, Lightstream, PRISM Live Studio, Twitch Studio, Meld Studio, Wirecast, Browser Source compatible',
          isAccessibleForFree: true,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: '100% Free, No Login Required',
          },
        },
      },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is this multi-chat widget and stream chat box completely free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, Chat Box is 100% free and open-source with no subscription fees, account sign-ups, or watermarks.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does the chat box support 7TV emotes?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, 7TV custom channel emotes and animated emotes are supported automatically without extra extensions.',
              },
            },
          ],
        },
      },
    ],
    links: getLocaleLinks('/setup/chat-widget'),
  }),
  component: ChatWidgetSetup,
});

// Messages per second for the mock preview only; index 0 keeps the widget's default mock pace.
const PREVIEW_RATES = [0.3, 0.5, 1, 2, 3, 5, 10, 15, 20];

const PANEL_CLASS =
  'rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900';
const INPUT_CLASS =
  'h-9 w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';
const RANGE_CLASS =
  'h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-300 accent-green-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-700';

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-zinc-200 pt-3 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ChatWidgetSetup() {
  const { locale, t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [previewRateIndex, setPreviewRateIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  // Text typed or pasted into the URL field that isn't a widget URL yet; null shows the generated URL.
  const [urlDraft, setUrlDraft] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const deferredTwitch = useDeferredValue(twitchChannel);
  const deferredKick = useDeferredValue(kickChannel);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const widgetUrl = useMemo(() => {
    if (!mounted) return '';
    const params = buildWidgetParams(settings, twitchChannel, kickChannel);
    if (!params.has('twitch') && !params.has('kick')) return '';
    return `${window.location.origin}/widgets/chat-widget?${params.toString()}`;
  }, [mounted, settings, twitchChannel, kickChannel]);

  const previewUrl = useMemo(() => {
    if (!mounted) return '';
    const params = buildWidgetParams(settings, deferredTwitch, deferredKick);
    params.append('mock', 'true');
    if (previewRateIndex > 0) params.append('mockRate', String(PREVIEW_RATES[previewRateIndex]));
    params.append('lang', locale);
    return `${window.location.origin}/widgets/chat-widget?${params.toString()}`;
  }, [mounted, settings, deferredTwitch, deferredKick, previewRateIndex, locale]);

  const handleCopy = async () => {
    if (widgetUrl) {
      await navigator.clipboard.writeText(widgetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUrlChange = (text: string) => {
    const parsed = parseWidgetUrl(text);
    if (!parsed) {
      setUrlDraft(text);
      return;
    }
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    setUrlDraft(null);
  };

  const platformOptions: SegmentedOption<Platforms>[] = [
    { value: 'both', label: t('chatWidget.both') },
    { value: 'twitch', label: t('chatWidget.twitch') },
    { value: 'kick', label: t('chatWidget.kick') },
  ];
  const platformDisplayOptions: SelectOption<PlatformDisplay>[] = [
    { value: 'name', label: t('chatWidget.platformName') },
    { value: 'icon', label: t('chatWidget.platformIcon') },
    { value: 'none', label: t('chatWidget.platformHidden') },
  ];
  const fontOptions: SelectOption<Font>[] = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'nunito', label: 'Nunito' },
    { value: 'mono', label: 'JetBrains Mono' },
    { value: 'serif', label: 'Source Serif 4' },
    { value: 'system', label: t('chatWidget.fontSystem') },
  ];
  const orientationOptions: SegmentedOption<Orientation>[] = [
    { value: 'vertical', label: t('chatWidget.vertical') },
    { value: 'horizontal', label: t('chatWidget.horizontal') },
  ];
  const layoutOptions: SelectOption<Layout>[] = [
    { value: 'inline', label: t('chatWidget.layoutInline') },
    { value: 'stacked', label: t('chatWidget.layoutStacked') },
    { value: 'card', label: t('chatWidget.layoutCard') },
    { value: 'compact', label: t('chatWidget.layoutCompact') },
  ];
  const animationOptions: SelectOption<Animation>[] = [
    { value: 'slide', label: t('chatWidget.animSlide') },
    { value: 'smooth', label: t('chatWidget.animSmoothSlide') },
    { value: 'pop', label: t('chatWidget.animPop') },
    { value: 'bounce', label: t('chatWidget.animBounce') },
    { value: 'stagger', label: t('chatWidget.animStagger') },
    { value: 'fade', label: t('chatWidget.animFade') },
    { value: 'typing', label: t('chatWidget.animTyping') },
    { value: 'none', label: t('chatWidget.animNone') },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-4 lg:h-dvh lg:min-h-[640px]">
        <header className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 pr-32">
          <Link
            to="/"
            className="shrink-0 rounded-md transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <img src="/senchabot-logo.svg" alt="Senchabot" width={36} height={36} />
          </Link>
          <div className="min-w-0">
            <Breadcrumb
              items={[
                { label: t('common.home'), href: '/' },
                { label: t('chatWidget.breadcrumb') },
              ]}
            />
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                {t('chatWidget.title')}
              </h1>
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                {t('common.freeBadge')}
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[34rem_minmax(0,1fr)]">
          {/* Scrolling happens on the inner box, so on short screens content is clipped inside the
              panel padding instead of running under the bottom edge; its p-1 keeps focus rings unclipped. */}
          <div className={`${PANEL_CLASS} p-4 lg:flex lg:min-h-0 lg:flex-col`}>
            <div className="space-y-3 p-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              <SettingsGroup title={t('chatWidget.sectionChannel')}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel id={`${id}-platforms`} tip={t('chatWidget.platformsTip')}>
                      {t('chatWidget.platforms')}
                    </FieldLabel>
                    <SegmentedControl
                      labelledBy={`${id}-platforms`}
                      value={settings.platforms}
                      onChange={(value) => update('platforms', value)}
                      options={platformOptions}
                    />
                  </div>
                  <div>
                    <FieldLabel id={`${id}-indicator`} tip={t('chatWidget.platformIndicatorTip')}>
                      {t('chatWidget.platformIndicator')}
                    </FieldLabel>
                    <Select
                      labelledBy={`${id}-indicator`}
                      disabled={settings.platforms !== 'both'}
                      value={settings.platformDisplay}
                      onChange={(value) => update('platformDisplay', value)}
                      options={platformDisplayOptions}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor={`${id}-twitch`} tip={t('chatWidget.channelTip')}>
                      {t('chatWidget.twitchChannel')}
                    </FieldLabel>
                    <input
                      id={`${id}-twitch`}
                      type="text"
                      disabled={settings.platforms === 'kick'}
                      value={twitchChannel}
                      onChange={(e) => setTwitchChannel(e.target.value)}
                      placeholder={t('common.channelPlaceholder')}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor={`${id}-kick`} tip={t('chatWidget.channelTip')}>
                      {t('chatWidget.kickChannel')}
                    </FieldLabel>
                    <input
                      id={`${id}-kick`}
                      type="text"
                      disabled={settings.platforms === 'twitch'}
                      value={kickChannel}
                      onChange={(e) => setKickChannel(e.target.value)}
                      placeholder={t('common.channelPlaceholder')}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </SettingsGroup>

              <SettingsGroup title={t('chatWidget.sectionAppearance')}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  <div>
                    <FieldLabel id={`${id}-font`}>{t('chatWidget.font')}</FieldLabel>
                    <Select
                      labelledBy={`${id}-font`}
                      value={settings.font}
                      onChange={(value) => update('font', value)}
                      options={fontOptions}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor={`${id}-font-size`}>{t('chatWidget.fontSize')}</FieldLabel>
                    <NumberField
                      id={`${id}-font-size`}
                      value={settings.fontSize}
                      onChange={(value) => update('fontSize', value)}
                      min={8}
                      max={72}
                      fallback={Number(DEFAULT_SETTINGS.fontSize)}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <FieldLabel id={`${id}-orientation`} tip={t('chatWidget.orientationTip')}>
                      {t('chatWidget.orientation')}
                    </FieldLabel>
                    <SegmentedControl
                      labelledBy={`${id}-orientation`}
                      value={settings.orientation}
                      onChange={(value) => update('orientation', value)}
                      options={orientationOptions}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel id={`${id}-layout`}>{t('chatWidget.messageLayout')}</FieldLabel>
                  <Select
                    labelledBy={`${id}-layout`}
                    value={settings.layout}
                    onChange={(value) => update('layout', value)}
                    options={layoutOptions}
                  />
                </div>
                <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  <Switch
                    label={t('chatWidget.darkBackground')}
                    tip={t('chatWidget.darkBackgroundTip')}
                    checked={settings.background}
                    onChange={(value) => update('background', value)}
                  />
                  <div className="flex min-h-7 items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      aria-label={t('chatWidget.backgroundOpacity')}
                      title={t('chatWidget.backgroundOpacity')}
                      disabled={!settings.background}
                      value={settings.bgOpacity}
                      onChange={(e) => update('bgOpacity', e.target.value)}
                      className={RANGE_CLASS}
                    />
                    <span
                      className={`w-9 shrink-0 text-right text-xs tabular-nums text-zinc-500 ${settings.background ? '' : 'opacity-40'}`}
                    >
                      {Math.round(Number(settings.bgOpacity) * 100)}%
                    </span>
                  </div>
                  <Switch
                    label={t('chatWidget.messageBackgroundBox')}
                    tip={t('chatWidget.messageBackgroundHint')}
                    checked={settings.itemBackground}
                    onChange={(value) => update('itemBackground', value)}
                  />
                  <Switch
                    label={t('chatWidget.platformAccent')}
                    tip={t('chatWidget.platformAccentHint')}
                    checked={settings.platformAccent}
                    onChange={(value) => update('platformAccent', value)}
                  />
                  <Switch
                    label={t('chatWidget.boldUsernames')}
                    checked={settings.boldUsernames}
                    onChange={(value) => update('boldUsernames', value)}
                  />
                  <Switch
                    label={t('chatWidget.boldMessages')}
                    checked={settings.boldMessages}
                    onChange={(value) => update('boldMessages', value)}
                  />
                </div>
              </SettingsGroup>

              <SettingsGroup title={t('chatWidget.sectionMessages')}>
                <div>
                  <FieldLabel id={`${id}-animation`} tip={t('chatWidget.animationTip')}>
                    {t('chatWidget.newMessageAnimation')}
                  </FieldLabel>
                  <Select
                    labelledBy={`${id}-animation`}
                    value={settings.animation}
                    onChange={(value) => update('animation', value)}
                    options={animationOptions}
                  />
                </div>
                <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  <Switch
                    label={t('chatWidget.sevenTvEmotes')}
                    tip={t('chatWidget.sevenTvTip')}
                    checked={settings.sevenTv}
                    onChange={(value) => update('sevenTv', value)}
                  />
                  <Switch
                    label={t('chatWidget.showBadges')}
                    tip={t('chatWidget.badgesTip')}
                    checked={settings.badges}
                    onChange={(value) => update('badges', value)}
                  />
                  <Switch
                    label={t('chatWidget.showMessageTime')}
                    checked={settings.timestamp}
                    onChange={(value) => update('timestamp', value)}
                  />
                  <Switch
                    label={t('chatWidget.keepMessages')}
                    tip={t('chatWidget.keepMessagesTip')}
                    checked={settings.keep}
                    onChange={(value) => update('keep', value)}
                  />
                </div>
              </SettingsGroup>
            </div>
          </div>

          <div className={`${PANEL_CLASS} flex h-[640px] flex-col gap-3 p-5 lg:h-auto lg:min-h-0`}>
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {t('chatWidget.previewTitle')}
              </h2>
              <InfoTip text={t('chatWidget.previewHint')} />
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-950/80 shadow-inner dark:border-zinc-800">
              {mounted ? (
                <iframe
                  src={previewUrl}
                  className="pointer-events-none absolute inset-0 h-full w-full border-0"
                  title={t('chatWidget.previewIframeTitle')}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  {t('common.previewNoChannel')}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 items-center gap-1">
                <label
                  htmlFor={`${id}-speed`}
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {t('chatWidget.previewSpeed')}
                </label>
                <InfoTip text={t('chatWidget.previewSpeedHint')} />
              </div>
              <input
                id={`${id}-speed`}
                type="range"
                min="0"
                max={PREVIEW_RATES.length - 1}
                step="1"
                value={previewRateIndex}
                onChange={(e) => setPreviewRateIndex(Number(e.target.value))}
                className={RANGE_CLASS}
              />
              <span className="w-20 shrink-0 text-right text-xs tabular-nums text-zinc-500">
                {t('chatWidget.previewSpeedValue', { rate: PREVIEW_RATES[previewRateIndex] })}
              </span>
            </div>
            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <FieldLabel htmlFor={`${id}-url`} tip={t('chatWidget.widgetUrlTip')}>
                {t('common.widgetUrl')}
              </FieldLabel>
              <div className="flex">
                <input
                  id={`${id}-url`}
                  type="text"
                  spellCheck={false}
                  value={urlDraft ?? widgetUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={() => setUrlDraft(null)}
                  placeholder={t('chatWidget.widgetUrlPlaceholder')}
                  aria-invalid={Boolean(urlDraft)}
                  aria-describedby={`${id}-url-hint`}
                  className="h-9 w-full min-w-0 rounded-l-md border border-zinc-300 bg-zinc-100 px-3 text-sm text-zinc-600 placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 aria-invalid:border-red-500 aria-invalid:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!widgetUrl}
                  className="h-9 shrink-0 rounded-r-md bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? t('common.copied') : t('common.copy')}
                </button>
              </div>
              {urlDraft ? (
                <p
                  id={`${id}-url-hint`}
                  className="mt-2 text-xs leading-relaxed text-red-600 dark:text-red-400"
                >
                  {t('chatWidget.widgetUrlInvalid')}
                </p>
              ) : (
                <p id={`${id}-url-hint`} className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {t('common.browserSourceHint')}
                  {t('chatWidget.browserSourceHintSize')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-4 pb-12 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t('chatWidget.intro')}
          </p>
          <YoutubeTutorial />
          <div className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">
              {t('chatWidget.guideTitle')}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t('chatWidget.guideStep1')}
              <br />
              {t('chatWidget.guideStep2')}
              <br />
              {t('chatWidget.guideStep3')}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(
            [
              ['chatWidget.faq1Q', 'chatWidget.faq1A'],
              ['chatWidget.faq2Q', 'chatWidget.faq2A'],
            ] as const
          ).map(([question, answer]) => (
            <details
              key={question}
              className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                <span>{t(question)}</span>
                <span className="text-xs text-zinc-500 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t(answer)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
