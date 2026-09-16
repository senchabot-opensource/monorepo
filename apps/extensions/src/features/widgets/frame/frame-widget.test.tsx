import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BUILTIN_PRESETS } from '#/features/presets/builtin-presets';
import { FRAMES } from '#/features/presets/preset-schema';
import { DEFAULT_FRAME_SETTINGS, FRAME_PIECES } from '#/lib/frame-url';
import { FrameWidget } from './frame-widget';

// One built-in preset per frame kind, plus classic.
const PRESETS = [
  'classic',
  ...FRAMES.map((kind) => BUILTIN_PRESETS.find((preset) => preset.frame === kind)?.id ?? kind),
];

describe('FrameWidget', () => {
  it.each(PRESETS)('draws every piece in %s', (preset) => {
    for (const piece of FRAME_PIECES) {
      const { unmount } = render(
        <FrameWidget settings={{ ...DEFAULT_FRAME_SETTINGS, preset, piece, label: 'Emircan' }} />,
      );
      const art = screen.getByTestId('frame-art');
      expect(art.dataset.piece).toBe(piece);
      expect(art.querySelectorAll('path, rect').length, `${preset} ${piece}`).toBeGreaterThan(4);
      expect(art.textContent).toBe('Emircan');
      unmount();
    }
  });

  it('keeps gradient ids apart when several frames share a page', () => {
    render(<FrameWidget settings={{ ...DEFAULT_FRAME_SETTINGS, preset: 'dynasty' }} demo scene />);
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    expect(screen.getAllByTestId('frame-art')).toHaveLength(3);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('stills every animation when motion is off', () => {
    const { unmount } = render(<FrameWidget settings={DEFAULT_FRAME_SETTINGS} />);
    expect(screen.getByTestId('frame-art').classList.contains('fr-still')).toBe(false);
    unmount();
    render(<FrameWidget settings={{ ...DEFAULT_FRAME_SETTINGS, motion: false }} />);
    expect(screen.getByTestId('frame-art').classList.contains('fr-still')).toBe(true);
  });

  it('leaves the label off without one and marks the preset', () => {
    render(<FrameWidget settings={{ ...DEFAULT_FRAME_SETTINGS, preset: 'rift' }} />);
    expect(screen.getByTestId('frame-art').textContent).toBe('');
    expect(screen.getByTestId('frame').dataset.preset).toBe('rift');
  });
});
