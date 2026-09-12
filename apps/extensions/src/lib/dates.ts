/** A YYYY-MM or YYYY-MM-DD string as a UTC date, so formatting never shifts a day. */
export function toUtcDate(date: string): Date {
  const [year, month, day = 1] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
