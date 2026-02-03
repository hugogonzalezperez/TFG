
/// <reference types="vite/client" />
import opencage from 'opencage-api-client';

const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export interface GeocodingResult {
  formatted: string;
  lat: number;
  lng: number;
  components?: any;
}

export const geocodingService = {
  /**
   * Buscar coordenadas para una dirección
   */
  async forwardGeocode(address: string): Promise<GeocodingResult | null> {
    if (!address) return null;

    // Verificar caché
    const cacheKey = `geo_fwd_${address}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Caché válida por 7 días
        if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
          return data;
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const response = await opencage.geocode({ key: API_KEY, q: address });

      if (response.status.code === 200 && response.results.length > 0) {
        const result = response.results[0];
        const data: GeocodingResult = {
          formatted: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          components: result.components
        };

        // Guardar en caché
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));

        return data;
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  },

  /**
   * Buscar dirección desde coordenadas
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    const cacheKey = `geo_rev_${lat}_${lng}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
          return data;
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const response = await opencage.geocode({ key: API_KEY, q: `${lat},${lng}` });

      if (response.status.code === 200 && response.results.length > 0) {
        const result = response.results[0];
        const data: GeocodingResult = {
          formatted: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          components: result.components
        };

        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));

        return data;
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }
};
