import { describe, expect, it } from 'vitest';
import { withoutBypassSuffix } from './chat-text';

describe('withoutBypassSuffix', () => {
  it("drops Chatterino's and 7TV's suffix for a repeated message", () => {
    expect(withoutBypassSuffix('brb ͏')).toBe('brb');
    expect(withoutBypassSuffix('!poll end \u{E0000}')).toBe('!poll end');
    expect(withoutBypassSuffix('ok  ͏ ')).toBe('ok');
  });

  it('keeps the rest of the text, and the closing byte of a /me message', () => {
    expect(withoutBypassSuffix('brb')).toBe('brb');
    expect(withoutBypassSuffix('a͏b')).toBe('a͏b');
    expect(withoutBypassSuffix('\x01ACTION waves ͏\x01')).toBe('\x01ACTION waves\x01');
  });
});
