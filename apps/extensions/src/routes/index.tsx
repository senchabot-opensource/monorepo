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
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-400 text-2xl">
                🌱
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
                Widget
              </span>
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
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-400 text-2xl">
                💬
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
                Widget
              </span>
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
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-400 text-2xl">
                🎉
              </div>
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                Tool
              </span>
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

        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-zinc-500">
            All widgets are browser-source ready. Just copy the generated URL
            and paste it into OBS.
          </p>
          <a
            href="https://github.com/senchabot-opensource/monorepo/tree/dev/apps/extensions"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-green-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Open Source on GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
