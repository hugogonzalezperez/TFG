# 🎓 EJEMPLOS DE USO - AuthContext

Este archivo contiene ejemplos prácticos de cómo usar el `AuthContext` en diferentes partes de tu aplicación.

---

## 📋 TABLA DE CONTENIDOS

1. [Uso Básico](#uso-básico)
2. [Proteger Rutas](#proteger-rutas)
3. [Mostrar/Ocultar Elementos según Rol](#mostrar-elementos-según-rol)
4. [Actualizar Perfil](#actualizar-perfil)
5. [Cambiar Contraseña](#cambiar-contraseña)
6. [Obtener Información del Usuario](#obtener-información-del-usuario)

---

## 🔰 EJEMPLO 1: Uso Básico

### En cualquier componente

```tsx
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { authUser, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div>Por favor inicia sesión</div>;
  }

  return (
    <div>
      <h1>Hola, {authUser?.user.name}!</h1>
      <p>Email: {authUser?.user.email}</p>
    </div>
  );
}
```

---

## 🛡️ EJEMPLO 2: Proteger Rutas

### Crear un componente ProtectedRoute

```tsx
// src/components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  requireRole?: 'admin' | 'owner';
}

export function ProtectedRoute({ 
  children, 
  onNavigate, 
  requireRole 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole, authUser } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      onNavigate('login');
    }
    
    if (!loading && isAuthenticated && requireRole) {
      if (!hasRole(requireRole)) {
        // Redirigir a una página de "No autorizado"
        onNavigate('home');
      }
    }
  }, [isAuthenticated, loading, onNavigate, requireRole, hasRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireRole && !hasRole(requireRole)) {
    return null;
  }

  return <>{children}</>;
}
```

### Usar ProtectedRoute en App.tsx

```tsx
// App.tsx
case 'profile':
  return (
    <ProtectedRoute onNavigate={handleNavigation}>
      <UserProfile onNavigate={handleNavigation} />
    </ProtectedRoute>
  );

case 'owner-profile':
  return (
    <ProtectedRoute 
      onNavigate={handleNavigation} 
      requireRole="owner"
    >
      <OwnerProfile onNavigate={handleNavigation} />
    </ProtectedRoute>
  );

case 'admin-panel':
  return (
    <ProtectedRoute 
      onNavigate={handleNavigation} 
      requireRole="admin"
    >
      <AdminPanel onNavigate={handleNavigation} />
    </ProtectedRoute>
  );
```

---

## 👁️ EJEMPLO 3: Mostrar/Ocultar Elementos según Rol

### Mostrar botones solo para propietarios

```tsx
import { useAuth } from '../context/AuthContext';

function Header({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { isOwner, isAdmin, isAuthenticated, logout } = useAuth();

  return (
    <header>
      <nav>
        <button onClick={() => onNavigate('home')}>Inicio</button>
        
        {isAuthenticated && (
          <>
            <button onClick={() => onNavigate('bookings')}>
              Mis Reservas
            </button>
            
            {isOwner && (
              <button onClick={() => onNavigate('owner-profile')}>
                Mis Garajes
              </button>
            )}
            
            {isAdmin && (
              <button onClick={() => onNavigate('admin-panel')}>
                Panel Admin
              </button>
            )}
            
            <button onClick={() => onNavigate('profile')}>
              Mi Perfil
            </button>
            
            <button onClick={logout}>Cerrar Sesión</button>
          </>
        )}
        
        {!isAuthenticated && (
          <>
            <button onClick={() => onNavigate('login')}>
              Iniciar Sesión
            </button>
            <button onClick={() => onNavigate('signup')}>
              Registrarse
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
```

### Verificar múltiples roles

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { hasRole, authUser } = useAuth();

  // Verificar si tiene rol específico
  if (hasRole('admin')) {
    return <AdminDashboard />;
  }

  // Verificar múltiples roles
  const canManageGarages = hasRole('owner') || hasRole('admin');
  
  if (canManageGarages) {
    return <GarageManagement />;
  }

  return <UserDashboard />;
}
```

---

## ✏️ EJEMPLO 4: Actualizar Perfil

### Componente de edición de perfil

```tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/ui';

export function EditProfile() {
  const { authUser, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: authUser?.user.name || '',
    phone: authUser?.user.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Editar Perfil</h2>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          Perfil actualizado correctamente
        </div>
      )}
      
      <div>
        <label>Nombre</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting || loading}
          required
        />
      </div>
      
      <div>
        <label>Teléfono</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={isSubmitting || loading}
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting || loading}>
        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  );
}
```

---

## 🔐 EJEMPLO 5: Cambiar Contraseña

### Componente para cambiar contraseña

```tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/ui';
import { Eye, EyeOff } from 'lucide-react';

export function ChangePassword() {
  const { changeUserPassword, loading } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validaciones
    if (formData.newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setIsSubmitting(true);

    try {
      await changeUserPassword(formData.currentPassword, formData.newPassword);
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-2xl font-bold">Cambiar Contraseña</h2>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          Contraseña actualizada correctamente
        </div>
      )}
      
      {/* Contraseña actual */}
      <div>
        <label>Contraseña Actual</label>
        <div className="relative">
          <Input
            type={showCurrentPassword ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            disabled={isSubmitting || loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Nueva contraseña */}
      <div>
        <label>Nueva Contraseña</label>
        <div className="relative">
          <Input
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            disabled={isSubmitting || loading}
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
      </div>
      
      {/* Confirmar contraseña */}
      <div>
        <label>Confirmar Nueva Contraseña</label>
        <Input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          disabled={isSubmitting || loading}
          required
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting || loading} className="w-full">
        {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
      </Button>
    </form>
  );
}
```

---

## 📊 EJEMPLO 6: Obtener Información del Usuario

### Mostrar información completa del usuario

```tsx
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui';

export function UserInfo() {
  const { authUser, isOwner, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Cargando información del usuario...</div>;
  }

  if (!authUser) {
    return <div>No hay usuario autenticado</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Información Personal</h3>
        <p>Nombre: {authUser.user.name}</p>
        <p>Email: {authUser.user.email}</p>
        <p>Teléfono: {authUser.user.phone || 'No especificado'}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Roles</h3>
        <div className="flex gap-2 flex-wrap">
          {authUser.roles.map((role) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Estado</h3>
        <p>Cuenta activa: {authUser.user.is_active ? 'Sí' : 'No'}</p>
        <p>Es propietario: {isOwner ? 'Sí' : 'No'}</p>
        <p>Es administrador: {isAdmin ? 'Sí' : 'No'}</p>
        <p>Registrado: {new Date(authUser.user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
```

### Crear un hook personalizado para verificar permisos

```tsx
// src/hooks/usePermissions.ts
import { useAuth } from '../context/AuthContext';

export function usePermissions() {
  const { authUser, hasRole } = useAuth();

  return {
    canCreateGarage: hasRole('owner') || hasRole('admin'),
    canManageUsers: hasRole('admin'),
    canEditGarage: (garageOwnerId: string) => {
      if (hasRole('admin')) return true;
      return authUser?.user.id === garageOwnerId;
    },
    canDeleteBooking: (bookingUserId: string) => {
      if (hasRole('admin')) return true;
      return authUser?.user.id === bookingUserId;
    },
  };
}
```

### Usar el hook de permisos

```tsx
import { usePermissions } from '../hooks/usePermissions';

export function GarageCard({ garage }: { garage: Garage }) {
  const { canEditGarage } = usePermissions();

  return (
    <div>
      <h3>{garage.name}</h3>
      
      {canEditGarage(garage.owner_id) && (
        <button onClick={() => handleEdit(garage.id)}>
          Editar Garaje
        </button>
      )}
    </div>
  );
}
```

---

## 🎯 RESUMEN

El `AuthContext` te proporciona:

- ✅ `authUser` - Información completa del usuario y sus roles
- ✅ `loading` - Estado de carga
- ✅ `isAuthenticated` - Si el usuario está autenticado
- ✅ `isOwner` - Si el usuario es propietario
- ✅ `isAdmin` - Si el usuario es administrador
- ✅ `hasRole(role)` - Verificar rol específico
- ✅ `register(data)` - Registrar nuevo usuario
- ✅ `login(data)` - Iniciar sesión con email
- ✅ `loginWithGoogle()` - Iniciar sesión con Google
- ✅ `loginWithFacebook()` - Iniciar sesión con Facebook
- ✅ `logout()` - Cerrar sesión
- ✅ `updateProfile(updates)` - Actualizar perfil
- ✅ `changeUserPassword(current, new)` - Cambiar contraseña

---

¡Con estos ejemplos deberías poder integrar la autenticación en cualquier parte de tu aplicación! 🚀