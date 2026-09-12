import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredPosition, useDismiss } from './floating';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  /** Muted text after the label, e.g. "9 stages". */
  hint?: string;
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  labelledBy?: string;
  disabled?: boolean;
}

const TYPEAHEAD_RESET_MS = 500;

// Listbox pattern: focus stays on the trigger and aria-activedescendant points at the
// highlighted option, so the portaled list never needs focus of its own.
export function Select<T extends string>({
  value,
  onChange,
  options,
  labelledBy,
  disabled,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef({ query: '', at: 0 });
  const id = useId();
  const valueId = `${id}-value`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const position = useAnchoredPosition(triggerRef, listRef, open);
  useDismiss(open, () => setOpen(false), [triggerRef, listRef]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' });
  });

  const openList = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const commit = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
  };

  // Typing a letter jumps to the next option starting with it, like a native select.
  const findByTypeahead = (key: string) => {
    const now = Date.now();
    const typeahead = typeaheadRef.current;
    typeahead.query =
      now - typeahead.at < TYPEAHEAD_RESET_MS
        ? typeahead.query + key.toLowerCase()
        : key.toLowerCase();
    typeahead.at = now;
    const from = open ? activeIndex : selectedIndex;
    const startOffset = typeahead.query.length > 1 ? 0 : 1;
    for (let i = 0; i < options.length; i++) {
      const index = (from + startOffset + i) % options.length;
      if (options[index].label.toLowerCase().startsWith(typeahead.query)) return index;
    }
    return -1;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key.length === 1 && e.key !== ' ' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const index = findByTypeahead(e.key);
      if (index === -1) return;
      if (open) setActiveIndex(index);
      else onChange(options[index].value);
      return;
    }

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
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
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        commit(activeIndex);
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
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-labelledby={labelledBy ? `${labelledBy} ${valueId}` : valueId}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-zinc-100 px-3 text-left text-sm text-zinc-900 transition-colors hover:border-zinc-400 focus-visible:border-green-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:border-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600"
      >
        <span id={valueId} className="flex min-w-0 items-baseline gap-2">
          <span className="truncate">{options[selectedIndex]?.label}</span>
          {options[selectedIndex]?.hint && (
            <span className="shrink-0 text-xs text-zinc-500">{options[selectedIndex].hint}</span>
          )}
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
              const selected = index === selectedIndex;
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
                  onClick={() => commit(index)}
                  className={`flex cursor-pointer items-center gap-3 whitespace-nowrap rounded px-2.5 py-1.5 text-sm ${
                    index === activeIndex ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                  } ${
                    selected
                      ? 'font-medium text-green-700 dark:text-green-400'
                      : 'text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <span className="flex-1">{option.label}</span>
                  {option.hint && (
                    <span className="text-xs font-normal text-zinc-500">{option.hint}</span>
                  )}
                  <svg
                    className={`size-4 shrink-0 ${selected ? '' : 'invisible'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
                  </svg>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
