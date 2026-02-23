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

  /**
   * Vigilancia de Session ID Único (Realtime)
   * Si cambia el session_id en la base de datos y no coincide con el nuestro,
   * significa que se ha iniciado sesión en otro sitio.
   */
  useEffect(() => {
    if (!authUser?.user.id) return;

    // console.log('Iniciando vigilancia de sesión para:', authUser.user.id);

    // Canal único por usuario para evitar ruido
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
          // console.log('Cambio de sesión detectado en DB:', payload.new.current_session_id);

          const newSessionId = payload.new.current_session_id;
          const localSessionId = localStorage.getItem('parky_session_id');

          // Si el ID de la base de datos es distinto al que tenemos guardado localmente...
          if (newSessionId && localSessionId && newSessionId !== localSessionId) {
            // console.warn('¡Sesión expirada! Mismatch detectado.');

            // Notificamos al usuario antes de expulsar
            const { toast } = await import('sonner');
            toast.error('Sesión caducada', {
              description: 'Se ha iniciado sesión desde otro dispositivo. Serás desconectado por seguridad.',
              duration: 8000,
            });

            // Esperar un poco para que lea el mensaje y luego logout
            setTimeout(async () => {
              await logout();
              window.location.href = '/login'; // Forzamos recarga
            }, 2000);
          }
        }
      )
      .subscribe((status) => {
        // console.log('Estado de la suscripción de sesión:', status);
      });

    return () => {
      // console.log('Limpiando vigilancia de sesión');
      supabase.removeChannel(channel);
    };
  }, [authUser?.user.id]);

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

      // 5. Sincronizar Session ID Único si estamos autenticados
      if (userRes) {
        let localSessionId = localStorage.getItem('parky_session_id');
        if (!localSessionId) {
          // Si no tenemos ID local pero sí sesión (ej. reabrir navegador), generamos uno
          localSessionId = crypto.randomUUID();
          localStorage.setItem('parky_session_id', localSessionId);
        }

        // Actualizamos siempre la DB al cargar para marcar "estoy aquí" 
        // y echar a posibles sesiones antiguas que no se enteraron
        try {
          await supabase
            .from('users')
            .update({ current_session_id: localSessionId })
            .eq('id', userRes.user.id);
        } catch (e) {
          console.warn('Error syncing session ID on load:', e);
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
   * Refrescar datos del usuario actual
   */
  const refreshUser = async () => {
    if (authUser?.user.id) {
      await loadUser(authUser.user.id);
    }
  };

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

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authLogout();
      setAuthUser(null);
    } catch (error: any) {
      console.error('Error in logout:', error);
      throw new Error(error.message || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
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