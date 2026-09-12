import type { TranslationKey } from '#/lib/i18n';
import type { WidgetId } from '#/lib/widgets';

export interface ChangelogEntry {
  /** Commit date, YYYY-MM-DD. */
  date: string;
  /** One user-facing sentence under `changelog.entries`. */
  key: TranslationKey;
  /** Widgets the change touches; empty for site-wide changes. */
  widgets: readonly WidgetId[];
}

// Written from `git log -- apps/extensions`: user-facing feat/fix commits only, newest first.
// Alerts is unlisted, so its commits stay out.
export const CHANGELOG: readonly ChangelogEntry[] = [
  { date: '2026-09-12', key: 'changelog.entries.contentPages', widgets: [] },
  { date: '2026-09-12', key: 'changelog.entries.siteNav', widgets: [] },
  { date: '2026-09-12', key: 'changelog.entries.notFound', widgets: [] },
  { date: '2026-09-12', key: 'changelog.entries.geist', widgets: [] },
  { date: '2026-09-12', key: 'changelog.entries.chatNextSteps', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.raffleMonthsInput', widgets: ['raffle'] },
  { date: '2026-09-12', key: 'changelog.entries.raffleKeywordRequired', widgets: ['raffle'] },
  { date: '2026-09-12', key: 'changelog.entries.raffleMonthsSubsOnly', widgets: ['raffle'] },
  { date: '2026-09-12', key: 'changelog.entries.sproutPreviewSimulate', widgets: ['sub-sprout'] },
  { date: '2026-09-12', key: 'changelog.entries.sproutPreviewTint', widgets: ['sub-sprout'] },
  { date: '2026-09-12', key: 'changelog.entries.emoteWallUrl', widgets: ['emote-wall'] },
  { date: '2026-09-12', key: 'changelog.entries.bridgePassword', widgets: ['obs-bridge'] },
  { date: '2026-09-12', key: 'changelog.entries.chatFilters', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatEmoteProviders', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.sproutKickGifts', widgets: ['sub-sprout'] },
  { date: '2026-09-12', key: 'changelog.entries.bridgeUserPlatform', widgets: ['obs-bridge'] },
  {
    date: '2026-09-12',
    key: 'changelog.entries.sevenTvActiveSet',
    widgets: ['chat-box', 'emote-wall'],
  },
  { date: '2026-09-12', key: 'changelog.entries.chatColorCrash', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.bridgeReconnect', widgets: ['obs-bridge'] },
  { date: '2026-09-12', key: 'changelog.entries.raffleFakeEntries', widgets: ['raffle'] },
  { date: '2026-09-12', key: 'changelog.entries.chatIrcParsing', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatHighlights', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatPasteUrl', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatSingleScreen', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatIconAlign', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatHideIndicator', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatSmoothSpeed', widgets: ['chat-box'] },
  { date: '2026-09-12', key: 'changelog.entries.chatAdaptiveAnimations', widgets: ['chat-box'] },
  { date: '2026-09-11', key: 'changelog.entries.chatTypewriter', widgets: ['chat-box'] },
  { date: '2026-09-11', key: 'changelog.entries.chatPlatformStripe', widgets: ['chat-box'] },
  { date: '2026-09-04', key: 'changelog.entries.emoteWallModes', widgets: ['emote-wall'] },
  { date: '2026-09-04', key: 'changelog.entries.sproutPotLabel', widgets: ['sub-sprout'] },
  { date: '2026-09-03', key: 'changelog.entries.emoteWallLaunch', widgets: ['emote-wall'] },
  { date: '2026-09-02', key: 'changelog.entries.sproutBothPlatforms', widgets: ['sub-sprout'] },
  { date: '2026-09-02', key: 'changelog.entries.chatPreviewMock', widgets: ['chat-box'] },
  { date: '2026-09-02', key: 'changelog.entries.siteLanguages', widgets: [] },
  { date: '2026-08-31', key: 'changelog.entries.bridgeSceneCommand', widgets: ['obs-bridge'] },
  { date: '2026-08-31', key: 'changelog.entries.raffleBots', widgets: ['raffle'] },
  { date: '2026-08-24', key: 'changelog.entries.chatReadableColors', widgets: ['chat-box'] },
  { date: '2026-08-24', key: 'changelog.entries.chatBoldBadges', widgets: ['chat-box'] },
  { date: '2026-08-06', key: 'changelog.entries.sproutWatering', widgets: ['sub-sprout'] },
  { date: '2026-08-06', key: 'changelog.entries.chatItemBackground', widgets: ['chat-box'] },
  { date: '2026-06-19', key: 'changelog.entries.bridgeLaunch', widgets: ['obs-bridge'] },
  { date: '2026-06-19', key: 'changelog.entries.chatFade', widgets: ['chat-box'] },
  { date: '2026-06-15', key: 'changelog.entries.sproutVarieties', widgets: ['sub-sprout'] },
  { date: '2026-06-15', key: 'changelog.entries.chatFontsLayouts', widgets: ['chat-box'] },
  { date: '2026-06-07', key: 'changelog.entries.raffleHardening', widgets: ['raffle'] },
  { date: '2026-05-03', key: 'changelog.entries.siteTutorial', widgets: [] },
  { date: '2026-04-30', key: 'changelog.entries.chatPlatformPick', widgets: ['chat-box'] },
  { date: '2026-04-30', key: 'changelog.entries.chatSevenTv', widgets: ['chat-box'] },
  { date: '2026-04-30', key: 'changelog.entries.chatTimestamp', widgets: ['chat-box'] },
  { date: '2026-04-24', key: 'changelog.entries.siteSetupPages', widgets: [] },
  { date: '2026-04-24', key: 'changelog.entries.raffleLaunch', widgets: ['raffle'] },
  { date: '2026-04-24', key: 'changelog.entries.chatBgOpacity', widgets: ['chat-box'] },
  { date: '2026-04-24', key: 'changelog.entries.chatEmotesBadges', widgets: ['chat-box'] },
  { date: '2026-04-13', key: 'changelog.entries.chatOrientation', widgets: ['chat-box'] },
  { date: '2026-04-12', key: 'changelog.entries.sitePreview', widgets: [] },
  { date: '2026-04-11', key: 'changelog.entries.sproutKick', widgets: ['sub-sprout'] },
  { date: '2026-04-11', key: 'changelog.entries.launch', widgets: [] },
];

export interface ChangelogMonth {
  /** YYYY-MM */
  month: string;
  entries: ChangelogEntry[];
}

/** Consecutive entries grouped by month, keeping the list's newest-first order. */
export function groupByMonth(entries: readonly ChangelogEntry[]): ChangelogMonth[] {
  const months: ChangelogMonth[] = [];
  for (const entry of entries) {
    const month = entry.date.slice(0, 7);
    const current = months.at(-1);
    if (current?.month === month) current.entries.push(entry);
    else months.push({ month, entries: [entry] });
  }
  return months;
}
