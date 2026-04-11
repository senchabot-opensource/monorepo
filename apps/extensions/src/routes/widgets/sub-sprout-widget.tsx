import { SubSproutWidget } from "#/features/widgets/sub-sprout/sub-sprout-widget";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z.enum(["twitch", "kick"]).optional().default("twitch"),
});

export const Route = createFileRoute("/widgets/sub-sprout-widget")({
  validateSearch: search => searchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  const { channel, platform } = Route.useSearch();

  return (
    <div className="size-full min-h-screen bg-transparent">
      <SubSproutWidget channel={channel ?? ""} platform={platform} />
    </div>
  );
}
