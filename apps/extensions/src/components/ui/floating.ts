import { type RefObject, useEffect, useLayoutEffect, useState } from 'react';

const GAP = 6;
const VIEWPORT_MARGIN = 8;

export interface AnchoredPosition {
  top: number;
  left: number;
  anchorWidth: number;
}

// Floating layers are portaled to <body> with fixed positioning so a scrollable settings panel
// can't clip them. They flip above the anchor when there isn't room below.
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  open: boolean,
  align: 'start' | 'center' = 'start',
) {
  const [position, setPosition] = useState<AnchoredPosition | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const update = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const floating = floatingRef.current?.getBoundingClientRect();
      if (!anchor || !floating) return;

      const spaceBelow = window.innerHeight - anchor.bottom;
      const fitsBelow = spaceBelow >= floating.height + GAP + VIEWPORT_MARGIN;
      const top =
        fitsBelow || anchor.top < spaceBelow
          ? anchor.bottom + GAP
          : anchor.top - GAP - floating.height;
      const preferredLeft =
        align === 'center' ? anchor.left + anchor.width / 2 - floating.width / 2 : anchor.left;
      const left = Math.max(
        VIEWPORT_MARGIN,
        Math.min(preferredLeft, window.innerWidth - floating.width - VIEWPORT_MARGIN),
      );

      setPosition({ top, left, anchorWidth: anchor.width });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, floatingRef, align]);

  return position;
}

// Closes on Escape or on a pointer press outside every given element.
export function useDismiss(
  open: boolean,
  onDismiss: () => void,
  refs: RefObject<HTMLElement | null>[],
) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!refs.some((ref) => ref.current?.contains(target))) onDismiss();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  });
}
