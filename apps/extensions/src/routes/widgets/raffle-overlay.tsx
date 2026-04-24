import { RaffleOverlay } from "#/features/widgets/raffle/raffle-overlay";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/widgets/raffle-overlay")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="size-full min-h-screen bg-transparent">
      <RaffleOverlay />
    </div>
  );
}
