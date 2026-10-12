import type { SitePath } from '#/lib/i18n/paths';

const REPO = 'https://github.com/senchabot-opensource/monorepo';

export const LINKS = {
  source: `${REPO}/tree/dev/apps/extensions`,
  license: `${REPO}/blob/dev/LICENSE`,
  newIssue: `${REPO}/issues/new`,
  presetGuide: `${REPO}/tree/dev/apps/extensions/src/features/presets/community`,
  discussions: `${REPO}/discussions`,
  senchabot: 'https://senchabot.com',
  dashboardWheel: 'https://senchabot.com/dashboard/tools/wheel',
  dashboardChatWidget: 'https://senchabot.com/dashboard/tools',
  dashboardFollowerGoal: 'https://senchabot.com/dashboard/tools/follower-goal',
  docs: 'https://docs.senchabot.com',
  discord: 'https://discord.com/invite/qUxwcjRzND',
  x: 'https://x.com/senchabot',
  instagram: 'https://instagram.com/senchabot',
  youtube: 'https://www.youtube.com/@senchabot',
  reddit: 'https://reddit.com/r/Senchabot/',
} as const;

// On localhost the dashboard runs locally too. Pass `useHydrated()`: the server renders the
// production URL, and the hydrating render has to match it or React reports a mismatch.
const onLocalhost = (hydrated: boolean) =>
  hydrated &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export function resolveDashboardChatWidgetUrl(hydrated: boolean): string {
  if (onLocalhost(hydrated)) return 'http://localhost:3000/dashboard/tools';
  return LINKS.dashboardChatWidget;
}

export function resolveDashboardFollowerGoalUrl(hydrated: boolean): string {
  if (onLocalhost(hydrated)) return 'http://localhost:3000/dashboard/tools/follower-goal';
  return LINKS.dashboardFollowerGoal;
}

export const CONTENT_PATHS = {
  guides: '/guides',
  presets: '/presets',
  faq: '/faq',
  changelog: '/changelog',
} as const satisfies Record<string, SitePath>;
