import { describe, expect, it } from 'vitest';
import {
  buildLowerThirdPreviewUrl,
  buildLowerThirdUrl,
  DEFAULT_LOWER_THIRD_SETTINGS,
  LINE_MAX_LENGTH,
  type LowerThirdSettings,
  MAX_LINES,
  parseLowerThirdUrl,
  readLowerThirdSettings,
} from '#/lib/lower-third-url';
import { lineIndexAt, parseLowerThirdCommand, phaseAt } from './lower-third-state';

const ORIGIN = 'https://extensions.senchabot.com';
const SETTINGS: LowerThirdSettings = {
  ...DEFAULT_LOWER_THIRD_SETTINGS,
  title: 'Senchabot',
  lines: ['First & best', 'Second | third'],
  corner: 'tr',
  rotate: 6,
  hold: 20,
  pause: 90,
  size: 150,
  color: 'gold',
};

describe('lower third URL', () => {
  it('needs only something to show, no channel', () => {
    expect(buildLowerThirdUrl(ORIGIN, { ...SETTINGS, title: '', lines: [' '] }, '', '')).toBe('');
    const url = new URL(buildLowerThirdUrl(ORIGIN, SETTINGS, '', ''));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      color: 'gold',
      corner: 'tr',
      title: 'Senchabot',
      lines: 'First & best|Second / third',
      rotate: '6',
      hold: '20',
      pause: '90',
      size: '150',
    });
  });

  it('reads back what it wrote, with the channels', () => {
    const parsed = parseLowerThirdUrl(buildLowerThirdUrl(ORIGIN, SETTINGS, 'Streamer', ''));
    expect(parsed).toEqual({
      settings: { ...SETTINGS, platforms: 'twitch', lines: ['First & best', 'Second / third'] },
      twitchChannel: 'streamer',
      kickChannel: '',
    });
    expect(parseLowerThirdUrl(`${ORIGIN}/widgets/goal?title=x`)).toBeNull();
  });

  it('falls back to defaults, clamps, and keeps at most six lines', () => {
    const many = Array.from({ length: 9 }, (_, index) => `L${index}`).join('|');
    const settings = readLowerThirdSettings(
      new URLSearchParams(
        `corner=middle&rotate=1&pause=1&size=999&hold=-5&lines=${encodeURIComponent(many)}`,
      ),
    );
    expect(settings.corner).toBe('bl');
    expect(settings.rotate).toBe(3);
    expect(settings.pause).toBe(5);
    expect(settings.size).toBe(200);
    expect(settings.hold).toBe(0);
    expect(settings.lines).toHaveLength(MAX_LINES);
  });

  it('builds a preview paired with its page', () => {
    const url = new URL(buildLowerThirdPreviewUrl(ORIGIN, SETTINGS, 'p1'));
    expect(url.searchParams.get('simulate')).toBe('1');
    expect(url.searchParams.get('preview')).toBe('p1');
  });
});

describe('parseLowerThirdCommand', () => {
  it.each([
    ['!lt', { action: 'show' }],
    ['!lt show', { action: 'show' }],
    ['!LT Hide', { action: 'hide' }],
    ['!lt clear', { action: 'clear' }],
    ['!lt Back in 5!', { action: 'say', text: 'Back in 5!' }],
    ['!ltx', null],
    ['lt hide', null],
  ])('%s', (text, command) => {
    expect(parseLowerThirdCommand(text)).toEqual(command);
  });

  it('cuts a long line', () => {
    const command = parseLowerThirdCommand(`!lt ${'x'.repeat(200)}`);
    expect(command?.action === 'say' && command.text.length).toBe(LINE_MAX_LENGTH);
  });
});

describe('timing', () => {
  it('keeps the bar up with no hold, and cycles it with one', () => {
    expect(phaseAt(999_999, 0, 60)).toEqual({ visible: true, shownFor: 999_999 });
    expect(phaseAt(5000, 10, 20).visible).toBe(true);
    expect(phaseAt(15_000, 10, 20).visible).toBe(false);
    expect(phaseAt(31_000, 10, 20)).toEqual({ visible: true, shownFor: 1000 });
  });

  it('turns to the next line every few seconds', () => {
    expect(lineIndexAt(0, 3, 5)).toBe(0);
    expect(lineIndexAt(5000, 3, 5)).toBe(1);
    expect(lineIndexAt(16_000, 3, 5)).toBe(0);
    expect(lineIndexAt(1000, 0, 5)).toBe(-1);
  });
});
