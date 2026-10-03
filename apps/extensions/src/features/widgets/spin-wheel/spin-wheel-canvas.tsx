'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SpinSlice } from './spin-logic';

export interface StandaloneSpin {
  spinId: string;
  targetAngle: number;
  durationMs: number;
  selectedIndex: number;
}

interface SpinWheelCanvasProps {
  slices: SpinSlice[];
  size?: number;
  currentSpin?: StandaloneSpin | null;
  onSpinComplete?: (winner: SpinSlice) => void;
  soundEnabled?: boolean;
  winnerTitle?: string;
  showWinnerCard?: boolean;
}

/** Fixed gold-trim look ported from the dashboard wheel theme. */
const THEME = {
  rimBase: '#1E1E24',
  rimColor: '#D4AF37',
  studColor: '#FFF8DC',
  studBorder: '#8B6508',
  hubBorder: '#D4AF37',
  hubBadge: '#D4AF37',
  pointerColor: '#EF4444',
  pointerBorder: '#FFFFFF',
} as const;

function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#FFFFFF';
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#111827' : '#FFFFFF';
}

class WheelAudio {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  playTick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext unavailable or restricted by the browser.
    }
  }

  playVictory() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      for (const [idx, freq] of [523.25, 659.25, 783.99, 1046.5].entries()) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      }
    } catch {
      // AudioContext restricted.
    }
  }
}

const wheelAudio = new WheelAudio();

