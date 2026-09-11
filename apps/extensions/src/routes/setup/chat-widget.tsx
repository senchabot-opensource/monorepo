import { Breadcrumb } from "#/components/breadcrumb";
import { YoutubeTutorial } from "#/components/youtube-tutorial";
import { useI18n } from "#/lib/i18n";
import { getLocaleLinks } from "#/lib/i18n/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/setup/chat-widget")({
  head: () => ({
    meta: [
      {
        title:
          "Free Multi-Chat Widget & Stream Chat Box for Twitch & Kick (No Login Required) — Chat Box | Senchabot",
      },
      {
        name: "description",
        content:
          "Combine Twitch and Kick chat into one free multi-chat widget and stream chat box overlay. 100% Free & No Login Required. Supports 7TV emotes, badges, custom fonts, animations, and customizable stream overlays for OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources.",
      },
      {
        name: "keywords",
        content:
          "chat box, stream chat box, multi-chat widgets, customizable stream overlays, stream tools, free twitch kick chat overlay, multi-stream chat overlay no login, unified chat widget free, combined chat overlay obs, streamlabs chat box, xsplit chat widget, cross-platform stream chat free",
      },
      {
        property: "og:title",
        content:
          "Free Multi-Chat Widget & Stream Chat Box for Twitch & Kick (No Login Required) — Chat Box | Senchabot",
      },
      {
        property: "og:description",
        content:
          "100% Free multi-chat widget and stream chat box overlay merging Twitch and Kick into a single feed. No login or account required. 7TV emotes and badges included.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://extensions.senchabot.com/setup/chat-widget",
      },
      {
        property: "og:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content:
          "Free Multi-Chat Widget & Stream Chat Box for Twitch & Kick (No Login Required)",
      },
      {
        name: "twitter:description",
        content:
          "Combine Twitch and Kick chat in OBS Studio, Streamlabs Desktop, XSplit, or any software supporting browser sources. Zero login required. 100% Free with 7TV emotes and badge support.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Chat Box - Free Multi-Chat Widget & Stream Chat Box",
          description:
            "A free customizable multi-chat widget and stream chat box overlay that merges Twitch and Kick chat into a single on-stream feed with 7TV emotes, badges, and customizable themes.",
          url: "https://extensions.senchabot.com/setup/chat-widget",
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
              name: "Is this multi-chat widget and stream chat box completely free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Chat Box is 100% free and open-source with no subscription fees, account sign-ups, or watermarks.",
              },
            },
            {
              "@type": "Question",
              name: "Does the chat box support 7TV emotes?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, 7TV custom channel emotes and animated emotes are supported automatically without extra extensions.",
              },
            },
          ],
        },
      },
    ],
    links: getLocaleLinks("/setup/chat-widget"),
  }),
  component: ChatWidgetSetup,
});

