import { RAFFLE_FAQ, RaffleWidget } from "#/features/widgets/raffle/raffle-widget";
import { createFileRoute } from "@tanstack/react-router";
import { getFaqJsonLd, getLocaleLinks } from "#/lib/i18n/seo";
import { z } from "zod";

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z.enum(["twitch", "kick"]).optional(),
  lang: z.string().optional(),
});

export const Route = createFileRoute("/setup/raffle")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      {
        title:
          "Free Stream Giveaway & Chat Raffle Tool (No Login Required) — Twitch & Kick Raffle | Senchabot",
      },
      {
        name: "description",
        content:
          "100% Free chat giveaway and raffle tool for Twitch and Kick streamers. No login, sign-up, or account required. Custom keyword entry, sub-only filter, and live winner confetti overlay for OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, and more.",
      },
      {
        name: "keywords",
        content:
          "free twitch raffle tool, kick stream giveaway no login, chat raffle picker free, obs giveaway overlay, streamlabs raffle, xsplit giveaway, vmix contest tool, stream tools, random viewer picker no sign up, free stream contest tool, twitch giveaway tool, kick raffle picker, chat lottery free",
      },
      {
        property: "og:title",
        content:
          "Free Stream Giveaway & Chat Raffle Tool (No Login Required) — Twitch & Kick Raffle | Senchabot",
      },
      {
        property: "og:description",
        content:
          "Run chat-based raffles and giveaways on Twitch and Kick with zero login required. 100% Free with custom keyword entry and live confetti winner overlay for OBS Studio, Streamlabs Desktop, XSplit, or any browser source.",
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
        content:
          "Free Stream Giveaway & Chat Raffle Tool (No Login Required)",
      },
      {
        name: "twitter:description",
        content:
          "100% Free chat giveaway picker for Twitch and Kick. No account or login required. Live winner celebration overlay for OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, and more.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Raffle Picker - Free Stream Giveaway Tool",
          description:
            "A free chat-based raffle and giveaway system for Twitch and Kick streams with keyword entry, sub-only mode, and a live confetti winner overlay.",
          url: "https://extensions.senchabot.com/setup/raffle",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "All, OBS Studio, Streamlabs Desktop, XSplit Broadcaster, vMix, Lightstream, PRISM Live Studio, Twitch Studio, Meld Studio, Wirecast, Browser Source compatible",
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "100% Free, No Login Required",
          },
        },
      },
      { "script:ld+json": getFaqJsonLd(RAFFLE_FAQ) },
    ],
    links: getLocaleLinks("/setup/raffle"),
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
