import { useId } from 'react';
import { BUTTON_TEST } from '#/components/ui/button-styles';

// Literal class strings, so Tailwind finds them.
const LAYOUTS = {
  /** Two a row on phones, four from `sm` up. */
  'two-four': {
    grid: 'grid grid-cols-2 gap-1.5 sm:grid-cols-4',
    title: 'col-span-2 text-xs font-medium text-zinc-600 sm:col-span-4 dark:text-zinc-400',
  },
  four: {
    grid: 'grid grid-cols-4 gap-1.5',
    title: 'col-span-4 text-xs font-medium text-zinc-600 dark:text-zinc-400',
  },
  three: {
    grid: 'grid grid-cols-3 gap-1.5',
    title: 'col-span-3 text-xs font-medium text-zinc-600 dark:text-zinc-400',
  },
} as const;

export interface TestButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

/** The "Try it" buttons under a setup page's preview. */
export function TestButtons({
  title,
  layout,
  buttons,
}: {
  title: string;
  layout: keyof typeof LAYOUTS;
  buttons: readonly TestButton[];
}) {
  const id = useId();
  const classes = LAYOUTS[layout];
  return (
    <fieldset aria-labelledby={`${id}-test`} className={classes.grid}>
      <span id={`${id}-test`} className={classes.title}>
        {title}
      </span>
      {buttons.map((button) => (
        <button
          key={button.label}
          type="button"
          disabled={button.disabled}
          onClick={button.onClick}
          className={BUTTON_TEST}
        >
          {button.label}
        </button>
      ))}
    </fieldset>
  );
}
