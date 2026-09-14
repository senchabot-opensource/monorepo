import { type KeyboardEvent, type ReactNode, useId, useRef } from 'react';

export interface Tab<T extends string> {
  value: T;
  label: ReactNode;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Names the tab list for screen readers. */
  label: string;
  /** The selected tab's panel. */
  children: ReactNode;
}

const KEY_STEPS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_, n) => n - 1,
};

/** Tab list and one panel. Arrow keys, Home and End move between tabs and select them. */
export function Tabs<T extends string>({ tabs, value, onChange, label, children }: TabsProps<T>) {
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === value),
  );

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = KEY_STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    const next = step(index, tabs.length);
    onChange(tabs[next].value);
    buttons.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800"
      >
        {tabs.map((tab, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={tab.value}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.value}`}
              aria-selected={isSelected}
              aria-controls={`${id}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(tab.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`-mb-px inline-flex items-center gap-1.5 rounded-t border-b-2 px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                isSelected
                  ? 'border-green-500 text-zinc-900 dark:text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${tabs[selected]?.value}`}
        className="pt-3"
      >
        {children}
      </div>
    </div>
  );
}
