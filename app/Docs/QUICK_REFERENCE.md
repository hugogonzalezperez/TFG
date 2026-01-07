# 🛠️ Guía Rápida - Qué Editar Para Cada Tarea

Esta guía te muestra exactamente qué archivo abrir para hacer cambios comunes.

---

## 1️⃣ Cambiar Nombre de un Parking

**Archivo:** `src/components/features/MapView.tsx`

**Localización:** Línea ~26-70 (array `parkingSpots`)

**Antes:**
```tsx
const parkingSpots = [
  {
    id: 1,
    name: 'Plaza Centro',  // ← Cambia esto
    location: 'Calle Castillo, 45',
    // ...
  }
]
```

**Después:**
```tsx
const parkingSpots = [
  {
    id: 1,
    name: 'Garaje Premium Santa Cruz',  // ✓ Nuevo nombre
    location: 'Calle Castillo, 45',
    // ...
  }
]
```

---

## 2️⃣ Cambiar Precio de un Parking

**Archivo:** `src/components/features/MapView.tsx`

**Localización:** Línea ~26-70 (array `parkingSpots`)

**Busca:**
```tsx
price: 2.5,  // ← Cambia esto
```

**Ejemplo:**
```tsx
price: 3.99,  // ✓ Nuevo precio
```

---

## 3️⃣ Cambiar Colores de la Marca

**Archivo:** `src/styles/globals.css`

**Localización:** Línea ~12-20 (variables CSS)

**Actual:**
```css
--primary: #0F6FFF;        /* Azul */
--secondary: #10B981;      /* Verde */
--accent: #F59E0B;         /* Naranja */
```

**Ejemplo cambio a morado:**
```css
--primary: #7C3AED;        /* Morado */
--secondary: #10B981;      /* Verde */
--accent: #F59E0B;         /* Naranja */
```

---

## 4️⃣ Cambiar Texto de la Página Home

**Archivo:** `src/pages/Home.tsx`

**Localización:** Línea ~40-160 (JSX con textos)

**Busca:**
```tsx
<h1 className="text-5xl font-bold text-foreground mb-4">
  Encuentra tu plaza de aparcamiento
</h1>
```

**Edita a:**
```tsx
<h1 className="text-5xl font-bold text-foreground mb-4">
  Reserva tu parking ahora
</h1>
```

---

## 5️⃣ Cambiar Mensajes en Login

**Archivo:** `src/pages/Login.tsx`

**Localización:** Línea ~20-50 (JSX)

**Busca:**
```tsx
<h2 className="text-2xl font-bold text-foreground mb-2">
  Iniciar Sesión
</h2>
```

**Edita a:**
```tsx
<h2 className="text-2xl font-bold text-foreground mb-2">
  Acceder a tu Cuenta
</h2>
```

---

## 6️⃣ Agregar un Nuevo Parking a la Lista

**Archivo:** `src/components/features/MapView.tsx`

**Localización:** Línea ~26-70 (array `parkingSpots`)

**Haz esto:**
1. Encuentra el array `const parkingSpots = [`
2. Ve al final del último objeto (antes del `]`)
3. Añade una coma y un nuevo objeto:

```tsx
{
  id: 7,
  name: 'Tu Nuevo Parking',
  location: 'Tu Ubicación',
  city: 'Tu Ciudad',
  price: 3.5,
  rating: 4.5,
  reviews: 23,
  distance: 0.5,
  lat: 28.4682,
  lng: -16.2546,
  type: 'Descubierta',
  verified: true,
  image: 'https://images.unsplash.com/photo-1...',
},
```

---

## 7️⃣ Cambiar el Flujo de Navegación

**Archivo:** `src/App.tsx`

**Actual:**
```tsx
const [currentPage, setCurrentPage] = useState<Page>('login');
```

Para cambiar que la página inicial sea Home:
```tsx
const [currentPage, setCurrentPage] = useState<Page>('home');
```

---

## 8️⃣ Crear un Nuevo Botón en Home

**Archivo:** `src/pages/Home.tsx`

**Localización:** Donde quieras agregar el botón (ej: después de otro botón)

**Código:**
```tsx
import { Button } from '../components/ui';

// Dentro del JSX:
<Button 
  variant="primary" 
  fullWidth 
  onClick={() => onNavigate('map', {})}
>
  Mi Nuevo Botón
</Button>
```

---

## 9️⃣ Cambiar Logo/Nombre de la App

**Archivo:** `src/pages/Login.tsx` (línea ~25-30)

**Busca:**
```tsx
<h1 className="ml-3 text-3xl font-bold text-foreground">Parky</h1>
```

**Cambia a:**
```tsx
<h1 className="ml-3 text-3xl font-bold text-foreground">Mi App</h1>
```

Repite en:
- `src/pages/Home.tsx`
- `src/pages/SignUp.tsx`
- `src/components/features/MapView.tsx`

---

## 🔟 Cambiar Icono (del Logo)

**Archivo:** Cualquier página que uses icono

**Actual:**
```tsx
import { Car } from 'lucide-react';

<Car className="h-8 w-8 text-white" />
```

**Cambiar a otro icono:**
```tsx
import { MapPin } from 'lucide-react';  // ← Otro icono

<MapPin className="h-8 w-8 text-white" />
```

**Iconos disponibles:**
- `Car`, `MapPin`, `Calendar`, `Clock`, `Star`, `Shield`, `Lock`, `Mail`, `User`, `LogOut`, `Menu`, `Search`, `CreditCard`, etc.

Ver todos en: https://lucide.dev

---

## 📋 Checklist Post-Edición

Cada vez que edites, ejecuta:

```bash
# 1. Compila para detectar errores
npm run build

# 2. Si la compilación es OK:
npm run dev

# 3. Abre http://localhost:3000 y prueba
```

**Si hay error:**
- Lee el mensaje en la terminal
- Verifica que NO hayas borrado `;` ni `}` accidentalmente
- Busca la línea del error en el archivo

---

## 🎨 Tabla Rápida de Rutas por Archivo

| Tarea | Archivo | Línea (aprox.) |
|-------|---------|---|
| Cambiar parking | MapView.tsx | 26-70 |
| Cambiar Home | Home.tsx | 40-160 |
| Cambiar Login | Login.tsx | 20-50 |
| Cambiar SignUp | SignUp.tsx | 20-70 |
| Cambiar colores | globals.css | 12-20 |
| Cambiar navegación | App.tsx | 18-60 |
| Agregar botón | Home.tsx | Donde quieras |

---

## ⚠️ Errores Comunes

| Problema | Solución |
|----------|----------|
| "Cannot find module" | Verifica que el import sea correcto |
| "Property does not exist" | Revisa que escribiste bien el nombre |
| Página en blanco | Abre F12, busca errores en console |
| Estilos no aplican | Recarga la página (F5 o Cmd+R) |
| "Unexpected token" | Probablemente olvidaste una `;` o `}` |

---

