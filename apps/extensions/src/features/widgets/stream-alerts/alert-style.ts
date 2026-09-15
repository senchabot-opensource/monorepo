import type { TranslationKey } from '#/lib/i18n';
import type { AlertColor, AlertKind } from '#/lib/stream-alerts-url';
import type { SubathonPlatform } from '../subathon/subathon-events';

const HUES: Record<Exclude<AlertColor, 'platform'>, number> = {
  blue: 212,
  purple: 268,
  pink: 322,
  red: 352,
  gold: 42,
  green: 142,
};
// Twitch purple and Kick green.
const PLATFORM_HUES: Record<SubathonPlatform, number> = { twitch: 264, kick: 103 };

export const alertHue = (color: AlertColor, platform: SubathonPlatform) =>
  color === 'platform' ? PLATFORM_HUES[platform] : HUES[color];

/** Bits and Kicks have their own words; the rest are the same on both platforms. */
export function defaultHeadingKey(kind: AlertKind, platform: SubathonPlatform): TranslationKey {
  switch (kind) {
    case 'sub':
      return 'streamAlerts.alert.subHeading';
    case 'gift':
      return 'streamAlerts.alert.giftHeading';
    case 'bits':
      return platform === 'twitch'
        ? 'streamAlerts.alert.bitsHeading'
        : 'streamAlerts.alert.kicksHeading';
    case 'raid':
      return 'streamAlerts.alert.raidHeading';
  }
}
