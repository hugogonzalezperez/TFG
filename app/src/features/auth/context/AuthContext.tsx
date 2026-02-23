// =====================================================
// CONTEXTO DE AUTENTICACIÓN
// =====================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  logout as authLogout,
  getCurrentUserWithRoles,
  updateUserProfile,
  changePassword,
} from '../services/auth.service';
import { generateSessionId } from '../utils/session';
import type { AuthUser, RegisterRequest, LoginRequest, User } from '../types/auth.types';

// =====================================================
// TIPOS
// =====================================================

interface AuthContextType {
  // Estado
  authUser: AuthUser | null;
  loading: boolean;
  initialized: boolean;

  // Métodos de autenticación
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;

  // Métodos de perfil
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone' | 'avatar_url'>>) => Promise<void>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Helpers
  hasRole: (role: string) => boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

// =====================================================
// CREAR CONTEXTO
// =====================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // =====================================================
  // INICIALIZACIÓN
  // =====================================================

  useEffect(() => {
    // Al arrancar, intentamos cargar el usuario (loadUser buscará la sesión solo)
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadUser(session.user.id);
      } else {
        setAuthUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // =====================================================
  // ACCIONES DE SESIÓN
  // =====================================================

  /**
   * Cerrar sesión (Reforzado para Móvil/Privado)
   */
  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('parky_session_id');
      try {
        await authLogout();
      } catch (err) {
        console.warn('SignOut API falló o tardó demasiado, continuando con limpieza local:', err);
      }
      setAuthUser(null);
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Error crítico en logout:', error);
      setAuthUser(null);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar datos del usuario actual e iniciar comprobación de sesión
   */
  const refreshUser = async () => {
    if (authUser?.user.id) {
      await loadUser(authUser.user.id);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUser(session.user.id);
      }
    }
  };

  /**
   * Comprobar si somos los dueños de la sesión actual en DB
   */
  const checkSessionOwnership = (dbSessionId: string | null | undefined) => {
    const localSessionId = localStorage.getItem('parky_session_id');
    if (dbSessionId && localSessionId && dbSessionId !== localSessionId) {
      // console.warn('¡Mismatch detectado en comprobación activa!');
      return false;
    }
    return true;
  };

  // =====================================================
  // VIGILANCIA DE SESIÓN
  // =====================================================

  useEffect(() => {
    if (!authUser?.user.id) return;

    const channel = supabase
      .channel(`session_guard_${authUser.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${authUser.user.id}`,
        },
        async (payload: any) => {
          if (!checkSessionOwnership(payload.new.current_session_id)) {
            const { toast } = await import('sonner');
            toast.error('Sesión caducada', {
              description: 'Se ha iniciado sesión desde otro dispositivo.',
              duration: 8000,
            });
            setTimeout(logout, 1500);
          }
        }
      )
      .subscribe();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUser();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [authUser?.user.id, logout]);
  // Añadido logout a deps para seguridad

  /**
   * Cargar usuario actual con roles
   */
  const loadUser = async (userId?: string) => {
    try {
      setLoading(true);

      // 1. Decidimos qué ID usar
      let idToLoad = userId;

      // 2. Si no nos pasan un ID (como al recargar la página), lo buscamos en la sesión
      if (!idToLoad) {
        const { data: { session } } = await supabase.auth.getSession();
        idToLoad = session?.user?.id;
      }

      // 3. Si después de intentar buscarlo no hay ID, no podemos cargar nada
      if (!idToLoad) {
        setAuthUser(null);
        return;
      }

      // 4. Llamamos al servicio (con el sistema de reintentos por si el Trigger es lento)
      let userRes = null;
      let retries = 0;
      while (!userRes && retries < 3) {
        userRes = await getCurrentUserWithRoles(idToLoad);
        if (!userRes && retries < 2) {
          await new Promise(res => setTimeout(res, 500)); // Espera 0.5s
        }
        retries++;
      }

      setAuthUser(userRes);

      // 5. Gestión Robusta de Session ID Único
      if (userRes) {
        const dbSessionId = userRes.user.current_session_id;
        const localSessionId = localStorage.getItem('parky_session_id');

        if (dbSessionId) {
          if (!localSessionId) {
            // Caso 1: Refresco o nueva pestaña en el mismo navegador. Adoptamos el ID de la DB.
            localStorage.setItem('parky_session_id', dbSessionId);
          } else if (localSessionId !== dbSessionId) {
            // Caso 2: Mismatch real. Alguien más tomó el control.
            logout();
          }
        } else if (localSessionId) {
          // Caso 3: DB no tiene ID pero nosotros sí. Sincronizamos.
          try {
            await supabase.from('users').update({ current_session_id: localSessionId }).eq('id', userRes.user.id);
          } catch (e) {
            console.warn('Error syncing session to DB:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setAuthUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // =====================================================
  /**
   * Refrescar datos del usuario actual (Obsoleto, usar la de arriba)
   */

  // MÉTODOS DE AUTENTICACIÓN
  // =====================================================

  /**
   * Registrar nuevo usuario
   */
  // En AuthContext.tsx
  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await registerWithEmail(data);

      // IMPORTANTE: Asegurarnos de que tenemos el ID antes de cargar el usuario
      if (response.user && response.user.id) {
        await loadUser(response.user.id);
      } else {
        console.error("No se recibió el ID del usuario tras el registro");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  /**
   * Iniciar sesión con email
   */
  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      await loginWithEmail(data);
      await loadUser();
    } catch (error: any) {
      console.error('Error in login:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Iniciar sesión con Google
   */
  const handleLoginWithGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      // El redirect manejará el resto
    } catch (error: any) {
      console.error('Error in loginWithGoogle:', error);
      setLoading(false);
      throw new Error(error.message || 'Error al iniciar sesión con Google');
    }
  };

  /**
   * Iniciar sesión con Facebook
   */
  const handleLoginWithFacebook = async () => {
    try {
      setLoading(true);
      await loginWithFacebook();
      // El redirect manejará el resto
    } catch (error: any) {
      console.error('Error in loginWithFacebook:', error);
      setLoading(false);
      throw new Error(error.message || 'Error al iniciar sesión con Facebook');
    }
  };


  // =====================================================
  // MÉTODOS DE PERFIL
  // =====================================================

  /**
   * Actualizar perfil del usuario
   */
  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'phone' | 'avatar_url'>>) => {
    if (!authUser) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const updatedUser = await updateUserProfile(authUser.user.id, updates);
      setAuthUser({
        ...authUser,
        user: updatedUser,
      });
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      throw new Error(error.message || 'Error al actualizar el perfil');
    }
  };

  /**
   * Cambiar contraseña
   */
  const changeUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!authUser) {
      throw new Error('Usuario no autenticado');
    }

    try {
      await changePassword(authUser.user.id, currentPassword, newPassword);
    } catch (error: any) {
      console.error('Error in changePassword:', error);
      throw new Error(error.message || 'Error al cambiar la contraseña');
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const hasRole = (role: string): boolean => {
    return authUser?.hasRole(role as any) || false;
  };

  const isAuthenticated = authUser !== null;
  const isOwner = authUser?.isOwner || false;
  const isAdmin = authUser?.isAdmin || false;

  // =====================================================
  // VALOR DEL CONTEXTO
  // =====================================================

  const value: AuthContextType = {
    authUser,
    loading,
    initialized,
    register,
    login,
    loginWithGoogle: handleLoginWithGoogle,
    loginWithFacebook: handleLoginWithFacebook,
    logout,
    updateProfile,
    changeUserPassword,
    hasRole,
    isAuthenticated,
    isOwner,
    isAdmin,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =====================================================
// HOOK PERSONALIZADO
// =====================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}