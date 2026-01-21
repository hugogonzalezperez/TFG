// =====================================================
// TIPOS DE AUTENTICACIÓN
// =====================================================

export type AuthProviderType = 'email' | 'google' | 'facebook';
export type UserRoleType = 'admin' | 'user' | 'owner';

// =====================================================
// INTERFACES
// =====================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: UserRoleType;
  description?: string;
  created_at: string;
}

export interface AuthUser {
  user: User;
  roles: UserRoleType[];
  hasRole: (role: UserRoleType) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

export interface AuthResponse {
  user: User;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

// =====================================================
// FORMULARIOS Y REQUESTS
// =====================================================

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  isOwner?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SocialAuthRequest {
  provider: 'google' | 'facebook';
  provider_uid: string;
  email: string;
  name: string;
  avatar_url?: string;
}
