import { act, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LANDING_PICKS, LANDING_REST } from '#/components/landing/demo-presets';
import { LOCALES, type Locale, translate } from '#/lib/i18n';
import { getWidget, inCategory, WIDGETS } from '#/lib/widgets';
import { en, headings, inLocale, section } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

interface JsonLdNode {
  '@type': string;
  mainEntity?: { name: string; acceptedAnswer: { text: string } }[];
}

/** The FAQPage nodes of the page's JSON-LD graph, as rendered into <head>. */
function faqJsonLd() {
  const scripts = [...document.head.querySelectorAll('script[type="application/ld+json"]')];
  const nodes = scripts.flatMap(
    (script) => (JSON.parse(script.textContent ?? '{}')['@graph'] ?? []) as JsonLdNode[],
  );
  return nodes.filter((node) => node['@type'] === 'FAQPage');
}

/** A link's path and query. */
const linkOf = (link: Element) => new URL(link.getAttribute('href') ?? '', 'https://x.test');

/** The preset a demo frame or a link names, or null. */
const presetOf = (element: Element) =>
  element instanceof HTMLIFrameElement
    ? new URL(element.src).searchParams.get('preset')
    : linkOf(element).searchParams.get('preset');

/** The visible FAQ as [question, answer] pairs, in page order. */
function visibleFaq(locale: Locale) {
  return [...section(translate(locale, 'common.faqTitle')).querySelectorAll('details')].map(
    (details) => [
      details.querySelector('summary')?.textContent,
      details.querySelector('p')?.textContent,
    ],
  );
}

describe.each(LOCALES)('landing page in %s', (locale) => {
  const t = inLocale(locale);
  const home = locale === 'en' ? '/' : `/${locale}`;
  const localized = (path: string) => (locale === 'en' ? path : `/${locale}${path}`);

  it('has the hero, the widget gallery, the steps and the FAQ', async () => {
    await renderRoute(home);
    expect(headings(1)).toEqual([t('home.heroTitle')]);
    expect(
      within(section(t('home.heroTitle')))
        .getByText(t('home.browseWidgets'))
        .closest('a')
        ?.getAttribute('href'),
    ).toBe('#widgets');

    const gallery = section(t('home.galleryTitle'));
    expect(gallery.id).toBe('widgets');
    const cards = [...gallery.querySelectorAll('article')];
    expect(cards).toHaveLength(WIDGETS.length);
    cards.forEach((card, index) => {
      const widget = WIDGETS[index];
      const heading = within(card).getByRole('heading', { level: 4 });
      expect(heading.textContent).toBe(t(widget.nameKey));
      // Plus the preset its demo is shown in, for the cards that have one.
      expect(linkOf(within(heading).getByRole('link')).pathname).toBe(localized(widget.setupPath));
    });

    const how = section(t('home.howTitle'));
    const steps = [...how.querySelectorAll('ol > li')].map((item) => item.textContent);
    expect(steps).toEqual([
      expect.stringContaining(t('home.howStep1')),
      expect.stringContaining(t('home.howStep2')),
      expect.stringContaining(t('home.howStep3')),
    ]);
    // Pairs of widgets, each name a link to its setup page, then every size in the OBS guide.
    const together = within(how).getByRole('heading', { name: t('home.comboTitle') }).parentElement;
    expect([...(together?.querySelectorAll('a') ?? [])].map((a) => a.getAttribute('href'))).toEqual(
      [
        ...(['irl-hud', 'weather', 'countdown', 'credits', 'countdown', 'tasks'] as const).map(
          (id) => localized(getWidget(id).setupPath),
        ),
        `${localized('/guides/obs-browser-source')}#sizes`,
      ],
    );
    expect(how.querySelectorAll('iframe, [data-testid="preview-loading"]').length).toBeGreaterThan(
      0,
    );

    const questions = visibleFaq(locale).map(([question]) => question);
    expect(questions).toEqual([1, 2, 3, 4, 5, 6].map((n) => t(`home.faq${n}Q` as 'home.faq1Q')));
  });

  it('runs the overlay demos in the page language', async () => {
    await renderRoute(home);
    const frames = [...document.querySelectorAll('iframe')];
    expect(frames.length).toBeGreaterThan(0);
    for (const frame of frames) {
      expect(new URL(frame.src).searchParams.get('lang')).toBe(locale);
      expect(frame.getAttribute('scrolling')).toBe('no');
    }
  });

  it.each([
    '/',
    '/setup/chat-widget',
    '/setup/raffle',
    '/setup/obs-bridge',
  ])('%s puts the same FAQ in its JSON-LD as on the page', async (path) => {
    await renderRoute(localized(path));
    const [faq, ...others] = faqJsonLd();
    expect(others).toHaveLength(0);
    expect(faq.mainEntity?.map((entry) => [entry.name, entry.acceptedAnswer.text])).toEqual(
      visibleFaq(locale),
    );
  });
});

