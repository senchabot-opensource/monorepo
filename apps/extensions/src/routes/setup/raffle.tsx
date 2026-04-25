import { RaffleWidget } from "#/features/widgets/raffle/raffle-widget";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z.enum(["twitch", "kick"]).optional(),
});

export const Route = createFileRoute("/setup/raffle")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Raffle Widget & Tool Setup — Senchabot Extensions" },
      {
        name: "description",
        content:
          "Configure and run chat-based raffles for your Twitch or Kick stream with this free widget and tool. Set entry keywords, sub-only mode, and pick winners with a live overlay.",
      },
      {
        property: "og:title",
        content: "Raffle Widget & Tool Setup — Senchabot Extensions",
      },
      {
        property: "og:description",
        content:
          "Run chat-based raffles for Twitch or Kick with this free widget and tool. Includes a live winner overlay.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://extensions.senchabot.com/setup/raffle",
      },
      {
        property: "og:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Raffle Widget & Tool Setup — Senchabot Extensions",
      },
      {
        name: "twitter:description",
        content:
          "Run chat-based raffles for Twitch or Kick with this free widget and tool. Includes a live winner overlay.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Raffle Widget & Tool",
          description:
            "A chat-based raffle system for Twitch and Kick streams with live winner overlay.",
          url: "https://extensions.senchabot.com/setup/raffle",
          applicationCategory: "StreamingWidget",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://extensions.senchabot.com/setup/raffle",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { channel, platform } = Route.useSearch();

  return (
    <RaffleWidget
      initialChannel={channel ?? ""}
      platform={platform ?? "twitch"}
    />
  );
}
