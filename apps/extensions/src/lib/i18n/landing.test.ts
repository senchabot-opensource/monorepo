import { describe, expect, it } from 'vitest';
import { LANDING_SCRIPT } from './landing';
import { pickBrowserLocale } from './locales';

interface Visit {
  url: string;
  saved?: string | null;
  languages?: string[];
}

/** Runs the inline script against a fake page and reports where it sent the visitor. */
function land({ url, saved = null, languages = ['en-US'] }: Visit) {
  const parsed = new URL(url, 'https://extensions.senchabot.com');
  const storage = new Map<string, string>(saved ? [['lang', saved]] : []);
  let redirect: string | null = null;
  const location = {
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    replace: (to: string) => {
      redirect = to;
    },
  };
  const localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  };
  const navigator = { languages, language: languages[0] };
  new Function('location', 'localStorage', 'navigator', LANDING_SCRIPT)(
    location,
    localStorage,
    navigator,
  );
  return { redirect, saved: storage.get('lang') ?? null };
}

describe('landing script: first visit, no saved choice', () => {
  it('sends a Turkish browser from an English page to the Turkish one', () => {
    expect(land({ url: '/', languages: ['tr-TR', 'tr'] }).redirect).toBe('/tr');
    expect(land({ url: '/setup/chat-widget', languages: ['tr'] }).redirect).toBe(
      '/tr/setup/chat-widget',
    );
  });

  it('keeps English, other and unsupported browsers on the English page', () => {
    expect(land({ url: '/', languages: ['en-US'] }).redirect).toBeNull();
    expect(land({ url: '/faq', languages: ['de-DE', 'it'] }).redirect).toBeNull();
    expect(land({ url: '/faq', languages: [] }).redirect).toBeNull();
  });

  it('uses the first supported language, not any mention of Turkish', () => {
    expect(land({ url: '/', languages: ['en-GB', 'tr-TR'] }).redirect).toBeNull();
    expect(land({ url: '/', languages: ['de-DE', 'tr-TR', 'en'] }).redirect).toBe('/tr');
  });

  it('sends every other supported language to its own prefix', () => {
    expect(land({ url: '/', languages: ['es-MX'] }).redirect).toBe('/es');
    expect(land({ url: '/faq', languages: ['fr-CA'] }).redirect).toBe('/fr/faq');
    expect(land({ url: '/guides', languages: ['ja'] }).redirect).toBe('/ja/guides');
    expect(land({ url: '/setup/raffle', languages: ['pt-BR'] }).redirect).toBe('/pt/setup/raffle');
    expect(land({ url: '/es/faq', languages: ['en-US'] })).toEqual({ redirect: null, saved: 'es' });
    expect(land({ url: '/ja/faq?lang=fr' }).redirect).toBe('/fr/faq');
  });

  it("doesn't save a guess from the browser language", () => {
    expect(land({ url: '/', languages: ['tr-TR'] }).saved).toBeNull();
  });
});

describe('landing script: saved choice', () => {
  it('beats the browser language both ways', () => {
    expect(land({ url: '/', saved: 'en', languages: ['tr-TR'] }).redirect).toBeNull();
    expect(land({ url: '/guides', saved: 'tr', languages: ['en-US'] }).redirect).toBe('/tr/guides');
  });

  it('ignores a garbage saved value', () => {
    expect(land({ url: '/', saved: 'xx', languages: ['en-US'] }).redirect).toBeNull();
  });
});

describe('landing script: explicit language in the URL', () => {
  it('stays on a /tr page and saves Turkish, even for an English browser or saved English', () => {
    const visit = land({ url: '/tr/faq', saved: 'en', languages: ['en-US'] });
    expect(visit.redirect).toBeNull();
    expect(visit.saved).toBe('tr');
  });

  it('applies ?lang= in both directions, drops the param and keeps the rest', () => {
    const toTurkish = land({ url: '/setup/raffle?channel=foo&lang=tr&platform=kick#faq' });
    expect(toTurkish.redirect).toBe('/tr/setup/raffle?channel=foo&platform=kick#faq');
    expect(toTurkish.saved).toBe('tr');

    const toEnglish = land({ url: '/tr/setup/raffle?lang=en', languages: ['tr-TR'] });
    expect(toEnglish.redirect).toBe('/setup/raffle');
    expect(toEnglish.saved).toBe('en');

    expect(land({ url: '/tr?lang=tr' }).redirect).toBe('/tr');
  });

  it('ignores an unsupported ?lang= value', () => {
    expect(land({ url: '/?lang=de', languages: ['en-US'] }).redirect).toBeNull();
  });
});

describe('landing script: overlays and tools', () => {
  it('never redirects or saves on /widgets/* and /tools/*', () => {
    for (const url of ['/widgets/chat-widget?mock=true&lang=tr', '/tools/obs-bridge?lang=tr']) {
      expect(land({ url, languages: ['tr-TR'], saved: 'tr' })).toEqual({
        redirect: null,
        saved: 'tr',
      });
    }
  });

  it("doesn't mistake paths that only start with 'tr' for Turkish pages", () => {
    expect(land({ url: '/trivia', languages: ['en-US'] }).redirect).toBeNull();
  });
});

describe('pickBrowserLocale', () => {
  it('picks the first supported base language and falls back to English', () => {
    expect(pickBrowserLocale(['tr-TR'])).toBe('tr');
    expect(pickBrowserLocale(['de', 'en-US', 'tr'])).toBe('en');
    expect(pickBrowserLocale(['de', 'fr'])).toBe('fr');
    expect(pickBrowserLocale(['de', 'it'])).toBe('en');
    expect(pickBrowserLocale([])).toBe('en');
  });
});

describe('landing script: awkward URLs', () => {
  it('reads /tr/ as the Turkish home page and tidies the slash', () => {
    expect(land({ url: '/tr/', languages: ['en-US'] })).toEqual({ redirect: '/tr', saved: 'tr' });
  });

  it('keeps the hash and the other params when it switches language', () => {
    expect(land({ url: '/guides/chat-poll?x=a%20b#commands', languages: ['tr'] }).redirect).toBe(
      '/tr/guides/chat-poll?x=a+b#commands',
    );
    expect(land({ url: '/tr/faq?lang=en#support' }).redirect).toBe('/faq#support');
  });

  it('only takes the exact lowercase codes from ?lang=', () => {
    expect(land({ url: '/?lang=TR', languages: ['en-US'] })).toEqual({
      redirect: null,
      saved: null,
    });
  });

  it('does not save anything or move a visitor already on their saved language', () => {
    expect(land({ url: '/tr/setup/raffle', saved: 'tr' })).toEqual({ redirect: null, saved: 'tr' });
    expect(land({ url: '/faq', saved: 'en', languages: ['tr'] })).toEqual({
      redirect: null,
      saved: 'en',
    });
  });

  it('agrees with pickBrowserLocale for every language list', () => {
    const lists = [
      ['tr-TR'],
      ['en-GB', 'tr'],
      ['de', 'TR'],
      ['pt-BR', 'fr'],
      ['JA-jp'],
      [''],
      ['zh', 'en'],
    ];
    for (const languages of lists) {
      const locale = pickBrowserLocale(languages);
      const expected = locale === 'en' ? null : `/${locale}`;
      expect(land({ url: '/', languages }).redirect, languages.join(',')).toBe(expected);
    }
  });
});
