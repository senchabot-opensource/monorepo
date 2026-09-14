import type { AlertKind } from '#/lib/stream-alerts-url';

export const hsl = (hue: number, s: number, l: number, a = 1) => `hsl(${hue} ${s}% ${l}% / ${a})`;

/** Points of a diamond centered on (x, y), `r` from the center to each tip. */
export const diamond = (x: number, y: number, r: number) =>
  `${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`;

/** Each alert's icon as a 24×24 path: a star, a gift, a gem, people. */
export function EventIcon({ kind }: { kind: AlertKind }) {
  switch (kind) {
    case 'sub':
      return (
        <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8Z" />
      );
    case 'gift':
      return (
        <path d="M4 11h16v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm-1-4.5h18a1 1 0 0 1 1 1V10H2V7.5a1 1 0 0 1 1-1Zm8 0h2v15h-2ZM12 6c-1-2.8-4.8-4.2-5.6-2.2C5.7 5.6 9 6.3 12 6.5c3-.2 6.3-.9 5.6-2.7C16.8 1.8 13 3.2 12 6Z" />
      );
    case 'bits':
      return <path d="M12 2 4 9.5 12 22l8-12.5Zm0 3.2 4.6 4.3H7.4Z" />;
    case 'raid':
      return (
        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5Zm15.5 0c0-2.4-.9-4.4-2.5-5.9 3.9-.6 7 1.9 7 5.9Z" />
      );
  }
}
