export interface VineProps {
  stage: number;
  progress: number;
}

const STEM_LENGTH = 1100;

const LEFT_STEM_PATH =
  "M -20,1100 C 60,1000 40,900 60,800 C 80,700 30,600 60,500 C 90,400 50,300 60,200 C 70,100 40,50 60,0 C 80,-50 50,-100 60,-150";
const RIGHT_STEM_PATH =
  "M 1940,1100 C 1860,1000 1880,900 1860,800 C 1840,700 1890,600 1860,500 C 1830,400 1870,300 1880,200 C 1890,100 1860,50 1880,0 C 1900,-50 1870,-100 1880,-150";

interface VineDecoration {
  id: string;
  step: number;
  type: "leaf-l" | "leaf-r" | "flower" | "tendril-l" | "tendril-r";
  x: number;
  y: number;
  rot: number;
  delay: number;
  scale: number;
}

const LEFT_DECORATIONS: VineDecoration[] = [
  { id: "1a", step: 1, type: "leaf-l", x: 20, y: 1020, rot: -30, delay: 1, scale: 1.2 },
  { id: "1b", step: 1, type: "leaf-r", x: 80, y: 950, rot: 45, delay: 3, scale: 1.3 },
  { id: "1c", step: 1, type: "tendril-l", x: 60, y: 880, rot: -15, delay: 5, scale: 1 },
  { id: "2a", step: 2, type: "flower", x: 40, y: 800, rot: 15, delay: 1, scale: 1.4 },
  { id: "2b", step: 2, type: "leaf-l", x: 90, y: 740, rot: -20, delay: 3, scale: 1.1 },
  { id: "2c", step: 2, type: "leaf-r", x: 50, y: 680, rot: 35, delay: 4, scale: 1.2 },
  { id: "3a", step: 3, type: "leaf-r", x: 80, y: 600, rot: 50, delay: 1, scale: 1 },
  { id: "3b", step: 3, type: "leaf-l", x: 25, y: 530, rot: -40, delay: 3, scale: 1.4 },
  { id: "3c", step: 3, type: "flower", x: 60, y: 460, rot: -15, delay: 4, scale: 1.2 },
  { id: "3d", step: 3, type: "tendril-r", x: 45, y: 430, rot: 25, delay: 5, scale: 1.1 },
  { id: "4a", step: 4, type: "leaf-l", x: 30, y: 350, rot: -25, delay: 1, scale: 1.3 },
  { id: "4b", step: 4, type: "leaf-r", x: 95, y: 280, rot: 40, delay: 3, scale: 1.1 },
  { id: "4c", step: 4, type: "tendril-l", x: 65, y: 220, rot: -10, delay: 5, scale: 1.2 },
  { id: "5a", step: 5, type: "flower", x: 110, y: 160, rot: 20, delay: 1, scale: 1.5 },
  { id: "5b", step: 5, type: "leaf-r", x: 100, y: 100, rot: 30, delay: 3, scale: 1.1 },
  { id: "5c", step: 5, type: "leaf-l", x: 60, y: 40, rot: -45, delay: 5, scale: 1.2 },
];

const RIGHT_DECORATIONS: VineDecoration[] = LEFT_DECORATIONS.map((d) => ({
  ...d,
  id: d.id + "R",
  type: d.type.includes("-l")
    ? (d.type.replace("-l", "-r") as VineDecoration["type"])
    : (d.type.replace("-r", "-l") as VineDecoration["type"]),
  x: 1920 - d.x,
  rot: -d.rot,
}));

