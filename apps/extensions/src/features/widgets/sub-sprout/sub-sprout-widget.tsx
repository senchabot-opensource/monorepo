import { useCallback, useEffect, useRef, useState } from "react";

import { kickSubChannels, kickSubCount } from "./kick-sub-events";
import { PlantSlot } from "./plant-slot";
import { SubCountFX, SUB_COUNT_DURATION_MS } from "./fx/sub-count-fx";
import { VineOverlay } from "./plants/vine-overlay";
import {
  PLANT_IDS,
  PLANT_REGISTRY,
  getPlant,
  isValidPlantId,
  type PlantId,
} from "./plants/registry";
import {
  WateringFX,
  isValidWaterEffect,
  type WaterEffectType,
} from "./water/watering-fx";

export type PickMode = "fixed" | "cycle" | "random";

export interface SubSproutWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  kickId?: string;
  variety?: PlantId | string;
  pick?: PickMode | string;
  water?: WaterEffectType | string;
  countFx?: boolean;
  potLabel?: boolean;
  simulate?: boolean | "auto";
}

const VIEWBOX_W = 800;
const VIEWBOX_H = 600;
const ANIMATION_INTERVAL_MS = 800;
const WATER_EFFECT_DURATION_MS = 2500;
const LEGACY_MAX_STEPS = 9;
const LEGACY_STEM_OFFSETS = [320, 265, 200, 200, 135, 135, 75, 75, 0, 0];
const GIFT_BUNDLE_WINDOW_MS = 15000;
const KICK_DUPLICATE_WINDOW_MS = 10000;
const SIM_NEXT_GAP_MS = 400;

interface SlotState {
  stagesDone: number;
  progress: number;
}

function pickTargetSlot(
  pickMode: PickMode,
  n: number,
  cycleRef: { current: number },
): number {
  if (n <= 1 || pickMode === "fixed") return 0;
  if (pickMode === "random") return Math.floor(Math.random() * n);
  const target = cycleRef.current % n;
  cycleRef.current = (cycleRef.current + 1) % n;
  return target;
}

const CYCLE_PLANT_IDS: PlantId[] = PLANT_IDS.filter(id => id !== "vine");

function pickNextVariety(
  pickMode: PickMode,
  current: PlantId,
): PlantId {
  if (pickMode === "fixed") return current;
  if (pickMode === "random") {
    const others = CYCLE_PLANT_IDS.filter(id => id !== current);
    return others[Math.floor(Math.random() * others.length)];
  }
  const idx = CYCLE_PLANT_IDS.indexOf(current);
  return CYCLE_PLANT_IDS[(idx + 1) % CYCLE_PLANT_IDS.length];
}

function distributeGrowth(
  slots: SlotState[],
  pickMode: PickMode,
  cycleRef: { current: number },
): { targetSlot: number; perSlot: number[] } {
  const n = slots.length;
  const target = pickTargetSlot(pickMode, n, cycleRef);

  const perSlot = Array(n).fill(0);
  perSlot[target] = 1;

  return { targetSlot: target, perSlot };
}

function buildSlots(count: number): SlotState[] {
  return Array.from({ length: count }, () => ({
    stagesDone: 0,
    progress: 0,
  }));
}

/** "3/10" style pot label: completed stages over total stages. */
export function formatPotLabel(stage: number, stages: number): string {
  const total = Math.max(1, Math.floor(stages));
  const current = Math.max(0, Math.min(total, Math.floor(stage)));
  return `${current}/${total}`;
}

