import type { PlantProps } from "./registry";

const STEM_PATH = "M 0,0 C 3,-80 -2,-180 0,-300";
const STEM_LENGTH = 340;

export function SunflowerPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 6;
  const baseDash = 310;
  const dashOffset = Math.max(
    0,
    baseDash * (1 - totalProgress / (maxStages - 1)),
  );

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <g>
      <defs>
        <linearGradient id="sunflower-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <linearGradient id="sunflower-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="sunflower-center" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="50%" stopColor="#451A03" />
          <stop offset="100%" stopColor="#1C1917" />
        </radialGradient>
        <linearGradient id="sunflower-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      <path
        d={STEM_PATH}
        fill="none"
        stroke="url(#sunflower-stem)"
        strokeWidth="8"
        strokeLinecap="round"
        style={{
          strokeDasharray: STEM_LENGTH,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 0.6s ease-in-out",
        }}
      />

      <g
        style={{
          transform: `translate(-22px, -130px) rotate(-25deg) scale(${s(1)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M 0,0 Q -15,-8 -30,-4 Q -34,4 -22,8 Q -10,8 0,0 Z"
          fill="url(#sunflower-leaf)"
        />
        <path
          d="M -15,-2 L -25,3"
          stroke="#14532D"
          strokeWidth="0.8"
          opacity="0.5"
        />
      </g>

      <g
        style={{
          transform: `translate(22px, -210px) rotate(30deg) scale(${s(2)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M 0,0 Q 15,-8 30,-4 Q 34,4 22,8 Q 10,8 0,0 Z"
          fill="url(#sunflower-leaf)"
        />
        <path
          d="M 15,-2 L 25,3"
          stroke="#14532D"
          strokeWidth="0.8"
          opacity="0.5"
        />
      </g>

      <g
        style={{
          transform: `translate(0, -300px) scale(${s(4)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * (360 / 14) * Math.PI) / 180;
          const x = Math.cos(angle) * 32;
          const y = Math.sin(angle) * 32;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="20"
              ry="9"
              fill="url(#sunflower-petal)"
              transform={`rotate(${(i * 360) / 14} ${x} ${y})`}
              opacity="0.95"
            />
          );
        })}
        <circle r="24" fill="url(#sunflower-center)" />
        <circle r="24" fill="url(#sunflower-center)" opacity="0.5" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const r = 16;
          return (
            <circle
              key={`seed-${i}`}
              cx={Math.cos(angle) * r}
              cy={Math.sin(angle) * r}
              r="1.5"
              fill="#FDE047"
              opacity="0.6"
            />
          );
        })}
      </g>

      {stage >= 5 && (
        <g
          transform="translate(0, -300)"
          style={{
            opacity: 0.3,
            animation: "sunflower-glow 2s ease-in-out infinite",
          }}>
          <circle
            r="40"
            fill="none"
            stroke="#FCD34D"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>
      )}
    </g>
  );
}
