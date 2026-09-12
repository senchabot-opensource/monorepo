import { describe, expect, it } from 'vitest';
import { en } from './en';
import { getFaqJsonLd } from './seo';

describe('getFaqJsonLd', () => {
  it('builds FAQPage questions from the English copy, in order', () => {
    expect(
      getFaqJsonLd([
        ['home.faq1Q', 'home.faq1A'],
        ['home.faq3Q', 'home.faq3A'],
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
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
      ],
    });
  });

  it('returns an empty mainEntity for no entries', () => {
    expect(getFaqJsonLd([]).mainEntity).toEqual([]);
  });
});
