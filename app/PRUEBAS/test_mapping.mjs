
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      env[key.trim()] = value.join('=').trim();
    }
  });
  return env;
}

const env = loadEnv(path.join(__dirname, '.env.local'));
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testMapping() {
  console.log('Testing mapping logic in parkingService...');

  // Simulamos la respuesta de Supabase que vimos antes (con owner null)
  const mockData = [
    {
      "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      "owner_id": "5ce4d83e-9007-43bf-8543-e99ea8e11c4c",
      "name": "Parking Central Prueba",
      "description": null,
      "address": "Calle Falsa 123",
      "city": "Santa Cruz",
      "postal_code": null,
      "lat": 28.4682,
      "lng": -16.2546,
      "total_spots": 5,
      "is_active": true,
      "parking_spots": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "owner": null,
          "owner_id": "5ce4d83e-9007-43bf-8543-e99ea8e11c4c",
          "garage_id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
          "is_active": true,
          "description": null,
          "spot_number": "A-01",
          "base_price_per_hour": 2.5,
          "current_price_per_hour": 2.5
        }
      ]
    }
  ];

  // La lógica que implementamos en parking.service.ts
  const mapped = mockData.map(garage => ({
    id: garage.id,
    name: garage.name,
    address: garage.address,
    city: garage.city,
    lat: garage.lat,
    lng: garage.lng,
    is_active: garage.is_active,
    is_verified: true,
    total_spots: garage.total_spots,
    owner_id: garage.owner_id,
    rating: 4.8,
    reviews: 12,
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
      is_active: spot.is_active,
      is_verified: true,
      image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
      description: spot.description,
      total_spots: 1,
      owner: spot.owner ? {
        id: spot.owner.id,
        name: spot.owner.name,
        avatar: spot.owner.avatar_url
      } : {
        id: spot.owner_id,
        name: 'Propietario',
        avatar: null
      }
    }))
  }));

  console.log('Mapping completed successfully!');
  console.log('Sample spot owner:', JSON.stringify(mapped[0].spots[0].owner, null, 2));
}

testMapping();
