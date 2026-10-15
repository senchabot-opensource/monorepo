import {
  type CSSProperties,
  cloneElement,
  isValidElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, type Skin, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { type FeaturedSettings, FEATURED_STAGE as STAGE } from '#/lib/featured-url';
import { useI18n } from '#/lib/i18n';
import type { ChatMessagesType } from '../chat-widget/chat-messages';
import { getAccessibleColor } from '../chat-widget/color-utils';
import {
  type KickSubBadges,
  MessageBadges,
  PlatformIcon,
  parseEmotes,
  renderThirdPartyEmotes,
} from '../chat-widget/message-parts';
import { useTwitchBadges } from '../chat-widget/use-badges';
import { type EmoteMap, useChannelEmotes } from '../chat-widget/use-channel-emotes';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor, PLATFORM_COLORS } from '../overlay-style';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useFitScale } from '../use-fit-scale';
import type { ShownLine } from './featured-state';
import { SIM_EMOTES, useFeatured } from './use-featured';

const RADIUS = 16;
/** Room around the card inside the stage, in px. */
const INSET = 12;
const LEAVE_MS = 350;
/** The message's size steps, in em of the card's text size: a long one shrinks, then clamps. */
const TEXT_STEPS = [1.75, 1.5, 1.3, 1.15, 1];
const LINE_HEIGHT = 1.25;

const CSS = `
.fm-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.fm-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.fm-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.5)}
.fm-title{font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.fm-text img{height:1.3em;width:auto;margin:0 .06em;vertical-align:-.3em}
@keyframes fm-in{0%{transform:translateY(22px);opacity:0}100%{transform:none;opacity:1}}
@keyframes fm-out{0%{transform:none;opacity:1}100%{transform:translateY(14px);opacity:0}}
@media (prefers-reduced-motion:reduce){.fm-card{animation-duration:1ms!important}}
`;

// Every provider on: a featured message shows what chat showed.
const ALL_PROVIDERS = { sevenTv: true, bttv: true, ffz: true };
const NO_PROVIDERS = { sevenTv: false, bttv: false, ffz: false };
const SIM_EMOTE_MAPS: Record<SubathonPlatform, EmoteMap> = { twitch: SIM_EMOTES, kick: SIM_EMOTES };
const NO_SUB_BADGES: KickSubBadges = [];
const EPOCH = new Date(0);

