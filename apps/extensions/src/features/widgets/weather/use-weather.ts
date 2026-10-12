import { useEffect, useMemo, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import { retryDelay } from '#/lib/fetch-json';
import { DEFAULT_DEMO_SKY, type DemoSky, demoForecast } from './demo-forecast';
import {
  afterRefusal,
  cacheForecast,
  type Forecast,
  fetchForecast,
  nextFetchAt,
  readCachedForecast,
} from './met-forecast';

/** The setup page's test buttons reach its preview on this channel. */
export const PREVIEW_CHANNEL = 'senchabot:weather-preview';

/** Sample weather to show instead of the real one; null goes back to the real weather. */
export type PreviewMessage = { type: 'sky'; sky: DemoSky | null; preview: string };

const MINUTE = 60_000;

/** Date.now(), once a minute, so the overlay moves on to the next hour of the forecast. */
export function useMinute(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), MINUTE);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/**
 * MET's forecast for (lat, lon), asked again when its `Expires` says, and saved in OBS so a reload
 * shows it at once without asking early. Null while there's no place or no answer yet.
 */
function useLiveForecast(lat: number | null, lon: number | null): Forecast | null {
  const [forecast, setForecast] = useState<Forecast | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) {
      setForecast(null);
      return;
    }
    let stopped = false;
    let timer: number | undefined;
    const wait = (at: number, attempt: number) => {
      timer = window.setTimeout(() => load(attempt), Math.max(0, at - Date.now()));
    };
    const load = async (attempt: number) => {
      try {
        const fresh = await fetchForecast(lat, lon);
        if (stopped) return;
        if (!fresh) {
          wait(afterRefusal(Date.now()), 0);
          return;
        }
        setForecast(fresh);
        cacheForecast(lat, lon, fresh);
        wait(nextFetchAt(fresh.expires, fresh.fetchedAt), 0);
      } catch {
        // OBS can start a source before the network is up, and MET can have a bad minute.
        if (!stopped) wait(Date.now() + retryDelay(attempt), attempt + 1);
      }
    };

    const cached = readCachedForecast(lat, lon);
    setForecast(cached);
    if (cached) wait(nextFetchAt(cached.expires, cached.fetchedAt), 0);
    else load(0);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [lat, lon]);

  return forecast;
}

interface UseWeatherOptions {
  lat: number | null;
  lon: number | null;
  /** Sample weather instead of the real one: the landing page and a setup page with no place. */
  demo: boolean;
  /** Pairs a setup page's preview with its test buttons. */
  previewId?: string;
}

/** The forecast to show: sample weather in demos and from the test buttons, else MET's. */
export function useWeather({ lat, lon, demo, previewId }: UseWeatherOptions): Forecast | null {
  const [testSky, setTestSky] = useState<DemoSky | null>(null);
  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, true, (message) => {
    if (message.type === 'sky') setTestSky(message.sky);
  });
  const sky = testSky ?? (demo ? DEFAULT_DEMO_SKY : null);
  // Sample weather stops the real one, so a test doesn't ask MET in the background.
  const live = useLiveForecast(sky ? null : lat, sky ? null : lon);
  const sample = useMemo(() => (sky ? demoForecast(sky, Date.now()) : null), [sky]);
  return sample ?? live;
}
