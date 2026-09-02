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
import { tr } from './tr';

export const LOCALES = ['en', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', tr: 'TR' };
export const LANG_PARAM = 'lang';

const STORAGE_KEY = 'lang';
const DEFAULT_LOCALE: Locale = 'en';

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

export function isValidLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function localeFromUrl(): Locale | null {
  if (typeof window === 'undefined') return null;
  const param = new URLSearchParams(window.location.search).get(LANG_PARAM);
  return isValidLocale(param) ? param : null;
}

function localeFromStorage(): Locale | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isValidLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function readBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const candidates =
    window.navigator.languages ?? (window.navigator.language ? [window.navigator.language] : []);
  const prefersTurkish = candidates.some((tag) => tag?.toLowerCase().startsWith('tr'));
  return prefersTurkish ? 'tr' : DEFAULT_LOCALE;
}

// External store so the locale resolves synchronously after hydration
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

function applyLocaleSideEffects(next: Locale) {
  document.documentElement.lang = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
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
  const locale = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const router = useRouter();

  // React to ?lang= changes during client-side navigation (shared links etc.).
  const location = useLocation();
  const rawSearch: unknown = location.search;
  const langParam =
    typeof rawSearch === 'string'
      ? new URLSearchParams(rawSearch).get(LANG_PARAM)
      : rawSearch && typeof rawSearch === 'object' && LANG_PARAM in rawSearch
        ? String((rawSearch as Record<string, unknown>)[LANG_PARAM])
        : null;

  useEffect(() => {
    if (isValidLocale(langParam) && langParam !== currentLocale) {
      emitLocale(langParam);
      applyLocaleSideEffects(langParam);
    }
  }, [langParam]);

  const setLocale = useCallback(
    (next: Locale) => {
      emitLocale(next);
      applyLocaleSideEffects(next);
      // Keep the URL param in sync so links stay shareable and reloads stick.
      const url = new URL(window.location.href);
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
