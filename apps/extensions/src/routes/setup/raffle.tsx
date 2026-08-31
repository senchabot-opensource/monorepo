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
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Run a Free Stream Giveaway on Twitch and Kick",
          description:
            "Step-by-step instructions to run interactive viewer giveaways with chat keyword entry in OBS Studio, Streamlabs Desktop, XSplit, or any software supporting browser sources.",
          step: [
            {
              "@type": "HowToStep",
              name: "Set Channel & Entry Keyword",
              text: "Choose Twitch or Kick, enter your channel, and specify your giveaway keyword (e.g. !join).",
              position: 1,
            },
            {
              "@type": "HowToStep",
              name: "Start Giveaway & Collect Entries",
              text: "Click 'Start Raffle'. Viewers entering the keyword in chat are automatically added to the live entries list.",
              position: 2,
            },
            {
              "@type": "HowToStep",
              name: "Draw Random Winner & Celebrate",
              text: "Click 'Draw Winner' to randomly pick a winner with fireworks and confetti on your overlay.",
              position: 3,
            },
          ],
        },
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is this giveaway tool free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, this stream raffle tool is 100% free and open source with no hidden costs, limits, or account sign-ups.",
              },
            },
            {
              "@type": "Question",
              name: "Do viewers or streamers need to log in?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No login is needed. Streamers only provide their channel name, and viewers enter simply by chatting your keyword in Twitch or Kick chat.",
              },
            },
            {
              "@type": "Question",
              name: "Can I restrict the raffle to subscribers only?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, you can enable 'Subscribers Only' and set a minimum subscribed months filter to reward loyal community members.",
              },
            },
            {
              "@type": "Question",
              name: "How does the winner celebration overlay work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Add '/widgets/raffle-overlay' as a browser source in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources. When you draw a winner on the setup dashboard, the overlay immediately triggers a confetti celebration banner on stream.",
              },
            },
          ],
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
