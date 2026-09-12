import { Breadcrumb } from '#/components/breadcrumb';
import { YoutubeTutorial } from '#/components/youtube-tutorial';
import { useI18n } from '#/lib/i18n';
import { type FaqEntry, getFaqJsonLd, getLocaleLinks } from '#/lib/i18n/seo';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';

export const Route = createFileRoute('/setup/emote-wall')({
  head: () => ({
    meta: [
      {
        title:
          'Free Emote Wall Overlay for Twitch & Kick (No Login Required) — Floating On-Screen Emotes | Senchabot',
      },
      {
        name: 'description',
        content:
          'Show emote-only chat messages as floating on-screen emotes on stream. 100% Free & No Login Required. Supports Twitch, Kick and 7TV emotes with Calm, Chaos and Bounce animations for OBS Studio, Streamlabs Desktop, XSplit, vMix, or any software that supports browser sources.',
      },
      {
        name: 'keywords',
        content:
          'emote wall, emote overlay, floating emotes, on-screen emotes, twitch emote overlay, kick emote overlay, 7tv overlay, free obs emote overlay, browser source emotes',
      },
      {
        property: 'og:title',
        content:
          'Free Emote Wall Overlay for Twitch & Kick (No Login Required) — Floating On-Screen Emotes | Senchabot',
      },
      {
        property: 'og:description',
        content:
          '100% Free floating emote overlay: emote-only Twitch, Kick and 7TV chat messages appear as floating on-screen emotes with Calm, Chaos or Bounce animations.',
      },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:url',
        content: 'https://extensions.senchabot.com/setup/emote-wall',
      },
      {
        property: 'og:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
      { name: 'twitter:card', content: 'summary' },
      {
        name: 'twitter:title',
        content: 'Free Emote Wall Overlay for Twitch & Kick (No Login Required)',
      },
      {
        name: 'twitter:description',
        content:
          'Emote-only chat messages float across your stream with fade effects. Works with OBS Studio, Streamlabs Desktop, XSplit, or any browser source.',
      },
      {
        name: 'twitter:image',
        content: 'https://extensions.senchabot.com/senchabot-logo.svg',
      },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Emote Wall - Free Floating Emote Overlay',
          description:
            'A free floating emote overlay that shows emote-only Twitch, Kick and 7TV chat messages at random screen positions with fade and drift animations.',
          url: 'https://extensions.senchabot.com/setup/emote-wall',
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
      { 'script:ld+json': getFaqJsonLd(FAQ) },
    ],
    links: getLocaleLinks('/setup/emote-wall'),
  }),
  component: EmoteWallSetup,
});

const FAQ: FaqEntry[] = [
  ['emoteWallSetup.faq1Q', 'emoteWallSetup.faq1A'],
  ['emoteWallSetup.faq2Q', 'emoteWallSetup.faq2A'],
];

