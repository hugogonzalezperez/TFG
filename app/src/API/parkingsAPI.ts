// Mock data de plazas. En un futuro, esto vendrá de Supabase.
const parkingSpots = [
  {
    id: 1,
    name: 'Plaza Centro',
    location: 'Calle Castillo, 45',
    city: 'Santa Cruz',
    price: 2.5,
    rating: 4.8,
    reviews: 124,
    distance: 0.3,
    lat: 28.4682,
    lng: -16.2546,
    type: 'Cubierta',
    verified: true,
    image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 2,
    name: 'Garaje Privado Marina',
    location: 'Av. Marítima, 12',
    city: 'Santa Cruz',
    price: 3.0,
    rating: 4.9,
    reviews: 89,
    distance: 0.5,
    lat: 28.4695,
    lng: -16.2523,
    type: 'Subterráneo',
    verified: true,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 3,
    name: 'Plaza Residencial',
    location: 'C/ San Francisco, 78',
    city: 'La Laguna',
    price: 2.0,
    rating: 4.6,
    reviews: 56,
    distance: 1.2,
    lat: 28.4875,
    lng: -16.3154,
    type: 'Al aire libre',
    verified: true,
    image: 'https://images.unsplash.com/photo-1761479353275-a66a51af32ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQ0fDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 4,
    name: 'Parking Zona Norte',
    location: 'Plaza del Adelantado',
    city: 'La Laguna',
    price: 1.8,
    rating: 4.7,
    reviews: 142,
    distance: 1.5,
    lat: 28.4876,
    lng: -16.3140,
    type: 'Cubierta',
    verified: true,
    image: 'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBwYXJraW5nfGVufDF8fHx8MTc2NzY0NTU0NHww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 5,
    name: 'Garaje Centro Comercial',
    location: 'C/ Bethencourt Alfonso',
    city: 'Santa Cruz',
    price: 2.2,
    rating: 4.5,
    reviews: 98,
    distance: 0.8,
    lat: 28.4670,
    lng: -16.2560,
    type: 'Subterráneo',
    verified: true,
    image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 6,
    name: 'Plaza Familiar',
    location: 'Rambla General Franco',
    city: 'Santa Cruz',
    price: 2.8,
    rating: 4.9,
    reviews: 167,
    distance: 0.4,
    lat: 28.4688,
    lng: -16.2535,
    type: 'Cubierta',
    verified: true,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
  },
];

/**
 * Simula una llamada a la API para obtener todos los aparcamientos.
 * @returns Una promesa que resuelve con la lista de aparcamientos.
 */
export const getParkings = async () => {
  console.log('Fetching parkings from API...');
  // Simula un retraso de red para emular una llamada real
  await new Promise(resolve => setTimeout(resolve, 500));

  // En un futuro, esto sería una llamada a Supabase:
  // const { data, error } = await supabase.from('parkings').select('*');
  // if (error) throw error;
  // return data;

  return parkingSpots;
};