import { createFileRoute } from '@tanstack/react-router';
import { Bullets, DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('chat-poll');

export const Route = createFileRoute('/{-$locale}/guides/chat-poll')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: ChatPollGuide,
});

function ChatPollGuide() {
  const t = useT();
  const question = t('guides.poll.commands.question');
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'set-up',
          title: 'guides.poll.setup.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.poll.setup.step1',
                  'guides.poll.setup.step2',
                  'guides.poll.setup.step3',
                  'guides.poll.setup.step4',
                  'guides.poll.setup.step5',
                ]}
              />
              <P k="guides.poll.setup.p1" />
            </>
          ),
        },
        {
          id: 'commands',
          title: 'guides.poll.commands.title',
          content: (
            <>
              <P k="guides.poll.commands.intro" />
              <DataTable
                caption={t('guides.poll.commands.caption')}
                columns={[
                  { label: t('guides.poll.commands.colCommand'), code: true, nowrap: true },
                  { label: t('guides.poll.commands.colAction') },
                ]}
                rows={[
                  [`!poll ${question} | A | B | C`, t('guides.poll.commands.new')],
                  [`!poll 90s ${question} | A | B`, t('guides.poll.commands.newTime')],
                  [`!poll ${question}?`, t('guides.poll.commands.yesNo')],
                  ['!poll start', t('guides.poll.commands.start')],
                  ['!poll extend 30s', t('guides.poll.commands.extend')],
                  ['!poll end', t('guides.poll.commands.end')],
                  ['!poll cancel', t('guides.poll.commands.cancel')],
                ]}
              />
              <P k="guides.poll.commands.p1" />
              <P k="guides.poll.commands.p2" />
            </>
          ),
        },
        {
          id: 'voting',
          title: 'guides.poll.voting.title',
          content: (
            <>
              <Bullets
                items={[
                  'guides.poll.voting.number',
                  'guides.poll.voting.command',
                  'guides.poll.voting.text',
                ]}
              />
              <P k="guides.poll.voting.p1" />
              <P k="guides.poll.voting.p2" />
            </>
          ),
        },
        {
          id: 'one-vote',
          title: 'guides.poll.rules.title',
          content: (
            <>
              <P k="guides.poll.rules.p1" />
              <P k="guides.poll.rules.p2" />
              <P k="guides.poll.rules.p3" />
            </>
          ),
        },
        {
          id: 'time-up',
          title: 'guides.poll.timing.title',
          content: (
            <>
              <P k="guides.poll.timing.p1" />
              <P k="guides.poll.timing.p2" />
              <P k="guides.poll.timing.p3" />
            </>
          ),
        },
        {
          id: 'look',
          title: 'guides.poll.look.title',
          content: (
            <>
              <Bullets
                items={[
                  'guides.poll.look.blind',
                  'guides.poll.look.color',
                  'guides.poll.look.position',
                  'guides.poll.look.language',
                ]}
              />
              <P k="guides.poll.look.p1" />
            </>
          ),
        },
        {
          id: 'obs-closed',
          title: 'guides.poll.saved.title',
          content: (
            <>
              <P k="guides.poll.saved.p1" />
              <P k="guides.poll.saved.p2" />
            </>
          ),
        },
        {
          id: 'limits',
          title: 'guides.poll.limits.title',
          content: (
            <Bullets
              items={[
                'guides.poll.limits.chat',
                'guides.poll.limits.native',
                'guides.poll.limits.points',
                'guides.poll.limits.multiple',
              ]}
            />
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.poll.ctaTitle')}
          text={t('guides.poll.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/chat-poll' }]}
        />
      }
    />
  );
}
