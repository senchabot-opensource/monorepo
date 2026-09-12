import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { RAFFLE_FAQ, RaffleWidget } from '#/features/widgets/raffle/raffle-widget';
import { getParamsLocale } from '#/lib/i18n/paths';
import { getSetupPageHead } from '#/lib/seo/pages';

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z.enum(['twitch', 'kick']).optional(),
  lang: z.string().optional(),
});

export const Route = createFileRoute('/{-$locale}/setup/raffle')({
  validateSearch: (search) => searchSchema.parse(search),
  head: ({ params }) =>
    getSetupPageHead('raffle', getParamsLocale(params), {
      breadcrumb: 'raffle.breadcrumb',
      faq: RAFFLE_FAQ,
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const { channel, platform } = Route.useSearch();

  return <RaffleWidget initialChannel={channel ?? ''} platform={platform ?? 'twitch'} />;
}
