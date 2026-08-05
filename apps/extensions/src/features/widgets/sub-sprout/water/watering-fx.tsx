export type WaterEffectType = "off" | "rain" | "sparkle";

export const WATER_EFFECT_OPTIONS: { value: WaterEffectType; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "rain", label: "Rain" },
  { value: "sparkle", label: "Sparkle" },
];

export function isValidWaterEffect(v: string | undefined): v is WaterEffectType {
  return !!v && WATER_EFFECT_OPTIONS.some((o) => o.value === v);
}

interface WateringFXProps {
  effect: WaterEffectType;
  active: boolean;
  durationMs?: number;
}

const VIEWBOX_W = 800;
const VIEWBOX_H = 600;
const POT_LEFT = 315;
const POT_TOP = 420;
const POT_WIDTH = 170;
const FX_HEIGHT = 300 + 10;
const POT_SOIL = POT_TOP + 10;
const FX_CLIP_ID = "sub-sprout-fx-clip";
const FX_FADE_MS = 350;

const generateRain = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const inRegion = i % 2 === 1;
    return {
      id: i,
      x: Math.random() * 850 - 25,
      y: inRegion
        ? POT_TOP - FX_HEIGHT + Math.random() * (FX_HEIGHT - 60)
        : Math.random() * -600,
      length: Math.random() * 20 + 18,
      opacity: Math.random() * 0.35 + 0.35,
      animDelay: `${Math.random() * 0.6}s`,
      animDuration: `${Math.random() * 0.6 + 1.2}s`,
    };
  });
};

const staticRaindrops = generateRain(80);

function RainFX() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      width="100%"
      height="100%">
      <defs>
        <clipPath id={FX_CLIP_ID}>
          <rect
            x={POT_LEFT}
            y={POT_TOP - FX_HEIGHT}
            width={POT_WIDTH}
            height={FX_HEIGHT + (POT_SOIL - POT_TOP)}
          />
        </clipPath>
      </defs>
      <g className="pointer-events-none" clipPath={`url(#${FX_CLIP_ID})`}>
        {staticRaindrops.map((drop) => (
          <line
            key={drop.id}
            x1={drop.x}
            y1={drop.y}
            x2={drop.x - 2}
            y2={drop.y + drop.length}
            stroke="#9fb1c9"
            strokeWidth="2"
            opacity={drop.opacity}
            className="fx-rain-anim"
            style={
              {
                animationDelay: drop.animDelay,
                animationDuration: drop.animDuration,
                "--drop-opacity": drop.opacity,
              } as React.CSSProperties
            }>
            <animate
              attributeName="y1"
              from={drop.y}
              to={POT_SOIL - drop.length * 0.85}
              dur={drop.animDuration}
              begin={drop.animDelay}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0.05 1 0.6"
              keyTimes="0; 1"
            />
            <animate
              attributeName="y2"
              from={drop.y + drop.length}
              to={POT_SOIL}
              dur={drop.animDuration}
              begin={drop.animDelay}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0.05 1 0.6"
              keyTimes="0; 1"
            />
          </line>
        ))}
      </g>
    </svg>
  );
}

const SPARKLE_COLORS = ["#fde68a", "#fbbf24", "#f59e0b"];
const STAR_PATH =
  "M 0,-8 C 0.8,-3 3,-0.8 8,0 C 3,0.8 0.8,3 0,8 C -0.8,3 -3,0.8 -8,0 C -3,-0.8 -0.8,-3 0,-8 Z";

const generateSparkles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: POT_LEFT + Math.random() * POT_WIDTH,
    y: POT_TOP - FX_HEIGHT + Math.random() * FX_HEIGHT,
    size: Math.random() * 3 + 2,
    opacity: Math.random() * 0.4 + 0.5,
    rise: Math.random() * 50 + 25,
    animDelay: `${Math.random() * 2}s`,
    animDuration: `${Math.random() * 1.5 + 2}s`,
    shape: i % 3 === 0 ? ("star" as const) : ("dot" as const),
    color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
  }));
};

const staticSparkles = generateSparkles(45);

function SparkleFX() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      width="100%"
      height="100%">
      <defs>
        <clipPath id={FX_CLIP_ID}>
          <rect
            x={POT_LEFT}
            y={POT_TOP - FX_HEIGHT}
            width={POT_WIDTH}
            height={FX_HEIGHT + (POT_SOIL - POT_TOP)}
          />
        </clipPath>
      </defs>
      <g className="pointer-events-none" clipPath={`url(#${FX_CLIP_ID})`}>
        {staticSparkles.map((sparkle) =>
          sparkle.shape === "star" ? (
            <g
              key={sparkle.id}
              transform={`translate(${sparkle.x}, ${sparkle.y}) scale(${sparkle.size / 8})`}>
              <g
                className="fx-sparkle-anim"
                style={
                  {
                    animationDelay: sparkle.animDelay,
                    animationDuration: sparkle.animDuration,
                    "--rise": `${-sparkle.rise}px`,
                    "--sparkle-opacity": sparkle.opacity,
                    color: sparkle.color,
                  } as React.CSSProperties
                }>
                <path d={STAR_PATH} fill={sparkle.color} />
              </g>
            </g>
          ) : (
            <circle
              key={sparkle.id}
              cx={sparkle.x}
              cy={sparkle.y}
              r={sparkle.size * 0.4}
              fill={sparkle.color}
              className="fx-sparkle-anim"
              style={
                {
                  animationDelay: sparkle.animDelay,
                  animationDuration: sparkle.animDuration,
                  "--rise": `${-sparkle.rise}px`,
                  "--sparkle-opacity": sparkle.opacity,
                } as React.CSSProperties
              }
            />
          ),
        )}
      </g>
    </svg>
  );
}

export function WateringFX({ effect, active, durationMs = 1300 }: WateringFXProps) {
  if (!active || effect === "off") return null;

  const fadeDelay = Math.max(0, (durationMs - FX_FADE_MS) / 1000);
  const endFade =
    effect === "sparkle" && fadeDelay > 0
      ? `fx-fade ${FX_FADE_MS / 1000}s ease-in ${fadeDelay}s forwards`
      : undefined;

  return (
    <div
      className="absolute inset-0"
      style={{
        pointerEvents: "none",
        animation: endFade,
      }}>
      {effect === "rain" ? <RainFX /> : <SparkleFX />}
    </div>
  );
}
