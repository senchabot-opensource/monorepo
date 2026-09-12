import { createFileRoute } from '@tanstack/react-router';
import { Bullets, DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('twitch-kick-chat-overlay');

export const Route = createFileRoute('/{-$locale}/guides/twitch-kick-chat-overlay')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: TwitchKickChatGuide,
});

function TwitchKickChatGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'merge-chats',
          title: 'guides.chat.setup.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.chat.setup.step1',
                  'guides.chat.setup.step2',
                  'guides.chat.setup.step3',
                  'guides.chat.setup.step4',
                  'guides.chat.setup.step5',
                ]}
              />
              <P k="guides.chat.setup.p1" />
              <P k="guides.chat.setup.p2" />
            </>
          ),
        },
        {
          id: 'restream',
          title: 'guides.chat.restream.title',
          content: (
            <>
              <P k="guides.chat.restream.p1" />
              <P k="guides.chat.restream.p2" />
            </>
          ),
        },
        {
          id: 'platform-indicator',
          title: 'guides.chat.platform.title',
          content: (
            <>
              <P k="guides.chat.platform.intro" />
              <Bullets
                items={[
                  'guides.chat.platform.icon',
                  'guides.chat.platform.name',
                  'guides.chat.platform.none',
                ]}
              />
              <P k="guides.chat.platform.stripe" />
            </>
          ),
        },
        {
          id: 'look',
          title: 'guides.chat.look.title',
          content: (
            <>
              <h3>{t('guides.chat.look.layoutTitle')}</h3>
              <Bullets
                items={[
                  'guides.chat.look.inline',
                  'guides.chat.look.stacked',
                  'guides.chat.look.card',
                  'guides.chat.look.compact',
                ]}
              />
              <h3>{t('guides.chat.look.animationTitle')}</h3>
              <P k="guides.chat.look.animations" />
              <h3>{t('guides.chat.look.fontTitle')}</h3>
              <P k="guides.chat.look.fonts" />
            </>
          ),
        },
        {
          id: 'message-duration',
          title: 'guides.chat.duration.title',
          content: (
            <>
              <P k="guides.chat.duration.p1" />
              <P k="guides.chat.duration.p2" />
            </>
          ),
        },
        {
          id: 'emotes',
          title: 'guides.chat.emotes.title',
          content: (
            <>
              <P k="guides.chat.emotes.intro" />
              <DataTable
                caption={t('guides.chat.emotes.caption')}
                columns={[
                  { label: t('guides.chat.emotes.colProvider'), nowrap: true },
                  { label: t('guides.chat.emotes.colPlatforms') },
                ]}
                rows={[
                  ['7TV', t('guides.chat.emotes.both')],
                  ['BTTV (BetterTTV)', t('guides.chat.emotes.twitchOnly')],
                  ['FFZ (FrankerFaceZ)', t('guides.chat.emotes.twitchOnly')],
                ]}
              />
              <P k="guides.chat.emotes.p1" />
            </>
          ),
        },
        {
          id: 'hide-bots-commands',
          title: 'guides.chat.filters.title',
          content: (
            <>
              <P k="guides.chat.filters.bots" />
              <P k="guides.chat.filters.commands" />
              <P k="guides.chat.filters.highlights" />
            </>
          ),
        },
        {
          id: 'horizontal',
          title: 'guides.chat.horizontal.title',
          content: (
            <>
              <P k="guides.chat.horizontal.p1" />
              <P k="guides.chat.horizontal.p2" />
            </>
          ),
        },
        {
          id: 'other-widgets',
          title: 'guides.chat.others.title',
          content: (
            <>
              <P k="guides.chat.others.p1" />
              <P k="guides.chat.others.p2" />
            </>
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.chat.ctaTitle')}
          text={t('guides.chat.ctaText')}
          actions={[
            { label: t('guides.openSetup'), to: '/setup/chat-widget' },
            { label: t('guides.chat.ctaSecondary'), to: '/setup/emote-wall' },
          ]}
        />
      }
    />
  );
}
