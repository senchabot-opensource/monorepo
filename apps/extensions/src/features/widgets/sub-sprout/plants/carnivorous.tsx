import type { PlantProps } from "./registry";

export function CarnivorousPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 5;
  const cactusHeight = Math.min(1, totalProgress / (maxStages - 1));
  const stemHeight = -60 * cactusHeight;

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <g>
      <defs>
        <linearGradient id="carn-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <linearGradient id="carn-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <radialGradient id="carn-mouth-outer" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="80%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#3B0764" />
        </radialGradient>
        <radialGradient id="carn-mouth-inner" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </radialGradient>
      </defs>

      <ellipse
        cx="0"
        cy={stemHeight / 2}
        rx="12"
        ry={Math.abs(stemHeight) / 2 + 4}
        fill="url(#carn-stem)"
        style={{
          transform: `scaleY(${cactusHeight})`,
          transformOrigin: "0 0",
          transition: "transform 0.6s ease-in-out",
        }}
      />

      {stage >= 1 && (
        <g
          style={{
            transform: `translate(-15px, ${stemHeight * 0.6}px) scale(${s(1)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -8,-4 -18,-2 Q -20,3 -12,4 Q -4,4 0,0 Z"
            fill="url(#carn-leaf)"
          />
        </g>
      )}

      {stage >= 2 && (
        <g
          style={{
            transform: `translate(15px, ${stemHeight * 0.4}px) scale(${s(2)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q 8,-4 18,-2 Q 20,3 12,4 Q 4,4 0,0 Z"
            fill="url(#carn-leaf)"
          />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(0, ${stemHeight}px) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <ellipse
            cx="0"
            cy="0"
            rx="24"
            ry="6"
            fill="url(#carn-mouth-outer)"
            transform="rotate(-3)"
          />
          <path
            d="M -22,0 Q -10,-8 0,-7 Q 10,-8 22,0 Q 10,-2 0,-1 Q -10,-2 -22,0 Z"
            fill="url(#carn-mouth-inner)"
          />

          {Array.from({ length: 9 }).map((_, i) => {
            const x = -20 + i * 5;
            return (
              <path
                key={`tooth-top-${i}`}
                d={`M ${x},-1 L ${x - 1.5},-7 L ${x + 1.5},-7 Z`}
                fill="#FBBF24"
                stroke="#92400E"
                strokeWidth="0.5"
              />
            );
          })}

          {Array.from({ length: 9 }).map((_, i) => {
            const x = -20 + i * 5;
            return (
              <path
                key={`tooth-bot-${i}`}
                d={`M ${x},1 L ${x - 1.5},7 L ${x + 1.5},7 Z`}
                fill="#FBBF24"
                stroke="#92400E"
                strokeWidth="0.5"
              />
            );
          })}

          <ellipse
            cx="0"
            cy="0"
            rx="18"
            ry="2"
            fill="#1E1B4B"
            opacity="0.6"
          />
        </g>
      )}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(0, ${stemHeight}px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <circle r="3" fill="#DC2626" />
          <circle r="5" fill="#DC2626" opacity="0.3" />
        </g>
      )}
    </g>
  );
}
