import React from 'react';
import { useChannelEmotes } from '#/features/widgets/chat-widget/use-channel-emotes';
import { loadChannelEmotes } from '#/features/widgets/countdown/countdown-emotes';
import { useRetryingEffect } from '#/hooks/use-retrying-effect';
import { KickChat } from '#/lib/kick';
import { TwitchChat } from '#/lib/twitch';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import {
  bttvEmoteUrl,
  channelSubEmoteKeys,
  checkHype,
  createSpamState,
  filterSpam,
  getAnyEmoteUrls,
  getEmoteOnlyUrls,
  isSubscriberMessage,
  nativeEmoteKey,
  type HypeState,
  type SpamState,
} from './emote-utils';
import {
  bounceStep,
  createBouncePop,
  createBurstParticles,
  createBurstPop,
  createCalmPop,
  createChaosPop,
  createGlidePop,
  createSpinPop,
  randomWallMode,
  type BouncePop,
  type BurstPop,
  type ChaosPop,
  type EmotePop,
  type EmoteWallMode,
  type GlidePop,
} from './emote-pops';

export type { EmoteWallMode };
export type EmoteWallProps = {
  twitchChannel?: string | null;
  kickChannel?: string | null;
  kickChatroomId?: string | null;
  kickUserId?: string | null;
  sevenTvEnabled?: boolean;
  bttvEnabled?: boolean;
  ffzEnabled?: boolean;
  emoteSize?: number;
  durationSec?: number;
  maxEmotes?: number;
  mock?: boolean;
  mode?: EmoteWallMode;
  subsOnly?: boolean;
  subDurationX2?: boolean;
  showAllEmotes?: boolean;
  hypeMode?: boolean;
  spamBlock?: boolean;
  subEmotes?: boolean;
};

const MOCK_EMOTES: { name: string; src: string; source: 'twitch' | '7tv' | 'bttv' | 'ffz' }[] = [
  // Verified Twitch globals (emote 88/PogChamp was removed by Twitch -> 404).
  { name: 'Kappa', src: 'https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0', source: 'twitch' },
  { name: 'Keepo', src: 'https://static-cdn.jtvnw.net/emoticons/v2/1902/default/dark/3.0', source: 'twitch' },
  { name: 'Jebaited', src: 'https://static-cdn.jtvnw.net/emoticons/v2/114836/default/dark/3.0', source: 'twitch' },
  { name: 'DansGame', src: 'https://static-cdn.jtvnw.net/emoticons/v2/33/default/dark/3.0', source: 'twitch' },
  // Verified 7TV globals so the preview covers 7TV rendering too.
  { name: 'RainTime', src: 'https://cdn.7tv.app/emote/01FCY771D800007PQ2DF3GDTN6/4x.webp', source: '7tv' },
  { name: 'PepePls', src: 'https://cdn.7tv.app/emote/01GAFTZ9K80003DHH026MC7JW0/4x.webp', source: '7tv' },
  { name: 'peepoHappy', src: 'https://cdn.7tv.app/emote/01GAZ199Z8000FEWHS6AT5QZV0/4x.webp', source: '7tv' },
  { name: 'FeelsDankMan', src: 'https://cdn.7tv.app/emote/01GB9W8JN80004CKF2H1TWA99H/4x.webp', source: '7tv' },
  { name: 'PartyParrot', src: 'https://cdn.7tv.app/emote/01FKSDK14G0008TM5NY9QEG0QV/4x.webp', source: '7tv' },
  // Verified BTTV/FFZ globals (shapes trimmed from live API responses) for their previews.
  { name: ':tf:', src: bttvEmoteUrl('54fa8f1401e468494b85b537'), source: 'bttv' },
  { name: 'ZrehplaR', src: 'https://cdn.frankerfacez.com/emote/9/2', source: 'ffz' },
];

const CHAOS_FADE_MS = 350;
const BOUNCE_FADE_MS = 400;
const GLIDE_FADE_MS = 350;
const BURST_DONE_BUFFER_MS = 1150;
const BURST_FADE_MS = 350;

// NOTE: animated emotes intentionally have no CSS `filter` (e.g.
// drop-shadow). Transform/opacity animations composite for free, but any
// filter forces a repaint of every emote on every frame.

/** Mutable flight record driven by the single shared bounce loop. */
type BounceRecord = {
  el: HTMLImageElement;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
};

