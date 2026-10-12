import { useId, useState } from 'react';
import { BUTTON_SECONDARY } from '#/components/ui/button-styles';
import { FieldLabel } from '#/components/ui/field-label';
import { HINT_CLASS, INPUT_CLASS } from '#/components/ui/text-field';
import { requestJson } from '#/lib/fetch-json';
import { useI18n } from '#/lib/i18n';
import { roundCoord } from '#/lib/irl-hud-url';

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

interface PlaceFieldProps {
  lat: number | null;
  lon: number | null;
  /** The picked place's name, when it came from a search; coordinates show otherwise. */
  name: string | null;
  onPick: (place: Place) => void;
}

/** Search box for the mini-map's real place, or a pasted latitude and longitude. */
export function PlaceField({ lat, lon, name, onPick }: PlaceFieldProps) {
  const { t, locale } = useI18n();
  const id = useId();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<SearchState>({ status: 'idle' });

  const run = async () => {
    const text = query.trim();
    if (!text || search.status === 'searching') return;
    const typed = parseCoordinates(text);
    if (typed) {
      onPick(typed);
      setSearch({ status: 'idle' });
      return;
    }
    setSearch({ status: 'searching' });
    try {
      setSearch({ status: 'done', places: await searchPlaces(text, locale) });
    } catch {
      setSearch({ status: 'error' });
    }
  };

  const picked = lat !== null && lon !== null;
  return (
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
      {search.status === 'error' && <p className={HINT_CLASS}>{t('irlHud.placeError')}</p>}
      {search.status === 'done' && search.places.length === 0 && (
        <p className={HINT_CLASS}>{t('irlHud.placeNone')}</p>
      )}
      {search.status === 'done' && search.places.length > 0 && (
        <ul className="mt-2 space-y-1" aria-label={t('irlHud.placeResults')}>
          {search.places.map((place) => (
            <li key={`${place.lat},${place.lon},${place.name}`}>
              <button
                type="button"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-left text-xs text-zinc-800 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => {
                  onPick(place);
                  setSearch({ status: 'idle' });
                }}
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className={HINT_CLASS}>
        {picked
          ? t('irlHud.placePicked', { place: name ?? `${lat}, ${lon}` })
          : t('irlHud.placeNeeded')}
      </p>
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
  );
}
