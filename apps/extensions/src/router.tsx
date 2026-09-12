import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { parseSearch, stringifySearch } from './lib/search-params'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    parseSearch,
    stringifySearch,

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
