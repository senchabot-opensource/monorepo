import { describe, expect, it } from 'vitest';
import {
  getLangRedirect,
  getParamsLocale,
  getPathLocale,
  isAppPath,
  localizePath,
  stripLocale,
  withLangParam,
} from './paths';

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
    expect(getParamsLocale({ locale: 'it' })).toBe('en');
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

describe('getLangRedirect', () => {
  it('moves ?lang=tr to the /tr page and drops the param', () => {
    expect(getLangRedirect('/setup/chat-widget', '?lang=tr')).toBe('/tr/setup/chat-widget');
    expect(getLangRedirect('/', '?lang=tr')).toBe('/tr');
    expect(getLangRedirect('/tr/faq', '?lang=tr')).toBe('/tr/faq');
  });

  it('moves ?lang=en on a Turkish page to the English one', () => {
    expect(getLangRedirect('/tr/setup/chat-widget', '?lang=en')).toBe('/setup/chat-widget');
    expect(getLangRedirect('/tr', '?lang=en')).toBe('/');
    expect(getLangRedirect('/faq', '?lang=en')).toBe('/faq');
  });

  it('keeps every other param exactly as it was, and the hash', () => {
    expect(getLangRedirect('/setup/raffle', '?channel=a%20b&lang=tr&platform=kick')).toBe(
      '/tr/setup/raffle?channel=a%20b&platform=kick',
    );
    expect(getLangRedirect('/guides/chat-giveaway', '?lang=tr', 'rules')).toBe(
      '/tr/guides/chat-giveaway#rules',
    );
  });

  it('drops an unknown language without switching pages', () => {
    expect(getLangRedirect('/tr/faq', '?lang=it&x=1')).toBe('/tr/faq?x=1');
  });

  it('does nothing without the param, and never on overlays or tools', () => {
    expect(getLangRedirect('/setup/raffle', '')).toBeNull();
    expect(getLangRedirect('/setup/raffle', '?channel=foo&language=tr')).toBeNull();
    expect(getLangRedirect('/widgets/chat-widget', '?lang=tr')).toBeNull();
    expect(getLangRedirect('/tools/obs-bridge', '?lang=tr')).toBeNull();
  });
});

describe('withLangParam', () => {
  it('sets lang on relative overlay URLs and keeps the other params in order', () => {
    expect(withLangParam('/widgets/emote-wall?mock=true&size=48', 'tr')).toBe(
      '/widgets/emote-wall?mock=true&size=48&lang=tr',
    );
  });

  it('replaces an existing lang instead of adding a second one', () => {
    expect(withLangParam('/widgets/chat-widget?mock=true&lang=en', 'tr')).toBe(
      '/widgets/chat-widget?mock=true&lang=tr',
    );
  });

  it('keeps absolute URLs absolute', () => {
    expect(withLangParam('https://extensions.senchabot.com/tools/obs-bridge?twitch=a', 'tr')).toBe(
      'https://extensions.senchabot.com/tools/obs-bridge?twitch=a&lang=tr',
    );
  });

  it('returns an empty string for an empty URL, so nothing loads', () => {
    expect(withLangParam('', 'en')).toBe('');
  });
});

describe('paths with awkward input', () => {
  it('treats /tr with a trailing slash as the Turkish home page', () => {
    expect(stripLocale('/tr/')).toBe('/');
    expect(localizePath('/tr/', 'en')).toBe('/');
    expect(localizePath('/tr/', 'tr')).toBe('/tr');
  });

  it('keeps a trailing slash on inner pages', () => {
    expect(localizePath('/faq/', 'tr')).toBe('/tr/faq/');
    expect(localizePath('/tr/faq/', 'en')).toBe('/faq/');
  });

  it('keeps a query and a hash together, in order', () => {
    expect(localizePath('/setup/raffle?channel=a%26b#faq', 'tr')).toBe(
      '/tr/setup/raffle?channel=a%26b#faq',
    );
    expect(localizePath('/tr#faq', 'en')).toBe('/#faq');
    expect(localizePath('/#widgets', 'tr')).toBe('/tr#widgets');
  });

  it('leaves relative paths alone', () => {
    expect(localizePath('faq', 'tr')).toBe('faq');
    expect(localizePath('?lang=tr', 'tr')).toBe('?lang=tr');
  });

  it('never reads a path that only starts with a locale as localized', () => {
    expect(stripLocale('/trivia')).toBe('/trivia');
    expect(localizePath('/trivia', 'en')).toBe('/trivia');
    expect(localizePath('/trivia', 'tr')).toBe('/tr/trivia');
  });

  it('matches only real overlay and tool paths as app paths', () => {
    expect(isAppPath('/widgets')).toBe(false);
    expect(isAppPath('/tools')).toBe(false);
    expect(isAppPath('/widgetsfoo/x')).toBe(false);
  });
});

describe('getLangRedirect with awkward queries', () => {
  it('drops every copy of a repeated lang param and follows the first one', () => {
    expect(getLangRedirect('/faq', '?lang=tr&x=1&lang=en')).toBe('/tr/faq?x=1');
  });

  it('drops an empty or valueless lang param without switching pages', () => {
    expect(getLangRedirect('/tr/faq', '?lang=')).toBe('/tr/faq');
    expect(getLangRedirect('/faq', '?lang&x=1')).toBe('/faq?x=1');
  });

  it('keeps params whose names only contain "lang"', () => {
    expect(getLangRedirect('/faq', '?language=tr&slang=1&lang=tr')).toBe(
      '/tr/faq?language=tr&slang=1',
    );
  });

  it('keeps encoded values byte for byte', () => {
    expect(getLangRedirect('/setup/raffle', '?channel=%C3%A7a%C4%9Fla&lang=tr&x=a+b')).toBe(
      '/tr/setup/raffle?channel=%C3%A7a%C4%9Fla&x=a+b',
    );
  });
});

describe('withLangParam with awkward URLs', () => {
  it('keeps the hash after the query', () => {
    expect(withLangParam('/widgets/poll?simulate=1#x', 'tr')).toBe(
      '/widgets/poll?simulate=1&lang=tr#x',
    );
  });

  it('adds a query to a URL without one', () => {
    expect(withLangParam('/widgets/raffle-overlay', 'en')).toBe('/widgets/raffle-overlay?lang=en');
  });

  it('keeps every other param value, pipes and spaces included', () => {
    const url = withLangParam('/widgets/poll?q=Who+wins%3F&o=A%7CB+C&lang=en&lang=tr', 'tr');
    const params = new URL(url, 'https://x').searchParams;
    expect(params.get('q')).toBe('Who wins?');
    expect(params.get('o')).toBe('A|B C');
    expect(params.getAll('lang')).toEqual(['tr']);
  });
});
