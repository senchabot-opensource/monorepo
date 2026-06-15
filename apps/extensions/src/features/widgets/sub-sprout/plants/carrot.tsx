import type { PlantProps } from "./registry";

export function CarrotPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 5;
  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;
  const rootHeight = Math.min(1, totalProgress / (maxStages - 1));

  return (
    <g>
      <defs>
        <linearGradient
          id="carrot-root"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="60%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient
          id="carrot-leaf"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      <g
        style={{
          transform: `scaleY(${rootHeight})`,
          transformOrigin: "0 0",
          transition: "transform 0.6s ease-in-out",
        }}>
        <path
          d="M -8,0 L -14,4 L -10,8 L -16,12 L -12,18 L -6,40 L -3,70 L 0,90 L 3,70 L 6,40 L 12,18 L 16,12 L 10,8 L 14,4 L 8,0 Z"
          fill="url(#carrot-root)"
        />
        <line
          x1="-4"
          y1="10"
          x2="-8"
          y2="40"
          stroke="#9A3412"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="4"
          y1="10"
          x2="8"
          y2="40"
          stroke="#9A3412"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="0"
          y1="20"
          x2="0"
          y2="80"
          stroke="#9A3412"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </g>

      {stage >= 1 && (
        <g
          style={{
            transform: `translate(0, -10px) scale(${s(1)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -3,-30 -8,-50 Q -10,-65 -6,-70 Q 0,-72 0,-65 Q 0,-72 6,-70 Q 10,-65 8,-50 Q 3,-30 0,0 Z"
            fill="url(#carrot-leaf)"
          />
        </g>
      )}

      {stage >= 2 && (
        <g
          style={{
            transform: `translate(-6px, -10px) scale(${s(2)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -2,-25 -6,-45 Q -8,-60 -5,-65 Q 0,-67 0,-60 Q 0,-67 5,-65 Q 8,-60 6,-45 Q 2,-25 0,0 Z"
            fill="url(#carrot-leaf)"
          />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(6px, -10px) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q 2,-25 6,-45 Q 8,-60 5,-65 Q 0,-67 0,-60 Q 0,-67 -5,-65 Q -8,-60 -6,-45 Q -2,-25 0,0 Z"
            fill="url(#carrot-leaf)"
          />
        </g>
      )}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(-10px, -10px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -2,-20 -4,-35 Q -5,-48 -3,-52 Q 0,-54 0,-48 Q 0,-54 3,-52 Q 5,-48 4,-35 Q 2,-20 0,0 Z"
            fill="url(#carrot-leaf)"
          />
        </g>
      )}
    </g>
  );
}