/**
 * Chaos flight: kicks off a linear edge-to-edge zip on mount,
 * fades out at a random point past halfway, then reports completion.
 * Memoized: pop objects are never mutated, so a parent re-render caused by
 * a sibling spawn/removal must not re-render settled flights.
 */
const ChaosEmote = React.memo(function ChaosEmote({
  pop,
  onDone,
}: {
  pop: ChaosPop;
  onDone: (id: string) => void;
}) {
  const [launched, setLaunched] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setLaunched(true));
    });
    const fadeAt = pop.travelMs * pop.vanishAt;
    const fadeTimer = setTimeout(() => setFading(true), fadeAt);
    const doneTimer = setTimeout(() => onDone(pop.id), fadeAt + CHAOS_FADE_MS + 50);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [pop.id, pop.travelMs, pop.vanishAt, onDone]);

  return (
    <img
      src={pop.src}
      alt={pop.name ?? ''}
      draggable={false}
      decoding="async"
      className="absolute object-contain select-none"
      style={{
        left: `${pop.startXPct}%`,
        top: `${pop.startYPct}%`,
        width: pop.size,
        height: pop.size,
        opacity: fading ? 0 : launched ? 1 : 0,
        transform: launched
          ? `translate(${pop.dxVw}vw, ${pop.dyVh}vh)`
          : 'translate(0, 0)',
        transition: `transform ${pop.travelMs}ms linear, opacity 300ms ease-out`,
        willChange: 'transform, opacity',
      }}
    />
  );
});

/**
 * Glide flight: drifts down from the top edge on mount, swaying slightly
 * side to side, fades out near the bottom, then reports completion. The
 * fall lives on the wrapper while the inner img sways, so both transforms
 * compose without repaints. Memoized for the same reason as ChaosEmote.
 */
const GlideEmote = React.memo(function GlideEmote({
  pop,
  onDone,
}: {
  pop: GlidePop;
  onDone: (id: string) => void;
}) {
  const [launched, setLaunched] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setLaunched(true));
    });
    const fadeAt = pop.travelMs * pop.vanishAt;
    const fadeTimer = setTimeout(() => setFading(true), fadeAt);
    const doneTimer = setTimeout(() => onDone(pop.id), fadeAt + GLIDE_FADE_MS + 50);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [pop.id, pop.travelMs, pop.vanishAt, onDone]);

  return (
    <div
      className="absolute select-none"
      style={{
        left: `${pop.startXPct}%`,
        top: `${pop.startYPct}%`,
        width: pop.size,
        height: pop.size,
        opacity: fading ? 0 : launched ? 1 : 0,
        transform: launched
          ? `translate(${pop.dxVw}vw, ${pop.dyVh}vh)`
          : 'translate(0, 0)',
        transition: `transform ${pop.travelMs}ms linear, opacity 300ms ease-out`,
        willChange: 'transform, opacity',
      }}
    >
      <img
        src={pop.src}
        alt={pop.name ?? ''}
        draggable={false}
        decoding="async"
        className="emote-glide-sway object-contain"
        style={
          {
            width: '100%',
            height: '100%',
            ['--sway-x' as string]: `${pop.swayPx}px`,
            animationDuration: `${pop.swayMs}ms`,
          } as React.CSSProperties
        }
      />
    </div>
  );
});

/**
 * Burst flight: fades in at a random spot, lingers, then pops into emote
 * fragments and colored sparks before its time ends (or, on a losing roll,
 * just fades out). Fragments render on a small transient canvas with a
 * per-pop rAF loop; lifecycle timers own removal so a stuck frame can never
 * leave a pop behind. Memoized like the other flights.
 */
