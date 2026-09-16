import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { hueFor } from '#/features/widgets/overlay-style';
import {
  buildFramePreviewUrl,
  buildFrameUrl,
  DEFAULT_FRAME_SETTINGS,
  FRAME_COLORS,
  FRAME_PIECES,
  FRAME_SIZES,
  type FrameSettings,
  LABEL_MAX_LENGTH,
  parseFrameUrl,
} from '#/lib/frame-url';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/stream-frames')({
  head: ({ params }) =>
    getSetupPageHead('frames', getParamsLocale(params), {
      breadcrumb: 'frames.breadcrumb',
      faq: FAQ,
    }),
  component: FramesSetup,
});

const WIDGET = getWidget('frames');

const FAQ: FaqEntry[] = [
  ['frames.faq1Q', 'frames.faq1A'],
  ['frames.faq2Q', 'frames.faq2A'],
  ['frames.faq3Q', 'frames.faq3A'],
  ['frames.faq4Q', 'frames.faq4A'],
];

// A dim scene behind the transparent frame, so it reads like it does over a game.
const SCENE_CLASS =
  'bg-[radial-gradient(circle_at_30%_25%,#3b5a4a,#1d2a33_60%,#12171c)] dark:bg-[radial-gradient(circle_at_30%_25%,#2c4538,#18222a_60%,#0d1115)]';

function FramesSetup() {
  const { t } = useI18n();
  const [settings, setSettings] = useState(DEFAULT_FRAME_SETTINGS);
  const mounted = useHydrated();
  const id = useId();

  const update = <K extends keyof FrameSettings>(key: K, value: FrameSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  const size = FRAME_SIZES[settings.piece];
  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildFrameUrl(origin, settings) : '';
  const previewUrl = mounted ? buildFramePreviewUrl(origin, settings) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseFrameUrl(text);
    if (parsed) setSettings(parsed);
    return Boolean(parsed);
  };

  const settingsPanel = (
    <>
      <SettingsGroup title={t('frames.sectionPiece')}>
        <div>
          <FieldLabel id={`${id}-piece`} tip={t('frames.pieceTip')}>
            {t('frames.piece')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-piece`}
            value={settings.piece}
            onChange={(value) => update('piece', value)}
            options={FRAME_PIECES.map((piece) => ({
              value: piece,
              label: t(`frames.pieces.${piece}`),
            }))}
          />
          <p className={HINT_CLASS}>{t(`frames.pieceHints.${settings.piece}`)}</p>
        </div>
        <TextField
          label={t('frames.labelLabel')}
          tip={t(`frames.labelTips.${settings.piece}`)}
          value={settings.label}
          onChange={(value) => update('label', value)}
          placeholder={t('frames.labelPlaceholder')}
          maxLength={LABEL_MAX_LENGTH}
          spellCheck={false}
        />
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionAppearance')}>
        <PresetField value={settings.preset} onChange={(value) => update('preset', value)} />
        {isClassic(settings.preset) && (
          <div>
            <FieldLabel id={`${id}-color`}>{t('frames.color')}</FieldLabel>
            <ColorSwatches
              labelledBy={`${id}-color`}
              value={settings.color}
              onChange={(value) => update('color', value)}
              options={FRAME_COLORS.map((color) => ({
                value: color,
                label: t(`subathon.colors.${color}`),
                background: `hsl(${hueFor(color, 1)} 85% 52%)`,
              }))}
            />
          </div>
        )}
        <Switch
          label={t('frames.motion')}
          tip={t('frames.motionTip')}
          checked={settings.motion}
          onChange={(value) => update('motion', value)}
        />
      </SettingsGroup>
    </>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('frames.title')}
      settings={settingsPanel}
      previewTitle={t('frames.previewTitle')}
      previewTip={t('frames.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          // A new frame per piece, so the canvas size and the page inside change together.
          key={settings.piece}
          src={previewUrl}
          title={t('frames.previewIframeTitle')}
          canvas={size}
          backgroundClassName={SCENE_CLASS}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('frames.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('frames.browserSourceHintSize', { ...size })}`}
          sourceSize={size}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('frames.widgetUrlPlaceholder')}
          invalidMessage={t('frames.widgetUrlInvalid')}
        />
      }
      intro={t('frames.intro')}
      guideTitle={t('frames.guideTitle')}
      guideSteps={[
        'frames.guideStep1',
        'frames.guideStep2',
        'frames.guideStep3',
        'frames.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
