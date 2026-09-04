import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { EmoteWall } from '#/features/widgets/emote-wall/emote-wall';
import { getKickChannelInfo } from '#/lib/kick';

/**
 * Numeric widget params never throw on out-of-range input: garbage falls
 * back to the default and anything else is clamped into range. A mistyped
 * URL must degrade gracefully, never white-screen.
 */
const clampedNumber = (min: number, max: number, fallback: number) =>
  z.coerce
    .number()
    .catch(fallback)
    .transform((v) =>
      Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback,
    );

const searchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  sevenTv: z.coerce.boolean().optional().default(true),
  mode: z.enum(['calm', 'chaos', 'bounce']).catch('calm'),
  subsOnly: z.coerce.boolean().optional().default(false),
  subDurationX2: z.coerce.boolean().optional().default(false),
  showAllEmotes: z.coerce.boolean().optional().default(false),
  hypeMode: z.coerce.boolean().optional().default(false),
  spamBlock: z.coerce.boolean().optional().default(true),
  size: clampedNumber(32, 256, 112),
  duration: clampedNumber(2, 30, 5),
  max: clampedNumber(1, 120, 25),
  mock: z.coerce.boolean().optional(),
});

export const Route = createFileRoute('/widgets/emote-wall')({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    kick: search.kick,
  }),
  loader: async ({ deps }) => {
    if (!deps.kick) {
      return { kick: null };
    }
    const info = await getKickChannelInfo(deps.kick);
    return { kick: info.chatroomId };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const { kick } = Route.useLoaderData();

  return (
    <div className="size-full min-h-screen bg-transparent">
      <EmoteWall
        twitchChannel={search.twitch}
        kickChatroomId={kick}
        sevenTvEnabled={search.sevenTv !== false}
        mode={search.mode}
        subsOnly={search.subsOnly}
        subDurationX2={search.subDurationX2}
        showAllEmotes={search.showAllEmotes}
        hypeMode={search.hypeMode}
        spamBlock={search.spamBlock}
        emoteSize={search.size}
        durationSec={search.duration}
        maxEmotes={search.max}
        mock={Boolean(search.mock || (!search.twitch && !kick))}
      />
    </div>
  );
}
