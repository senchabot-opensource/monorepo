import { type ReactNode, useId, useRef, useState } from 'react';
import { CloseIcon } from '#/components/icons';
import { FieldLabel } from './field-label';
import { HINT_CLASS, INPUT_CLASS } from './text-field';

export interface TagItem {
  id: string;
  content: ReactNode;
  /** Accessible name of the chip's remove button, e.g. "Remove bob". */
  removeLabel: string;
  /** Amber chip for an entry that needs attention. */
  warning?: boolean;
  /** Extra buttons inside the chip, before the remove button. */
  actions?: ReactNode;
}

interface TagInputProps {
  label: string;
  tip?: string;
  items: TagItem[];
  /** Gets the trimmed text; the input clears afterwards. Dedupe in the caller. */
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  addLabel: string;
  placeholder?: string;
  /** Muted line shown instead of the chips while the list is empty. */
  emptyText?: string;
  /** Control before the text input, e.g. a platform picker. */
  before?: ReactNode;
}

/** Text input that adds chips on Enter or the Add button; each chip has a remove button. */
export function TagInput({
  label,
  tip,
  items,
  onAdd,
  onRemove,
  addLabel,
  placeholder,
  emptyText,
  before,
}: TagInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');

  const add = () => {
    const value = text.trim();
    if (!value) return;
    onAdd(value);
    setText('');
  };

  return (
    <div>
      <FieldLabel htmlFor={`${id}-input`} tip={tip}>
        {label}
      </FieldLabel>
      {/* Input and Add wrap under `before` as one unit when the row gets too narrow (OBS docks). */}
      <div className="flex flex-wrap gap-2">
        {before}
        <div className="flex min-w-40 flex-1 gap-2">
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              e.preventDefault();
              add();
            }}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            className={`${INPUT_CLASS} min-w-0 flex-1`}
          />
          <button
            type="button"
            onClick={add}
            disabled={!text.trim()}
            className="h-9 shrink-0 rounded-md bg-green-600 px-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-900"
          >
            {addLabel}
          </button>
        </div>
      </div>
      {items.length > 0 ? (
        <ul aria-label={label} className="mt-2 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className={`inline-flex min-w-0 items-center gap-1.5 rounded-full border py-0.5 pr-1 pl-2.5 text-xs ${
                item.warning
                  ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200'
                  : 'border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
              }`}
            >
              {item.content}
              {item.actions}
              <button
                type="button"
                onClick={() => {
                  onRemove(item.id);
                  inputRef.current?.focus();
                }}
                aria-label={item.removeLabel}
                title={item.removeLabel}
                className="rounded-full p-0.5 text-zinc-500 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:text-red-400"
              >
                <CloseIcon className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        emptyText && <p className={HINT_CLASS}>{emptyText}</p>
      )}
    </div>
  );
}
