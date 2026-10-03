import { describe, expect, it } from 'vitest';
import { isSpinRequest, maySpin } from './spin-chat';

describe('isSpinRequest', () => {
  it('matches !spin in any case, with or without trailing words', () => {
    expect(isSpinRequest('!spin')).toBe(true);
    expect(isSpinRequest('!SPIN')).toBe(true);
    expect(isSpinRequest('!Spin please')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isSpinRequest('!spins')).toBe(false);
    expect(isSpinRequest('spin')).toBe(false);
    expect(isSpinRequest('!join')).toBe(false);
    expect(isSpinRequest('')).toBe(false);
  });
});

describe('maySpin', () => {
  it('lets mods and the broadcaster through under every permission', () => {
    for (const permission of ['all', 'subs', 'mods'] as const) {
      expect(maySpin({ mod: true, sub: false }, permission)).toBe(true);
    }
  });

  it('gates viewers by the permission', () => {
    expect(maySpin({ mod: false, sub: false }, 'all')).toBe(true);
    expect(maySpin({ mod: false, sub: false }, 'subs')).toBe(false);
    expect(maySpin({ mod: false, sub: false }, 'mods')).toBe(false);
    expect(maySpin({ mod: false, sub: true }, 'subs')).toBe(true);
    expect(maySpin({ mod: false, sub: true }, 'mods')).toBe(false);
  });
});
