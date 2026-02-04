import { supabase } from '../../../shared/lib/supabase';
import { Parking, Garage } from '../types/parking.types';
import { Database } from '../../../types/database.types';

type GarageRow = Database['public']['Tables']['garages']['Row'];
type ParkingSpotRow = Database['public']['Tables']['parking_spots']['Row'];
type UserRow = Database['public']['Tables']['users']['Row'];

// Type for the join query result
interface GarageResponse extends GarageRow {
  parking_spots: (ParkingSpotRow & {
    owner: Pick<UserRow, 'id' | 'name' | 'avatar_url'> | null;
  })[];
  garage_images: Database['public']['Tables']['garage_images']['Row'][];
}

export const parkingService = {
  /**
   * Obtiene todos los garajes que tienen al menos una plaza activa
   */
  async getGaragesWithSpots(): Promise<Garage[]> {
    const { data, error } = await supabase
      .from('garages')
      .select(`
        *,
        parking_spots (
          *,
          owner:users (id, name, avatar_url)
        ),
        garage_images (*)
      `)
      .eq('is_active', true)
      .returns<GarageResponse[]>();

    if (error) {
      console.error('Error fetching garages:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((garage) => ({
      id: garage.id,
      name: garage.name,
      address: garage.address,
      city: garage.city,
      lat: garage.lat,
      lng: garage.lng,
      is_active: garage.is_active || false,
      is_verified: true, // TODO: Add to DB if needed
      total_spots: garage.total_spots || 0,
      owner_id: garage.owner_id,
      rating: 4.8, // Fallback/Mock
      reviews: 12, // Fallback/Mock
      image: garage.garage_images?.find(img => img.is_main)?.image_url ||
        garage.garage_images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=400',
      spots: garage.parking_spots.map((spot) => ({
        id: spot.id,
        garage_id: spot.garage_id,
        name: `${garage.name} - ${spot.spot_number}`,
        address: garage.address,
        city: garage.city,
        base_price_per_hour: spot.base_price_per_hour,
        current_price_per_hour: spot.current_price_per_hour,
        lat: garage.lat,
        lng: garage.lng,
        is_active: spot.is_active || false,
        is_verified: true,
        image: garage.garage_images?.find(img => img.is_main)?.image_url ||
          garage.garage_images?.[0]?.image_url ||
          'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
        description: spot.description || undefined,
        total_spots: 1,
        spot_number: spot.spot_number,
        type: (spot.type as Parking['type']) || 'Subterráneo',
        owner: spot.owner
          ? {
            id: spot.owner.id,
            name: spot.owner.name,
            avatar: spot.owner.avatar_url || undefined,
          }
          : {
            id: spot.owner_id,
            name: 'Propietario',
            avatar: undefined,
          },
      })),
    }));
  },

  /**
   * Mantiene compatibilidad con el método anterior si es necesario
   */
  async getParkingSpots(): Promise<Parking[]> {
    const garages = await this.getGaragesWithSpots();
    return garages.flatMap((g) => g.spots || []);
  },

  /**
   * Obtiene un parking spot específico por su ID
   */
  async getParkingSpotById(id: string): Promise<Parking> {
    const { data, error } = await supabase
      .from('parking_spots')
      .select(`
        *,
        garage:garages (
          *,
          garage_images (*)
        ),
        owner:users (id, name, avatar_url),
        parking_spot_images (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching parking spot:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Parking spot not found');
    }

    const garage = data.garage;
    const spot = data;

    return {
      id: spot.id,
      garage_id: spot.garage_id,
      name: `${garage.name} - ${spot.spot_number}`,
      address: garage.address,
      city: garage.city,
      base_price_per_hour: spot.base_price_per_hour,
      current_price_per_hour: spot.current_price_per_hour,
      lat: garage.lat,
      lng: garage.lng,
      is_active: spot.is_active || false,
      is_verified: true,
      image: spot.parking_spot_images?.[0]?.image_url ||
        spot.garage?.garage_images?.find((img: any) => img.is_main)?.image_url ||
        spot.garage?.garage_images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
      images: spot.parking_spot_images?.length > 0
        ? spot.parking_spot_images.map((img: any) => img.image_url)
        : (spot.garage?.garage_images?.length > 0
          ? spot.garage.garage_images.map((img: any) => img.image_url)
          : [
            'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
            'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=400'
          ]
        ),
      description: spot.description || undefined,
      total_spots: 1,
      spot_number: spot.spot_number,
      type: (spot.type as Parking['type']) || 'Subterráneo',
      owner: spot.owner
        ? {
          id: spot.owner.id,
          name: spot.owner.name,
          avatar: spot.owner.avatar_url || undefined,
        }
        : {
          id: spot.owner_id,
          name: 'Propietario',
          avatar: undefined,
        },
      amenities: ['Vigilancia 24/7', 'Cámara de seguridad', 'WiFi', 'Carga eléctrica'], // Fallback/Mock
      rules: ['Altura máxima: 2.10m', 'Horario de acceso: 24 horas'], // Fallback/Mock
    };
  },

  /**
   * Solo crea el garaje (sin plazas)
   */
  async createGarage(data: {
    owner_id: string;
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    description?: string;
  }) {
    const { data: garage, error } = await supabase
      .from('garages')
      .insert({
        owner_id: data.owner_id,
        name: data.name,
        address: data.address,
        city: data.city,
        lat: data.lat,
        lng: data.lng,
        total_spots: 0,
        is_active: true,
        description: data.description
      })
      .select()
      .single();

    if (error) throw error;
    return garage;
  },

  /**
   * Crea una plaza en un garaje existente
   */
  async createParkingSpot(data: {
    garage_id: string;
    owner_id: string;
    spot_number: string;
    price: number;
    description?: string;
    type: string;
    images?: string[];
  }) {
    const { data: spot, error: spotError } = await supabase
      .from('parking_spots')
      .insert({
        garage_id: data.garage_id,
        owner_id: data.owner_id,
        spot_number: data.spot_number,
        base_price_per_hour: data.price,
        current_price_per_hour: data.price,
        description: data.description,
        is_active: true,
        type: data.type
      })
      .select()
      .single();

    if (spotError) throw spotError;

    // Incrementar el contador de plazas del garaje
    await supabase.rpc('increment_garage_spots', { garage_id_param: data.garage_id });

    // Imágenes de la plaza si existen
    if (data.images && data.images.length > 0) {
      const imagesToInsert = data.images.map((url, index) => ({
        parking_spot_id: spot.id,
        image_url: url,
        display_order: index
      }));

      const { error: imagesError } = await supabase
        .from('parking_spot_images')
        .insert(imagesToInsert);

      if (imagesError) throw imagesError;
    }

    return spot;
  },

  /**
   * Sube o asocia imágenes a un garaje
   */
  async addGarageImages(garageId: string, images: string[]) {
    const imagesToInsert = images.map((url, index) => ({
      garage_id: garageId,
      image_url: url,
      is_main: index === 0,
      display_order: index
    }));

    const { error } = await supabase
      .from('garage_images')
      .insert(imagesToInsert);

    if (error) throw error;
  },

  /**
   * Crea un nuevo garaje junto con su primera plaza y opcionalmente imágenes.
   * (Mantenido por compatibilidad y conveniencia)
   */
  async createGarageWithSpot(data: {
    owner_id: string;
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    price: number;
    type: string;
    spot_number?: string;
    description?: string;
    images?: string[];
  }) {
    // 1. Crear el garaje
    const garage = await this.createGarage({
      owner_id: data.owner_id,
      name: data.name,
      address: data.address,
      city: data.city,
      lat: data.lat,
      lng: data.lng,
      description: data.description
    });

    // 2. Crear la plaza inicial
    await this.createParkingSpot({
      garage_id: garage.id,
      owner_id: data.owner_id,
      spot_number: data.spot_number || '1',
      price: data.price,
      type: data.type,
      description: data.description
    });

    // 3. Imágenes del garaje (usamos las mismas para el garaje por ahora)
    if (data.images && data.images.length > 0) {
      await this.addGarageImages(garage.id, data.images);
    }

    return garage;
  },

  /**
   * Eliminar una plaza
   */
  async deleteParkingSpot(spotId: string, garageId: string) {
    const { error } = await supabase
      .from('parking_spots')
      .delete()
      .eq('id', spotId);

    if (error) throw error;

    // Decrementar contador
    await supabase.rpc('decrement_garage_spots', { garage_id_param: garageId });
  },

  async deleteGarage(garageId: string) {
    try {
      console.log('--- INICIO BORRADO GARAJE ---');
      console.log('ID:', garageId);

      // Perform the deletion. 
      // NOTE: For a professional production environment, images, spots, and reviews 
      // should be handled by 'ON DELETE CASCADE' constraints in the database.
      const { status, error } = await supabase
        .from('garages')
        .delete()
        .eq('id', garageId);

      if (error) {
        console.error('Error de Supabase al borrar:', error);
        throw error;
      }

      console.log('Status de borrado garaje:', status);

      // Verify if it was actually deleted (check for RLS or dependency blocks)
      const { data: exists } = await supabase
        .from('garages')
        .select('id')
        .eq('id', garageId)
        .maybeSingle();

      if (exists) {
        throw new Error('El garaje no pudo ser borrado. Verifica que eres el dueño y que no tenga reservas activas.');
      }

      console.log('--- FIN BORRADO GARAJE (ÉXITO) ---');
    } catch (error) {
      console.error('Error en proceso de borrado:', error);
      throw error;
    }
  }
};
