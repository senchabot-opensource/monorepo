import { Breadcrumb } from "#/components/breadcrumb";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Senchabot Extensions — Free Streaming Widgets for Twitch & Kick",
      },
      {
        name: "description",
        content:
          "Free, open-source streaming widgets for Twitch and Kick. Set up Sub Sprout, Universal Chat, and Raffle overlays for OBS in seconds.",
      },
      {
        property: "og:title",
        content:
          "Senchabot Extensions — Free Streaming Widgets for Twitch & Kick",
      },
      {
        property: "og:description",
        content:
          "Free, open-source streaming widgets for Twitch and Kick. Set up Sub Sprout, Universal Chat, and Raffle overlays for OBS in seconds.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://extensions.senchabot.com",
      },
      {
        property: "og:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content:
          "Senchabot Extensions — Free Streaming Widgets for Twitch & Kick",
      },
      {
        name: "twitter:description",
        content:
          "Free, open-source streaming widgets for Twitch and Kick.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Senchabot Extensions",
          description:
            "Free, open-source streaming widgets for Twitch and Kick streamers.",
          url: "https://extensions.senchabot.com",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://extensions.senchabot.com/setup/{search_term_string}",
            "query-input": "required name=search_term_string",
          },
        },
      },
    ],
    links: [
      { rel: "canonical", href: "https://extensions.senchabot.com" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="flex items-center justify-center py-10">
        <a
          className="relative inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-white transition-opacity hover:opacity-75 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          href="https://senchabot.com"
          target="_blank"
          rel="noreferrer">
          <div className="inline-flex size-10 shrink-0">
            <img
              src="/senchabot-logo.svg"
              alt="Senchabot"
              width={40}
              height={40}
            />
          </div>
          <span>Senchabot</span>
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Senchabot Extensions
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Free, open-source streaming widgets for{" "}
            <strong className="text-zinc-200">Twitch</strong> and{" "}
            <strong className="text-zinc-200">Kick</strong>. Configure and
            embed overlays into OBS in seconds. No account required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/setup/sub-growing-plant"
            className="group block rounded-xl bg-zinc-900 p-6 border border-zinc-800 shadow-xl transition-all hover:border-green-500/50 hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-400 text-2xl">
              🌱
            </div>
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              Sub Sprout
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              A growing plant that gets bigger with every new subscription.
              Perfect for visualizing your community's support on stream.
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-green-500 group-hover:underline">
              Configure
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>

          <Link
            to="/setup/chat-widget"
            className="group block rounded-xl bg-zinc-900 p-6 border border-zinc-800 shadow-xl transition-all hover:border-green-500/50 hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-400 text-2xl">
              💬
            </div>
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              Universal Chat
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Merge Twitch and Kick chat into a single, cohesive overlay.
              Supports emotes, badges, and customizable styling.
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-green-500 group-hover:underline">
              Configure
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>

          <Link
            to="/setup/raffle"
            className="group block rounded-xl bg-zinc-900 p-6 border border-zinc-800 shadow-xl transition-all hover:border-green-500/50 hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-400 text-2xl">
              🎉
            </div>
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              Raffle
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Run chat-based raffles with keyword entry, sub-only mode, and a
              live winner overlay with confetti celebration.
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-green-500 group-hover:underline">
              Configure
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500">
            All widgets are browser-source ready. Just copy the generated URL
            and paste it into OBS.
          </p>
        </div>
      </main>
    </div>
  );
}
