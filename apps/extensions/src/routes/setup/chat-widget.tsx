import { Breadcrumb } from "#/components/breadcrumb";
import { YoutubeTutorial } from "#/components/youtube-tutorial";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useMemo, useState } from "react";

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
    links: [
      {
        rel: "canonical",
        href: "https://extensions.senchabot.com/setup/chat-widget",
      },
    ],
  }),
  component: ChatWidgetSetup,
});

function ChatWidgetSetup() {
  const [twitchChannel, setTwitchChannel] = useState("");
  const [kickChannel, setKickChannel] = useState("");
  const [fontSize, setFontSize] = useState("18");
  const [hasBackground, setHasBackground] = useState(false);
  const [itemBackground, setItemBackground] = useState(false);
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

  const deferredTwitch = useDeferredValue(twitchChannel);
  const deferredKick = useDeferredValue(kickChannel);

  const widgetUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    if (platforms === "both" || platforms === "twitch")
      if (deferredTwitch) params.append("twitch", deferredTwitch);
    if (platforms === "both" || platforms === "kick")
      if (deferredKick) params.append("kick", deferredKick);
    if (!sevenTv) params.append("sevenTv", "false");
    if (!badges) params.append("badges", "false");
    if (fontSize !== "18") params.append("fontSize", fontSize);
    if (hasBackground) {
      params.append("background", "true");
      if (backgroundOpacity !== "0.5") params.append("bgOpacity", backgroundOpacity);
    }
    if (itemBackground) params.append("itemBackground", "true");
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

    if (!deferredTwitch && !deferredKick) {
      params.append("mock", "true");
      return `${window.location.origin}/widgets/chat-widget?${params.toString()}`;
    }
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 pt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mb-12">
          {/* Left: Configuration Panel */}
          <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-zinc-900 p-6 md:p-8 shadow-xl border border-zinc-800">
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Chat Box Setup" },
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
              Chat Box Setup
            </h1>

            <div className="space-y-4">
              <p className="text-xs text-zinc-400 bg-zinc-800/40 p-3 rounded-md border border-zinc-800 leading-relaxed">
                A customizable multi-chat widget and stream chat box overlay merging Twitch and Kick into a single feed with 7TV emotes and custom themes.
              </p>

              <YoutubeTutorial />

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Platforms
                </label>
                <select
                  value={platforms}
                  onChange={(e) =>
                    setPlatforms(e.target.value as "both" | "twitch" | "kick")
                  }
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option value="both">Both (Twitch & Kick)</option>
                  <option value="twitch">Twitch</option>
                  <option value="kick">Kick</option>
                </select>
              </div>

              {(platforms === "both" || platforms === "twitch") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Twitch Channel
                  </label>
                  <input
                    type="text"
                    value={twitchChannel}
                    onChange={(e) => setTwitchChannel(e.target.value)}
                    placeholder="e.g. yourchannel"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              )}

              {(platforms === "both" || platforms === "kick") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Kick Channel
                  </label>
                  <input
                    type="text"
                    value={kickChannel}
                    onChange={(e) => setKickChannel(e.target.value)}
                    placeholder="e.g. yourchannel"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              )}

              {platforms === "both" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Platform Indicator
                  </label>
                  <select
                    value={platformDisplay}
                    onChange={(e) =>
                      setPlatformDisplay(e.target.value as "name" | "icon")
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="name">Platform Name</option>
                    <option value="icon">Platform Icon</option>
                  </select>
                </div>
              )}

              <details className="rounded-md border border-zinc-800 bg-zinc-900/40 open:bg-zinc-900/60 transition-colors">
                <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">
                  Style &amp; Appearance (Customizable Stream Overlays)
                </summary>
                <div className="space-y-4 border-t border-zinc-800 p-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-400">
                      Font
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
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="nunito">Nunito</option>
                      <option value="mono">JetBrains Mono</option>
                      <option value="serif">Source Serif 4</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-400">
                      Message Layout
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
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="inline">Inline — Username: message</option>
                      <option value="stacked">Stacked — username above</option>
                      <option value="card">Card / Bubble</option>
                      <option value="compact">Compact (Twitch-like)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-400">
                      New Message Animation
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
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="slide">Slide from right + fade</option>
                      <option value="pop">Pop / scale-in</option>
                      <option value="bounce">Bounce in</option>
                      <option value="stagger">
                        Stagger (meta first, then message)
                      </option>
                      <option value="fade">Fade in</option>
                      <option value="none">No animation</option>
                    </select>
                  </div>
                </div>
              </details>

              <div className="flex gap-4">
                <div className="flex-1 max-w-[150px]">
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) =>
                      setOrientation(
                        e.target.value as "vertical" | "horizontal",
                      )
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Font Size (px)
                  </label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-end pb-2">
                  <label className="flex items-center space-x-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBackground}
                      onChange={(e) => setHasBackground(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm">Dark Background</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sevenTv}
                    onChange={(e) => setSevenTv(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">7TV Emotes</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badges}
                    onChange={(e) => setBadges(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">Show Badges</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTimestamp}
                    onChange={(e) => setShowTimestamp(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">Show Message Time</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepMessages}
                    onChange={(e) => setKeepMessages(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">Keep Messages</span>
                </label>
              </div>

              {hasBackground && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Background Opacity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={backgroundOpacity}
                    onChange={(e) => setBackgroundOpacity(e.target.value)}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="text-right text-xs text-zinc-500 mt-1">
                    {backgroundOpacity}
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemBackground}
                    onChange={(e) => setItemBackground(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">Message Background Box</span>
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  Each message gets its own bordered background box.
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={boldUsernames}
                    onChange={(e) => setBoldUsernames(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">Bold Usernames</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={boldMessages}
                    onChange={(e) => setBoldMessages(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm">Bold Messages</span>
                </label>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-800 lg:hidden">
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Widget URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={widgetUrl}
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
                Widget Preview (Chat Box)
              </h2>
              <div className="flex-1 w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative shadow-inner flex items-center justify-center relative bg-opacity-20">
                {widgetUrl ? (
                  <iframe
                    src={widgetUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    title="Chat Widget Preview"
                  />
                ) : (
                  <div className="text-center text-zinc-500">
                    <p>Fill in at least one channel to generate preview.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 hidden lg:block">
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Widget URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={widgetUrl}
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
                  Paste this URL as a Browser Source in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources (recommended size: 400×600 for chat box).
                </p>
              </div>
            </div>

            {/* Quick OBS Guide & FAQ (Placed under preview) */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-white mb-2">Streaming Software Chat Box Setup (OBS, Streamlabs, XSplit, etc.)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  1. Add a <strong>Browser Source</strong> in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).<br />
                  2. Paste your copied multi-chat widget URL.<br />
                  3. Set width and height to match your desired chat box overlay dimensions (e.g. 400×600 for vertical).
                </p>
              </div>

              <div className="space-y-3">
                <details className="group rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-200 group-hover:text-white">
                    <span>Do I need to sign in to Twitch or Kick to use the chat box?</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    No login is required. Chat Box listens anonymously to public chat streams for both platforms.
                  </p>
                </details>

                <details className="group rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-200 group-hover:text-white">
                    <span>Does this multi-chat widget work with 7TV emotes?</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Yes, 7TV channel and global emotes are fetched and rendered automatically in the chat box overlay for both Twitch and Kick.
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
