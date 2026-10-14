import { Fragment } from 'react';
import { LocaleLink } from '#/components/locale-link';
import { PreviewFrame } from '#/components/preview-frame';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getWidget, type WidgetId } from '#/lib/widgets';
import { getDemoSrc } from './demo-url';
import { ArrowRightIcon } from './landing-icons';
import { FLUSH_FRAME_CLASS, SceneBackdrop, STAGE_STYLE } from './stream-scene';

/** Widgets that work well as a pair, and how. The first pair is the one the scene shows. */
const PAIRS: { ids: [WidgetId, WidgetId]; text: TranslationKey }[] = [
  { ids: ['irl-hud', 'weather'], text: 'home.comboHudWeather' },
  { ids: ['countdown', 'credits'], text: 'home.comboCountdownCredits' },
  { ids: ['countdown', 'tasks'], text: 'home.comboCountdownTasks' },
];

/** Both demos are whole 1080p scenes, laid one over the other like two sources in OBS. */
const SCENE = { width: 1920, height: 1080 };

/**
 * Widgets that go together: the IRL HUD and the Weather pill live in one scene, then a few more
 * pairs, and a link to every widget's browser source size in the OBS guide.
 */
export function BetterTogether({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  const layer = (id: WidgetId, showLoading: boolean) => {
    const widget = getWidget(id);
    return (
      <div className="absolute inset-0">
        <PreviewFrame
          src={getDemoSrc(widget, 'together')}
          title={t('home.demoTitle', { name: t(widget.nameKey) })}
          canvas={SCENE}
          // One spinner for the scene: the layers share a middle, and two would overlap.
          showLoading={showLoading}
          placeholder={<span />}
          backgroundClassName="bg-transparent"
          className={FLUSH_FRAME_CLASS}
        />
      </div>
    );
  };

  return (
    <div className={`p-6 ${className}`}>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
        {t('home.comboTitle')}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t('home.comboLead')}
      </p>
      <div
        className="relative mt-5 aspect-video overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
        style={STAGE_STYLE}
      >
        <SceneBackdrop />
        {layer('irl-hud', true)}
        {layer('weather', false)}
      </div>
      <ul className="mt-2 divide-y divide-zinc-200 dark:divide-zinc-800">
        {PAIRS.map(({ ids, text }) => (
          <li key={ids.join('+')} className="py-4">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
              {ids.map((id, index) => {
                const widget = getWidget(id);
                return (
                  <Fragment key={id}>
                    {index > 0 && (
                      <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-500">
                        +
                      </span>
                    )}
                    <LocaleLink
                      to={widget.setupPath}
                      className="inline-flex items-center gap-1.5 rounded text-zinc-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white"
                    >
                      <widget.Icon className="size-4 shrink-0 text-green-600 dark:text-green-400" />
                      {t(widget.nameKey)}
                    </LocaleLink>
                  </Fragment>
                );
              })}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t(text)}
            </p>
          </li>
        ))}
      </ul>
      <LocaleLink
        to="/guides/obs-browser-source"
        hash="sizes"
        className="mt-2 inline-flex items-center gap-1 rounded text-sm font-semibold text-green-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
      >
        {t('home.comboSizes')}
        <ArrowRightIcon className="size-4" />
      </LocaleLink>
    </div>
  );
}
