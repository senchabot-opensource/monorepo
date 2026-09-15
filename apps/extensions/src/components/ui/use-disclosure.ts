import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Disclosure button + panel of links (not an ARIA menu, so links keep their normal
 * semantics). Closes on Escape (focus back on the button), a click outside, focus leaving
 * both, or a link click. Arrow keys, Home and End move between the panel's links.
 */
export function useDisclosure() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusFirstRef = useRef(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    if (focusFirstRef.current) {
      focusFirstRef.current = false;
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onBlur = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && !buttonRef.current?.contains(next) && !panelRef.current?.contains(next)) {
      setOpen(false);
    }
  };

  const moveFocus = (e: KeyboardEvent<HTMLElement>) => {
    const items = [...(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? items.length - 1
          : e.key === 'ArrowDown'
            ? (index + 1) % items.length
            : e.key === 'ArrowUp'
              ? (index - 1 + items.length) % items.length
              : -1;
    if (next === -1) return;
    e.preventDefault();
    items[next].focus();
  };

  return {
    open,
    setOpen,
    buttonProps: {
      ref: buttonRef,
      type: 'button' as const,
      'aria-expanded': open,
      'aria-controls': panelId,
      onClick: () => setOpen((value) => !value),
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key !== 'ArrowDown') return;
        e.preventDefault();
        if (open) {
          panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
        } else {
          focusFirstRef.current = true;
          setOpen(true);
        }
      },
      onBlur,
    },
    // Spread on a panel that stays mounted, so aria-controls always resolves.
    panelProps: {
      ref: panelRef,
      id: panelId,
      hidden: !open,
      onKeyDown: moveFocus,
      onBlur,
      onClick: (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('a')) setOpen(false);
      },
    },
  };
}
