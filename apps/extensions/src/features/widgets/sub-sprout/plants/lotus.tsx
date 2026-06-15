import type { PlantProps } from "./registry";

const STEM_PATH = "M 0,0 C 0,-50 0,-110 0,-150";
const STEM_LENGTH = 160;

export function LotusPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 5;
  const baseDash = 160;
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
          id="lotus-stem"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <radialGradient id="lotus-petal-outer" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FECDD3" />
          <stop offset="100%" stopColor="#FB7185" />
        </radialGradient>
        <radialGradient id="lotus-petal-inner" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FECDD3" />
        </radialGradient>
        <radialGradient id="lotus-center" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#CA8A04" />
        </radialGradient>
      </defs>

      <ellipse
        cx="0"
        cy="-5"
        rx="55"
        ry="10"
        fill="#16A34A"
        opacity="0.6"
      />
      <ellipse
        cx="0"
        cy="-5"
        rx="45"
        ry="7"
        fill="#22C55E"
      />

      <path
        d={STEM_PATH}
        fill="none"
        stroke="url(#lotus-stem)"
        strokeWidth="5"
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
            transform: `translate(-22px, -70px) rotate(-20deg) scale(${s(1)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <ellipse cx="0" cy="0" rx="20" ry="8" fill="#16A34A" />
        </g>
      )}

      {stage >= 2 && (
        <g
          style={{
            transform: `translate(22px, -100px) rotate(20deg) scale(${s(2)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <ellipse cx="0" cy="0" rx="18" ry="7" fill="#16A34A" />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(0, -150px) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <g>
            <ellipse
              cx="0"
              cy="-8"
              rx="6"
              ry="22"
              fill="url(#lotus-petal-outer)"
              transform="rotate(0)"
            />
            <ellipse
              cx="0"
              cy="-8"
              rx="6"
              ry="22"
              fill="url(#lotus-petal-outer)"
              transform="rotate(60)"
            />
            <ellipse
              cx="0"
              cy="-8"
              rx="6"
              ry="22"
              fill="url(#lotus-petal-outer)"
              transform="rotate(120)"
            />
            <ellipse
              cx="0"
              cy="-8"
              rx="6"
              ry="22"
              fill="url(#lotus-petal-outer)"
              transform="rotate(180)"
            />
            <ellipse
              cx="0"
              cy="-8"
              rx="6"
              ry="22"
              fill="url(#lotus-petal-outer)"
              transform="rotate(240)"
            />
            <ellipse
              cx="0"
              cy="-8"
              rx="6"
              ry="22"
              fill="url(#lotus-petal-outer)"
              transform="rotate(300)"
            />
          </g>
          <g>
            <ellipse
              cx="0"
              cy="-6"
              rx="4"
              ry="14"
              fill="url(#lotus-petal-inner)"
              transform="rotate(30)"
            />
            <ellipse
              cx="0"
              cy="-6"
              rx="4"
              ry="14"
              fill="url(#lotus-petal-inner)"
              transform="rotate(90)"
            />
            <ellipse
              cx="0"
              cy="-6"
              rx="4"
              ry="14"
              fill="url(#lotus-petal-inner)"
              transform="rotate(150)"
            />
            <ellipse
              cx="0"
              cy="-6"
              rx="4"
              ry="14"
              fill="url(#lotus-petal-inner)"
              transform="rotate(210)"
            />
            <ellipse
              cx="0"
              cy="-6"
              rx="4"
              ry="14"
              fill="url(#lotus-petal-inner)"
              transform="rotate(270)"
            />
            <ellipse
              cx="0"
              cy="-6"
              rx="4"
              ry="14"
              fill="url(#lotus-petal-inner)"
              transform="rotate(330)"
            />
          </g>
          <circle r="6" fill="url(#lotus-center)" />
        </g>
      )}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(-18px, -120px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <ellipse cx="0" cy="0" rx="3" ry="3" fill="#FB7185" />
        </g>
      )}
    </g>
  );
}
