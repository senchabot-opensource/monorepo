import { type KeyboardEvent, type ReactNode, useId, useRef } from 'react';

export interface Tab<T extends string> {
  value: T;
  label: ReactNode;
}

type TabsProps<T extends string> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Names the tab list for screen readers. */
  label: string;
  /**
   * The list scrolls sideways instead of running off the box, for labels that may not fit a
   * phone in every language.
   */
  scrollable?: boolean;
  /** Extra classes for the tab list, e.g. to make it sticky. */
  listClassName?: string;
} & (
  | {
      /** The selected tab's panel. */
      children: ReactNode;
      panels?: never;
    }
  | {
      /**
       * Every tab's panel. All of them stay mounted and the unselected ones are hidden, so what
       * a panel holds (a half-typed search, a folded group) survives a switch.
       */
      panels: Record<T, ReactNode>;
      children?: never;
    }
);

const KEY_STEPS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_, n) => n - 1,
};

/**
 * Tab list and its panel: only the selected one, or all of them with the rest hidden. Arrow
 * keys, Home and End move between tabs and select them.
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  scrollable = false,
  listClassName = '',
  children,
  panels,
}: TabsProps<T>) {
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === value),
  );
  const panelId = (tab: T) => (panels ? `${id}-panel-${tab}` : `${id}-panel`);

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
        // A scrolling list clips the tabs' 1px overlap with a border, so its baseline is a shadow.
        className={`flex gap-1 ${
          scrollable
            ? 'overflow-x-auto shadow-[inset_0_-1px_0_var(--color-zinc-200)] [scrollbar-width:none] dark:shadow-[inset_0_-1px_0_var(--color-zinc-800)] [&::-webkit-scrollbar]:hidden'
            : 'border-b border-zinc-200 dark:border-zinc-800'
        } ${listClassName}`}
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
              aria-controls={panelId(tab.value)}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(tab.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`inline-flex items-center gap-1.5 rounded-t border-b-2 px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                scrollable ? 'shrink-0 whitespace-nowrap focus-visible:ring-inset' : '-mb-px'
              } ${
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
      {panels ? (
        tabs.map((tab, index) => (
          <div
            key={tab.value}
            role="tabpanel"
            id={panelId(tab.value)}
            aria-labelledby={`${id}-tab-${tab.value}`}
            hidden={index !== selected}
            className="pt-3"
          >
            {panels[tab.value]}
          </div>
        ))
      ) : (
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${tabs[selected]?.value}`}
          className="pt-3"
        >
          {children}
        </div>
      )}
    </div>
  );
}
