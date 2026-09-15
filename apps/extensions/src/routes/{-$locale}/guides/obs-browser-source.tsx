import { createFileRoute } from '@tanstack/react-router';
import { useId } from 'react';
import { Bullets, DataTable, P, Steps } from '#/components/content-page';
import { GuideArticle } from '#/components/guide-article';
import { LocaleLink } from '#/components/locale-link';
import { WidgetCrossLinks } from '#/components/widget-cross-links';
import { getGuide } from '#/lib/guides';
import { type TranslationKey, useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';
import { WIDGETS, type WidgetId } from '#/lib/widgets';

const GUIDE = getGuide('obs-browser-source');

export const Route = createFileRoute('/{-$locale}/guides/obs-browser-source')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: ObsBrowserSourceGuide,
});

const SIZE_NOTES: Record<WidgetId, TranslationKey> = {
  'chat-box': 'guides.obs.size.notes.chatBox',
  'emote-wall': 'guides.obs.size.notes.emoteWall',
  'sub-sprout': 'guides.obs.size.notes.subSprout',
  raffle: 'guides.obs.size.notes.raffle',
  'obs-bridge': 'guides.obs.size.notes.obsBridge',
};

function ObsBrowserSourceGuide() {
  const t = useT();
  const id = useId();

  const troubleshooting = [
    ['guides.obs.troubleshoot.linkTitle', 'guides.obs.troubleshoot.linkBody'],
    ['guides.obs.troubleshoot.channelTitle', 'guides.obs.troubleshoot.channelBody'],
    ['guides.obs.troubleshoot.quietTitle', 'guides.obs.troubleshoot.quietBody'],
    ['guides.obs.troubleshoot.kickTitle', 'guides.obs.troubleshoot.kickBody'],
    ['guides.obs.troubleshoot.tabTitle', 'guides.obs.troubleshoot.tabBody'],
  ] as const satisfies readonly (readonly [TranslationKey, TranslationKey])[];

  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'add-browser-source',
          title: 'guides.obs.add.title',
          content: (
            <>
              <P k="guides.obs.add.intro" />
              <Steps
                steps={[
                  'guides.obs.add.step1',
                  'guides.obs.add.step2',
                  'guides.obs.add.step3',
                  'guides.obs.add.step4',
                  'guides.obs.add.step5',
                  'guides.obs.add.step6',
                ]}
              />
              <P k="guides.obs.add.note" />
            </>
          ),
        },
        {
          id: 'sizes',
          title: 'guides.obs.size.title',
          content: (
            <>
              <P k="guides.obs.size.intro" />
              <DataTable
                caption={t('guides.obs.size.caption')}
                columns={[
                  { label: t('guides.obs.size.colWidget'), nowrap: true },
                  { label: t('guides.obs.size.colSize'), nowrap: true },
                  { label: t('guides.obs.size.colNote') },
                ]}
                rows={WIDGETS.map((widget) => [
                  <LocaleLink
                    key="name"
                    to={widget.setupPath}
                    className="rounded-sm hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:text-green-400"
                  >
                    {t(widget.nameKey)}
                  </LocaleLink>,
                  widget.sourceSize
                    ? `${widget.sourceSize.width} × ${widget.sourceSize.height}`
                    : t('guides.obs.size.notSource'),
                  t(SIZE_NOTES[widget.id]),
                ])}
              />
              <P k="guides.obs.size.fontNote" />
            </>
          ),
        },
        {
          id: 'transparent-background',
          title: 'guides.obs.transparent.title',
          content: (
            <>
              <P k="guides.obs.transparent.p1" />
              <P k="guides.obs.transparent.p2" />
            </>
          ),
        },
        {
          id: 'source-settings',
          title: 'guides.obs.settings.title',
          content: (
            <>
              <P k="guides.obs.settings.intro" />
              <Bullets
                items={[
                  'guides.obs.settings.chatBox',
                  'guides.obs.settings.subSprout',
                  'guides.obs.settings.raffle',
                  'guides.obs.settings.emoteWall',
                ]}
              />
              <P k="guides.obs.settings.refresh" />
            </>
          ),
        },
        {
          id: 'update-widget',
          title: 'guides.obs.update.title',
          content: (
            <>
              <P k="guides.obs.update.p1" />
              <P k="guides.obs.update.p2" />
              <P k="guides.obs.update.p3" />
            </>
          ),
        },
        {
          id: 'troubleshooting',
          title: 'guides.obs.troubleshoot.title',
          content: (
            <>
              <P k="guides.obs.troubleshoot.intro" />
              {troubleshooting.map(([title, body]) => (
                <div key={title}>
                  <h3>{t(title)}</h3>
                  <P k={body} />
                </div>
              ))}
            </>
          ),
        },
      ]}
      cta={
        <section aria-labelledby={`${id}-cta`}>
          <h2
            id={`${id}-cta`}
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            {t('guides.obs.ctaTitle')}
          </h2>
          <p className="mt-2 mb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t('guides.obs.ctaText')}
          </p>
          <WidgetCrossLinks columns={3} />
        </section>
      }
    />
  );
}
