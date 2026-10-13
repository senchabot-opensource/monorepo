import { type ReactNode, useId } from 'react';
import { type Intensity, readSymbol, type Sky } from './weather-symbols';

/**
 * A weather symbol drawn from its parts (the sun or moon, clouds, rain, snow, lightning, fog) on a
 * 64×64 grid. Colors come from the overlay's --wx-* variables, so each theme can set its own.
 */

// A cloud with a flat base on y=46 from x=18 to 46, about 47 wide and 27 tall.
const CLOUD = 'M18 46H46A10 10 0 0 0 46 26A13 13 0 0 0 21.5 29.5A8.5 8.5 0 0 0 18 46Z';

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const rays = RAY_ANGLES.map((degrees) => {
    const [x, y] = [Math.cos((degrees * Math.PI) / 180), Math.sin((degrees * Math.PI) / 180)];
    return (
      <line
        key={degrees}
        x1={cx + x * (r + 4)}
        y1={cy + y * (r + 4)}
        x2={cx + x * (r + 8)}
        y2={cy + y * (r + 8)}
      />
    );
  });
  return (
    <g className="wx-sun">
      <g strokeWidth={3} strokeLinecap="round">
        {rays}
      </g>
      <circle cx={cx} cy={cy} r={r} />
    </g>
  );
}

/** A crescent: the circle at (cx, cy) less one of the same size up and to its right. */
function Moon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const at = (x: number, y: number) => `${cx + x * r} ${cy + y * r}`;
  return (
    <path
      className="wx-moon"
      d={`M${at(0.818, 0.576)}A${r} ${r} 0 1 1 ${at(-0.218, -0.976)}A${r} ${r} 0 0 0 ${at(0.818, 0.576)}Z`}
    />
  );
}

function Body({ body, cx, cy, r }: { body: Sky['body']; cx: number; cy: number; r: number }) {
  if (body === 'sun') return <Sun cx={cx} cy={cy} r={r} />;
  if (body === 'moon') return <Moon cx={cx} cy={cy} r={r + 2} />;
  return null;
}

const Cloud = ({ transform, dark = false }: { transform?: string; dark?: boolean }) => (
  <path className={dark ? 'wx-cloud-back' : 'wx-cloud'} d={CLOUD} transform={transform} />
);

const SPOTS: Record<Intensity, number[]> = {
  light: [28, 39],
  normal: [24, 33, 42],
  heavy: [21, 29, 37, 45],
};

const Drop = ({ x, long }: { x: number; long: boolean }) => (
  <line className="wx-rain" x1={x} y1={45} x2={x - 3} y2={long ? 56 : 52} />
);

/** A six-armed snowflake: three strokes crossing at (x, y). */
const Flake = ({ x, index }: { x: number; index: number }) => {
  const y = index % 2 === 0 ? 50 : 56;
  return (
    <g className="wx-snow" transform={`translate(${x - 2} ${y})`}>
      <line x1={0} y1={-3.4} x2={0} y2={3.4} />
      <line x1={-2.9} y1={-1.7} x2={2.9} y2={1.7} />
      <line x1={-2.9} y1={1.7} x2={2.9} y2={-1.7} />
    </g>
  );
};

function Precipitation({ sky }: { sky: Sky }) {
  if (sky.thunder) {
    return (
      <>
        {sky.precipitation && <Drop x={24} long={false} />}
        {sky.precipitation && <Drop x={47} long={false} />}
        <path className="wx-bolt" d="M35 40 27 52H33L29 62 41 48H35L39 40Z" />
      </>
    );
  }
  if (sky.fog) {
    return (
      <g className="wx-fog">
        <line x1={14} y1={50} x2={46} y2={50} />
        <line x1={20} y1={57} x2={52} y2={57} />
      </g>
    );
  }
  if (!sky.precipitation) return null;
  const spots = SPOTS[sky.intensity];
  return (
    <>
      {spots.map((x, index) => {
        const snow =
          sky.precipitation === 'snow' || (sky.precipitation === 'sleet' && index % 2 === 1);
        return snow ? (
          <Flake key={x} x={x} index={index} />
        ) : (
          <Drop key={x} x={x} long={sky.intensity === 'heavy'} />
        );
      })}
    </>
  );
}

function Picture({ sky }: { sky: Sky }) {
  const wet = sky.precipitation !== null || sky.thunder || sky.fog;
  // Rain, snow and fog fall below the cloud, so it moves up to make room.
  const lift = wet ? -6 : 0;
  const parts: ReactNode[] = [];
  if (sky.clouds === 'none') {
    parts.push(<Body key="body" body={sky.body} cx={32} cy={32} r={12} />);
  } else if (sky.clouds === 'few') {
    parts.push(<Body key="body" body={sky.body} cx={27} cy={26} r={11} />);
    parts.push(<Cloud key="cloud" transform="translate(22 21) scale(.64)" />);
  } else if (sky.clouds === 'some') {
    parts.push(<Body key="body" body={sky.body} cx={24} cy={22 + lift} r={10} />);
    parts.push(<Cloud key="cloud" transform={`translate(0 ${lift})`} />);
  } else {
    parts.push(<Cloud key="back" dark transform={`translate(15 ${lift - 9}) scale(.72)`} />);
    parts.push(<Cloud key="cloud" transform={`translate(0 ${lift})`} />);
  }
  return (
    <>
      {parts}
      <Precipitation sky={sky} />
    </>
  );
}

/**
 * A black outline `width` grid units wide around the whole picture, like the IRL HUD's text has:
 * the picture's shape grown by that much, filled black, under the picture.
 */
function OutlineFilter({ id, width }: { id: string; width: number }) {
  return (
    <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
      <feMorphology in="SourceAlpha" operator="dilate" radius={width} result="grown" />
      <feFlood floodColor="#000" />
      <feComposite in2="grown" operator="in" result="outline" />
      <feMerge>
        <feMergeNode in="outline" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

export function ConditionIcon({
  symbol,
  size,
  outline = 0,
}: {
  symbol: string | null;
  size: number;
  /** A black outline this many grid units wide, for the IRL HUD styles; 0 draws none. */
  outline?: number;
}) {
  // useId's colons would end the url(#…) reference early.
  const filterId = `wx-outline${useId().replace(/[^\w-]/g, '')}`;
  const picture = symbol && <Picture sky={readSymbol(symbol).sky} />;
  return (
    <svg
      className="wx-icon"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      data-symbol={symbol ?? undefined}
    >
      {outline > 0 ? (
        <>
          <defs>
            <OutlineFilter id={filterId} width={outline} />
          </defs>
          <g filter={`url(#${filterId})`}>{picture}</g>
        </>
      ) : (
        picture
      )}
    </svg>
  );
}

/** CSS for the icon's parts; the overlay sets the --wx-* colors per theme. */
export const ICON_CSS = `
.wx-icon{flex:none;overflow:visible}
.wx-sun{fill:var(--wx-sun);stroke:var(--wx-sun)}
.wx-moon{fill:var(--wx-moon)}
.wx-cloud{fill:var(--wx-cloud);stroke:var(--wx-cloud-edge);stroke-width:1.5}
.wx-cloud-back{fill:var(--wx-cloud-back);stroke:var(--wx-cloud-edge);stroke-width:1.5}
.wx-rain{stroke:var(--wx-rain);stroke-width:3.2;stroke-linecap:round}
.wx-snow{stroke:var(--wx-snow);stroke-width:1.9;stroke-linecap:round}
.wx-bolt{fill:var(--wx-bolt)}
.wx-fog{stroke:var(--wx-fog);stroke-width:3.5;stroke-linecap:round}
`;
