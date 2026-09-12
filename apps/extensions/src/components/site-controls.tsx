import { ExternalLink } from '#/components/external-link';
import { GithubIcon, MoonIcon, SunIcon } from '#/components/icons';
import { LOCALE_LABELS, LOCALES, type Locale, useI18n } from '#/lib/i18n';
import { LINKS } from '#/lib/links';
import { useTheme } from '#/lib/theme';

export const ICON_BUTTON_CLASS =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white';

export function ThemeToggle() {
  const { toggleTheme } = useTheme();
  const { t } = useI18n();

  // The icon follows the `.dark` class the inline boot script sets, so it is right on first
  // paint even though the theme state only syncs from storage after hydration.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('common.themeToggle')}
      title={t('common.themeToggle')}
      className={ICON_BUTTON_CLASS}
    >
      <SunIcon className="hidden size-[18px] dark:block" />
      <MoonIcon className="size-[18px] dark:hidden" />
    </button>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <fieldset
      aria-label={t('common.languageToggle')}
      className="inline-flex shrink-0 items-center rounded-md border border-zinc-200 p-0.5 dark:border-zinc-800"
    >
      {LOCALES.map((item: Locale) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          aria-pressed={locale === item}
          className={`rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
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

export function GithubLink({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  return (
    <ExternalLink
      href={LINKS.source}
      title={t('common.nav.github')}
      className={`${ICON_BUTTON_CLASS} ${className}`}
    >
      <GithubIcon className="size-[18px]" />
      <span className="sr-only">{t('common.nav.github')}</span>
    </ExternalLink>
  );
}

/** GitHub, language and theme: the right side of both header variants. */
export function SiteControls({ showGithub = true }: { showGithub?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {showGithub && <GithubLink className="max-sm:hidden" />}
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
