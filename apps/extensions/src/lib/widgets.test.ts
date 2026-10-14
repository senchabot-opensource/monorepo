import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { dictionaries, resolveKey } from './i18n/index';
import {
  getWidget,
  inCategory,
  OVERLAYS,
  readCategory,
  TOOLS,
  WIDGET_CATEGORIES,
  WIDGETS,
} from './widgets';

const srcDir = `${resolve(__dirname, '..')}/`;
const routeTree = readFileSync(`${srcDir}routeTree.gen.ts`, 'utf8');

describe('widget registry', () => {
  it('has unique ids and setup paths', () => {
    expect(new Set(WIDGETS.map((w) => w.id)).size).toBe(WIDGETS.length);
    expect(new Set(WIDGETS.map((w) => w.setupPath)).size).toBe(WIDGETS.length);
  });

  it('points every setup and widget path at an existing route', () => {
    for (const widget of WIDGETS) {
      // Setup pages sit under the optional locale segment; overlays and tools don't.
      for (const path of [`/{-$locale}${widget.setupPath}`, widget.widgetPath]) {
        expect(existsSync(`${srcDir}routes${path}.tsx`), path).toBe(true);
        expect(routeTree, path).toContain(`'${path}'`);
      }
    }
  });

  it('gives every overlay a demo URL, and runs every demo on its own widget route', () => {
    for (const widget of OVERLAYS) expect(widget.demoUrl, widget.id).not.toBeNull();
    for (const widget of WIDGETS.filter((entry) => entry.demoUrl)) {
      expect(widget.demoUrl, widget.id).toMatch(new RegExp(`^${widget.widgetPath}\\?`));
    }
    // A tool's demo is its on-stream part: the Subathon clock, the poll and the queue have one.
    expect(TOOLS.filter((widget) => widget.demoUrl).map((widget) => widget.id)).toEqual([
      'poll',
      'queue',
      'subathon',
    ]);
  });

  it('gives every overlay a browser-source size', () => {
    for (const widget of OVERLAYS) {
      expect(widget.sourceSize?.width, widget.id).toBeGreaterThan(0);
      expect(widget.sourceSize?.height, widget.id).toBeGreaterThan(0);
    }
  });

  it('has a name and tagline in every locale', () => {
    for (const widget of WIDGETS) {
      for (const dict of Object.values(dictionaries)) {
        expect(resolveKey(dict, widget.nameKey), widget.nameKey).toBeTruthy();
        expect(resolveKey(dict, widget.taglineKey), widget.taglineKey).toBeTruthy();
      }
    }
  });

  it('never lists the unpromoted alerts widget', () => {
    expect(WIDGETS.some((w) => w.widgetPath === '/widgets/alerts')).toBe(false);
  });

  it('puts every widget in one or two categories, and every category to use', () => {
    for (const widget of WIDGETS) {
      expect(widget.categories.length, widget.id).toBeGreaterThanOrEqual(1);
      expect(widget.categories.length, widget.id).toBeLessThanOrEqual(2);
      expect(new Set(widget.categories).size, widget.id).toBe(widget.categories.length);
    }
    for (const category of WIDGET_CATEGORIES) {
      expect(inCategory(WIDGETS, category).length, category).toBeGreaterThanOrEqual(2);
    }
    expect(inCategory(WIDGETS, 'all')).toBe(WIDGETS);
  });

  it('reads a category filter from text', () => {
    expect(readCategory('irl')).toBe('irl');
    expect(readCategory('IRL')).toBe('all');
    expect(readCategory('')).toBe('all');
    expect(readCategory(null)).toBe('all');
    expect(readCategory('toString')).toBe('all');
  });

  it('looks widgets up by id', () => {
    expect(getWidget('raffle').setupPath).toBe('/setup/raffle');
  });
});