/** Light text on the preset's panel means a dark panel, which name colors are lifted for. */
function isLightText(color: string): boolean {
  const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(color.trim());
  if (!match) return true;
  const [r, g, b] = match.slice(1).map((hex) => Number.parseInt(hex, 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128;
}

// Twitch emotes come at 1x from the shared chat parts; on a card this size that blurs.
const TWITCH_EMOTE_1X = /(\/emoticons\/v2\/[^/]+\/default\/dark\/)1\.0$/;
const sharpEmotes = (nodes: ReactNode[]) =>
  nodes.map((node) => {
    if (!isValidElement<{ src?: unknown }>(node) || typeof node.props.src !== 'string') return node;
    const src = node.props.src;
    return TWITCH_EMOTE_1X.test(src)
      ? cloneElement(node, { src: src.replace(TWITCH_EMOTE_1X, (_, base) => `${base}3.0`) })
      : node;
  });

interface FeaturedWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<FeaturedSettings, 'platforms'>;
  simulate?: boolean;
  /** With simulate: only this platform's chatters. */
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function FeaturedWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate = false,
  simPlatform,
  previewId,
}: FeaturedWidgetProps) {
  const scale = useFitScale(STAGE);
  const { view, kickChannel: kickInfo } = useFeatured({
    twitch: twitchChannel,
    kick: kickChannel,
    mode: settings.mode,
    hide: settings.hide,
    simulate,
    simPlatform,
    previewId,
  });
  const twitchBadgeMap = useTwitchBadges(simulate ? null : twitchChannel);
  const loaded = useChannelEmotes(
    simulate ? null : twitchChannel,
    simulate ? null : (kickInfo?.userId ?? null),
    simulate ? NO_PROVIDERS : ALL_PROVIDERS,
  );
  const emotes = simulate ? SIM_EMOTE_MAPS : loaded;
  const skin = skinFor(settings.preset, settings.fx, settings.font);
  const hsl = painter(skin, hueFor(settings.color, 1));
  const present = usePresence(view.shown);
  const waiting = settings.waiting && settings.mode !== 'feature' ? view.questions.length : 0;

  return (
    <SkinProvider skin={skin}>
      <div
        className="fm-root"
        data-testid="featured"
        data-mode={settings.mode}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('fm', skin)}</style>
        <div className="fm-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <div
            style={{
              position: 'absolute',
              left: INSET,
              right: INSET,
              bottom: INSET,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              fontSize: (16 * settings.size) / 100,
            }}
          >
            {present ? (
              <Card
                key={`${present.line.kind}:${present.line.id}:${present.line.at}`}
                line={present.line}
                leaving={present.leaving}
                waiting={waiting}
                hsl={hsl}
                emotes={emotes[present.line.platform]}
                twitchBadgeMap={twitchBadgeMap}
                kickSubBadges={kickInfo?.subscriberBadges ?? NO_SUB_BADGES}
              />
            ) : (
              waiting > 0 && <WaitingBadge count={waiting} hsl={hsl} alone />
            )}
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

/** What is up, kept a moment after it goes so it can fade out. */
function usePresence(shown: ShownLine | null) {
  const [present, setPresent] = useState(shown && { line: shown, leaving: false });
  useEffect(() => {
    if (shown) {
      setPresent({ line: shown, leaving: false });
      return;
    }
    setPresent((current) => current && { ...current, leaving: true });
    const timer = window.setTimeout(() => setPresent(null), LEAVE_MS);
    return () => window.clearTimeout(timer);
  }, [shown]);
  return present;
}

type Paint = ReturnType<typeof painter>;

function panelFor(skin: Skin | null, hsl: Paint): CSSProperties {
  if (skin) return panelStyle(skin, RADIUS);
  return {
    borderRadius: RADIUS,
    background: 'linear-gradient(180deg, rgba(20,20,26,.92) 0%, rgba(8,8,12,.95) 100%)',
    boxShadow: `inset 5px 0 0 ${hsl(85, 60)}, 0 0 0 2px ${hsl(85, 55, 0.5)}, 0 0 30px ${hsl(85, 50, 0.25)}, 0 14px 34px rgba(0,0,0,.45)`,
  };
}

function Card({
  line,
  leaving,
  waiting,
  hsl,
  emotes,
  twitchBadgeMap,
  kickSubBadges,
}: {
  line: ShownLine;
  leaving: boolean;
  waiting: number;
  hsl: Paint;
  emotes: EmoteMap;
  twitchBadgeMap: Map<string, string> | null;
  kickSubBadges: KickSubBadges;
}) {
  const { t } = useI18n();
  const skin = useSkin();
  const msg: ChatMessagesType = useMemo(
    () => ({
      id: line.id,
      user: line.name,
      message: line.message,
      platform: line.platform,
      timestamp: EPOCH,
      receivedAt: EPOCH,
      badges: line.badges,
    }),
    [line],
  );
  const content = useMemo(
    () =>
      sharpEmotes(
        renderThirdPartyEmotes(parseEmotes(line.message, line.platform, line.emotes), emotes),
      ),
    [line, emotes],
  );
  const nameColor = getAccessibleColor(line.color, !skin || isLightText(skin.text)) ?? hsl(90, 72);

  return (
    <div
      className="fm-card"
      data-testid="featured-card"
      data-kind={line.kind}
      data-platform={line.platform}
      data-leaving={leaving}
      style={{
        ...panelFor(skin, hsl),
        position: 'relative',
        boxSizing: 'border-box',
        width: '100%',
        maxHeight: STAGE.height - 2 * INSET,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45em',
        padding: '0.85em 1.3em 0.95em 1.45em',
        animation: leaving
          ? `fm-out ${LEAVE_MS}ms ease-in both`
          : 'fm-in 450ms cubic-bezier(.2,.9,.3,1.15) both',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4em',
          minWidth: 0,
          flexShrink: 0,
          fontSize: '1.375em',
          lineHeight: 1.2,
        }}
      >
        {line.kind === 'question' && (
          <span
            data-testid="featured-label"
            className="fm-title"
            style={{
              flexShrink: 0,
              padding: '0.15em 0.55em',
              borderRadius: 999,
              fontSize: '0.62em',
              color: '#0b0b0f',
              background: hsl(85, 62),
            }}
          >
            {t('featured.overlay.question')}
          </span>
        )}
        <span
          aria-hidden="true"
          style={{ display: 'inline-flex', flexShrink: 0, color: PLATFORM_COLORS[line.platform] }}
        >
          <PlatformIcon platform={line.platform} />
        </span>
        <MessageBadges msg={msg} twitchBadgeMap={twitchBadgeMap} kickSubBadges={kickSubBadges} />
        <span
          data-testid="featured-name"
          className="fm-shadow"
          style={{
            minWidth: 0,
            fontWeight: 800,
            color: nameColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {line.name}
        </span>
        {waiting > 0 && <WaitingBadge count={waiting} hsl={hsl} />}
      </div>
      <FitText>{content}</FitText>
      {skin && <Frame skin={skin} radius={RADIUS} card />}
    </div>
  );
}

/**
 * The message at the biggest step that fits the card; past the smallest step it clamps to the
 * lines that fit. Measured again when emotes load and make it taller.
 */
function FitText({ children }: { children: ReactNode }) {
  const skin = useSkin();
  const boxRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [clamp, setClamp] = useState(0);
  const [, setMeasure] = useState(0);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || box.scrollHeight <= box.clientHeight + 1) return;
    if (step < TEXT_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    const lineHeight = Number.parseFloat(getComputedStyle(box).lineHeight);
    if (!(lineHeight > 0)) return;
    const lines = Math.max(1, Math.floor(box.clientHeight / lineHeight));
    if (lines !== clamp) setClamp(lines);
  });

  useEffect(() => {
    const content = boxRef.current?.firstElementChild;
    if (!content) return;
    const observer = new ResizeObserver(() => setMeasure((n) => n + 1));
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      data-testid="featured-text"
      className="fm-text fm-shadow"
      style={{
        flex: '0 1 auto',
        minHeight: 0,
        overflow: 'hidden',
        fontSize: `${TEXT_STEPS[step]}em`,
        lineHeight: LINE_HEIGHT,
        fontWeight: 600,
        color: skin?.text ?? '#fff',
        overflowWrap: 'anywhere',
        ...(clamp > 0
          ? { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: clamp }
          : {}),
      }}
    >
      <div>{children}</div>
    </div>
  );
}

function WaitingBadge({ count, hsl, alone }: { count: number; hsl: Paint; alone?: boolean }) {
  const { t } = useI18n();
  const skin = useSkin();
  const panel: CSSProperties = alone
    ? { ...panelFor(skin, hsl), borderRadius: 999, padding: '0.45em 0.95em' }
    : {
        padding: '0.2em 0.65em',
        borderRadius: 999,
        background: skin ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.1)',
      };
  return (
    <span
      data-testid="featured-waiting"
      className="fm-shadow"
      style={{
        ...panel,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45em',
        flexShrink: 0,
        marginLeft: alone ? undefined : 'auto',
        fontSize: alone ? '0.95em' : '0.62em',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        color: skin?.muted ?? 'rgba(255,255,255,.82)',
        animation: alone ? 'fm-in 450ms ease-out both' : undefined,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '0.55em',
          height: '0.55em',
          borderRadius: '50%',
          background: hsl(85, 62),
        }}
      />
      {t(count === 1 ? 'featured.overlay.waitingOne' : 'featured.overlay.waitingMany', { count })}
    </span>
  );
}
