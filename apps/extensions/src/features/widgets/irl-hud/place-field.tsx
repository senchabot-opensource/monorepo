import { useId, useState } from 'react';
import { BUTTON_SECONDARY, BUTTON_TEST } from '#/components/ui/button-styles';
import { FieldLabel } from '#/components/ui/field-label';
import { HINT_CLASS, INPUT_CLASS } from '#/components/ui/text-field';
import { requestJson } from '#/lib/fetch-json';
import { useI18n } from '#/lib/i18n';
import { type HudPlace, isPlaceName, MAX_PLACES, roundCoord } from '#/lib/irl-hud-url';

/**
 * Nominatim, OpenStreetMap's place search. Its usage policy allows a search a person asks for,
 * never one per keystroke, so it runs on the Search button or Enter only.
 */
export const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const RESULTS = 5;

export interface Place {
  lat: number;
  lon: number;
  name: string;
}

/** "41.0256, 28.9744" (or with a space instead of the comma) as a place; null otherwise. */
export function parseCoordinates(text: string): Place | null {
  const match = text.trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[,\s]\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lon = Number(match[2]);
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return {
    lat: roundCoord(lat),
    lon: roundCoord(lon),
    name: `${roundCoord(lat)}, ${roundCoord(lon)}`,
  };
}

/** Places matching `query`, named in `language`; throws when Nominatim doesn't answer. */
export async function searchPlaces(query: string, language: string): Promise<Place[]> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: String(RESULTS),
    'accept-language': language,
    q: query,
  });
  const found = await requestJson<{ lat: string; lon: string; display_name: string }[]>(
    `${NOMINATIM_URL}?${params.toString()}`,
  );
  return (found ?? [])
    .map((place) => ({
      lat: roundCoord(Number(place.lat)),
      lon: roundCoord(Number(place.lon)),
      name: place.display_name,
    }))
    .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lon));
}

type SearchState =
  | { status: 'idle' }
  | { status: 'searching' }
  | { status: 'done'; places: Place[] }
  | { status: 'error' };

const sameName = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * A free name for a new place: from a search result's first part ("Galata Tower, Istanbul" →
 * "galata-tower"), or place1, place2… for pasted coordinates or a name that won't do.
 */
export function suggestName(found: string | null, taken: HudPlace[]): string {
  const free = (name: string) => isPlaceName(name) && !taken.some((p) => sameName(p.name, name));
  const base = (found ?? '')
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20);
  if (base && free(base)) return base;
  let n = taken.length + 1;
  while (!free(`place${n}`)) n++;
  return `place${n}`;
}

interface PlacesFieldProps {
  places: HudPlace[];
  onChange: (places: HudPlace[]) => void;
  /** With Real Place the first saved place is where the mini-map starts. */
  startsAtFirst: boolean;
  /** Shows a place in the preview, the way !hud map would on stream. */
  onPreview: (name: string) => void;
}

/**
 * The saved places: each a one-word name and a spot found with the search or pasted as
 * coordinates. Mods switch the mini-map between them with !hud map and the name.
 */
