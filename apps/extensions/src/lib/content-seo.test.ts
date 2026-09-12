import { describe, expect, it } from 'vitest';
import { getArticleJsonLd } from './content-seo';

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
