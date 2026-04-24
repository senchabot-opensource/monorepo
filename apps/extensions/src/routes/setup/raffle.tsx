import { RaffleWidget } from "#/features/widgets/raffle/raffle-widget";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z.enum(["twitch", "kick"]).optional().default("twitch"),
});

export const Route = createFileRoute("/setup/raffle")({
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  const { channel, platform } = Route.useSearch();

  return (
    <div className="size-full min-h-screen bg-neutral-900">
      <RaffleWidget
        initialChannel={channel ?? ""}
        platform={platform}
      />
    </div>
  );
}
