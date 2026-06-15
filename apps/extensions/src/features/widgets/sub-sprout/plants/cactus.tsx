import type { PlantProps } from "./registry";

const BODY_PATH = "M -28,0 L -28,-65 Q -28,-80 -15,-80 L 15,-80 Q 28,-80 28,-65 L 28,0 Z";

const ARM_LEFT_PATH = "M -28,-40 Q -38,-40 -40,-50 L -40,-70 Q -40,-78 -34,-78";
const ARM_LEFT_LENGTH = 50;

const ARM_RIGHT_PATH = "M 28,-50 Q 38,-50 40,-60 L 40,-80 Q 40,-88 34,-88";
const ARM_RIGHT_LENGTH = 50;

export function CactusPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 5;
  const bodyGrowth = Math.min(1, totalProgress / (maxStages - 1));
  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  const armLeftProgress = Math.min(
    1,
    Math.max(0, totalProgress - 1) / 2,
  );
  const armRightProgress = Math.min(
    1,
    Math.max(0, totalProgress - 1.5) / 2,
  );

  return (
    <g>
      <defs>
        <linearGradient
          id="cactus-body"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="40%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
        <linearGradient
          id="cactus-arm"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
        <radialGradient id="cactus-flower" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="60%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9F1239" />
        </radialGradient>
      </defs>

      <path
        d={BODY_PATH}
        fill="url(#cactus-body)"
        style={{
          transform: `scaleY(${bodyGrowth})`,
          transformOrigin: "0 0",
          transition: "transform 0.6s ease-in-out",
        }}
      />

      {stage >= 1 && (
        <g
          style={{
            opacity: s(1),
            transition: "opacity 0.5s ease-in-out",
          }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const y = -15 - i * 12;
            return (
              <g key={i} opacity="0.5">
                <line
                  x1="-24"
                  y1={y}
                  x2="-28"
                  y2={y - 3}
                  stroke="#064E3B"
                  strokeWidth="1"
                />
                <line
                  x1="24"
                  y1={y}
                  x2="28"
                  y2={y - 3}
                  stroke="#064E3B"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </g>
      )}

      {stage >= 1 && (
        <path
          d={ARM_LEFT_PATH}
          fill="none"
          stroke="url(#cactus-arm)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: ARM_LEFT_LENGTH,
            strokeDashoffset: Math.max(
              0,
              ARM_LEFT_LENGTH * (1 - armLeftProgress),
            ),
            transition: "stroke-dashoffset 0.6s ease-in-out",
          }}
        />
      )}

      {stage >= 2 && (
        <path
          d={ARM_RIGHT_PATH}
          fill="none"
          stroke="url(#cactus-arm)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: ARM_RIGHT_LENGTH,
            strokeDashoffset: Math.max(
              0,
              ARM_RIGHT_LENGTH * (1 - armRightProgress),
            ),
            transition: "stroke-dashoffset 0.6s ease-in-out",
          }}
        />
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(0, -80px) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const x = Math.cos(angle) * 8;
            const y = Math.sin(angle) * 8 - 3;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="8"
                ry="4"
                fill="url(#cactus-flower)"
                transform={`rotate(${(i * 360) / 6} ${x} ${y})`}
              />
            );
          })}
          <circle r="5" fill="#FCD34D" />
        </g>
      )}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(-40px, -75px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <ellipse cx="0" cy="0" rx="5" ry="6" fill="#FCD34D" opacity="0.7" />
        </g>
      )}
    </g>
  );
}
