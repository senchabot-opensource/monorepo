import { describe, expect, it } from 'vitest';
import { withoutAction, withoutBypassSuffix } from './chat-text';

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

describe('withoutAction', () => {
  it("drops a /me message's wrapper, with or without its closing byte", () => {
    expect(withoutAction('\x01ACTION !join\x01')).toBe('!join');
    expect(withoutAction('\x01ACTION waves')).toBe('waves');
  });

  it('keeps any other text as it is', () => {
    expect(withoutAction('!join')).toBe('!join');
    expect(withoutAction('ACTION !join')).toBe('ACTION !join');
  });
});
