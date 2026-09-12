import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GUIDES, GUIDES_PATH } from '#/lib/guides';
import { WIDGETS } from '#/lib/widgets';
import { pageUrl } from './head';

const appDir = resolve(__dirname, '../../..');
const locs = [
  ...readFileSync(`${appDir}/public/sitemap.xml`, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match) => match[1]);
const prerendered = [
  ...readFileSync(`${appDir}/vite.config.ts`, 'utf8').matchAll(/\{ path: '([^']+)' \}/g),
].map((match) => match[1]);

describe('sitemap.xml', () => {
  it('lists each page once, at its canonical URL', () => {
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs.sort()).toEqual(prerendered.map((path) => pageUrl(path)).sort());
  });

  it('covers the home page, every setup page, guide and content page', () => {
    const paths = [
      '/',
      ...WIDGETS.map((widget) => widget.setupPath),
      GUIDES_PATH,
      ...GUIDES.map((guide) => guide.path),
      '/faq',
      '/changelog',
    ];
    expect(locs.sort()).toEqual(paths.map((path) => pageUrl(path)).sort());
  });
});
