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
  console.error('❌ Error: Variables de entorno no encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CREDENCIALES DEL USUARIO TEST
const TEST_USER = {
  email: 'test@test.com',
  password: '123123123'
};

// DATOS DE GARAJES
const garagesData = [
  {
    name: 'Garaje Plaza España',
    description: 'Parking subterráneo en el corazón de Santa Cruz',
    address: 'Plaza de España, 1',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4682,
    lng: -16.2546,
    total_spots: 4,
    spots: [
      { spot_number: 'PE-01', price: 2.80, description: 'Plaza amplia, planta -1' },
      { spot_number: 'PE-02', price: 2.50, description: 'Plaza estándar' },
      { spot_number: 'PE-03', price: 3.20, description: 'Plaza extra grande' },
      { spot_number: 'PE-04', price: 2.60, description: 'Cerca del ascensor' }
    ]
  },
  {
    name: 'Parking García Sanabria',
    description: 'Parking cubierto cerca del parque',
    address: 'Calle del Pilar, 15',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38004',
    lat: 28.4655,
    lng: -16.2505,
    total_spots: 3,
    spots: [
      { spot_number: 'GS-01', price: 2.20, description: 'Plaza sombreada' },
      { spot_number: 'GS-02', price: 2.40, description: 'Plaza amplia' },
      { spot_number: 'GS-03', price: 2.00, description: 'Plaza económica' }
    ]
  },
  {
    name: 'Garaje Central Santa Cruz',
    description: 'Garaje amplio y seguro en el centro',
    address: 'Calle Castillo, 45',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4674,
    lng: -16.2541,
    total_spots: 5,
    spots: [
      { spot_number: 'P1-01', price: 2.50, description: 'Fácil acceso' },
      { spot_number: 'P1-02', price: 3.00, description: 'Plaza para SUVs' },
      { spot_number: 'P1-03', price: 2.20, description: 'Plaza compacta' },
      { spot_number: 'P1-04', price: 2.70, description: 'Cerca de la entrada' },
      { spot_number: 'P1-05', price: 2.50, description: 'Con cámara de seguridad' }
    ]
  },
  {
    name: 'Parking Marina Santa Cruz',
    description: 'Parking cerca de la zona portuaria',
    address: 'Avenida de Anaga, 12',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38001',
    lat: 28.4715,
    lng: -16.2482,
    total_spots: 4,
    spots: [
      { spot_number: 'A-01', price: 1.80, description: 'Al aire libre' },
      { spot_number: 'A-02', price: 2.00, description: 'Cerca de la salida' },
      { spot_number: 'A-03', price: 1.90, description: 'Vista al mar' },
      { spot_number: 'A-04', price: 2.10, description: 'Plaza vigilada' }
    ]
  },
  {
    name: 'Parking La Salle',
    description: 'Parking residencial, acceso 24h',
    address: 'Calle La Salle, 28',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38005',
    lat: 28.4625,
    lng: -16.2590,
    total_spots: 3,
    spots: [
      { spot_number: 'LS-01', price: 1.50, description: 'Plaza estándar' },
      { spot_number: 'LS-02', price: 1.70, description: 'Plaza amplia' },
      { spot_number: 'LS-03', price: 1.60, description: 'Planta baja' }
    ]
  },
  {
    name: 'Garaje El Corte Inglés',
    description: 'Parking del centro comercial',
    address: 'Av. Tres de Mayo, 34',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38005',
    lat: 28.4643,
    lng: -16.2577,
    total_spots: 4,
    spots: [
      { spot_number: 'CI-01', price: 3.50, description: 'Plaza premium' },
      { spot_number: 'CI-02', price: 3.00, description: 'Plaza estándar' },
      { spot_number: 'CI-03', price: 3.20, description: 'Plaza amplia' },
      { spot_number: 'CI-04', price: 2.90, description: 'Planta -3' }
    ]
  },
  {
    name: 'Parking Rambla',
    description: 'Parking al aire libre en la Rambla',
    address: 'Rambla de Santa Cruz, 50',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38001',
    lat: 28.4698,
    lng: -16.2510,
    total_spots: 3,
    spots: [
      { spot_number: 'R-01', price: 1.80, description: 'Sombreada por árboles' },
      { spot_number: 'R-02', price: 1.90, description: 'Cerca del paseo' },
      { spot_number: 'R-03', price: 1.70, description: 'Plaza económica' }
    ]
  },
  {
    name: 'Parking Tenerife Norte',
    description: 'Parking cerca de la estación de guaguas',
    address: 'Av. Padre Anchieta, 22',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38006',
    lat: 28.4720,
    lng: -16.2560,
    total_spots: 4,
    spots: [
      { spot_number: 'TN-01', price: 2.30, description: 'Cerca de la terminal' },
      { spot_number: 'TN-02', price: 2.50, description: 'Plaza amplia' },
      { spot_number: 'TN-03', price: 2.20, description: 'Vigilada 24h' },
      { spot_number: 'TN-04', price: 2.40, description: 'Con cargador eléctrico' }
    ]
  },
  {
    name: 'Garaje Palmetum',
    description: 'Parking al aire libre cerca del Palmetum',
    address: 'Calle Constitución, 5',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4630,
    lng: -16.2450,
    total_spots: 3,
    spots: [
      { spot_number: 'PM-01', price: 2.10, description: 'Con sombra' },
      { spot_number: 'PM-02', price: 2.00, description: 'Estándar' },
      { spot_number: 'PM-03', price: 1.90, description: 'Económica' }
    ]
  },
  {
    name: 'Parking Universidad',
    description: 'Ideal para estudiantes',
    address: 'Av. de la Trinidad, 61',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38204',
    lat: 28.4830,
    lng: -16.3180,
    total_spots: 4,
    spots: [
      { spot_number: 'U-01', price: 1.50, description: 'Económica' },
      { spot_number: 'U-02', price: 1.60, description: 'Cerca de la entrada' },
      { spot_number: 'U-03', price: 1.80, description: 'Amplia' },
      { spot_number: 'U-04', price: 1.70, description: 'Cubierta' }
    ]
  },
  {
    name: 'Parking Mercado Nuestra Señora',
    description: 'Cerca del mercado histórico',
    address: 'Plaza de la Candelaria, 8',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4665,
    lng: -16.2533,
    total_spots: 3,
    spots: [
      { spot_number: 'MNS-01', price: 2.40, description: 'Cerca del mercado' },
      { spot_number: 'MNS-02', price: 2.60, description: 'Amplia' },
      { spot_number: 'MNS-03', price: 2.30, description: 'Vigilada' }
    ]
  },
  {
    name: 'Garaje TEA',
    description: 'Parking del museo TEA',
    address: 'Av. de San Sebastián, 10',
    city: 'Santa Cruz de Tenerife',
    postal_code: '38003',
    lat: 28.4652,
    lng: -16.2490,
    total_spots: 4,
    spots: [
      { spot_number: 'TEA-01', price: 2.80, description: 'Cerca del museo' },
      { spot_number: 'TEA-02', price: 2.50, description: 'Amplia' },
      { spot_number: 'TEA-03', price: 2.70, description: 'Con cargador eléctrico' },
      { spot_number: 'TEA-04', price: 2.60, description: 'Iluminada' }
    ]
  }
];

async function seed() {
  console.log('🚀 Iniciando seeding...');

  try {
    // 1. Iniciar sesión
    console.log(`� Iniciando sesión como ${TEST_USER.email}...`);
    const { data: authData, error: loginError } = await supabase.auth.signInWithPassword(TEST_USER);

    if (loginError) {
      console.error('❌ Error al iniciar sesión:', loginError.message);
      process.exit(1);
    }

    const userId = authData.user.id;
    console.log(`   ✅ Login correcto. ID: ${userId}`);

    // 2. Verificar si existe en la tabla users
    let { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      console.log('   ℹ️  Perfil no encontrado en tabla users, creándolo...');
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: TEST_USER.email,
          name: 'Usuario Test',
          phone: '',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=test`,
          is_active: true
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creando perfil:', createError.message);
        process.exit(1);
      }
      userProfile = newProfile;
      console.log('   ✅ Perfil creado');
    } else {
      console.log('   ✅ Perfil existente encontrado');
    }

    // 3. Crear garajes y plazas
    console.log('');
    console.log(`🏢 Creando ${garagesData.length} garajes...`);
    let garagesCreated = 0;
    let spotsCreated = 0;

    for (const gData of garagesData) {
      process.stdout.write(`   📍 ${gData.name}: `);

      // Verificar si existe
      let { data: existingGarages } = await supabase
        .from('garages')
        .select('*')
        .eq('name', gData.name);

      let garage = existingGarages && existingGarages.length > 0 ? existingGarages[0] : null;

      if (!garage) {
        const { data: newGarage, error: garageError } = await supabase
          .from('garages')
          .insert({
            owner_id: userId,
            name: gData.name,
            description: gData.description,
            address: gData.address,
            city: gData.city,
            postal_code: gData.postal_code,
            lat: gData.lat,
            lng: gData.lng,
            total_spots: gData.total_spots,
            is_active: true
          })
          .select()
          .single();

        if (garageError) {
          console.log(`❌ Error: ${garageError.message}`);
          continue;
        }

        garage = newGarage;
        garagesCreated++;
        process.stdout.write(`✅ Creado`);
      } else {
        process.stdout.write(`ℹ️  Existe`);
      }

      // Crear spots
      const { data: existingSpots } = await supabase
        .from('parking_spots')
        .select('spot_number')
        .eq('garage_id', garage.id);

      const existingSpotNumbers = existingSpots ? existingSpots.map(s => s.spot_number) : [];
      const spotsToCreate = gData.spots.filter(s => !existingSpotNumbers.includes(s.spot_number));

      if (spotsToCreate.length > 0) {
        // Helper to determine type
        const determineType = (garageName = '', garageDesc = '', spotDesc = '') => {
          const text = (garageName + " " + garageDesc + " " + spotDesc).toLowerCase();

          if (text.includes('subterráneo') || text.includes('sótano') || text.includes('planta -') || text.includes('tunnel')) {
            return 'Subterráneo';
          }
          if (text.includes('aire libre') || text.includes('exterior') || text.includes('terraza') || text.includes('azotea')) {
            return 'Al aire libre';
          }
          return 'Cubierta'; // Default safe bet
        };

        const spots = spotsToCreate.map(s => ({
          garage_id: garage.id,
          owner_id: userId,
          spot_number: s.spot_number,
          base_price_per_hour: s.price,
          current_price_per_hour: s.price,
          description: s.description,
          // Determine type based on context
          type: determineType(garage.name, garage.description, s.description),
          is_active: true
        }));

        const { error: spotsError } = await supabase.from('parking_spots').insert(spots);

        if (spotsError) {
          console.log(` -> ❌ Error plazas: ${spotsError.message}`);
        } else {
          spotsCreated += spots.length;
          console.log(` -> ✅ +${spots.length} plazas`);
        }
      } else {
        console.log(` -> ℹ️  Plazas al día`);
      }
    }

    console.log('\n═══════════════════════════════════');
    console.log('✅ Seeding completado exitosamente!');
    console.log('═══════════════════════════════════');
    console.log(`📊 Nuevos garajes: ${garagesCreated}`);
    console.log(`📊 Nuevas plazas: ${spotsCreated}`);
    console.log('\n🎉 Abre la app y verifica el mapa!\n');

  } catch (err) {
    console.error('\n❌ Error inesperado:', err.message);
    process.exit(1);
  }
}

seed();
