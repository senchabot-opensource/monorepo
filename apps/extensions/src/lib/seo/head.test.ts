import { describe, expect, it } from 'vitest';
import { CONTENT_META, GUIDES } from '#/lib/guides';
import { DESCRIPTION_MAX, getPageHead, OG_IMAGES, type PageMeta, TITLE_MAX } from './head';
import { PAGE_META } from './pages';

const meta = { title: 'A title', description: 'A description.' };

const content = (tags: ReturnType<typeof getPageHead>['meta'], key: string) =>
  tags.filter((tag) => tag.name === key || tag.property === key).map((tag) => tag.content);

describe('getPageHead', () => {
  const head = getPageHead({ path: '/setup/raffle', meta, image: 'raffle' });

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
    expect(content(head.meta, 'og:image:alt')).toEqual([OG_IMAGES.raffle.alt]);
  });

  it('points the home canonical at the bare origin', () => {
    const home = getPageHead({ path: '/', meta, image: 'home' });
    expect(content(home.meta, 'og:url')).toEqual(['https://extensions.senchabot.com']);
  });

  it('drops the canonical and og:url for a noindex page', () => {
    const notFound = getPageHead({ meta, image: 'guides', noindex: true });
    expect(content(notFound.meta, 'robots')).toEqual(['noindex, follow']);
    expect(content(notFound.meta, 'og:url')).toEqual([]);
    expect(notFound.links).toEqual([]);
  });

  it('adds one script per JSON-LD object', () => {
    const withData = getPageHead({ path: '/faq', meta, image: 'guides', jsonLd: [{ a: 1 }] });
    expect(withData.meta.filter((tag) => 'script:ld+json' in tag)).toHaveLength(1);
  });
});

describe('page meta', () => {
  const guideMeta: [string, PageMeta][] = [
    ...GUIDES.map((guide): [string, PageMeta] => [guide.id, guide.meta]),
    ...Object.entries(CONTENT_META),
  ];
  const all: [string, PageMeta][] = [...Object.entries(PAGE_META), ...guideMeta];

  it('keeps titles within 60 characters', () => {
    for (const [page, { title }] of all) expect(title.length, page).toBeLessThanOrEqual(TITLE_MAX);
  });

  it('keeps home, setup and 404 descriptions between 150 and 160 characters', () => {
    for (const [page, { description }] of Object.entries(PAGE_META)) {
      expect(description.length, page).toBeGreaterThanOrEqual(150);
      expect(description.length, page).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });

  it('keeps guide and content descriptions within 160 characters', () => {
    for (const [page, { description }] of guideMeta) {
      expect(description.length, page).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });

  it('gives every page its own title and description', () => {
    expect(new Set(all.map(([, m]) => m.title)).size).toBe(all.length);
    expect(new Set(all.map(([, m]) => m.description)).size).toBe(all.length);
  });

  it('serves every Open Graph image from /og as a PNG', () => {
    for (const { path } of Object.values(OG_IMAGES)) expect(path).toMatch(/^\/og\/[a-z-]+\.png$/);
  });
});
