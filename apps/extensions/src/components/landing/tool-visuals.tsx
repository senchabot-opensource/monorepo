import type { TranslationKey } from '#/lib/i18n';
import { useT } from '#/lib/i18n';
import type { WidgetId } from '#/lib/widgets';

/** Three facts per tool, each one backed by a setting or behaviour in the tool's code. */
export const TOOL_FEATURES: Partial<Record<WidgetId, readonly TranslationKey[]>> = {
  raffle: ['home.raffleFeatureKeyword', 'home.raffleFeatureSubs', 'home.raffleFeatureDuration'],
  'obs-bridge': ['home.obsFeatureScenes', 'home.obsFeatureCommands', 'home.obsFeatureLocal'],
};

const CHAT_ROW = { x: 24, width: 172, height: 28, gap: 8 };

const ENTRIES = [
  { name: 'moonlit', color: '#60a5fa' },
  { name: 'kappa_kid', color: '#f472b6' },
  { name: 'pixelfox', color: '#facc15', winner: true },
  { name: 'nightowl', color: '#a78bfa' },
];

const CONFETTI = [
  { x: 250, y: 34, rotate: 20, color: '#facc15' },
  { x: 298, y: 26, rotate: -30, color: '#a78bfa' },
  { x: 362, y: 36, rotate: 45, color: '#f472b6' },
  { x: 384, y: 96, rotate: -15, color: '#38bdf8' },
  { x: 372, y: 160, rotate: 30, color: '#4ade80' },
  { x: 236, y: 150, rotate: -40, color: '#38bdf8' },
  { x: 318, y: 170, rotate: 10, color: '#facc15' },
];

function Arrow() {
  return (
    <path
      d="M204 100h22m-7-7 7 7-7 7"
      fill="none"
      stroke="#71717a"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Viewers typing the keyword, and one of them drawn as the winner. */
function RaffleVisual() {
  const top = (200 - (ENTRIES.length * CHAT_ROW.height + (ENTRIES.length - 1) * CHAT_ROW.gap)) / 2;
  return (
    <svg viewBox="0 0 400 200" className="absolute inset-0 size-full" aria-hidden="true">
      {ENTRIES.map((entry, index) => {
        const y = top + index * (CHAT_ROW.height + CHAT_ROW.gap);
        return (
          <g key={entry.name}>
            <rect
              x={CHAT_ROW.x}
              y={y}
              width={CHAT_ROW.width}
              height={CHAT_ROW.height}
              rx={8}
              fill={entry.winner ? '#22c55e' : '#ffffff'}
              fillOpacity={entry.winner ? 0.12 : 0.06}
              stroke={entry.winner ? '#22c55e' : 'none'}
              strokeOpacity={0.6}
            />
            <text x={CHAT_ROW.x + 12} y={y + 18.5} fontSize={12}>
              <tspan fill={entry.color} fontWeight={600}>
                {entry.name}
              </tspan>
              <tspan dx={6} fill="#e4e4e7">
                !join
              </tspan>
            </text>
          </g>
        );
      })}
      <Arrow />
      <rect
        x={240}
        y={44}
        width={136}
        height={112}
        rx={14}
        fill="#22c55e"
        fillOpacity={0.12}
        stroke="#22c55e"
        strokeOpacity={0.45}
      />
      <g
        transform="translate(292 60) scale(1.35)"
        fill="none"
        stroke="#4ade80"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 5.5h2.5v1.5a3 3 0 0 1-3 3M7 5.5H4.5v1.5a3 3 0 0 0 3 3" />
      </g>
      <text x={308} y={132} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">
        pixelfox
      </text>
      {CONFETTI.map((piece) => (
        <rect
          key={`${piece.x}-${piece.y}`}
          x={piece.x - 3}
          y={piece.y - 1.5}
          width={6}
          height={3}
          rx={1}
          fill={piece.color}
          transform={`rotate(${piece.rotate} ${piece.x} ${piece.y})`}
        />
      ))}
    </svg>
  );
}

const SCENES = ['Just Chatting', 'Gaming', 'BRB'];
const ACTIVE_SCENE = 'Gaming';

/** A mod's !scene command in chat, and OBS switching to the matching scene. */
function ObsBridgeVisual() {
  const t = useT();
  return (
    <svg viewBox="0 0 400 200" className="absolute inset-0 size-full" aria-hidden="true">
      <g fontSize={12}>
        <text x={36} y={66} fill="#a1a1aa" opacity={0.55}>
          <tspan fill="#f472b6" fontWeight={600}>
            sunny
          </tspan>
          <tspan dx={6}>gg</tspan>
        </text>
        <text x={36} y={88} fill="#a1a1aa" opacity={0.75}>
          <tspan fill="#60a5fa" fontWeight={600}>
            moonlit
          </tspan>
          <tspan dx={6}>LUL</tspan>
        </text>
        <rect x={24} y={100} width={168} height={34} rx={9} fill="#ffffff" fillOpacity={0.08} />
        <rect x={36} y={112} width={10} height={10} rx={2} fill="#22c55e" />
        <text x={52} y={121.5}>
          <tspan fill="#4ade80" fontWeight={600}>
            mod_jay
          </tspan>
          <tspan dx={6} fill="#fafafa" fontWeight={600}>
            !scene Gaming
          </tspan>
        </text>
      </g>
      <Arrow />
      <rect
        x={238}
        y={28}
        width={140}
        height={136}
        rx={12}
        fill="#18181b"
        stroke="#ffffff"
        strokeOpacity={0.1}
      />
      <text x={252} y={50} fontSize={11} fontWeight={600} fill="#a1a1aa">
        {t('home.visualScenes')}
      </text>
      <line x1={238} x2={378} y1={60} y2={60} stroke="#ffffff" strokeOpacity={0.08} />
      {SCENES.map((scene, index) => {
        const y = 68 + index * 30;
        const active = scene === ACTIVE_SCENE;
        return (
          <g key={scene}>
            {active && (
              <>
                <rect
                  x={246}
                  y={y}
                  width={124}
                  height={26}
                  rx={6}
                  fill="#22c55e"
                  fillOpacity={0.14}
                />
                <rect x={246} y={y + 5} width={3} height={16} rx={1.5} fill="#22c55e" />
                <circle cx={358} cy={y + 13} r={3.5} fill="#4ade80" />
              </>
            )}
            <text
              x={258}
              y={y + 17}
              fontSize={12}
              fontWeight={active ? 600 : 400}
              fill={active ? '#ffffff' : '#a1a1aa'}
            >
              {scene}
            </text>
          </g>
        );
      })}
      <text
        x={308}
        y={184}
        textAnchor="middle"
        fontSize={10}
        fill="#71717a"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        ws://localhost:4455
      </text>
    </svg>
  );
}

/** Static picture of a tool for the landing card; tools have no self-running demo. */
export function ToolVisual({ id }: { id: WidgetId }) {
  if (id === 'raffle') return <RaffleVisual />;
  if (id === 'obs-bridge') return <ObsBridgeVisual />;
  return null;
}
