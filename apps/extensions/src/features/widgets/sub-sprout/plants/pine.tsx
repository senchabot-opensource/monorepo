import type { PlantProps } from "./registry";

const TRUNK_PATH = "M 0,0 L 0,-200";
const TRUNK_LENGTH = 220;
const TRUNK_OFFSETS = [220, 140, 100, 55, 0];

export function PinePlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const maxStages = 5;
  const dashOffset = TRUNK_OFFSETS[Math.min(maxStages - 1, stage)];

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <g>
      <defs>
        <linearGradient
          id="pine-trunk"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#451A03" />
          <stop offset="50%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient
          id="pine-needle"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>

      <path
        d={TRUNK_PATH}
        fill="none"
        stroke="url(#pine-trunk)"
        strokeWidth="10"
        strokeLinecap="round"
        style={{
          strokeDasharray: TRUNK_LENGTH,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 0.6s ease-in-out",
        }}
      />

      {stage >= 1 && (
        <g
          style={{
            transform: `translate(0, -60px) scale(${s(1)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 L -38,30 L -28,30 L -42,55 L 0,40 L 42,55 L 28,30 L 38,30 Z"
            fill="url(#pine-needle)"
          />
        </g>
      )}

      {stage >= 2 && (
        <g
          style={{
            transform: `translate(0, -110px) scale(${s(2)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 L -32,26 L -24,26 L -36,48 L 0,35 L 36,48 L 24,26 L 32,26 Z"
            fill="url(#pine-needle)"
          />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(0, -160px) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 L -26,22 L -20,22 L -30,40 L 0,30 L 30,40 L 20,22 L 26,22 Z"
            fill="url(#pine-needle)"
          />
        </g>
      )}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(0, -200px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 L -18,18 L -14,18 L -20,30 L 0,22 L 20,30 L 14,18 L 18,18 Z"
            fill="url(#pine-needle)"
          />
        </g>
      )}
    </g>
  );
}
