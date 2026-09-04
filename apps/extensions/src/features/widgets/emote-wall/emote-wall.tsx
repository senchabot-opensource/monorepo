import React from 'react';
import { use7tvEmotes } from '#/features/widgets/chat-widget/use-7tv-emotes';
import { KickChat, type KickChannelInfo } from '#/lib/kick';
import { TwitchChat } from '#/lib/twitch';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import {
  checkHype,
  createSpamState,
  filterSpam,
  getAnyEmoteUrls,
  getEmoteOnlyUrls,
  isSubscriberMessage,
  type HypeState,
  type SpamState,
} from './emote-utils';
import {
  bounceStep,
  createBouncePop,
  createCalmPop,
  createChaosPop,
  type BouncePop,
  type ChaosPop,
  type EmotePop,
  type EmoteWallMode,
} from './emote-pops';

export type { EmoteWallMode };
export type EmoteWallProps = {
  twitchChannel?: string | null;
  kickChatroomId?: string | null;
  sevenTvEnabled?: boolean;
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
};

const MOCK_EMOTES: { name: string; src: string; source: 'twitch' | '7tv' }[] = [
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
];

const CHAOS_FADE_MS = 350;
const BOUNCE_FADE_MS = 400;

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
  kickChatroomId,
  sevenTvEnabled = true,
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
}: EmoteWallProps) {
  const normalizedTwitch = twitchChannel?.trim() || null;
  const normalizedKick = kickChatroomId?.trim() || null;

  const sevenTvMap = use7tvEmotes(
    sevenTvEnabled ? normalizedTwitch : null,
  );
  const sevenTvRef = React.useRef(sevenTvMap);
  React.useEffect(() => {
    sevenTvRef.current = sevenTvMap;
  }, [sevenTvMap]);

  // Read live inside the chat callback so toggles apply without reconnecting.
  const subsOnlyRef = React.useRef(subsOnly);
  const subDurationX2Ref = React.useRef(subDurationX2);
  const showAllEmotesRef = React.useRef(showAllEmotes);
  const hypeModeRef = React.useRef(hypeMode);
  const spamBlockRef = React.useRef(spamBlock);
  React.useEffect(() => {
    subsOnlyRef.current = subsOnly;
    subDurationX2Ref.current = subDurationX2;
    showAllEmotesRef.current = showAllEmotes;
    hypeModeRef.current = hypeMode;
    spamBlockRef.current = spamBlock;
  }, [subsOnly, subDurationX2, showAllEmotes, hypeMode, spamBlock]);

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
        if (mode === 'chaos') {
          return { kind: 'chaos', id, name, ...createChaosPop(src, emoteSize, effectiveDuration) };
        }
        if (mode === 'bounce') {
          return { kind: 'bounce', id, name, ...createBouncePop(src, emoteSize, effectiveDuration) };
        }
        return { kind: 'calm', id, name, ...createCalmPop(src, emoteSize, effectiveDuration) };
      });

      setPops((prev) => {
        const next = [...prev, ...fresh];
        // Drop oldest (chaos/bounce timers clean themselves up on unmount).
        if (next.length > maxEmotes) {
          return next.slice(next.length - maxEmotes);
        }
        return next;
      });

      // Calm pops are removed by a fixed timer; chaos/bounce pops remove
      // themselves via their flight components once they vanish.
      if (mode === 'calm') {
        for (const pop of fresh) {
          if (pop.kind !== 'calm') continue;
          const t = setTimeout(() => {
            timeoutsRef.current.delete(t);
            removePop(pop.id);
          }, pop.duration * 1000 + 150);
          timeoutsRef.current.add(t);
        }
      }
    },
    [emoteSize, durationSec, maxEmotes, mode, removePop],
  );

  // Live chat -> emote-only detection.
  React.useEffect(() => {
    if (mock) return;
    if (!normalizedTwitch && !normalizedKick) return;

    const handleMessage = (msg: ChatMessagesType) => {
      const isSub = isSubscriberMessage(msg);
      if (subsOnlyRef.current && !isSub) return;
      const chatInput = {
        message: msg.message,
        platform: msg.platform,
        emotes: msg.emotes,
      };
      const urls = showAllEmotesRef.current
        ? getAnyEmoteUrls(chatInput, sevenTvRef.current)
        : getEmoteOnlyUrls(chatInput, sevenTvRef.current);
      if (urls.length === 0) return;

      const userLower = msg.user.toLowerCase();
      const now = Date.now();

      // General spam prevention: same user flooding the same emote or
      // emote messages in a short time gets filtered out.
      let fresh = urls;
      if (spamBlockRef.current) {
        fresh = filterSpam(spamRef.current, userLower, urls, now);
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
    };

    const clients: { disconnect: () => void }[] = [];
    if (normalizedTwitch) {
      clients.push(new TwitchChat(normalizedTwitch, handleMessage));
    }
    if (normalizedKick) {
      clients.push(new KickChat(normalizedKick, handleMessage));
    }

    return () => {
      for (const c of clients) c.disconnect();
    };
  }, [normalizedTwitch, normalizedKick, mock, spawnUrls]);

  // Mock mode for setup preview / browser-source testing.
  // Honors the 7TV toggle so the preview matches live behavior.
  // Mock emotes count as subscriber emotes so subsOnly previews stay alive.
  // Mock bypasses hype/spam gates (no user identity) to keep previewing visuals.
  React.useEffect(() => {
    if (!mock) return;
    const fast = mode !== 'calm';
    const pool = sevenTvEnabled
      ? MOCK_EMOTES
      : MOCK_EMOTES.filter((e) => e.source !== '7tv');
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
  }, [mock, mode, sevenTvEnabled, subDurationX2, durationSec, spawnUrls]);

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
        ) : pop.kind === 'bounce' ? (
          <BounceEmote
            key={pop.id}
            pop={pop}
            onDone={removePop}
            registry={bounceRegistry}
          />
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

export type { KickChannelInfo };
