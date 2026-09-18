import { useEffect, useState } from 'react';
import { skinFor } from '#/features/presets/skin';
import { SkinProvider } from '#/features/presets/skin-context';
import type { FramePiece, FrameSettings } from '#/lib/frame-url';
import { hueFor } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { FRAME_CSS } from './art/shared';
import { FrameArt } from './frame-art';
import { type Look, lookFor } from './frame-look';

/** The scene demo: all three pieces on a 1920×1080 canvas, the way a streamer would lay them out. */
const SCENE = { width: 1920, height: 1080 };
const SCENE_CAMERA = { x: 64, y: 650, width: 640, height: 360 };
const SCENE_CHAT = { x: 1436, y: 64, width: 420, height: 720 };

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const measure = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return size;
}

interface FrameWidgetProps {
  settings: FrameSettings;
  /** Draws a stand-in webcam or chat inside the frame, for previews. */
  demo?: boolean;
  /** With `demo`: every piece on one canvas instead of `settings.piece` alone. */
  scene?: boolean;
}

export function FrameWidget({ settings, demo = false, scene = false }: FrameWidgetProps) {
  const skin = skinFor(settings.preset);
  const look = lookFor(skin, hueFor(settings.color, 1));
  const size = useWindowSize();

  return (
    <SkinProvider skin={skin}>
      <div
        data-testid="frame"
        data-preset={skin?.id}
        style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
      >
        <style>{FRAME_CSS}</style>
        {demo && scene ? (
          <Scene look={look} label={settings.label} motion={settings.motion} />
        ) : (
          size.width > 0 && (
            <Piece
              look={look}
              piece={settings.piece}
              label={settings.label}
              width={size.width}
              height={size.height}
              standIn={demo}
              motion={settings.motion}
            />
          )
        )}
      </div>
    </SkinProvider>
  );
}

function Scene({ look, label, motion }: { look: Look; label: string; motion: boolean }) {
  const scale = useFitScale(SCENE);
  const box = (b: { x: number; y: number; width: number; height: number }) =>
    ({ position: 'absolute', left: b.x, top: b.y, width: b.width, height: b.height }) as const;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: SCENE.width,
        height: SCENE.height,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <Piece look={look} piece="screen" label="" {...SCENE} standIn={false} motion={motion} />
      <div style={box(SCENE_CAMERA)}>
        <Piece
          look={look}
          piece="camera"
          label={label || 'senchabot'}
          {...SCENE_CAMERA}
          standIn
          motion={motion}
        />
      </div>
      <div style={box(SCENE_CHAT)}>
        <Piece look={look} piece="chat" label="Chat" {...SCENE_CHAT} standIn motion={motion} />
      </div>
    </div>
  );
}

interface PieceProps {
  look: Look;
  piece: FramePiece;
  label: string;
  width: number;
  height: number;
  standIn: boolean;
  motion: boolean;
}

function Piece({ standIn, ...props }: PieceProps) {
  return (
    <>
      {standIn && props.piece !== 'screen' && <StandIn {...props} />}
      <FrameArt {...props} />
    </>
  );
}

const CHAT_LINES = [
  { name: 'lunaa', hue: 280, width: 0.62 },
  { name: 'kaan_', hue: 150, width: 0.4 },
  { name: 'mira', hue: 20, width: 0.7 },
  { name: 'dex', hue: 200, width: 0.5 },
  { name: 'ozge', hue: 330, width: 0.58 },
  { name: 'tolga', hue: 90, width: 0.35 },
  { name: 'vex', hue: 45, width: 0.66 },
];

/** A dim webcam or chat placeholder, so a preview shows what the frame goes around. */
function StandIn({ piece, width, height }: Omit<PieceProps, 'standIn'>) {
  const pad = Math.min(width, height) * 0.1;
  if (piece === 'camera') {
    const head = Math.min(width, height) * 0.16;
    return (
      <div
        style={{
          position: 'absolute',
          inset: pad,
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 35%, #3a4350, #161a20 75%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '30%',
            width: head * 2,
            height: head * 2,
            marginLeft: -head,
            borderRadius: '50%',
            background: '#596473',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '62%',
            width: head * 5,
            height: head * 4,
            marginLeft: -head * 2.5,
            borderRadius: '50% 50% 0 0',
            background: '#596473',
          }}
        />
      </div>
    );
  }
  const row = Math.max(14, width * 0.05);
  return (
    <div
      style={{
        position: 'absolute',
        left: pad,
        right: pad,
        bottom: pad * 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: row * 0.7,
        padding: `0 ${pad * 0.8}px`,
      }}
    >
      {CHAT_LINES.map((line) => (
        <div key={line.name} style={{ display: 'flex', alignItems: 'center', gap: row * 0.5 }}>
          <span
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 700,
              fontSize: row,
              color: `hsl(${line.hue} 80% 70%)`,
              textShadow: '0 1px 2px #000',
            }}
          >
            {line.name}
          </span>
          <span
            style={{
              height: row * 0.55,
              width: `${line.width * 70}%`,
              borderRadius: row,
              background: 'rgba(255,255,255,.28)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
