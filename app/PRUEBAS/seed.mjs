
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para parsear .env.local manualmente
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

const env = loadEnv(path.join(__dirname, '..', '.env.local'));

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno Supabase no encontradas.');
  console.error('Asegúrate de que .env.local existe con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// =====================================================
// DATOS DE GARAJES Y PARKINGS
// =====================================================

const garagesData = [
  {
    name: 'Garaje Plaza España',
    description: 'Parking subterráneo en el corazón de Santa Cruz, junto a Plaza España.',
    address: 'Plaza de España, 1',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4682,
    lng: -16.2546,
    total_spots: 4,
    spots: [
      { spot_number: 'PE-01', price: 2.80, description: 'Plaza amplia, planta -1', type: 'Subterráneo' },
      { spot_number: 'PE-02', price: 2.50, description: 'Plaza estándar, planta -1', type: 'Subterráneo' },
      { spot_number: 'PE-03', price: 3.20, description: 'Plaza extra grande, planta -2', type: 'Subterráneo' },
      { spot_number: 'PE-04', price: 2.60, description: 'Plaza cerca del ascensor', type: 'Subterráneo' }
    ]
  },
  {
    name: 'Parking García Sanabria',
    description: 'Parking cubierto cerca del parque García Sanabria, zona tranquila.',
    address: 'Calle del Pilar, 15',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38004',
    lat: 28.4655,
    lng: -16.2505,
    total_spots: 3,
    spots: [
      { spot_number: 'GS-01', price: 2.20, description: 'Plaza sombreada', type: 'Cubierta' },
      { spot_number: 'GS-02', price: 2.40, description: 'Plaza para coches grandes', type: 'Cubierta' },
      { spot_number: 'GS-03', price: 2.00, description: 'Plaza económica', type: 'Cubierta' }
    ]
  },
  {
    name: 'Garaje Central Santa Cruz',
    description: 'Garaje amplio y seguro en el centro comercial, cerca de Plaza Weyler.',
    address: 'Calle Castillo, 45',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4674,
    lng: -16.2541,
    total_spots: 5,
    spots: [
      { spot_number: 'P1-01', price: 2.50, description: 'Plaza estándar, fácil acceso', type: 'Cubierta' },
      { spot_number: 'P1-02', price: 3.00, description: 'Plaza extra grande, ideal para SUVs', type: 'Cubierta' },
      { spot_number: 'P1-03', price: 2.20, description: 'Plaza para coches compactos', type: 'Cubierta' },
      { spot_number: 'P1-04', price: 2.70, description: 'Plaza cerca de la entrada', type: 'Cubierta' },
      { spot_number: 'P1-05', price: 2.50, description: 'Plaza con cámara de seguridad', type: 'Cubierta' }
    ]
  },
  {
    name: 'Parking Marina Santa Cruz',
    description: 'Parking cerca de la zona portuaria y el Auditorio de Tenerife.',
    address: 'Avenida de Anaga, 12',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38001',
    lat: 28.4715,
    lng: -16.2482,
    total_spots: 4,
    spots: [
      { spot_number: 'A-01', price: 1.80, description: 'Plaza económica, al aire libre', type: 'Al aire libre' },
      { spot_number: 'A-02', price: 2.00, description: 'Cerca de la salida', type: 'Al aire libre' },
      { spot_number: 'A-03', price: 1.90, description: 'Vista al mar', type: 'Al aire libre' },
      { spot_number: 'A-04', price: 2.10, description: 'Plaza vigilada', type: 'Al aire libre' }
    ]
  },
  {
    name: 'Parking La Salle',
    description: 'Parking residencial en la zona de La Salle, acceso 24h.',
    address: 'Calle La Salle, 28',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38005',
    lat: 28.4625,
    lng: -16.2590,
    total_spots: 3,
    spots: [
      { spot_number: 'LS-01', price: 1.50, description: 'Plaza estándar', type: 'Cubierta' },
      { spot_number: 'LS-02', price: 1.70, description: 'Plaza amplia', type: 'Cubierta' },
      { spot_number: 'LS-03', price: 1.60, description: 'Planta baja', type: 'Cubierta' }
    ]
  },
  {
    name: 'Garaje El Corte Inglés',
    description: 'Parking subterráneo del centro comercial El Corte Inglés.',
    address: 'Av. Tres de Mayo, 34',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38005',
    lat: 28.4643,
    lng: -16.2577,
    total_spots: 4,
    spots: [
      { spot_number: 'CI-01', price: 3.50, description: 'Plaza premium, planta -1', type: 'Subterráneo' },
      { spot_number: 'CI-02', price: 3.00, description: 'Plaza estándar, planta -2', type: 'Subterráneo' },
      { spot_number: 'CI-03', price: 3.20, description: 'Plaza amplia, planta -1', type: 'Subterráneo' },
      { spot_number: 'CI-04', price: 2.90, description: 'Plaza planta -3', type: 'Subterráneo' }
    ]
  },
  {
    name: 'Parking Rambla',
    description: 'Parking al aire libre en la Rambla de Santa Cruz, zona verde.',
    address: 'Rambla de Santa Cruz, 50',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38001',
    lat: 28.4698,
    lng: -16.2510,
    total_spots: 3,
    spots: [
      { spot_number: 'R-01', price: 1.80, description: 'Plaza sombreada por árboles', type: 'Al aire libre' },
      { spot_number: 'R-02', price: 1.90, description: 'Plaza cerca del paseo', type: 'Al aire libre' },
      { spot_number: 'R-03', price: 1.70, description: 'Plaza económica', type: 'Al aire libre' }
    ]
  },
  {
    name: 'Parking Tenerife Norte',
    description: 'Parking cubierto cerca de la estación de guaguas.',
    address: 'Av. Padre Anchieta, 22',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38006',
    lat: 28.4720,
    lng: -16.2560,
    total_spots: 4,
    spots: [
      { spot_number: 'TN-01', price: 2.30, description: 'Plaza cerca de la terminal', type: 'Cubierta' },
      { spot_number: 'TN-02', price: 2.50, description: 'Plaza amplia', type: 'Cubierta' },
      { spot_number: 'TN-03', price: 2.20, description: 'Plaza vigilada 24h', type: 'Cubierta' },
      { spot_number: 'TN-04', price: 2.40, description: 'Plaza con cargador eléctrico', type: 'Cubierta' }
    ]
  },
  {
    name: 'Garaje Palmetum',
    description: 'Parking al aire libre cerca del Palmetum de Santa Cruz.',
    address: 'Calle Constitución, 5',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4630,
    lng: -16.2450,
    total_spots: 3,
    spots: [
      { spot_number: 'PM-01', price: 2.10, description: 'Plaza con sombra', type: 'Al aire libre' },
      { spot_number: 'PM-02', price: 2.00, description: 'Plaza estándar', type: 'Al aire libre' },
      { spot_number: 'PM-03', price: 1.90, description: 'Plaza económica', type: 'Al aire libre' }
    ]
  },
  {
    name: 'Parking Universidad',
    description: 'Parking cubierto cerca de la zona universitaria, ideal para estudiantes.',
    address: 'Av. de la Trinidad, 61',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38204',
    lat: 28.4830,
    lng: -16.3180,
    total_spots: 4,
    spots: [
      { spot_number: 'U-01', price: 1.50, description: 'Plaza económica', type: 'Cubierta' },
      { spot_number: 'U-02', price: 1.60, description: 'Plaza cerca de la entrada', type: 'Cubierta' },
      { spot_number: 'U-03', price: 1.80, description: 'Plaza amplia', type: 'Cubierta' },
      { spot_number: 'U-04', price: 1.70, description: 'Plaza cubierta', type: 'Cubierta' }
    ]
  },
  {
    name: 'Parking Mercado Nuestra Señora',
    description: 'Parking cerca del mercado, zona comercial histórica.',
    address: 'Plaza de la Candelaria, 8',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4665,
    lng: -16.2533,
    total_spots: 3,
    spots: [
      { spot_number: 'MNS-01', price: 2.40, description: 'Plaza cerca del mercado', type: 'Cubierta' },
      { spot_number: 'MNS-02', price: 2.60, description: 'Plaza amplia', type: 'Cubierta' },
      { spot_number: 'MNS-03', price: 2.30, description: 'Plaza vigilada', type: 'Cubierta' }
    ]
  },
  {
    name: 'Garaje TEA (Tenerife Espacio)',
    description: 'Parking subterráneo del museo TEA, zona cultural.',
    address: 'Av. de San Sebastián, 10',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4652,
    lng: -16.2490,
    total_spots: 4,
    spots: [
      { spot_number: 'TEA-01', price: 2.80, description: 'Plaza cerca del museo', type: 'Subterráneo' },
      { spot_number: 'TEA-02', price: 2.50, description: 'Plaza amplia', type: 'Subterráneo' },
      { spot_number: 'TEA-03', price: 2.70, description: 'Plaza con cargador eléctrico', type: 'Subterráneo' },
      { spot_number: 'TEA-04', price: 2.60, description: 'Plaza iluminada', type: 'Subterráneo' }
    ]
  }
];

// =====================================================
// FUNCIÓN PRINCIPAL DE SEEDING
// =====================================================

async function seed() {
  console.log('🚀 Iniciando seeding de la base de datos...');
  console.log('🔗 URL:', supabaseUrl);
  console.log('');

  try {
    // 1. Crear usuario propietario si no existe
    console.log('👤 Verificando usuario propietario...');
    const ownerEmail = 'propietario@parky.com';
    let { data: owner, error: ownerError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ownerEmail)
      .single();

    if (ownerError && ownerError.code === 'PGRST116') {
      console.log('   ➜ Creando usuario propietario...');
      const { data: newOwner, error: createOwnerError } = await supabase
        .from('users')
        .insert([
          {
            email: ownerEmail,
            name: 'Hugo Propietario',
            phone: '600111222',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hugo',
            is_active: true
          }
        ])
        .select()
        .single();

      if (createOwnerError) throw createOwnerError;
      owner = newOwner;
      console.log('   ✅ Usuario propietario creado');
    } else if (ownerError) {
      throw ownerError;
    } else {
      console.log('   ✅ Usuario propietario ya existe');
    }

    console.log('   📋 ID del propietario:', owner.id);
    console.log('');

    // 2. Crear garajes y plazas
    console.log(`🏢 Creando ${garagesData.length} garajes con sus plazas...`);
    let totalSpotsCreated = 0;
    let garagesCreated = 0;

    for (const garageData of garagesData) {
      console.log(`\n   📍 ${garageData.name}...`);

      // Verificar si el garaje ya existe
      let { data: existingGarage, error: garageCheckError } = await supabase
        .from('garages')
        .select('*')
        .eq('name', garageData.name)
        .single();

      let garage;

      if (garageCheckError && garageCheckError.code === 'PGRST116') {
        // Garaje no existe, crearlo
        const { data: newGarage, error: createGarageError } = await supabase
          .from('garages')
          .insert([
            {
              owner_id: owner.id,
              name: garageData.name,
              description: garageData.description,
              address: garageData.address,
              city: garageData.city,
              postal_code: garageData.postal_code,
              lat: garageData.lat,
              lng: garageData.lng,
              total_spots: garageData.total_spots,
              is_active: true
            }
          ])
          .select()
          .single();

        if (createGarageError) {
          console.error(`   ❌ Error creando garaje: ${createGarageError.message}`);
          continue;
        }

        garage = newGarage;
        garagesCreated++;
        console.log(`      ✅ Garaje creado`);
      } else if (garageCheckError) {
        console.error(`   ❌ Error verificando garaje: ${garageCheckError.message}`);
        continue;
      } else {
        garage = existingGarage;
        console.log(`      ℹ️  Garaje ya existe`);
      }

      // Verificar plazas existentes
      const { data: existingSpots, error: spotsCheckError } = await supabase
        .from('parking_spots')
        .select('id')
        .eq('garage_id', garage.id);

      if (spotsCheckError) {
        console.error(`   ❌ Error verificando plazas: ${spotsCheckError.message}`);
        continue;
      }

      if (existingSpots.length === 0) {
        // Crear plazas
        const spotsToInsert = garageData.spots.map(spot => ({
          garage_id: garage.id,
          owner_id: owner.id,
          spot_number: spot.spot_number,
          base_price_per_hour: spot.price,
          current_price_per_hour: spot.price,
          description: spot.description,
          is_active: true
        }));

        const { error: createSpotsError } = await supabase
          .from('parking_spots')
          .insert(spotsToInsert);

        if (createSpotsError) {
          console.error(`   ❌ Error creando plazas: ${createSpotsError.message}`);
          continue;
        }

        totalSpotsCreated += spotsToInsert.length;
        console.log(`      ✅ ${spotsToInsert.length} plazas creadas`);
      } else {
        console.log(`      ℹ️  ${existingSpots.length} plazas ya existen`);
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ Seeding completado exitosamente!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Resumen:`);
    console.log(`   • Garajes creados: ${garagesCreated}`);
    console.log(`   • Plazas creadas: ${totalSpotsCreated}`);
    console.log(`   • Total garajes en DB: ${garagesData.length}`);
    console.log('');
    console.log('🎉 ¡Listo! Abre la app y verifica los datos.');
    console.log('');

  } catch (err) {
    console.error('');
    console.error('❌ Error durante el seeding:', err);
    console.error('');
    process.exit(1);
  }
}

seed();
