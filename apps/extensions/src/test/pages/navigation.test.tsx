import { cleanup, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { crossLinkSpan } from '#/components/widget-cross-links';
import { isAppPath } from '#/lib/i18n/paths';
import { THEME_INIT_SCRIPT } from '#/lib/theme';
import { OVERLAYS, TOOLS, WIDGETS } from '#/lib/widgets';
import { button, en, headings, section, tr } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

vi.mock('obs-websocket-js', () => import('#/test/fake-obs-websocket'));

// Testing Library counts every <header> as a banner; the site header comes first.
const banner = () => screen.getAllByRole('banner')[0];
const languageLinks = () => {
  const names = [en('common.languageToggle'), tr('common.languageToggle')];
  const group = screen.getByRole('group', { name: (name) => names.includes(name) });
  const [enLink, trLink] = within(group).getAllByRole('link') as HTMLAnchorElement[];
  return { enLink, trLink };
};

describe('full header', () => {
  it('has the Widgets menu with every registry widget, Guides and FAQ', async () => {
    const user = setupUser();
    await renderRoute('/');
    const nav = within(banner()).getAllByRole('navigation', { name: en('common.nav.label') })[0];

    const menu = within(nav).getByRole('button', { name: en('common.nav.widgets') });
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    await user.click(menu);
    expect(menu.getAttribute('aria-expanded')).toBe('true');

    const panel = document.getElementById(menu.getAttribute('aria-controls') ?? '') as HTMLElement;
    for (const [group, widgets] of [
      ['widgets.overlays', OVERLAYS],
      ['widgets.tools', TOOLS],
    ] as const) {
      const list = within(panel).getByRole('list', { name: en(group) });
      const links = within(list).getAllByRole('link') as HTMLAnchorElement[];
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        widgets.map((widget) => widget.setupPath),
      );
      links.forEach((link, index) => {
        expect(link.textContent).toContain(en(widgets[index].nameKey));
      });
    }
    expect(within(panel).getAllByRole('link')).toHaveLength(WIDGETS.length);

    expect(
      within(nav)
        .getByRole('link', { name: en('common.nav.guides') })
        .getAttribute('href'),
    ).toBe('/guides');
    expect(
      within(nav)
        .getByRole('link', { name: en('common.nav.faq') })
        .getAttribute('href'),
    ).toBe('/faq');
  });

  it('marks the current content page and links the skip link to the main landmark', async () => {
    await renderRoute('/faq');
    const nav = within(banner()).getAllByRole('navigation', { name: en('common.nav.label') })[0];
    expect(
      within(nav)
        .getByRole('link', { name: en('common.nav.faq') })
        .getAttribute('aria-current'),
    ).toBe('page');
    expect(
      within(nav)
        .getByRole('link', { name: en('common.nav.guides') })
        .getAttribute('aria-current'),
    ).toBeNull();
    const skip = screen.getByText(en('common.skipToContent'), { selector: 'a' });
    expect(skip.getAttribute('href')).toBe('#main');
    expect(document.getElementById('main')?.tagName).toBe('MAIN');
  });
});

