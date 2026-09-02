export const SITE_URL = 'https://extensions.senchabot.com';

interface LocaleLink {
  rel: string;
  href: string;
  hreflang?: string;
}

/**
 * Self-referencing canonical plus hreflang alternates for language variants.
 * Language variants are served via the `?lang=` query param (client-side).
 */
export function getLocaleLinks(path: string): LocaleLink[] {
  const url = path === '/' || path === '' ? SITE_URL : `${SITE_URL}${path}`;
  return [
    { rel: 'canonical', href: url },
    { rel: 'alternate', hreflang: 'en', href: url },
    { rel: 'alternate', hreflang: 'tr', href: `${url}?lang=tr` },
    { rel: 'alternate', hreflang: 'x-default', href: url },
  ];
}
