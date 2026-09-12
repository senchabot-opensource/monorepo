import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_META, GUIDES, getGuide } from './guides';
import { en } from './i18n/en';
import { resolveKey } from './i18n/index';
import { tr } from './i18n/tr';
import type { PageMeta } from './seo/head';

const srcDir = `${resolve(__dirname, '..')}/`;
const routeTree = readFileSync(`${srcDir}routeTree.gen.ts`, 'utf8');

const expectMetaFits = (meta: PageMeta, label: string) => {
  expect(meta.title.length, `${label} title`).toBeLessThanOrEqual(60);
  expect(meta.description.length, `${label} description`).toBeLessThanOrEqual(160);
  expect(meta.description.length, `${label} description`).toBeGreaterThan(100);
};

describe('guide registry', () => {
  it('has unique ids and paths', () => {
    expect(new Set(GUIDES.map((g) => g.id)).size).toBe(GUIDES.length);
    expect(new Set(GUIDES.map((g) => g.path)).size).toBe(GUIDES.length);
  });

  it('points every guide at an existing route', () => {
    for (const guide of GUIDES) {
      const route = `/{-$locale}${guide.path}`;
      expect(existsSync(`${srcDir}routes${route}.tsx`), route).toBe(true);
      expect(routeTree, route).toContain(`'${route}'`);
    }
  });

  it('relates guides only to other guides that exist', () => {
    for (const guide of GUIDES) {
      expect(guide.related, guide.id).not.toContain(guide.id);
      for (const id of guide.related) expect(getGuide(id).id).toBe(id);
    }
  });

  it('has every key translated in every locale', () => {
    for (const guide of GUIDES) {
      for (const key of [guide.titleKey, guide.shortKey, guide.summaryKey, guide.leadKey]) {
        expect(resolveKey(en, key), key).toBeTruthy();
        expect(resolveKey(tr, key), key).toBeTruthy();
      }
    }
  });

  it('keeps titles within 60 and descriptions within 160 characters', () => {
    for (const guide of GUIDES) expectMetaFits(guide.meta, guide.id);
    for (const [page, meta] of Object.entries(CONTENT_META)) expectMetaFits(meta, page);
  });
});
