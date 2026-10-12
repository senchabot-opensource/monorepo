import type { CSSProperties } from 'react';
import { useI18n } from '#/lib/i18n';
import type { WeatherCorner, WeatherSettings, WeatherTheme, WeatherUnits } from '#/lib/weather-url';
import { useShortSideScale } from '../use-fit-scale';
import { ConditionIcon, ICON_CSS } from './condition-icon';
import { DEMO_PLACE } from './demo-forecast';
import {
  currentStep,
  dailySteps,
  type Forecast,
  type ForecastStep,
  hourlySteps,
} from './met-forecast';
import { useMinute, useWeather } from './use-weather';
import { readSymbol } from './weather-symbols';

/** Outfit: round, even figures that read well at a glance, like a weather app's. */
export const WEATHER_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
const WEATHER_FONT = "'Outfit', ui-sans-serif, system-ui, sans-serif";

/** Sizes are drawn for a 1080p scene and scale with the browser source's short side. */
const EDGE_X = 64;
const EDGE_Y = 48;

/** CC BY 4.0 asks for credit where the data shows, so the overlay always carries it. */
export const CREDIT = 'MET Norway';

const THEMES: Record<WeatherTheme, string> = {
  dark: `--wx-bg:rgba(14,17,23,.78);--wx-border:rgba(255,255,255,.1);--wx-text:#fff;
    --wx-muted:rgba(255,255,255,.66);--wx-line:rgba(255,255,255,.12);--wx-shadow:0 10px 30px rgba(0,0,0,.35);
    --wx-cloud:#f1f4f9;--wx-cloud-back:#a9b4c2;--wx-cloud-edge:transparent;--wx-moon:#e9edf6;
    --wx-snow:#fff;--wx-text-shadow:none`,
  light: `--wx-bg:rgba(255,255,255,.9);--wx-border:rgba(15,23,42,.08);--wx-text:#0f172a;
    --wx-muted:#526072;--wx-line:rgba(15,23,42,.1);--wx-shadow:0 10px 30px rgba(15,23,42,.18);
    --wx-cloud:#e3e9f1;--wx-cloud-back:#b3bfcd;--wx-cloud-edge:#9aa8ba;--wx-moon:#8796ab;
    --wx-snow:#8fd0fb;--wx-text-shadow:none`,
  clear: `--wx-bg:transparent;--wx-border:transparent;--wx-text:#fff;
    --wx-muted:rgba(255,255,255,.88);--wx-line:rgba(255,255,255,.3);--wx-shadow:none;
    --wx-cloud:#f6f8fb;--wx-cloud-back:#b9c3cf;--wx-cloud-edge:transparent;--wx-moon:#eef1f8;
    --wx-snow:#fff;--wx-text-shadow:0 2px 4px rgba(0,0,0,.65),0 0 12px rgba(0,0,0,.35)`,
};

