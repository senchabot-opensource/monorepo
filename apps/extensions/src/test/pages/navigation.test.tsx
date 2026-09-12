import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { isAppPath } from '#/lib/i18n/paths';
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
});

const TURKISH_PAGES = [
  '/tr',
  '/tr/setup/chat-widget',
  '/tr/setup/emote-wall',
  '/tr/setup/sub-growing-plant',
  '/tr/setup/raffle',
  '/tr/setup/obs-bridge',
  '/tr/guides',
  '/tr/guides/obs-browser-source',
  '/tr/guides/twitch-kick-chat-overlay',
  '/tr/guides/chat-giveaway',
  '/tr/guides/obs-scene-switcher',
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
