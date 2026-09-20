import { RaffleOverlay } from "#/features/widgets/raffle/raffle-overlay";
import { readFlag } from "#/lib/url-params";
import { createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/widgets/raffle-overlay")({
  ssr: false,
  component: RouteComponent,
});

function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  return (
    <div className="size-full min-h-screen bg-transparent">
      <RaffleOverlay preset={params.get("preset")} demo={readFlag(params.get("demo"), false)} />
    </div>
  );
}
