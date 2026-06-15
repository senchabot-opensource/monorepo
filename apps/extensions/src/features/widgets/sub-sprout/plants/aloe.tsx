import type { PlantProps } from "./registry";

export function AloePlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 5;
  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;
  const centerHeight = Math.min(1, totalProgress / (maxStages - 1));

  return (
    <g>
      <defs>
        <linearGradient
          id="aloe-leaf"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A3E635" />
          <stop offset="50%" stopColor="#65A30D" />
          <stop offset="100%" stopColor="#3F6212" />
        </linearGradient>
        <linearGradient
          id="aloe-leaf-light"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D9F99D" />
          <stop offset="100%" stopColor="#84CC16" />
        </linearGradient>
        <linearGradient
          id="aloe-spike"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      <ellipse
        cx="0"
        cy="-2"
        rx="35"
        ry="8"
        fill="#3F6212"
        opacity="0.4"
      />

      <g
        style={{
          transform: `scaleY(${centerHeight})`,
          transformOrigin: "0 0",
          transition: "transform 0.6s ease-in-out",
        }}>
        <path
          d="M 0,0 Q -4,-30 -8,-70 Q -10,-100 -6,-130 Q 0,-135 6,-130 Q 10,-100 8,-70 Q 4,-30 0,0 Z"
          fill="url(#aloe-leaf)"
        />
        <path
          d="M 0,-5 Q -2,-40 -4,-80 Q -5,-110 -2,-130"
          fill="none"
          stroke="#D9F99D"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </g>

      {stage >= 1 && (
        <g
          style={{
            transform: `translate(-22px, 0px) rotate(-30deg) scale(${s(1)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -3,-25 -6,-55 Q -7,-80 -4,-100 Q 0,-105 4,-100 Q 7,-80 6,-55 Q 3,-25 0,0 Z"
            fill="url(#aloe-leaf)"
          />
        </g>
      )}

      {stage >= 2 && (
        <g
          style={{
            transform: `translate(22px, 0px) rotate(30deg) scale(${s(2)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q 3,-25 6,-55 Q 7,-80 4,-100 Q 0,-105 -4,-100 Q -7,-80 -6,-55 Q -3,-25 0,0 Z"
            fill="url(#aloe-leaf)"
          />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(-30px, 0px) rotate(-55deg) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -2,-20 -4,-45 Q -5,-65 -2,-80 Q 0,-83 2,-80 Q 5,-65 4,-45 Q 2,-20 0,0 Z"
            fill="url(#aloe-leaf-light)"
          />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(30px, 0px) rotate(55deg) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q 2,-20 4,-45 Q 5,-65 2,-80 Q 0,-83 -2,-80 Q -5,-65 -4,-45 Q -2,-20 0,0 Z"
            fill="url(#aloe-leaf-light)"
          />
        </g>
      )}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(0, -135px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 L 0,18 L -4,18 L 0,28 L 4,18 L 0,18 Z"
            fill="url(#aloe-spike)"
          />
          <circle r="3" fill="#FCD34D" />
        </g>
      )}
    </g>
  );
}
