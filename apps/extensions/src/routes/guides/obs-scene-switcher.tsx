import { createFileRoute } from '@tanstack/react-router';
import { DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { DEFAULT_OBS_COMMANDS } from '#/features/tools/obs-bridge-config';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('obs-scene-switcher');

export const Route = createFileRoute('/guides/obs-scene-switcher')({
  head: () => getGuideHead(GUIDE),
  component: ObsSceneSwitcherGuide,
});

const CMD = DEFAULT_OBS_COMMANDS;

function ObsSceneSwitcherGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'enable-websocket',
          title: 'guides.bridge.websocket.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.bridge.websocket.step1',
                  'guides.bridge.websocket.step2',
                  'guides.bridge.websocket.step3',
                  'guides.bridge.websocket.step4',
                ]}
              />
              <P k="guides.bridge.websocket.p1" />
            </>
          ),
        },
        {
          id: 'set-up',
          title: 'guides.bridge.setup.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.bridge.setup.step1',
                  'guides.bridge.setup.step2',
                  'guides.bridge.setup.step3',
                  'guides.bridge.setup.step4',
                  'guides.bridge.setup.step5',
                  'guides.bridge.setup.step6',
                ]}
              />
              <P k="guides.bridge.setup.p1" />
            </>
          ),
        },
        {
          id: 'commands',
          title: 'guides.bridge.commands.title',
          content: (
            <>
              <DataTable
                caption={t('guides.bridge.commands.caption')}
                columns={[
                  { label: t('guides.bridge.commands.colCommand'), code: true, nowrap: true },
                  { label: t('guides.bridge.commands.colAction') },
                ]}
                rows={[
                  [
                    `${CMD.cmdScene} ${t('guides.bridge.commands.sceneArg')}`,
                    t('guides.bridge.commands.scene'),
                  ],
                  [CMD.cmdBrb, t('guides.bridge.commands.brb')],
                  [CMD.cmdBack, t('guides.bridge.commands.back')],
                  [
                    `${CMD.cmdStartStream} / ${CMD.cmdStopStream}`,
                    t('guides.bridge.commands.stream'),
                  ],
                  [
                    `${CMD.cmdStartRecord} / ${CMD.cmdStopRecord}`,
                    t('guides.bridge.commands.record'),
                  ],
                ]}
              />
              <P k="guides.bridge.commands.p1" />
              <P k="guides.bridge.commands.p2" />
            </>
          ),
        },
        {
          id: 'scene-matching',
          title: 'guides.bridge.matching.title',
          content: (
            <>
              <P k="guides.bridge.matching.p1" />
              <P k="guides.bridge.matching.p2" />
            </>
          ),
        },
        {
          id: 'authorized-users',
          title: 'guides.bridge.users.title',
          content: (
            <>
              <P k="guides.bridge.users.p1" />
              <P k="guides.bridge.users.p2" />
              <P k="guides.bridge.users.p3" />
            </>
          ),
        },
        {
          id: 'keep-open',
          title: 'guides.bridge.open.title',
          content: <P k="guides.bridge.open.p1" />,
        },
        {
          id: 'password',
          title: 'guides.bridge.security.title',
          content: (
            <>
              <P k="guides.bridge.security.p1" />
              <P k="guides.bridge.security.p2" />
            </>
          ),
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.bridge.ctaTitle')}
          text={t('guides.bridge.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/obs-bridge' }]}
        />
      }
    />
  );
}
