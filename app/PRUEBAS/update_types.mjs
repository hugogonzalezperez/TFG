import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para parsear .env.local
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

async function updateTypes() {
  console.log('🔄 Iniciando actualización de tipos de parking...');

  // 0. Iniciar sesión
  const TEST_USER = { email: 'test@test.com', password: '123123123' };
  const { error: loginError } = await supabase.auth.signInWithPassword(TEST_USER);
  if (loginError) {
    console.error('❌ Error login:', loginError.message);
    process.exit(1);
  }
  console.log('✅ Login correcto.');

  // 1. Obtener todos los garajes para tener contexto
  const { data: garages, error: garageError } = await supabase.from('garages').select('*');
  if (garageError) {
    console.error('Error fetching garages:', garageError);
    return;
  }

  const garageMap = new Map(garages.map(g => [g.id, g]));

  // 2. Obtener todos los spots (como owner, ahora podemos verlos todos si RLS está bien configurado para owner)
  const { data: spots, error: spotsError } = await supabase.from('parking_spots').select('*');
  if (spotsError) {
    console.error('Error fetching spots:', spotsError);
    return;
  }

  console.log(`📊 Procesando ${spots.length} plazas...`);
  let updatedCount = 0;

  for (const spot of spots) {
    const garage = garageMap.get(spot.garage_id) || {};
    const newType = determineType(garage.name, garage.description, spot.description);

    // Solo actualizar si es diferente o no tiene tipo
    if (spot.type !== newType) {
      const { error: updateError } = await supabase
        .from('parking_spots')
        .update({ type: newType })
        .eq('id', spot.id);

      if (updateError) {
        console.error(`❌ Error updating spot ${spot.spot_number}:`, updateError.message);
      } else {
        console.log(`✅ ${spot.spot_number} actualizado a ${newType}`);
        updatedCount++;
      }
    }
  }

  console.log(`\n\n✅ Actualización completada.`);
  console.log(`📝 Se actualizaron ${updatedCount} plazas.`);
}

updateTypes();
