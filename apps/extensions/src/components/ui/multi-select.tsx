import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredPosition, useDismiss } from './floating';

export interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
  // CSS background for the ticked checkbox; the default is the app's green.
  color?: string;
}

interface MultiSelectProps<T extends string> {
  value: T[];
  onChange: (value: T[]) => void;
  options: MultiSelectOption<T>[];
  // Shown on the trigger in place of a single selected label.
  summary: string;
  labelledBy?: string;
}

// Same listbox pattern as Select, but picking an option toggles it and keeps the list open.
export function MultiSelect<T extends string>({
  value,
  onChange,
  options,
  summary,
  labelledBy,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const valueId = `${id}-value`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const position = useAnchoredPosition(triggerRef, listRef, open);
  useDismiss(open, () => setOpen(false), [triggerRef, listRef]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' });
  });

  // Rebuilt from options so the selection keeps the options' order however it was clicked.
  const toggle = (index: number) => {
    const target = options[index].value;
    onChange(
      options
        .map((option) => option.value)
        .filter((v) => (v === target ? !value.includes(v) : value.includes(v))),
    );
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setActiveIndex(0);
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggle(activeIndex);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-labelledby={labelledBy ? `${labelledBy} ${valueId}` : valueId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onKeyDown}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-zinc-100 px-3 text-left text-sm text-zinc-900 transition-colors hover:border-zinc-400 focus-visible:border-green-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 aria-expanded:border-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600"
      >
        <span id={valueId} className="truncate">
          {summary}
        </span>
        <svg
          className={`size-4 shrink-0 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelledBy}
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              minWidth: position?.anchorWidth,
              visibility: position ? undefined : 'hidden',
            }}
            className="fixed z-[60] max-h-72 overflow-y-auto rounded-md border border-zinc-200 bg-white p-1 font-sans shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            {options.map((option, index) => {
              const selected = value.includes(option.value);
              return (
                // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection lives on the trigger via aria-activedescendant.
                <div
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  tabIndex={-1}
                  aria-selected={selected}
                  // Keeps focus on the trigger so its keyboard handling keeps working.
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => toggle(index)}
                  className={`flex cursor-pointer items-center gap-2.5 whitespace-nowrap rounded px-2.5 py-1.5 text-sm text-zinc-800 dark:text-zinc-200 ${
                    index === activeIndex ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                      !selected
                        ? 'border-zinc-400 dark:border-zinc-600'
                        : option.color
                          ? 'border-transparent text-zinc-950'
                          : 'border-green-500 bg-green-500 text-white'
                    }`}
                    style={selected && option.color ? { background: option.color } : undefined}
                  >
                    {selected && (
                      <svg
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  {option.hint && <span className="text-xs text-zinc-500">{option.hint}</span>}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
