const BUTTON_BASE =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950';

/** Green call-to-action button look, for links and buttons alike. */
export const BUTTON_PRIMARY = `${BUTTON_BASE} bg-green-600 text-white hover:bg-green-700`;

/** Neutral outlined button look. */
export const BUTTON_SECONDARY = `${BUTTON_BASE} border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800`;
