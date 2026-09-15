import { describe, expect, it } from 'vitest';
import { GUIDES } from '#/lib/guides';
import { en } from '#/lib/i18n/en';
import { tr } from '#/lib/i18n/tr';
import { WIDGETS } from '#/lib/widgets';
import { APP_FEATURES, getGuideHead, getSetupPageHead, PAGE_META } from './pages';
import {
  getAppNode,
  getFaqNode,
  getPageGraph,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from './structured-data';

type Node = Record<string, unknown>;

const page = {
  path: '/setup/raffle',
  locale: 'en',
  meta: PAGE_META.raffle.en,
  image: 'raffle',
} as const;

/** Every `{ '@id': ... }` reference anywhere inside a value. */
function refs(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(refs);
  if (!value || typeof value !== 'object') return [];
  const entries = Object.entries(value);
  const own = entries.length === 1 && entries[0][0] === '@id' ? [String(entries[0][1])] : [];
  return [...own, ...entries.filter(([key]) => key !== '@id').flatMap(([, v]) => refs(v))];
}

/** The graph a route's head puts in its only JSON-LD script. */
function graphOf(head: { meta: object[] }) {
  const scripts = head.meta.filter((tag) => 'script:ld+json' in tag) as {
    'script:ld+json': { '@graph': Node[] };
  }[];
  expect(scripts).toHaveLength(1);
  return JSON.parse(JSON.stringify(scripts[0]['script:ld+json']))['@graph'] as Node[];
}

describe('getPageGraph', () => {
  const graph = getPageGraph(page, {
    breadcrumbs: [{ name: 'Raffle Setup' }],
    faq: [['raffle.faq1Q', 'raffle.faq1A']],
    mainEntity: getAppNode({
      path: page.path,
      locale: 'en',
      name: 'Raffle',
      description: 'Desc',
      image: 'raffle',
      features: ['One'],
    }),
  })['@graph'];
  const byType = (type: string) => graph.find((node) => node['@type'] === type) as Node;

  it('starts with the Organization and the WebSite', () => {
    expect(graph[0]).toMatchObject({ '@type': 'Organization', '@id': ORGANIZATION_ID });
    expect(graph[1]).toMatchObject({ '@type': 'WebSite', '@id': WEBSITE_ID, inLanguage: 'en' });
  });

  it('gives every node a unique @id and resolves every reference inside the graph', () => {
    const ids = graph.map((node) => node['@id']);
    expect(new Set(ids).size).toBe(graph.length);
    for (const id of refs(graph)) expect(ids, id).toContain(id);
  });

  it('points every publisher at Senchabot', () => {
    for (const node of graph.filter((n) => 'publisher' in n)) {
      expect(node.publisher).toEqual({ '@id': ORGANIZATION_ID });
    }
  });

  it('builds the breadcrumb as Home > page with absolute URLs', () => {
    expect(byType('BreadcrumbList').itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://extensions.senchabot.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Raffle Setup',
        item: 'https://extensions.senchabot.com/setup/raffle',
      },
    ]);
  });

  it('describes the app as free, with no ratings', () => {
    const app = byType('WebApplication');
    expect(app.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'USD' });
    expect(app.operatingSystem).toBe('Windows, macOS, Linux');
    expect(app.screenshot).toBe('https://extensions.senchabot.com/og/raffle.png');
    expect(app).not.toHaveProperty('aggregateRating');
    expect(byType('WebPage').mainEntity).toEqual({ '@id': app['@id'] });
  });

  it('leaves out the breadcrumb, main entity and FAQ when a page has none', () => {
    const bare = getPageGraph(page)['@graph'];
    expect(bare.map((node) => node['@type'])).toEqual(['Organization', 'WebSite', 'WebPage']);
  });
});