const CSS = `
.wx-root{position:fixed;inset:0;overflow:hidden;pointer-events:none;font-family:${WEATHER_FONT};
  -webkit-font-smoothing:antialiased;line-height:1.15;
  --wx-sun:#ffc53d;--wx-rain:#5ab0ff;--wx-bolt:#ffd43b;--wx-fog:#c7d0dc}
${Object.entries(THEMES)
  .map(([theme, vars]) => `.wx-${theme}{${vars}}`)
  .join('\n')}
.wx-box{position:absolute;color:var(--wx-text);background:var(--wx-bg);border:1px solid var(--wx-border);
  box-shadow:var(--wx-shadow);text-shadow:var(--wx-text-shadow);animation:wx-in .5s ease-out both}
.wx-clear .wx-icon{filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}
.wx-card{border-radius:22px;padding:18px 22px 12px;width:340px;box-sizing:border-box}
.wx-place{font-size:15px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--wx-muted);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-now{display:flex;align-items:center;gap:14px;margin-top:4px}
.wx-temp{font-size:58px;font-weight:600;letter-spacing:-.02em;line-height:1}
.wx-unit{font-size:.5em;font-weight:500;vertical-align:.7em;margin-left:2px;color:var(--wx-muted)}
.wx-condition{font-size:19px;font-weight:500;margin-top:4px}
.wx-details{display:flex;gap:18px;margin-top:10px;font-size:16px;color:var(--wx-muted)}
.wx-detail{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.wx-detail svg{flex:none}
.wx-row{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:14px;padding-top:12px;
  border-top:1px solid var(--wx-line);text-align:center}
.wx-slot{display:flex;flex-direction:column;align-items:center;gap:2px}
.wx-slot-label{font-size:14px;font-weight:500;color:var(--wx-muted);white-space:nowrap}
.wx-slot-temp{font-size:18px;font-weight:600;white-space:nowrap}
.wx-low{color:var(--wx-muted);font-weight:500;margin-left:6px}
.wx-credit{font-size:10px;color:var(--wx-muted);opacity:.8;text-align:right;margin-top:8px;letter-spacing:.02em}
.wx-pill{display:flex;align-items:center;gap:10px;border-radius:999px;padding:6px 22px 6px 10px;
  white-space:nowrap;max-width:900px}
.wx-pill .wx-temp{font-size:32px}
.wx-pill .wx-condition{font-size:20px;margin:0}
.wx-pill .wx-place{font-size:18px;letter-spacing:.04em;text-transform:none;font-weight:500}
.wx-dot{width:5px;height:5px;border-radius:50%;background:var(--wx-muted);flex:none}
.wx-pill .wx-credit{margin:0 0 0 4px;align-self:flex-end;padding-bottom:6px}
@keyframes wx-in{from{opacity:0;transform:translateY(6px)}}
${ICON_CSS}
`;

const CORNER_ORIGIN: Record<WeatherCorner, string> = {
  tr: 'top right',
  tl: 'top left',
  br: 'bottom right',
  bl: 'bottom left',
};

/** Pins the box to a scene corner at `zoom` times its design size, growing from that corner. */
const cornerPlace = (corner: WeatherCorner, scale: number, zoom: number): CSSProperties => ({
  [corner[0] === 't' ? 'top' : 'bottom']: EDGE_Y * scale,
  [corner[1] === 'r' ? 'right' : 'left']: EDGE_X * scale,
  transform: `scale(${zoom})`,
  transformOrigin: CORNER_ORIGIN[corner],
});

/** Whole degrees in the picked unit; `Math.round` can give -0, which reads as 0. */
export function formatTemp(celsius: number, units: WeatherUnits): string {
  const degrees = Math.round(units === 'imperial' ? (celsius * 9) / 5 + 32 : celsius);
  return String(degrees === 0 ? 0 : degrees);
}

/** Wind in km/h or mph, from m/s. */
export function formatWind(metersPerSecond: number, units: WeatherUnits): string {
  const speed = metersPerSecond * (units === 'imperial' ? 2.23694 : 3.6);
  return `${Math.round(speed)} ${units === 'imperial' ? 'mph' : 'km/h'}`;
}

function WindIcon({ from }: { from: number }) {
  // The arrow points where the wind blows to, like on a weather map.
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.5 12.5 13 8 10.5 3.5 13Z"
        fill="currentColor"
        transform={`rotate(${(from + 180) % 360} 8 8)`}
      />
    </svg>
  );
}

