const REPO = 'https://github.com/senchabot-opensource/monorepo';

export const LINKS = {
  source: `${REPO}/tree/dev/apps/extensions`,
  license: `${REPO}/blob/dev/LICENSE`,
  newIssue: `${REPO}/issues/new`,
  discussions: `${REPO}/discussions`,
  senchabot: 'https://senchabot.com',
  docs: 'https://docs.senchabot.com',
  discord: 'https://discord.com/invite/qUxwcjRzND',
  x: 'https://x.com/senchabot',
  instagram: 'https://instagram.com/senchabot',
  youtube: 'https://www.youtube.com/@senchabot',
  reddit: 'https://reddit.com/r/Senchabot/',
} as const;

/**
 * Site pages that other branches add. Plain anchors until they land, because Link's typed
 * `to` rejects routes that aren't in the route tree yet.
 */
export const CONTENT_PATHS = {
  guides: '/guides',
  faq: '/faq',
  changelog: '/changelog',
} as const;