describe('compact header on setup pages', () => {
  it('holds the page H1 and a widget switcher with the current widget marked', async () => {
    const user = setupUser();
    await renderRoute('/setup/emote-wall');
    expect(within(banner()).getByRole('heading', { level: 1 }).textContent).toBe(
      en('emoteWallSetup.title'),
    );

    const switcher = within(banner()).getByRole('button', { name: en('common.nav.switchWidget') });
    await user.click(switcher);
    const panel = document.getElementById(
      switcher.getAttribute('aria-controls') ?? '',
    ) as HTMLElement;
    const links = within(panel).getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      WIDGETS.map((widget) => widget.setupPath),
    );
    const current = links.filter((link) => link.getAttribute('aria-current') === 'page');
    expect(current.map((link) => link.textContent)).toEqual([en('widgets.emoteWall.name')]);

    await user.click(links[0]);
    expect(window.location.pathname).toBe('/setup/chat-widget');
    expect(headings(1)).toEqual([en('chatWidget.title')]);
  });

  it('lists the other widgets under the page, but not this one', async () => {
    await renderRoute('/setup/raffle');
    const more = section(en('common.moreWidgets'));
    const hrefs = within(more)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(
      WIDGETS.filter((widget) => widget.id !== 'raffle').map((widget) => widget.setupPath),
    );
  });

  it('widens the cards of a short last row so the grid has no hole', () => {
    const spans = (count: number) =>
      Array.from({ length: count }, (_, index) => crossLinkSpan(index, count));
    // Five: 3 + 2 halves on wide screens, the odd one full width on tablets.
    expect(spans(5)).toEqual([
      'lg:col-span-2',
      'lg:col-span-2',
      'lg:col-span-2',
      'lg:col-span-3',
      'lg:col-span-3 sm:col-span-2',
    ]);
    expect(spans(6)).toEqual(Array(6).fill('lg:col-span-2'));
    expect(spans(7).at(-1)).toBe('lg:col-span-6 sm:col-span-2');
  });
});

const TURKISH_PAGES = [
  '/tr',
  ...WIDGETS.map((widget) => `/tr${widget.setupPath}`),
  '/tr/guides',
  '/tr/guides/obs-browser-source',
  '/tr/guides/twitch-kick-chat-overlay',
  '/tr/guides/chat-giveaway',
  '/tr/guides/obs-scene-switcher',
  '/tr/guides/obs-chat-dock',
  '/tr/guides/stream-alerts',
  '/tr/guides/subathon-timer',
  '/tr/guides/chat-poll',
  '/tr/presets',
  '/tr/faq',
  '/tr/changelog',
  '/tr/no-such-page',
];

/** Every site link on the page, menus and the closed mobile sheet included. */
function internalLinks() {
  return [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].filter((link) => {
    const href = link.getAttribute('href') ?? '';
    return href.startsWith('/') && !href.startsWith('//') && !isAppPath(href);
  });
}

