import type { FileRouteTypes } from '#/routeTree.gen';
import { DEFAULT_LOCALE, isValidLocale, type Locale } from './locales';

type WithoutLocale<T> = T extends `/{-$locale}${infer Rest}`
  ? Rest extends ''
    ? '/'
    : Rest
  : never;

/** A page that exists in every language, by its English path, e.g. `/setup/raffle`. */
export type SitePath = WithoutLocale<FileRouteTypes['to']>;

/**
 * Overlays and tools get pasted into OBS, so they keep one URL in every language and read it
 * from `?lang=` instead of the path.
 */
export const isAppPath = (pathname: string) =>
  pathname.startsWith('/widgets/') || pathname.startsWith('/tools/');

/** The language a site path is in: `tr` for `/tr` and `/tr/...`, English otherwise. */
export function getPathLocale(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return isValidLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/** The locale a `{-$locale}` route matched; the route only matches known prefixes. */
export const getParamsLocale = ({ locale }: { locale?: string }): Locale =>
  isValidLocale(locale) ? locale : DEFAULT_LOCALE;

/** The English version of a site path: `/tr/faq` → `/faq`, `/tr` → `/`. */
export function stripLocale(pathname: string): string {
  const locale = getPathLocale(pathname);
  return locale === DEFAULT_LOCALE ? pathname : pathname.slice(locale.length + 1) || '/';
}

/**
 * A site path in `locale`, keeping its query and hash: `/faq` → `/tr/faq`. Already localized
 * paths switch language; overlays, tools, anchors and external URLs come back unchanged.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//') || isAppPath(path)) return path;
  const end = path.search(/[?#]/);
  const pathname = end === -1 ? path : path.slice(0, end);
  const rest = end === -1 ? '' : path.slice(end);
  const base = stripLocale(pathname);
  if (locale === DEFAULT_LOCALE) return `${base}${rest}`;
  return `/${locale}${base === '/' ? '' : base}${rest}`;
}
