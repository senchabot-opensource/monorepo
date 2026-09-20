import type { SitePath } from '#/lib/i18n/paths';

const REPO = 'https://github.com/senchabot-opensource/monorepo';

export const LINKS = {
  source: `${REPO}/tree/dev/apps/extensions`,
  license: `${REPO}/blob/dev/LICENSE`,
  newIssue: `${REPO}/issues/new`,
  presetGuide: `${REPO}/tree/dev/apps/extensions/src/features/presets/community`,
  discussions: `${REPO}/discussions`,
  senchabot: 'https://senchabot.com',
  docs: 'https://docs.senchabot.com',
  discord: 'https://discord.com/invite/qUxwcjRzND',
  x: 'https://x.com/senchabot',
  instagram: 'https://instagram.com/senchabot',
  youtube: 'https://www.youtube.com/@senchabot',
  reddit: 'https://reddit.com/r/Senchabot/',
} as const;

export const CONTENT_PATHS = {
  guides: '/guides',
  presets: '/presets',
  faq: '/faq',
  changelog: '/changelog',
} as const satisfies Record<string, SitePath>;
