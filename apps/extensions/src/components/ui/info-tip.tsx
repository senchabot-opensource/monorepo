import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '#/lib/i18n';
import { useAnchoredPosition, useDismiss } from './floating';

export function InfoTip({ text }: { text: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  // Mouse users get the tip on hover, so their click must not toggle it back off; touch and
  // keyboard have no hover and rely on the click toggle.
  const pointerTypeRef = useRef('');
  const tipId = useId();
  const position = useAnchoredPosition(buttonRef, tipRef, open, 'center');
  useDismiss(open, () => setOpen(false), [buttonRef, tipRef]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={t('common.moreInfo')}
        aria-describedby={open ? tipId : undefined}
        onPointerDown={(e) => {
          pointerTypeRef.current = e.pointerType;
        }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
        onClick={() => {
          const pointerType = pointerTypeRef.current;
          pointerTypeRef.current = '';
          if (pointerType !== 'mouse') setOpen((value) => !value);
        }}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setOpen(true)}
        onBlur={() => setOpen(false)}
        className="-m-1 inline-flex shrink-0 items-center justify-center rounded-full p-1 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-zinc-500 dark:hover:text-zinc-200"
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"
          />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={tipId}
            role="tooltip"
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              visibility: position ? undefined : 'hidden',
            }}
            className="pointer-events-none fixed z-[60] max-w-64 rounded-md bg-zinc-900 px-2.5 py-1.5 font-sans text-xs leading-relaxed text-zinc-50 shadow-lg dark:border dark:border-zinc-700 dark:bg-zinc-800"
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
