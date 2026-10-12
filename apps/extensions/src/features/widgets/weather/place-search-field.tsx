import { useId, useState } from 'react';
import { BUTTON_SECONDARY } from '#/components/ui/button-styles';
import { FieldLabel } from '#/components/ui/field-label';
import { HINT_CLASS, INPUT_CLASS } from '#/components/ui/text-field';
import { type Place, parseCoordinates, searchPlaces } from '#/features/widgets/irl-hud/place-field';
import { useI18n } from '#/lib/i18n';
import { PLACE_MAX_LENGTH, roundWeatherCoord } from '#/lib/weather-url';

type SearchState =
  | { status: 'idle' }
  | { status: 'searching' }
  | { status: 'done'; places: Place[] }
  | { status: 'error' };

/** "Kadıköy" from Nominatim's "Kadıköy, Istanbul, Marmara Region, Türkiye". */
export const shortPlaceName = (found: string) =>
  found.split(',')[0].trim().slice(0, PLACE_MAX_LENGTH);

interface PlaceSearchFieldProps {
  /** The picked spot, or null before one is picked. */
  lat: number | null;
  lon: number | null;
  /** `name` is the found place's short name, or null for pasted coordinates, which have none. */
  onPick: (place: { lat: number; lon: number; name: string | null }) => void;
}

/**
 * Where the weather is for: a place found with OpenStreetMap's search, or pasted coordinates.
 * Nominatim's usage policy allows a search a person asks for, never one per keystroke, so it
 * runs on the Search button or Enter only.
 */
export function PlaceSearchField({ lat, lon, onPick }: PlaceSearchFieldProps) {
  const { t, locale } = useI18n();
  const id = useId();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<SearchState>({ status: 'idle' });

  const pick = (place: Place, found: boolean) => {
    onPick({
      lat: roundWeatherCoord(place.lat),
      lon: roundWeatherCoord(place.lon),
      name: found ? shortPlaceName(place.name) : null,
    });
    setQuery('');
    setSearch({ status: 'idle' });
  };

  const run = async () => {
    const text = query.trim();
    if (!text || search.status === 'searching') return;
    const typed = parseCoordinates(text);
    if (typed) {
      pick(typed, false);
      return;
    }
    setSearch({ status: 'searching' });
    try {
      setSearch({ status: 'done', places: await searchPlaces(text, locale) });
    } catch {
      setSearch({ status: 'error' });
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <FieldLabel htmlFor={`${id}-query`} tip={t('weather.placeTip')}>
          {t('weather.place')}
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
            placeholder={t('weather.placePlaceholder')}
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
        <p className={HINT_CLASS} data-testid="weather-place-status">
          {lat !== null && lon !== null
            ? t('weather.placePicked', { coords: `${lat}, ${lon}` })
            : t('weather.placeNeeded')}
        </p>
      </div>
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
                onClick={() => pick(place, true)}
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