describe('Turkish pages', () => {
  it.each(TURKISH_PAGES)('%s links only to Turkish pages', async (url) => {
    await renderRoute(url);
    expect(document.documentElement.lang).toBe('tr');
    const links = internalLinks();
    expect(links.length).toBeGreaterThan(10);

    const english = links.filter(
      (link) => !/^\/tr(?=$|[/?#])/.test(link.getAttribute('href') ?? ''),
    );
    // Only the language switcher's EN link leaves the Turkish site.
    expect(
      english.map((link) => [link.getAttribute('href'), link.getAttribute('hreflang')]),
    ).toEqual([[english[0]?.getAttribute('href'), 'en']]);
  });

  it.each([
    '/faq',
    '/changelog',
    '/guides',
    '/guides/chat-poll',
  ])('%s names every landmark in Turkish under /tr', async (url) => {
    const landmarkNames = () =>
      [...document.querySelectorAll('nav')].map(
        (nav) =>
          nav.getAttribute('aria-label') ??
          document.getElementById(nav.getAttribute('aria-labelledby') ?? '')?.textContent,
      );
    await renderRoute(url);
    const english = landmarkNames();
    cleanup();
    await renderRoute(`/tr${url}`);
    const turkish = landmarkNames();
    expect(turkish).toHaveLength(english.length);
    turkish.forEach((name, index) => {
      expect(name, `landmark ${index}`).not.toBe(english[index]);
    });
    expect(screen.getByRole('navigation', { name: tr('common.nav.breadcrumb') })).toBeTruthy();
  });

  it.each([
    '/',
    '/setup/raffle',
    '/faq',
    '/guides/chat-giveaway',
  ])('%s in English links to no Turkish page except the switcher', async (url) => {
    await renderRoute(url);
    const turkish = internalLinks().filter((link) => link.getAttribute('href')?.startsWith('/tr'));
    expect(turkish.map((link) => link.getAttribute('hreflang'))).toEqual(['tr']);
  });
});

describe('language switcher', () => {
  it('links to the same page in the other language and switches on click', async () => {
    const user = setupUser();
    await renderRoute('/setup/raffle');
    let { enLink, trLink } = languageLinks();
    expect(enLink.getAttribute('href')).toBe('/setup/raffle');
    expect(enLink.getAttribute('aria-current')).toBe('true');
    expect(trLink.getAttribute('href')).toBe('/tr/setup/raffle');
    expect(trLink.getAttribute('aria-current')).toBeNull();

    await user.click(trLink);
    expect(window.location.pathname).toBe('/tr/setup/raffle');
    expect(headings(1)).toEqual([tr('raffle.title')]);
    expect(document.documentElement.lang).toBe('tr');
    ({ enLink, trLink } = languageLinks());
    expect(enLink.getAttribute('href')).toBe('/setup/raffle');
    expect(trLink.getAttribute('aria-current')).toBe('true');
  });

  it.each([
    ['/tr', '/'],
    ['/tr/faq', '/faq'],
    ['/tr/guides/obs-scene-switcher', '/guides/obs-scene-switcher'],
  ])('maps %s back to %s', async (url, english) => {
    await renderRoute(url);
    expect(languageLinks().enLink.getAttribute('href')).toBe(english);
  });

  it('sends old ?lang= links to the page in that language', async () => {
    await renderRoute('/setup/emote-wall?lang=tr');
    expect(window.location.pathname).toBe('/tr/setup/emote-wall');
    expect(window.location.search).toBe('');
    expect(headings(1)).toEqual([tr('emoteWallSetup.title')]);
  });

  it('switches tools through ?lang=, keeping the rest of the query', async () => {
    const user = setupUser();
    await renderRoute('/tools/obs-bridge?mainScene=Gaming&lang=en');
    const { trLink } = languageLinks();
    const href = new URL(trLink.getAttribute('href') ?? '', window.location.origin);
    expect(href.pathname).toBe('/tools/obs-bridge');
    expect(href.searchParams.get('lang')).toBe('tr');
    expect(href.searchParams.get('mainScene')).toBe('Gaming');

    await user.click(trLink);
    const search = new URLSearchParams(window.location.search);
    expect(window.location.pathname).toBe('/tools/obs-bridge');
    expect(search.get('lang')).toBe('tr');
    expect(search.get('mainScene')).toBe('Gaming');
    expect(headings(1)).toEqual([tr('obsBridge.tool.title')]);
  });
});

describe('theme toggle', () => {
  it('flips the dark class on <html> and remembers the choice', async () => {
    const user = setupUser();
    await renderRoute('/');
    const html = document.documentElement;
    const themeColor = () =>
      document.querySelector('meta[name="theme-color"]')?.getAttribute('content');
    expect(html.classList.contains('dark')).toBe(true);
    expect(html.style.colorScheme).toBe('dark');

    await user.click(button(en('common.themeToggle')));
    expect(html.classList.contains('dark')).toBe(false);
    expect(html.style.colorScheme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(themeColor()).toBe('#fafafa');

    await user.click(button(en('common.themeToggle')));
    expect(html.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(themeColor()).toBe('#09090b');
  });

  it('starts from the saved theme', async () => {
    localStorage.setItem('theme', 'light');
    await renderRoute('/setup/chat-widget');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  // The inline script paints before React. Anything it disagrees with flips at hydration.
  const paintBeforeReact = (path: string) => {
    window.history.replaceState(null, '', path);
    document.documentElement.className = '';
    new Function(THEME_INIT_SCRIPT)();
  };

  it('paints the theme the page keeps, whatever the OS prefers', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query }));
    paintBeforeReact('/');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    await renderRoute('/');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    vi.unstubAllGlobals();
  });

  it('never flashes dark over a saved light theme while the page starts', async () => {
    localStorage.setItem('theme', 'light');
    paintBeforeReact('/setup/chat-widget');
    const html = document.documentElement;
    const seen: string[] = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) seen.push(record.oldValue ?? '');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    await renderRoute('/setup/chat-widget');
    for (const record of observer.takeRecords()) seen.push(record.oldValue ?? '');
    observer.disconnect();
    expect(seen.filter((value) => value.split(' ').includes('dark'))).toEqual([]);
    expect(html.classList.contains('dark')).toBe(false);
  });
});

describe('footer', () => {
  it('lists every overlay and tool setup page', async () => {
    await renderRoute('/tr/faq');
    const footer = document.querySelector('footer') as HTMLElement;
    for (const [group, widgets] of [
      ['widgets.overlays', OVERLAYS],
      ['widgets.tools', TOOLS],
    ] as const) {
      const column = within(footer).getByRole('heading', { name: tr(group) })
        .parentElement as HTMLElement;
      expect(
        within(column)
          .getAllByRole('link')
          .map((link) => link.getAttribute('href')),
      ).toEqual(widgets.map((widget) => `/tr${widget.setupPath}`));
    }
  });
});

describe('language switch keeps the visitor in place', () => {
  it('carries the query and the hash over to the page in the other language', async () => {
    const user = setupUser();
    await renderRoute('/setup/raffle?channel=foo&platform=kick#faq');
    await user.click(languageLinks().trLink);
    expect(window.location.pathname).toBe('/tr/setup/raffle');
    expect(window.location.search).toBe('?channel=foo&platform=kick');
    expect(window.location.hash).toBe('#faq');
    expect(localStorage.getItem('lang')).toBe('tr');
  });

  it('does nothing when the current language is clicked', async () => {
    const user = setupUser();
    await renderRoute('/tr/faq');
    await user.click(languageLinks().trLink);
    expect(window.location.pathname).toBe('/tr/faq');
    expect(localStorage.getItem('lang')).toBeNull();
  });
});

describe('mobile menu', () => {
  it('opens as a modal, and a link in it closes it and stays in Turkish', async () => {
    const user = setupUser();
    await renderRoute('/tr/faq');
    const open = screen.getByRole('button', { name: tr('common.nav.openMenu') });
    await user.click(open);
    const dialog = document.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(true);
    expect(open.getAttribute('aria-expanded')).toBe('true');

    const poll = within(dialog)
      .getAllByRole('link')
      .find((link) => link.textContent?.includes(tr('widgets.poll.name')));
    expect(poll?.getAttribute('href')).toBe('/tr/setup/chat-poll');
    await user.click(poll as HTMLElement);
    expect(window.location.pathname).toBe('/tr/setup/chat-poll');
    expect(headings(1)).toEqual([tr('poll.title')]);
  });

  it('closes from its close button', async () => {
    const user = setupUser();
    await renderRoute('/guides');
    await user.click(screen.getByRole('button', { name: en('common.nav.openMenu') }));
    const dialog = document.querySelector('dialog') as HTMLDialogElement;
    await user.click(within(dialog).getByRole('button', { name: en('common.nav.closeMenu') }));
    expect(dialog.open).toBe(false);
    expect(
      screen.getByRole('button', { name: en('common.nav.openMenu') }).getAttribute('aria-expanded'),
    ).toBe('false');
  });
});

describe('404 page', () => {
  const meta = (name: string) =>
    document.head.querySelector(`meta[name="${name}"]`)?.getAttribute('content');

  it.each([
    ['/no-such-page', 'en', '/'],
    ['/tr/no-such-page', 'tr', '/tr'],
    ['/setup/no-such-widget', 'en', '/'],
  ] as const)('%s is a noindex page in its language that links home', async (url, locale, home) => {
    await renderRoute(url);
    const t = locale === 'en' ? en : tr;
    expect(headings(1)).toEqual([t('common.notFound.title')]);
    expect(document.documentElement.lang).toBe(locale);
    expect(meta('robots')).toBe('noindex, follow');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.title).toContain(t('common.notFound.title').split(' ')[0]);
    expect(screen.getByText(t('common.notFound.home')).closest('a')?.getAttribute('href')).toBe(
      home,
    );
  });
});
