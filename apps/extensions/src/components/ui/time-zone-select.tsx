import { useHydrated } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Select, type SelectOption } from '#/components/ui/select';
import { timeZones, zoneLabel } from '#/lib/time-zones';

interface TimeZoneSelectProps {
  labelledBy: string;
  /** An IANA zone, or empty for the computer OBS runs on. */
  value: string;
  onChange: (value: string) => void;
  /** The empty choice's label, e.g. "The OBS computer's time". */
  localLabel: string;
}

/** Every time zone the browser knows, by city, after the OBS computer's own. */
export function TimeZoneSelect({ labelledBy, value, onChange, localLabel }: TimeZoneSelectProps) {
  const mounted = useHydrated();
  // Only listed once the page runs: the offsets are the viewer's "now", not the build's.
  const zones = useMemo(() => (mounted ? timeZones() : []), [mounted]);
  const options: SelectOption<string>[] = [
    { value: '', label: localLabel },
    // A zone from a pasted URL stays listed even where the browser can't list them all.
    ...(value && !zones.some((zone) => zone.value === value)
      ? [{ value, label: zoneLabel(value) }]
      : []),
    ...zones,
  ];
  return <Select labelledBy={labelledBy} value={value} onChange={onChange} options={options} />;
}