function EmoteWallSetup() {
  const { locale, t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [platforms, setPlatforms] = useState<'both' | 'twitch' | 'kick'>(
    'both',
  );
  const [sevenTv, setSevenTv] = useState(true);
  const [mode, setMode] = useState<'calm' | 'chaos' | 'bounce'>('calm');
  const [subsOnly, setSubsOnly] = useState(false);
  const [subDurationX2, setSubDurationX2] = useState(false);
  const [showAllEmotes, setShowAllEmotes] = useState(false);
  const [hypeMode, setHypeMode] = useState(false);
  const [spamBlock, setSpamBlock] = useState(true);
  const [emoteSize, setEmoteSize] = useState('112');
  const [duration, setDuration] = useState('5');
  const [maxEmotes, setMaxEmotes] = useState('25');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deferredTwitch = useDeferredValue(twitchChannel);
  const deferredKick = useDeferredValue(kickChannel);

  // Number inputs accept out-of-range typing, so clamp before writing params.
  const clampParam = (raw: string, min: number, max: number, fallback: number) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return String(fallback);
    return String(Math.min(max, Math.max(min, n)));
  };

  const buildParams = (
    twitch: string,
    kick: string,
    withMock: boolean,
  ) => {
    const params = new URLSearchParams();
    if (platforms === 'both' || platforms === 'twitch') {
      if (twitch.trim())
        params.append('twitch', twitch.trim().toLowerCase());
    }
    if (platforms === 'both' || platforms === 'kick') {
      if (kick.trim()) params.append('kick', kick.trim().toLowerCase());
    }
    if (!sevenTv) params.append('sevenTv', 'false');
    if (mode !== 'calm') params.append('mode', mode);
    if (subsOnly) params.append('subsOnly', 'true');
    if (subDurationX2) params.append('subDurationX2', 'true');
    if (showAllEmotes) params.append('showAllEmotes', 'true');
    if (hypeMode) params.append('hypeMode', 'true');
    if (!spamBlock) params.append('spamBlock', 'false');
    if (emoteSize !== '112') params.append('size', clampParam(emoteSize, 32, 256, 112));
    const safeDuration = clampParam(duration, 2, 30, 5);
    if (safeDuration !== '5') params.append('duration', safeDuration);
    const safeMax = clampParam(maxEmotes, 1, 120, 25);
    if (safeMax !== '25') params.append('max', safeMax);
    if (withMock) {
      params.append('mock', 'true');
      params.append('lang', locale);
    }
    return params;
  };

  const widgetUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = buildParams(twitchChannel, kickChannel, false);
    if (!twitchChannel.trim() && !kickChannel.trim()) return '';
    return `${window.location.origin}/widgets/emote-wall?${params.toString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitchChannel, kickChannel, platforms, sevenTv, mode, subsOnly, subDurationX2, showAllEmotes, hypeMode, spamBlock, emoteSize, duration, maxEmotes]);

  const previewUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = buildParams(deferredTwitch, deferredKick, true);
    return `${window.location.origin}/widgets/emote-wall?${params.toString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deferredTwitch,
    deferredKick,
    platforms,
    sevenTv,
    mode,
    subsOnly,
    subDurationX2,
    showAllEmotes,
    hypeMode,
    spamBlock,
    emoteSize,
    duration,
    maxEmotes,
    locale,
  ]);

  const handleCopy = async () => {
    if (widgetUrl) {
      await navigator.clipboard.writeText(widgetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid =
    (platforms !== 'kick' && twitchChannel.trim().length > 0) ||
    (platforms !== 'twitch' && kickChannel.trim().length > 0);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-6 pt-12 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mb-12">
          {/* Left: Configuration Panel */}
          <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-white p-6 md:p-8 shadow-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: t('common.home'), href: '/' },
                  { label: t('emoteWallSetup.breadcrumb') },
                ]}
              />
            </div>
            <div className="mb-6 flex justify-center">
              <Link
                to="/"
                className="relative inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-zinc-900 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white"
              >
                <div className="inline-flex size-10 shrink-0">
                  <img
                    src="/senchabot-logo.svg"
                    alt="Senchabot"
                    width={40}
                    height={40}
                  />
                </div>
              </Link>
            </div>

            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-700 border border-green-500/20 dark:text-green-400">
                {t('common.freeBadge')}
              </span>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-center text-zinc-900 dark:text-white">
              {t('emoteWallSetup.title')}
            </h1>

            <div className="space-y-4">
              <p className="text-xs text-zinc-600 bg-zinc-100 p-3 rounded-md border border-zinc-200 leading-relaxed dark:text-zinc-400 dark:bg-zinc-800/40 dark:border-zinc-800">
                {t('emoteWallSetup.intro')}
              </p>

              <YoutubeTutorial />

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t('emoteWallSetup.platforms')}
                </label>
                <select
                  value={platforms}
                  onChange={(e) =>
                    setPlatforms(e.target.value as 'both' | 'twitch' | 'kick')
                  }
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="both">{t('emoteWallSetup.both')}</option>
                  <option value="twitch">{t('emoteWallSetup.twitch')}</option>
                  <option value="kick">{t('emoteWallSetup.kick')}</option>
                </select>
              </div>

              {(platforms === 'both' || platforms === 'twitch') && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t('emoteWallSetup.twitchChannel')}
                  </label>
                  <input
                    type="text"
                    value={twitchChannel}
                    onChange={(e) => setTwitchChannel(e.target.value)}
                    placeholder={t('common.channelPlaceholder')}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              )}

              {(platforms === 'both' || platforms === 'kick') && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t('emoteWallSetup.kickChannel')}
                  </label>
                  <input
                    type="text"
                    value={kickChannel}
                    onChange={(e) => setKickChannel(e.target.value)}
                    placeholder={t('common.channelPlaceholder')}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={sevenTv}
                    onChange={(e) => setSevenTv(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t('emoteWallSetup.sevenTvEmotes')}</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={subsOnly}
                    onChange={(e) => setSubsOnly(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t('emoteWallSetup.subsOnly')}</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  {t('emoteWallSetup.subsOnlyHint')}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={subDurationX2}
                    onChange={(e) => setSubDurationX2(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t('emoteWallSetup.subDurationX2')}</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  {t('emoteWallSetup.subDurationX2Hint')}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={showAllEmotes}
                    onChange={(e) => setShowAllEmotes(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t('emoteWallSetup.showAllEmotes')}</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  {t('emoteWallSetup.showAllEmotesHint')}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={hypeMode}
                    onChange={(e) => setHypeMode(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t('emoteWallSetup.hypeMode')}</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  {t('emoteWallSetup.hypeModeHint')}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={spamBlock}
                    onChange={(e) => setSpamBlock(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t('emoteWallSetup.spamBlock')}</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  {t('emoteWallSetup.spamBlockHint')}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t('emoteWallSetup.mode')}
                </label>
                <select
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as 'calm' | 'chaos' | 'bounce')
                  }
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="calm">{t('emoteWallSetup.modeCalm')}</option>
                  <option value="chaos">{t('emoteWallSetup.modeChaos')}</option>
                  <option value="bounce">{t('emoteWallSetup.modeBounce')}</option>
                </select>
                <p className="mt-1 text-xs text-zinc-500">
                  {mode === 'chaos'
                    ? t('emoteWallSetup.modeChaosHint')
                    : mode === 'bounce'
                      ? t('emoteWallSetup.modeBounceHint')
                      : t('emoteWallSetup.modeCalmHint')}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t('emoteWallSetup.emoteSize')}
                </label>
                <input
                  type="range"
                  min="32"
                  max="256"
                  step="8"
                  value={emoteSize}
                  onChange={(e) => setEmoteSize(e.target.value)}
                  className="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-green-500 dark:bg-zinc-700"
                />
                <div className="text-right text-xs text-zinc-500 mt-1">
                  {emoteSize}px
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t('emoteWallSetup.duration')}
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t('emoteWallSetup.maxEmotes')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={maxEmotes}
                    onChange={(e) => setMaxEmotes(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-200 lg:hidden dark:border-zinc-800">
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t('common.widgetUrl')}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={widgetUrl}
                    className="w-full rounded-l-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={!isFormValid}
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {copied ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview Panel & Guides/FAQ */}
          <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="rounded-xl bg-white p-6 md:p-8 shadow-xl border border-zinc-200 flex flex-col h-[700px] dark:bg-zinc-900 dark:border-zinc-800">
              <h2 className="mb-4 text-xl font-semibold text-center text-zinc-700 dark:text-zinc-300">
                {t('emoteWallSetup.previewTitle')}
              </h2>
              <div className="flex-1 w-full bg-zinc-950/80 rounded-lg overflow-hidden border border-zinc-300 relative shadow-inner flex items-center justify-center dark:border-zinc-800">
                {mounted ? (
                  <iframe
                    src={previewUrl}
                    className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                    title={t('emoteWallSetup.previewIframeTitle')}
                  />
                ) : (
                  <div className="text-center text-zinc-500">
                    <p>{t('common.previewNoChannel')}</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-zinc-500">
                {t('emoteWallSetup.previewHint')}
              </p>

              <div className="mt-4 hidden lg:block">
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t('common.widgetUrl')}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={widgetUrl}
                    className="w-full rounded-l-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={!isFormValid}
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {copied ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  {t('common.browserSourceHint')}
                  {t('emoteWallSetup.browserSourceHintSize')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-zinc-900 mb-2 dark:text-white">
                  {t('emoteWallSetup.guideTitle')}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {t('emoteWallSetup.guideStep1')}
                  <br />
                  {t('emoteWallSetup.guideStep2')}
                  <br />
                  {t('emoteWallSetup.guideStep3')}
                </p>
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
