import { ExternalIcon } from '#/components/icons';
import { useI18n } from '#/lib/i18n';
import { LINKS } from '#/lib/links';

export const DASHBOARD_WHEEL_URL = LINKS.dashboardWheel;

/** Cross-links the advanced Twitch/Kick channel-points wheel on the Senchabot dashboard. */
export function SpinWheelAdvancedPromo({ className = '' }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div
      role="note"
      className={`rounded-xl border border-green-600/20 bg-green-50 p-4 dark:border-green-500/25 dark:bg-green-500/10 ${className}`}
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
        {t('spinWheel.advancedTitle')}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {t('spinWheel.advancedText')}
      </p>
      <a
        href={DASHBOARD_WHEEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex h-9 items-center gap-2 rounded-md bg-green-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
      >
        {t('spinWheel.advancedCta')}
        <ExternalIcon className="size-4 opacity-80" />
        <span className="sr-only"> {t('common.newTab')}</span>
      </a>
    </div>
  );
}