export function PlacesField({ places, onChange, startsAtFirst, onPreview }: PlacesFieldProps) {
  const { t, locale } = useI18n();
  const id = useId();
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<SearchState>({ status: 'idle' });
  const [problem, setProblem] = useState<string | null>(null);

  const typedName = name.trim();
  /** Why the typed name won't do, or null; an empty name gets one made up. */
  const nameProblem = () => {
    if (places.length >= MAX_PLACES) return t('irlHud.placesFull', { count: MAX_PLACES });
    if (!typedName) return null;
    if (!isPlaceName(typedName)) return t('irlHud.placeNameInvalid');
    if (places.some((place) => sameName(place.name, typedName))) return t('irlHud.placeNameTaken');
    return null;
  };

  const add = (found: Place, fromSearch: boolean) => {
    const chosen = typedName || suggestName(fromSearch ? found.name : null, places);
    onChange([...places, { name: chosen, lat: found.lat, lon: found.lon }]);
    setName('');
    setQuery('');
    setSearch({ status: 'idle' });
    setProblem(null);
  };

  const run = async () => {
    const text = query.trim();
    if (!text || search.status === 'searching') return;
    const blocked = nameProblem();
    setProblem(blocked);
    if (blocked) return;
    const typed = parseCoordinates(text);
    if (typed) {
      add(typed, false);
      return;
    }
    setSearch({ status: 'searching' });
    try {
      setSearch({ status: 'done', places: await searchPlaces(text, locale) });
    } catch {
      setSearch({ status: 'error' });
    }
  };

  const move = (index: number) =>
    onChange([places[index], ...places.filter((_, other) => other !== index)]);
  const remove = (index: number) => onChange(places.filter((_, other) => other !== index));

  return (
    <div className="space-y-3">
      <div>
        <FieldLabel id={`${id}-places`} tip={t('irlHud.placesTip')}>
          {t('irlHud.places')}
        </FieldLabel>
        {places.length === 0 ? (
          <p className={`${HINT_CLASS} mt-0`}>
            {startsAtFirst ? t('irlHud.placeNeeded') : t('irlHud.placesEmpty')}
          </p>
        ) : (
          <ul
            aria-labelledby={`${id}-places`}
            className="divide-y divide-zinc-200 rounded-md border border-zinc-300 dark:divide-zinc-700 dark:border-zinc-700"
          >
            {places.map((place, index) => (
              <li key={place.name} className="flex flex-wrap items-center gap-2 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {place.name}
                    {startsAtFirst && index === 0 && (
                      <span className="ml-2 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                        {t('irlHud.placeStartsHere')}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {place.lat}, {place.lon}
                  </p>
                </div>
                {startsAtFirst && index > 0 && (
                  <button
                    type="button"
                    className={BUTTON_TEST}
                    aria-label={t('irlHud.placeStartHereLabel', { name: place.name })}
                    onClick={() => move(index)}
                  >
                    {t('irlHud.placeStartHere')}
                  </button>
                )}
                <button
                  type="button"
                  className={BUTTON_TEST}
                  aria-label={t('irlHud.placePreviewLabel', { name: place.name })}
                  onClick={() => onPreview(place.name)}
                >
                  {t('irlHud.placePreview')}
                </button>
                <button
                  type="button"
                  className={BUTTON_TEST}
                  aria-label={t('irlHud.placeRemoveLabel', { name: place.name })}
                  onClick={() => remove(index)}
                >
                  {t('irlHud.placeRemove')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,10rem)_1fr]">
        <div>
          <FieldLabel htmlFor={`${id}-name`} tip={t('irlHud.placeNameTip')}>
            {t('irlHud.placeName')}
          </FieldLabel>
          <input
            id={`${id}-name`}
            className={INPUT_CLASS}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('irlHud.placeNamePlaceholder')}
            maxLength={20}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-query`} tip={t('irlHud.placeTip')}>
            {t('irlHud.place')}
          </FieldLabel>
          <div className="flex gap-2">
            <input
              id={`${id}-query`}
              className={INPUT_CLASS}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                run();
              }}
              placeholder={t('irlHud.placePlaceholder')}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className={`${BUTTON_SECONDARY} h-9 shrink-0`}
              onClick={run}
              disabled={search.status === 'searching'}
            >
              {search.status === 'searching' ? t('irlHud.placeSearching') : t('irlHud.placeSearch')}
            </button>
          </div>
        </div>
      </div>
      {problem && (
        <p className={`${HINT_CLASS} mt-0 text-red-600 dark:text-red-400`} role="alert">
          {problem}
        </p>
      )}
      {search.status === 'error' && (
        <p className={`${HINT_CLASS} mt-0`}>{t('irlHud.placeError')}</p>
      )}
      {search.status === 'done' && search.places.length === 0 && (
        <p className={`${HINT_CLASS} mt-0`}>{t('irlHud.placeNone')}</p>
      )}
      {search.status === 'done' && search.places.length > 0 && (
        <ul className="space-y-1" aria-label={t('irlHud.placeResults')}>
          {search.places.map((place) => (
            <li key={`${place.lat},${place.lon},${place.name}`}>
              <button
                type="button"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-left text-xs text-zinc-800 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => add(place, true)}
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <p className={`${HINT_CLASS} mt-0`}>{t('irlHud.placesCommand')}</p>
        <p className={HINT_CLASS}>{t('irlHud.placePrivacy')}</p>
        <p className={HINT_CLASS}>
          <a
            className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            {t('irlHud.placeCredit')}
          </a>
        </p>
      </div>
    </div>
  );
}
