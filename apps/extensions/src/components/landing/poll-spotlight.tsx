import { LocaleLink } from '#/components/locale-link';
import { PreviewFrame } from '#/components/preview-frame';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '#/components/ui/button-styles';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getWidget } from '#/lib/widgets';
import { getDemoSrc } from './demo-url';
import { ArrowRightIcon, CheckIcon } from './landing-icons';
import { FLUSH_FRAME_CLASS, SceneBackdrop, STAGE_STYLE } from './stream-scene';

const WIDGET = getWidget('poll');

const POINTS: TranslationKey[] = [
  'home.pollSpotlight.pointVote',
  'home.pollSpotlight.pointBoth',
  'home.pollSpotlight.pointLate',
  'home.pollSpotlight.pointMods',
];

const PLATFORM_COLORS = { twitch: '#9146FF', kick: '#53FC18' } as const;

/**
 * The newest tool on the landing: what Chat Poll does, the live demo on a stream stage, and the
 * three ways viewers vote, typed in a chat beside it.
 */
export function PollSpotlight() {
  const { t } = useI18n();
  const name = t(WIDGET.nameKey);
  // The demo's own sample poll, so the typed option matches one of its bars.
  const votes: {
    user: string;
    color: string;
    platform: keyof typeof PLATFORM_COLORS;
    text: string;
  }[] = [
    { user: 'moonlit', color: '#60a5fa', platform: 'twitch', text: '2' },
    { user: 'kappa_kid', color: '#f472b6', platform: 'kick', text: '!vote 1' },
    {
      user: 'pixelfox',
      color: '#facc15',
      platform: 'twitch',
      text: t('poll.overlay.sampleOption2').toLowerCase(),
    },
    { user: 'nightowl', color: '#a78bfa', platform: 'kick', text: '3' },
  ];

  return (
    <section
      aria-labelledby="poll-spotlight-title"
      className="relative isolate overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 70% at 100% 0%, rgba(139, 92, 246, 0.12), transparent 70%)',
        }}
      />
      <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
            <WIDGET.Icon className="size-3.5" />
            {t('home.pollSpotlight.eyebrow')}
          </p>
          <h2
            id="poll-spotlight-title"
            className="mt-4 text-2xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-3xl dark:text-white"
          >
            {t('home.pollSpotlight.title')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
            {t('home.pollSpotlight.lead')}
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex gap-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                {t(point)}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocaleLink to={WIDGET.setupPath} className={BUTTON_PRIMARY}>
              {t('home.pollSpotlight.setup')}
              <ArrowRightIcon className="size-4" />
            </LocaleLink>
            <LocaleLink to="/guides/chat-poll" className={BUTTON_SECONDARY}>
              {t('home.pollSpotlight.guide')}
            </LocaleLink>
          </div>
        </div>

        <figure className="min-w-0">
          <div className="rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40">
            {/* The source's own 640 × 560 shape, so the poll fills the stage at its real size. */}
            <div className="relative aspect-[8/7] overflow-hidden rounded-xl" style={STAGE_STYLE}>
              <SceneBackdrop />
              <div className="absolute inset-0">
                <PreviewFrame
                  src={getDemoSrc(WIDGET)}
                  title={t('home.demoTitle', { name })}
                  placeholder={<span />}
                  backgroundClassName="bg-transparent"
                  className={FLUSH_FRAME_CLASS}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute bottom-[4%] left-[4%] w-[68%] rounded-xl border border-white/10 bg-zinc-950/80 p-2.5 shadow-lg sm:w-[58%] sm:p-3"
              >
                <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase sm:mb-2 sm:text-[11px]">
                  {t('home.pollSpotlight.chat')}
                </p>
                <ul className="space-y-1 text-xs leading-snug sm:space-y-1.5 sm:text-[13px]">
                  {votes.map((vote) => (
                    <li key={vote.user} className="flex items-center gap-2 truncate">
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ background: PLATFORM_COLORS[vote.platform] }}
                      />
                      <span className="font-semibold" style={{ color: vote.color }}>
                        {vote.user}
                      </span>
                      <span className="truncate text-zinc-100">{vote.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <figcaption className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-green-500 motion-safe:animate-pulse"
            />
            {t('home.pollSpotlight.caption')}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
