import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DISPLAY_DURATION } from '#/lib/alert-config';
import { renderWithProviders } from '#/test/render';
import { AlertCard } from './alert-card';

afterEach(() => {
  vi.useRealTimers();
});

describe('AlertCard', () => {
  it('fades out before the queue removes it', async () => {
    vi.useFakeTimers();
    const { container } = await renderWithProviders(
      <AlertCard
        alert={{ id: '1', type: 'follow', data: { name: 'Fan', platform: 'kick' }, timestamp: '' }}
      />,
    );
    const card = () => container.querySelector('.backdrop-blur-md') as HTMLElement;
    act(() => vi.advanceTimersByTime(1000));
    expect(card().className).not.toContain('opacity-0');
    // The queue unmounts the card at DISPLAY_DURATION; its 300 ms fade-out must start before.
    act(() => vi.advanceTimersByTime(DISPLAY_DURATION - 1000 - 250));
    expect(card().className).toContain('opacity-0');
  });
});
