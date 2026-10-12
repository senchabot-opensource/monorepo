import type { SelectOption } from '#/components/ui/select';

/** Whether `zone` is a time zone this browser can show the time in. */
export function isTimeZone(zone: string): boolean {
  if (!zone) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** "Istanbul · Europe" from "Europe/Istanbul", so typing a city finds it. */
export function zoneLabel(zone: string): string {
  const parts = zone.split('/');
  const city = (parts.pop() ?? zone).replaceAll('_', ' ');
  return parts.length > 0 ? `${city} · ${parts.join('/').replaceAll('_', ' ')}` : city;
}

/** "GMT+3" for a zone right now; empty when the browser can't tell. */
function zoneOffset(zone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    return parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

/** Every time zone the browser knows, by city; empty in one too old to list them. */
export function timeZones(): SelectOption<string>[] {
  const supported = (Intl as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
  const zones = typeof supported === 'function' ? supported('timeZone') : [];
  return zones
    .map((zone) => ({ value: zone, label: zoneLabel(zone), hint: zoneOffset(zone) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
