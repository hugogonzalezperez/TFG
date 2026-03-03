import { supabase } from '../../../shared/lib/supabase';

export const favoritesDal = {
  async fetchUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        parking_spot_id,
        spot:parking_spots(
          id,
          spot_number,
          base_price_per_hour,
          garage:garages(
            id,
            name,
            address,
            city,
            lat,
            lng,
            reviews(rating),
            images:garage_images(image_url, is_main)
          ),
          images:parking_spot_images(image_url, display_order)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async insertFavorite(userId: string, spotId: string) {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, parking_spot_id: spotId });
    if (error) throw error;
  },

  async deleteFavorite(userId: string, spotId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('parking_spot_id', spotId);
    if (error) throw error;
  },

  async checkIfFavorite(userId: string, spotId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('parking_spot_id', spotId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async fetchSpotFavoritesCount(spotId: string) {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('parking_spot_id', spotId);

    if (error) throw error;
    return count || 0;
  },

  async fetchSpotFavoriteUsers(spotId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('user:users(id, name, avatar_url, email)')
      .eq('parking_spot_id', spotId);

    if (error) throw error;
    return data || [];
  }
};
