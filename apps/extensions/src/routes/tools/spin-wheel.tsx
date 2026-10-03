import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { SiteHeader } from '#/components/site-header';
import { SpinWheelAdvancedPromo } from '#/features/widgets/spin-wheel/spin-wheel-promo';
import { SpinWheelTool } from '#/features/widgets/spin-wheel/spin-wheel-tool';
import { useSpinWheel } from '#/features/widgets/spin-wheel/use-spin-wheel';
import { useI18n } from '#/lib/i18n';

const searchSchema = z.object({
  lang: z.string().optional(),
});

export const Route = createFileRoute('/tools/spin-wheel')({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  component: SpinWheelToolPage,
});

function SpinWheelToolPage() {
  const { t } = useI18n();
  const wheel = useSpinWheel();

  // The header only belongs on the real page, not when another page frames the tool.
  const embedded = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {!embedded && (
        <SiteHeader variant="tool" title={t('spinWheel.toolTitle')} widgetId="spin-wheel" />
      )}
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-4xl flex-1 space-y-4 px-4 pt-2 pb-8 focus:outline-none"
      >
        <SpinWheelAdvancedPromo />
        <p
          role="note"
          className="rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
        >
          {t('spinWheel.toolLocalNote')}
        </p>
        <SpinWheelTool wheel={wheel} />
      </main>
    </div>
  );
}
