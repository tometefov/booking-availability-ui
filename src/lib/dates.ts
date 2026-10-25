const DAY_MS = 24 * 60 * 60 * 1000;

/** Parses "YYYY-MM-DD" as a UTC date so results don't shift with time zones. */
export function parseISODate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Returns each night of the stay (check-in inclusive, check-out exclusive). */
export function nightsBetween(checkIn: string, checkOut: string): string[] {
  const start = parseISODate(checkIn);
  const end = parseISODate(checkOut);
  if (!start || !end || end <= start) return [];
  const nights: string[] = [];
  for (let t = start.getTime(); t < end.getTime(); t += DAY_MS) {
    nights.push(toISODate(new Date(t)));
  }
  return nights;
}

/** Friday and Saturday nights are charged at the weekend rate. */
export function isWeekendNight(isoDate: string): boolean {
  const d = parseISODate(isoDate);
  if (!d) return false;
  const day = d.getUTCDay();
  return day === 5 || day === 6;
}

export function formatDate(isoDate: string): string {
  const d = parseISODate(isoDate);
  if (!d) return isoDate;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
