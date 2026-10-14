import type { CSSProperties } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import {
  COUNTER_STAGES,
  type CounterLayout,
  type CounterSettings,
  type CounterSpec,
} from '#/lib/counter-url';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { valueFontSize } from './counter-state';
import { type CounterBump, type CounterPop, POP_MS, useCounter } from './use-counter';

// Row: the counters side by side at the bottom, the pops rising into the band above them.
const ROW_SIDE = 20;
const ROW_BOTTOM = 22;
const ROW_GAP = 16;
const ROW_CELL_HEIGHT = 150;
const ROW_CELL_MAX = 320;
const ROW_PADDING = 16;
// Stack: one counter under another from the top, each a bar with the number on the right. The
// top leaves room for the first counter's pops: four rows still end inside the 400px stage.
const STACK_TOP = 40;
const STACK_SIDE = 20;
const STACK_GAP = 12;
const STACK_ROW_HEIGHT = 80;
const STACK_VALUE_WIDTH = 150;
const RADIUS = 14;
const DOWN_COLOR = '#ff6b6b';

const CSS = `
.ct-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.ct-stage{position:absolute;left:50%;top:50%;transform-origin:center}
.ct-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.55)}
.ct-title{font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-style:italic}
@keyframes ct-up{0%{transform:scale(1)}30%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes ct-down{0%{transform:scale(1);color:${DOWN_COLOR}}30%{transform:scale(.86);color:${DOWN_COLOR}}100%{transform:scale(1)}}
@keyframes ct-pop{0%{transform:translate(-50%,10px) scale(.6);opacity:0}15%{transform:translate(-50%,-4px) scale(1.1);opacity:1}30%{transform:translate(-50%,-8px) scale(1)}75%{opacity:1}100%{transform:translate(-50%,-34px) scale(.96);opacity:0}}
`;

interface CounterWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<CounterSettings, 'platforms'>;
  simulate?: boolean;
  previewId?: string;
}

