'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { findPreset } from '#/features/presets/registry';
import { rgba, type Skin, shade, titleStyle } from '#/features/presets/skin';
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
  /** A preset's look; null keeps the classic gold trim. */
  skin?: Skin | null;
}

interface WheelTheme {
  rimBase: string;
  rimColor: string;
  studColor: string;
  studBorder: string;
  hubFill: string;
  hubBorder: string;
  hubBadge: string;
  pointerColor: string;
  pointerBorder: string;
  sliceBorder: string;
  /** Label colors on dark and on light slices. */
  lightText: string;
  darkText: string;
  /** Label weight and font stack, as the canvas `font` takes them. */
  fontWeight: string;
  fontFamily: string;
}

/** Fixed gold-trim look ported from the dashboard wheel theme. */
const CLASSIC_THEME: WheelTheme = {
  rimBase: '#1E1E24',
  rimColor: '#D4AF37',
  studColor: '#FFF8DC',
  studBorder: '#8B6508',
  hubFill: '#111827',
  hubBorder: '#D4AF37',
  hubBadge: '#D4AF37',
  pointerColor: '#EF4444',
  pointerBorder: '#FFFFFF',
  sliceBorder: 'rgba(255, 255, 255, 0.4)',
  lightText: '#FFFFFF',
  darkText: '#111827',
  fontWeight: 'bold',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

/**
 * The boldest weight up to 700 that a preset's font ships, from its Google Fonts `wght` spec
 * ("400..900" or "400;700"): asking a canvas for a weight the font lacks makes it fake one.
 */
export function labelWeight(weights: string): number {
  const [low, high] = weights.split('..').map(Number);
  if (high !== undefined) return Math.max(low ?? 400, Math.min(700, high));
  const listed = weights.split(';').map(Number);
  const fitting = listed.filter((weight) => weight <= 700);
  return fitting.length > 0 ? Math.max(...fitting) : Math.min(...listed);
}

/** The wheel in a preset: its frame metal for the rim and studs, its accent for the pointer. */
function themeFor(skin: Skin): WheelTheme {
  const { colors } = skin;
  const weights = findPreset(skin.id)?.data.fonts.display.weights ?? '400';
  return {
    rimBase: colors.panel2,
    rimColor: skin.frame,
    studColor: skin.frame,
    studBorder: skin.frame2,
    hubFill: colors.panel2,
    hubBorder: skin.frame,
    hubBadge: shade(skin.accent, 55),
    pointerColor: shade(skin.accent, 55),
    pointerBorder: skin.frame,
    sliceBorder: rgba(skin.frame, 0.45),
    lightText: skin.text,
    darkText: colors.panel2,
    fontWeight: String(labelWeight(weights)),
    fontFamily: skin.display,
  };
}

/** How tall a font's lowercase letters stand, as a share of its size; 0 when it can't tell. */
function xHeight(ctx: CanvasRenderingContext2D, weight: string, family: string): number {
  ctx.font = `${weight} 100px ${family}`;
  return (ctx.measureText('x').actualBoundingBoxAscent || 0) / 100;
}

/**
 * How much bigger a preset's labels are set so their letters stand as tall as the classic
 * font's: condensed and pixel display fonts like Teko and Jersey 10 run small at one size.
 */
function labelScale(ctx: CanvasRenderingContext2D, theme: WheelTheme): number {
  if (theme === CLASSIC_THEME) return 1;
  const own = xHeight(ctx, theme.fontWeight, theme.fontFamily);
  const classic = xHeight(ctx, CLASSIC_THEME.fontWeight, CLASSIC_THEME.fontFamily);
  return own > 0 && classic > 0 ? Math.min(1.4, Math.max(1, classic / own)) : 1;
}

/** Whether a slice color is light enough to want dark text. */
function isLight(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return false;
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140;
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
  skin = null,
}: SpinWheelCanvasProps) {
  const theme = useMemo(() => (skin ? themeFor(skin) : CLASSIC_THEME), [skin]);
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
      const labelBoost = labelScale(ctx, theme);
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((rotationAngleDegrees * Math.PI) / 180);

      ctx.beginPath();
      ctx.arc(0, 0, radius + 10 * dpr, 0, 2 * Math.PI);
      ctx.fillStyle = theme.rimBase;
      ctx.fill();
      ctx.lineWidth = 8 * dpr;
      ctx.strokeStyle = theme.rimColor;
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
          ctx.strokeStyle = theme.sliceBorder;
          ctx.stroke();

          ctx.save();
          ctx.rotate(startAngle + sliceAngle / 2);
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';

          const light = isLight(item.color);
          ctx.fillStyle = light ? theme.darkText : theme.lightText;
          ctx.shadowColor = light ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.55)';
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
            Math.max(11, Math.min(18, Math.floor(radius / 11))) * dpr * labelBoost,
            maxFontForArc,
          );
          ctx.font = `${theme.fontWeight} ${currentFontSize}px ${theme.fontFamily}`;

          let label = item.label.trim() || 'Option';
          const minFontSize = 10 * dpr;
          if (ctx.measureText(label).width > maxTextWidth && currentFontSize > minFontSize) {
            const scale = maxTextWidth / ctx.measureText(label).width;
            currentFontSize = Math.max(minFontSize, Math.floor(currentFontSize * scale));
            ctx.font = `${theme.fontWeight} ${currentFontSize}px ${theme.fontFamily}`;
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
        ctx.fillStyle = theme.studColor;
        ctx.fill();
        ctx.lineWidth = 1.5 * dpr;
        ctx.strokeStyle = theme.studBorder;
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
      ctx.fillStyle = theme.hubFill;
      ctx.fill();
      ctx.lineWidth = 3.5 * dpr;
      ctx.strokeStyle = theme.hubBorder;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(center, center, 16 * dpr, 0, 2 * Math.PI);
      ctx.fillStyle = theme.hubBadge;
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
      ctx.fillStyle = theme.pointerColor;
      ctx.fill();
      ctx.lineWidth = 2.5 * dpr;
      ctx.strokeStyle = theme.pointerBorder;
      ctx.stroke();
      ctx.restore();
    },
    [slices, numSlices, size, sliceAngle, theme],
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

  // A canvas paints with whatever font is there and never repaints when a web font arrives, so
  // the wheel redraws each time the page finishes loading fonts.
  useEffect(() => {
    if (!skin || typeof document === 'undefined' || !document.fonts) return;
    const redraw = () => drawWheelRef.current(currentAngleRef.current);
    document.fonts.addEventListener('loadingdone', redraw);
    return () => document.fonts.removeEventListener('loadingdone', redraw);
  }, [skin]);

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
      {skin && (
        // Only text on the page makes the browser fetch a font, and only the subsets its letters
        // need, so the labels are set here unseen; the wheel redraws once they've loaded.
        <span
          aria-hidden="true"
          className="pointer-events-none absolute opacity-0"
          style={{ fontFamily: theme.fontFamily, fontWeight: theme.fontWeight }}
        >
          {slices.map((slice) => slice.label).join(' ')}
        </span>
      )}
      {showWinnerCard && winner && !isSpinning && skin && (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div
            className="relative flex max-w-[90%] flex-col items-center px-8 pt-5 pb-6"
            style={{
              ...panelStyle(skin, 16),
              color: skin.text,
              fontFamily: skin.display,
              fontSynthesis: 'none',
            }}
          >
            <span
              className="text-sm font-bold"
              style={{ ...titleStyle(skin), color: shade(skin.win, 68) }}
            >
              {winnerTitle}
            </span>
            <span
              className="mt-1 max-w-xs text-center text-3xl font-extrabold break-words"
              style={{ textShadow: skin.textShadow }}
            >
              {winner.label}
            </span>
            <Frame skin={skin} radius={16} fx="hero" />
          </div>
        </div>
      )}
      {showWinnerCard && winner && !isSpinning && !skin && (
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
