import confetti, { type Options } from 'canvas-confetti';
import { useCallback, useEffect, useRef } from 'react';

const BURST_MS = 3000;

export type BurstOptions = Pick<Options, 'particleCount' | 'colors' | 'disableForReducedMotion'>;

/**
 * Returns a function that fires confetti from both sides for 3 s. A new burst replaces one still
 * running, so back-to-back draws don't double it, and unmounting stops it.
 */
export function useConfettiBurst(options: BurstOptions) {
  const frameRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  return useCallback(() => {
    cancel();
    const end = Date.now() + BURST_MS;
    const frame = () => {
      confetti({ ...options, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ ...options, angle: 120, spread: 55, origin: { x: 1 } });
      frameRef.current = Date.now() < end ? requestAnimationFrame(frame) : null;
    };
    frameRef.current = requestAnimationFrame(frame);
  }, [cancel, options]);
}
