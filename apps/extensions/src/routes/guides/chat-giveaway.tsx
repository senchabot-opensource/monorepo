import { createFileRoute } from '@tanstack/react-router';
import { Callout, DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('chat-giveaway');

export const Route = createFileRoute('/guides/chat-giveaway')({
  head: () => getGuideHead(GUIDE),
  component: ChatGiveawayGuide,
});

function ChatGiveawayGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'start-raffle',
          title: 'guides.raffle.start.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.raffle.start.step1',
                  'guides.raffle.start.step2',
                  'guides.raffle.start.step3',
                  'guides.raffle.start.step4',
                  'guides.raffle.start.step5',
                ]}
              />
              <P k="guides.raffle.start.p1" />
            </>
          ),
        },
        {
          id: 'entries',
          title: 'guides.raffle.entry.title',
          content: (
            <>
              <P k="guides.raffle.entry.p1" />
              <P k="guides.raffle.entry.p2" />
              <P k="guides.raffle.entry.p3" />
            </>
          ),
        },
        {
          id: 'rules',
          title: 'guides.raffle.rules.title',
          content: (
            <>
              <DataTable
                caption={t('guides.raffle.rules.caption')}
                columns={[
                  { label: t('guides.raffle.rules.colRule') },
                  { label: t('guides.raffle.rules.colOptions') },
                  { label: t('guides.raffle.rules.colDefault'), nowrap: true },
                ]}
                rows={[
                  [
                    t('guides.raffle.rules.subsOnly'),
                    t('guides.raffle.rules.subsOnlyOptions'),
                    t('guides.raffle.rules.subsOnlyDefault'),
                  ],
                  [
                    t('guides.raffle.rules.minMonths'),
                    t('guides.raffle.rules.minMonthsOptions'),
                    t('guides.raffle.rules.minMonthsDefault'),
                  ],
                  [
                    t('guides.raffle.rules.maxWins'),
                    t('guides.raffle.rules.maxWinsOptions'),
                    t('guides.raffle.rules.maxWinsDefault'),
                  ],
                  [
                    t('guides.raffle.rules.minDuration'),
                    t('guides.raffle.rules.minDurationOptions'),
                    t('guides.raffle.rules.minDurationDefault'),
                  ],
                ]}
              />
              <P k="guides.raffle.rules.subsText" />
              <P k="guides.raffle.rules.winsText" />
              <P k="guides.raffle.rules.durationText" />
              <P k="guides.raffle.rules.fairText" />
            </>
          ),
        },
        {
          id: 'saved-state',
          title: 'guides.raffle.storage.title',
          content: (
            <>
              <P k="guides.raffle.storage.p1" />
              <P k="guides.raffle.storage.p2" />
            </>
          ),
        },
        {
          id: 'winner-overlay',
          title: 'guides.raffle.overlay.title',
          content: (
            <>
              <P k="guides.raffle.overlay.p1" />
              <Callout
                title={t('guides.raffle.overlay.warnTitle')}
                text={t('guides.raffle.overlay.warn')}
              />
              <P k="guides.raffle.overlay.p2" />
            </>
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.raffle.ctaTitle')}
          text={t('guides.raffle.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/raffle' }]}
        />
      }
    />
  );
}
