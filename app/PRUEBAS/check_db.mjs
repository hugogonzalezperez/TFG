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

const env = loadEnv(path.join(__dirname, '..', '.env.local'));
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  console.log('🔍 Verificando estado de la base de datos...\n');

  // Check users
  const { data: users, error: usersError } = await supabase.from('users').select('*');
  console.log('👤 Usuarios en tabla users:');
  if (users && users.length > 0) {
    users.forEach(u => console.log(`   - ${u.email || u.name || u.id}`));
  } else {
    console.log('   ❌ No hay usuarios');
  }

  // Check auth users
  const { data: { user: authUser } } = await supabase.auth.getUser();
  console.log('\n🔐 Usuario autenticado actual:');
  if (authUser) {
    console.log(`   ✅ ${authUser.email} (${authUser.id})`);
  } else {
    console.log('   ❌ No hay sesión activa');
  }

  // Check garages
  const { data: garages } = await supabase.from('garages').select('*');
  console.log(`\n🏢 Garajes: ${garages?.length || 0}`);

  // Check spots
  const { data: spots } = await supabase.from('parking_spots').select('*');
  console.log(`🅿️  Plazas: ${spots?.length || 0}`);
}

check();
