import { useLocation } from '@tanstack/react-router';
import type { MouseEvent } from 'react';
import { ExternalLink } from '#/components/external-link';
import { GithubIcon, GlobeIcon, MoonIcon, SunIcon } from '#/components/icons';
import { DROPDOWN_ITEM_CLASS, DropdownMenu } from '#/components/ui/dropdown-menu';
import { LANG_PARAM, LOCALE_LABELS, LOCALE_NAMES, LOCALES, type Locale, useI18n } from '#/lib/i18n';
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
  // through ?lang= since their URL never changes. Site hrefs leave out the query: prerendered
  // HTML never has one, so it would differ at hydration. A click still carries it over.
  const hrefFor = (target: Locale) => {
    if (!isAppPath(pathname)) return localizePath(pathname, target);
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
    <DropdownMenu
      label={
        <>
          <GlobeIcon className="size-4" />
          {LOCALE_LABELS[locale]}
        </>
      }
      ariaLabel={`${LOCALE_LABELS[locale]}, ${t('common.languageToggle')}`}
      triggerTitle={t('common.languageToggle')}
      triggerClassName="inline-flex h-9 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 aria-expanded:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white dark:aria-expanded:bg-zinc-800"
      align="end"
      panelClassName="w-44 p-1.5"
    >
      {LOCALES.map((item: Locale) => (
        <a
          key={item}
          href={hrefFor(item)}
          hrefLang={item}
          lang={item}
          onClick={(event) => handleClick(event, item)}
          aria-current={locale === item ? 'page' : undefined}
          className={DROPDOWN_ITEM_CLASS}
        >
          {LOCALE_NAMES[item]}
        </a>
      ))}
    </DropdownMenu>
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
