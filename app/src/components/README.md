# 📁 Estructura de Componentes

Este directorio contiene todos los componentes React del proyecto, organizados en carpetas semánticas y profesionales para facilitar la escalabilidad y mantenimiento.

## 📊 Estructura de Carpetas

```
src/components/
├── ui/                    # Componentes primitivos y reutilizables
│   ├── button.tsx        # Botón genérico con variantes
│   ├── input.tsx         # Input de formulario
│   ├── label.tsx         # Etiqueta para formularios
│   ├── card.tsx          # Contenedor genérico con subtítulos
│   ├── badge.tsx         # Badge con variantes
│   ├── checkbox.tsx      # Checkbox (input booleano)
│   ├── textarea.tsx      # Área de texto multilinea
│   ├── switch.tsx        # Toggle/Switch
│   ├── avatar.tsx        # Avatar de usuario
│   ├── tabs.tsx          # Pestañas/Tabs
│   ├── utils.ts          # Funciones utilidad (cn, merge estilos)
│   └── index.ts          # Barrel export (simplifica imports)
│
├── features/              # Componentes complejos y específicos de funcionalidades
│   ├── BookingProcess.tsx      # Flujo de reserva de parking
│   ├── MapView.tsx             # Vista de mapa con parkings
│   ├── ParkingDetail.tsx       # Detalle de una plaza de parking
│   ├── UserProfile.tsx         # Perfil del usuario
│   └── OwnerProfile.tsx        # Panel de propietario
│
├── common/                # Componentes comunes reutilizables (opcional)
│   └── (reservado para Header, Footer, Navbar, etc.)
│
├── layout/                # Componentes de layout y estructura (opcional)
│   └── (reservado para MainLayout, PageLayout, etc.)
│
└── README.md              # Este archivo
```

## 🎯 Definición de Cada Carpeta

### `ui/` - Componentes Primitivos (Reutilizables)
Son bloques básicos de construcción, **sin lógica de negocio**. Se usan en múltiples lugares.

**Características:**
- No tienen estado (en su mayoría)
- Reciben props simples (texto, variantes, callbacks)
- Cero dependencias de negocio
- Altamente reutilizables

**Ejemplos:**
```tsx
<Button variant="primary" size="lg">Click aquí</Button>
<Input type="email" placeholder="tu@email.com" />
<Card>
  <CardContent>Contenido</CardContent>
</Card>
```

### `features/` - Componentes Complejos (Específicos de Funcionalidad)
Son componentes **con lógica de negocio** específicos de funcionalidades.

**Características:**
- Contienen estado (useState, manejo de datos)
- Utilizan múltiples componentes `ui/`
- Implementan flujos de usuario específicos
- Pueden hacer llamadas a API (en el futuro)

**Ejemplos:**
- `BookingProcess.tsx`: Maneja todo el flujo de reserva
- `MapView.tsx`: Integra mapa + lista de parkings + búsqueda
- `ParkingDetail.tsx`: Detalle completo de un parking

### `common/` - Componentes Comunes (Uso Global)
*Carpeta reservada para el futuro.* Cuando tengas componentes que aparecen en varias páginas:
- Headers/Navbars
- Footers
- Barras laterales
- Modales globales

### `layout/` - Componentes de Estructura
*Carpeta reservada para el futuro.* Para layouts principales:
- `MainLayout`: Layout principal con header/footer
- `PageLayout`: Layout de página con sidebar

---

## 🚀 Cómo Agregar Nuevos Componentes

### Paso 1: Decidir la Ubicación

**¿Es un componente primitivo reutilizable?**
→ Colócalo en `src/components/ui/`

**¿Es lógica de negocio compleja?**
→ Colócalo en `src/components/features/`

**¿Es compartido por varias páginas?**
→ Considera `src/components/common/` (cuando crezca el proyecto)

### Paso 2: Crear el Componente

#### Ejemplo: Crear un Componente Primitivo (Button en `ui/`)

```tsx
// src/components/ui/my-button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border bg-background hover:bg-accent",
      },
      size: {
        default: "h-9 px-4",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface MyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);

MyButton.displayName = "MyButton";

export { MyButton, buttonVariants };
```

#### Ejemplo: Crear un Componente de Funcionalidad (Feature)

```tsx
// src/components/features/SearchParkings.tsx
import { useState } from 'react';
import { Button, Input, Card } from '../ui';

interface SearchParkingsProps {
  onSelectParking: (parkingId: number) => void;
}

export function SearchParkings({ onSelectParking }: SearchParkingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Lógica de búsqueda aquí
    console.log('Buscando:', searchTerm);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar parkings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
      {/* Mostrar resultados */}
    </Card>
  );
}
```

### Paso 3: Exportar desde `index.ts` (Barrel)

Si creas un componente en `ui/`, añádelo a `src/components/ui/index.ts`:

```typescript
// src/components/ui/index.ts
export * from './button';
export * from './input';
export * from './my-button';  // ← Nuevo componente
export * from './card';
// ... resto
```

