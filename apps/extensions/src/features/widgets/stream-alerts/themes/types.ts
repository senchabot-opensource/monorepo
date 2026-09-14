import type { AlertKind } from '#/lib/stream-alerts-url';

/** What every theme gets: the alert and its words, already picked and translated. */
export interface AlertViewProps {
  /** New for every alert; keeps the theme's SVG ids apart. */
  id: number;
  kind: AlertKind;
  /** Accent hue for this alert. */
  hue: number;
  heading: string;
  /** Who it's from; "Anonymous" for an anonymous gift. */
  name: string;
  /** What they did, e.g. "gifted 5 subs". */
  detail: string;
  /** The viewer's cleaned message, or empty. */
  message: string;
  /** "TWITCH" or "KICK" when alerts come from both, else null. */
  platformTag: string | null;
  /** How long the alert stays up; the theme plays its exit at the end of it. */
  durationMs: number;
}
