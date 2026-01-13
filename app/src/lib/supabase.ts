// =====================================================
// CLIENTE SUPABASE
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Validar que las variables de entorno estén definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configuración de autenticación
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// =====================================================
// HELPERS DE AUTENTICACIÓN
// =====================================================

/**
 * Obtener el usuario actual de la sesión
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  return user;
};

/**
 * Verificar si hay una sesión activa
 */
export const hasActiveSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session !== null;
};

/**
 * Escuchar cambios en el estado de autenticación
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};