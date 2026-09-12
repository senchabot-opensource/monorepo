import { useRouter } from '@tanstack/react-router';

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

/** Content pages that land separately; link to them through `useRouteExists`. */
export const CONTENT_PATHS = {
  guides: '/guides',
  faq: '/faq',
  changelog: '/changelog',
} as const;

/**
 * Whether a route is in the route tree. Links to content pages render only once it is: the
 * prerender crawler follows every <a href> and fails the build on a 404. They stay plain
 * anchors because Link's typed `to` rejects paths the tree doesn't know yet.
 */
export function useRouteExists(path: string) {
  const router = useRouter();
  return path in router.routesByPath;
}