function HumidityIcon() {
  return (
    <svg width={14} height={16} viewBox="0 0 14 16" aria-hidden="true">
      <path
        d="M7 1C7 1 1.5 7.4 1.5 10.5a5.5 5.5 0 0 0 11 0C12.5 7.4 7 1 7 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface ViewProps {
  forecast: Forecast;
  now: ForecastStep;
  settings: WeatherSettings;
  place: string;
  time: number;
}

function Card({ forecast, now, settings, place, time }: ViewProps) {
  const { t, locale } = useI18n();
  const condition = now.symbol ? readSymbol(now.symbol).condition : null;
  const timeZone = settings.tz || undefined;
  const unit = settings.units === 'imperial' ? 'F' : 'C';
  const hourFormat = new Intl.DateTimeFormat(
    locale,
    settings.h12
      ? { hour: 'numeric', hour12: true, timeZone }
      : { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone },
  );
  const dayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone });

  return (
    <>
      {place && <div className="wx-place">{place}</div>}
      <div className="wx-now">
        <ConditionIcon symbol={now.symbol} size={86} />
        <div>
          <div className="wx-temp" data-testid="weather-temp">
            {formatTemp(now.temp, settings.units)}°<span className="wx-unit">{unit}</span>
          </div>
          {condition && <div className="wx-condition">{t(`weather.conditions.${condition}`)}</div>}
        </div>
      </div>
      {settings.details && (
        <div className="wx-details">
          <span className="wx-detail" title={t('weather.wind')}>
            <WindIcon from={now.windFrom} />
            {formatWind(now.wind, settings.units)}
          </span>
          <span className="wx-detail" title={t('weather.humidity')}>
            <HumidityIcon />
            {Math.round(now.humidity)}%
          </span>
        </div>
      )}
      {settings.forecast === 'hours' && (
        <div className="wx-row" data-testid="weather-forecast">
          {hourlySteps(forecast, time, settings.tz).map((step) => (
            <div className="wx-slot" key={step.time}>
              <span className="wx-slot-label">{hourFormat.format(step.time)}</span>
              <ConditionIcon symbol={step.symbol} size={40} />
              <span className="wx-slot-temp">{formatTemp(step.temp, settings.units)}°</span>
            </div>
          ))}
        </div>
      )}
      {settings.forecast === 'days' && (
        <div className="wx-row" data-testid="weather-forecast">
          {dailySteps(forecast, time, settings.tz).map((day) => (
            <div className="wx-slot" key={day.time}>
              <span className="wx-slot-label">
                {day.today ? t('weather.today') : dayFormat.format(day.time)}
              </span>
              <ConditionIcon symbol={day.symbol} size={40} />
              <span className="wx-slot-temp">
                {formatTemp(day.high, settings.units)}°
                <span className="wx-low">{formatTemp(day.low, settings.units)}°</span>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="wx-credit">{t('weather.credit', { source: CREDIT })}</div>
    </>
  );
}

function Pill({ now, settings, place }: ViewProps) {
  const { t } = useI18n();
  const condition = now.symbol ? readSymbol(now.symbol).condition : null;
  const unit = settings.units === 'imperial' ? 'F' : 'C';
  return (
    <>
      <ConditionIcon symbol={now.symbol} size={48} />
      <span className="wx-temp" data-testid="weather-temp">
        {formatTemp(now.temp, settings.units)}°<span className="wx-unit">{unit}</span>
      </span>
      {condition && <span className="wx-condition">{t(`weather.conditions.${condition}`)}</span>}
      {place && <span className="wx-dot" />}
      {place && <span className="wx-place">{place}</span>}
      <span className="wx-credit">{CREDIT}</span>
    </>
  );
}

interface WeatherWidgetProps {
  settings: WeatherSettings;
  /** Sample weather instead of the real one, for the landing page and a setup page with no place. */
  demo?: boolean;
  /** Pairs a setup page's preview with its test buttons. */
  previewId?: string;
}

export function WeatherWidget({ settings, demo = false, previewId }: WeatherWidgetProps) {
  const forecast = useWeather({ lat: settings.lat, lon: settings.lon, demo, previewId });
  const time = useMinute();
  const scale = useShortSideScale();
  const now = forecast && currentStep(forecast, time);
  const place = settings.place || (demo ? DEMO_PLACE : '');
  const View = settings.layout === 'pill' ? Pill : Card;

  return (
    <div className={`wx-root wx-${settings.theme}`} data-testid="weather">
      <style>{CSS}</style>
      {forecast && now && (
        <div
          className={`wx-box wx-${settings.layout}`}
          style={cornerPlace(settings.corner, scale, (scale * settings.size) / 100)}
        >
          <View forecast={forecast} now={now} settings={settings} place={place} time={time} />
        </div>
      )}
    </div>
  );
}
