import type { HudStyle } from '#/lib/irl-hud-url';

/**
 * The IRL HUD's two looks, shared with the overlays that offer them (the Weather one), so a
 * scene with both reads as one HUD.
 */

/** Heavy, condensed and outlined in black, Anton reads from across the room like a game HUD. */
export const HUD_FONT_URL = 'https://fonts.googleapis.com/css2?family=Anton&display=swap';
export const HUD_FONT = "'Anton', Impact, 'Arial Narrow', sans-serif";

/** Distance from the scene's edges at 1080p. */
export const HUD_EDGE_X = 72;
export const HUD_EDGE_Y = 48;

/** Names and other small print, the same in both looks. */
export const HUD_LABEL = '#f0f0f0';

export interface HudLook {
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
export const HUD_LOOKS: Record<HudStyle, HudLook> = {
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

/** CSS for `Outlined`; an ancestor carries `ih-retro` or `ih-modern`. */
export const HUD_TEXT_CSS = `
.ih-text{display:inline-grid;white-space:nowrap}
.ih-text>span{grid-area:1/1}
.ih-stroke{color:#000}
/* On the whole text: a filter on the outline layer alone would paint it over the fill. */
.ih-modern .ih-text{filter:drop-shadow(0 3px 2px rgba(0,0,0,.55))}
.ih-digit{display:inline-block;width:.5em;text-align:center}
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
