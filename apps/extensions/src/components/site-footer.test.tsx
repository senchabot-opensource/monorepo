import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '#/lib/i18n';
import { SiteFooter } from './site-footer';

async function loadedRouter() {
  const rootRoute = createRootRoute({
    component: () => (
      <LocaleProvider>
        <SiteFooter />
      </LocaleProvider>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/faq'] }),
  });
  await router.load();
  return router;
}

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('SiteFooter', () => {
  // Pages are prerendered at build time, so the HTML a visitor gets can be from last year.
  it.each([
    ['the same year', '2026-12-30T12:00:00'],
    ['a later year', '2027-01-02T12:00:00'],
  ])('hydrates prerendered HTML without a mismatch in %s', async (_, visit) => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-12-15T12:00:00'));
    const container = document.createElement('div');
    container.innerHTML = renderToString(<RouterProvider router={await loadedRouter()} />);
    document.body.append(container);

    vi.setSystemTime(new Date(visit));
    const errors: unknown[] = [];
    const router = await loadedRouter();
    const root = await act(async () =>
      hydrateRoot(container, <RouterProvider router={router} />, {
        onRecoverableError: (error) => errors.push(error),
      }),
    );
    expect(errors).toEqual([]);
    expect(container.textContent).toContain('Senchabot');
    act(() => root.unmount());
  });
});
