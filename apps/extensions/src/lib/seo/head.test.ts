import { describe, expect, it } from 'vitest';
import { CONTENT_META, GUIDES } from '#/lib/guides';
import { LOCALES } from '#/lib/i18n/locales';
import {
  DESCRIPTION_MAX,
  getPageHead,
  type LocalizedMeta,
  OG_IMAGES,
  type PageMeta,
  TITLE_MAX,
} from './head';
import { PAGE_META } from './pages';

const meta = { title: 'A title', description: 'A description.' };

const content = (tags: ReturnType<typeof getPageHead>['meta'], key: string) =>
  tags.filter((tag) => tag.name === key || tag.property === key).map((tag) => tag.content);

describe('getPageHead', () => {
  const head = getPageHead({ path: '/setup/raffle', locale: 'en', meta, image: 'raffle' });

  it('sets each tag once, mirroring title and description', () => {
    expect(head.meta.filter((tag) => 'title' in tag)).toEqual([{ title: 'A title' }]);
    for (const key of ['description', 'og:description', 'twitter:description']) {
      expect(content(head.meta, key), key).toEqual(['A description.']);
    }
    for (const key of ['og:title', 'twitter:title']) {
      expect(content(head.meta, key), key).toEqual(['A title']);
    }
    expect(content(head.meta, 'robots')).toEqual([
      'index, follow, max-image-preview:large, max-snippet:-1',
    ]);
  });

  it('uses absolute URLs for the page, the image and the canonical', () => {
    expect(content(head.meta, 'og:url')).toEqual(['https://extensions.senchabot.com/setup/raffle']);
    expect(content(head.meta, 'og:image')).toEqual([
      'https://extensions.senchabot.com/og/raffle.png',
    ]);
    expect(content(head.meta, 'twitter:image')).toEqual(content(head.meta, 'og:image'));
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://extensions.senchabot.com/setup/raffle',
    });
  });

  it('describes the 1200×630 image', () => {
    expect(content(head.meta, 'og:image:width')).toEqual(['1200']);
    expect(content(head.meta, 'og:image:height')).toEqual(['630']);
    expect(content(head.meta, 'og:image:alt')).toEqual([OG_IMAGES.raffle.alt.en]);
  });

  it('points the home canonical at the bare origin', () => {
    const home = getPageHead({ path: '/', locale: 'en', meta, image: 'home' });
    expect(content(home.meta, 'og:url')).toEqual(['https://extensions.senchabot.com']);
  });

  it('drops the canonical and og:url for a noindex page', () => {
    const notFound = getPageHead({ locale: 'tr', meta, image: 'guides', noindex: true });
    expect(content(notFound.meta, 'robots')).toEqual(['noindex, follow']);
    expect(content(notFound.meta, 'og:url')).toEqual([]);
    expect(notFound.links).toEqual([]);
  });

  it('adds one script per JSON-LD object', () => {
    const withData = getPageHead({
      path: '/faq',
      locale: 'en',
      meta,
      image: 'guides',
      jsonLd: [{ a: 1 }],
    });
    expect(withData.meta.filter((tag) => 'script:ld+json' in tag)).toHaveLength(1);
  });
});

describe('getPageHead per locale', () => {
  const heads = {
    en: getPageHead({ path: '/setup/raffle', locale: 'en', meta, image: 'raffle' }),
    tr: getPageHead({ path: '/setup/raffle', locale: 'tr', meta, image: 'raffle' }),
  };
  const en = 'https://extensions.senchabot.com/setup/raffle';
  const tr = 'https://extensions.senchabot.com/tr/setup/raffle';

  it('gives each language its own canonical and og:url', () => {
    expect(heads.en.links.find((link) => link.rel === 'canonical')?.href).toBe(en);
    expect(heads.tr.links.find((link) => link.rel === 'canonical')?.href).toBe(tr);
    expect(content(heads.tr.meta, 'og:url')).toEqual([tr]);
  });

  it('lists the same reciprocal hreflang alternates on both, with x-default in English', () => {
    const alternates = [
      { rel: 'alternate', hrefLang: 'en', href: en },
      { rel: 'alternate', hrefLang: 'tr', href: tr },
      { rel: 'alternate', hrefLang: 'x-default', href: en },
    ];
    for (const head of Object.values(heads)) {
      expect(head.links.filter((link) => link.rel === 'alternate')).toEqual(alternates);
    }
  });

  it('localizes the home page alternates to /tr', () => {
    const home = getPageHead({ path: '/', locale: 'tr', meta, image: 'home' });
    expect(home.links.map((link) => link.href)).toEqual([
      'https://extensions.senchabot.com/tr',
      'https://extensions.senchabot.com',
      'https://extensions.senchabot.com/tr',
      'https://extensions.senchabot.com',
    ]);
  });

  it('sets og:locale to the page language and the other one as the alternate', () => {
    expect(content(heads.en.meta, 'og:locale')).toEqual(['en_US']);
    expect(content(heads.en.meta, 'og:locale:alternate')).toEqual(['tr_TR']);
    expect(content(heads.tr.meta, 'og:locale')).toEqual(['tr_TR']);
    expect(content(heads.tr.meta, 'og:locale:alternate')).toEqual(['en_US']);
  });

  it('keeps the English image and translates its alt', () => {
    expect(content(heads.tr.meta, 'og:image')).toEqual(content(heads.en.meta, 'og:image'));
    expect(content(heads.tr.meta, 'og:image:alt')).toEqual([OG_IMAGES.raffle.alt.tr]);
  });
});

describe('page meta', () => {
  const localized: [string, LocalizedMeta][] = [
    ...Object.entries(PAGE_META),
    ...GUIDES.map((guide): [string, LocalizedMeta] => [guide.id, guide.meta]),
    ...Object.entries(CONTENT_META),
  ];
  const all: [string, PageMeta][] = localized.flatMap(([page, byLocale]) =>
    LOCALES.map((locale): [string, PageMeta] => [`${page} ${locale}`, byLocale[locale]]),
  );
  const isShortPage = (page: string) => page in PAGE_META;

  it('keeps titles within 60 characters', () => {
    for (const [page, { title }] of all) expect(title.length, page).toBeLessThanOrEqual(TITLE_MAX);
  });

  it('keeps home, setup and 404 descriptions between 150 and 160 characters', () => {
    for (const [page, byLocale] of localized.filter(([id]) => isShortPage(id))) {
      for (const locale of LOCALES) {
        const { length } = byLocale[locale].description;
        expect(length, `${page} ${locale}`).toBeGreaterThanOrEqual(150);
        expect(length, `${page} ${locale}`).toBeLessThanOrEqual(DESCRIPTION_MAX);
      }
    }
  });

  it('keeps guide and content descriptions within 160 characters', () => {
    for (const [page, { description }] of all) {
      expect(description.length, page).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });

  it('gives every page its own title and description in every language', () => {
    expect(new Set(all.map(([, m]) => m.title)).size).toBe(all.length);
    expect(new Set(all.map(([, m]) => m.description)).size).toBe(all.length);
  });

  it('writes the copy without dashes as connectors', () => {
    for (const [page, { title, description }] of all) {
      expect(`${title} ${description}`, page).not.toMatch(/[–—]| - /);
    }
  });

  it('serves every Open Graph image from /og as a PNG', () => {
    for (const { path } of Object.values(OG_IMAGES)) expect(path).toMatch(/^\/og\/[a-z-]+\.png$/);
  });
});
