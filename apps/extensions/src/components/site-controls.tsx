import { useLocation } from '@tanstack/react-router';
import type { MouseEvent } from 'react';
import { ExternalLink } from '#/components/external-link';
import { GithubIcon, MoonIcon, SunIcon } from '#/components/icons';
import { LANG_PARAM, LOCALE_LABELS, LOCALES, type Locale, useI18n } from '#/lib/i18n';
import { isAppPath, localizePath } from '#/lib/i18n/paths';
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
  const pathname = useLocation({ select: (location) => location.pathname });
  const searchStr = useLocation({ select: (location) => location.searchStr });

  // Real links, so crawlers and new tabs reach the other language; overlays and tools switch
  // through ?lang= since their URL never changes.
  const hrefFor = (target: Locale) => {
    if (!isAppPath(pathname)) return localizePath(`${pathname}${searchStr}`, target);
    const params = new URLSearchParams(searchStr);
    params.set(LANG_PARAM, target);
    return `${pathname}?${params.toString()}`;
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (target !== locale) setLocale(target);
  };

  return (
    <fieldset
      aria-label={t('common.languageToggle')}
      className="inline-flex shrink-0 items-center rounded-md border border-zinc-200 p-0.5 dark:border-zinc-800"
    >
      {LOCALES.map((item: Locale) => (
        <a
          key={item}
          href={hrefFor(item)}
          hrefLang={item}
          lang={item}
          onClick={(event) => handleClick(event, item)}
          aria-current={locale === item ? 'true' : undefined}
          className={`rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            locale === item
              ? 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          {LOCALE_LABELS[item]}
        </a>
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
