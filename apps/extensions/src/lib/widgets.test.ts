import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { en } from './i18n/en';
import { resolveKey } from './i18n/index';
import { tr } from './i18n/tr';
import { getWidget, OVERLAYS, TOOLS, WIDGETS } from './widgets';

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

  it('gives demo URLs only to overlays, on their own widget route', () => {
    for (const widget of OVERLAYS) {
      expect(widget.demoUrl, widget.id).toMatch(new RegExp(`^${widget.widgetPath}\\?`));
    }
    for (const widget of TOOLS) {
      expect(widget.demoUrl, widget.id).toBeNull();
    }
  });

  it('gives every overlay a browser-source size', () => {
    for (const widget of OVERLAYS) {
      expect(widget.sourceSize?.width, widget.id).toBeGreaterThan(0);
      expect(widget.sourceSize?.height, widget.id).toBeGreaterThan(0);
    }
  });

  it('has a name and tagline in every locale', () => {
    for (const widget of WIDGETS) {
      for (const dict of [en, tr]) {
        expect(resolveKey(dict, widget.nameKey), widget.nameKey).toBeTruthy();
        expect(resolveKey(dict, widget.taglineKey), widget.taglineKey).toBeTruthy();
      }
    }
  });

  it('never lists the unpromoted alerts widget', () => {
    expect(WIDGETS.some((w) => w.widgetPath.includes('alerts'))).toBe(false);
  });

  it('looks widgets up by id', () => {
    expect(getWidget('raffle').setupPath).toBe('/setup/raffle');
  });
});
