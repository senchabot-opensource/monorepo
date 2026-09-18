import { createFileRoute } from '@tanstack/react-router';
import { DataTable, P, Steps } from '#/components/content-page';
import { CtaBand } from '#/components/cta-band';
import { GuideArticle } from '#/components/guide-article';
import { FRAME_SIZES, type FramePiece, PORTRAIT_CAMERA_SIZE } from '#/lib/frame-url';
import { getGuide } from '#/lib/guides';
import { useT } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getGuideHead } from '#/lib/seo/pages';

const GUIDE = getGuide('stream-frames');

export const Route = createFileRoute('/{-$locale}/guides/stream-frames')({
  head: ({ params }) => getGuideHead(GUIDE, getParamsLocale(params)),
  component: StreamFramesGuide,
});

const format = ({ width, height }: { width: number; height: number }) => `${width} × ${height}`;
const size = (piece: FramePiece) => format(FRAME_SIZES[piece]);

function StreamFramesGuide() {
  const t = useT();
  return (
    <GuideArticle
      guide={GUIDE}
      sections={[
        {
          id: 'set-up',
          title: 'guides.frames.setup.title',
          content: (
            <>
              <Steps
                steps={[
                  'guides.frames.setup.step1',
                  'guides.frames.setup.step2',
                  'guides.frames.setup.step3',
                  'guides.frames.setup.step4',
                  'guides.frames.setup.step5',
                ]}
              />
              <P k="guides.frames.setup.p1" />
            </>
          ),
        },
        {
          id: 'source-order',
          title: 'guides.frames.layers.title',
          content: (
            <>
              <P k="guides.frames.layers.p1" />
              <P k="guides.frames.layers.p2" />
              <P k="guides.frames.layers.p3" />
            </>
          ),
        },
        {
          id: 'fit-camera',
          title: 'guides.frames.fit.title',
          content: (
            <>
              <P k="guides.frames.fit.intro" />
              <DataTable
                caption={t('guides.frames.fit.caption')}
                columns={[
                  { label: t('guides.frames.fit.colPiece') },
                  { label: t('guides.frames.fit.colFrame'), nowrap: true },
                  { label: t('guides.frames.fit.colInside') },
                ]}
                rows={[
                  [
                    t('guides.frames.fit.camera'),
                    size('camera'),
                    t('guides.frames.fit.cameraInside'),
                  ],
                  [
                    t('guides.frames.fit.cameraPortrait'),
                    format(PORTRAIT_CAMERA_SIZE),
                    t('guides.frames.fit.cameraPortraitInside'),
                  ],
                  [t('guides.frames.fit.chat'), size('chat'), t('guides.frames.fit.chatInside')],
                  [
                    t('guides.frames.fit.screen'),
                    size('screen'),
                    t('guides.frames.fit.screenInside'),
                  ],
                ]}
              />
              <P k="guides.frames.fit.p1" />
              <P k="guides.frames.fit.p2" />
            </>
          ),
        },
        {
          id: 'presets-and-motion',
          title: 'guides.frames.look.title',
          content: (
            <>
              <P k="guides.frames.look.p1" />
              <P k="guides.frames.look.p2" />
              <P k="guides.frames.look.p3" />
            </>
          ),
        },
        {
          id: 'change',
          title: 'guides.frames.change.title',
          content: <P k="guides.frames.change.p1" />,
        },
      ]}
      cta={
        <CtaBand
          title={t('guides.frames.ctaTitle')}
          text={t('guides.frames.ctaText')}
          actions={[{ label: t('guides.openSetup'), to: '/setup/stream-frames' }]}
        />
      }
    />
  );
}
