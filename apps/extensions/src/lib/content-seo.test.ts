import { describe, expect, it } from 'vitest';
import { getArticleJsonLd, getContentHead } from './content-seo';

const meta = { title: 'A title', description: 'A description.' };

describe('getContentHead', () => {
  it('mirrors title and description into Open Graph and Twitter tags', () => {
    const head = getContentHead({ path: '/faq', meta });
    expect(head.meta).toContainEqual({ title: 'A title' });
    expect(head.meta).toContainEqual({ name: 'description', content: 'A description.' });
    expect(head.meta).toContainEqual({ property: 'og:title', content: 'A title' });
    expect(head.meta).toContainEqual({ name: 'twitter:description', content: 'A description.' });
    expect(head.meta).toContainEqual({ property: 'og:type', content: 'website' });
    expect(head.meta).toContainEqual({
      property: 'og:url',
      content: 'https://extensions.senchabot.com/faq',
    });
  });

  it('points the canonical at the page itself', () => {
    const head = getContentHead({ path: '/guides/chat-giveaway', meta });
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://extensions.senchabot.com/guides/chat-giveaway',
    });
  });

  it('adds one script per JSON-LD object', () => {
    const head = getContentHead({ path: '/faq', meta, jsonLd: [{ a: 1 }, { b: 2 }] });
    expect(head.meta.filter((tag) => 'script:ld+json' in tag)).toHaveLength(2);
  });
});

describe('getArticleJsonLd', () => {
  it('names Senchabot as author and publisher', () => {
    const data = getArticleJsonLd({
      path: '/guides/obs-browser-source',
      headline: 'How to add a widget',
      description: 'Desc',
      datePublished: '2026-09-12',
    });
    expect(data['@type']).toBe('Article');
    expect(data.publisher.name).toBe('Senchabot');
    expect(data.author.name).toBe('Senchabot');
    expect(data.datePublished).toBe('2026-09-12');
    expect(data.mainEntityOfPage).toBe(
      'https://extensions.senchabot.com/guides/obs-browser-source',
    );
  });
});