const BurstEmote = React.memo(function BurstEmote({
  pop,
  onDone,
}: {
  pop: BurstPop;
  onDone: (id: string) => void;
}) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [launched, setLaunched] = React.useState(false);
  const [bursting, setBursting] = React.useState(false);
  const [fading, setFading] = React.useState(false);
  // Wide enough to contain the fastest fragments for their whole life.
  const side = Math.ceil(pop.size * 4);

  React.useEffect(() => {
    const showTimer = setTimeout(() => setLaunched(true), 30);
    const burstTimer = setTimeout(() => {
      if (pop.burst) setBursting(true);
      else setFading(true);
    }, pop.lingerMs);
    const doneTimer = setTimeout(
      () => onDone(pop.id),
      pop.lingerMs + (pop.burst ? BURST_DONE_BUFFER_MS : BURST_FADE_MS + 100),
    );
    return () => {
      clearTimeout(showTimer);
      clearTimeout(burstTimer);
      clearTimeout(doneTimer);
    };
  }, [pop, onDone]);

  React.useEffect(() => {
    if (!bursting) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const source = imgRef.current;
    // Without a loaded image there is nothing to fragment; sparks fly alone.
    const img = source?.complete && source.naturalWidth > 0 ? source : null;
    // Fragments inherit the drift so the burst keeps moving with the emote.
    const driftBoost = { vx: (pop.dx / pop.lingerMs) * 1000, vy: (pop.dy / pop.lingerMs) * 1000 };
    const parts = createBurstParticles(side / 2, side / 2, pop.size, img, driftBoost);
    const gravity = pop.size * 4;
    let raf = 0;
    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, side, side);
      let alive = false;
      for (const p of parts) {
        p.life += dt;
        if (p.life >= p.maxLife) continue;
        alive = true;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += gravity * dt;
        p.rot += p.vr * dt;
        const alpha = 1 - p.life / p.maxLife;
        if (p.spark) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else if (p.img) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = alpha;
          ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      if (alive) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [bursting, pop, side]);

  return (
    <div
      className="absolute select-none"
      style={{
        left: `${pop.xPct}%`,
        top: `${pop.yPct}%`,
        width: pop.size,
        height: pop.size,
        // Steady linear drift for the whole linger, so the burst happens
        // mid-motion where the emote drifted to (the canvas rides along).
        transform: launched ? `translate(${pop.dx}px, ${pop.dy}px)` : 'translate(0, 0)',
        transition: `transform ${pop.lingerMs}ms linear`,
        willChange: 'transform',
      }}
    >
      <img
        ref={imgRef}
        src={pop.src}
        alt={pop.name ?? ''}
        draggable={false}
        decoding="async"
        className="object-contain"
        style={{
          width: '100%',
          height: '100%',
          opacity: bursting || fading ? 0 : launched ? 1 : 0,
          transform: launched && !bursting ? 'scale(1)' : 'scale(0.6)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          willChange: 'transform, opacity',
        }}
      />
      <canvas
        ref={canvasRef}
        width={side}
        height={side}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: '50%',
          width: side,
          height: side,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
});

/**
 * Bounce flight: DVD-screensaver ricochet. Physics runs in the single shared
 * loop in EmoteWall (one rAF total, all transforms batched in one pass);
 * this component only registers its flight record, fades out after its
 * visible time, then reports completion. Position updates bypass React state
 * (direct DOM transform) so frames never re-render.
 * Memoized for the same reason as ChaosEmote (see above).
 */
const BounceEmote = React.memo(function BounceEmote({
  pop,
  onDone,
  registry,
}: {
  pop: BouncePop;
  onDone: (id: string) => void;
  registry: { current: Map<string, BounceRecord> };
}) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [launched, setLaunched] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    // Timers are scheduled unconditionally so a pop can never get stuck in
    // state, even if the img ref is unexpectedly unavailable.
    const showTimer = setTimeout(() => setLaunched(true), 30);
    const fadeTimer = setTimeout(() => setFading(true), pop.visibleMs);
    const doneTimer = setTimeout(
      () => onDone(pop.id),
      pop.visibleMs + BOUNCE_FADE_MS + 50,
    );

    const img = imgRef.current;
    if (img) {
      const rec: BounceRecord = {
        el: img,
        x: (pop.startXPct / 100) * window.innerWidth,
        y: (pop.startYPct / 100) * window.innerHeight,
        angle: pop.angle,
        speed: pop.speed,
        size: pop.size,
      };
      img.style.transform = `translate(${rec.x}px, ${rec.y}px)`;
      registry.current.set(pop.id, rec);
    }

    return () => {
      registry.current.delete(pop.id);
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [pop, onDone, registry]);

  return (
    <img
      ref={imgRef}
      src={pop.src}
      alt={pop.name ?? ''}
      draggable={false}
      decoding="async"
      className="absolute object-contain select-none"
      style={{
        left: 0,
        top: 0,
        width: pop.size,
        height: pop.size,
        opacity: fading ? 0 : launched ? 1 : 0,
        transition: 'opacity 350ms ease-out',
        willChange: 'transform, opacity',
      }}
    />
  );
});

