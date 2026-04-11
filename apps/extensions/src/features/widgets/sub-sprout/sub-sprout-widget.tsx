import { useCallback, useEffect, useRef, useState } from "react";

interface SubSproutWidgetProps {
  channel: string;
  platform?: "twitch" | "kick";
  kickId?: string;
  kickChannelId?: string;
}

export function SubSproutWidget({
  channel,
  platform = "twitch",
  kickId,
  kickChannelId,
}: SubSproutWidgetProps) {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const isAnimating = useRef(false);
  const subQueue = useRef(0);
  const maxSteps = 4;

  const processQueue = useCallback(() => {
    const currentStep = stepRef.current;

    if (isAnimating.current || subQueue.current === 0) return;

    isAnimating.current = true;
    subQueue.current--;

    if (currentStep >= maxSteps) {
      stepRef.current = 0;
      setStep(0);

      setTimeout(() => {
        isAnimating.current = false;
        processQueue();
      }, 800);
    } else {
      stepRef.current = currentStep + 1;
      setStep(currentStep + 1);

      setTimeout(() => {
        isAnimating.current = false;
        processQueue();
      }, 800);
    }
  }, []);

  useEffect(() => {
    const handleSubEvent = (amount: number = 1) => {
      subQueue.current += amount;
      processQueue();
    };

    const loadComfy = async () => {
      const { default: ComfyJS } = await import("comfy.js");

      ComfyJS.onSub = () => handleSubEvent(1);
      ComfyJS.onResub = () => handleSubEvent(1);
      ComfyJS.onSubGift = () => handleSubEvent(1);

      ComfyJS.onCommand = (
        _user: string,
        command: string,
        _message: string,
        flags: { mod?: boolean; broadcaster?: boolean },
      ) => {
        if (
          command.toLowerCase() === "grow" &&
          (flags.mod || flags.broadcaster)
        ) {
          handleSubEvent(1);
        }
      };

      ComfyJS.Init(channel);
    };

    const loadKick = () => {
      if (!kickId && !kickChannelId) return;

      const ws = new WebSocket(
        "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false",
      );

      ws.onopen = () => {
        console.log("[Kick] WebSocket connected");
        const channelNames = new Set<string>();

        if (kickId) {
          channelNames.add(`chatrooms.${kickId}.v2`);
          channelNames.add(`chatrooms.${kickId}`);
        }

        if (kickChannelId) {
          channelNames.add(`channel.${kickChannelId}`);
          channelNames.add(`channel.${kickChannelId}.v2`);
          channelNames.add(`chatrooms.${kickChannelId}.v2`);
        }

        for (const channelName of channelNames) {
          ws.send(
            JSON.stringify({
              event: "pusher:subscribe",
              data: { channel: channelName },
            }),
          );
          console.log("[Kick] Subscribing to channel:", channelName);
        }
      };

      ws.onmessage = event => {
        if (typeof event.data !== "string") return;

        try {
          const response = JSON.parse(event.data) as {
            event?: unknown;
            data?: unknown;
          };
          const eventName =
            typeof response.event === "string" ? response.event : "";
          const parsePayload = (
            data: unknown,
          ): Record<string, unknown> | null => {
            if (typeof data === "string") {
              try {
                const parsed = JSON.parse(data) as unknown;
                return parsed && typeof parsed === "object"
                  ? (parsed as Record<string, unknown>)
                  : null;
              } catch {
                return null;
              }
            }

            return data && typeof data === "object"
              ? (data as Record<string, unknown>)
              : null;
          };
          const pickAmount = (payload: Record<string, unknown> | null) => {
            if (!payload) return NaN;

            const candidates: unknown[] = [
              payload.gifted_subscriptions_count,
              payload.subscriptions_count,
              payload.count,
              payload.amount,
            ];

            const nestedData = payload.data;
            if (nestedData && typeof nestedData === "object") {
              const nested = nestedData as Record<string, unknown>;
              candidates.push(
                nested.gifted_subscriptions_count,
                nested.subscriptions_count,
                nested.count,
                nested.amount,
              );
            }

            for (const value of candidates) {
              const asNumber =
                typeof value === "number"
                  ? value
                  : typeof value === "string"
                    ? Number(value)
                    : NaN;
              if (Number.isFinite(asNumber) && asNumber > 0) {
                return asNumber;
              }
            }

            return NaN;
          };

          // Respond to Pusher ping
          if (eventName === "pusher:ping") {
            ws.send(JSON.stringify({ event: "pusher:pong" }));
            return;
          }

          // Subscription confirmation
          if (eventName === "pusher_internal:subscription_succeeded") {
            console.log("[Kick] Subscribed to channel");
            return;
          }

          // Handle sub events with a tolerant matcher for Kick event variants.
          if (
            eventName.includes("Subscription") ||
            (eventName.includes("Gift") && eventName.includes("Event"))
          ) {
            const payload = parsePayload(response.data);
            const numericAmount = pickAmount(payload);

            handleSubEvent(
              Number.isFinite(numericAmount) && numericAmount > 0
                ? Math.floor(numericAmount)
                : 1,
            );
            return;
          }

          // Handle chat commands like "grow"
          if (eventName === "App\\Events\\ChatMessageEvent" && response.data) {
            const payload = parsePayload(response.data);
            const content =
              payload && typeof payload.content === "string"
                ? payload.content
                : "";

            if (content.toLowerCase().trim() === "!grow") {
              // Assuming mod check is hard to verify without badges array properly parsed,
              // for Kick we'll just allow any "grow" command if they type it,
              // or you can restrict it if needed based on payload.sender
              handleSubEvent(1);
            }
          }
        } catch (e) {
          // ignore parse errors
        }
      };

      ws.onerror = error => {
        console.error("[Kick] WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("[Kick] WebSocket disconnected");
      };

      return () => ws.close();
    };

    if (channel && platform === "twitch") {
      loadComfy();
    } else if (platform === "kick" && (kickId || kickChannelId)) {
      const cleanup = loadKick();
      return cleanup;
    }
  }, [channel, platform, kickId, kickChannelId]);

  return (
    <div className="size-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        width="100%"
        height="100%"
        className={`sprout-overlay step-${step}`}
        style={{
          backgroundColor: "transparent",
        }}>
        <defs>
          <g id="leaf-r">
            <path d="M 0,0 Q 40,-10 50,-50 Q 10,-40 0,0 Z" fill="#6B8E55" />
            <path
              d="M 0,0 Q 25,-25 45,-45"
              fill="none"
              stroke="#4A6638"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
          <g id="leaf-l">
            <path d="M 0,0 Q -40,-10 -50,-50 Q -10,-40 0,0 Z" fill="#6B8E55" />
            <path
              d="M 0,0 Q -25,-25 -45,-45"
              fill="none"
              stroke="#4A6638"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </defs>

        <path
          className="stem"
          d="M 400,420 C 390,350 380,250 410,150"
          fill="none"
          stroke="#4A6638"
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            strokeDasharray: 320,
            strokeDashoffset:
              step === 0
                ? 270
                : step === 1
                  ? 200
                  : step === 2
                    ? 130
                    : step === 3
                      ? 60
                      : 0,
            transition: "stroke-dashoffset 0.6s ease-in-out",
          }}
        />

        <g transform="translate(396, 395)">
          <use href="#leaf-l" transform="scale(0.5) rotate(-10)" />
        </g>
        <g transform="translate(398, 380)">
          <use href="#leaf-r" transform="scale(0.6) rotate(15)" />
        </g>

        <g transform="translate(392, 330) rotate(-15)">
          <g
            className="leaf leaf-1"
            style={{
              transform: step >= 1 ? "scale(1)" : "scale(0)",
              transformOrigin: "0 0",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
            <use href="#leaf-l" />
          </g>
        </g>
        <g transform="translate(388, 260) rotate(10)">
          <g
            className="leaf leaf-2"
            style={{
              transform: step >= 2 ? "scale(1)" : "scale(0)",
              transformOrigin: "0 0",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
            <use href="#leaf-r" />
          </g>
        </g>
        <g transform="translate(395, 200) rotate(-5)">
          <g
            className="leaf leaf-3"
            style={{
              transform: step >= 3 ? "scale(0.9)" : "scale(0)",
              transformOrigin: "0 0",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
            <use href="#leaf-l" transform="scale(0.9)" />
          </g>
        </g>
        <g transform="translate(410, 150) rotate(25)">
          <g
            className="leaf leaf-4"
            style={{
              transform: step >= 4 ? "scale(0.85)" : "scale(0)",
              transformOrigin: "0 0",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
            <use href="#leaf-r" transform="scale(0.85)" />
          </g>
        </g>

        <ellipse cx="400" cy="420" rx="75" ry="10" fill="#A85F45" />
        <ellipse cx="400" cy="420" rx="75" ry="10" fill="#5C4A42" />
        <polygon points="330,440 470,440 450,550 350,550" fill="#C87A5E" />
        <rect x="315" y="420" width="170" height="25" rx="4" fill="#E89B7E" />
        <polygon
          points="330,440 470,440 465,455 335,455"
          fill="#A85F45"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
