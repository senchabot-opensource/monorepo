import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LOCALE_LABELS, LOCALES, type Locale, useI18n } from '#/lib/i18n';
import { useTheme } from '#/lib/theme';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('common.themeToggle')}
      title={t('common.themeToggle')}
      className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-700 shadow-sm backdrop-blur transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {isDark ? (
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <fieldset
      aria-label={t('common.languageToggle')}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white/80 p-0.5 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80"
    >
      {LOCALES.map((item: Locale) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          aria-pressed={locale === item}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            locale === item
              ? 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          {LOCALE_LABELS[item]}
        </button>
      ))}
    </fieldset>
  );
}

export function SettingsControls() {
  const [mounted, setMounted] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Overlays render inside OBS browser sources; no settings controls there.
  if (!mounted || pathname.startsWith('/widgets/')) return null;

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
