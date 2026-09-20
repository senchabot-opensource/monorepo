import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

const FOCUSABLE = 'a[href], button:not([disabled])';

/** Slack around the trigger and the panel, so a shaky hand on the edge doesn't close it. */
const HOVER_SLACK = 8;

type Box = { left: number; right: number; top: number; bottom: number };

const covers = (box: Box, x: number, y: number, slack = 0) =>
  x >= box.left - slack &&
  x <= box.right + slack &&
  y >= box.top - slack &&
  y <= box.bottom + slack;

/**
 * The gap between the trigger and the panel, no wider than the two overlap. Leaving the trigger
 * downwards crosses the rest of the header row before the panel starts, and that must not read
 * as leaving the menu — but the row's other links, to the side, must.
 */
const bridgeBetween = (trigger: Box, panel: Box): Box => ({
  left: Math.max(trigger.left, panel.left),
  right: Math.min(trigger.right, panel.right),
  top: Math.min(trigger.bottom, panel.bottom),
  bottom: Math.max(trigger.top, panel.top),
});

/**
 * Disclosure button + panel of links (not an ARIA menu, so links keep their normal
 * semantics). A mouse opens it by hovering the trigger or the panel and closes it by leaving
 * them, the page, or the screen; clicking only opens, so it never shuts under the cursor that
 * just aimed at it. Closes on Escape (focus back on the button), a click outside, focus leaving
 * both, or a link click.
 * Arrow keys, Home and End move between the panel's links.
 */
export function useDisclosure() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusFirstRef = useRef(false);
  // A hovering mouse opened it, so leaving may close it; a tap or a key open is left alone.
  const pointerOpenedRef = useRef(false);
  const pointerTypeRef = useRef('');
  const panelId = useId();

  const close = useCallback(() => {
    pointerOpenedRef.current = false;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    if (focusFirstRef.current) {
      focusFirstRef.current = false;
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }

    const onPointerDown = (e: globalThis.PointerEvent) => {
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        close();
      }
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      close();
      buttonRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  // A mouse that opened the menu also closes it, the moment it leaves the trigger, the panel
  // and the bridge between them. Watching the pointer beats the trigger's own pointerleave,
  // which fires on the way down to the panel's own links.
  useEffect(() => {
    if (!open) return;

    const onPointerMove = (e: globalThis.PointerEvent) => {
      // Read at the event, not when the effect runs: hovering an already open menu flips this
      // without a re-render, and a keyboard-opened one must not close under a passing mouse.
      if (e.pointerType !== 'mouse' || !pointerOpenedRef.current) return;
      const trigger = buttonRef.current?.getBoundingClientRect();
      const panel = panelRef.current?.getBoundingClientRect();
      if (!trigger || !panel) return;
      const { clientX: x, clientY: y } = e;
      const inside =
        covers(trigger, x, y, HOVER_SLACK) ||
        covers(panel, x, y, HOVER_SLACK) ||
        covers(bridgeBetween(trigger, panel), x, y);
      // Keyboard focus inside the panel outranks the pointer: hiding it would strand focus.
      if (!inside && !panelRef.current?.contains(document.activeElement)) close();
    };

    document.addEventListener('pointermove', onPointerMove);
    return () => document.removeEventListener('pointermove', onPointerMove);
  }, [open, close]);

  // A pointer on its way out of the page reports no move once it is gone, and a tab in the
  // background reports none at all, so the watcher above never sees the menu being left: it was
  // still open on the way back, until the mouse happened to move. Losing the pointer, or losing
  // the screen, counts as leaving too.
  useEffect(() => {
    if (!open) return;

    const leave = () => {
      // The move watcher's two guards: a tap or a key opened this, or focus is parked in the
      // panel, and it is not the pointer's to close.
      if (!pointerOpenedRef.current || panelRef.current?.contains(document.activeElement)) return;
      close();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') leave();
    };

    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    // Another window took the front while the pointer stayed where it was.
    window.addEventListener('blur', leave);
    return () => {
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', leave);
    };
  }, [open, close]);

  const onBlur = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && !buttonRef.current?.contains(next) && !panelRef.current?.contains(next)) {
      close();
    }
  };

  // Spread on the trigger and the panel. Touch and pen fall through to the click.
  const hoverProps = {
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointerOpenedRef.current = true;
      setOpen(true);
    },
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
    hoverProps,
    buttonProps: {
      ref: buttonRef,
      type: 'button' as const,
      'aria-expanded': open,
      'aria-controls': panelId,
      onPointerDown: (e: PointerEvent) => {
        pointerTypeRef.current = e.pointerType;
      },
      onClick: (e: MouseEvent) => {
        // A mouse opened this by hovering and closes it by leaving, so closing here would take
        // the menu out from under its own cursor. A finger has no hover to leave with, and a
        // keyboard (detail 0) expects Enter to toggle, so both of those close it.
        const fromMouse = e.detail > 0 && pointerTypeRef.current === 'mouse';
        if (open && !fromMouse) {
          close();
          return;
        }
        // A click can be the first the pointer touches this trigger, e.g. when it opened under
        // a cursor that never moved: arm the leave watcher here too, or it would stay open.
        if (fromMouse) pointerOpenedRef.current = true;
        setOpen(true);
      },
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
        if ((e.target as HTMLElement).closest('a')) close();
      },
    },
  };
}
