import { Breadcrumb } from "#/components/breadcrumb";
import { YoutubeTutorial } from "#/components/youtube-tutorial";
import {
  PLANT_REGISTRY,
  PLANT_IDS,
  type PlantId,
} from "#/features/widgets/sub-sprout/plants/registry";
import {
  WATER_EFFECT_OPTIONS,
  type WaterEffectType,
} from "#/features/widgets/sub-sprout/water/watering-fx";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/setup/sub-growing-plant")({
  head: () => ({
    meta: [
      { title: "Sub Sprout Widget Setup — Free Sub Alert & Growing Plant Overlay for Twitch & Kick — Senchabot Extensions" },
      {
        name: "description",
        content:
          "Set up a free Sub Sprout (sub growing plant) widget and sub alert tool for Twitch and Kick. A growing plant stream overlay that gets bigger with every new subscription — perfect for showing sub count, tracking subscription goals, and visualizing community support on your OBS or browser source stream.",
      },
      {
        name: "keywords",
        content:
          "sub growing, sub alert, sub sprout, subscription alert, growing plant overlay, twitch sub widget, kick sub widget, stream plant, sub counter, subscription tracker, sub goal tracker, new sub alert, streaming overlay, browser source widget, OBS widget, free stream widget, twitch overlay, kick overlay",
      },
      {
        property: "og:title",
        content: "Sub Sprout Widget Setup — Free Sub Alert & Growing Plant Overlay for Twitch & Kick — Senchabot Extensions",
      },
      {
        property: "og:description",
        content:
          "Set up a free Sub Sprout (sub growing plant) widget and sub alert tool for Twitch and Kick. A growing plant stream overlay that gets bigger with every new subscription.",
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
        content: "Sub Sprout Widget Setup — Free Sub Alert & Growing Plant Overlay — Senchabot Extensions",
      },
      {
        name: "twitter:description",
        content:
          "Set up a free sub alert and growing plant stream overlay for Twitch or Kick. Tracks sub count and subscription goals.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Sub Sprout Widget & Tool",
          description:
            "A free sub alert and growing plant stream overlay that gets bigger with every new subscription on Twitch or Kick.",
          url: "https://extensions.senchabot.com/setup/sub-growing-plant",
          applicationCategory: "StreamingWidget",
          operatingSystem: "All",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "Sub Sprout Widget Setup Tutorial",
          description:
            "Step-by-step tutorial on how to configure the Sub Sprout sub alert and growing plant widget for Twitch and Kick streams.",
          thumbnailUrl: "https://img.youtube.com/vi/P0Btpez9Znw/maxresdefault.jpg",
          embedUrl: "https://www.youtube.com/embed/P0Btpez9Znw",
          contentUrl: "https://youtu.be/P0Btpez9Znw",
          uploadDate: "2025-04-11T12:00:00+03:00",
          duration: "PT43S",
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

type PickMode = "fixed" | "cycle" | "random";

function SubSproutSetup() {
  const [channel, setChannel] = useState("");
  const [platform, setPlatform] = useState<"twitch" | "kick">("twitch");
  const [variety, setVariety] = useState<PlantId>("classic");
  const [pick, setPick] = useState<PickMode>("fixed");
  const [water, setWater] = useState<WaterEffectType>("off");
  const [growth, setGrowth] = useState(1);
  const [countFx, setCountFx] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getWidgetUrl = (withChannel = true) => {
    if (typeof window === "undefined") return "";
    if (withChannel && !channel) return "";
    const params = new URLSearchParams();
    if (channel && withChannel) {
      params.set("channel", channel);
      params.set("platform", platform);
    }
    if (variety !== "classic") params.set("variety", variety);
    if (pick !== "fixed") params.set("pick", pick);
    if (growth > 1) params.set("growth", String(growth));
    if (water !== "off") params.set("water", water);
    if (!countFx) params.set("countfx", "0");
    return `${window.location.origin}/widgets/sub-sprout-widget?${params.toString()}`;
  };

  const getPreviewUrl = () => {
    const url = getWidgetUrl(false);
    if (!url) return "";
    const previewUrl = new URL(url);
    previewUrl.searchParams.set("simulate", "auto");
    return previewUrl.toString();
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
  const showAdvanced =
    water !== "off" || growth > 1 || pick !== "fixed" || variety !== "classic" || !countFx;

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
                sub growing plant and sub alert overlay that gets bigger with
                every new subscription. Perfect for showing sub count and
                tracking subscription goals on stream.
            </p>
          </div>

          <YoutubeTutorial url="https://youtu.be/P0Btpez9Znw" />

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

          <div className="pt-4 mt-4 border-t border-zinc-800 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-300">
              Growth options
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-400">
                Plant variety
              </label>
              <select
                value={variety}
                onChange={e => setVariety(e.target.value as PlantId)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                {PLANT_IDS.map(id => (
                  <option key={id} value={id}>
                    {PLANT_REGISTRY[id].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-400">
                Plant selection
              </label>
              <div className="flex gap-2 text-xs">
                {(["fixed", "cycle", "random"] as PickMode[]).map(mode => (
                  <label
                    key={mode}
                    className={`flex-1 cursor-pointer rounded-md border px-2 py-2 text-center transition-colors ${
                      pick === mode
                        ? "border-green-500 bg-green-500/10 text-green-300"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                    }`}>
                    <input
                      type="radio"
                      name="pick"
                      value={mode}
                      checked={pick === mode}
                      onChange={() => setPick(mode)}
                      className="sr-only"
                    />
                    {mode === "fixed" && "Fixed"}
                    {mode === "cycle" && "Cycle"}
                    {mode === "random" && "Random"}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {pick === "fixed" && "After a plant finishes, the same plant restarts from step 1."}
                {pick === "cycle" && "After a plant finishes, the next plant in the list grows, looping."}
                {pick === "random" && "After a plant finishes, a random plant grows next."}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-400">
                Watering effect
              </label>
              <select
                value={water}
                onChange={e => setWater(e.target.value as WaterEffectType)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                {WATER_EFFECT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="growth"
                className="mb-1 block text-sm font-medium text-zinc-400">
                Growth stages per sub: <span className="text-zinc-200">{growth}</span>
              </label>
              <input
                id="growth"
                type="range"
                min="1"
                max="2"
                value={growth}
                onChange={e => setGrowth(Number(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5">
              <input
                type="checkbox"
                checked={countFx}
                onChange={e => setCountFx(e.target.checked)}
                className="size-4 accent-green-500"
              />
              <span className="text-sm text-zinc-300">
                Show sub count effect{" "}
                <span className="text-zinc-500">
                  (e.g. <span className="text-emerald-400">x5</span> for gift
                  bundles)
                </span>
              </span>
            </label>

            {showAdvanced && (
              <p className="text-[11px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded p-2">
                Advanced options enabled. The generated URL will include growth
                parameters.
              </p>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-zinc-800 lg:hidden">
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Widget URL
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={mounted ? getWidgetUrl() : ""}
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
          {mounted ? (
            <iframe
              src={getPreviewUrl()}
              className="absolute inset-0 w-full h-full border-0"
              title="Sub Sprout Preview"
            />
          ) : (
            <div className="text-center text-zinc-500">
              <p>Loading preview...</p>
            </div>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-zinc-500">
          {channel
            ? `Preview shows simulated subs until the widget joins ${channel}'s chat, then live subs.`
            : "Enter a channel name to preview with live subs. Simulated subs shown until then."}
        </p>

        <div className="mt-4 hidden lg:block">
          <label className="mb-1 block text-sm font-medium text-zinc-400">
            Widget URL
          </label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={mounted ? getWidgetUrl() : ""}
              className="w-full rounded-l-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              disabled={!isFormValid}
              className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Paste this URL as a browser source in OBS, Streamlabs, or XSplit
            to show the widget on stream.
          </p>
        </div>
      </div>
    </div>
  );
}