function ChatWidgetSetup() {
  const { locale, t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState("");
  const [kickChannel, setKickChannel] = useState("");
  const [fontSize, setFontSize] = useState("18");
  const [hasBackground, setHasBackground] = useState(false);
  const [itemBackground, setItemBackground] = useState(false);
  const [platformAccent, setPlatformAccent] = useState(false);
  const [boldUsernames, setBoldUsernames] = useState(false);
  const [boldMessages, setBoldMessages] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState("0.5");
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical",
  );
  const [platforms, setPlatforms] = useState<"both" | "twitch" | "kick">(
    "both",
  );
  const [platformDisplay, setPlatformDisplay] = useState<"name" | "icon">(
    "icon",
  );
  const [sevenTv, setSevenTv] = useState(true);
  const [badges, setBadges] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [keepMessages, setKeepMessages] = useState(false);
  const [font, setFont] = useState<
    "inter" | "roboto" | "nunito" | "mono" | "serif" | "system"
  >("inter");
  const [layout, setLayout] = useState<
    "inline" | "stacked" | "card" | "compact"
  >("inline");
  const [animation, setAnimation] = useState<
    "slide" | "pop" | "bounce" | "stagger" | "fade" | "none"
  >("slide");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deferredTwitch = useDeferredValue(twitchChannel);
  const deferredKick = useDeferredValue(kickChannel);

  const widgetUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    if (platforms === "both" || platforms === "twitch")
      if (twitchChannel.trim()) params.append("twitch", twitchChannel.trim().toLowerCase());
    if (platforms === "both" || platforms === "kick")
      if (kickChannel.trim()) params.append("kick", kickChannel.trim().toLowerCase());
    if (!sevenTv) params.append("sevenTv", "false");
    if (!badges) params.append("badges", "false");
    if (fontSize !== "18") params.append("fontSize", fontSize);
    if (hasBackground) {
      params.append("background", "true");
      if (backgroundOpacity !== "0.5") params.append("bgOpacity", backgroundOpacity);
    }
    if (itemBackground) params.append("itemBackground", "true");
    if (platformAccent) params.append("platformAccent", "true");
    if (boldUsernames) params.append("boldUsernames", "true");
    if (boldMessages) params.append("boldMessages", "true");
    if (orientation !== "vertical") params.append("orientation", orientation);
    if (platforms === "both" && platformDisplay !== "icon")
      params.append("platformDisplay", platformDisplay);
    if (showTimestamp) params.append("timestamp", "true");
    if (keepMessages) params.append("keep", "true");
    if (font !== "inter") params.append("font", font);
    if (layout !== "inline") params.append("layout", layout);
    if (animation !== "slide") params.append("animation", animation);

    if (!twitchChannel.trim() && !kickChannel.trim()) {
      return "";
    }
    return `${window.location.origin}/widgets/chat-widget?${params.toString()}`;
  }, [
    twitchChannel,
    kickChannel,
    sevenTv,
    badges,
    fontSize,
    hasBackground,
    backgroundOpacity,
    itemBackground,
    platformAccent,
    boldUsernames,
    boldMessages,
    orientation,
    platforms,
    platformDisplay,
    showTimestamp,
    keepMessages,
    font,
    layout,
    animation,
  ]);

  const previewUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    if (platforms === "both" || platforms === "twitch")
      if (deferredTwitch.trim()) params.append("twitch", deferredTwitch.trim().toLowerCase());
    if (platforms === "both" || platforms === "kick")
      if (deferredKick.trim()) params.append("kick", deferredKick.trim().toLowerCase());
    if (!sevenTv) params.append("sevenTv", "false");
    if (!badges) params.append("badges", "false");
    if (fontSize !== "18") params.append("fontSize", fontSize);
    if (hasBackground) {
      params.append("background", "true");
      if (backgroundOpacity !== "0.5") params.append("bgOpacity", backgroundOpacity);
    }
    if (itemBackground) params.append("itemBackground", "true");
    if (platformAccent) params.append("platformAccent", "true");
    if (boldUsernames) params.append("boldUsernames", "true");
    if (boldMessages) params.append("boldMessages", "true");
    if (orientation !== "vertical") params.append("orientation", orientation);
    if (platforms === "both" && platformDisplay !== "icon")
      params.append("platformDisplay", platformDisplay);
    if (showTimestamp) params.append("timestamp", "true");
    if (keepMessages) params.append("keep", "true");
    if (font !== "inter") params.append("font", font);
    if (layout !== "inline") params.append("layout", layout);
    if (animation !== "slide") params.append("animation", animation);
    params.append("mock", "true");
    params.append("lang", locale);
    return `${window.location.origin}/widgets/chat-widget?${params.toString()}`;
  }, [
    deferredTwitch,
    deferredKick,
    sevenTv,
    badges,
    fontSize,
    hasBackground,
    backgroundOpacity,
    itemBackground,
    platformAccent,
    boldUsernames,
    boldMessages,
    orientation,
    platforms,
    platformDisplay,
    showTimestamp,
    keepMessages,
    font,
    layout,
    animation,
    locale,
  ]);

  const handleCopy = async () => {
    if (widgetUrl) {
      await navigator.clipboard.writeText(widgetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid =
    (platforms !== "kick" && twitchChannel.length > 0) ||
    (platforms !== "twitch" && kickChannel.length > 0);

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
                  { label: t("chatWidget.breadcrumb") },
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
              {t("chatWidget.title")}
            </h1>

            <div className="space-y-4">
              <p className="text-xs text-zinc-600 bg-zinc-100 p-3 rounded-md border border-zinc-200 leading-relaxed dark:text-zinc-400 dark:bg-zinc-800/40 dark:border-zinc-800">
                {t("chatWidget.intro")}
              </p>

              <YoutubeTutorial />

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("chatWidget.platforms")}
                </label>
                <select
                  value={platforms}
                  onChange={(e) =>
                    setPlatforms(e.target.value as "both" | "twitch" | "kick")
                  }
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option value="both">{t("chatWidget.both")}</option>
                  <option value="twitch">{t("chatWidget.twitch")}</option>
                  <option value="kick">{t("chatWidget.kick")}</option>
                </select>
              </div>

              {(platforms === "both" || platforms === "twitch") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("chatWidget.twitchChannel")}
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

              {(platforms === "both" || platforms === "kick") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("chatWidget.kickChannel")}
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

              {platforms === "both" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("chatWidget.platformIndicator")}
                  </label>
                  <select
                    value={platformDisplay}
                    onChange={(e) =>
                      setPlatformDisplay(e.target.value as "name" | "icon")
                    }
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="name">{t("chatWidget.platformName")}</option>
                    <option value="icon">{t("chatWidget.platformIcon")}</option>
                  </select>
                </div>
              )}

              <details className="rounded-md border border-zinc-200 bg-zinc-100/60 open:bg-zinc-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900/40 dark:open:bg-zinc-900/60">
                <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                  {t("chatWidget.styleSection")}
                </summary>
                <div className="space-y-4 border-t border-zinc-200 p-3 dark:border-zinc-800">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {t("chatWidget.font")}
                    </label>
                    <select
                      value={font}
                      onChange={(e) =>
                        setFont(
                          e.target.value as
                            | "inter"
                            | "roboto"
                            | "nunito"
                            | "mono"
                            | "serif"
                            | "system",
                        )
                      }
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="nunito">Nunito</option>
                      <option value="mono">JetBrains Mono</option>
                      <option value="serif">Source Serif 4</option>
                      <option value="system">{t("chatWidget.fontSystem")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {t("chatWidget.messageLayout")}
                    </label>
                    <select
                      value={layout}
                      onChange={(e) =>
                        setLayout(
                          e.target.value as
                            | "inline"
                            | "stacked"
                            | "card"
                            | "compact",
                        )
                      }
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="inline">{t("chatWidget.layoutInline")}</option>
                      <option value="stacked">{t("chatWidget.layoutStacked")}</option>
                      <option value="card">{t("chatWidget.layoutCard")}</option>
                      <option value="compact">{t("chatWidget.layoutCompact")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {t("chatWidget.newMessageAnimation")}
                    </label>
                    <select
                      value={animation}
                      onChange={(e) =>
                        setAnimation(
                          e.target.value as
                            | "slide"
                            | "pop"
                            | "bounce"
                            | "stagger"
                            | "fade"
                            | "none",
                        )
                      }
                      className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="slide">{t("chatWidget.animSlide")}</option>
                      <option value="pop">{t("chatWidget.animPop")}</option>
                      <option value="bounce">{t("chatWidget.animBounce")}</option>
                      <option value="stagger">
                        {t("chatWidget.animStagger")}
                      </option>
                      <option value="fade">{t("chatWidget.animFade")}</option>
                      <option value="none">{t("chatWidget.animNone")}</option>
                    </select>
                  </div>
                </div>
              </details>

              <div className="flex gap-4">
                <div className="flex-1 max-w-[150px]">
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("chatWidget.orientation")}
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) =>
                      setOrientation(
                        e.target.value as "vertical" | "horizontal",
                      )
                    }
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="vertical">{t("chatWidget.vertical")}</option>
                    <option value="horizontal">{t("chatWidget.horizontal")}</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("chatWidget.fontSize")}
                  </label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-end pb-2">
                  <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                    <input
                      type="checkbox"
                      checked={hasBackground}
                      onChange={(e) => setHasBackground(e.target.checked)}
                      className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <span className="text-sm">{t("chatWidget.darkBackground")}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={sevenTv}
                    onChange={(e) => setSevenTv(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.sevenTvEmotes")}</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={badges}
                    onChange={(e) => setBadges(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.showBadges")}</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={showTimestamp}
                    onChange={(e) => setShowTimestamp(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.showMessageTime")}</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={keepMessages}
                    onChange={(e) => setKeepMessages(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.keepMessages")}</span>
                </label>
              </div>

              {hasBackground && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("chatWidget.backgroundOpacity")}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={backgroundOpacity}
                    onChange={(e) => setBackgroundOpacity(e.target.value)}
                    className="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-green-500 dark:bg-zinc-700"
                  />
                  <div className="text-right text-xs text-zinc-500 mt-1">
                    {backgroundOpacity}
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={itemBackground}
                    onChange={(e) => setItemBackground(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.messageBackgroundBox")}</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  {t("chatWidget.messageBackgroundHint")}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={platformAccent}
                    onChange={(e) => setPlatformAccent(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.platformAccent")}</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  {t("chatWidget.platformAccentHint")}
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={boldUsernames}
                    onChange={(e) => setBoldUsernames(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.boldUsernames")}</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-zinc-900 cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    checked={boldMessages}
                    onChange={(e) => setBoldMessages(e.target.checked)}
                    className="rounded border-zinc-300 bg-zinc-100 text-green-500 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span className="text-sm">{t("chatWidget.boldMessages")}</span>
                </label>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-200 lg:hidden dark:border-zinc-800">
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("common.widgetUrl")}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={widgetUrl}
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
                {t("chatWidget.previewTitle")}
              </h2>
              <div className="flex-1 w-full bg-zinc-950/80 rounded-lg overflow-hidden border border-zinc-300 relative shadow-inner flex items-center justify-center dark:border-zinc-800">
                {mounted ? (
                  <iframe
                    src={previewUrl}
                    className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                    title={t("chatWidget.previewIframeTitle")}
                  />
                ) : (
                  <div className="text-center text-zinc-500">
                    <p>{t("common.previewNoChannel")}</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-zinc-500">
                {t("chatWidget.previewHint")}
              </p>

              <div className="mt-4 hidden lg:block">
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("common.widgetUrl")}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={widgetUrl}
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
                  {t("common.browserSourceHint")}
                  {t("chatWidget.browserSourceHintSize")}
                </p>
              </div>
            </div>

            {/* Quick OBS Guide & FAQ (Placed under preview) */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-zinc-900 mb-2 dark:text-white">{t("chatWidget.guideTitle")}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {t("chatWidget.guideStep1")}<br />
                  {t("chatWidget.guideStep2")}<br />
                  {t("chatWidget.guideStep3")}
                </p>
              </div>

              <div className="space-y-3">
                <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                    <span>{t("chatWidget.faq1Q")}</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {t("chatWidget.faq1A")}
                  </p>
                </details>

                <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                    <span>{t("chatWidget.faq2Q")}</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {t("chatWidget.faq2A")}
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