export function EmoteWall({
  twitchChannel,
  kickChannel,
  kickChatroomId,
  kickUserId,
  sevenTvEnabled = true,
  bttvEnabled = false,
  ffzEnabled = false,
  emoteSize = 112,
  durationSec = 5,
  maxEmotes = 25,
  mock = false,
  mode = 'calm',
  subsOnly = false,
  subDurationX2 = false,
  showAllEmotes = false,
  hypeMode = false,
  spamBlock = true,
  subEmotes = false,
}: EmoteWallProps) {
  const normalizedTwitch = twitchChannel?.trim() || null;
  const normalizedKick = kickChannel?.trim() || null;
  const normalizedKickChatroom = kickChatroomId?.trim() || null;
  const normalizedKickUserId = kickUserId?.trim() || null;

  // Same provider maps as the chat widget: 7TV/BTTV/FFZ on Twitch, 7TV on
  // Kick (the set linked to the Kick account, else the Twitch one, else global).
  const emoteMaps = useChannelEmotes(normalizedTwitch, normalizedKickUserId, {
    sevenTv: sevenTvEnabled,
    bttv: bttvEnabled,
    ffz: ffzEnabled,
  });
  const emoteMapsRef = React.useRef(emoteMaps);
  React.useEffect(() => {
    emoteMapsRef.current = emoteMaps;
  }, [emoteMaps]);

  // Read live inside the chat callback so toggles apply without reconnecting.
  const subsOnlyRef = React.useRef(subsOnly);
  const subDurationX2Ref = React.useRef(subDurationX2);
  const showAllEmotesRef = React.useRef(showAllEmotes);
  const hypeModeRef = React.useRef(hypeMode);
  const spamBlockRef = React.useRef(spamBlock);
  const subEmotesRef = React.useRef(subEmotes);
  // `platform:id` keys of the channels' subscriber emotes, empty until the
  // channel lookup resolves (like the 7TV map, matching nothing until then).
  const subKeysRef = React.useRef<Set<string>>(new Set());
  React.useEffect(() => {
    subsOnlyRef.current = subsOnly;
    subDurationX2Ref.current = subDurationX2;
    showAllEmotesRef.current = showAllEmotes;
    hypeModeRef.current = hypeMode;
    spamBlockRef.current = spamBlock;
    subEmotesRef.current = subEmotes;
  }, [subsOnly, subDurationX2, showAllEmotes, hypeMode, spamBlock, subEmotes]);

  // Subscriber emote keys for the Sub Emotes Only filter, from the same
  // channel lookup the goal widgets' icon picker uses. Each channel loads
  // and retries on its own, so a Twitch hiccup never stays hidden behind
  // loaded Kick keys (or vice versa). Retried while empty: failed requests
  // are not cached, so a bad minute recovers, while a genuinely empty set
  // resolves from cache without network traffic.
  useRetryingEffect(
    async (isCurrent) => {
      if (!subEmotes) return false;
      const [twitchList, kickList] = await Promise.all([
        normalizedTwitch ? loadChannelEmotes(normalizedTwitch, '') : [],
        normalizedKick ? loadChannelEmotes('', normalizedKick) : [],
      ]);
      if (!isCurrent()) return false;
      const twitchKeys = channelSubEmoteKeys(twitchList);
      const kickKeys = channelSubEmoteKeys(kickList);
      subKeysRef.current = new Set([...twitchKeys, ...kickKeys]);
      return (
        (!!normalizedTwitch && twitchKeys.size === 0) || (!!normalizedKick && kickKeys.size === 0)
      );
    },
    [normalizedTwitch, normalizedKick, subEmotes],
  );

  const hypeRef = React.useRef<HypeState>(new Map());
  const spamRef = React.useRef<SpamState>(createSpamState());
  const bounceRegistry = React.useRef(new Map<string, BounceRecord>());

  const [pops, setPops] = React.useState<EmotePop[]>([]);
  const counterRef = React.useRef(0);
  const timeoutsRef = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const removePop = React.useCallback((id: string) => {
    // Return the same array reference when nothing was removed so React
    // bails out instead of re-rendering (stale calm timers fire after
    // max-cap eviction and must be no-ops).
    setPops((prev) =>
      prev.some((p) => p.id === id) ? prev.filter((p) => p.id !== id) : prev,
    );
  }, []);

  const spawnUrls = React.useCallback(
    (items: { src: string; name?: string }[], durationOverride?: number) => {
      if (items.length === 0) return;
      const effectiveDuration = durationOverride ?? durationSec;
      const now = Date.now();
      const fresh: EmotePop[] = items.map(({ src, name }, i): EmotePop => {
        const id = `emote-${now}-${counterRef.current++}-${i}`;
        // Random rolls a fresh animation for every single emote.
        const m = mode === 'random' ? randomWallMode() : mode;
        if (m === 'chaos') {
          return { kind: 'chaos', id, name, ...createChaosPop(src, emoteSize, effectiveDuration) };
        }
        if (m === 'bounce') {
          return { kind: 'bounce', id, name, ...createBouncePop(src, emoteSize, effectiveDuration) };
        }
        if (m === 'glide') {
          return { kind: 'glide', id, name, ...createGlidePop(src, emoteSize, effectiveDuration) };
        }
        if (m === 'spin') {
          return { kind: 'spin', id, name, ...createSpinPop(src, emoteSize, effectiveDuration) };
        }
        if (m === 'burst') {
          return { kind: 'burst', id, name, ...createBurstPop(src, emoteSize, effectiveDuration) };
        }
        return { kind: 'calm', id, name, ...createCalmPop(src, emoteSize, effectiveDuration) };
      });

      setPops((prev) => {
        const next = [...prev, ...fresh];
        // Drop oldest (chaos/bounce/glide/burst timers clean themselves up on unmount).
        if (next.length > maxEmotes) {
          return next.slice(next.length - maxEmotes);
        }
        return next;
      });

      // Calm and spin pops are removed by a fixed timer; chaos/bounce/glide
      // and burst pops remove themselves via their flight components. Looping
      // over the fresh pops (instead of the mode) also covers Random mixes.
      for (const pop of fresh) {
        if (pop.kind !== 'calm' && pop.kind !== 'spin') continue;
        const t = setTimeout(() => {
          timeoutsRef.current.delete(t);
          removePop(pop.id);
        }, pop.duration * 1000 + 150);
        timeoutsRef.current.add(t);
      }
    },
    [emoteSize, durationSec, maxEmotes, mode, removePop],
  );

  // Live chat -> emote-only detection.
  const handleMessage = React.useCallback(
    (msg: ChatMessagesType) => {
      // The wall only listens to Twitch and Kick; a YouTube row would have no map.
      if (msg.platform !== 'twitch' && msg.platform !== 'kick') return;
      const chatInput = {
        message: msg.message,
        platform: msg.platform,
        emotes: msg.emotes,
      };
      const isSub = isSubscriberMessage({ platform: chatInput.platform, badges: msg.badges });
      if (subsOnlyRef.current && !isSub) return;
      const thirdPartyMap = emoteMapsRef.current[msg.platform];
      const urls = showAllEmotesRef.current
        ? getAnyEmoteUrls(chatInput, thirdPartyMap)
        : getEmoteOnlyUrls(chatInput, thirdPartyMap);
      if (urls.length === 0) return;

      // Sub Emotes Only: keep native emotes whose id is in the channels'
      // subscriber sets. Third-party urls have no native id and drop out.
      let fresh = urls;
      if (subEmotesRef.current) {
        fresh = urls.filter((url) => {
          const key = nativeEmoteKey(chatInput.platform, url);
          return key !== null && subKeysRef.current.has(key);
        });
        if (fresh.length === 0) return;
      }

      const userLower = msg.user.toLowerCase();
      const now = Date.now();

      // General spam prevention: same user flooding the same emote or
      // emote messages in a short time gets filtered out.
      if (spamBlockRef.current) {
        fresh = filterSpam(spamRef.current, userLower, fresh, now);
        if (fresh.length === 0) return;
      }

      // Hype mode: show only once doubled by distinct users' messages.
      if (hypeModeRef.current) {
        fresh = fresh.filter((url) =>
          checkHype(hypeRef.current, url, userLower, now),
        );
        if (fresh.length === 0) return;
      }

      spawnUrls(
        fresh.map((src) => ({ src })),
        subDurationX2Ref.current && isSub ? durationSec * 2 : undefined,
      );
    },
    [durationSec, spawnUrls],
  );

  // One connection each, so a Kick id that arrives late (the lookup retries) leaves Twitch be.
  React.useEffect(() => {
    if (mock || !normalizedTwitch) return;
    const client = new TwitchChat(normalizedTwitch, handleMessage);
    return () => client.disconnect();
  }, [normalizedTwitch, mock, handleMessage]);

  React.useEffect(() => {
    if (mock || !normalizedKickChatroom) return;
    const client = new KickChat(normalizedKickChatroom, handleMessage);
    return () => client.disconnect();
  }, [normalizedKickChatroom, mock, handleMessage]);

  // Mock mode for setup preview / browser-source testing.
  // Honors the provider toggles so the preview matches live behavior.
  // Mock emotes count as subscriber emotes so subsOnly previews stay alive.
  // Mock bypasses hype/spam gates (no user identity) to keep previewing visuals.
  React.useEffect(() => {
    if (!mock) return;
    // Calm, spin and burst emotes linger for most of the visible duration,
    // so the preview spawns them at the slow ambient pace.
    const fast = mode !== 'calm' && mode !== 'spin' && mode !== 'burst';
    const pool = MOCK_EMOTES.filter(
      (e) =>
        e.source === 'twitch' ||
        (e.source === '7tv' && sevenTvEnabled) ||
        (e.source === 'bttv' && bttvEnabled) ||
        (e.source === 'ffz' && ffzEnabled),
    );
    const spawnMock = () => {
      const count = fast
        ? 1 + Math.floor(Math.random() * 3)
        : Math.random() < 0.3
          ? 2
          : 1;
      const items = Array.from(
        { length: count },
        () => pool[Math.floor(Math.random() * pool.length)],
      );
      // Randomly demo the sub 2x duration when enabled.
      const boosted = subDurationX2 && Math.random() < 0.4;
      spawnUrls(items, boosted ? durationSec * 2 : undefined);
    };
    const first = setTimeout(spawnMock, 500);
    const interval = setInterval(spawnMock, fast ? 900 : 2200);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [mock, mode, sevenTvEnabled, bttvEnabled, ffzEnabled, subDurationX2, durationSec, spawnUrls]);

  React.useEffect(
    () => () => {
      for (const t of timeoutsRef.current) clearTimeout(t);
      timeoutsRef.current.clear();
    },
    [],
  );

  // Single shared physics loop for all bounce emotes: one rAF total with
  // every transform batched in one pass. Runs only while bounce pops exist.
  const hasBounce = pops.some((p) => p.kind === 'bounce');
  React.useEffect(() => {
    if (!hasBounce) return;
    let last = performance.now();
    let raf = 0;
    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      for (const rec of bounceRegistry.current.values()) {
        const next = bounceStep(
          rec.x,
          rec.y,
          rec.angle,
          rec.speed,
          dt,
          Math.max(0, vw - rec.size),
          Math.max(0, vh - rec.size),
        );
        rec.x = next.x;
        rec.y = next.y;
        rec.angle = next.angle;
        rec.speed = next.speed;
        rec.el.style.transform = `translate(${next.x}px, ${next.y}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [hasBounce]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden bg-transparent"
      aria-hidden
    >
      {pops.map((pop) =>
        pop.kind === 'chaos' ? (
          <ChaosEmote key={pop.id} pop={pop} onDone={removePop} />
        ) : pop.kind === 'glide' ? (
          <GlideEmote key={pop.id} pop={pop} onDone={removePop} />
        ) : pop.kind === 'bounce' ? (
          <BounceEmote
            key={pop.id}
            pop={pop}
            onDone={removePop}
            registry={bounceRegistry}
          />
        ) : pop.kind === 'spin' ? (
          <img
            key={pop.id}
            src={pop.src}
            alt={pop.name ?? ''}
            draggable={false}
            decoding="async"
            className="emote-wall-spin absolute object-contain select-none"
            style={
              {
                left: `${pop.xPct}%`,
                top: `${pop.yPct}%`,
                width: pop.size,
                height: pop.size,
                ['--spin-duration' as string]: `${pop.duration}s`,
                ['--spin' as string]: `${pop.rotation}deg`,
              } as React.CSSProperties
            }
          />
        ) : pop.kind === 'burst' ? (
          <BurstEmote key={pop.id} pop={pop} onDone={removePop} />
        ) : (
          <img
            key={pop.id}
            src={pop.src}
            alt={pop.name ?? ''}
            draggable={false}
            decoding="async"
            className="emote-wall-pop absolute object-contain select-none"
            style={
              {
                left: `${pop.xPct}%`,
                top: `${pop.yPct}%`,
                width: pop.size,
                height: pop.size,
                ['--drift-x' as string]: `${pop.dx}px`,
                ['--drift-y' as string]: `${pop.dy}px`,
                ['--emote-duration' as string]: `${pop.duration}s`,
                ['--rot-start' as string]: `${-pop.rotation}deg`,
                ['--rot-end' as string]: `${pop.rotation}deg`,
              } as React.CSSProperties
            }
          />
        ),
      )}
    </div>
  );
}

