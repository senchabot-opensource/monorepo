import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { EmoteWall } from '#/features/widgets/emote-wall/emote-wall';
import { getKickChannelInfo } from '#/lib/kick';

const searchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  sevenTv: z.coerce.boolean().optional().default(true),
  mode: z.enum(['calm', 'chaos']).optional().default('calm'),
  subsOnly: z.coerce.boolean().optional().default(false),
  subDurationX2: z.coerce.boolean().optional().default(false),
  showAllEmotes: z.coerce.boolean().optional().default(false),
  size: z.coerce.number().min(32).max(256).optional().default(112),
  duration: z.coerce.number().min(2).max(15).optional().default(5),
  max: z.coerce.number().min(1).max(60).optional().default(25),
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
        emoteSize={search.size}
        durationSec={search.duration}
        maxEmotes={search.max}
        mock={Boolean(search.mock || (!search.twitch && !kick))}
      />
    </div>
  );
}
