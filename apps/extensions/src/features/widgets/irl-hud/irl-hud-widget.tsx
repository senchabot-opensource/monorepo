import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import type { HudCorner, HudSettings } from '#/lib/irl-hud-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useShortSideScale } from '../use-fit-scale';
import {
  type ArrowSource,
  canGoIndoors,
  chosenView,
  MOVE_SPEED,
  startingView,
  startKey,
} from './hud-map';
import { formatChange, formatMoney } from './hud-money';
import { HudRadar, RADAR_CSS } from './hud-radar';
import {
  HUD_EDGE_X,
  HUD_EDGE_Y,
  HUD_FONT,
  HUD_LABEL,
  HUD_LOOKS,
  HUD_TEXT_CSS,
  type HudLook,
  Outlined,
} from './hud-text';
import { hashSeed } from './map-graph';
import { type HudPop, POP_MS, useIrlHud } from './use-irl-hud';

/** Sizes are drawn for the short side of a 1920×1080 canvas and scale with it. */
const DESIGN_SHORT_SIDE = 1080;
const ROLL_MS = 1100;

const CSS = `
.ih-root{position:fixed;inset:0;overflow:hidden;pointer-events:none;font-family:${HUD_FONT};
  -webkit-font-smoothing:antialiased;line-height:1}
.ih-hud{position:absolute;display:flex;flex-direction:column;gap:6px}
${HUD_TEXT_CSS}
.ih-pops{position:absolute;display:flex;flex-direction:column;gap:2px}
.ih-pop{display:flex;align-items:baseline;gap:12px;animation:ih-pop ${POP_MS}ms ease-out forwards}
@keyframes ih-pop{0%{opacity:0;transform:translateY(-10px)}10%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0}}
${RADAR_CSS}
`;

const CORNER_ORIGIN: Record<HudCorner, string> = {
  tr: 'top right',
  tl: 'top left',
  br: 'bottom right',
  bl: 'bottom left',
};

const isRight = (corner: HudCorner) => corner === 'tr' || corner === 'br';
const isTop = (corner: HudCorner) => corner === 'tr' || corner === 'tl';

/** Pins something to a scene corner, `zoom` times its design size, growing from that corner. */
const cornerPlace = (corner: HudCorner, scale: number, zoom: number): CSSProperties => ({
  [isTop(corner) ? 'top' : 'bottom']: HUD_EDGE_Y * scale,
  [isRight(corner) ? 'right' : 'left']: HUD_EDGE_X * scale,
  transform: `scale(${zoom})`,
  transformOrigin: CORNER_ORIGIN[corner],
});

/** Counts up (or down) to `target` like an arcade counter, instead of jumping. */
function useRolling(target: number): number {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  useEffect(() => {
    const from = shownRef.current;
    if (from === target) return;
    if (typeof requestAnimationFrame === 'undefined') {
      shownRef.current = target;
      setShown(target);
      return;
    }
    let startedAt: number | null = null;
    let frame = 0;
    const tick = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / ROLL_MS);
      const value = Math.round(from + (target - from) * (1 - (1 - progress) ** 3));
      shownRef.current = value;
      setShown(value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return shown;
}

/** "14:30", or "2:30 PM", in `timeZone` (the computer's own when empty), kept to the minute. */
function useClockText(timeZone: string, h12: boolean): string {
  const format = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        hour: h12 ? 'numeric' : '2-digit',
        minute: '2-digit',
        ...(h12 ? { hour12: true } : { hourCycle: 'h23' as const }),
        ...(timeZone ? { timeZone } : {}),
      }),
    [timeZone, h12],
  );
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return format.format(now);
}

