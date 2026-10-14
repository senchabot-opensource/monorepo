import { Link } from '@tanstack/react-router';
import type { ComponentPropsWithoutRef } from 'react';
import { useI18n } from '#/lib/i18n';
import { localizePath, type SitePath } from '#/lib/i18n/paths';

type LocaleLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  to: SitePath;
  /** A section of the page to open on, without the #. */
  hash?: string;
};

/** A Link to a site page in the language of the current one: `/faq` becomes `/tr/faq` in Turkish. */
export function LocaleLink({ to, ...props }: LocaleLinkProps) {
  const { locale } = useI18n();
  return <Link {...props} to={localizePath(to, locale)} />;
}
