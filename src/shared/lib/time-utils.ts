/** Formats a Date as "YYYY-MM-DD" using local timezone (avoids UTC-shift bug). */
export function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Generates "HH:MM" options for a given step. */
export function generateTimeOptions(step: 1 | 5 | 15 | 30 = 1): string[] {
  const options: string[] = [];
  for (let h = 0; h < 24; h++)
    for (let m = 0; m < 60; m += step)
      options.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  return options;
}

/**
 * Returns the earliest selectable "HH:MM" for a given date.
 * - Future date → undefined (no restriction).
 * - Today → next slot >= now, rounded up to `step` minutes.
 */
export function getMinTimeForDate(
  selectedDate: Date | string | undefined,
  step: 1 | 5 | 15 | 30 = 1,
): string | undefined {
  if (!selectedDate) return undefined;

  const dateStr =
    selectedDate instanceof Date
      ? toLocalDateStr(selectedDate)
      : (selectedDate as string).slice(0, 10); // handles "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM"

  const now = new Date();
  if (dateStr !== toLocalDateStr(now)) return undefined;

  const totalMin = now.getHours() * 60 + now.getMinutes();
  const snapped = Math.ceil(totalMin / step) * step;
  if (snapped >= 24 * 60) return `23:${String(60 - step).padStart(2, '0')}`;
  return `${String(Math.floor(snapped / 60)).padStart(2, '0')}:${String(snapped % 60).padStart(2, '0')}`;
}

/** Adds one minute to a "HH:MM" string. Returns undefined for empty/undefined input. */
export function addOneMinute(time: string | undefined): string | undefined {
  if (!time) return undefined;
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + 1;
  if (total >= 24 * 60) return '23:59';
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Returns the later of two "HH:MM" strings. If one is undefined, returns the other. */
export function laterTime(a: string | undefined, b: string | undefined): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

/**
 * Returns true if a "HH:MM" slot should be disabled because it is in the past
 * relative to the selected date.
 */
export function isTimePast(
  time: string,
  selectedDate: Date | string | undefined,
  step: 1 | 5 | 15 | 30 = 1,
): boolean {
  const min = getMinTimeForDate(selectedDate, step);
  return min !== undefined && time < min;
}
