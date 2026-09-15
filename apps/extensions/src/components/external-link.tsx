import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useT } from '#/lib/i18n';

interface ExternalLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> {
  href: string;
  children: ReactNode;
}

/** Opens in a new tab and tells screen reader users so. */
export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  const t = useT();
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> {t('common.newTab')}</span>
    </a>
  );
}