function Pops({ pops, look, corner }: { pops: HudPop[]; look: HudLook; corner: HudCorner }) {
  const right = isRight(corner);
  const top = isTop(corner);
  // They float away from the corner: under the HUD at the top, over it at the bottom.
  const place: CSSProperties = {
    [top ? 'top' : 'bottom']: '100%',
    [right ? 'right' : 'left']: 0,
    alignItems: right ? 'flex-end' : 'flex-start',
    flexDirection: top ? 'column' : 'column-reverse',
    marginTop: top ? 6 : 0,
    marginBottom: top ? 0 : 6,
  };
  return (
    <div className="ih-pops" style={place} data-testid="irl-hud-pops">
      {pops.map((pop) => (
        <div
          key={pop.id}
          className="ih-pop"
          data-platform={pop.platform}
          data-declined={pop.declined || undefined}
          style={{ flexDirection: right ? 'row-reverse' : 'row', opacity: pop.declined ? 0.75 : 1 }}
        >
          <Outlined
            // A refused purchase shows its price behind a cross: nothing came off the cash.
            text={
              pop.declined ? `✕ ${formatChange(-pop.amount).slice(1)}` : formatChange(pop.amount)
            }
            color={pop.amount < 0 ? look.loss : look.gain}
            size={look.popSize}
            outline={look.outline}
          />
          {pop.name && (
            <Outlined
              text={pop.name}
              color={HUD_LABEL}
              size={Math.round(look.popSize * 0.55)}
              outline={look.outline * 1.4}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * A part a mod can hide from chat: it fades out where it stands, so the parts beside it keep
 * their places, and fades back in the same way.
 */
function Part({ hidden, children }: { hidden: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity 400ms ease-out' }}
    >
      {children}
    </div>
  );
}

function Clock({ look, timeZone, h12 }: { look: HudLook; timeZone: string; h12: boolean }) {
  const text = useClockText(timeZone, h12);
  return (
    <Outlined
      text={text}
      color={look.clock}
      size={look.clockSize}
      outline={look.outline}
      fixedDigits
      testId="irl-hud-clock"
    />
  );
}

interface IrlHudWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<HudSettings, 'platforms'>;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
  /**
   * What moves the mini-map's arrow. Today it always walks; a GPS integration would pass `gps`,
   * and a real place could then go indoors into the real building the streamer is in.
   */
  arrowSource?: ArrowSource;
}

export function IrlHudWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simPlatform,
  previewId,
  arrowSource = 'walk',
}: IrlHudWidgetProps) {
  const { money, pops, mapChoice, move, indoor, hidden } = useIrlHud({
    twitch: twitchChannel,
    kick: kickChannel,
    start: settings.start,
    values: settings,
    places: settings.places,
    startMap: startKey(settings),
    startMove: settings.move,
    items: settings.items,
    arrowSource,
    simulate,
    simPlatform,
    previewId,
  });
  const shown = useRolling(money);
  // A mod's !hud map choice, while it still names a saved place or a made-up map; else the URL's.
  const view = (mapChoice && chosenView(mapChoice, settings.places)) || startingView(settings);
  const place = view.map === 'real' ? view.place : null;
  // A walked real place stays outdoors, even with indoors saved from a made-up map earlier.
  const inside = indoor && canGoIndoors(view.map, arrowSource);
  const scale = useShortSideScale(DESIGN_SHORT_SIDE);
  const look = HUD_LOOKS[settings.style];
  const zoom = (scale * settings.size) / 100;
  const { corner } = settings;

  return (
    <div
      className={`ih-root ih-${settings.style}`}
      data-testid="irl-hud"
      data-style={settings.style}
      data-corner={corner}
      data-money={money}
      data-move={move}
      data-indoor={inside}
      data-hidden={hidden.join(' ') || undefined}
    >
      <style>{CSS}</style>
      <div
        className="ih-hud"
        style={{
          ...cornerPlace(corner, scale, zoom),
          alignItems: isRight(corner) ? 'flex-end' : 'flex-start',
        }}
      >
        {settings.clock && (
          <Part hidden={hidden.includes('time')}>
            <Clock look={look} timeZone={settings.tz} h12={settings.h12} />
          </Part>
        )}
        <Part hidden={hidden.includes('cash')}>
          <Outlined
            text={formatMoney(shown, settings.style)}
            color={shown < 0 ? look.debt : look.money}
            size={look.moneySize}
            outline={look.outline}
            fixedDigits
            testId="irl-hud-money"
          />
          {settings.pops && <Pops pops={pops} look={look} corner={corner} />}
        </Part>
      </div>
      {settings.radar && (
        <Part hidden={hidden.includes('map')}>
          <HudRadar
            style={settings.style}
            map={view.map}
            seed={hashSeed(twitchChannel || kickChannel || 'senchabot')}
            lat={place?.lat ?? null}
            lon={place?.lon ?? null}
            speed={MOVE_SPEED[move]}
            indoor={inside}
            place={cornerPlace(settings.radarCorner, scale, zoom)}
          />
        </Part>
      )}
    </div>
  );
}
