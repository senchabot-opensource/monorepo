import { ExternalLink } from '#/components/external-link';
import { LocaleLink } from '#/components/locale-link';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '#/components/ui/button-styles';
import type { SitePath } from '#/lib/i18n/paths';

export type CtaAction = { label: string; variant?: 'primary' | 'secondary' } & (
  | { to: SitePath; href?: never }
  /** Plain or external URL; external ones open in a new tab. */
  | { href: string; external?: boolean; to?: never }
);

interface CtaBandProps {
  title: string;
  text?: string;
  /** One or two actions; the first defaults to primary, the second to secondary. */
  actions: readonly [CtaAction] | readonly [CtaAction, CtaAction];
  headingLevel?: 'h2' | 'h3';
}

/** Closing call-to-action strip: heading, one line, one or two buttons. */
export function CtaBand({ title, text, actions, headingLevel = 'h2' }: CtaBandProps) {
  const Heading = headingLevel;
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-gradient-to-br from-green-500/10 via-white to-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-zinc-800 dark:from-green-500/10 dark:via-zinc-900 dark:to-zinc-900">
      <div className="max-w-xl">
        <Heading className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </Heading>
        {text && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        {actions.map((action, index) => {
          const variant = action.variant ?? (index === 0 ? 'primary' : 'secondary');
          const className = variant === 'primary' ? BUTTON_PRIMARY : BUTTON_SECONDARY;
          if (action.to) {
            return (
              <LocaleLink key={action.label} to={action.to} className={className}>
                {action.label}
              </LocaleLink>
            );
          }
          return action.external ? (
            <ExternalLink key={action.label} href={action.href} className={className}>
              {action.label}
            </ExternalLink>
          ) : (
            <a key={action.label} href={action.href} className={className}>
              {action.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
