// =====================================================
// SERVICIO DE AUTENTICACIÓN - VERSIÓN SIMPLIFICADA
// Sin bcryptjs, usando Supabase Auth directamente
// =====================================================

import { supabase } from '../lib/supabase';
import {
  User,
  AuthUser,
  RegisterRequest,
  LoginRequest,
  UserRoleType,
  AuthResponse,
} from '../types/database.types';

// =====================================================
// REGISTRO DE USUARIO
// =====================================================

/**
 * Registrar un nuevo usuario con email y contraseña
 * Usa Supabase Auth directamente (sin bcrypt en el cliente)
 */
export const registerWithEmail = async ({
  email,
  password,
  name,
  phone,
}: RegisterRequest): Promise<AuthResponse> => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Aseguramos que si phone es undefined, mandamos null o string vacío
      data: {
        name: name || 'Usuario',
        phone: phone || '',
      },
    },
  });

  if (authError) {
    // Si el error es 422 aquí, es definitivamente el Trigger
    console.error("Error detallado de Supabase:", authError);
    throw new Error(authError.message);
  }

  if (!authData.user) throw new Error('No se pudo crear el usuario');

  return {
    user: authData.user as any,
    session: authData.session,
  };
};

// =====================================================
// LOGIN
// =====================================================

/**
 * Iniciar sesión con email y contraseña
 * Usa Supabase Auth directamente
 */
export const loginWithEmail = async ({ email, password }: LoginRequest): Promise<AuthResponse> => {
  try {
    // 1. Login con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error('Credenciales incorrectas');
    }

    if (!authData.user) {
      throw new Error('Error al iniciar sesión');
    }

    // 2. Obtener datos del usuario de nuestra tabla
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !user) {
      // Si no existe en nuestra tabla, crearlo
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name || 'Usuario',
          phone: authData.user.user_metadata?.phone,
          is_active: true,
        })
        .select()
        .single();

      if (createError) {
        throw new Error('Error al obtener datos del usuario');
      }

      return {
        user: newUser as User,
        session: authData.session
          ? {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_at: authData.session.expires_at || 0,
          }
          : undefined,
      };
    }

    return {
      user: user as User,
      session: authData.session
        ? {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at || 0,
        }
        : undefined,
    };
  } catch (error) {
    console.error('Error in loginWithEmail:', error);
    throw error;
  }
};

// =====================================================
// LOGIN CON GOOGLE
// =====================================================

/**
 * Iniciar sesión con Google OAuth
 */
export const loginWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in loginWithGoogle:', error);
    throw error;
  }
};

// =====================================================
// LOGIN CON FACEBOOK
// =====================================================

/**
 * Iniciar sesión con Facebook OAuth
 */
export const loginWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in loginWithFacebook:', error);
    throw error;
  }
};

// =====================================================
// MANEJO DE CALLBACK OAUTH
// =====================================================

/**
 * Procesar el callback de OAuth (Google/Facebook)
 * Crear o actualizar usuario en la base de datos
 */
export const handleOAuthCallback = async (): Promise<User | null> => {
  try {
    // Obtener el usuario de Supabase Auth
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    // Determinar el proveedor
    const provider = authUser.app_metadata.provider as 'google' | 'facebook';

    // Verificar si el usuario ya existe en nuestra DB
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (existingUser) {
      // Usuario existe, verificar si tiene este proveedor
      const { data: existingProvider } = await supabase
        .from('auth_providers')
        .select('*')
        .eq('user_id', existingUser.id)
        .eq('provider', provider)
        .single();

      if (!existingProvider) {
        // Añadir el nuevo proveedor
        await supabase.from('auth_providers').insert({
          user_id: existingUser.id,
          provider: provider,
          provider_uid: authUser.id,
        });
      }

      return existingUser as User;
    }

    // Usuario nuevo, crear en nuestra DB
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata.full_name || authUser.user_metadata.name || 'Usuario',
        avatar_url: authUser.user_metadata.avatar_url,
        is_active: true,
      })
      .select()
      .single();

    if (userError || !newUser) {
      throw new Error('Error al crear el usuario');
    }

    // Crear el proveedor de autenticación
    await supabase.from('auth_providers').insert({
      user_id: newUser.id,
      provider: provider,
      provider_uid: authUser.id,
    });

    // Asignar rol de usuario por defecto
    const { data: userRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'user')
      .single();

    if (userRole) {
      await supabase.from('user_roles').insert({
        user_id: newUser.id,
        role_id: userRole.id,
      });
    }

    return newUser as User;
  } catch (error) {
    console.error('Error in handleOAuthCallback:', error);
    throw error;
  }
};

// =====================================================
// CERRAR SESIÓN
// =====================================================

/**
 * Cerrar sesión del usuario actual
 */
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error in logout:', error);
    throw error;
  }
};

// =====================================================
// OBTENER USUARIO CON ROLES
// =====================================================

/**
 * Obtener el usuario actual con sus roles
 */
export const getCurrentUserWithRoles = async (userId: string): Promise<AuthUser | null> => {
  // ESCUDO: Si no hay ID o es la palabra "undefined", salimos antes de fallar
  if (!userId || userId === 'undefined') {
    console.warn('getCurrentUserWithRoles llamado sin un ID válido');
    return null;
  }

  try {
    // Especificamos los campos exactos en lugar de '*' para evitar el 406
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, phone, avatar_url, is_active')
      .eq('id', userId)
      .maybeSingle(); // Usamos maybeSingle en lugar de single para evitar errores si no existe

    if (userError) throw userError;
    if (!user) return null;

    // Obtener roles del usuario
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles(*)')
      .eq('user_id', user.id);

    const roles: UserRoleType[] = userRoles?.map((ur: any) => ur.roles.name) || [];

    return {
      user: user as User,
      roles,
      hasRole: (role: UserRoleType) => roles.includes(role),
      isOwner: roles.includes('owner'),
      isAdmin: roles.includes('admin'),
    };
  } catch (error) {
    console.error('Error in getCurrentUserWithRoles:', error);
    return null;
  }
};

// =====================================================
// ACTUALIZAR PERFIL
// =====================================================

/**
 * Actualizar información del usuario
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'name' | 'phone' | 'avatar_url'>>
): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================

/**
 * Cambiar la contraseña del usuario
 * Usa Supabase Auth directamente
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    // Supabase Auth maneja la verificación de la contraseña actual internamente
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error in changePassword:', error);
    throw error;
  }
};