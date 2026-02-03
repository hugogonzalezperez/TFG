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
    if (key && value.length > 0) env[key.trim()] = value.join('=').trim();
  });
  return env;
}

const env = loadEnv(path.join(__dirname, '..', '.env.local'));
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function verify() {
  const { count, error } = await supabase
    .from('parking_spots')
    .select('*', { count: 'exact', head: true })
    .not('type', 'is', null);

  const { count: total } = await supabase
    .from('parking_spots')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log('Error verifying:', error.message);
  } else {
    console.log(`✅ Spots with type: ${count} / ${total}`);
  }
}

verify();
