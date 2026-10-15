import type { HudStyle } from '#/lib/irl-hud-url';

/**
 * The IRL HUD's looks, shared with the overlays that offer them (the Weather one), so a scene
 * with both reads as one HUD.
 */

/**
 * Every look's font in one stylesheet; the browser only fetches the font files the scene uses.
 * Anton, heavy and condensed, reads from across the room like a game HUD (Retro and Modern);
 * MedievalSharp draws Medieval, and Cinzel's bold carved capitals, a fantasy MMO's, draw MMORPG.
 */
export const HUD_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Anton&family=Cinzel:wght@700&family=MedievalSharp&display=swap';
export const HUD_FONT = "'Anton', Impact, 'Arial Narrow', sans-serif";

/** Distance from the scene's edges at 1080p. */
export const HUD_EDGE_X = 72;
export const HUD_EDGE_Y = 48;

/** Names and other small print, the same in every look. */
export const HUD_LABEL = '#f0f0f0';

export interface HudLook {
  money: string;
  debt: string;
  clock: string;
  gain: string;
  loss: string;
  /** Gold coins instead of dollars: a coin by the cash and its gains, and no $ sign. */
  coin: boolean;
  /** Font sizes in px at 100%. */
  moneySize: number;
  clockSize: number;
  popSize: number;
  /** The outline's width outside the letters, as a share of the font size. */
  outline: number;
}

// Retro: green money and a grey clock in a thick outline. Modern: white cash, green gains.
// Medieval: gold coins and a parchment clock outlined in dark brown. MMORPG: gold coins, white
// time and gains in an MMO's green.
export const HUD_LOOKS: Record<HudStyle, HudLook> = {
  retro: {
    money: '#548e58',
    debt: '#b4191d',
    clock: '#e1e1e1',
    gain: '#548e58',
    loss: '#b4191d',
    coin: false,
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
    coin: false,
    moneySize: 66,
    clockSize: 40,
    popSize: 46,
    outline: 0.05,
  },
  medieval: {
    money: '#f2c55c',
    debt: '#c8402f',
    clock: '#f1e3c2',
    gain: '#f2c55c',
    loss: '#d0473a',
    coin: true,
    moneySize: 62,
    clockSize: 46,
    popSize: 44,
    outline: 0.08,
  },
  mmorpg: {
    money: '#ffd100',
    debt: '#ff3b30',
    clock: '#ffffff',
    gain: '#1eff00',
    loss: '#ff3b30',
    coin: true,
    moneySize: 60,
    clockSize: 42,
    popSize: 44,
    outline: 0.07,
  },
};

/**
 * CSS for `Outlined` and `Coin`. An ancestor carries `ih-` and the style, which picks the font
 * (`--ih-font`), the width of a counter's digit box (`--ih-digit`, about the font's widest digit)
 * and the outline's color (`--ih-edge`).
 */
export const HUD_TEXT_CSS = `
.ih-retro,.ih-modern{--ih-font:${HUD_FONT};--ih-digit:.5em;--ih-edge:#000}
.ih-medieval{--ih-font:'MedievalSharp','Palatino Linotype',Georgia,serif;--ih-digit:.6em;--ih-edge:#2a1708}
.ih-mmorpg{--ih-font:'Cinzel','Palatino Linotype',Georgia,serif;font-weight:700;--ih-digit:.6em;--ih-edge:#000}
.ih-text{display:inline-grid;white-space:nowrap}
.ih-text>span{grid-area:1/1}
.ih-stroke{color:var(--ih-edge,#000)}
/* On the whole text: a filter on the outline layer alone would paint it over the fill. */
.ih-modern .ih-text,.ih-mmorpg .ih-text{filter:drop-shadow(0 3px 2px rgba(0,0,0,.55))}
.ih-medieval .ih-text{filter:drop-shadow(0 2px 2px rgba(42,23,8,.6))}
.ih-digit{display:inline-block;width:var(--ih-digit,.5em);text-align:center}
.ih-cash{display:inline-flex;align-items:center;gap:.18em}
.ih-coin{flex:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}
`;

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
export function Outlined({
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
  const stroke = `${Math.max(2, Math.round(size * outline * 2))}px var(--ih-edge, #000)`;
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

/**
 * A gold coin as tall as the digits beside it, ringed in the look's outline color: what the
 * Medieval and MMORPG looks count in.
 */
export function Coin({ size }: { size: number }) {
  const width = Math.round(size * 0.74);
  return (
    <svg className="ih-coin" width={width} height={width} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15.5" style={{ fill: 'var(--ih-edge, #000)' }} />
      <circle cx="16" cy="16" r="13" fill="#a87412" />
      <circle cx="16" cy="16" r="11" fill="#f3c443" />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="#c48c1c" strokeWidth="1.8" />
      <path
        d="M10.5 12.5a6.5 6.5 0 0 1 5-4"
        fill="none"
        stroke="#fff4c4"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
