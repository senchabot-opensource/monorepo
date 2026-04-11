import { SubSproutWidget } from "#/features/widgets/sub-sprout/sub-sprout-widget";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z.enum(["twitch", "kick"]).optional().default("twitch"),
});

export const Route = createFileRoute("/widgets/sub-sprout-widget")({
  validateSearch: search => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    platform: search.platform,
    channel: search.channel,
  }),
  loader: async ({ deps }) => {
    if (deps.platform === "kick" && deps.channel) {
      const { getKickChannelInfo } = await import("#/lib/kick");
      const kickInfo = await getKickChannelInfo(deps.channel);
      return {
        kickId: kickInfo.chatroomId,
        kickChannelId: kickInfo.channelId,
      };
    }
    return { kickId: null, kickChannelId: null };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { channel, platform } = Route.useSearch();
  const { kickId, kickChannelId } = Route.useLoaderData();

  return (
    <div className="size-full min-h-screen bg-transparent">
      <SubSproutWidget
        channel={channel ?? ""}
        platform={platform}
        kickId={kickId ?? undefined}
        kickChannelId={kickChannelId ?? undefined}
      />
    </div>
  );
}
