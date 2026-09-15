import type { ComponentType } from 'react';
import { skinFor } from '#/features/presets/skin';
import { SkinProvider } from '#/features/presets/skin-context';
import { type Locale, useI18n } from '#/lib/i18n';
import type { AlertSettings, AlertTheme } from '#/lib/stream-alerts-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useFitScale } from '../use-fit-scale';
import { alertHue, defaultHeadingKey } from './alert-style';
import { cleanMessage, isAnonymous, type StreamAlert } from './stream-alert';
import { CELESTIAL_FONT, CelestialAlert } from './themes/celestial';
import { NEON_FONT, NeonAlert } from './themes/neon';
import { PresetAlert } from './themes/preset';
import type { AlertViewProps } from './themes/types';
import { type ShownAlert, useStreamAlerts } from './use-stream-alerts';

/** Design size; the overlay scales to fill whatever browser source size it gets. */
const STAGE = { width: 800, height: 450 };
// Every theme draws in this box, centered on the stage; the room around it is for its effects.
const ALERT_BOX = { width: 800, height: 320 };

const THEMES: Record<AlertTheme, { View: ComponentType<AlertViewProps>; font: string }> = {
  neon: { View: NeonAlert, font: NEON_FONT },
  celestial: { View: CelestialAlert, font: CELESTIAL_FONT },
};

export const themeFont = (theme: AlertTheme) => THEMES[theme].font;

interface StreamAlertsWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: AlertSettings;
  simulate?: boolean;
  /** Preview only: the platform the setup page picked, so test alerts use its words. */
  simPlatform?: SubathonPlatform;
  /** Preview only: the id its setup page sends test alerts with. */
  previewId?: string;
}

export function StreamAlertsWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simPlatform,
  previewId,
}: StreamAlertsWidgetProps) {
  const scale = useFitScale(STAGE);
  const { t, locale } = useI18n();
  const shown = useStreamAlerts({
    twitch: twitchChannel,
    kick: kickChannel,
    settings,
    simulate,
    simPlatform,
    previewId,
  });
  // A platform tag only helps when alerts can come from either.
  const bothPlatforms = simulate ? !simPlatform : Boolean(twitchChannel && kickChannel);
  const skin = skinFor(settings.preset);
  const { View } = THEMES[settings.theme];

  return (
    <SkinProvider skin={skin}>
      <div
        data-testid="stream-alerts"
        data-preset={skin?.id}
        style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: STAGE.width,
            height: STAGE.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: (STAGE.height - ALERT_BOX.height) / 2,
              width: ALERT_BOX.width,
              height: ALERT_BOX.height,
            }}
          >
            {shown && (
              <div
                key={shown.id}
                data-testid="stream-alert"
                data-kind={shown.alert.kind}
                data-theme={skin ? 'preset' : settings.theme}
                style={{ position: 'absolute', inset: 0 }}
              >
                {skin ? (
                  <PresetAlert
                    skin={skin}
                    {...viewProps(shown, settings, { showPlatform: bothPlatforms, t, locale })}
                  />
                ) : (
                  <View
                    {...viewProps(shown, settings, { showPlatform: bothPlatforms, t, locale })}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

type Translate = ReturnType<typeof useI18n>['t'];

/** The alert's words, picked and translated, for the theme to draw. */
function viewProps(
  { id, alert }: ShownAlert,
  settings: AlertSettings,
  { showPlatform, t, locale }: { showPlatform: boolean; t: Translate; locale: Locale },
): AlertViewProps {
  const number = (n: number) => n.toLocaleString(locale);
  return {
    id,
    kind: alert.kind,
    hue: alertHue(settings.color, alert.platform),
    heading: settings.headings[alert.kind] || t(defaultHeadingKey(alert.kind, alert.platform)),
    name: isAnonymous(alert) ? t('streamAlerts.alert.anonymous') : alert.name,
    detail: detailFor(alert, t, number),
    message: settings.message ? cleanMessage(alert) : '',
    platformTag: showPlatform ? alert.platform.toUpperCase() : null,
    durationMs: settings.duration * 1000,
  };
}


function detailFor(alert: StreamAlert, t: Translate, number: (n: number) => string): string {
  switch (alert.kind) {
    case 'sub':
      // A first month reads as a new sub; Kick often leaves months out, which reads the same.
      return alert.months && alert.months > 1
        ? t('streamAlerts.alert.resubDetail', { months: number(alert.months) })
        : t('streamAlerts.alert.subDetail');
    case 'gift':
      return alert.count === 1
        ? t('streamAlerts.alert.giftDetailOne')
        : t('streamAlerts.alert.giftDetail', { count: number(alert.count) });
    case 'bits':
      return t(
        alert.platform === 'twitch'
          ? 'streamAlerts.alert.bitsDetail'
          : 'streamAlerts.alert.kicksDetail',
        { amount: number(alert.amount) },
      );
    case 'raid':
      // 0 also stands for a count Kick left out.
      if (alert.viewers === 0) return t('streamAlerts.alert.raidDetailNoCount');
      return alert.viewers === 1
        ? t('streamAlerts.alert.raidDetailOne')
        : t('streamAlerts.alert.raidDetail', { viewers: number(alert.viewers) });
  }
}
