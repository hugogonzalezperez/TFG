import { useState, useEffect } from 'react';
import { getParkings } from '../../../../API/parkingsAPI';

// En un futuro, este tipo se podría generar automáticamente desde la BBDD de Supabase
export interface ParkingSpot {
  id: number;
  name: string;
  location: string;
  city: string;
  price: number;
  rating: number;
  reviews: number;
  distance: number;
  lat: number;
  lng: number;
  type: string;
  verified: boolean;
  image: string;
}

export function useParkings() {
  const [parkings, setParkings] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getParkings();
        setParkings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los aparcamientos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkings();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  return { parkings, isLoading, error };
}