import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useId, useState } from 'react';
import { ContentPage } from '#/components/content-page';
import { ExternalLink } from '#/components/external-link';
import { FaqList } from '#/components/faq-list';
import { PreviewFrame } from '#/components/preview-frame';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, BUTTON_TEST } from '#/components/ui/button-styles';
import type { PresetData } from '#/features/presets/preset-schema';
import { PresetSwatch, SWATCH_FONT_HREF } from '#/features/presets/preset-swatch';
import {
  applyPresetToUrl,
  PRESET_WIDGETS,
  presetCanvas,
  presetDemoUrl,
  type RethemedUrl,
} from '#/features/presets/preset-widgets';
import {
  CLASSIC_PRESET,
  findPreset,
  isClassic,
  PRESET_PARAM,
  PRESETS,
} from '#/features/presets/registry';
import { readSitePreset, useSitePreset } from '#/features/presets/site-preset';
import { CONTENT_META } from '#/lib/guides';
import { translate, useI18n } from '#/lib/i18n';
import { getParamsLocale, localizePath } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { LINKS } from '#/lib/links';
import { getSeoHead } from '#/lib/seo/pages';

const FAQ: FaqEntry[] = [
  ['presets.faq1Q', 'presets.faq1A'],
  ['presets.faq2Q', 'presets.faq2A'],
  ['presets.faq3Q', 'presets.faq3A'],
  ['presets.faq4Q', 'presets.faq4A'],
];

export const Route = createFileRoute('/{-$locale}/presets')({
  head: ({ params }) => {
    const locale = getParamsLocale(params);
    return getSeoHead(
      { path: '/presets', locale, meta: CONTENT_META.presets, image: 'home' },
      { breadcrumbs: [{ name: translate(locale, 'presets.breadcrumb') }], faq: FAQ },
    );
  },
  component: PresetsPage,
});

const BUILTIN = PRESETS.filter((entry) => entry.source === 'builtin');
const COMMUNITY = PRESETS.filter((entry) => entry.source === 'community');
const CHOICES = [
  { id: CLASSIC_PRESET, data: null as PresetData | null, community: false },
  ...BUILTIN.map((entry) => ({ id: entry.data.id, data: entry.data, community: false })),
  ...COMMUNITY.map((entry) => ({ id: entry.data.id, data: entry.data, community: true })),
];

const CARD_CLASS =
  'rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900';

// A dim scene behind the transparent overlays, so they read like they do over a game.
const SCENE_CLASS =
  'bg-[radial-gradient(circle_at_30%_25%,#3b5a4a,#1d2a33_60%,#12171c)] dark:bg-[radial-gradient(circle_at_30%_25%,#2c4538,#18222a_60%,#0d1115)]';

