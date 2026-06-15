import type { PlantProps } from "./registry";

const STEM_PATH = "M 0,0 C 2,-60 -2,-140 0,-200";
const STEM_LENGTH = 220;

export function LilyPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 6;
  const baseDash = 210;
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
          id="lily-stem"
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
          id="lily-leaf"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <radialGradient id="lily-petal" cx="0.5" cy="0.4">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#F472B6" />
        </radialGradient>
        <linearGradient
          id="lily-petal-2"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
      </defs>

      <path
        d={STEM_PATH}
        fill="none"
        stroke="url(#lily-stem)"
        strokeWidth="6"
        strokeLinecap="round"
        style={{
          strokeDasharray: STEM_LENGTH,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 0.6s ease-in-out",
        }}
      />

      {stage >= 1 && (
        <g
          style={{
            transform: `translate(-18px, -70px) rotate(-25deg) scale(${s(1)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -10,-8 -28,-2 Q -32,4 -20,6 Q -8,6 0,0 Z"
            fill="url(#lily-leaf)"
          />
        </g>
      )}

      {stage >= 2 && (
        <g
          style={{
            transform: `translate(18px, -130px) rotate(25deg) scale(${s(2)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q 10,-8 28,-2 Q 32,4 20,6 Q 8,6 0,0 Z"
            fill="url(#lily-leaf)"
          />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(-12px, -170px) rotate(-15deg) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -8,-6 -22,-2 Q -25,4 -16,5 Q -6,5 0,0 Z"
            fill="url(#lily-leaf)"
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
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = i * 60;
            return (
              <g key={i} transform={`rotate(${angle})`}>
                <path
                  d="M 0,0 Q -10,-30 0,-45 Q 10,-30 0,0 Z"
                  fill="url(#lily-petal)"
                />
              </g>
            );
          })}
          <circle r="6" fill="#FDE047" />
          <circle r="3" fill="#F59E0B" />
        </g>
      )}

      {stage >= 5 && (
        <g
          style={{
            transform: `translate(16px, -180px) scale(${s(5)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = i * 72;
            return (
              <g key={i} transform={`rotate(${angle})`}>
                <path
                  d="M 0,0 Q -6,-18 0,-28 Q 6,-18 0,0 Z"
                  fill="url(#lily-petal-2)"
                />
              </g>
            );
          })}
          <circle r="3" fill="#FCD34D" />
        </g>
      )}
    </g>
  );
}
