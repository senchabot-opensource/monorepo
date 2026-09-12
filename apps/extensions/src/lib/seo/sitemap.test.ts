import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GUIDES, GUIDES_PATH } from '#/lib/guides';
import { LOCALES } from '#/lib/i18n/locales';
import { getPathLocale, stripLocale } from '#/lib/i18n/paths';
import { getLocaleLinks } from '#/lib/i18n/seo';
import { WIDGETS } from '#/lib/widgets';
import { pageUrl } from './head';

const appDir = resolve(__dirname, '../../..');
const sitemap = readFileSync(`${appDir}/public/sitemap.xml`, 'utf8');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1],
  alternates: [
    ...body.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g),
  ].map(([, hrefLang, href]) => ({ rel: 'alternate', hrefLang, href })),
}));
const locs = entries.map((entry) => entry.loc);
const prerendered = [
  ...readFileSync(`${appDir}/vite.config.ts`, 'utf8').matchAll(/\{ path: '([^']+)' \}/g),
].map((match) => match[1]);
/** The canonical URL of a prerendered path like `/tr/faq`. */
const canonical = (path: string) => pageUrl(stripLocale(path), getPathLocale(path));

describe('sitemap.xml', () => {
  it('lists each page once, at its canonical URL', () => {
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs.sort()).toEqual(prerendered.map(canonical).sort());
  });

  it('covers the home page, every setup page, guide and content page in every language', () => {
    const paths = [
      '/',
      ...WIDGETS.map((widget) => widget.setupPath),
      GUIDES_PATH,
      ...GUIDES.map((guide) => guide.path),
      '/faq',
      '/changelog',
    ];
    const urls = LOCALES.flatMap((locale) => paths.map((path) => pageUrl(path, locale)));
    expect(locs.sort()).toEqual(urls.sort());
  });

  it('gives every URL the same en, tr and x-default alternates as its page head', () => {
    for (const { loc = '', alternates } of entries) {
      const path = loc.replace('https://extensions.senchabot.com', '') || '/';
      const links = getLocaleLinks(stripLocale(path), getPathLocale(path));
      expect(links[0], loc).toEqual({ rel: 'canonical', href: loc });
      expect(alternates, loc).toEqual(links.filter((link) => link.rel === 'alternate'));
    }
  });
});
