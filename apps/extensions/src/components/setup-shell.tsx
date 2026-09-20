import { type CSSProperties, type ReactNode, useId } from 'react';
import { FaqList } from '#/components/faq-list';
import { SiteFooter } from '#/components/site-footer';
import { SiteHeader } from '#/components/site-header';
import { StepsList } from '#/components/steps-list';
import { InfoTip } from '#/components/ui/info-tip';
import { ScrollHint } from '#/components/ui/scroll-hint';
import { WidgetCrossLinks } from '#/components/widget-cross-links';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import type { WidgetId } from '#/lib/widgets';

export const PANEL_CLASS =
  'rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900';

/** One desktop screen under the 3rem header and the grid's 1rem bottom padding, but not below 576px. */
const SCREEN_MAX_H = 'lg:max-h-[max(576px,calc(100dvh-4rem))]';

export interface SetupShellProps {
  /** Registry id: picks the header icon and switcher entry and the "more widgets" row. */
  widgetId: WidgetId;
  /** Page H1, shown in the compact header. */
  title: string;
  /** Settings panel body, usually SettingsGroup blocks. Desktop: fits it up to one screen, then scrolls. */
  settings: ReactNode;
  /** Pinned above the scrolling settings, e.g. Raffle's "configuration locked" banner. */
  settingsTop?: ReactNode;
  /** Heading of the right panel. */
  previewTitle: string;
  /** "?" tip next to the preview heading. */
  previewTip?: string;
  /** Right panel body: a PreviewFrame, or live content (Raffle, OBS Bridge). */
  preview: ReactNode;
  /** Width / height of the preview box, which sizes the panel. Omit to fill a panel as tall as the settings. */
  previewAspect?: number;
  /** Row under the preview, e.g. a preview speed slider. */
  previewFooter?: ReactNode;
  /** URL block under the preview, usually a CopyUrlField. */
  urlField?: ReactNode;
  /** Below the fold: a short paragraph about the widget. */
  intro?: ReactNode;
  /** Heading above `guideSteps`; defaults to "How to set it up". */
  guideTitle?: string;
  /** Numbered setup steps (copy without a "1." prefix). */
  guideSteps?: readonly TranslationKey[];
  /** Pass the same array to getSetupPageHead in the route head, for the FAQPage markup. */
  faq?: readonly FaqEntry[];
  /** Extra below-the-fold content after the intro, e.g. a tutorial link. */
  aboutExtra?: ReactNode;
}

/**
 * Setup and tool page frame: compact header, then settings and preview side by side within
 * one desktop screen, the URL block under the preview, guide and FAQ below the fold, footer.
 */
export function SetupShell({
  widgetId,
  title,
  settings,
  settingsTop,
  previewTitle,
  previewTip,
  preview,
  previewAspect,
  previewFooter,
  urlField,
  intro,
  guideTitle,
  guideSteps,
  faq,
  aboutExtra,
}: SetupShellProps) {
  const { t } = useI18n();
  const id = useId();
  const hasAbout = Boolean(intro || aboutExtra || guideSteps?.length || faq?.length);

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <SiteHeader variant="compact" title={title} widgetId={widgetId} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Panels are as tall as their content, so short forms and wide previews don't leave
            empty space, but never taller than one screen. */}
        <div className="mx-auto grid max-w-6xl gap-5 px-4 pb-4 lg:grid-cols-[34rem_minmax(0,1fr)]">
          <div
            className={`${PANEL_CLASS} p-4 lg:flex lg:min-h-0 lg:flex-col lg:self-start ${SCREEN_MAX_H}`}
          >
            {settingsTop && <div className="mb-3 lg:shrink-0">{settingsTop}</div>}
            {/* Scrolling happens on the inner box, so on short screens content is clipped inside the
                panel padding instead of running under the bottom edge; its p-1 keeps focus rings unclipped. */}
            <ScrollHint
              className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
              scrollClassName="space-y-3 p-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            >
              {settings}
            </ScrollHint>
          </div>

          {/* A filling preview stretches to the settings panel, with a floor so an iframe (Chat Box,
              OBS Bridge) keeps room. */}
          <div
            className={`${PANEL_CLASS} flex flex-col gap-3 p-5 ${SCREEN_MAX_H} ${
              previewAspect ? 'lg:self-start' : 'h-[640px] lg:h-auto lg:min-h-[32rem]'
            }`}
          >
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {previewTitle}
              </h2>
              {previewTip && <InfoTip text={previewTip} />}
            </div>
            {previewAspect ? (
              // The box takes its height from the ratio. When that would push the panel past one
              // screen it shrinks, and the content is letterboxed inside via container query units.
              <div
                style={{ '--preview-aspect': previewAspect } as CSSProperties}
                className="relative aspect-(--preview-aspect) [container-type:size] lg:min-h-0"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative"
                    style={{
                      aspectRatio: previewAspect,
                      width: `min(100%, calc(100cqh * ${previewAspect}))`,
                    }}
                  >
                    <div className="absolute inset-0">{preview}</div>
                  </div>
                </div>
              </div>
            ) : (
              // In flow so live content (Raffle's participants) can grow the panel; min-h-0 lets it
              // shrink back at the one-screen cap, where the content scrolls inside.
              <div className="min-h-0 flex-1">{preview}</div>
            )}
            {previewFooter}
            {urlField && (
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">{urlField}</div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-6xl space-y-12 px-4 pt-8 pb-16">
          {hasAbout && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                {intro && (
                  <div className="max-w-prose text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {intro}
                  </div>
                )}
                {aboutExtra}
                {guideSteps && guideSteps.length > 0 && (
                  <section
                    aria-labelledby={`${id}-guide`}
                    className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
                  >
                    <h2
                      id={`${id}-guide`}
                      className="mb-4 text-base font-semibold text-zinc-900 dark:text-white"
                    >
                      {guideTitle ?? t('common.setupGuideTitle')}
                    </h2>
                    <StepsList steps={guideSteps} />
                  </section>
                )}
              </div>
              {faq && faq.length > 0 && (
                <section aria-labelledby={`${id}-faq`}>
                  <h2
                    id={`${id}-faq`}
                    className="mb-4 text-base font-semibold text-zinc-900 dark:text-white"
                  >
                    {t('common.faqTitle')}
                  </h2>
                  <FaqList entries={faq} />
                </section>
              )}
            </div>
          )}

          <section aria-labelledby={`${id}-more`}>
            <h2
              id={`${id}-more`}
              className="mb-4 text-base font-semibold text-zinc-900 dark:text-white"
            >
              {t('common.moreWidgets')}
            </h2>
            <WidgetCrossLinks exclude={widgetId} />
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