describe('landing page presets', () => {
  afterEach(() => vi.restoreAllMocks());
  const NO_PRESET = ['emote-wall', 'sub-sprout', 'irl-hud', 'weather', 'raffle', 'obs-bridge'];

  it('shows the gallery demos in presets, and opens each setup page on the one it showed', async () => {
    await renderRoute('/');
    const gallery = section(en('home.galleryTitle'));
    const shown: string[] = [];
    const rest: string[] = [];
    for (const card of gallery.querySelectorAll('article')) {
      const link = card.querySelector('h4 a') as HTMLAnchorElement;
      const name = link.textContent ?? '';
      const widget = WIDGETS.find((entry) => en(entry.nameKey) === name);
      const linked = presetOf(link);
      // A drawn tool, or a widget with its own art, has no preset to show.
      if (
        !widget ||
        NO_PRESET.includes(widget.id) ||
        widget.id === 'poll' ||
        widget.id === 'spin-wheel'
      ) {
        expect(linked, name).toBeNull();
        continue;
      }
      // The user's picks for a few demos, the rest dealt from four.
      expect(LANDING_PICKS[widget.id] ?? LANDING_REST, name).toContain(linked);
      if (!LANDING_PICKS[widget.id]) rest.push(linked ?? '');
      shown.push(linked ?? '');
      // jsdom can't measure, so the demos drawn at a fixed size never mount.
      const frame = card.querySelector('iframe');
      if (frame) expect(presetOf(frame), name).toBe(linked);
    }
    // More of the rest than presets to deal them from: all four show, and no two neighbors match.
    expect(rest.length).toBeGreaterThan(LANDING_REST.length);
    expect(new Set(rest)).toEqual(new Set(LANDING_REST));
    expect(shown.every((id, index) => index === 0 || id !== shown[index - 1])).toBe(true);
  });

  it('keeps the hero scene classic, and puts the poll in a preset its button opens on', async () => {
    await renderRoute('/');
    const hero = [...section(en('home.heroTitle')).querySelectorAll('iframe')];
    // Chat Box, Emote Wall, Sub Sprout and the Subathon Timer, each in its own look.
    expect(hero.length).toBeGreaterThan(0);
    expect(hero.map(presetOf).filter(Boolean)).toEqual([]);

    const spotlight = section(en('home.pollSpotlight.title'));
    const poll = presetOf(spotlight.querySelector('iframe') as HTMLIFrameElement);
    expect(LANDING_REST).toContain(poll);
    const setup = within(spotlight).getByRole('link', { name: en('home.pollSpotlight.setup') });
    expect(linkOf(setup).pathname).toBe('/setup/chat-poll');
    expect(presetOf(setup)).toBe(poll);
  });

  it('shows every preview in Pizza or Flower from the buttons over the overlays, and back', async () => {
    const user = setupUser();
    await renderRoute('/');
    const gallery = section(en('home.galleryTitle'));
    const picks = within(gallery).getByRole('group', { name: en('home.presetPicks.label') });
    const button = (name: string) => within(picks).getByRole('button', { name });
    // The preset each card's setup link opens on, card by card.
    const shown = () =>
      [...gallery.querySelectorAll('article h4 a')].map(presetOf).filter((id) => id !== null);
    const dealt = shown();
    expect(
      within(picks)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Pizza', 'Flower', 'Boost', 'Glitch', 'Operator']);

    await user.click(button('Pizza'));
    expect(button('Pizza').getAttribute('aria-pressed')).toBe('true');
    expect(shown()).toEqual(dealt.map(() => 'pizza'));
    await user.click(button('Flower'));
    expect([button('Pizza'), button('Flower')].map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
    ]);
    expect(shown()).toEqual(dealt.map(() => 'flower'));
    // Pressed again, each card goes back to the preset it was dealt.
    await user.click(button('Flower'));
    expect(shown()).toEqual(dealt);

    const more = within(picks).getByRole('link', { name: en('home.presetPicks.more') });
    expect(linkOf(more).pathname).toBe('/presets');
  });

  it('deals new presets on every visit', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    // The gallery's presets, card by card.
    const dealt = () =>
      [...section(en('home.galleryTitle')).querySelectorAll('h4 a')]
        .map(presetOf)
        .filter(Boolean)
        .join();
    const { router } = await renderRoute('/');
    const first = dealt();
    random.mockReturnValue(0.5);
    await act(() => router.navigate({ href: '/faq' }));
    await act(() => router.navigate({ href: '/' }));
    expect(first).not.toBe('');
    expect(dealt()).not.toBe('');
    expect(dealt()).not.toBe(first);
  });
});

describe('landing page widget filter', () => {
  const gallery = () => section(en('home.galleryTitle'));
  const names = () =>
    [...gallery().querySelectorAll('article h4')].map((heading) => heading.textContent);
  const pick = (user: ReturnType<typeof setupUser>, key: 'all' | 'irl' | 'chat') =>
    user.click(
      within(gallery()).getByRole('radio', {
        name: (name) => name.startsWith(`${en(`widgets.categories.${key}`)} `),
      }),
    );

  it('shows one category at a time, hides an empty group and keeps the pick in the URL', async () => {
    const user = setupUser();
    await renderRoute('/');
    await pick(user, 'irl');
    expect(names()).toEqual([
      en('widgets.irlHud.name'),
      en('widgets.weather.name'),
      en('widgets.obsBridge.name'),
    ]);
    // OBS Bridge, a tool, keeps the Tools heading.
    expect(within(gallery()).getByRole('heading', { name: en('widgets.tools') })).toBeTruthy();
    expect(new URL(window.location.href).searchParams.get('category')).toBe('irl');

    // No tool is a chat widget, so the Tools heading goes.
    await pick(user, 'chat');
    expect(within(gallery()).queryByRole('heading', { name: en('widgets.tools') })).toBeNull();

    await pick(user, 'all');
    expect(names()).toHaveLength(WIDGETS.length);
    expect(window.location.search).toBe('');
  });

  it('opens on the category of a shared link, and ignores one it does not know', async () => {
    await renderRoute('/?category=chat');
    await vi.waitFor(() =>
      expect(names()).toEqual(inCategory(WIDGETS, 'chat').map((widget) => en(widget.nameKey))),
    );
  });

  it('shows everything for an unknown category', async () => {
    await renderRoute('/?category=nope');
    expect(names()).toHaveLength(WIDGETS.length);
  });
});
