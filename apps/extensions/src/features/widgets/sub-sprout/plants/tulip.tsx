import type { PlantProps } from "./registry";

const STEM_PATH = "M 0,0 C 1,-60 -1,-120 0,-180";
const STEM_LENGTH = 200;

export function TulipPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 5;
  const baseDash = 200;
  const dashOffset = Math.max(
    0,
    baseDash * (1 - totalProgress / (maxStages - 1)),
  );

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <g>
      <defs>
        <linearGradient
          id="tulip-stem"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <linearGradient
          id="tulip-leaf"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <linearGradient
          id="tulip-petal"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
        <linearGradient
          id="tulip-petal-2"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
      </defs>

      <path
        d={STEM_PATH}
        fill="none"
        stroke="url(#tulip-stem)"
        strokeWidth="6"
        strokeLinecap="round"
        style={{
          strokeDasharray: STEM_LENGTH,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 0.6s ease-in-out",
        }}
      />

      <g
        style={{
          transform: `translate(-15px, -100px) rotate(-30deg) scale(${s(1)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M 0,0 Q -12,-6 -25,-2 Q -28,4 -18,6 Q -8,6 0,0 Z"
          fill="url(#tulip-leaf)"
        />
        <path
          d="M -10,-1 L -20,3"
          stroke="#14532D"
          strokeWidth="1"
          opacity="0.6"
        />
      </g>

      <g
        style={{
          transform: `translate(15px, -140px) rotate(30deg) scale(${s(2)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M 0,0 Q 12,-6 25,-2 Q 28,4 18,6 Q 8,6 0,0 Z"
          fill="url(#tulip-leaf)"
        />
        <path
          d="M 10,-1 L 20,3"
          stroke="#14532D"
          strokeWidth="1"
          opacity="0.6"
        />
      </g>

      <g
        style={{
          transform: `translate(0, -180px) scale(${s(3)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M -20,-30 C -20,-32 -16,-34 -10,-34 C -4,-34 0,-32 0,-30 C 0,-32 4,-34 10,-34 C 16,-34 20,-32 20,-30 L 18,-2 C 18,2 12,4 0,4 C -12,4 -18,2 -18,-2 Z"
          fill="url(#tulip-petal)"
        />
        <path
          d="M -20,-30 C -20,-32 -16,-34 -10,-34 C -4,-34 0,-32 0,-30"
          fill="none"
          stroke="#9D174D"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 20,-30 C 20,-32 16,-34 10,-34 C 4,-34 0,-32 0,-30"
          fill="none"
          stroke="#9D174D"
          strokeWidth="1"
          opacity="0.5"
        />
        <ellipse cx="-8" cy="-20" rx="3" ry="8" fill="#FBCFE8" opacity="0.5" />
        <ellipse cx="8" cy="-20" rx="3" ry="8" fill="#FBCFE8" opacity="0.5" />
        <path
          d="M 0,-30 L 0,-4"
          stroke="#9D174D"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </g>

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(18px, -150px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M -14,-24 C -14,-26 -10,-28 -6,-28 C -2,-28 0,-26 0,-24 C 0,-26 2,-28 6,-28 C 10,-28 14,-26 14,-24 L 12,0 C 12,2 8,3 0,3 C -8,3 -12,2 -12,0 Z"
            fill="url(#tulip-petal-2)"
          />
        </g>
      )}
    </g>
  );
}
