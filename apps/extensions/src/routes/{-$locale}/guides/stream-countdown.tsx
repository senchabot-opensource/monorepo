import { createFileRoute } from '@tanstack/react-router';
import { DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { COMMAND } from '#/features/widgets/countdown/countdown-clock';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('stream-countdown');

export const Route = createFileRoute('/{-$locale}/guides/stream-countdown')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: StreamCountdownGuide,
});

function StreamCountdownGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'set-up',
          title: 'guides.countdown.setup.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.countdown.setup.step1',
                  'guides.countdown.setup.step2',
                  'guides.countdown.setup.step3',
                  'guides.countdown.setup.step4',
                  'guides.countdown.setup.step5',
                ]}
              />
              <P k="guides.countdown.setup.p1" />
            </>
          ),
        },
        {
          id: 'scenes',
          title: 'guides.countdown.scenes.title',
          content: (
            <>
              <P k="guides.countdown.scenes.p1" />
              <P k="guides.countdown.scenes.p2" />
            </>
          ),
        },
        {
          id: 'start-over',
          title: 'guides.countdown.restart.title',
          content: (
            <>
              <P k="guides.countdown.restart.p1" />
              <P k="guides.countdown.restart.p2" />
              <P k="guides.countdown.restart.p3" />
            </>
          ),
        },
        {
          id: 'time-of-day',
          title: 'guides.countdown.clock.title',
          content: (
            <>
              <P k="guides.countdown.clock.p1" />
              <P k="guides.countdown.clock.p2" />
              <P k="guides.countdown.clock.p3" />
            </>
          ),
        },
        {
          id: 'chat-commands',
          title: 'guides.countdown.commands.title',
          content: (
            <>
              <P k="guides.countdown.commands.p1" />
              <DataTable
                caption={t('guides.countdown.commands.caption')}
                columns={[
                  { label: t('guides.countdown.commands.colCommand'), nowrap: true },
                  { label: t('guides.countdown.commands.colDoes') },
                ]}
                rows={[
                  [`${COMMAND} add 5m`, t('guides.countdown.commands.addDoes')],
                  [`${COMMAND} remove 2m`, t('guides.countdown.commands.removeDoes')],
                  [`${COMMAND} set 10m`, t('guides.countdown.commands.setDoes')],
                  [`${COMMAND} pause`, t('guides.countdown.commands.pauseDoes')],
                  [`${COMMAND} start`, t('guides.countdown.commands.startDoes')],
                  [`${COMMAND} reset`, t('guides.countdown.commands.resetDoes')],
                  [`${COMMAND} break 5m`, t('guides.countdown.commands.sceneDoes')],
                ]}
              />
              <P k="guides.countdown.commands.p2" />
            </>
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.countdown.ctaTitle')}
          text={t('guides.countdown.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/stream-countdown' }]}
        />
      }
    />
  );
}
