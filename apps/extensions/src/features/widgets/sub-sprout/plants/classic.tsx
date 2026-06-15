import type { PlantProps } from "./registry";

const STEM_PATH = "M 0,0 C -8,-70 -18,-170 12,-280";
const STEM_LENGTH = 300;

export function ClassicPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 5;
  const baseDash = 280;
  const dashOffset = Math.max(
    0,
    baseDash * (1 - totalProgress / (maxStages - 1)),
  );

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <g>
      <defs>
        <linearGradient id="classic-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7FA968" />
          <stop offset="100%" stopColor="#5A7E48" />
        </linearGradient>
        <linearGradient id="classic-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5A7E48" />
          <stop offset="50%" stopColor="#6B8E55" />
          <stop offset="100%" stopColor="#4A6638" />
        </linearGradient>
      </defs>

      <path
        d={STEM_PATH}
        fill="none"
        stroke="url(#classic-stem)"
        strokeWidth="7"
        strokeLinecap="round"
        style={{
          strokeDasharray: STEM_LENGTH,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 0.6s ease-in-out",
        }}
      />

      <g transform="translate(-3, -20) rotate(-20)" opacity="0.8">
        <ellipse
          cx="-8"
          cy="0"
          rx="10"
          ry="4"
          fill="url(#classic-leaf)"
          transform="scale(0.5)"
        />
      </g>
      <g transform="translate(3, -35) rotate(20)" opacity="0.8">
        <ellipse
          cx="8"
          cy="0"
          rx="10"
          ry="4"
          fill="url(#classic-leaf)"
          transform="scale(0.55)"
        />
      </g>

      <g
        transform="translate(-6, -85) rotate(-25)"
        style={{
          transformOrigin: "0 0",
          opacity: s(1),
          transition: "opacity 0.5s ease-in-out",
        }}>
        <path
          d="M 0,0 Q 35,-15 55,-55 Q 15,-40 0,0 Z"
          fill="url(#classic-leaf)"
        />
        <path
          d="M 0,0 Q 30,-25 50,-50"
          fill="none"
          stroke="#3F5230"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      <g
        transform="translate(-10, -160) rotate(15)"
        style={{
          transformOrigin: "0 0",
          opacity: s(2),
          transition: "opacity 0.5s ease-in-out",
        }}>
        <path
          d="M 0,0 Q 40,-15 55,-55 Q 10,-45 0,0 Z"
          fill="url(#classic-leaf)"
        />
        <path
          d="M 0,0 Q 30,-25 50,-50"
          fill="none"
          stroke="#3F5230"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      <g
        transform="translate(-4, -225) rotate(-10)"
        style={{
          transformOrigin: "0 0",
          opacity: s(3),
          transition: "opacity 0.5s ease-in-out",
        }}>
        <path
          d="M 0,0 Q 35,-12 50,-50 Q 12,-38 0,0 Z"
          fill="url(#classic-leaf)"
        />
        <path
          d="M 0,0 Q 28,-22 45,-45"
          fill="none"
          stroke="#3F5230"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      <g
        transform="translate(8, -280) rotate(20)"
        style={{
          transformOrigin: "0 0",
          opacity: s(4),
          transition: "opacity 0.5s ease-in-out",
        }}>
        <ellipse
          cx="0"
          cy="0"
          rx="6"
          ry="8"
          fill="#E11D48"
          opacity="0.9"
        />
        <ellipse cx="0" cy="-2" rx="3" ry="4" fill="#FB7185" />
      </g>
    </g>
  );
}