export function CounterWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  previewId,
}: CounterWidgetProps) {
  const stage = COUNTER_STAGES[settings.layout];
  const scale = useFitScale(stage);
  const { counts, pops, bumps } = useCounter({
    twitch: twitchChannel,
    kick: kickChannel,
    counters: settings.counters,
    simulate,
    previewId,
  });
  const skin = skinFor(settings.preset);
  const hue = hueFor(settings.color, 1);
  const Cell = settings.layout === 'stack' ? StackRow : RowCell;
  const n = settings.counters.length;
  const width = Math.min(ROW_CELL_MAX, (stage.width - 2 * ROW_SIDE - ROW_GAP * (n - 1)) / n);

  return (
    <SkinProvider skin={skin}>
      <div
        className="ct-root"
        data-testid="counter"
        data-layout={settings.layout}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('ct', skin)}</style>
        <div
          className="ct-stage"
          style={{
            width: stage.width,
            height: stage.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div style={LAYOUT_STYLE[settings.layout]}>
            {settings.counters.map((counter, index) => (
              <Cell
                key={counter.command}
                counter={counter}
                count={counts[index] ?? counter.start}
                bump={bumps[index] ?? null}
                pops={settings.pops ? pops.filter((pop) => pop.index === index) : []}
                hue={hue}
                width={width}
              />
            ))}
          </div>
        </div>
      </div>
    </SkinProvider>
  );
}

const LAYOUT_STYLE: Record<CounterLayout, CSSProperties> = {
  row: {
    position: 'absolute',
    left: ROW_SIDE,
    right: ROW_SIDE,
    bottom: ROW_BOTTOM,
    display: 'flex',
    justifyContent: 'center',
    gap: ROW_GAP,
  },
  stack: {
    position: 'absolute',
    top: STACK_TOP,
    left: STACK_SIDE,
    right: STACK_SIDE,
    display: 'flex',
    flexDirection: 'column',
    gap: STACK_GAP,
  },
};

interface CellProps {
  counter: CounterSpec;
  count: number;
  bump: CounterBump | null;
  pops: CounterPop[];
  hue: number;
  /** A row cell's width; the stack's rows take the stage's. */
  width: number;
}

/** The panel behind a counter: the preset's, or a dark card ringed in the accent color. */
function usePanel(hue: number): { style: CSSProperties; frame: boolean } {
  const skin = useSkin();
  if (skin) return { style: panelStyle(skin, RADIUS), frame: true };
  const hsl = painter(null, hue);
  return {
    style: {
      borderRadius: RADIUS,
      background: 'linear-gradient(180deg, rgba(18,18,24,.86) 0%, rgba(8,8,12,.92) 100%)',
      boxShadow: `0 0 0 2px ${hsl(85, 55, 0.55)}, 0 0 28px ${hsl(85, 50, 0.3)}, 0 12px 30px rgba(0,0,0,.45)`,
    },
    frame: false,
  };
}

function RowCell({ counter, count, bump, pops, hue, width }: CellProps) {
  const skin = useSkin();
  const panel = usePanel(hue);
  return (
    <div
      data-testid="counter-cell"
      data-command={counter.command}
      style={{
        ...panel.style,
        position: 'relative',
        width,
        height: ROW_CELL_HEIGHT,
        padding: `12px ${ROW_PADDING}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Heading counter={counter} size={26} fontSize={19} />
      {/* Centered in the room under the heading, so a long number shrunk to fit stays level. */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Value
          count={count}
          bump={bump}
          hue={hue}
          fontSize={valueFontSize(count, width - 2 * ROW_PADDING, 72)}
        />
      </div>
      <Pops pops={pops} hue={hue} style={{ left: '50%', bottom: 'calc(100% + 6px)' }} />
      {skin && panel.frame && <Frame skin={skin} radius={RADIUS} />}
    </div>
  );
}

function StackRow({ counter, count, bump, pops, hue }: CellProps) {
  const skin = useSkin();
  const panel = usePanel(hue);
  return (
    <div
      data-testid="counter-cell"
      data-command={counter.command}
      style={{
        ...panel.style,
        position: 'relative',
        height: STACK_ROW_HEIGHT,
        padding: '0 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Heading counter={counter} size={32} fontSize={22} align="start" />
      </div>
      <div style={{ width: STACK_VALUE_WIDTH, display: 'flex', justifyContent: 'flex-end' }}>
        {/* The pops rise just left of the number, whatever its width, never over its digits. */}
        <div style={{ position: 'relative' }}>
          <Value
            count={count}
            bump={bump}
            hue={hue}
            fontSize={valueFontSize(count, STACK_VALUE_WIDTH, 54)}
          />
          <Pops
            pops={pops}
            hue={hue}
            offsets={STACK_POP_OFFSETS}
            style={{ right: 'calc(100% + 28px)', top: '50%' }}
          />
        </div>
      </div>
      {skin && panel.frame && <Frame skin={skin} radius={RADIUS} />}
    </div>
  );
}

/** The counter's icon or emote and its label, on one line. */
function Heading({
  counter,
  size,
  fontSize,
  align = 'center',
}: {
  counter: CounterSpec;
  size: number;
  fontSize: number;
  align?: 'center' | 'start';
}) {
  const skin = useSkin();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: 8,
        maxWidth: '100%',
        minHeight: size,
      }}
    >
      {counter.iconUrl ? (
        <img
          src={counter.iconUrl}
          alt=""
          aria-hidden="true"
          width={size + 6}
          height={size + 6}
          data-testid="counter-icon"
          style={{ objectFit: 'contain', flexShrink: 0 }}
        />
      ) : (
        counter.icon && (
          <span
            data-testid="counter-icon"
            aria-hidden="true"
            style={{ fontSize: size, lineHeight: 1, flexShrink: 0 }}
          >
            {counter.icon}
          </span>
        )
      )}
      {counter.label && (
        <span
          className="ct-title ct-shadow"
          data-testid="counter-label"
          style={{
            fontSize,
            color: skin?.text ?? '#fff',
            opacity: 0.92,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {counter.label}
        </span>
      )}
    </div>
  );
}

function Value({
  count,
  bump,
  hue,
  fontSize,
}: {
  count: number;
  bump: CounterBump | null;
  hue: number;
  fontSize: number;
}) {
  const skin = useSkin();
  const hsl = painter(skin, hue);
  return (
    <span
      // A new key replays the animation on every change.
      key={bump?.key}
      data-testid="counter-value"
      style={{
        display: 'inline-block',
        fontSize,
        fontWeight: 800,
        lineHeight: 1,
        color: skin?.text ?? '#fff',
        textShadow: `0 0 24px ${hsl(90, 55, 0.45)}, 0 3px 0 rgba(0,0,0,.6)`,
        animation: bump ? `ct-${bump.up ? 'up' : 'down'} .5s ease-out` : undefined,
      }}
    >
      {count}
    </span>
  );
}

// Pops that land close together rise side by side instead of on top of each other. Over a row
// cell they spread both ways; beside a stacked number only away from it.
const POP_OFFSETS = [0, -26, 26];
const STACK_POP_OFFSETS = [0, -40, -80];

/** Floating "+3" or "−1" numbers rising from a counter. */
function Pops({
  pops,
  hue,
  style,
  offsets = POP_OFFSETS,
}: {
  pops: CounterPop[];
  hue: number;
  style: CSSProperties;
  offsets?: readonly number[];
}) {
  const hsl = painter(useSkin(), hue);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, ...style }}>
      {pops.map((pop) => (
        <span
          key={pop.id}
          data-testid="counter-pop"
          className="ct-shadow"
          style={{
            position: 'absolute',
            left: offsets[pop.id % offsets.length],
            bottom: 0,
            fontSize: 34,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            color: pop.amount > 0 ? hsl(100, 78) : DOWN_COLOR,
            // Drawn under the fill, so a preset's thin display font keeps its light glyph.
            WebkitTextStroke: `3px ${pop.amount > 0 ? hsl(80, 22) : '#5a1010'}`,
            paintOrder: 'stroke fill',
            animation: `ct-pop ${POP_MS}ms cubic-bezier(.2,.8,.3,1) both`,
          }}
        >
          {pop.amount > 0 ? `+${pop.amount}` : `−${-pop.amount}`}
        </span>
      ))}
    </div>
  );
}