**Beneficio:** Ahora en lugar de escribir:
```tsx
import { MyButton } from '../ui/my-button';
```

Puedes escribir:
```tsx
import { MyButton } from '../ui';
```

### Paso 4: Usar el Componente

#### En un Feature Component:
```tsx
import { Button, Input, Card } from '../ui';
import { SearchParkings } from './SearchParkings';

export function MyFeature() {
  return (
    <div>
      <SearchParkings onSelectParking={(id) => console.log(id)} />
    </div>
  );
}
```

#### En una Página:
```tsx
import { MapView } from '../components/features/MapView';

export function Home() {
  return <MapView onNavigate={(page) => console.log(page)} />;
}
```

---

## 📝 Cómo Crear una Nueva Página

### Paso 1: Crear el archivo
```bash
# src/pages/MyPage.tsx
touch src/pages/MyPage.tsx
```

### Paso 2: Estructura básica
```tsx
import { Button, Card } from '../components/ui';

interface MyPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function MyPage({ onNavigate }: MyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mi Página</h1>
        
        <Card className="p-6">
          <Button onClick={() => onNavigate('home')}>
            Volver al Inicio
          </Button>
        </Card>
      </div>
    </div>
  );
}
```

### Paso 3: Registrar en `App.tsx`
```tsx
import { MyPage } from './pages/MyPage';

export default function App() {
  const renderPage = () => {
    // ... otros casos
    case 'my-page':
      return <MyPage onNavigate={handleNavigation} />;
  };
}
```

---

## 🎨 Convenciones de Código

### Componentes UI
- Usa `React.forwardRef` para acceso a refs cuando sea necesario
- Exporta tanto el componente como las variantes (ej: `buttonVariants`)
- Usa `class-variance-authority` para manejar variantes
- Usa `cn()` para merging de clases

### Components Features
- Usa `useState` para estado local
- Coloca tipos TypeScript (`interfaces`) al inicio
- Desestructura props en el parámetro de la función
- Incluye callbacks en props cuando sea necesario (`onNavigate`, `onSelect`, etc.)

### Nombres de Archivos
- `ui/` → nombres en **minúsculas con guiones** (ej: `input.tsx`, `my-button.tsx`)
- `features/` → nombres **PascalCase** (ej: `BookingProcess.tsx`)
- `pages/` → nombres **PascalCase** (ej: `Home.tsx`)

### Props y Types
```tsx
interface MyComponentProps {
  // Datos
  title: string;
  items: Item[];
  
  // Callbacks y handlers
  onSelect?: (id: number) => void;
  onNavigate: (page: string) => void;
  
  // Opcionales con defaults
  disabled?: boolean;
  className?: string;
}
```

---

## 🔍 Checklist: Antes de Commitar

- [ ] El componente está en la carpeta correcta (`ui/`, `features/`, etc.)
- [ ] Las importaciones relativas son correctas
- [ ] El componente está exportado en `index.ts` (si es `ui/`)
- [ ] TypeScript no muestra errores (`npm run build` pasa)
- [ ] El componente tiene una interfaz clara de props
- [ ] El nombre del archivo es coherente (minúsculas/PascalCase)
- [ ] El código sigue las convenciones de la carpeta

---

## 📚 Recursos Útiles

### Sobre clase-variance-authority (CVA)
Documentación: https://cva.style/docs

### Sobre Radix UI (librerías que usamos)
- Checkbox: https://www.radix-ui.com/docs/primitives/components/checkbox
- Tabs: https://www.radix-ui.com/docs/primitives/components/tabs
- Avatar: https://www.radix-ui.com/docs/primitives/components/avatar

### Sobre Tailwind CSS
Documentación: https://tailwindcss.com/docs

---

## ❓ Preguntas Frecuentes

**P: ¿Dónde coloco un componente modal?**
R: Si es específico de una funcionalidad → `features/MyModal.tsx`
   Si es reutilizable → `ui/modal.tsx`

**P: ¿Y si mi componente `feature` es muy grande?**
R: Divídelo en subcarpetas:
```
features/
  ├── BookingProcess/
  │   ├── index.tsx       (componente principal)
  │   ├── steps.tsx       (pasos)
  │   ├── confirmation.tsx (confirmación)
  │   └── types.ts        (types compartidos)
```

**P: ¿Puedo tener múltiples componentes en un archivo?**
R: Preferiblemente **no**. Un componente = un archivo. Excepto cuando son muy pequeños y relacionados (ej: `Card.tsx` que contiene `Card`, `CardHeader`, `CardContent`).

---

## 🚀 Próximos Pasos

1. **Tests**: Añadir vitest/jest para componentes `ui/`
2. **Storybook**: Documentar componentes `ui/` visualmente
3. **API Layer**: Crear `src/services/` para llamadas HTTP
4. **State Management**: Si necesitas Redux/Zustand, crear `src/store/`

---

**¡Listo! Ahora estás preparado para agregar componentes de manera profesional y escalable.** 🎉
