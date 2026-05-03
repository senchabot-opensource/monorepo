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
      { title: "Raffle Widget Setup — Free Chat Giveaway & Raffle Tool for Twitch & Kick — Senchabot Extensions" },
      {
        name: "description",
        content:
          "Set up and run free chat-based raffles and giveaways for your Twitch or Kick stream. Configure entry keywords, sub-only mode, and pick random winners with a live confetti celebration overlay. Browser source ready for OBS, Streamlabs, and XSplit.",
      },
      {
        name: "keywords",
        content:
          "twitch raffle, kick raffle, chat raffle widget, stream giveaway tool, lucky draw overlay, subscriber raffle, viewer picker, random winner picker, streaming raffle, browser source raffle, OBS raffle widget, chat lottery, twitch giveaway, kick giveaway, free raffle tool, stream contest, entry keyword raffle, confetti winner overlay, chat giveaway, live raffle",
      },
      {
        property: "og:title",
        content: "Raffle Widget Setup — Free Chat Giveaway & Raffle Tool for Twitch & Kick — Senchabot Extensions",
      },
      {
        property: "og:description",
        content:
          "Run chat-based raffles and giveaways for Twitch or Kick with this free widget and tool. Includes keyword entry, sub-only mode, and a live confetti winner overlay.",
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
        content: "Raffle Widget Setup — Free Chat Giveaway & Raffle Tool — Senchabot Extensions",
      },
      {
        name: "twitter:description",
        content: "Run chat-based raffles and giveaways for Twitch or Kick with this free widget. Keyword entry, sub-only mode, and a live confetti winner overlay.",
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
            "A free chat-based raffle and giveaway system for Twitch and Kick streams with keyword entry, sub-only mode, and a live confetti winner overlay.",
          url: "https://extensions.senchabot.com/setup/raffle",
          applicationCategory: "StreamingWidget",
          operatingSystem: "All",
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
