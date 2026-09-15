import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute } from '#/test/render';

const pusher = vi.hoisted(() => {
  const handlers = new Map<string, (data: unknown) => void>();
  const channel = {
    bind: vi.fn((event: string, handler: (data: unknown) => void) => handlers.set(event, handler)),
    unbind_all: vi.fn(),
    unsubscribe: vi.fn(),
  };
  return { handlers, channel, subscribe: vi.fn(() => channel), disconnect: vi.fn() };
});
vi.mock('pusher-js', () => ({
  default: vi.fn(() => ({ subscribe: pusher.subscribe, disconnect: pusher.disconnect })),
}));

beforeEach(() => {
  pusher.handlers.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('/widgets/alerts', () => {
  it('shows an alert from its private channel', async () => {
    await renderRoute('/widgets/alerts?kick=streamer');
    expect(pusher.subscribe).toHaveBeenCalledWith('private-streamer');
    act(() => pusher.handlers.get('follow')?.({ name: 'Fan', platform: 'kick' }));
    expect(screen.getByText('Fan')).toBeTruthy();
  });

  it.each([
    'glow=1',
    'glow=yes',
    'pos=top',
    'pos=1&glow=0',
  ])('loads and connects with a mistyped %s instead of an error screen', async (query) => {
    await renderRoute(`/widgets/alerts?kick=streamer&${query}`);
    expect(document.body.textContent).not.toContain('Something went wrong');
    expect(pusher.subscribe).toHaveBeenLastCalledWith('private-streamer');
    act(() => pusher.handlers.get('sub')?.({ name: 'Subber', platform: 'kick' }));
    expect(screen.getByText('Subber')).toBeTruthy();
  });

  it('keeps reading glow and pos that are written right', async () => {
    const { container } = await renderRoute('/widgets/alerts?kick=streamer&glow=true&pos=center');
    act(() => pusher.handlers.get('follow')?.({ name: 'Fan', platform: 'kick' }));
    expect(container.querySelector('.items-center.justify-center')).not.toBeNull();
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it.each([
    ['glow=1', true],
    ['glow=yes', true],
    ['glow=0', false],
    ['glow=off', false],
  ])('reads %s the way the other overlays read a flag', async (query, on) => {
    const { container } = await renderRoute(`/widgets/alerts?kick=streamer&${query}`);
    act(() => pusher.handlers.get('follow')?.({ name: 'Fan', platform: 'kick' }));
    expect(container.querySelector('.animate-pulse') !== null).toBe(on);
  });

  it('draws no glow unless asked', async () => {
    const { container } = await renderRoute('/widgets/alerts?kick=streamer');
    act(() => pusher.handlers.get('follow')?.({ name: 'Fan', platform: 'kick' }));
    expect(container.querySelector('.animate-pulse')).toBeNull();
  });

  it('keeps a digits-only Kick channel as text', async () => {
    await renderRoute('/widgets/alerts?kick=123456');
    expect(pusher.subscribe).toHaveBeenLastCalledWith('private-123456');
  });
});