export function SpinWheelCanvas({
  slices,
  size = 420,
  currentSpin,
  onSpinComplete,
  soundEnabled = true,
  winnerTitle = 'Winner!',
  showWinnerCard = true,
}: SpinWheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<SpinSlice | null>(null);
  const lastTickSliceRef = useRef(-1);
  const lastAnimatedSpinIdRef = useRef<string | null>(null);

  const onSpinCompleteRef = useRef(onSpinComplete);
  onSpinCompleteRef.current = onSpinComplete;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;
  const slicesRef = useRef(slices);
  slicesRef.current = slices;

  const numSlices = Math.max(slices.length, 1);
  const sliceAngle = (2 * Math.PI) / numSlices;

  const currentSpinId = currentSpin?.spinId;
  const currentTargetAngle = currentSpin?.targetAngle;

  useEffect(() => {
    if (!currentSpin) {
      setWinner(null);
      setIsSpinning(false);
      lastAnimatedSpinIdRef.current = null;
    }
  }, [currentSpin]);

  useEffect(() => {
    if (winner && !isSpinning) {
      const timer = setTimeout(() => setWinner(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [winner, isSpinning]);

  const drawWheel = useCallback(
    (rotationAngleDegrees: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const center = (size * dpr) / 2;
      const radius = center - 24 * dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((rotationAngleDegrees * Math.PI) / 180);

      ctx.beginPath();
      ctx.arc(0, 0, radius + 10 * dpr, 0, 2 * Math.PI);
      ctx.fillStyle = THEME.rimBase;
      ctx.fill();
      ctx.lineWidth = 8 * dpr;
      ctx.strokeStyle = THEME.rimColor;
      ctx.stroke();

      if (slices.length === 0) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#374151';
        ctx.fill();
      } else {
        slices.forEach((item, i) => {
          const startAngle = i * sliceAngle;
          const endAngle = startAngle + sliceAngle;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fillStyle = item.color;
          ctx.fill();
          ctx.lineWidth = 2 * dpr;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.stroke();

          ctx.save();
          ctx.rotate(startAngle + sliceAngle / 2);
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';

          const textColor = getContrastTextColor(item.color);
          ctx.fillStyle = textColor;
          ctx.shadowColor =
            textColor === '#FFFFFF' ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.45)';
          ctx.shadowBlur = 2 * dpr;
          ctx.shadowOffsetY = 1 * dpr;

          const hubRadius = 32 * dpr;
          const innerLimit = hubRadius + 12 * dpr;
          const outerLimit = radius - 16 * dpr;
          const maxTextWidth = Math.max(outerLimit - innerLimit, 40 * dpr);
          const maxFontForArc = Math.max(
            10 * dpr,
            Math.floor(innerLimit * Math.sin(sliceAngle / 2) * 1.8),
          );
          let currentFontSize = Math.min(
            Math.max(11, Math.min(18, Math.floor(radius / 11))) * dpr,
            maxFontForArc,
          );
          const fontStack =
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.font = `bold ${currentFontSize}px ${fontStack}`;

          let label = item.label.trim() || 'Option';
          const minFontSize = 10 * dpr;
          if (ctx.measureText(label).width > maxTextWidth && currentFontSize > minFontSize) {
            const scale = maxTextWidth / ctx.measureText(label).width;
            currentFontSize = Math.max(minFontSize, Math.floor(currentFontSize * scale));
            ctx.font = `bold ${currentFontSize}px ${fontStack}`;
          }
          if (ctx.measureText(label).width > maxTextWidth) {
            let truncated = label;
            while (truncated.length > 2 && ctx.measureText(`${truncated}…`).width > maxTextWidth) {
              truncated = truncated.slice(0, -1);
            }
            label = `${truncated}…`;
          }

          ctx.fillText(label, outerLimit, 0);
          ctx.restore();
        });
      }

      for (let i = 0; i < numSlices; i++) {
        const pinAngle = i * sliceAngle;
        ctx.beginPath();
        ctx.arc(
          Math.cos(pinAngle) * (radius + 5 * dpr),
          Math.sin(pinAngle) * (radius + 5 * dpr),
          4 * dpr,
          0,
          2 * Math.PI,
        );
        ctx.fillStyle = THEME.studColor;
        ctx.fill();
        ctx.lineWidth = 1.5 * dpr;
        ctx.strokeStyle = THEME.studBorder;
        ctx.stroke();
      }

      ctx.restore();

      ctx.save();
      const hubRadius = 32 * dpr;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 10 * dpr;
      ctx.shadowOffsetY = 2 * dpr;
      ctx.beginPath();
      ctx.arc(center, center, hubRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.lineWidth = 3.5 * dpr;
      ctx.strokeStyle = THEME.hubBorder;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(center, center, 16 * dpr, 0, 2 * Math.PI);
      ctx.fillStyle = THEME.hubBadge;
      ctx.fill();
      ctx.restore();

      ctx.save();
      const pointerWidth = 24 * dpr;
      const pointerHeight = 32 * dpr;
      const pointerY = 6 * dpr;
      ctx.beginPath();
      ctx.moveTo(center - pointerWidth / 2, pointerY);
      ctx.lineTo(center + pointerWidth / 2, pointerY);
      ctx.lineTo(center, pointerY + pointerHeight);
      ctx.closePath();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 8 * dpr;
      ctx.shadowOffsetY = 4 * dpr;
      ctx.fillStyle = THEME.pointerColor;
      ctx.fill();
      ctx.lineWidth = 2.5 * dpr;
      ctx.strokeStyle = THEME.pointerBorder;
      ctx.stroke();
      ctx.restore();
    },
    [slices, numSlices, size, sliceAngle],
  );

  const drawWheelRef = useRef(drawWheel);
  drawWheelRef.current = drawWheel;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    drawWheelRef.current(currentAngleRef.current);
  }, [size]);

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  const spinKey = useMemo(
    () => (currentSpinId ? `${currentSpinId}:${currentTargetAngle ?? 0}` : null),
    [currentSpinId, currentTargetAngle],
  );

  useEffect(() => {
    if (!currentSpin || !spinKey) return;
    if (lastAnimatedSpinIdRef.current === spinKey) return;
    lastAnimatedSpinIdRef.current = spinKey;

    const startAngle = ((currentAngleRef.current % 360) + 360) % 360;
    const targetAngle = currentSpin.targetAngle;
    const duration = currentSpin.durationMs || 6000;
    const startTime = performance.now();
    setIsSpinning(true);
    setWinner(null);
    const sliceDeg = 360 / Math.max(slicesRef.current.length, 1);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - progress) ** 5;
      const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;
      currentAngleRef.current = currentAngle;

      if (soundEnabledRef.current) {
        const normalizedAngle = ((currentAngle % 360) + 360) % 360;
        const currentSlice = Math.floor(normalizedAngle / sliceDeg);
        if (currentSlice !== lastTickSliceRef.current) {
          lastTickSliceRef.current = currentSlice;
          wheelAudio.playTick();
        }
      }

      drawWheelRef.current(currentAngle);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const won = slicesRef.current[currentSpin.selectedIndex];
        if (showWinnerCard && won) setWinner(won);
        if (soundEnabledRef.current) wheelAudio.playVictory();
        if (won) onSpinCompleteRef.current?.(won);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentSpin, spinKey, showWinnerCard]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none max-w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px`, maxWidth: '100%' }}
        className="drop-shadow-2xl h-auto aspect-square"
      />
      {showWinnerCard && winner && !isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div
            className="flex flex-col items-center rounded-2xl border-2 bg-zinc-950/90 px-6 py-5 shadow-2xl backdrop-blur-md max-w-[90%]"
            style={{
              borderColor: '#D4AF37CC',
              boxShadow: `0 0 40px #EAB30888, 0 0 20px ${winner.color}88`,
            }}
          >
            <span className="text-xs font-semibold tracking-wider uppercase text-yellow-400">
              {winnerTitle}
            </span>
            <span
              className="mt-1 text-2xl font-extrabold tracking-tight text-center max-w-xs break-words"
              style={{ color: winner.color }}
            >
              {winner.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
