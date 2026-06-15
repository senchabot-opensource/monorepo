import type { PlantProps } from "./registry";

const SEGMENT_COUNT = 5;
const SEGMENT_HEIGHT = 60;
const TOTAL_HEIGHT = SEGMENT_COUNT * SEGMENT_HEIGHT;
const JOINT_COUNT = SEGMENT_COUNT - 1;

export function BambooPlant({ stage, progress }: PlantProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 6;
  const filledSegments = Math.min(
    SEGMENT_COUNT,
    (totalProgress / (maxStages - 1)) * SEGMENT_COUNT,
  );

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <g>
      <defs>
        <linearGradient
          id="bamboo-stem"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#365314" />
          <stop offset="50%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#4D7C0F" />
        </linearGradient>
        <linearGradient
          id="bamboo-leaf"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
        const segProgress = Math.max(
          0,
          Math.min(1, filledSegments - i),
        );
        const bottom = -i * SEGMENT_HEIGHT;
        const jointY = -(i + 1) * SEGMENT_HEIGHT;
        return (
          <g key={`seg-${i}`}>
            <rect
              x="-11"
              y={bottom}
              width="22"
              height={segProgress * -SEGMENT_HEIGHT}
              fill="url(#bamboo-stem)"
              style={{
                transformOrigin: "0 0",
                transition: "all 0.6s ease-in-out",
              }}
              rx="3"
            />
            {i < JOINT_COUNT && segProgress >= 0.5 && (
              <>
                <ellipse
                  cx="0"
                  cy={jointY}
                  rx="14"
                  ry="5"
                  fill="#365314"
                  opacity="0.85"
                  style={{ transition: "opacity 0.4s ease-in-out" }}
                />
                <ellipse
                  cx="0"
                  cy={jointY - 1}
                  rx="12"
                  ry="2"
                  fill="#84CC16"
                  opacity="0.4"
                  style={{ transition: "opacity 0.4s ease-in-out" }}
                />
              </>
            )}
          </g>
        );
      })}

      {stage >= 1 && (
        <g
          style={{
            transform: `translate(16px, -60px) scale(${s(1)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q 12,-4 22,-2 Q 25,2 16,4 Q 6,4 0,0 Z"
            fill="url(#bamboo-leaf)"
          />
          <path
            d="M 10,0 L 20,-1"
            stroke="#14532D"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </g>
      )}

      {stage >= 2 && (
        <g
          style={{
            transform: `translate(-16px, -180px) scale(${s(2)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q -12,-4 -22,-2 Q -25,2 -16,4 Q -6,4 0,0 Z"
            fill="url(#bamboo-leaf)"
          />
          <path
            d="M -10,0 L -20,-1"
            stroke="#14532D"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </g>
      )}

      {stage >= 3 && (
        <g
          style={{
            transform: `translate(18px, -240px) scale(${s(3)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <path
            d="M 0,0 Q 14,-4 26,-2 Q 28,2 18,4 Q 6,4 0,0 Z"
            fill="url(#bamboo-leaf)"
          />
          <path
            d="M 13,0 L 24,-1"
            stroke="#14532D"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </g>
      )}

      {stage >= 4 && (
        <g
          style={{
            transform: `translate(0, -${TOTAL_HEIGHT}px) scale(${s(4)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <circle r="6" fill="#84CC16" />
          <circle r="3" fill="#A3E635" />
        </g>
      )}

      {stage >= 5 && (
        <g
          style={{
            transform: `translate(0, -${TOTAL_HEIGHT + 8}px) scale(${s(5)})`,
            transformOrigin: "0 0",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
          <circle r="3" fill="#FCD34D" />
          <circle r="5" fill="#FCD34D" opacity="0.4" />
        </g>
      )}
    </g>
  );
}
