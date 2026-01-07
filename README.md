# 🅿️ Parky - Marketplace de Aparcamiento

Aplicación web moderna para buscar, reservar y gestionar plazas de aparcamiento en Tenerife.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ (npm incluido)

### Instalación

1. **Clonar o descargar el proyecto**
```bash
cd /home/hugo/TFG/app
```

2. **Instalar dependencias**
```bash
npm i
```

3. **Arrancar servidor de desarrollo**
```bash
npm run dev
```
El servidor estará disponible en `http://localhost:3001/` (o el puerto disponible siguiente)

4. **Compilar para producción**
```bash
npm run build
```
La compilación se guardará en `app/build/`

---

## � Documentación y Recursos

### 🎯 Para Elegir Qué Hacer Primero
- **[LEARNING_PATH.md](./app/Docs/LEARNING_PATH.md)** - Plan de aprendizaje con opciones por dificultad
- **[NEXT_STEPS.md](./app/Docs/NEXT_STEPS.md)** - 5 niveles de mejoras (desde personalización hasta API real)

### 🧪 Para Verificar que Todo Funciona
- **[TESTING.md](./app/Docs/TESTING.md)** - Checklist de pruebas de navegación paso a paso

### ⚡ Para Cambios Rápidos
- **[QUICK_REFERENCE.md](./app/Docs/QUICK_REFERENCE.md)** - Qué archivo editar para cada tarea común

### 📊 Para Entender el Proyecto
- **[PROJECT_STATUS.md](./app/Docs/PROJECT_STATUS.md)** - Estado técnico detallado
- **[GETTING_STARTED.md](./app/Docs/GETTING_STARTED.md)** - Resumen ejecutivo del proyecto

### 🛠️ Para Crear Componentes
- **[src/components/README.md](./app/src/components/README.md)** - Guía detallada de estructura y creación

---

## �📁 Estructura del Proyecto

```
app/
├── src/
│   ├── components/          # Componentes React (UI + Features)
│   │   ├── ui/              # Componentes primitivos reutilizables
│   │   ├── features/        # Componentes con lógica compleja
│   │   ├── common/          # Componentes globales (reservado)
│   │   ├── layout/          # Layouts de página (reservado)
│   │   └── README.md        # 📖 Guía detallada de componentes
│   │
│   ├── pages/               # Páginas principales (rutas)
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── SignUp.tsx
│   │
│   ├── styles/              # Estilos globales
│   │   └── globals.css
│   │
│   ├── App.tsx              # Componente raíz con enrutamiento
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
│
├── index.html               # HTML base
├── vite.config.ts           # Configuración de Vite
├── package.json             # Dependencias y scripts
└── README.md                # Este archivo
```

### 📖 Leer la Guía de Componentes

Para entender cómo crear nuevos componentes y páginas, **lee este archivo primero:**

👉 **[`src/components/README.md`](./app/src/components/README.md)**

En ese archivo encontrarás:
- ✅ Explicación detallada de cada carpeta
- ✅ Cómo crear componentes UI (primitivos)
- ✅ Cómo crear componentes Feature (con lógica)
- ✅ Cómo crear nuevas páginas
- ✅ Convenciones de código
- ✅ Checklist antes de hacer commit

---

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Type safety
- **Vite** - Bundler rápido
- **Tailwind CSS** - Estilos utilitarios

### Componentes UI
- **Radix UI** - Componentes sin estilos accesibles
- **class-variance-authority** - Manejo de variantes CSS
- **lucide-react** - Iconos SVG
- **Tailwind Merge** - Merge inteligente de clases

### Librerías Adicionales
- **react-hook-form** - Manejo de formularios
- **sonner** - Notificaciones (toasts)
- **recharts** - Gráficos
- **embla-carousel** - Carruseles

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |

---

## 🚀 Flujo de Desarrollo

### 1. Crear un Componente UI Nuevo
```bash
# Crear archivo en src/components/ui/
# Ejemplo: src/components/ui/my-component.tsx

# Luego, exportarlo en src/components/ui/index.ts
# export * from './my-component';
```

### 2. Crear un Componente Feature Nuevo
```bash
# Crear archivo en src/components/features/
# Ejemplo: src/components/features/MyFeature.tsx

# Usar componentes del ui/ dentro de él
import { Button, Card, Input } from '../ui';
```

### 3. Crear una Nueva Página
```bash
# Crear archivo en src/pages/
# Ejemplo: src/pages/MyPage.tsx

# Registrar en src/App.tsx en el switch del renderPage()
```

Para instrucciones **paso a paso detalladas**, consulta [`src/components/README.md`](./app/src/components/README.md).

---

## 🎯 Estructura de Componentes (Resumen Rápido)

