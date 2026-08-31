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
      {
        title:
          "Free Subscriber Goal Plant & Sub Alert Overlay for Twitch & Kick (No Login) — Sub Sprout | Senchabot",
      },
      {
        name: "description",
        content:
          "100% Free subscriber goal plants and customizable stream overlays for Twitch & Kick. No login or account required. Watch your plant grow live with every new subscription in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources.",
      },
      {
        name: "keywords",
        content:
          "subscriber goal plants, customizable stream overlays, stream tools, free sub growing plant overlay, sub goal widget no login, twitch sub plant free, kick sub alert overlay, browser source sub counter, streamlabs sub plant, xsplit sub goal, free stream sub goal, stream sub sprout",
      },
      {
        property: "og:title",
        content:
          "Free Subscriber Goal Plant & Sub Alert Overlay for Twitch & Kick (No Login Required) — Sub Sprout | Senchabot",
      },
      {
        property: "og:description",
        content:
          "100% Free subscriber goal plant and customizable stream overlay for Twitch and Kick. Zero login required. Watch your plant grow live with every new subscription in OBS Studio, Streamlabs Desktop, XSplit, or any browser source.",
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
        content:
          "Free Subscriber Goal Plant Overlay for Twitch & Kick (No Login Required)",
      },
      {
        name: "twitter:description",
        content:
          "100% Free subscriber goal plant and customizable stream overlay for Twitch & Kick. No account or login required. Works with OBS Studio, Streamlabs Desktop, XSplit, vMix, and any browser source.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Sub Sprout - Free Subscriber Goal Plant Overlay",
          description:
            "A free customizable subscriber goal plant and subscriber alert overlay for Twitch and Kick streamers. No account or login required.",
          url: "https://extensions.senchabot.com/setup/sub-growing-plant",
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
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Are subscriber goal plants on Sub Sprout completely free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Sub Sprout is 100% free and open-source with no subscription fees, account sign-ups, or watermarks.",
              },
            },
            {
              "@type": "Question",
              name: "Do I need to sign in with Twitch or Kick to use the subscriber goal plant?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No login is required. Sub Sprout connects to public chat and subscription events directly from your browser source URL.",
              },
            },
            {
              "@type": "Question",
              name: "How do I test the subscriber goal plant on stream?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Broadcasters and channel moderators can type the '!grow' command in chat to test or manually advance the plant.",
              },
            },
          ],
        },
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "Sub Sprout Subscriber Goal Plant Tutorial",
          description:
            "Step-by-step tutorial on how to configure the Sub Sprout subscriber goal plant and sub alert widget for Twitch and Kick streams.",
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 pt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mb-12">
          {/* Left: Configuration Panel */}
          <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-zinc-900 p-6 md:p-8 shadow-xl border border-zinc-800">
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
                className="relative inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-white transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
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

            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-400 border border-green-500/20">
                100% Free · No Login Required
              </span>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-center text-white">
              Sub Sprout — Subscriber Goal Plant Setup
            </h1>

            <div className="space-y-4">
              <p className="text-xs text-zinc-400 bg-zinc-800/40 p-3 rounded-md border border-zinc-800 leading-relaxed">
                A customizable subscriber goal plant overlay that levels up with every new subscription on Twitch or Kick.
              </p>

              <YoutubeTutorial url="https://youtu.be/P0Btpez9Znw" />

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="e.g. yourchannel"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as "twitch" | "kick")
                  }
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option value="twitch">Twitch</option>
                  <option value="kick">Kick</option>
                </select>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800 space-y-4">
                <h2 className="text-sm font-semibold text-zinc-300">
                  Growth &amp; Plant Options
                </h2>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Plant variety
                  </label>
                  <select
                    value={variety}
                    onChange={(e) => setVariety(e.target.value as PlantId)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    {PLANT_IDS.map((id) => (
                      <option key={id} value={id}>
                        {PLANT_REGISTRY[id].label} (
                        {PLANT_REGISTRY[id].stages} stages)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Selection Mode
                  </label>
                  <div className="flex gap-2">
                    {(["fixed", "cycle", "random"] as const).map((mode) => (
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
                    {pick === "fixed" && "Restarts the same plant after finishing."}
                    {pick === "cycle" && "Loops through plant varieties in order."}
                    {pick === "random" && "Picks a random plant after each cycle."}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Watering effect
                  </label>
                  <select
                    value={water}
                    onChange={(e) => setWater(e.target.value as WaterEffectType)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    {WATER_EFFECT_OPTIONS.map((opt) => (
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
                    onChange={(e) => setGrowth(Number(e.target.value))}
                    className="w-full accent-green-500"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={countFx}
                    onChange={(e) => setCountFx(e.target.checked)}
                    className="size-4 accent-green-500"
                  />
                  <span className="text-sm text-zinc-300">
                    Show sub count effect{" "}
                    <span className="text-zinc-500">
                      (e.g. <span className="text-emerald-400">x5</span> for gift bundles)
                    </span>
                  </span>
                </label>

                {showAdvanced && (
                  <p className="text-[11px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded p-2">
                   Advanced options enabled. Custom growth parameters enabled in widget URL.
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
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview Panel & Guides/FAQ */}
          <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 flex flex-col gap-4">
            <div className="rounded-xl bg-zinc-900 p-6 md:p-8 shadow-xl border border-zinc-800 flex flex-col h-[700px]">
              <h2 className="mb-4 text-xl font-semibold text-center text-zinc-300">
                Subscriber Goal Plant Preview
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
                  ? `Simulated subs shown until the widget connects to ${channel}'s chat.`
                  : "Enter a channel name to connect to live chat. Simulated subs shown in preview."}
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
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Paste this URL as a Browser Source in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources (recommended size: 800×600).
                </p>
              </div>
            </div>

            {/* Quick OBS Guide & FAQ (Placed under preview) */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-white mb-2">Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  1. Add a <strong>Browser Source</strong> in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).<br />
                  2. Paste your copied subscriber goal plant URL.<br />
                  3. Set width to <strong>800</strong> and height to <strong>600</strong>.<br />
                  4. Broadcasters &amp; mods can type <code className="text-green-400">!grow</code> in chat to trigger growth manually.
                </p>
              </div>

              <div className="space-y-3">
                <details className="group rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-200 group-hover:text-white">
                    <span>Do I need to sign in to use the subscriber goal plant?</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    No sign-up or OAuth login is needed. Sub Sprout connects anonymously via public chat event listeners.
                  </p>
                </details>

                <details className="group rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-200 group-hover:text-white">
                    <span>What happens when the subscriber goal plant reaches full growth?</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Once the plant finishes growing, the next subscription resets the plant according to your selection mode (restart the same plant, cycle to the next variety, or pick randomly).
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
