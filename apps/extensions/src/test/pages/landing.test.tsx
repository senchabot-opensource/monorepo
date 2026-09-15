import { within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LOCALES, type Locale, translate } from '#/lib/i18n';
import { WIDGETS } from '#/lib/widgets';
import { headings, inLocale, section } from '#/test/queries';
import { renderRoute } from '#/test/render';

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
  const home = locale === 'en' ? '/' : '/tr';
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
      expect(within(heading).getByRole('link').getAttribute('href')).toBe(
        localized(widget.setupPath),
      );
    });

    const how = section(t('home.howTitle'));
    const steps = [...how.querySelectorAll('ol > li')].map((item) => item.textContent);
    expect(steps).toEqual([
      expect.stringContaining(t('home.howStep1')),
      expect.stringContaining(t('home.howStep2')),
      expect.stringContaining(t('home.howStep3')),
    ]);
    const sizes = [...how.querySelectorAll('tbody tr')].map((row) => row.textContent);
    expect(sizes).toContain(`${t('widgets.chatBox.name')}400 × 600`);

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
