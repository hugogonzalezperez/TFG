import { Parking, ParkingFilter } from '../types/parking.types';

/**
 * Filtra un array de aparcamientos basado en los filtros activos
 */
export function filterParkings(parkings: Parking[], filters: ParkingFilter): Parking[] {
  return parkings.filter((parking) => {
    // Filtro por tipo: si hay tipos seleccionados, solo mostrar esos
    if (filters.types.size > 0 && parking.type && !filters.types.has(parking.type)) {
      return false;
    }

    // Filtro por disponibilidad
    if (filters.availability === 'available' && !parking.is_active) {
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

      if (!matchesSearch) {
        return false;
      }
    }

    // Filtro por disponibilidad real (Fechas y horas)
    if (filters.startDate && filters.startTime && filters.endDate && filters.endTime) {
      try {
        // Normalizar entrada de búsqueda
        // Agregamos :00 para asegurar formato HH:mm:ss y evitar problemas en algunos parsers
        const searchStartStr = `${filters.startDate.split('T')[0]}T${filters.startTime}${filters.startTime.length === 5 ? ':00' : ''}`;
        const searchEndStr = `${filters.endDate.split('T')[0]}T${filters.endTime}${filters.endTime.length === 5 ? ':00' : ''}`;

        const searchStart = new Date(searchStartStr).getTime();
        const searchEnd = new Date(searchEndStr).getTime();

        if (isNaN(searchStart) || isNaN(searchEnd)) return true;

        // Margen de seguridad de 30 minutos (0.5 horas)
        const BUFFER_MS = 30 * 60 * 1000;
        const safeStart = searchStart - BUFFER_MS;
        const safeEnd = searchEnd + BUFFER_MS;

        // Comprobar colisiones con reservas existentes
        if (Array.isArray(parking.bookings)) {
          const hasConflict = parking.bookings.some(booking => {
            if (!booking.start_time || !booking.end_time) return false;

            // Supabase devuelve ISO strings. new Date() los maneja bien.
            const bStart = new Date(booking.start_time).getTime();
            const bEnd = new Date(booking.end_time).getTime();

            if (isNaN(bStart) || isNaN(bEnd)) return false;

            // Lógica de solapamiento: (A_start < B_end) && (A_end > B_start)
            return (safeStart < bEnd) && (safeEnd > bStart);
          });

          if (hasConflict) {
            return false;
          }
        }
      } catch (e) {
        console.error('Error filtering by availability:', e);
      }
    }

    return true;
  });
}

/**
 * Ordena aparcamientos por distancia (por defecto)
 */
export function sortParkingsByDistance(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Ordena aparcamientos por rating
 */
export function sortParkingsByRating(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Ordena aparcamientos por precio (ascendente)
 */
export function sortParkingsByPrice(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => a.base_price_per_hour - b.base_price_per_hour);
}
