import { fireEvent, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { withLayout } from '#/test/browser';
import { renderWithProviders, setupUser } from '#/test/render';
import { type CanvasPoint, CORNER_FOCUS, PreviewFrame, type PreviewZoom } from './preview-frame';

const CANVAS = { width: 1920, height: 1080 };
const frame = () => screen.getByTitle('Overlay preview') as HTMLIFrameElement;
const preview = (zoomFocus?: CanvasPoint, zoomStart?: PreviewZoom) => (
  <PreviewFrame
    src="/widgets/weather?demo=1"
    title="Overlay preview"
    canvas={CANVAS}
    zoomFocus={zoomFocus}
    zoomStart={zoomStart}
  />
);

// A setup page in miniature: its corner setting moves the widget, and the zoom follows.
function CornerPicker() {
  const [corner, setCorner] = useState<keyof typeof CORNER_FOCUS>('tl');
  return (
    <>
      <button type="button" onClick={() => setCorner('br')}>
        Bottom right
      </button>
      {preview(CORNER_FOCUS[corner])}
    </>
  );
}

afterEach(() => vi.restoreAllMocks());

describe('PreviewFrame zoom', () => {
  it('offers no zoom unless asked, and draws the preview as before', async () => {
    withLayout(960, 540);
    renderWithProviders(preview());
    await screen.findByTitle('Overlay preview');
    expect(frame().style.transform).toBe('translate(-50%, -50%) scale(0.5)');
    expect(screen.queryByRole('radio')).toBeNull();
    expect(screen.queryByTestId('preview-pan')).toBeNull();
  });

  it('zooms in on the corner it is given, without showing past the canvas edges', async () => {
    withLayout(960, 540);
    const user = setupUser();
    renderWithProviders(preview(CORNER_FOCUS.tl));
    await screen.findByTitle('Overlay preview');
    expect(frame().style.transform).toBe('translate(-50%, -50%) scale(0.5)');
    expect(screen.getByRole('group', { name: 'Preview zoom' })).toBeTruthy();

    // 2× the fit: a quarter of the canvas fills the frame, the top-left quarter.
    await user.click(screen.getByRole('radio', { name: '2×' }));
    expect(frame().style.transform).toBe('translate(-50%, -50%) translate(480px, 270px) scale(1)');

    await user.click(screen.getByRole('radio', { name: '3×' }));
    expect(frame().style.transform).toBe(
      'translate(-50%, -50%) translate(960px, 540px) scale(1.5)',
    );

    await user.click(screen.getByRole('radio', { name: '1×' }));
    expect(frame().style.transform).toBe('translate(-50%, -50%) scale(0.5)');
    expect(screen.queryByTestId('preview-pan')).toBeNull();
  });

  it('opens at the zoom it is given', async () => {
    withLayout(960, 540);
    renderWithProviders(preview(CORNER_FOCUS.tr, 3));
    await screen.findByTitle('Overlay preview');
    expect((screen.getByRole('radio', { name: '3×' }) as HTMLInputElement).checked).toBe(true);
    expect(frame().style.transform).toBe(
      'translate(-50%, -50%) translate(-960px, 540px) scale(1.5)',
    );
    expect(screen.getByTestId('preview-pan')).toBeTruthy();
  });

  it('pans with a drag, up to the canvas edges', async () => {
    withLayout(960, 540);
    const user = setupUser();
    renderWithProviders(preview(CORNER_FOCUS.tl));
    await screen.findByTitle('Overlay preview');
    await user.click(screen.getByRole('radio', { name: '2×' }));
    const pan = screen.getByTestId('preview-pan');

    fireEvent.pointerDown(pan, { pointerId: 1, clientX: 300, clientY: 300 });
    fireEvent.pointerMove(pan, { pointerId: 1, clientX: 240, clientY: 270 });
    expect(frame().style.transform).toBe('translate(-50%, -50%) translate(420px, 240px) scale(1)');

    // Dragging the canvas further right only brings its left edge back to the frame's.
    fireEvent.pointerMove(pan, { pointerId: 1, clientX: 900, clientY: 900 });
    expect(frame().style.transform).toBe('translate(-50%, -50%) translate(480px, 270px) scale(1)');
    fireEvent.pointerUp(pan, { pointerId: 1 });
    fireEvent.pointerMove(pan, { pointerId: 1, clientX: 0, clientY: 0 });
    expect(frame().style.transform).toBe('translate(-50%, -50%) translate(480px, 270px) scale(1)');
  });

  it('moves to the new corner when the widget moves', async () => {
    withLayout(960, 540);
    const user = setupUser();
    renderWithProviders(<CornerPicker />);
    await screen.findByTitle('Overlay preview');
    await user.click(screen.getByRole('radio', { name: '2×' }));
    // Panned away first: a new corner still wins over the drag.
    const pan = screen.getByTestId('preview-pan');
    fireEvent.pointerDown(pan, { pointerId: 1, clientX: 300, clientY: 300 });
    fireEvent.pointerMove(pan, { pointerId: 1, clientX: 200, clientY: 200 });
    fireEvent.pointerUp(pan, { pointerId: 1 });
    await user.click(screen.getByRole('button', { name: 'Bottom right' }));
    expect(frame().style.transform).toBe(
      'translate(-50%, -50%) translate(-480px, -270px) scale(1)',
    );
  });
});
