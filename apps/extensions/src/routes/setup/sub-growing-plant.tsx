import { Breadcrumb } from "#/components/breadcrumb";
import { YoutubeTutorial } from "#/components/youtube-tutorial";
import { useT, type TranslationKey } from "#/lib/i18n";
import { type FaqEntry, getFaqJsonLd, getLocaleLinks } from "#/lib/i18n/seo";
import {
  PLANT_REGISTRY,
  PLANT_IDS,
  type PlantId,
} from "#/features/widgets/sub-sprout/plants/registry";
import {
  WATER_EFFECT_OPTIONS,
  type WaterEffectType,
} from "#/features/widgets/sub-sprout/water/watering-fx";
import { createFileRoute, Link } from "@tanstack/react-router";
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
      { "script:ld+json": getFaqJsonLd(FAQ) },
    ],
    links: getLocaleLinks("/setup/sub-growing-plant"),
  }),
  component: SubSproutSetup,
});

const FAQ: FaqEntry[] = [
  ["subSprout.faq1Q", "subSprout.faq1A"],
  ["subSprout.faq2Q", "subSprout.faq2A"],
];

type PickMode = "fixed" | "cycle" | "random";

function SubSproutSetup() {
  const t = useT();
  const [platform, setPlatform] = useState<"both" | "twitch" | "kick">(
    "both",
  );
  const [twitchChannel, setTwitchChannel] = useState("");
  const [kickChannel, setKickChannel] = useState("");
  const [variety, setVariety] = useState<PlantId>("classic");
  const [pick, setPick] = useState<PickMode>("fixed");
  const [water, setWater] = useState<WaterEffectType>("off");
  const [countFx, setCountFx] = useState(true);
  const [potLabel, setPotLabel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buildUrl = (twitch: string, kick: string, withChannel: boolean) => {
    if (typeof window === "undefined") return "";
    if (withChannel && !twitch && !kick) return "";
    const params = new URLSearchParams();
    if (withChannel) {
      if (platform !== "kick" && twitch) params.set("twitch", twitch);
      if (platform !== "twitch" && kick) params.set("kick", kick);
    }
    if (variety !== "classic") params.set("variety", variety);
    if (pick !== "fixed") params.set("pick", pick);
    if (water !== "off") params.set("water", water);
    if (!countFx) params.set("countfx", "0");
    if (potLabel) params.set("potlabel", "1");
    return `${window.location.origin}/widgets/sub-sprout-widget?${params.toString()}`;
  };

  const getWidgetUrl = (withChannel = true) =>
    buildUrl(
      twitchChannel.trim().toLowerCase(),
      kickChannel.trim().toLowerCase(),
      withChannel,
    );

  // simulate=auto stops once the channel's chat connects, leaving the plant at
  // stage 0 with no setting visible. simulate=1 never connects to chat, so the
  // channel is left out and the preview keeps growing.
  const getPreviewUrl = () => {
    const url = buildUrl("", "", false);
    if (!url) return "";
    const previewUrl = new URL(url);
    previewUrl.searchParams.set("simulate", "1");
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

  const isFormValid =
    (platform !== "kick" && twitchChannel.trim().length > 0) ||
    (platform !== "twitch" && kickChannel.trim().length > 0);
  const showAdvanced =
    water !== "off" ||
    pick !== "fixed" ||
    variety !== "classic" ||
    !countFx ||
    potLabel;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-6 pt-12 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mb-12">
          {/* Left: Configuration Panel */}
          <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-white p-6 md:p-8 shadow-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: t("common.home"), href: "/" },
                  { label: t("subSprout.breadcrumb") },
                ]}
              />
            </div>
            <div className="mb-6 flex justify-center">
              <Link
                to="/"
                className="relative inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-zinc-900 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white">
                <div className="inline-flex size-10 shrink-0">
                  <img
                    src="/senchabot-logo.svg"
                    alt="Senchabot"
                    width={40}
                    height={40}
                  />
                </div>
              </Link>
            </div>

            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-700 border border-green-500/20 dark:text-green-400">
                {t("common.freeBadge")}
              </span>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-center text-zinc-900 dark:text-white">
              {t("subSprout.title")}
            </h1>

            <div className="space-y-4">
              <p className="text-xs text-zinc-600 bg-zinc-100 p-3 rounded-md border border-zinc-200 leading-relaxed dark:text-zinc-400 dark:bg-zinc-800/40 dark:border-zinc-800">
                {t("subSprout.intro")}
              </p>

              <YoutubeTutorial url="https://youtu.be/P0Btpez9Znw" />

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("subSprout.platforms")}
                </label>
                <select
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as "both" | "twitch" | "kick")
                  }
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option value="both">{t("subSprout.both")}</option>
                  <option value="twitch">{t("subSprout.twitch")}</option>
                  <option value="kick">{t("subSprout.kick")}</option>
                </select>
              </div>

              {(platform === "both" || platform === "twitch") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("subSprout.twitchChannel")}
                  </label>
                  <input
                    type="text"
                    value={twitchChannel}
                    onChange={(e) => setTwitchChannel(e.target.value)}
                    placeholder={t("common.channelPlaceholder")}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              )}

              {(platform === "both" || platform === "kick") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("subSprout.kickChannel")}
                  </label>
                  <input
                    type="text"
                    value={kickChannel}
                    onChange={(e) => setKickChannel(e.target.value)}
                    placeholder={t("common.channelPlaceholder")}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-zinc-200 space-y-4 dark:border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {t("subSprout.growthOptions")}
                </h2>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("subSprout.plantVariety")}
                  </label>
                  <select
                    value={variety}
                    onChange={(e) => setVariety(e.target.value as PlantId)}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    {PLANT_IDS.map((id) => (
                      <option key={id} value={id}>
                        {t(`plants.${id}` as TranslationKey)} (
                        {t("subSprout.stagesSuffix", {
                          stages: PLANT_REGISTRY[id].stages,
                        })}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("subSprout.selectionMode")}
                  </label>
                  <div className="flex gap-2">
                    {(["fixed", "cycle", "random"] as const).map((mode) => (
                      <label
                        key={mode}
                        className={`flex-1 cursor-pointer rounded-md border px-2 py-2 text-center transition-colors ${
                          pick === mode
                            ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300"
                            : "border-zinc-300 bg-zinc-100 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
                        }`}>
                        <input
                          type="radio"
                          name="pick"
                          value={mode}
                          checked={pick === mode}
                          onChange={() => setPick(mode)}
                          className="sr-only"
                        />
                        {mode === "fixed" && t("subSprout.fixed")}
                        {mode === "cycle" && t("subSprout.cycle")}
                        {mode === "random" && t("subSprout.random")}
                      </label>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {pick === "fixed" && t("subSprout.fixedHint")}
                    {pick === "cycle" && t("subSprout.cycleHint")}
                    {pick === "random" && t("subSprout.randomHint")}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("subSprout.wateringEffect")}
                  </label>
                  <select
                    value={water}
                    onChange={(e) => setWater(e.target.value as WaterEffectType)}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    {WATER_EFFECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(`plants.water${opt.value.charAt(0).toUpperCase()}${opt.value.slice(1)}` as TranslationKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-800">
                  <input
                    type="checkbox"
                    checked={countFx}
                    onChange={(e) => setCountFx(e.target.checked)}
                    className="size-4 accent-green-500"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {t("subSprout.showSubCountEffect")}{" "}
                    <span className="text-zinc-500">
                      {t("subSprout.subCountHint", { count: "x5" })}
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-800">
                  <input
                    type="checkbox"
                    checked={potLabel}
                    onChange={(e) => setPotLabel(e.target.checked)}
                    className="size-4 accent-green-500"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {t("subSprout.showPotLabel")}{" "}
                    <span className="text-zinc-500">
                      {t("subSprout.potLabelHint")}
                    </span>
                  </span>
                </label>

                {showAdvanced && (
                  <p className="text-[11px] text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded p-2 dark:text-amber-400/80">
                   {t("subSprout.advancedNotice")}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-200 lg:hidden dark:border-zinc-800">
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("common.widgetUrl")}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={mounted ? getWidgetUrl() : ""}
                    className="w-full rounded-l-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={!isFormValid}
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {copied ? t("common.copied") : t("common.copy")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview Panel & Guides/FAQ */}
          <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="rounded-xl bg-white p-6 md:p-8 shadow-xl border border-zinc-200 flex flex-col h-[700px] dark:bg-zinc-900 dark:border-zinc-800">
              <h2 className="mb-4 text-xl font-semibold text-center text-zinc-700 dark:text-zinc-300">
                {t("subSprout.previewTitle")}
              </h2>
              <div className="flex-1 w-full bg-zinc-950/20 rounded-lg overflow-hidden border border-zinc-300 relative shadow-inner flex items-center justify-center relative dark:border-zinc-800">
                {mounted ? (
                  <iframe
                    src={getPreviewUrl()}
                    className="absolute inset-0 w-full h-full border-0"
                    title={t("subSprout.previewIframeTitle")}
                  />
                ) : (
                  <div className="text-center text-zinc-500">
                    <p>{t("subSprout.loadingPreview")}</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-zinc-500">
                {t("subSprout.previewHintNoChannel")}
              </p>

              <div className="mt-4 hidden lg:block">
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("common.widgetUrl")}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={mounted ? getWidgetUrl() : ""}
                    className="w-full rounded-l-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={!isFormValid}
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {copied ? t("common.copied") : t("common.copy")}
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  {t("common.browserSourceHint")} (800×600).
                </p>
              </div>
            </div>

            {/* Quick OBS Guide & FAQ (Placed under preview) */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-zinc-900 mb-2 dark:text-white">{t("subSprout.guideTitle")}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {t("subSprout.guideStep1")}<br />
                  {t("subSprout.guideStep2")}<br />
                  {t("subSprout.guideStep3")}<br />
                  {t("subSprout.guideStep4")}
                </p>
              </div>

              <div className="space-y-3">
                {FAQ.map(([question, answer]) => (
                  <details
                    key={question}
                    className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                      <span>{t(question)}</span>
                      <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                    </summary>
                    <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                      {t(answer)}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
