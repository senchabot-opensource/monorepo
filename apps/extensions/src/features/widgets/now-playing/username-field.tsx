import { useId, useState } from 'react';
import { BUTTON_SECONDARY } from '#/components/ui/button-styles';
import { FieldLabel } from '#/components/ui/field-label';
import { HINT_CLASS, INPUT_CLASS } from '#/components/ui/text-field';
import { useI18n } from '#/lib/i18n';
import { cleanUsername, type NowPlayingSource } from '#/lib/now-playing-url';
import { checkNowPlaying, SOURCE_NAMES, type Track } from './now-playing-api';

type CheckResult =
  | { status: 'checking' }
  | { status: 'playing'; track: Track }
  | { status: 'quiet' }
  | { status: 'missing' }
  | { status: 'error' };

// Room for a pasted profile link, which is cut down to its name.
const INPUT_MAX_LENGTH = 200;

interface UsernameFieldProps {
  source: NowPlayingSource;
  value: string;
  onChange: (value: string) => void;
}

/**
 * The profile to read, with a Check that asks the service once what it plays now, so a typo
 * shows up here rather than as an empty overlay. It asks only when pressed, never per keystroke.
 */
export function UsernameField({ source, value, onChange }: UsernameFieldProps) {
  const { t } = useI18n();
  const id = useId();
  const user = cleanUsername(value);
  const service = SOURCE_NAMES[source];
  // A result belongs to the name and service it was for; changing either clears it.
  const key = `${source}\n${user}`;
  const [check, setCheck] = useState<{ key: string; result: CheckResult } | null>(null);
  const result = check?.key === key ? check.result : null;
  const checking = result?.status === 'checking';

  const run = async () => {
    if (!user || checking) return;
    setCheck({ key, result: { status: 'checking' } });
    let next: CheckResult;
    try {
      const found = await checkNowPlaying(source, user);
      if (found === 'missing') next = { status: 'missing' };
      else next = found ? { status: 'playing', track: found } : { status: 'quiet' };
    } catch {
      next = { status: 'error' };
    }
    setCheck((current) => (current?.key === key ? { key, result: next } : current));
  };

  let message = '';
  if (!user) message = t('nowPlaying.userNeeded');
  else if (result?.status === 'playing') {
    const { title, artist } = result.track;
    message = artist
      ? t('nowPlaying.checkPlaying', { title, artist })
      : t('nowPlaying.checkPlayingTitle', { title });
  } else if (result?.status === 'quiet') message = t('nowPlaying.checkQuiet', { user, service });
  else if (result?.status === 'missing') message = t('nowPlaying.checkMissing', { user, service });
  else if (result?.status === 'error') message = t('nowPlaying.checkError', { service });

  return (
    <div>
      <FieldLabel
        htmlFor={`${id}-user`}
        // tip={t(source === 'lastfm' ? 'nowPlaying.userTipLastfm' : 'nowPlaying.userTip')}
        tip={t('nowPlaying.userTipLastfm')}
      >
        {t('nowPlaying.user')}
      </FieldLabel>
      <div className="flex gap-2">
        <input
          id={`${id}-user`}
          className={INPUT_CLASS}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            run();
          }}
          placeholder={t('nowPlaying.userPlaceholder')}
          maxLength={INPUT_MAX_LENGTH}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button
          type="button"
          className={`${BUTTON_SECONDARY} h-9 shrink-0`}
          onClick={run}
          disabled={!user || checking}
        >
          {checking ? t('nowPlaying.checking') : t('nowPlaying.check')}
        </button>
      </div>
      <p className={HINT_CLASS} role="status" data-testid="now-playing-check">
        {message}
      </p>
    </div>
  );
}
