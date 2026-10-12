import { useEffect, useState } from 'react';

/** Scale that fits a stage of this design size inside the window, for a browser source of any size. */
export function useFitScale(stage: { width: number; height: number }): number {
  const { width, height } = stage;
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const measure = () =>
      setScale(Math.min(window.innerWidth / width, window.innerHeight / height));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [width, height]);
  return scale;
}

/**
 * Scale for the browser source's short side, for overlays drawn for a 1080p scene: a vertical
 * canvas gets them at its own size too.
 */
export function useShortSideScale(designShortSide = 1080): number {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const measure = () =>
      setScale(Math.min(window.innerWidth, window.innerHeight) / designShortSide);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [designShortSide]);
  return scale;
}
