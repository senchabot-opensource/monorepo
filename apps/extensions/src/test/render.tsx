import {
  createBrowserHistory,
  createRootRoute,
  createRouter,
  type RouterHistory,
  RouterProvider,
} from '@tanstack/react-router';
import { act, render } from '@testing-library/react';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach } from 'vitest';
import { LocaleProvider } from '#/lib/i18n';
import { ThemeProvider } from '#/lib/theme';
import { routeTree } from '#/routeTree.gen';

const histories: RouterHistory[] = [];

afterEach(() => {
  for (const history of histories.splice(0)) history.destroy();
});

// jsdom's own history, so window.location follows navigation like in the browser: pages read
// it for their origin, the overlay check and OBS Bridge's "Copy updated URL".
async function mount(routeTreeToRender: typeof routeTree, url: string, asDocument: boolean) {
  window.history.replaceState(null, '', url);
  const history = createBrowserHistory();
  histories.push(history);
  const router = createRouter({ routeTree: routeTreeToRender, history });
  await act(() => router.load());
  const result = render(
    <RouterProvider router={router} />,
    asDocument ? { container: document as unknown as HTMLElement, baseElement: document.body } : {},
  );
  // Flushes mount effects, e.g. the `mounted` flags that gate widget URLs.
  await act(async () => {});
  return { ...result, router };
}

/**
 * Renders the real app at `url`: the route tree, the root document with its head, and the
 * theme and locale providers. The root route renders <html>, so React owns `document` itself.
 */
export function renderRoute(url: string) {
  return mount(routeTree, url, true);
}

/** Renders one component inside the app's theme and locale providers, on a page at `url`. */
export function renderWithProviders(ui: ReactNode, url = '/') {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        <LocaleProvider>{ui}</LocaleProvider>
      </ThemeProvider>
    ),
  });
  return mount(rootRoute as unknown as typeof routeTree, url, false);
}

/**
 * userEvent.setup() without the pointer-events check: jsdom loads no stylesheet, so the check
 * can't catch anything, and walking computed styles on every click slows page tests down.
 */
export function setupUser(options: Parameters<typeof userEvent.setup>[0] = {}) {
  return userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never, ...options });
}
