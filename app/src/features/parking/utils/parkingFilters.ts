import { Parking, ParkingFilter } from '../types/parking.types';

/**
 * Filtra un array de aparcamientos basado en los filtros activos
 */
export function filterParkings(parkings: Parking[], filters: ParkingFilter): Parking[] {
  return parkings.filter((parking) => {
    // Filtro por tipo: si hay tipos seleccionados, solo mostrar esos
    if (filters.types.size > 0 && !filters.types.has(parking.type)) {
      return false;
    }

    // Filtro por disponibilidad
    if (filters.availability === 'available' && parking.available === false) {
      return false;
    }

    // Filtro por rango de precio
    if (parking.price < filters.priceRange[0] || parking.price > filters.priceRange[1]) {
      return false;
    }

    // Filtro por búsqueda (nombre, ubicación, ciudad)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        parking.name.toLowerCase().includes(query) ||
        parking.location.toLowerCase().includes(query) ||
        parking.city.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Ordena aparcamientos por distancia (por defecto)
 */
export function sortParkingsByDistance(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => a.distance - b.distance);
}

/**
 * Ordena aparcamientos por rating
 */
export function sortParkingsByRating(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => b.rating - a.rating);
}

/**
 * Ordena aparcamientos por precio (ascendente)
 */
export function sortParkingsByPrice(parkings: Parking[]): Parking[] {
  return [...parkings].sort((a, b) => a.price - b.price);
}
