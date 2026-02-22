import { favoritesDal } from './favorites.dal';

export const favoritesService = {
  async getUserFavorites(userId: string) {
    const rawData = await favoritesDal.fetchUserFavorites(userId);

    return rawData.map((fav: any) => {
      const spot = Array.isArray(fav.spot) ? fav.spot[0] : fav.spot;
      const garage = spot?.garage ? (Array.isArray(spot.garage) ? spot.garage[0] : spot.garage) : null;

      const reviews = garage?.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
        : 0;

      const spotImage = spot?.images?.[0]?.image_url;
      const garageImage = garage?.images?.find((img: any) => img.is_main)?.image_url || garage?.images?.[0]?.image_url;
      const mainImage = spotImage || garageImage || 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400';

      return {
        id: fav.id,
        parking_spot_id: fav.parking_spot_id,
        name: garage?.name || 'Plaza',
        spot_number: spot?.spot_number,
        location: garage ? `${garage.address}, ${garage.city}` : 'Ubicación desconocida',
        price: spot?.base_price_per_hour || 0,
        rating: Number(averageRating.toFixed(1)),
        image: mainImage
      };
    });
  },

  async toggleFavorite(userId: string, spotId: string, isCurrentlyFavorite: boolean) {
    if (isCurrentlyFavorite) {
      await favoritesDal.deleteFavorite(userId, spotId);
    } else {
      await favoritesDal.insertFavorite(userId, spotId);
    }
  },

  async checkIsFavorite(userId: string, spotId: string) {
    return await favoritesDal.checkIfFavorite(userId, spotId);
  },

  async getSpotFavoritesCount(spotId: string) {
    return await favoritesDal.fetchSpotFavoritesCount(spotId);
  },

  async getSpotFavoriteUsers(spotId: string) {
    const rawData = await favoritesDal.fetchSpotFavoriteUsers(spotId);
    return rawData.map(r => r.user)
      .filter(u => u)
      .map(u => Array.isArray(u) ? u[0] : u);
  }
};