export function SubSproutWidget({
  twitchChannel,
  kickChannel,
  kickId,
  variety = "classic",
  pick = "fixed",
  water = "off",
  countFx = true,
  potLabel = false,
  simulate = false,
}: SubSproutWidgetProps) {
  const safeVariety = isValidPlantId(variety) ? variety : "classic";
  const safePick: PickMode =
    pick === "cycle" || pick === "random" || pick === "fixed" ? pick : "fixed";
  const safeWater: WaterEffectType = isValidWaterEffect(water) ? water : "off";

  const [currentVariety, setCurrentVariety] = useState<PlantId>(
    () => safeVariety,
  );
  const currentVarietyRef = useRef<PlantId>(currentVariety);

  useEffect(() => {
    currentVarietyRef.current = safeVariety;
    setCurrentVariety(safeVariety);
  }, [safeVariety]);

  const usesNewFeatures = currentVariety !== "classic";

  const [slotStates, setSlotStates] = useState<SlotState[]>(() =>
    buildSlots(1),
  );
  const slotStatesRef = useRef<SlotState[]>(slotStates);
  slotStatesRef.current = slotStates;

  const isAnimating = useRef(false);
  const subQueue = useRef(0);
  const cycleRef = useRef(0);
  const pendingGiftSlots = useRef<{ count: number; at: number } | null>(null);
  const pendingAnonGiftSlots = useRef<{ count: number; at: number } | null>(
    null,
  );
  const [activeWaterSlot, setActiveWaterSlot] = useState<{
    slot: number;
    key: number;
  } | null>(null);
  const [subCountFx, setSubCountFx] = useState<{
    count: number;
    key: number;
  } | null>(null);
  const [joined, setJoined] = useState(false);
  const twitchConnectedRef = useRef(false);
  const kickConnectedRef = useRef(false);

  const syncJoined = () =>
    setJoined(twitchConnectedRef.current || kickConnectedRef.current);

  const [clientKickId, setClientKickId] = useState<string | null>(null);

  const effectiveKickId = kickId ?? clientKickId;

  useEffect(() => {
    if (simulate === true) return;
    if (kickId || !kickChannel) return;
    let cancelled = false;
    fetch(
      `https://kick.com/api/v1/channels/${encodeURIComponent(kickChannel)}`,
      { headers: { Accept: "application/json" } },
    )
      .then(r => (r.ok ? r.json() : Promise.reject(new Error("Kick channel lookup failed"))))
      .then((data: { chatroom?: { id?: unknown } }) => {
        if (cancelled) return;
        setClientKickId(data.chatroom?.id == null ? null : String(data.chatroom.id));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [kickChannel, kickId, simulate]);

  const applyGrowth = useCallback(() => {
    const { targetSlot, perSlot } = distributeGrowth(
      slotStatesRef.current,
      safePick,
      cycleRef,
    );
    let nextVariety = currentVarietyRef.current;
    const newStates = slotStatesRef.current.map((s, i) => {
      const inc = perSlot[i] || 0;
      if (inc <= 0) return s;
      let newProgress = s.progress + inc;
      let newStages = s.stagesDone;
      while (newProgress >= 1) {
        newProgress -= 1;
        newStages += 1;
        if (newStages >= getPlant(nextVariety).stages) {
          newStages = 1;
          nextVariety = pickNextVariety(safePick, nextVariety);
        }
      }
      return { stagesDone: newStages, progress: newProgress };
    });
    slotStatesRef.current = newStates;
    setSlotStates(newStates);
    if (nextVariety !== currentVarietyRef.current) {
      currentVarietyRef.current = nextVariety;
      setCurrentVariety(nextVariety);
    }
    if (safeWater !== "off") {
      setActiveWaterSlot({ slot: targetSlot, key: Date.now() });
    }
  }, [safePick, safeWater]);

  const processQueue = useCallback(() => {
    if (isAnimating.current || subQueue.current === 0) return;

    isAnimating.current = true;
    subQueue.current--;

    applyGrowth();

    setTimeout(() => {
      isAnimating.current = false;
      processQueue();
    }, ANIMATION_INTERVAL_MS);
  }, [applyGrowth]);

  const handleSubEvent = useCallback(
    (amount: number = 1) => {
      const safeAmount = Math.max(1, Math.floor(amount));
      subQueue.current += safeAmount;
      if (countFx) {
        setSubCountFx({ count: safeAmount, key: Date.now() });
      }
      processQueue();
    },
    [processQueue, countFx],
  );

  useEffect(() => {
    if (!countFx) setSubCountFx(null);
  }, [countFx]);

  useEffect(() => {
    slotStatesRef.current = buildSlots(1);
    setSlotStates(slotStatesRef.current);
    cycleRef.current = 0;
  }, [safeVariety, safePick, safeWater, simulate]);

  // In "auto" simulation (setup previews) clear the simulated growth once the
  // real connection takes over. Regular reconnects must not wipe progress.
  useEffect(() => {
    if (simulate !== "auto" || !joined) return;
    slotStatesRef.current = buildSlots(1);
    setSlotStates(slotStatesRef.current);
    cycleRef.current = 0;
  }, [simulate, joined]);

  // Preview simulation: only x1/x2 subs are shown and the next growth is
  // scheduled after the sub count animation has finished.
  useEffect(() => {
    const simulateOn =
      simulate === true || (simulate === "auto" && !joined);
    if (!simulateOn) return;

    let cancelled = false;
    let timer: number | undefined;

    const scheduleNext = () => {
      if (cancelled) return;
      const amount = Math.random() < 0.5 ? 1 : 2;
      handleSubEvent(amount);
      const growthMs = amount * ANIMATION_INTERVAL_MS;
      const fxMs = countFx ? SUB_COUNT_DURATION_MS : 0;
      const waterMs =
        safeWater !== "off" ? WATER_EFFECT_DURATION_MS : 0;
      timer = window.setTimeout(
        scheduleNext,
        Math.max(growthMs, fxMs, waterMs) + SIM_NEXT_GAP_MS,
      );
    };

    scheduleNext();
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [simulate, joined, handleSubEvent, countFx, safeWater]);

  useEffect(() => {
    twitchConnectedRef.current = false;
    kickConnectedRef.current = false;
    setJoined(false);
    if (simulate === true) return;
    const consumeBundleSlot = (
      pending: { current: { count: number; at: number } | null },
    ): boolean => {
      const bundle = pending.current;
      if (
        bundle &&
        bundle.count > 0 &&
        Date.now() - bundle.at <= GIFT_BUNDLE_WINDOW_MS
      ) {
        bundle.count -= 1;
        return true;
      }
      pending.current = null;
      return false;
    };

    let comfyClient: { disconnect: () => void } | null = null;
    let comfyDisposed = false;

    const loadComfy = async (channelName: string) => {
      const { default: tmi } = await import("tmi.js");
      const client = new tmi.Client({
        connection: {
          secure: true,
          reconnect: true,
          maxReconnectAttempts: Infinity,
          maxReconnectInterval: 30000,
        },
        channels: [channelName],
      });
      if (comfyDisposed) {
        client.disconnect();
        return;
      }
      comfyClient = client;

      client.on("connected", () => {
        twitchConnectedRef.current = true;
        syncJoined();
      });
      client.on("disconnected", () => {
        twitchConnectedRef.current = false;
        syncJoined();
      });
      client.on(
        "join",
        (_channel: string, _username: string, self: boolean) => {
          if (self) {
            twitchConnectedRef.current = true;
            syncJoined();
          }
        },
      );
      client.on("subscription", () => handleSubEvent(1));
      client.on("resub", () => handleSubEvent(1));
      client.on("subgift", () => {
        if (consumeBundleSlot(pendingGiftSlots)) return;
        handleSubEvent(1);
      });
      client.on("anonsubgift", () => {
        if (consumeBundleSlot(pendingAnonGiftSlots)) return;
        handleSubEvent(1);
      });
      client.on(
        "submysterygift",
        (_channel: string, _username: string, giftSubCount: number) => {
          const n = giftSubCount > 0 ? giftSubCount : 1;
          pendingGiftSlots.current = { count: n, at: Date.now() };
          handleSubEvent(n);
        },
      );
      client.on(
        "anonsubmysterygift",
        (_channel: string, giftSubCount: number) => {
          const n = giftSubCount > 0 ? giftSubCount : 1;
          pendingAnonGiftSlots.current = { count: n, at: Date.now() };
          handleSubEvent(n);
        },
      );
      client.on(
        "message",
        (
          _channel: string,
          userstate: {
            username?: string;
            mod?: unknown;
            badges?: Record<string, string> | null;
          },
          message: string,
          self: boolean,
        ) => {
          if (self || !message) return;
          const isBroadcaster =
            `#${userstate.username ?? ""}` === _channel.toLowerCase();
          const isMod =
            userstate.mod === true ||
            userstate.mod === 1 ||
            userstate.mod === "1";
          const command = message.trim().split(/\s+/)[0]?.toLowerCase();
          if (command === "!grow" && (isMod || isBroadcaster)) {
            handleSubEvent(1);
          }
        },
      );

      client.connect();
    };

    const loadKick = () => {
      if (!effectiveKickId) return;
      const chatroomId = effectiveKickId;

      const MAX_RECONNECT_DELAY_MS = 30000;
      let ws: WebSocket | null = null;
      let intentionalClose = false;
      let reconnectTimer: number | null = null;
      let reconnectAttempts = 0;

      const scheduleReconnect = () => {
        if (intentionalClose) return;
        const delay = Math.min(
          1000 * 2 ** reconnectAttempts,
          MAX_RECONNECT_DELAY_MS,
        );
        reconnectAttempts += 1;
        console.log(
          `[Kick] WebSocket disconnected, reconnecting in ${delay}ms (attempt ${reconnectAttempts})`,
        );
        reconnectTimer = window.setTimeout(connect, delay);
      };

      const connect = () => {
        if (intentionalClose) return;

        const socket = new WebSocket(
          "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false",
        );
        ws = socket;

        socket.onopen = () => {
          console.log("[Kick] WebSocket connected");
          reconnectAttempts = 0;
        for (const channelName of kickSubChannels(chatroomId)) {
          socket.send(
            JSON.stringify({
              event: "pusher:subscribe",
              data: { channel: channelName },
            }),
          );
          console.log("[Kick] Subscribing to channel:", channelName);
        }
      };

      const seenGifts = new Set<string>();
      const recentEvents: { key: string; at: number }[] = [];
      const isDuplicate = (key: string): boolean => {
        const now = Date.now();
        for (let i = recentEvents.length - 1; i >= 0; i--) {
          if (now - recentEvents[i].at > KICK_DUPLICATE_WINDOW_MS) {
            recentEvents.splice(i, 1);
          }
        }
        if (recentEvents.some(e => e.key === key)) return true;
        recentEvents.push({ key, at: now });
        return false;
      };

        socket.onmessage = event => {
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
          if (eventName === "pusher:ping") {
            socket.send(JSON.stringify({ event: "pusher:pong" }));
            return;
          }

          if (eventName === "pusher_internal:subscription_succeeded") {
            console.log("[Kick] Subscribed to channel");
            kickConnectedRef.current = true;
            syncJoined();
            return;
          }

          const isSubOrGiftEvent =
            eventName === "App\\Events\\SubscriptionEvent" ||
            eventName === "GiftedSubscriptionsEvent";
          const isChatMessageEvent =
            eventName === "App\\Events\\ChatMessageEvent";

          if (isSubOrGiftEvent || isChatMessageEvent) {
            const eventKey = `${eventName}|${
              typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data ?? null)
            }`;
            if (isDuplicate(eventKey)) return;
          }

          if (isSubOrGiftEvent) {
            const payload = parsePayload(response.data);
            console.debug("[SubSprout] Kick sub/gift event:", eventName, payload);
            const count = kickSubCount(eventName, payload, seenGifts);
            if (count > 0) {
              handleSubEvent(count);
            }
            return;
          }

          if (isChatMessageEvent && response.data) {
            const payload = parsePayload(response.data);
            const content =
              payload && typeof payload.content === "string"
                ? payload.content
                : "";
            const sender =
              payload && typeof payload.sender === "object"
                ? (payload.sender as Record<string, unknown>)
                : null;
            const identity =
              sender && typeof sender.identity === "object"
                ? (sender.identity as Record<string, unknown>)
                : null;
            const badges = Array.isArray(identity?.badges)
              ? (identity.badges as { type?: unknown }[])
              : [];
            const badgeTypes = new Set(
              badges.map(b =>
                typeof b.type === "string" ? b.type.toLowerCase() : "",
              ),
            );
            const isMod =
              sender?.is_moderator === true || badgeTypes.has("moderator");
            const isBroadcaster =
              sender?.is_broadcaster === true || badgeTypes.has("broadcaster");

            if (
              content.toLowerCase().trim() === "!grow" &&
              (isMod || isBroadcaster)
            ) {
              handleSubEvent(1);
            }
          }
        } catch (e) {
          // ignore parse errors
        }
      };

        socket.onerror = error => {
          console.error("[Kick] WebSocket error:", error);
        };

        socket.onclose = () => {
          console.log("[Kick] WebSocket disconnected");
          kickConnectedRef.current = false;
          syncJoined();
          scheduleReconnect();
        };
      };

      connect();

      return () => {
        intentionalClose = true;
        if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
        ws?.close();
        ws = null;
      };
    };

    const cleanups: Array<() => void> = [];

    if (twitchChannel) {
      loadComfy(twitchChannel);
      cleanups.push(() => {
        comfyDisposed = true;
        comfyClient?.disconnect();
        comfyClient = null;
      });
    }

    if (kickChannel && effectiveKickId) {
      const kickCleanup = loadKick();
      if (kickCleanup) cleanups.push(kickCleanup);
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [twitchChannel, kickChannel, effectiveKickId, handleSubEvent]);

  useEffect(() => {
    if (!activeWaterSlot) return;
    const t = setTimeout(
      () => setActiveWaterSlot(null),
      WATER_EFFECT_DURATION_MS,
    );
    return () => clearTimeout(t);
  }, [activeWaterSlot]);

  if (currentVariety === "vine") {
    const first = slotStates[0] ?? { stagesDone: 0, progress: 0 };
    return (
      <div className="size-full">
        <VineOverlay stage={first.stagesDone} progress={first.progress} />
        {countFx && subCountFx && (
          <SubCountFX count={subCountFx.count} triggerKey={subCountFx.key} />
        )}
      </div>
    );
  }

  if (!usesNewFeatures) {
    const first = slotStates[0] ?? { stagesDone: 0, progress: 0 };
    const step = Math.min(LEGACY_MAX_STEPS, Math.floor(first.stagesDone));
    return (
      <div className="relative size-full">
        <LegacySubSproutSvg step={step} potLabel={potLabel} />
        {countFx && subCountFx && (
          <SubCountFX count={subCountFx.count} triggerKey={subCountFx.key} />
        )}
        {activeWaterSlot && safeWater !== "off" && (
          <WateringFX
            key={activeWaterSlot.key}
            effect={safeWater}
            active
            durationMs={WATER_EFFECT_DURATION_MS}
          />
        )}
      </div>
    );
  }

  const singleSlotX = VIEWBOX_W / 2;
  const singleSlotY = 420;

  const first = slotStates[0] ?? { stagesDone: 0, progress: 0 };

  return (
    <div className="relative size-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        height="100%"
        style={{ backgroundColor: "transparent" }}>
        <PlantSlot
          x={singleSlotX}
          y={singleSlotY}
          variety={currentVariety}
          stage={first.stagesDone}
          progress={first.progress}
        />
        {potLabel && (
          <PotStageLabel
            text={formatPotLabel(
              first.stagesDone,
              getPlant(currentVariety).stages,
            )}
          />
        )}
      </svg>

      {activeWaterSlot && safeWater !== "off" && (
        <WateringFX
          key={activeWaterSlot.key}
          effect={safeWater}
          active
          durationMs={WATER_EFFECT_DURATION_MS}
        />
      )}

      {countFx && subCountFx && (
        <SubCountFX count={subCountFx.count} triggerKey={subCountFx.key} />
      )}
    </div>
  );
}

/** Stage text drawn on the flower pot body (pot spans x 330-470, y 440-550). */
function PotStageLabel({ text }: { text: string }) {
  return (
    <text
      x="400"
      y="505"
      textAnchor="middle"
      fontSize="34"
      fontWeight="800"
      fontFamily="inherit"
      fill="#ffffff"
      stroke="rgba(0,0,0,0.6)"
      strokeWidth="6"
      paintOrder="stroke"
      strokeLinejoin="round"
      style={{ pointerEvents: "none", userSelect: "none" }}>
      {text}
    </text>
  );
}

function LegacySubSproutSvg({ step, potLabel }: { step: number; potLabel: boolean }) {
  const safeStep = Math.max(0, Math.min(LEGACY_MAX_STEPS, step));
  const dashOffset = LEGACY_STEM_OFFSETS[safeStep];
  return (
    <div className="size-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        width="100%"
        height="100%"
        className={`sprout-overlay step-${safeStep}`}
        style={{ backgroundColor: "transparent" }}>
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
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 0.6s ease-in-out",
          }}
        />

        <g transform="translate(396, 395) rotate(-10)">
          <g
            style={{
              transformOrigin: "0 0",
              transform: safeStep >= 1 ? "scale(0.5)" : "scale(0)",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
            <use href="#leaf-l" />
          </g>
        </g>
        <g transform="translate(398, 380) rotate(15)">
          <g
            style={{
              transformOrigin: "0 0",
              transform: safeStep >= 1 ? "scale(0.6)" : "scale(0)",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
            <use href="#leaf-r" />
          </g>
        </g>

        <g transform="translate(392, 330) rotate(-15)">
          <g
            className="leaf leaf-1"
            style={{
              transform: safeStep >= 3 ? "scale(1)" : "scale(0)",
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
              transform: safeStep >= 5 ? "scale(1)" : "scale(0)",
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
              transform: safeStep >= 7 ? "scale(0.9)" : "scale(0)",
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
              transform: safeStep >= 9 ? "scale(0.85)" : "scale(0)",
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
        {potLabel && <PotStageLabel text={formatPotLabel(step, LEGACY_MAX_STEPS)} />}
      </svg>
    </div>
  );
}

export { PLANT_REGISTRY };
