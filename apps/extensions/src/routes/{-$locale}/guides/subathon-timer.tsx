import { createFileRoute } from '@tanstack/react-router';
import { Bullets, DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('subathon-timer');

export const Route = createFileRoute('/{-$locale}/guides/subathon-timer')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: SubathonTimerGuide,
});

function SubathonTimerGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'set-up',
          title: 'guides.subathon.setup.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.subathon.setup.step1',
                  'guides.subathon.setup.step2',
                  'guides.subathon.setup.step3',
                  'guides.subathon.setup.step4',
                  'guides.subathon.setup.step5',
                ]}
              />
              <P k="guides.subathon.setup.p1" />
            </>
          ),
        },
        {
          id: 'time-values',
          title: 'guides.subathon.values.title',
          content: (
            <>
              <P k="guides.subathon.values.intro" />
              <DataTable
                caption={t('guides.subathon.values.caption')}
                columns={[
                  { label: t('guides.subathon.values.colEvent') },
                  { label: t('guides.subathon.values.colDefault'), nowrap: true },
                  { label: t('guides.subathon.values.colHow') },
                ]}
                rows={[
                  [
                    t('guides.subathon.values.sub'),
                    t('guides.subathon.values.oneMinute'),
                    t('guides.subathon.values.subHow'),
                  ],
                  [
                    t('guides.subathon.values.gift'),
                    t('guides.subathon.values.oneMinute'),
                    t('guides.subathon.values.giftHow'),
                  ],
                  [
                    t('guides.subathon.values.bits'),
                    t('guides.subathon.values.oneMinute'),
                    t('guides.subathon.values.bitsHow'),
                  ],
                ]}
              />
              <P k="guides.subathon.values.tiers" />
              <P k="guides.subathon.values.cap" />
            </>
          ),
        },
        {
          id: 'start',
          title: 'guides.subathon.start.title',
          content: (
            <>
              <P k="guides.subathon.start.p1" />
              <P k="guides.subathon.start.p2" />
            </>
          ),
        },
        {
          id: 'commands',
          title: 'guides.subathon.commands.title',
          content: (
            <>
              <DataTable
                caption={t('guides.subathon.commands.caption')}
                columns={[
                  { label: t('guides.subathon.commands.colCommand'), code: true, nowrap: true },
                  { label: t('guides.subathon.commands.colAction') },
                ]}
                rows={[
                  ['!subathon start', t('guides.subathon.commands.start')],
                  ['!subathon pause', t('guides.subathon.commands.pause')],
                  ['!subathon add 10m', t('guides.subathon.commands.add')],
                  ['!subathon remove 10m', t('guides.subathon.commands.remove')],
                  ['!subathon set 2h', t('guides.subathon.commands.set')],
                  ['!subathon reset', t('guides.subathon.commands.reset')],
                ]}
              />
              <P k="guides.subathon.commands.p1" />
              <P k="guides.subathon.commands.p2" />
            </>
          ),
        },
        {
          id: 'styles',
          title: 'guides.subathon.look.title',
          content: (
            <>
              <Bullets
                items={[
                  'guides.subathon.look.bar',
                  'guides.subathon.look.clock',
                  'guides.subathon.look.ring',
                ]}
              />
              <P k="guides.subathon.look.p1" />
              <P k="guides.subathon.look.p2" />
            </>
          ),
        },
        {
          id: 'obs-closed',
          title: 'guides.subathon.saved.title',
          content: (
            <>
              <P k="guides.subathon.saved.p1" />
              <P k="guides.subathon.saved.p2" />
              <P k="guides.subathon.saved.p3" />
            </>
          ),
        },
        {
          id: 'zero',
          title: 'guides.subathon.zero.title',
          content: (
            <>
              <P k="guides.subathon.zero.p1" />
              <P k="guides.subathon.zero.p2" />
            </>
          ),
        },
        {
          id: 'change',
          title: 'guides.subathon.change.title',
          content: (
            <>
              <P k="guides.subathon.change.p1" />
              <P k="guides.subathon.change.p2" />
            </>
          ),
        },
        {
          id: 'not-counted',
          title: 'guides.subathon.notCounted.title',
          content: (
            <Bullets
              items={[
                'guides.subathon.notCounted.follows',
                'guides.subathon.notCounted.raids',
                'guides.subathon.notCounted.resubs',
                'guides.subathon.notCounted.bits',
                'guides.subathon.notCounted.sharedChat',
              ]}
            />
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.subathon.ctaTitle')}
          text={t('guides.subathon.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/subathon-timer' }]}
        />
      }
    />
  );
}
