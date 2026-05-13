import { logger } from '../../../shared/lib/logger';
import { Parking, ParkingFilter, DEFAULT_AVAILABILITY_SCHEDULE } from '../types/parking.types';
import { validateSchedule } from './schedule.utils';

export function filterParkings(parkings: Parking[], filters: ParkingFilter): Parking[] {
  return parkings.filter((parking) => {
    // Fix 3: always hide inactive spots regardless of availability filter
    if (!parking.is_active) return false;

    // Filtro por tipo
    if (filters.types.size > 0 && parking.type && !filters.types.has(parking.type)) {
      return false;
    }

    // Filtro por rango de precio
    if (parking.base_price_per_hour < filters.priceRange[0] || parking.base_price_per_hour > filters.priceRange[1]) {
      return false;
    }

    // Filtro por búsqueda (nombre, ubicación, ciudad)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        parking.name.toLowerCase().includes(query) ||
        parking.address.toLowerCase().includes(query) ||
        parking.city.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Filtro por disponibilidad real (Fechas y horas)
    if (filters.startDate && filters.startTime && filters.endDate && filters.endTime) {
      try {
        const startDatePart = filters.startDate.split('T')[0];
        const endDatePart   = filters.endDate.split('T')[0];
        const startTimePart = filters.startTime.length === 5 ? `${filters.startTime}:00` : filters.startTime;
        const endTimePart   = filters.endTime.length === 5   ? `${filters.endTime}:00`   : filters.endTime;

        const searchStart = new Date(`${startDatePart}T${startTimePart}`);
        const searchEnd   = new Date(`${endDatePart}T${endTimePart}`);

        if (isNaN(searchStart.getTime()) || isNaN(searchEnd.getTime())) return true;

        // Apply schedule filter — NULL falls back to DEFAULT_AVAILABILITY_SCHEDULE (Mon-Fri 08-20, Sat-Sun off)
        const schedule = parking.availability_schedule ?? DEFAULT_AVAILABILITY_SCHEDULE;
        const scheduleError = validateSchedule(searchStart, searchEnd, schedule);
        if (scheduleError) return false;

        // Check booking overlaps (with 15-min buffer)
        const BUFFER_MS  = 15 * 60 * 1000;
        const safeStart  = searchStart.getTime() - BUFFER_MS;
        const safeEnd    = searchEnd.getTime()   + BUFFER_MS;

        if (Array.isArray(parking.bookings)) {
          const hasConflict = parking.bookings.some(booking => {
            if (!booking.start_time || !booking.end_time) return false;
            const bStart = new Date(booking.start_time).getTime();
            const bEnd   = new Date(booking.end_time).getTime();
            if (isNaN(bStart) || isNaN(bEnd)) return false;
            return safeStart < bEnd && safeEnd > bStart;
          });
          if (hasConflict) return false;
        }
      } catch (e) {
        logger.error('Error filtering by availability:', e);
      }
    }

    return true;
  });
}

export function sortParkingsByDistance(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

export function sortParkingsByRating(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

export function sortParkingsByPrice(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => a.base_price_per_hour - b.base_price_per_hour);
}
