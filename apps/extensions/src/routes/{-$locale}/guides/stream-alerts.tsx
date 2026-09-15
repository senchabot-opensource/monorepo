import { createFileRoute } from '@tanstack/react-router';
import { Bullets, Callout, DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('stream-alerts');

export const Route = createFileRoute('/{-$locale}/guides/stream-alerts')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: StreamAlertsGuide,
});

function StreamAlertsGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'set-up',
          title: 'guides.alerts.setup.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.alerts.setup.step1',
                  'guides.alerts.setup.step2',
                  'guides.alerts.setup.step3',
                  'guides.alerts.setup.step4',
                  'guides.alerts.setup.step5',
                ]}
              />
              <P k="guides.alerts.setup.p1" />
              <P k="guides.alerts.setup.p2" />
            </>
          ),
        },
        {
          id: 'alerts',
          title: 'guides.alerts.kinds.title',
          content: (
            <>
              <DataTable
                caption={t('guides.alerts.kinds.caption')}
                columns={[
                  { label: t('guides.alerts.kinds.colAlert'), nowrap: true },
                  { label: 'Twitch' },
                  { label: 'Kick' },
                ]}
                rows={[
                  [
                    t('guides.alerts.kinds.sub'),
                    t('guides.alerts.kinds.subTwitch'),
                    t('guides.alerts.kinds.subKick'),
                  ],
                  [
                    t('guides.alerts.kinds.gift'),
                    t('guides.alerts.kinds.giftBoth'),
                    t('guides.alerts.kinds.giftBoth'),
                  ],
                  [
                    t('guides.alerts.kinds.bits'),
                    t('guides.alerts.kinds.bitsTwitch'),
                    t('guides.alerts.kinds.bitsKick'),
                  ],
                  [
                    t('guides.alerts.kinds.raid'),
                    t('guides.alerts.kinds.raidTwitch'),
                    t('guides.alerts.kinds.raidKick'),
                  ],
                ]}
              />
              <P k="guides.alerts.kinds.p1" />
              <P k="guides.alerts.kinds.p2" />
              <P k="guides.alerts.kinds.p3" />
            </>
          ),
        },
        {
          id: 'follows-donations',
          title: 'guides.alerts.follows.title',
          content: <P k="guides.alerts.follows.p1" />,
        },
        {
          id: 'look',
          title: 'guides.alerts.look.title',
          content: (
            <>
              <Bullets items={['guides.alerts.look.neon', 'guides.alerts.look.celestial']} />
              <P k="guides.alerts.look.p1" />
              <P k="guides.alerts.look.p2" />
            </>
          ),
        },
        {
          id: 'minimums',
          title: 'guides.alerts.min.title',
          content: (
            <>
              <DataTable
                caption={t('guides.alerts.min.caption')}
                columns={[
                  { label: t('guides.alerts.min.colSetting') },
                  { label: t('guides.alerts.min.colDefault'), nowrap: true },
                  { label: t('guides.alerts.min.colRange') },
                ]}
                rows={[
                  [t('guides.alerts.min.gift'), '1', t('guides.alerts.min.giftRange')],
                  [t('guides.alerts.min.bits'), '1', t('guides.alerts.min.bitsRange')],
                  [t('guides.alerts.min.raid'), '0', t('guides.alerts.min.raidRange')],
                ]}
              />
              <P k="guides.alerts.min.p1" />
            </>
          ),
        },
        {
          id: 'queue',
          title: 'guides.alerts.queue.title',
          content: (
            <>
              <P k="guides.alerts.queue.p1" />
              <P k="guides.alerts.queue.p2" />
            </>
          ),
        },
        {
          id: 'sound',
          title: 'guides.alerts.sound.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.alerts.sound.step1',
                  'guides.alerts.sound.step2',
                  'guides.alerts.sound.step3',
                ]}
              />
              <P k="guides.alerts.sound.p1" />
            </>
          ),
        },
        {
          id: 'test',
          title: 'guides.alerts.test.title',
          content: (
            <>
              <P k="guides.alerts.test.p1" />
              <Callout
                title={t('guides.alerts.test.warnTitle')}
                text={t('guides.alerts.test.warn')}
              />
              <P k="guides.alerts.test.p2" />
            </>
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.alerts.ctaTitle')}
          text={t('guides.alerts.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/stream-alerts' }]}
        />
      }
    />
  );
}
