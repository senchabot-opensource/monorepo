import { describe, expect, it } from 'vitest';
import { getAccessibleColor } from './color-utils';

describe('getAccessibleColor', () => {
  it('reads hex and named colors', () => {
    expect(getAccessibleColor('#ffffff')).toBe('rgb(255, 255, 255)');
    expect(getAccessibleColor('White')).toBe('rgb(255, 255, 255)');
  });

  it('passes through unknown colors, including Object.prototype names', () => {
    for (const color of ['constructor', '__proto__', 'toString', 'rebeccapurple']) {
      expect(getAccessibleColor(color)).toBe(color);
    }
  });
});
