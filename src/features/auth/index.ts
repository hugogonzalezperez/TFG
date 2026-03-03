// =====================================================
// PUBLIC API - FEATURE AUTH
// =====================================================

// Context
export { AuthProvider, useAuth } from './context/AuthContext';

// Services
export {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  handleOAuthCallback,
  getCurrentUserWithRoles,
  updateUserProfile,
  changePassword,
} from './services/auth.service';

// Types
export type {
  User,
  AuthUser,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  SocialAuthRequest,
  UserRoleType,
  AuthProviderType,
} from './types/auth.types';

// Components
export { AuthCallback } from './components/AuthCallback';
