import { logger } from '../lib/logger';
import { supabase } from '../lib/supabase';

export interface GeocodingResult {
  formatted: string;
  lat: number;
  lng: number;
  components?: Record<string, unknown>;
}

function parseOpenCageResponse(data: { status?: { code: number }; results?: { formatted: string; geometry: { lat: number; lng: number }; components?: Record<string, unknown> }[] }): GeocodingResult | null {
  if (data?.status?.code !== 200 || !data.results?.length) return null;
  const best = data.results.find((r) => r.components && (r.components as Record<string, unknown>).house_number) ?? data.results[0];
  return {
    formatted: best.formatted,
    lat: best.geometry.lat,
    lng: best.geometry.lng,
    components: best.components,
  };
}

async function callGeocode(body: { address?: string; lat?: number; lng?: number }): Promise<GeocodingResult | null> {
  const { data, error } = await supabase.functions.invoke('geocode', { body });
  if (error) throw error;
  return parseOpenCageResponse(data);
}

export const geocodingService = {
  async forwardGeocode(address: string): Promise<GeocodingResult | null> {
    if (!address) return null;

    const cacheKey = `geo_fwd_${address}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) return data;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const result = await callGeocode({ address });
      if (result) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
      }
      return result;
    } catch (error) {
      logger.error('Error geocoding address:', error);
      return null;
    }
  },

  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    const cacheKey = `geo_rev_${lat}_${lng}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) return data;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const result = await callGeocode({ lat, lng });
      if (result) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
      }
      return result;
    } catch (error) {
      logger.error('Error reverse geocoding:', error);
      return null;
    }
  },
};
