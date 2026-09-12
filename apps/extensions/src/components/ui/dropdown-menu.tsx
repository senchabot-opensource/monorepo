import type { ReactNode } from 'react';
import { ChevronDownIcon } from '#/components/icons';
import { useDisclosure } from './use-disclosure';

/** The floating surface shared by dropdowns, so every menu on the site looks the same. */
export const DROPDOWN_PANEL_CLASS =
  'rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900';

/** A row inside a dropdown panel: a link or button with the same hover and focus look. */
export const DROPDOWN_ITEM_CLASS =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 aria-[current=page]:font-medium aria-[current=page]:text-green-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:aria-[current=page]:text-green-400';

interface DropdownMenuProps {
  /** Trigger content. A chevron is appended unless `chevron` is false. */
  label: ReactNode;
  /** Accessible name when `label` is an icon only. */
  ariaLabel?: string;
  /** Trigger look; it always gets a pointer cursor and the open state via `aria-expanded`. */
  triggerClassName: string;
  chevron?: boolean;
  /** Which side of the anchor the panel lines up with. */
  align?: 'start' | 'end';
  /**
   * `trigger` positions the panel under the button. `container` positions it under the nearest
   * positioned ancestor instead, for wide panels that must not run off a tablet screen.
   */
  anchor?: 'trigger' | 'container';
  /** Replaces the horizontal position that `align` sets, e.g. `left-4` to match a padded row. */
  positionClassName?: string;
  /** Width and padding of the panel. */
  panelClassName?: string;
  /** Panel content: links or buttons. Arrow keys, Home and End move between them. */
  children: ReactNode;
}

/**
 * Disclosure-style dropdown of links (not an ARIA menu, so links keep link semantics). The
 * panel stays next to the trigger in the DOM so Tab moves into it naturally.
 */
export function DropdownMenu({
  label,
  ariaLabel,
  triggerClassName,
  chevron = true,
  align = 'start',
  anchor = 'trigger',
  positionClassName,
  panelClassName = 'w-72 p-1.5',
  children,
}: DropdownMenuProps) {
  const { open, buttonProps, panelProps } = useDisclosure();
  const position = positionClassName ?? (align === 'end' ? 'right-0' : 'left-0');

  const content = (
    <>
      <button
        {...buttonProps}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={`cursor-pointer ${triggerClassName}`}
      >
        {label}
        {chevron && (
          <ChevronDownIcon className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>
      <div
        {...panelProps}
        className={`${DROPDOWN_PANEL_CLASS} absolute top-full z-50 mt-1 max-w-[calc(100vw-2rem)] ${position} ${panelClassName}`}
      >
        {children}
      </div>
    </>
  );

  return anchor === 'trigger' ? <div className="relative">{content}</div> : content;
}
