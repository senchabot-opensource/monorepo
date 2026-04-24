import { Breadcrumb } from "#/components/breadcrumb";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/setup/sub-growing-plant")({
  head: () => ({
    meta: [
      { title: "Sub Sprout Widget Setup — Senchabot Extensions" },
      {
        name: "description",
        content:
          "Configure the Sub Sprout widget for Twitch or Kick. A growing plant that gets bigger with every new subscription, perfect for visualizing your community's support on stream.",
      },
      {
        property: "og:title",
        content: "Sub Sprout Widget Setup — Senchabot Extensions",
      },
      {
        property: "og:description",
        content:
          "Configure the Sub Sprout widget for Twitch or Kick. A growing plant that gets bigger with every new subscription.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://extensions.senchabot.com/setup/sub-growing-plant",
      },
      {
        property: "og:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Sub Sprout Widget Setup — Senchabot Extensions",
      },
      {
        name: "twitter:description",
        content: "Configure the Sub Sprout widget for Twitch or Kick.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Sub Sprout Widget",
          description:
            "A growing plant that gets bigger with every new subscription on Twitch or Kick.",
          url: "https://extensions.senchabot.com/setup/sub-growing-plant",
          applicationCategory: "StreamingWidget",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://extensions.senchabot.com/setup/sub-growing-plant",
      },
    ],
  }),
  component: SubSproutSetup,
});

function SubSproutSetup() {
  const [channel, setChannel] = useState("");
  const [platform, setPlatform] = useState<"twitch" | "kick">("twitch");
  const [copied, setCopied] = useState(false);

  const getWidgetUrl = () => {
    if (typeof window === "undefined") return "";
    if (!channel) return "";
    return `${window.location.origin}/widgets/sub-sprout-widget?channel=${encodeURIComponent(channel)}&platform=${platform}`;
  };

  const handleCopy = async () => {
    const url = getWidgetUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid = channel.length > 0;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row items-center lg:items-start justify-center bg-zinc-950 p-6 text-zinc-100 font-sans gap-8 pt-12">
      <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Sub Sprout Setup" },
            ]}
          />
        </div>
        <div className="mb-6 flex justify-center">
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
          </a>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-center text-white">
          Sub Sprout Widget Setup
        </h1>

        <div className="space-y-4">
          <div className="text-sm text-zinc-400 bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            <p>
                <strong className="text-zinc-300">Sub Sprout:</strong> A
                growing plant that gets bigger with every new subscription.
                Perfect for visualizing your community's support on stream.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Channel Name
            </label>
            <input
              type="text"
              value={channel}
              onChange={e => setChannel(e.target.value)}
              placeholder="e.g. senchabot"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Platform
            </label>
            <select
              value={platform}
              onChange={e =>
                setPlatform(e.target.value as "twitch" | "kick")
              }
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
              <option value="twitch">Twitch</option>
              <option value="kick">Kick</option>
            </select>
          </div>

          <div className="pt-4 mt-6 border-t border-zinc-800">
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Widget URL
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={getWidgetUrl()}
                className="w-full rounded-l-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-300 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                disabled={!isFormValid}
                className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800 flex flex-col h-[700px]">
        <h2 className="mb-4 text-xl font-semibold text-center text-zinc-300">
          Widget Preview
        </h2>
        <div className="flex-1 w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative shadow-inner flex items-center justify-center relative bg-opacity-20">
          {isFormValid ? (
            <iframe
              src={getWidgetUrl()}
              className="absolute inset-0 w-full h-full border-0"
              title="Sub Sprout Preview"
            />
          ) : (
            <div className="text-center text-zinc-500">
              <p>Fill in the required fields to generate preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
