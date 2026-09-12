import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { RAFFLE_FAQ, RaffleWidget } from '#/features/widgets/raffle/raffle-widget';
import { getFaqJsonLd } from '#/lib/i18n/seo';
import { getPageHead } from '#/lib/seo/head';
import { PAGE_META } from '#/lib/seo/pages';

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z.enum(['twitch', 'kick']).optional(),
  lang: z.string().optional(),
});

export const Route = createFileRoute('/setup/raffle')({
  validateSearch: (search) => searchSchema.parse(search),
  head: () =>
    getPageHead({
      path: '/setup/raffle',
      meta: PAGE_META.raffle,
      image: 'raffle',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Raffle Picker - Free Stream Giveaway Tool',
          description:
            'A free chat-based raffle and giveaway system for Twitch and Kick streams with keyword entry, sub-only mode, and a live confetti winner overlay.',
          url: 'https://extensions.senchabot.com/setup/raffle',
          applicationCategory: 'MultimediaApplication',
          operatingSystem:
            'All, OBS Studio, Streamlabs Desktop, XSplit Broadcaster, vMix, Lightstream, PRISM Live Studio, Twitch Studio, Meld Studio, Wirecast, Browser Source compatible',
          isAccessibleForFree: true,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: '100% Free, No Login Required',
          },
        },
        getFaqJsonLd(RAFFLE_FAQ),
      ],
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const { channel, platform } = Route.useSearch();

  return <RaffleWidget initialChannel={channel ?? ''} platform={platform ?? 'twitch'} />;
}