function PresetsPage() {
  const { t, locale } = useI18n();
  const id = useId();
  const [sitePreset, setSitePreset] = useSitePreset();
  const [picked, setPicked] = useState(CLASSIC_PRESET);
  // Opens on the visitor's default, or on the preset a link names; both are known only after mount.
  useEffect(() => {
    const linked = new URLSearchParams(window.location.search).get(PRESET_PARAM);
    setPicked(findPreset(linked ?? readSitePreset())?.data.id ?? CLASSIC_PRESET);
  }, []);

  const preset = findPreset(picked);
  const name = preset?.data.name ?? t('presets.classic');
  const description = !preset
    ? t('presets.descriptions.classic')
    : preset.source === 'builtin'
      ? t(`presets.descriptions.${preset.data.id}` as 'presets.descriptions.rift')
      : (preset.data.description?.[locale] ?? '');

  return (
    <ContentPage
      breadcrumbs={[{ label: t('common.home'), href: '/' }, { label: t('presets.breadcrumb') }]}
      eyebrow={t('presets.eyebrow')}
      title={t('presets.title')}
      lead={t('presets.lead')}
    >
      {/* No precedence: React would hold the page back until Google Fonts answers. */}
      <link rel="stylesheet" href={SWATCH_FONT_HREF} />

      <section aria-labelledby={`${id}-pick`} className="mt-10">
        <h2
          id={`${id}-pick`}
          className="mb-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          {t('presets.pickTitle')}
        </h2>
        <fieldset
          aria-labelledby={`${id}-pick`}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
        >
          {CHOICES.map((choice) => (
            <label
              key={choice.id}
              className={`${CARD_CLASS} cursor-pointer p-2 transition-colors hover:border-zinc-300 has-checked:border-transparent has-checked:ring-2 has-checked:ring-green-500 has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:hover:border-zinc-700`}
            >
              <input
                type="radio"
                name={`${id}-preset`}
                value={choice.id}
                checked={picked === choice.id}
                onChange={() => setPicked(choice.id)}
                className="sr-only"
              />
              <PresetSwatch preset={choice.data} />
              <span className="mt-2 block truncate text-sm font-semibold text-zinc-900 dark:text-white">
                {choice.data?.name ?? t('presets.classic')}
              </span>
              <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                {choice.community
                  ? t('presets.by', { author: choice.data?.author.name ?? '' })
                  : (choice.data?.game ?? t('presets.classicTag'))}
              </span>
            </label>
          ))}
        </fieldset>
      </section>

      <section aria-labelledby={`${id}-preview`} className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[42rem]">
            <h2
              id={`${id}-preview`}
              className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
            >
              {t('presets.previewTitle', { name })}
              {preset?.data.game && (
                <span className="ml-2 align-middle text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {preset.data.game}
                </span>
              )}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {description}
              {preset?.source === 'community' && (
                <>
                  {' '}
                  {preset.data.author.url ? (
                    <ExternalLink href={preset.data.author.url} className="font-medium underline">
                      {t('presets.by', { author: preset.data.author.name })}
                    </ExternalLink>
                  ) : (
                    t('presets.by', { author: preset.data.author.name })
                  )}
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
            {sitePreset === picked ? (
              <span className="inline-flex h-10 items-center text-sm font-semibold text-green-700 dark:text-green-400">
                ✓ {t('presets.isDefault', { name })}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setSitePreset(picked)}
                className={BUTTON_PRIMARY}
              >
                {t('presets.makeDefault', { name })}
              </button>
            )}
            <p className="max-w-xs text-xs text-zinc-500 sm:text-right dark:text-zinc-400">
              {t('presets.defaultHint')}
            </p>
          </div>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_WIDGETS.map((widget) => {
            const widgetName = t(widget.nameKey);
            return (
              <li key={widget.id} className={`${CARD_CLASS} overflow-hidden`}>
                <div className="aspect-[16/10]">
                  <PreviewFrame
                    // A new frame per preset, so each one starts its demo from the top.
                    key={picked}
                    src={presetDemoUrl(widget, picked)}
                    title={t('presets.previewIframeTitle', { widget: widgetName, name })}
                    canvas={presetCanvas(widget)}
                    backgroundClassName={SCENE_CLASS}
                    lang={locale}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
                    <widget.Icon className="size-4 shrink-0 text-green-600 dark:text-green-400" />
                    <span className="truncate">{widgetName}</span>
                  </span>
                  {/* The setup page opens on this preset even when it isn't the default. */}
                  <Link
                    to={localizePath(widget.setupPath, locale)}
                    search={isClassic(picked) ? {} : { [PRESET_PARAM]: picked }}
                    className="shrink-0 rounded-sm text-sm font-medium text-green-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
                  >
                    {t('presets.setUp', { widget: widgetName })} →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <ExistingUrls preset={picked} name={name} />

      <section aria-labelledby={`${id}-community`} className={`${CARD_CLASS} mt-12 p-6`}>
        <h2
          id={`${id}-community`}
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          {t('presets.communityTitle')}
        </h2>
        <p className="mt-2 max-w-[42rem] text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {t('presets.communityText')}
        </p>
        {COMMUNITY.length === 0 && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t('presets.communityEmpty')}
          </p>
        )}
        <ExternalLink href={LINKS.presetGuide} className={`${BUTTON_SECONDARY} mt-4`}>
          {t('presets.communityLink')}
        </ExternalLink>
      </section>

      <section aria-labelledby={`${id}-faq`} className="mt-12 max-w-[42rem]">
        <h2
          id={`${id}-faq`}
          className="mb-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          {t('presets.faqTitle')}
        </h2>
        <FaqList entries={FAQ} />
      </section>

      <p className="mt-12 max-w-[42rem] text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {t('presets.disclaimer')}
      </p>
    </ContentPage>
  );
}

/** Takes widget URLs already in OBS and gives them back with the picked preset. */
function ExistingUrls({ preset, name }: { preset: string; name: string }) {
  const { t } = useI18n();
  const id = useId();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const lines = text.split('\n').filter((line) => line.trim());
  const results: RethemedUrl[] = lines.map((line) => applyPresetToUrl(line, preset));

  const copy = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(index);
      window.setTimeout(() => setCopied((current) => (current === index ? null : current)), 2000);
    } catch {
      // Clipboard blocked: the URL is still there to select by hand.
    }
  };

  return (
    <section aria-labelledby={`${id}-title`} className={`${CARD_CLASS} mt-12 p-6`}>
      <h2
        id={`${id}-title`}
        className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
      >
        {t('presets.existingTitle')}
      </h2>
      <p className="mt-2 max-w-[42rem] text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {t('presets.existingText', { name })}
      </p>
      <label
        htmlFor={`${id}-urls`}
        className="mt-4 mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
      >
        {t('presets.existingLabel')}
      </label>
      <textarea
        id={`${id}-urls`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        spellCheck={false}
        placeholder="https://extensions.senchabot.com/widgets/chat-widget?twitch=…"
        className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-zinc-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      />
      {results.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {t('presets.existingResult', { name })}
          </p>
          <ul className="space-y-2">
            {results.map((result, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: one row per pasted line, in order.
              <li key={index} className="flex items-center gap-2">
                {result.status === 'ok' ? (
                  <>
                    <input
                      readOnly
                      value={result.url}
                      aria-label={t('presets.existingResult', { name })}
                      onFocus={(event) => event.currentTarget.select()}
                      className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 font-mono text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={() => copy(result.url, index)}
                      className={BUTTON_TEST}
                    >
                      {copied === index ? t('common.copied') : t('common.copy')}
                    </button>
                  </>
                ) : (
                  <p className="min-w-0 flex-1 truncate text-xs text-amber-700 dark:text-amber-400">
                    {result.status === 'unsupported'
                      ? t('presets.existingUnsupported')
                      : t('presets.existingInvalid')}
                    : <span className="font-mono">{result.url}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