describe('getFaqNode', () => {
  const entries = [
    ['home.faq1Q', 'home.faq1A'],
    ['home.faq3Q', 'home.faq3A'],
  ] as const;

  it('builds the questions from the English copy, in order', () => {
    expect(getFaqNode('/', entries, 'en').mainEntity).toEqual([
      {
        '@type': 'Question',
        name: en.home.faq1Q,
        acceptedAnswer: { '@type': 'Answer', text: en.home.faq1A },
      },
      {
        '@type': 'Question',
        name: en.home.faq3Q,
        acceptedAnswer: { '@type': 'Answer', text: en.home.faq3A },
      },
    ]);
  });

  it('uses the Turkish copy and the /tr URL on Turkish pages', () => {
    const node = getFaqNode('/', entries, 'tr');
    expect(node['@id']).toBe('https://extensions.senchabot.com/tr#faq');
    expect(node.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: tr.home.faq1Q,
        acceptedAnswer: { '@type': 'Answer', text: tr.home.faq1A },
      },
      {
        '@type': 'Question',
        name: tr.home.faq3Q,
        acceptedAnswer: { '@type': 'Answer', text: tr.home.faq3A },
      },
    ]);
  });
});

describe('Turkish page graphs', () => {
  const graph = graphOf(
    getSetupPageHead('raffle', 'tr', {
      breadcrumb: 'raffle.breadcrumb',
      faq: [['raffle.faq1Q', 'raffle.faq1A']],
    }),
  );
  const byType = (type: string) => graph.find((node) => node['@type'] === type) as Node;

  it('marks the page, site and article language as Turkish', () => {
    expect(byType('WebPage')).toMatchObject({
      '@id': 'https://extensions.senchabot.com/tr/setup/raffle#webpage',
      url: 'https://extensions.senchabot.com/tr/setup/raffle',
      name: PAGE_META.raffle.tr.title,
      inLanguage: 'tr',
    });
    expect(byType('WebSite')).toMatchObject({ inLanguage: 'tr' });
    const article = graphOf(getGuideHead(GUIDES[0], 'tr')).find(
      (node) => node['@type'] === 'Article',
    );
    expect(article).toMatchObject({ inLanguage: 'tr', headline: tr.guides.obs.title });
  });

  it('builds the breadcrumb from Turkish names and /tr URLs', () => {
    expect(byType('BreadcrumbList').itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: tr.common.home,
        item: 'https://extensions.senchabot.com/tr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tr.raffle.breadcrumb,
        item: 'https://extensions.senchabot.com/tr/setup/raffle',
      },
    ]);
  });

  it('lists as many app features in Turkish as in English', () => {
    for (const widget of WIDGETS) {
      expect(APP_FEATURES[widget.id].tr, widget.id).toHaveLength(APP_FEATURES[widget.id].en.length);
    }
  });

  it('describes the app in Turkish at its /tr URL', () => {
    expect(byType('WebApplication')).toMatchObject({
      name: tr.widgets.raffle.name,
      url: 'https://extensions.senchabot.com/tr/setup/raffle',
    });
    expect(byType('FAQPage').mainEntity).toEqual([
      {
        '@type': 'Question',
        name: tr.raffle.faq1Q,
        acceptedAnswer: { '@type': 'Answer', text: tr.raffle.faq1A },
      },
    ]);
  });

  it('resolves every reference inside the Turkish graph', () => {
    const ids = graph.map((node) => node['@id']);
    for (const id of refs(graph)) expect(ids, id).toContain(id);
  });
});

describe('page heads', () => {
  it('give every setup page one graph with its app, breadcrumb and FAQ', () => {
    for (const widget of WIDGETS) {
      const graph = graphOf(
        getSetupPageHead(widget.id, 'en', {
          breadcrumb: 'raffle.breadcrumb',
          faq: [['raffle.faq1Q', 'raffle.faq1A']],
        }),
      );
      expect(
        graph.map((node) => node['@type']),
        widget.id,
      ).toEqual([
        'Organization',
        'WebSite',
        'WebPage',
        'BreadcrumbList',
        'WebApplication',
        'FAQPage',
      ]);
    }
  });

  it('give every guide an Article under Home > Guides', () => {
    for (const guide of GUIDES) {
      const graph = graphOf(getGuideHead(guide, 'en'));
      const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList')?.itemListElement as {
        item: string;
      }[];
      expect(crumbs.map((crumb) => crumb.item)).toEqual([
        'https://extensions.senchabot.com',
        'https://extensions.senchabot.com/guides',
        `https://extensions.senchabot.com${guide.path}`,
      ]);
      expect(graph.some((node) => node['@type'] === 'Article')).toBe(true);
    }
  });
});
