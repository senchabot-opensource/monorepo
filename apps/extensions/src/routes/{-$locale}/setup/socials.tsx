import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useState } from 'react';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { Select, type SelectOption } from '#/components/ui/select';
import { FieldLabel } from '#/components/ui/field-label';
import { SettingsGroup } from '#/components/ui/settings-group';
import { TextField } from '#/components/ui/text-field';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import {
  buildSocialsPreviewUrl,
  buildSocialsUrl,
  DEFAULT_SOCIALS_SETTINGS,
  parseSocialsUrl,
  type SocialsSettings,
} from '#/lib/socials-url';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/socials')({
  head: ({ params }) =>
    getSetupPageHead('socials', getParamsLocale(params), {
      breadcrumb: 'socials.breadcrumb',
      faq: FAQ,
    }),
  component: SocialsSetup,
});

const WIDGET = getWidget('socials');
const CANVAS = WIDGET.sourceSize ?? { width: 600, height: 120 };

const FAQ: FaqEntry[] = [['socials.faq1Q', 'socials.faq1A']];

const PLATFORM_KEYS = [
  'twitter',
  'youtube',
  'instagram',
  'tiktok',
  'twitch',
  'kick',
  'discord',
  'github',
  'reddit',
  'bluesky',
  'threads',
  'linkedin',
] as const;

function SocialsSetup() {
  const { t } = useI18n();
  const [settings, setSettings] = useState(DEFAULT_SOCIALS_SETTINGS);
  const mounted = useHydrated();

  const update = <K extends keyof SocialsSettings>(key: K, value: SocialsSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildSocialsUrl(origin, settings) : '';
  // Show demo handles only if all user inputs are empty
  const hasInput = PLATFORM_KEYS.some((k) => settings[k]);
  const previewUrl = mounted ? buildSocialsPreviewUrl(origin, settings, !hasInput) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseSocialsUrl(text);
    if (!parsed) return false;
    setSettings(parsed);
    return true;
  };

  const settingsPanel = (
    <>
      <SettingsGroup title={t('socials.sectionPlatforms')}>
        <p className="text-sm text-gray-500 mb-4">{t('socials.platformsTip')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLATFORM_KEYS.map((key) => (
            <TextField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={settings[key as keyof SocialsSettings]}
              onChange={(value) => update(key as keyof SocialsSettings, value)}
              placeholder={`username`}
              spellCheck={false}
            />
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('socials.sectionAppearance')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <FieldLabel id="animation-label">{t('socials.animation')}</FieldLabel>
            <Select
              labelledBy="animation-label"
              value={settings.animation}
            onChange={(value) => update('animation', value)}
            options={[
              { value: 'slideUp', label: t('socials.animSlideUp') },
              { value: 'slideLeft', label: t('socials.animSlideLeft') },
              { value: 'scale', label: t('socials.animScale') },
              { value: 'fade', label: t('socials.animFade') },
            ]}
            />
          </div>
          <TextField
            label={t('socials.rotationInterval')}
            value={settings.interval}
            onChange={(value) => update('interval', value)}
            placeholder="10"
          />
          <TextField
            label={t('socials.textColor')}
            value={settings.textColor}
            onChange={(value) => update('textColor', value)}
            placeholder="#ffffff"
          />
          <TextField
            label={t('socials.pillColor')}
            value={settings.pillColor}
            onChange={(value) => update('pillColor', value)}
            placeholder="rgba(0, 0, 0, 0.5)"
          />
        </div>
      </SettingsGroup>
    </>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('socials.title')}
      settings={settingsPanel}
      previewTitle={t('socials.previewTitle')}
      previewTip={t('socials.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('socials.previewIframeTitle')} canvas={CANVAS} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('socials.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('socials.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('socials.widgetUrlPlaceholder')}
          invalidMessage={t('socials.widgetUrlInvalid')}
        />
      }
      intro={t('socials.intro')}
      guideTitle={t('socials.guideTitle')}
      guideSteps={['socials.guideStep1', 'socials.guideStep2', 'socials.guideStep3']}
      faq={FAQ}
    />
  );
}
