
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

async function testQuery() {
  console.log('Testing query and inspecting data...');
  const { data, error } = await supabase
    .from('garages')
    .select(`
      *,
      parking_spots (
        *,
        owner:users (id, name, avatar_url)
      )
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Query Error:', error);
  } else {
    console.log('Query Success! Data length:', data.length);
    if (data.length > 0) {
      console.log('First garage:', JSON.stringify(data[0], null, 2));
    }
  }
}

testQuery();
