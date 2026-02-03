
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno Supabase no encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Iniciando seeding...');

  try {
    // 1. Crear un usuario propietario si no existe
    const ownerEmail = 'propietario@parky.com';
    let { data: owner, error: ownerError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ownerEmail)
      .single();

    if (ownerError && ownerError.code === 'PGRST116') { // No se encuentra
      console.log('Creando usuario propietario...');
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
    } else if (ownerError) {
      throw ownerError;
    }

    console.log('Usuario propietario listo:', owner.id);

    // 2. Crear un garaje
    const garageName = 'Garaje Central Santa Cruz';
    let { data: garage, error: garageError } = await supabase
      .from('garages')
      .select('*')
      .eq('name', garageName)
      .single();

    if (garageError && garageError.code === 'PGRST116') {
      console.log('Creando garaje...');
      const { data: newGarage, error: createGarageError } = await supabase
        .from('garages')
        .insert([
          {
            owner_id: owner.id,
            name: garageName,
            description: 'Garaje amplio y seguro en el centro de Santa Cruz, cerca de la Plaza Weyler.',
            address: 'Calle Castillo, 45',
            city: 'Santa Cruz de Tenerife',
            postal_code: '38003',
            lat: 28.4674,
            lng: -16.2541,
            total_spots: 5,
            is_active: true
          }
        ])
        .select()
        .single();

      if (createGarageError) throw createGarageError;
      garage = newGarage;
    } else if (garageError) {
      throw garageError;
    }

    console.log('Garaje listo:', garage.id);

    // 3. Crear plazas de aparcamiento
    console.log('Verificando plazas de aparcamiento...');
    const { data: existingSpots, error: spotsError } = await supabase
      .from('parking_spots')
      .select('id')
      .eq('garage_id', garage.id);

    if (spotsError) throw spotsError;

    if (existingSpots.length === 0) {
      console.log('Creando plazas de aparcamiento...');
      const spotsToInsert = [
        {
          garage_id: garage.id,
          owner_id: owner.id,
          spot_number: 'P1-01',
          base_price_per_hour: 2.50,
          current_price_per_hour: 2.50,
          description: 'Plaza estándar, fácil acceso.',
          is_active: true
        },
        {
          garage_id: garage.id,
          owner_id: owner.id,
          spot_number: 'P1-02',
          base_price_per_hour: 3.00,
          current_price_per_hour: 3.00,
          description: 'Plaza extra grande, ideal para SUVs.',
          is_active: true
        },
        {
          garage_id: garage.id,
          owner_id: owner.id,
          spot_number: 'P1-03',
          base_price_per_hour: 2.20,
          current_price_per_hour: 2.20,
          description: 'Plaza para coches compactos.',
          is_active: true
        }
      ];

      const { error: createSpotsError } = await supabase
        .from('parking_spots')
        .insert(spotsToInsert);

      if (createSpotsError) throw createSpotsError;
      console.log('Plazas creadas con éxito.');
    } else {
      console.log('Plazas ya existentes.');
    }

    // 4. Crear un segundo garaje para más variedad
    const garageName2 = 'Parking Marina Santa Cruz';
    let { data: garage2, error: garageError2 } = await supabase
      .from('garages')
      .select('*')
      .eq('name', garageName2)
      .single();

    if (garageError2 && garageError2.code === 'PGRST116') {
      console.log('Creando segundo garaje...');
      const { data: newGarage2, error: createGarageError2 } = await supabase
        .from('garages')
        .insert([
          {
            owner_id: owner.id,
            name: garageName2,
            description: 'Parking cerca de la zona portuaria y el Auditorio.',
            address: 'Avenida de Anaga, 12',
            city: 'Santa Cruz de Tenerife',
            postal_code: '38001',
            lat: 28.4715,
            lng: -16.2482,
            total_spots: 3,
            is_active: true
          }
        ])
        .select()
        .single();

      if (createGarageError2) throw createGarageError2;
      garage2 = newGarage2;

      console.log('Creando plazas para el segundo garaje...');
      const spotsToInsert2 = [
        {
          garage_id: garage2.id,
          owner_id: owner.id,
          spot_number: 'A-01',
          base_price_per_hour: 1.80,
          current_price_per_hour: 1.80,
          description: 'Plaza sombreada.',
          is_active: true
        },
        {
          garage_id: garage2.id,
          owner_id: owner.id,
          spot_number: 'A-02',
          base_price_per_hour: 2.00,
          current_price_per_hour: 2.00,
          description: 'Cerca de la salida.',
          is_active: true
        }
      ];

      const { error: createSpotsError2 } = await supabase
        .from('parking_spots')
        .insert(spotsToInsert2);

      if (createSpotsError2) throw createSpotsError2;
    }

    console.log('Seeding completado con éxito! 🚀');

  } catch (err) {
    console.error('Error durante el seeding:', err);
    process.exit(1);
  }
}

seed();
