import type { PlantProps } from "./registry";

const TRUNK_PATH = "M -2,0 C 0,-50 0,-130 2,-200";
const TRUNK_LENGTH = 220;
const TRUNK_OFFSETS = [220, 140, 60, 0, 0, 0, 0, 0, 0, 0];

export function PalmPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 10;
  const dashOffset = TRUNK_OFFSETS[Math.min(maxStages - 1, stage)];

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  const trunkGrowth = Math.min(1, totalProgress / 3);

  return (
    <g>
      <defs>
        <linearGradient
          id="palm-trunk"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="50%" stopColor="#A16207" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient
          id="palm-frond"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient
          id="palm-frond-light"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      <path
        d={TRUNK_PATH}
        fill="none"
        stroke="url(#palm-trunk)"
        strokeWidth="11"
        strokeLinecap="round"
        style={{
          strokeDasharray: TRUNK_LENGTH,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 0.6s ease-in-out",
        }}
      />

      {Array.from({ length: 6 }).map((_, i) => {
        const yPos = -10 - i * 30;
        const ringThreshold = (i + 1) / 6;
        const visible = trunkGrowth >= ringThreshold;
        return (
          <ellipse
            key={`ring-${i}`}
            cx="0"
            cy={yPos}
            rx="7"
            ry="2"
            fill="#451A03"
            opacity={visible ? 0.6 : 0}
            style={{ transition: "opacity 0.5s ease-in-out" }}
          />
        );
      })}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(2px, -200px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <g transform="rotate(-90)">
            <path
              d="M 0,0 Q 10,-8 50,-12 Q 60,-10 65,-4 Q 50,2 30,4 Q 10,4 0,0 Z"
              fill="url(#palm-frond)"
            />
            <line
              x1="0"
              y1="0"
              x2="60"
              y2="-8"
              stroke="#14532D"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        </g>
      )}

      {stage >= 5 && (
        <g
          style={{
            transform: `translate(2px, -200px) scale(${s(5)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <g transform="rotate(-30)">
            <path
              d="M 0,0 Q 10,-8 50,-12 Q 60,-10 65,-4 Q 50,2 30,4 Q 10,4 0,0 Z"
              fill="url(#palm-frond-light)"
            />
            <line
              x1="0"
              y1="0"
              x2="60"
              y2="-8"
              stroke="#14532D"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        </g>
      )}

      {stage >= 6 && (
        <g
          style={{
            transform: `translate(2px, -200px) scale(${s(6)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <g transform="rotate(30)">
            <path
              d="M 0,0 Q 10,-8 50,-12 Q 60,-10 65,-4 Q 50,2 30,4 Q 10,4 0,0 Z"
              fill="url(#palm-frond)"
            />
            <line
              x1="0"
              y1="0"
              x2="60"
              y2="-8"
              stroke="#14532D"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        </g>
      )}

      {stage >= 7 && (
        <g
          style={{
            transform: `translate(2px, -200px) scale(${s(7)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <g transform="rotate(90)">
            <path
              d="M 0,0 Q 10,-8 50,-12 Q 60,-10 65,-4 Q 50,2 30,4 Q 10,4 0,0 Z"
              fill="url(#palm-frond-light)"
            />
            <line
              x1="0"
              y1="0"
              x2="60"
              y2="-8"
              stroke="#14532D"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        </g>
      )}

      {stage >= 8 && (
        <g
          style={{
            transform: `translate(2px, -200px) scale(${s(8)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <g transform="rotate(150)">
            <path
              d="M 0,0 Q 8,-6 40,-8 Q 48,-6 52,-2 Q 40,2 24,3 Q 8,3 0,0 Z"
              fill="url(#palm-frond)"
            />
          </g>
        </g>
      )}

      {stage >= 9 && (
        <g
          style={{
            transform: `translate(2px, -200px) scale(${s(9)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <g transform="rotate(-150)">
            <path
              d="M 0,0 Q 8,-6 40,-8 Q 48,-6 52,-2 Q 40,2 24,3 Q 8,3 0,0 Z"
              fill="url(#palm-frond)"
            />
          </g>
          <circle r="3" fill="#FCD34D" />
        </g>
      )}
    </g>
  );
}
