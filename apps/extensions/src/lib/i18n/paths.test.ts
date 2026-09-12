import { describe, expect, it } from 'vitest';
import { getParamsLocale, getPathLocale, isAppPath, localizePath, stripLocale } from './paths';

describe('getPathLocale', () => {
  it('reads Turkish from the /tr prefix only', () => {
    expect(getPathLocale('/tr')).toBe('tr');
    expect(getPathLocale('/tr/')).toBe('tr');
    expect(getPathLocale('/tr/setup/raffle')).toBe('tr');
    expect(getPathLocale('/')).toBe('en');
    expect(getPathLocale('/setup/raffle')).toBe('en');
    expect(getPathLocale('/trending')).toBe('en');
    expect(getPathLocale('/en/faq')).toBe('en');
  });
});

describe('getParamsLocale', () => {
  it('falls back to English without a locale param', () => {
    expect(getParamsLocale({ locale: 'tr' })).toBe('tr');
    expect(getParamsLocale({})).toBe('en');
    expect(getParamsLocale({ locale: 'de' })).toBe('en');
  });
});

describe('stripLocale', () => {
  it('turns a Turkish path into its English one', () => {
    expect(stripLocale('/tr')).toBe('/');
    expect(stripLocale('/tr/faq')).toBe('/faq');
    expect(stripLocale('/tr/guides/chat-giveaway')).toBe('/guides/chat-giveaway');
    expect(stripLocale('/faq')).toBe('/faq');
    expect(stripLocale('/')).toBe('/');
  });
});

describe('localizePath', () => {
  it('prefixes Turkish paths and leaves English ones bare', () => {
    expect(localizePath('/', 'tr')).toBe('/tr');
    expect(localizePath('/faq', 'tr')).toBe('/tr/faq');
    expect(localizePath('/setup/chat-widget', 'tr')).toBe('/tr/setup/chat-widget');
    expect(localizePath('/', 'en')).toBe('/');
    expect(localizePath('/faq', 'en')).toBe('/faq');
  });

  it('switches an already localized path instead of prefixing it twice', () => {
    expect(localizePath('/tr/faq', 'tr')).toBe('/tr/faq');
    expect(localizePath('/tr/faq', 'en')).toBe('/faq');
    expect(localizePath('/tr', 'en')).toBe('/');
  });

  it('keeps the query and hash', () => {
    expect(localizePath('/setup/raffle?channel=foo&platform=kick', 'tr')).toBe(
      '/tr/setup/raffle?channel=foo&platform=kick',
    );
    expect(localizePath('/guides/chat-giveaway#rules', 'tr')).toBe(
      '/tr/guides/chat-giveaway#rules',
    );
    expect(localizePath('/tr?x=1', 'en')).toBe('/?x=1');
    expect(localizePath('/?x=1', 'tr')).toBe('/tr?x=1');
  });

  it('never touches overlay, tool, anchor or external URLs', () => {
    for (const url of [
      '/widgets/chat-widget?twitch=foo&lang=tr',
      '/tools/obs-bridge?twitch=foo',
      '#widgets',
      'https://senchabot.com',
      '//example.com/faq',
    ]) {
      expect(localizePath(url, 'tr'), url).toBe(url);
    }
  });
});

describe('isAppPath', () => {
  it('matches overlays and tools, not setup pages', () => {
    expect(isAppPath('/widgets/chat-widget')).toBe(true);
    expect(isAppPath('/tools/obs-bridge')).toBe(true);
    expect(isAppPath('/setup/obs-bridge')).toBe(false);
    expect(isAppPath('/tr/setup/obs-bridge')).toBe(false);
  });
});
