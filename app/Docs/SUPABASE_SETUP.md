# 🚀 Setup Completado de Autenticación Supabase - Parky

## ✅ Integración completada

He implementado la autenticación con **Supabase** manteniendo tu estructura de carpetas actual. Aquí está lo que se ha creado y actualizado:

---

## 📦 Archivos creados/actualizados

### ✅ Nuevos archivos creados:

1. **`src/lib/supabase.ts`**
   - Cliente de Supabase
   - Valida que las variables de entorno estén configuradas

2. **`src/types/auth.types.ts`**
   - Tipos TypeScript para usuarios
   - Interfaces para Login y SignUp

3. **`src/context/AuthContext.tsx`**
   - Contexto global de autenticación
   - Hook `useAuth()` para usar en cualquier componente
   - Funciones: `login`, `signUp`, `signInWithGoogle`, `logout`

4. **`src/components/features/AuthCallback.tsx`**
   - Maneja el callback de OAuth de Google
   - Redirige automáticamente al home

### ✅ Archivos actualizados:

5. **`src/pages/Login.tsx`**
   - Integración con `useAuth()` para login con email/password
   - Botón "Continuar con Google"

6. **`src/pages/SignUp.tsx`**
   - Integración con `useAuth()` para registro
   - Botón "Continuar con Google"

7. **`src/App.tsx`**
   - Importa `AuthCallback` para manejar OAuth callback
   - Ya tiene `AuthProvider` envolviendo la app

---

## 🔧 Próximos pasos: Configuración de Supabase

### Paso 1: Obtén tus credenciales

1. Ve a https://supabase.com
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Ve a **Project Settings** → **API**
5. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public key**

### Paso 2: Configura el archivo `.env`

Abre `/root/TFG/app/.env` y reemplaza:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 3: Crea la tabla de perfiles en Supabase

En el dashboard de Supabase, ve a **SQL Editor** y ejecuta:

```sql
-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Usuarios ven su perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios actualizan su perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger para crear perfil automático
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Paso 4: Configura Google OAuth (OPCIONAL - sin esto, solo funciona email/password)

#### En Google Cloud Console:

1. Ve a https://console.cloud.google.com
2. Crea un nuevo proyecto
3. Ve a **APIs & Services** → **Credentials**
4. Haz clic en **Create Credentials** → **OAuth 2.0 Client ID**
5. Configura:
   - **Application type**: Web application
   - **Name**: Parky
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     https://tu-proyecto-id.supabase.co/auth/v1/callback
     ```
   - Reemplaza `tu-proyecto-id` con tu ID real de Supabase

6. Copia el **Client ID** y **Client Secret**

#### En Supabase:

1. Ve a **Authentication** → **Providers**
2. Activa **Google**
3. Pega el **Client ID** y **Client Secret**
4. En **Redirect URL**, confirma que sea:
   ```
   https://tu-proyecto-id.supabase.co/auth/v1/callback
   ```
5. Guarda

---

## 🎯 Cómo usar la autenticación en tu código

### Importar el hook de autenticación:

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, signInWithGoogle } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <p>¡Hola, {user.full_name}!</p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}
```

### Usar en componentes:

```tsx
// Login con email/password
await login({ email: 'user@example.com', password: '123456' });

// Registro
await signUp({ 
  email: 'user@example.com', 
  password: '123456',
  full_name: 'Juan Pérez'
});

// Logout
await logout();
```

---

## 🧪 Cómo probar

1. Ejecuta la app:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:5173

3. Prueba:
   - Registrarte con email/password
   - Iniciar sesión
   - Si configuraste Google: "Continuar con Google"
   - Cerrar sesión desde el perfil

---

## ✨ Funcionalidades implementadas

✅ Login con email/password
✅ Registro con email/password
✅ Login con Google OAuth
✅ Perfil automático en BD
✅ Persistencia de sesión
✅ Error handling
✅ Loading states
✅ Logout funcional
✅ Integrado en tu estructura actual

---

## 🚨 Troubleshooting

**Problema: "No se encuentra la variable de entorno"**
- Verifica que `.env` esté en la raíz (`/root/TFG/app/.env`)
- Variables deben comenzar con `VITE_`
- Reinicia el servidor después de cambiar `.env`

**Problema: OAuth redirect no funciona**
- Verifica que la URL en Google Cloud Console coincida exactamente con la de Supabase
- Formato: `https://tu-proyecto-id.supabase.co/auth/v1/callback`

**Problema: No se crea el perfil**
- Verifica que el trigger esté creado en Supabase
- Revisa los logs en Supabase → Database → Logs

**Problema: Email/password no funciona**
- Email debe ser único
- Contraseña mínimo 6 caracteres
- Verifica la tabla profiles en Supabase

---

## 📝 Próximos pasos (opcionales)

1. **Integrar info del usuario en el header**
   - Mostrar nombre del usuario
   - Avatar
   - Link a perfil

2. **Proteger rutas privadas**
   - Crear `ProtectedRoute` que valide autenticación
   - Redirigir a login si no está autenticado

3. **Email verification**
   - Activar en Supabase → Authentication → Settings
   - Enviar email de confirmación

4. **Reset password**
   - Crear componente ForgotPassword
   - Usar `supabase.auth.resetPasswordForEmail()`

---

## 🆘 ¿Necesitas ayuda?

Revisa que hayas hecho:
1. ✅ Variables de entorno configuradas
2. ✅ Tabla profiles creada en Supabase
3. ✅ Trigger de auto-creación del perfil
4. ✅ (Opcional) Google OAuth configurado

¡Todo listo! 🎉
