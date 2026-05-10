import { AvailabilitySchedule } from '../types/parking.types';

export function validateSchedule(
  start: Date,
  end: Date,
  schedule: AvailabilitySchedule | null | undefined,
): string | null {
  if (!schedule) return null;

  const startDow = start.getDay().toString() as keyof AvailabilitySchedule;
  const endDow   = end.getDay().toString()   as keyof AvailabilitySchedule;
  const startDay = schedule[startDow];
  const endDay   = schedule[endDow];

  if (!startDay?.enabled)
    return 'La plaza no está disponible el día de entrada seleccionado.';
  if (!endDay?.enabled)
    return 'La plaza no está disponible el día de salida seleccionado.';

  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const startTimeStr = fmt(start);
  const endTimeStr   = fmt(end);

  if (startTimeStr < startDay.open || startTimeStr >= startDay.close)
    return `La hora de entrada debe estar entre ${startDay.open} y ${startDay.close}.`;
  if (endTimeStr <= endDay.open || endTimeStr > endDay.close)
    return `La hora de salida debe estar entre ${endDay.open} y ${endDay.close}.`;

  return null;
}
