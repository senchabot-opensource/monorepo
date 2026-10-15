import { RaffleOverlay } from "#/features/widgets/raffle/raffle-overlay";
import { readFont, readFx } from "#/lib/preset-url";
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
      <RaffleOverlay
        preset={params.get("preset")}
        fx={readFx(params).fx}
        font={readFont(params).font}
        demo={readFlag(params.get("demo"), false)}
      />
    </div>
  );
}
