import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { CloseIcon } from '#/components/icons';
import { FieldLabel } from '#/components/ui/field-label';
import { useI18n } from '#/lib/i18n';
import type { SourceSize } from '#/lib/widgets';

interface CopyUrlFieldProps {
  /** The URL to copy. Empty disables Copy, e.g. before a channel is entered. */
  url: string;
  /** Defaults to "Widget URL". */
  label?: string;
  tip?: string;
  /** Muted line under the field. Hidden while the next steps panel is open. */
  hint?: ReactNode;
  /** Shown in the next steps as the browser-source size. Omit for tools that aren't sources. */
  sourceSize?: SourceSize | null;
  /** Replaces the default browser-source steps (translated lines). The test link is always added. */
  nextSteps?: string[];
  /**
   * Paste-to-edit. Makes the field editable; return true when the text is a URL this page
   * understands (and apply it). Anything else stays in the field with `invalidMessage`.
   */
  onEdit?: (text: string) => boolean;
  editPlaceholder?: string;
  invalidMessage?: string;
}

const COPIED_MS = 2000;

/** URL input with a Copy button; after the first copy it shows what to do next in OBS. */
export function CopyUrlField({
  url,
  label,
  tip,
  hint,
  sourceSize,
  nextSteps,
  onEdit,
  editPlaceholder,
  invalidMessage,
}: CopyUrlFieldProps) {
  const { t } = useI18n();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  // Text typed or pasted that isn't a URL this page understands; null shows `url`.
  const [draft, setDraft] = useState<string | null>(null);
  const invalid = Boolean(draft);
  const stepsVisible = showSteps && Boolean(url);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // No clipboard access (insecure context, denied permission): select it for a manual copy.
      // Focus first: browsers don't show a selection in an unfocused input.
      inputRef.current?.focus();
      inputRef.current?.select();
      return;
    }
    setCopied(true);
    setShowSteps(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  const handleChange = (text: string) => {
    if (onEdit?.(text)) setDraft(null);
    else setDraft(text);
  };

  const steps = nextSteps ?? [
    t('common.nextSteps.addSource'),
    t('common.nextSteps.paste'),
    ...(sourceSize ? [t('common.nextSteps.size', { ...sourceSize })] : []),
  ];

  return (
    <div>
      <FieldLabel htmlFor={`${id}-url`} tip={tip}>
        {label ?? t('common.widgetUrl')}
      </FieldLabel>
      <div className="flex">
        <input
          ref={inputRef}
          id={`${id}-url`}
          type="text"
          spellCheck={false}
          readOnly={!onEdit}
          value={draft ?? url}
          onChange={onEdit ? (e) => handleChange(e.target.value) : undefined}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={() => setDraft(null)}
          placeholder={onEdit ? editPlaceholder : undefined}
          aria-invalid={invalid}
          aria-describedby={invalid || stepsVisible || hint ? `${id}-hint` : undefined}
          className="h-9 w-full min-w-0 rounded-l-md border border-zinc-300 bg-zinc-100 px-3 text-sm text-zinc-600 placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 aria-invalid:border-red-500 aria-invalid:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={!url}
          className="h-9 shrink-0 rounded-r-md bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-900"
        >
          {copied ? t('common.copied') : t('common.copy')}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? t('common.copied') : ''}
      </span>

      {invalid ? (
        <p
          id={`${id}-hint`}
          className="mt-2 text-xs leading-relaxed text-red-600 dark:text-red-400"
        >
          {invalidMessage}
        </p>
      ) : stepsVisible ? (
        <div
          id={`${id}-hint`}
          className="mt-2 rounded-lg border border-green-500/25 bg-green-500/5 px-3 py-2.5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white">
              {t('common.nextSteps.title')}
            </p>
            <button
              type="button"
              onClick={() => setShowSteps(false)}
              aria-label={t('common.nextSteps.dismiss')}
              title={t('common.nextSteps.dismiss')}
              className="-m-1 rounded p-1 text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:text-white"
            >
              <CloseIcon className="size-3.5" />
            </button>
          </div>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-xs leading-relaxed text-zinc-600 marker:text-zinc-400 dark:text-zinc-400">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
            <li>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded font-medium text-green-700 underline decoration-green-600/30 underline-offset-2 hover:decoration-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
              >
                {t('common.nextSteps.test')}
                <span className="sr-only"> {t('common.newTab')}</span>
              </a>
            </li>
          </ol>
        </div>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-xs leading-relaxed text-zinc-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