### Carpeta `ui/` - Componentes Primitivos
Bloques básicos SIN lógica de negocio, altamente reutilizables.

**Ejemplos:** Button, Input, Card, Badge, Checkbox, etc.

```tsx
import { Button, Input, Card } from '../components/ui';

<Button variant="primary">Click</Button>
<Input type="email" placeholder="..." />
<Card><p>Contenido</p></Card>
```

### Carpeta `features/` - Componentes Complejos
Componentes CON lógica de negocio específica.

**Ejemplos:** BookingProcess, MapView, ParkingDetail, UserProfile, OwnerProfile

```tsx
import { BookingProcess } from '../components/features/BookingProcess';

<BookingProcess onNavigate={handleNav} parkingData={data} />
```

---

## 🐛 Troubleshooting

### El proyecto no compila
```bash
# 1. Verifica que las importaciones sean correctas
npm run build

# 2. Limpia node_modules
rm -rf node_modules package-lock.json
npm i

# 3. Reinicia el servidor de desarrollo
npm run dev
```

### Puerto 3000 en uso
El servidor Vite intenta automáticamente otro puerto (ej: 3001). Si quieres especificar:
```bash
npm run dev -- --port 5173
```

### Errores de TypeScript
```bash
# Verifica que TypeScript esté correcto:
npm run build
```

---

## 📝 Convenciones Importantes

### Nombres de Archivos
- **`ui/` componentes:** minúsculas con guiones (`my-button.tsx`)
- **`features/` componentes:** PascalCase (`BookingProcess.tsx`)
- **Páginas:** PascalCase (`Home.tsx`)

### Importaciones Relativas
- Desde páginas a componentes: `import { Button } from '../components/ui';`
- Desde features a ui: `import { Button } from '../ui';`
- Desde ui a utils: `import { cn } from './utils';`

### Props y TypeScript
```tsx
interface MyComponentProps {
  // Datos
  title: string;
  
  // Callbacks
  onNavigate: (page: string) => void;
  onSelect?: (id: number) => void;
  
  // Opcionales
  disabled?: boolean;
  className?: string;
}
```

---

## 🎓 Ejemplos Completos

### Crear un Componente UI Nuevo: Contador

```tsx
// src/components/ui/counter.tsx
import * as React from "react";
import { Button } from "./button";
import { cn } from "./utils";

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

export function Counter({
  initialValue = 0,
  onValueChange,
  className,
  ...props
}: CounterProps) {
  const [count, setCount] = React.useState(initialValue);

  const handleIncrement = () => {
    const newValue = count + 1;
    setCount(newValue);
    onValueChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = count - 1;
    setCount(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Button variant="outline" onClick={handleDecrement}>-</Button>
      <span className="w-8 text-center font-semibold">{count}</span>
      <Button variant="outline" onClick={handleIncrement}>+</Button>
    </div>
  );
}
```

Luego exportar en `src/components/ui/index.ts`:
```typescript
export * from './counter';
```

### Crear un Feature Component: Stock de Plazas

```tsx
// src/components/features/ParkingStock.tsx
import { useState } from 'react';
import { Card, Badge, Counter } from '../ui';

interface ParkingStockProps {
  parkingId: number;
  initialSpots: number;
  onReserve: (parkingId: number, spots: number) => void;
}

export function ParkingStock({
  parkingId,
  initialSpots,
  onReserve,
}: ParkingStockProps) {
  const [spotsToReserve, setSpotsToReserve] = useState(1);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Plazas disponibles</h3>
        <Badge>{initialSpots}</Badge>
      </div>

      <Counter
        initialValue={1}
        onValueChange={setSpotsToReserve}
      />

      <button
        onClick={() => onReserve(parkingId, spotsToReserve)}
        className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-md"
      >
        Reservar {spotsToReserve} {spotsToReserve === 1 ? 'plaza' : 'plazas'}
      </button>
    </Card>
  );
}
```

---

## 🔐 Próximas Mejoras

- [ ] **Tests Unitarios** - Agregar vitest para componentes `ui/`
- [ ] **Storybook** - Documentación visual de componentes
- [ ] **API Integration** - Conectar con backend real
- [ ] **State Management** - Implementar Zustand/Redux si es necesario
- [ ] **CI/CD** - GitHub Actions para testing automático
- [ ] **E2E Tests** - Playwright para pruebas de flujo completo

---

## 📞 Ayuda y Contacto

Para dudas sobre la estructura o cómo agregar componentes, **revisa primero** [`src/components/README.md`](./app/src/components/README.md).

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.

---

**¡Listo para empezar a desarrollar!** 🎉

Recuerda: **Orden, claridad y escalabilidad** son las claves. 🚀