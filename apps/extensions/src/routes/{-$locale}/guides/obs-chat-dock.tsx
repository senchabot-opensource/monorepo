import { createFileRoute } from '@tanstack/react-router';
import { Bullets, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('obs-chat-dock');

export const Route = createFileRoute('/{-$locale}/guides/obs-chat-dock')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: ObsChatDockGuide,
});

function ObsChatDockGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'open',
          title: 'guides.reader.open.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.reader.open.step1',
                  'guides.reader.open.step2',
                  'guides.reader.open.step3',
                ]}
              />
              <P k="guides.reader.open.p1" />
            </>
          ),
        },
        {
          id: 'obs-dock',
          title: 'guides.reader.dock.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.reader.dock.step1',
                  'guides.reader.dock.step2',
                  'guides.reader.dock.step3',
                  'guides.reader.dock.step4',
                ]}
              />
              <P k="guides.reader.dock.p1" />
            </>
          ),
        },
        {
          id: 'what-it-shows',
          title: 'guides.reader.shows.title',
          content: (
            <>
              <P k="guides.reader.shows.p1" />
              <P k="guides.reader.shows.p2" />
              <P k="guides.reader.shows.p3" />
              <P k="guides.reader.shows.p4" />
            </>
          ),
        },
        {
          id: 'connection-drops',
          title: 'guides.reader.drops.title',
          content: (
            <>
              <P k="guides.reader.drops.p1" />
              <P k="guides.reader.drops.p2" />
              <P k="guides.reader.drops.p3" />
            </>
          ),
        },
        {
          id: 'history',
          title: 'guides.reader.history.title',
          content: (
            <>
              <P k="guides.reader.history.p1" />
              <P k="guides.reader.history.p2" />
            </>
          ),
        },
        {
          id: 'limits',
          title: 'guides.reader.limits.title',
          content: (
            <Bullets
              items={[
                'guides.reader.limits.send',
                'guides.reader.limits.events',
                'guides.reader.limits.missed',
              ]}
            />
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.reader.ctaTitle')}
          text={t('guides.reader.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/chat-widget' }]}
        />
      }
    />
  );
}
