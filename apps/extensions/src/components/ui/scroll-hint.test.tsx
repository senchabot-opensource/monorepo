import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '#/test/render';
import { ScrollHint } from './scroll-hint';

/** jsdom lays nothing out, so the box's scroll geometry is dictated here. */
function withScrollGeometry(clientHeight: number, scrollHeight: number) {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(clientHeight);
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(scrollHeight);
}

async function renderHint(url = '/') {
  await renderWithProviders(
    <ScrollHint scrollClassName="overflow-y-auto">
      <p>Settings</p>
    </ScrollHint>,
    url,
  );
  return screen.getByText('Settings').parentElement as HTMLElement;
}

const arrow = () => screen.queryByRole('button');

/** Replaces an observer stub with one that hands back its callback, to deliver by hand. */
function captureObserver(name: 'ResizeObserver' | 'IntersectionObserver') {
  const deliver: (() => void)[] = [];
  vi.stubGlobal(
    name,
    class {
      constructor(callback: () => void) {
        deliver.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
  return async () => {
    await act(async () => {
      for (const callback of deliver) callback();
    });
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ScrollHint', () => {
  it('shows nothing when the box holds all of its content', async () => {
    withScrollGeometry(400, 400);
    await renderHint();
    expect(arrow()).toBeNull();
  });

  it('points down while content is still below, in the page language', async () => {
    withScrollGeometry(400, 900);
    await renderHint('/tr');
    expect(arrow()?.getAttribute('aria-label')).toBe('Devamı için aşağı kaydır');
  });

  it('turns around once the box is scrolled to the end', async () => {
    withScrollGeometry(400, 900);
    const box = await renderHint();
    expect(arrow()?.getAttribute('aria-label')).toBe('Scroll down for more');

    vi.spyOn(HTMLElement.prototype, 'scrollTop', 'get').mockReturnValue(500);
    await act(async () => {
      box.dispatchEvent(new Event('scroll'));
    });
    expect(arrow()?.getAttribute('aria-label')).toBe('Back to top');
  });

  it('jumps to the far end of the box when pressed', async () => {
    withScrollGeometry(400, 900);
    const box = await renderHint();
    const scrollTo = vi.fn();
    box.scrollTo = scrollTo;

    await userEvent.setup().click(arrow() as HTMLElement);
    expect(scrollTo).toHaveBeenCalledWith({ top: 900, behavior: 'smooth' });
  });

  // A box inside a closed dropdown or dialog mounts at display:none and measures as empty. It is
  // the browser's notification on the way back into view that has to bring the arrow with it.
  it.each([
    ['a resize', 'ResizeObserver' as const],
    ['coming into view', 'IntersectionObserver' as const],
  ])('measures again on %s, for a box that mounted while hidden', async (_, observer) => {
    const notify = captureObserver(observer);
    withScrollGeometry(0, 0);
    await renderHint();
    expect(arrow()).toBeNull();

    vi.restoreAllMocks();
    withScrollGeometry(400, 900);
    await notify();
    expect(arrow()?.getAttribute('aria-label')).toBe('Scroll down for more');
  });
});
