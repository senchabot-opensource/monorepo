import type { ReactNode } from 'react';
import { InfoTip } from './info-tip';

const LABEL_CLASS = 'text-xs font-medium text-zinc-600 dark:text-zinc-400';

interface FieldLabelProps {
  children: ReactNode;
  tip?: string;
  // Native inputs take `htmlFor`; custom widgets reference the label through `id` and
  // aria-labelledby, since clicking a <label> would also open or toggle them.
  htmlFor?: string;
  id?: string;
}

export function FieldLabel({ children, tip, htmlFor, id }: FieldLabelProps) {
  return (
    <div className="mb-1 flex items-center gap-1">
      {htmlFor ? (
        <label htmlFor={htmlFor} id={id} className={LABEL_CLASS}>
          {children}
        </label>
      ) : (
        <span id={id} className={LABEL_CLASS}>
          {children}
        </span>
      )}
      {tip && <InfoTip text={tip} />}
    </div>
  );
}
