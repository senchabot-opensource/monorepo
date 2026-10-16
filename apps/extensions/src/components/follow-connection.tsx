import { useHydrated } from '@tanstack/react-router';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { BUTTON_TEST } from '#/components/ui/button-styles';
import { FieldLabel } from '#/components/ui/field-label';
import { INPUT_CLASS } from '#/components/ui/text-field';
import { readFollowToken } from '#/hooks/use-follows';
import { useI18n } from '#/lib/i18n';
import { resolveDashboardFollowerGoalUrl } from '#/lib/links';

/**
 * Picks up a Senchabot connection from the page's own link (`?token=`, as the Dashboard opens
 * Follower Goal with), once it has mounted, so the prerendered page and the first render agree.
 */
export function useLinkedFollowToken(apply: (token: string) => void) {
  const applyRef = useRef(apply);
  applyRef.current = apply;
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')?.trim();
    if (token) applyRef.current(token);
  }, []);
}

interface FollowConnectionProps {
  /** The connection's token; empty while there is none. */
  token: string;
  onTokenChange: (token: string) => void;
}

/**
 * The Senchabot connection that brings follows in, the same one Follower Goal uses: a page
 * opened from the Dashboard comes with it, or its Follower Goal URL or token is pasted here.
 */
export function FollowConnection({ token, onTokenChange }: FollowConnectionProps) {
  const { t } = useI18n();
  const mounted = useHydrated();
  const id = useId();
  const [text, setText] = useState('');
  const [invalid, setInvalid] = useState(false);

  if (token) {
    return (
      <div
        data-testid="follow-connection"
        data-connected="true"
        className="flex items-center justify-between gap-3 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200"
      >
        <span className="font-medium">✓ {t('followConnection.connected')}</span>
        <button
          type="button"
          className={BUTTON_TEST}
          onClick={() => {
            onTokenChange('');
            setText('');
          }}
        >
          {t('followConnection.disconnect')}
        </button>
      </div>
    );
  }

  const connect = (event: FormEvent) => {
    event.preventDefault();
    const found = readFollowToken(text);
    setInvalid(found === null);
    if (!found) return;
    onTokenChange(found);
    setText('');
  };

  return (
    <div
      data-testid="follow-connection"
      data-connected="false"
      className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
    >
      <div className="font-semibold text-amber-950 dark:text-amber-100">
        {t('followConnection.title')}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-200/90">
        {t('followConnection.text')}
      </p>
      <a
        href={resolveDashboardFollowerGoalUrl(mounted)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 dark:bg-amber-400 dark:text-zinc-950 dark:hover:bg-amber-300"
      >
        {t('followConnection.dashboard')}
      </a>
      <form onSubmit={connect} className="mt-3">
        <FieldLabel htmlFor={`${id}-token`}>{t('followConnection.paste')}</FieldLabel>
        <div className="flex gap-2">
          <input
            id={`${id}-token`}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setInvalid(false);
            }}
            placeholder={t('followConnection.placeholder')}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${id}-invalid` : undefined}
            className={INPUT_CLASS}
          />
          <button type="submit" className={`${BUTTON_TEST} h-9 shrink-0`} disabled={!text.trim()}>
            {t('followConnection.connect')}
          </button>
        </div>
        {invalid && (
          <p id={`${id}-invalid`} className="mt-1 text-xs text-red-700 dark:text-red-400">
            {t('followConnection.invalid')}
          </p>
        )}
      </form>
    </div>
  );
}
