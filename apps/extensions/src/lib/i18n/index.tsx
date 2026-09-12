import { useLocation, useRouter } from '@tanstack/react-router';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { en } from './en';
import {
  DEFAULT_LOCALE,
  isValidLocale,
  LANG_PARAM,
  LANG_STORAGE_KEY,
  type Locale,
  pickBrowserLocale,
} from './locales';
import { getPathLocale, isAppPath, localizePath } from './paths';
import { tr } from './tr';

export { isValidLocale, LANG_PARAM, LOCALE_LABELS, LOCALES, type Locale } from './locales';

const dictionaries: Record<Locale, typeof en> = { en, tr };

type Dictionary = typeof en;

type PathsOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? `${K}.${PathsOf<T[K]>}` : K;
    }[keyof T & string]
  : never;

export type TranslationKey = PathsOf<Dictionary>;

export function resolveKey(dict: Dictionary, key: string): string | undefined {
  let current: unknown = dict;
  for (const part of key.split('.')) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const raw =
    resolveKey(dictionaries[locale], key) ?? resolveKey(dictionaries[DEFAULT_LOCALE], key) ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

function localeFromUrl(): Locale | null {
  if (typeof window === 'undefined') return null;
  const param = new URLSearchParams(window.location.search).get(LANG_PARAM);
  return isValidLocale(param) ? param : null;
}

function localeFromStorage(): Locale | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return isValidLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function readBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const { languages, language } = window.navigator;
  return pickBrowserLocale(languages?.length ? languages : [language ?? '']);
}

// Overlays and tools only. External store so the locale resolves synchronously after hydration
// (before first paint) without SSR/hydration mismatches.
let currentLocale: Locale = DEFAULT_LOCALE;
let initialized = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): Locale {
  // Priority: ?lang= URL param > saved choice (localStorage) > browser language.
  if (!initialized) {
    initialized = true;
    currentLocale = localeFromUrl() ?? localeFromStorage() ?? readBrowserLocale();
  }
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function emitLocale(next: Locale) {
  currentLocale = next;
  for (const listener of listeners) listener();
}

function saveLocale(next: Locale) {
  // Setup-page previews are same-origin iframes with ?lang=; they must not overwrite the
  // visitor's own choice, which decides the language the site opens in.
  if (window.self !== window.top) return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    // localStorage unavailable
  }
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const location = useLocation();
  const isApp = isAppPath(location.pathname);
  const appLocale = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  // Site pages take the language from the path, so the server renders it and every URL has one
  // language. Overlays and tools keep ?lang=, then the saved choice, then the browser language.
  const locale = isApp ? appLocale : getPathLocale(location.pathname);

  // React to ?lang= changes during client-side navigation (shared links etc.).
  const rawSearch: unknown = location.search;
  const langParam =
    typeof rawSearch === 'string'
      ? new URLSearchParams(rawSearch).get(LANG_PARAM)
      : rawSearch && typeof rawSearch === 'object' && LANG_PARAM in rawSearch
        ? String((rawSearch as Record<string, unknown>)[LANG_PARAM])
        : null;

  useEffect(() => {
    if (isApp && isValidLocale(langParam) && langParam !== currentLocale) {
      emitLocale(langParam);
      saveLocale(langParam);
    }
  }, [isApp, langParam]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      emitLocale(next);
      saveLocale(next);
      const url = new URL(window.location.href);
      if (!isAppPath(url.pathname)) {
        router.navigate({ href: localizePath(`${url.pathname}${url.search}${url.hash}`, next) });
        return;
      }
      // Keep the URL param in sync so links stay shareable and reloads stick.
      url.searchParams.set(LANG_PARAM, next);
      router.history.replace(`${url.pathname}${url.search}`);
    },
    [router],
  );

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useI18n must be used within a LocaleProvider');
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
