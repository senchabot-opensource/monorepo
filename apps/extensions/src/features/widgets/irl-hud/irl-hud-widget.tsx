import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import type { HudCorner, HudSettings, HudStyle } from '#/lib/irl-hud-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { chosenView, MOVE_SPEED, startingView, startKey } from './hud-map';
import { formatChange, formatMoney } from './hud-money';
import { HudRadar, RADAR_CSS } from './hud-radar';
import { hashSeed } from './map-graph';
import { type HudPop, POP_MS, useIrlHud } from './use-irl-hud';

/** Heavy, condensed and outlined in black, Anton reads from across the room like a game HUD. */
export const HUD_FONT_URL = 'https://fonts.googleapis.com/css2?family=Anton&display=swap';
const HUD_FONT = "'Anton', Impact, 'Arial Narrow', sans-serif";

/** Sizes are drawn for the short side of a 1920×1080 canvas and scale with it. */
const DESIGN_SHORT_SIDE = 1080;
const EDGE_X = 72;
const EDGE_Y = 48;
const ROLL_MS = 1100;

interface StyleLook {
  money: string;
  debt: string;
  clock: string;
  gain: string;
  loss: string;
  /** Font sizes in px at 100%. */
  moneySize: number;
  clockSize: number;
  popSize: number;
  /** The black outline's width outside the letters, as a share of the font size. */
  outline: number;
}

// Retro: green money and a grey clock in a thick outline. Modern: white cash, green gains.
const LOOKS: Record<HudStyle, StyleLook> = {
  retro: {
    money: '#548e58',
    debt: '#b4191d',
    clock: '#e1e1e1',
    gain: '#548e58',
    loss: '#b4191d',
    moneySize: 64,
    clockSize: 64,
    popSize: 44,
    outline: 0.09,
  },
  modern: {
    money: '#f0f0f0',
    debt: '#e03232',
    clock: '#f0f0f0',
    gain: '#72cc72',
    loss: '#e03232',
    moneySize: 66,
    clockSize: 40,
    popSize: 46,
    outline: 0.05,
  },
};

const CSS = `
.ih-root{position:fixed;inset:0;overflow:hidden;pointer-events:none;font-family:${HUD_FONT};
  -webkit-font-smoothing:antialiased;line-height:1}
.ih-hud{position:absolute;display:flex;flex-direction:column;gap:6px}
.ih-text{display:inline-grid;white-space:nowrap}
.ih-text>span{grid-area:1/1}
.ih-stroke{color:#000}
/* On the whole text: a filter on the outline layer alone would paint it over the fill. */
.ih-modern .ih-text{filter:drop-shadow(0 3px 2px rgba(0,0,0,.55))}
.ih-digit{display:inline-block;width:.5em;text-align:center}
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
  [isTop(corner) ? 'top' : 'bottom']: EDGE_Y * scale,
  [isRight(corner) ? 'right' : 'left']: EDGE_X * scale,
  transform: `scale(${zoom})`,
  transformOrigin: CORNER_ORIGIN[corner],
});

/** Scale for the browser source's short side, so a vertical canvas gets a HUD its size too. */
function useShortSideScale(): number {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const measure = () =>
      setScale(Math.min(window.innerWidth, window.innerHeight) / DESIGN_SHORT_SIDE);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return scale;
}

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

const digits = (text: string) =>
  Array.from(text).map((char, index) =>
    /\d/.test(char) ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: the characters only ever change in place.
      <span key={index} className="ih-digit">
        {char}
      </span>
    ) : (
      char
    ),
  );

/** Text in a solid black outline: the outline layer sits under a copy that fills it. */
function Outlined({
  text,
  color,
  size,
  outline,
  fixedDigits = false,
  testId,
}: {
  text: string;
  color: string;
  size: number;
  outline: number;
  /** Each digit in a box of its own width, so a counter doesn't wobble as it rolls. */
  fixedDigits?: boolean;
  testId?: string;
}) {
  const stroke = `${Math.max(2, Math.round(size * outline * 2))}px #000`;
  const content = fixedDigits ? digits(text) : text;
  return (
    <span className="ih-text" style={{ fontSize: size }} data-testid={testId} data-value={text}>
      <span className="ih-stroke" aria-hidden="true" style={{ WebkitTextStroke: stroke }}>
        {content}
      </span>
      <span style={{ color }}>{content}</span>
    </span>
  );
}

function Pops({ pops, look, corner }: { pops: HudPop[]; look: StyleLook; corner: HudCorner }) {
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
              color="#f0f0f0"
              size={Math.round(look.popSize * 0.55)}
              outline={look.outline * 1.4}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Clock({ look, timeZone, h12 }: { look: StyleLook; timeZone: string; h12: boolean }) {
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
}

export function IrlHudWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simPlatform,
  previewId,
}: IrlHudWidgetProps) {
  const { money, pops, mapChoice, move } = useIrlHud({
    twitch: twitchChannel,
    kick: kickChannel,
    start: settings.start,
    values: settings,
    places: settings.places,
    startMap: startKey(settings),
    startMove: settings.move,
    items: settings.items,
    simulate,
    simPlatform,
    previewId,
  });
  const shown = useRolling(money);
  // A mod's !hud map choice, while it still names a saved place or a made-up map; else the URL's.
  const view = (mapChoice && chosenView(mapChoice, settings.places)) || startingView(settings);
  const place = view.map === 'real' ? view.place : null;
  const scale = useShortSideScale();
  const look = LOOKS[settings.style];
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
    >
      <style>{CSS}</style>
      <div
        className="ih-hud"
        style={{
          ...cornerPlace(corner, scale, zoom),
          alignItems: isRight(corner) ? 'flex-end' : 'flex-start',
        }}
      >
        {settings.clock && <Clock look={look} timeZone={settings.tz} h12={settings.h12} />}
        <Outlined
          text={formatMoney(shown, settings.style)}
          color={shown < 0 ? look.debt : look.money}
          size={look.moneySize}
          outline={look.outline}
          fixedDigits
          testId="irl-hud-money"
        />
        {settings.pops && <Pops pops={pops} look={look} corner={corner} />}
      </div>
      {settings.radar && (
        <HudRadar
          style={settings.style}
          map={view.map}
          seed={hashSeed(twitchChannel || kickChannel || 'senchabot')}
          lat={place?.lat ?? null}
          lon={place?.lon ?? null}
          speed={MOVE_SPEED[move]}
          place={cornerPlace(settings.radarCorner, scale, zoom)}
        />
      )}
    </div>
  );
}
