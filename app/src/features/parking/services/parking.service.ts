import { Parking, Garage } from '../types/parking.types';
import { parkingDal } from './parking.dal';

export const parkingService = {
  /**
   * Obtiene todos los garajes que tienen al menos una plaza activa
   */
  async getGaragesWithSpots(): Promise<Garage[]> {
    const data = await parkingDal.fetchGaragesWithSpots();

    if (!data) return [];

    return data.map((garage) => {
      // Calculate real rating
      const reviews = garage.reviews || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;

      return {
        id: garage.id,
        name: garage.name,
        address: garage.address,
        city: garage.city,
        postal_code: garage.postal_code || undefined,
        lat: Number(garage.lat),
        lng: Number(garage.lng),
        is_active: garage.is_active || false,
        is_verified: true,
        total_spots: garage.total_spots || 0,
        owner_id: garage.owner_id,
        rating: Number(averageRating.toFixed(1)),
        reviews: totalReviews,
        image: garage.garage_images?.find(img => img.is_main)?.image_url ||
          garage.garage_images?.[0]?.image_url ||
          'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=400',
        images: garage.garage_images?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(img => img.image_url) || [],
        spots: garage.parking_spots.map((spot) => ({
          id: spot.id,
          garage_id: spot.garage_id,
          name: `${garage.name} - ${spot.spot_number}`,
          address: garage.address,
          city: garage.city,
          postal_code: garage.postal_code || undefined,
          base_price_per_hour: spot.base_price_per_hour,
          current_price_per_hour: spot.current_price_per_hour,
          lat: Number(garage.lat),
          lng: Number(garage.lng),
          is_active: spot.is_active || false,
          is_verified: true,
          image: spot.parking_spot_images?.[0]?.image_url ||
            garage.garage_images?.find(img => img.is_main)?.image_url ||
            garage.garage_images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
          description: spot.description || undefined,
          total_spots: 1,
          spot_number: spot.spot_number,
          type: (spot.type === 'Subterránea' ? 'Subterráneo' : spot.type as Parking['type']) || 'Subterráneo',
          bookings: spot.bookings || [],
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
      };
    });
  },

  /**
   * Obtiene las reseñas de un garaje específico
   */
  async getGarageReviews(garageId: string) {
    return await parkingDal.fetchGarageReviews(garageId);
  },

  /**
   * Envía una nueva reseña
   */
  async submitReview(params: {
    garage_id: string;
    user_id: string;
    booking_id?: string;
    rating: number;
    comment: string;
  }) {
    return await parkingDal.insertReview(params);
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
    const data = await parkingDal.fetchParkingSpotById(id);

    if (!data) {
      throw new Error('Parking spot not found');
    }

    const garage = data.garage as any;
    const spot = data;

    // Calculate real garage rating
    const reviews = garage.reviews || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews
      : 0;

    // Calculate owner's global rating
    const ownerId = spot.owner_id;
    const ownerReviews = await parkingDal.fetchOwnerReviews(ownerId);

    const ownerTotalReviews = ownerReviews?.length || 0;
    const ownerAverageRating = ownerTotalReviews > 0
      ? (ownerReviews?.reduce((acc, r) => acc + r.rating, 0) || 0) / ownerTotalReviews
      : 0;

    return {
      id: spot.id,
      garage_id: spot.garage_id,
      name: `${garage.name} - ${spot.spot_number}`,
      address: garage.address,
      city: garage.city,
      postal_code: garage.postal_code || undefined,
      base_price_per_hour: spot.base_price_per_hour,
      current_price_per_hour: spot.current_price_per_hour,
      rating: Number(averageRating.toFixed(1)),
      reviews: totalReviews,
      lat: Number(garage.lat),
      lng: Number(garage.lng),
      is_active: spot.is_active || false,
      is_verified: true,
      image: spot.parking_spot_images?.[0]?.image_url ||
        garage?.garage_images?.find((img: any) => img.is_main)?.image_url ||
        garage?.garage_images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
      images: spot.parking_spot_images?.length > 0
        ? spot.parking_spot_images.map((img: any) => img.image_url)
        : (garage?.garage_images?.length > 0
          ? garage.garage_images.map((img: any) => img.image_url)
          : [
            'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
            'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=400'
          ]
        ),
      description: spot.description || undefined,
      total_spots: 1,
      spot_number: spot.spot_number,
      type: (spot.type === 'Subterránea' ? 'Subterráneo' : spot.type as Parking['type']) || 'Subterráneo',
      bookings: spot.bookings || [],
      owner: spot.owner
        ? {
          id: (spot.owner as any).id,
          name: (spot.owner as any).name,
          avatar: (spot.owner as any).avatar_url || undefined,
          rating: Number(ownerAverageRating.toFixed(1)),
          reviewCount: ownerTotalReviews
        }
        : {
          id: spot.owner_id,
          name: 'Propietario',
          avatar: undefined,
          rating: Number(ownerAverageRating.toFixed(1)),
          reviewCount: ownerTotalReviews
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
    postal_code?: string;
    lat: number;
    lng: number;
    description?: string;
  }) {
    return await parkingDal.insertGarage(data);
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
    const spot = await parkingDal.insertParkingSpot(data);

    // Imágenes de la plaza si existen
    if (data.images && data.images.length > 0) {
      await parkingDal.insertParkingSpotImages(spot.id, data.images);
    }

    return spot;
  },

  /**
   * Sube o asocia imágenes a un garaje
   */
  async addGarageImages(garageId: string, images: string[]) {
    return await parkingDal.insertGarageImages(garageId, images);
  },

  /**
   * Crea un nuevo garaje junto con su primera plaza y opcionalmente imágenes.
   */
  async createGarageWithSpot(data: {
    owner_id: string;
    name: string;
    address: string;
    city: string;
    postal_code?: string;
    lat: number;
    lng: number;
    price: number;
    type: string;
    spot_number?: string;
    description?: string;
    images?: string[];        // Spot images
    garageImages?: string[]; // Garage image (max 1)
  }) {
    // 1. Crear el garaje
    const garage = await this.createGarage({
      owner_id: data.owner_id,
      name: data.name,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
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

    // 3. Imágenes del garaje
    if (data.garageImages && data.garageImages.length > 0) {
      await this.addGarageImages(garage.id, data.garageImages);
    } else if (data.images && data.images.length > 0) {
      // Back-compat: if only images is provided and no garageImages, treat as garage images
      await this.addGarageImages(garage.id, data.images);
    }

    return garage;
  },

  /**
   * Eliminar una plaza
   */
  async deleteParkingSpot(spotId: string, garageId: string) {
    return await parkingDal.deleteParkingSpot(spotId, garageId);
  },

  async updateGarage(garageId: string, updates: Partial<Garage>) {
    return await parkingDal.updateGarage(garageId, updates);
  },

  async updateParkingSpot(spotId: string, updates: Partial<Parking>) {
    return await parkingDal.updateParkingSpot(spotId, updates as any);
  },

  async updateGarageImages(garageId: string, images: string[]) {
    // 1. Delete existing images
    await parkingDal.deleteGarageImages(garageId);

    // 2. Insert new images
    if (images.length > 0) {
      await parkingDal.insertGarageImages(garageId, images);
    }
  },

  async updateParkingSpotImages(spotId: string, images: string[]) {
    // 1. Delete existing images
    await parkingDal.deleteParkingSpotImages(spotId);

    // 2. Insert new images
    if (images.length > 0) {
      await parkingDal.insertParkingSpotImages(spotId, images);
    }
  },

  async deleteGarage(garageId: string) {
    return await parkingDal.deleteGarage(garageId);
  }
};
