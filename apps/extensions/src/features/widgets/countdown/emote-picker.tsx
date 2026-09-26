import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDismiss } from '#/components/ui/floating';
import { useT } from '#/lib/i18n';
import type { ChannelEmote } from './countdown-emotes';

interface EmotePickerProps {
  labelledBy?: string;
  /** The channel's own emotes to pick from. */
  emotes: ChannelEmote[];
  /** The picked image URL, or empty for none. */
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  /** Shown on the trigger while the list loads. */
  disabledLabel?: string;
  /** Label overrides, so other widgets can reuse the picker in their own words. */
  noneLabel?: string;
  searchLabel?: string;
  emptyLabel?: string;
  removeLabel?: string;
  closeLabel?: string;
}

const TILE_CLASS =
  'flex flex-col items-center gap-1 rounded-md p-2 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 dark:hover:bg-zinc-800';

// Filtering hundreds of tiles re-renders the grid; wait for a pause in typing first.
const SEARCH_DEBOUNCE_MS = 150;

/** A visual icon picker: a button opening a modal grid of the channel's own emote images. */
export function EmotePicker({
  labelledBy,
  emotes,
  value,
  onChange,
  disabled,
  disabledLabel,
  noneLabel,
  searchLabel,
  emptyLabel,
  removeLabel,
  closeLabel,
}: EmotePickerProps) {
  const t = useT();
  const noneText = noneLabel ?? t('countdown.emoteNone');
  const searchText = searchLabel ?? t('countdown.emoteSearch');
  const emptyText = emptyLabel ?? t('countdown.emoteEmpty');
  const removeText = removeLabel ?? t('countdown.emoteRemove');
  const closeText = closeLabel ?? t('countdown.emoteClose');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const valueId = `${id}-value`;
  useDismiss(open, () => setOpen(false), [triggerRef, panelRef]);

  useEffect(() => {
    const timer = window.setTimeout(() => setFilter(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const openPicker = () => {
    setQuery('');
    setFilter('');
    setOpen(true);
  };
  const pick = (url: string) => {
    onChange(url);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const selected = emotes.find((emote) => emote.url === value);
  const folded = filter.trim().toLocaleLowerCase();
  const matches = (emote: ChannelEmote) =>
    !folded || emote.name.toLocaleLowerCase().includes(folded);
  const platforms = (['twitch', 'kick'] as const).filter((platform) =>
    emotes.some((emote) => emote.platform === platform && matches(emote)),
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={labelledBy ? `${labelledBy} ${valueId}` : valueId}
        onClick={openPicker}
        disabled={disabled}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-zinc-100 px-3 text-left text-sm text-zinc-900 transition-colors hover:border-zinc-400 focus-visible:border-green-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600"
      >
        <span id={valueId} className="flex min-w-0 items-center gap-2">
          {disabled ? (
            <span className="truncate">{disabledLabel}</span>
          ) : selected ? (
            <>
              <img
                src={selected.url}
                alt=""
                aria-hidden="true"
                width={24}
                height={24}
                style={{ objectFit: 'contain' }}
              />
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <span className="truncate text-zinc-500">{noneText}</span>
          )}
        </span>
        <svg
          className="size-4 shrink-0 text-zinc-500"
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
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-2 border-b border-zinc-200 p-3 dark:border-zinc-700">
                <input
                  // biome-ignore lint/a11y/noAutofocus: the search is why the modal opens.
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label={searchText}
                  placeholder={searchText}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-9 w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={closeText}
                  className="grid size-9 shrink-0 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 dark:hover:bg-zinc-700 dark:hover:text-white"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                {platforms.length === 0 && (
                  <p className="px-1 py-6 text-center text-sm text-zinc-500">{emptyText}</p>
                )}
                {platforms.map((platform) => (
                  <div key={platform}>
                    <p className="px-1 pt-1 pb-2 text-xs font-medium text-zinc-500">
                      {platform === 'twitch' ? 'Twitch' : 'Kick'}
                    </p>
                    <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
                      {emotes
                        .filter((emote) => emote.platform === platform && matches(emote))
                        .map((emote) => {
                          const caption = `${emote.name} · ${emote.provider}${emote.subOnly ? ' · Sub' : ''}`;
                          return (
                            <button
                              key={emote.url}
                              type="button"
                              onClick={() => pick(emote.url)}
                              title={caption}
                              aria-label={caption}
                              aria-pressed={emote.url === value}
                              className={`${TILE_CLASS} ${
                                emote.url === value ? 'ring-2 ring-green-500 ring-inset' : ''
                              }`}
                              style={{
                                contentVisibility: 'auto',
                                containIntrinsicSize: 'auto 68px',
                              }}
                            >
                              <img
                                src={emote.thumb}
                                alt=""
                                aria-hidden="true"
                                width={40}
                                height={40}
                                loading="lazy"
                                decoding="async"
                                style={{ objectFit: 'contain' }}
                              />
                              <span className="w-full truncate text-center text-[11px] text-zinc-600 dark:text-zinc-400">
                                {emote.name}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
              {value && (
                <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => pick('')}
                    className="h-9 w-full rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {removeText}
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