export function VineOverlay({ stage, progress }: VineProps) {
  const maxProgress = Math.max(0, Math.min(1, progress));
  const totalProgress = stage + maxProgress;
  const maxStages = 6;
  const stemProgress = Math.min(1, totalProgress / (maxStages - 1));
  const baseDash = 1100;
  const dashOffset = Math.max(0, baseDash * (1 - stemProgress));

  const s = (n: number) =>
    stage >= n ? 1 : stage === n - 1 ? maxProgress : 0;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      style={{ backgroundColor: "transparent", position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <linearGradient
          id="vine-stem"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1F3A12" />
          <stop offset="50%" stopColor="#3A6325" />
          <stop offset="100%" stopColor="#2D4C1E" />
        </linearGradient>
        <radialGradient id="vine-leaf" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#87C75F" />
          <stop offset="60%" stopColor="#5A9238" />
          <stop offset="100%" stopColor="#2D4C1E" />
        </radialGradient>
        <radialGradient id="vine-leaf-shadow" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#4A7C2F" />
          <stop offset="100%" stopColor="#1F3A12" />
        </radialGradient>
        <radialGradient id="vine-flower-petal" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="60%" stopColor="#F48FB1" />
          <stop offset="100%" stopColor="#AD1457" />
        </radialGradient>
        <radialGradient id="vine-flower-petal-dark" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#831843" />
        </radialGradient>
        <radialGradient id="vine-flower-center" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#FFCA28" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <filter id="vine-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      <g
        style={{
          transform: `scaleY(${stemProgress})`,
          transformOrigin: "960px 1080px",
          transition: "transform 0.6s ease-in-out",
        }}>
        <path
          d={LEFT_STEM_PATH}
          fill="none"
          stroke="url(#vine-stem)"
          strokeWidth="14"
          strokeLinecap="round"
          style={{
            strokeDasharray: STEM_LENGTH,
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 0.6s ease-in-out",
          }}
          filter="url(#vine-shadow)"
        />
        <path
          d={RIGHT_STEM_PATH}
          fill="none"
          stroke="url(#vine-stem)"
          strokeWidth="14"
          strokeLinecap="round"
          style={{
            strokeDasharray: STEM_LENGTH,
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 0.6s ease-in-out",
          }}
          filter="url(#vine-shadow)"
        />

        {LEFT_DECORATIONS.map((item) => {
          const visible = stage >= item.step;
          return (
            <g
              key={item.id}
              transform={`translate(${item.x}, ${item.y}) rotate(${item.rot})`}>
              <g
                style={{
                  transform: `scale(${visible ? item.scale * s(item.step) : 0})`,
                  transformOrigin: "0 0",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}>
                <VinePart type={item.type} delay={item.delay} />
              </g>
            </g>
          );
        })}

        {RIGHT_DECORATIONS.map((item) => {
          const visible = stage >= item.step;
          return (
            <g
              key={item.id}
              transform={`translate(${item.x}, ${item.y}) rotate(${item.rot})`}>
              <g
                style={{
                  transform: `scale(${visible ? item.scale * s(item.step) : 0})`,
                  transformOrigin: "0 0",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}>
                <VinePart type={item.type} delay={item.delay} />
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function VinePart({
  type,
  delay,
}: {
  type: VineDecoration["type"];
  delay: number;
}) {
  const transitionDelay = `${delay * 0.15}s`;
  const baseProps = {
    style: { transitionDelay, transition: "all 0.5s ease-out" },
  };

  if (type === "leaf-l" || type === "leaf-r") {
    const isLeft = type === "leaf-l";
    return (
      <g {...baseProps}>
        <path
          d={
            isLeft
              ? "M 0,0 C -25,-10 -40,-25 -50,-50 C -20,-45 -5,-25 0,0 Z"
              : "M 0,0 C 25,-10 40,-25 50,-50 C 20,-45 5,-25 0,0 Z"
          }
          fill="url(#vine-leaf-shadow)"
        />
        <path
          d={
            isLeft
              ? "M 0,0 C -15,-15 -30,-30 -50,-50 C -20,-45 -5,-25 0,0 Z"
              : "M 0,0 C 15,-15 30,-30 50,-50 C 20,-45 5,-25 0,0 Z"
          }
          fill="url(#vine-leaf)"
        />
        <path
          d={
            isLeft
              ? "M 0,0 C -20,-20 -30,-30 -45,-45"
              : "M 0,0 C 20,-20 30,-30 45,-45"
          }
          fill="none"
          stroke="#A7E07F"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    );
  }

  if (type === "flower") {
    return (
      <g {...baseProps}>
        <g>
          <circle cx="0" cy="-12" r="8" fill="url(#vine-flower-petal-dark)" />
          <circle cx="11" cy="-4" r="8" fill="url(#vine-flower-petal-dark)" />
          <circle cx="7" cy="9" r="8" fill="url(#vine-flower-petal-dark)" />
          <circle cx="-7" cy="9" r="8" fill="url(#vine-flower-petal-dark)" />
          <circle cx="-11" cy="-4" r="8" fill="url(#vine-flower-petal-dark)" />
        </g>
        <g>
          <circle cx="0" cy="-7" r="5" fill="url(#vine-flower-petal)" />
          <circle cx="6" cy="-2" r="5" fill="url(#vine-flower-petal)" />
          <circle cx="4" cy="5" r="5" fill="url(#vine-flower-petal)" />
          <circle cx="-4" cy="5" r="5" fill="url(#vine-flower-petal)" />
          <circle cx="-6" cy="-2" r="5" fill="url(#vine-flower-petal)" />
        </g>
        <circle cx="0" cy="0" r="6" fill="url(#vine-flower-center)" />
        <circle cx="0" cy="0" r="3" fill="#FEF3C7" />
      </g>
    );
  }

  const isLeft = type === "tendril-l";
  return (
    <g {...baseProps}>
      <path
        d={
          isLeft
            ? "M 0,0 C -30,-20 -50,-10 -40,10 C -30,30 -10,20 -15,5 C -20,-10 -40,-5 -35,5"
            : "M 0,0 C 30,-20 50,-10 40,10 C 30,30 10,20 15,5 C 20,-10 40,-5 35,5"
        }
        fill="none"
        stroke="#5A9238"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={
          isLeft
            ? "M 0,0 C -30,-20 -50,-10 -40,10 C -30,30 -10,20 -15,5 C -20,-10 -40,-5 -35,5"
            : "M 0,0 C 30,-20 50,-10 40,10 C 30,30 10,20 15,5 C 20,-10 40,-5 35,5"
        }
        fill="none"
        stroke="#87C75F"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  );
}
