import { describe, expect, it } from 'vitest';
import { isExternalHref, parseRichText, richTextToPlain } from './rich-text';

describe('parseRichText', () => {
  it('returns plain copy as a single text token', () => {
    expect(parseRichText('Just text.')).toEqual([{ type: 'text', text: 'Just text.' }]);
  });

  it('splits code spans and links out of the text', () => {
    expect(parseRichText('Type `!join` on the [Raffle page](/setup/raffle) now.')).toEqual([
      { type: 'text', text: 'Type ' },
      { type: 'code', text: '!join' },
      { type: 'text', text: ' on the ' },
      { type: 'link', text: 'Raffle page', href: '/setup/raffle' },
      { type: 'text', text: ' now.' },
    ]);
  });

  it('handles markup at the edges and back to back', () => {
    expect(parseRichText('`brb``back`')).toEqual([
      { type: 'code', text: 'brb' },
      { type: 'code', text: 'back' },
    ]);
  });

  it('leaves unmatched brackets and a lone backtick as text', () => {
    expect(parseRichText('a [b] (c) ` d')).toEqual([{ type: 'text', text: 'a [b] (c) ` d' }]);
  });

  it('returns nothing for an empty string', () => {
    expect(parseRichText('')).toEqual([]);
  });
});

describe('richTextToPlain', () => {
  it('drops the markup and keeps the words', () => {
    expect(richTextToPlain('Type `!join` on the [Raffle page](/setup/raffle).')).toBe(
      'Type !join on the Raffle page.',
    );
  });
});

describe('isExternalHref', () => {
  it('tells external URLs from site paths', () => {
    expect(isExternalHref('https://github.com')).toBe(true);
    expect(isExternalHref('/setup/raffle')).toBe(false);
  });
});
