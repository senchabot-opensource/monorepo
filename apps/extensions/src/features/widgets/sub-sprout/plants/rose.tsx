import type { PlantProps } from "./registry";

const STEM_PATH = "M 0,0 C 2,-80 -3,-170 0,-250";
const STEM_LENGTH = 300;
const STEM_OFFSETS = [300, 215, 215, 150, 150, 90, 90, 30, 30, 0];

export function RosePlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const maxStages = 10;
  const dashOffset = STEM_OFFSETS[Math.min(maxStages - 1, stage)];

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <g>
      <defs>
        <linearGradient id="rose-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <radialGradient id="rose-petal" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="60%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </radialGradient>
        <radialGradient id="rose-center" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <linearGradient id="rose-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      <path
        d={STEM_PATH}
        fill="none"
        stroke="url(#rose-stem)"
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
          transform: `translate(0px, -85px) rotate(-30deg) scale(${s(2)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M 0,0 Q -10,-8 -22,-4 Q -28,4 -18,8 Q -8,8 0,0 Z"
          fill="url(#rose-leaf)"
        />
        <path
          d="M -10,-2 L -18,2"
          stroke="#14532D"
          strokeWidth="0.8"
          opacity="0.5"
        />
      </g>

      <g
        style={{
          transform: `translate(0px, -150px) rotate(35deg) scale(${s(4)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M 0,0 Q 10,-8 22,-4 Q 28,4 18,8 Q 8,8 0,0 Z"
          fill="url(#rose-leaf)"
        />
        <path
          d="M 10,-2 L 18,2"
          stroke="#14532D"
          strokeWidth="0.8"
          opacity="0.5"
        />
      </g>

      <g
        style={{
          transform: `translate(0px, -210px) rotate(-20deg) scale(${s(6)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <path
          d="M 0,0 Q -8,-6 -18,-2 Q -22,4 -14,6 Q -6,6 0,0 Z"
          fill="url(#rose-leaf)"
        />
      </g>

      <g
        style={{
            transform: `translate(0, -250px) scale(${s(9)})`,
          transformOrigin: "0 0",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
        <g>
          <circle cx="-8" cy="0" r="12" fill="url(#rose-petal)" />
          <circle cx="8" cy="0" r="12" fill="url(#rose-petal)" />
          <circle cx="0" cy="-8" r="12" fill="url(#rose-petal)" />
          <circle cx="0" cy="8" r="12" fill="url(#rose-petal)" />
          <circle cx="0" cy="0" r="9" fill="#BE123C" />
          <circle cx="0" cy="0" r="5" fill="url(#rose-center)" />
        </g>
      </g>

      {stage >= 8 && (
        <g
          style={{
            transform: `translate(0px, -200px) scale(${s(8)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <circle cx="-6" cy="0" r="8" fill="url(#rose-petal)" />
          <circle cx="6" cy="0" r="8" fill="url(#rose-petal)" />
          <circle cx="0" cy="-6" r="8" fill="url(#rose-petal)" />
          <circle cx="0" cy="6" r="8" fill="url(#rose-petal)" />
          <circle cx="0" cy="0" r="5" fill="#BE123C" />
          <circle cx="0" cy="0" r="2" fill="#FCD34D" />
        </g>
      )}
    </g>
  );
}
