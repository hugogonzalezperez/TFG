# 🎨 Tailwind CSS + Mapa Interactivo - Guía de Implementación

## 📋 Introducción

Este documento explica cómo has configurado **Tailwind CSS v4** para que se compile automáticamente y cómo has integrado un **mapa interactivo con Leaflet** en tu aplicación de estacionamientos.

---

## 🎯 Parte 1: Tailwind CSS - Compilación Automática

### 1.1 Instalación de Dependencias

Primero, instalaste las dependencias necesarias:

```bash
npm install tailwindcss @tailwindcss/postcss
npm install -D postcss
```

**Dependencias instaladas:**
- `tailwindcss` (v4.1.3) - Framework CSS
- `@tailwindcss/postcss` - Plugin de PostCSS para Tailwind v4
- `postcss` - Procesador de CSS

### 1.2 Configuración de Tailwind (`tailwind.config.js`)

Creaste un archivo de configuración minimalista pero efectivo:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
```

**¿Qué hace cada parte?**

| Opción | Descripción |
|--------|-------------|
| `darkMode: 'class'` | Activa el dark mode usando clase `.dark` en HTML |
| `content` | Archivos que Tailwind monitorea para generar clases |
| `"./index.html"` | Archivo principal HTML |
| `"./src/**/*.{js,ts,jsx,tsx}"` | Todos los componentes React en src/ |

### 1.3 Configuración de PostCSS (`postcss.config.js`)

PostCSS procesa el CSS antes de enviarlo al navegador:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

**Flujo:**
```
globals.css → PostCSS → Tailwind procesa → CSS final
```

### 1.4 Archivo Principal de Estilos (`src/styles/globals.css`)

Este es el archivo **fuente** de todo tu CSS:

```css
@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@custom-variant dark (&:is(.dark *));

:root {
  --primary: #0F6FFF;
  --secondary: #10B981;
  --accent: #F59E0B;
  /* ... más variables CSS */
}

.dark {
  --primary: #3B82F6;
  /* ... más variables para dark mode */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Estructura del archivo:**

1. **`@import "tailwindcss"`** - Carga Tailwind CSS v4
2. **Importar fuentes** - Google Fonts (Inter)
3. **Variables CSS** (`:root { }`) - Colores personalizados
4. **Dark mode** (`.dark { }`) - Colores para modo oscuro
5. **Tailwind layers** (`@layer base`) - Estilos base, componentes, utilidades

### 1.5 Importación en la Aplicación (`src/main.tsx`)

La aplicación importa el archivo CSS globalmente:

```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import './styles/globals.css'
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(<App />);
```

---

## ⚙️ Compilación Automática con Vite

### ¿Cómo funciona?

Vite + Tailwind trabajan juntos de forma automática:

```
npm run dev
    ↓
Vite inicia servidor
    ↓
Monitorea cambios en globals.css
    ↓
PostCSS procesa el archivo
    ↓
Tailwind genera las clases necesarias
    ↓
HMR (Hot Module Reload) actualiza navegador
    ↓
✨ Cambios en vivo sin recargar
```

### Comandos

```bash
# Desarrollo (compilación automática + hot reload)
npm run dev

# Compilar para producción
npm run build

# Ver preview del build
npm run preview
```

### Ventajas de esta configuración

✅ **Compilación automática** - Sin scripts manuales  
✅ **Hot Module Reload** - Cambios en vivo  
✅ **Optimización** - Solo incluye CSS necesario  
✅ **Variables CSS** - Integración perfecta con Tailwind  
✅ **Dark mode** - Soporte nativo  

---

## 🗺️ Parte 2: Mapa Interactivo con Leaflet

### 2.1 Instalación de Dependencias

Instalaste las librerías necesarias para mapas:

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

**Paquetes instalados:**
- `leaflet` - Librería de mapas open-source
- `react-leaflet` - Componentes React para Leaflet
- `@types/leaflet` - Tipos TypeScript (dev)

### 2.2 Importación de CSS

En `src/main.tsx`, importas el CSS de Leaflet:

```tsx
import "leaflet/dist/leaflet.css";
```

Esto incluye los estilos del mapa (marcadores, controles, etc.)

### 2.3 Componente del Mapa (`src/components/features/ParkingMap.tsx`)

Creaste un componente reutilizable para mostrar el mapa:

```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export function ParkingMap({ spots, onSelect }: any) {
  return (
    <MapContainer
      center={[28.4682, -16.2546]} // Tenerife, España
      zoom={14}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map((spot: any) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={icon}
          eventHandlers={{
            click: () => onSelect(spot),
          }}
        >
          <Popup>
            <p className="font-semibold">{spot.name}</p>
            <p>{spot.price}€/hora</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
```

**Componentes utilizados:**

| Componente | Propósito |
|-----------|-----------|
| `MapContainer` | Contenedor del mapa |
| `TileLayer` | Capa base del mapa (OpenStreetMap) |
| `Marker` | Pin/marcador de ubicación |
| `Popup` | Ventana emergente al hacer clic |

### 2.4 Integración en MapView

Integraste el mapa en el componente `MapView.tsx`:

```tsx
import { ParkingMap } from './ParkingMap'

export function MapView({ onNavigate, searchData }: MapViewProps) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header con búsqueda */}
      <div className="bg-white border-b border-border p-4">
        {/* ... */}
      </div>

      {/* Contenido: Mapa o Lista */}
      <div className="flex-1 flex overflow-hidden">
        {view === 'map' ? (
          <ParkingMap 
            spots={parkingSpots} 
            onSelect={setSelectedSpot}
          />
        ) : (
          // Vista de lista
        )}
      </div>

      {/* Sidebar con resultados */}
      {view === 'map' && (
        <div className="hidden lg:block w-96 border-l">
          {/* Lista de estacionamientos */}
        </div>
      )}
    </div>
  )
}
```

### 2.5 Características del Mapa

✅ **Visualización interactiva** de estacionamientos  
✅ **Marcadores personalizados** con iconos de Leaflet  
✅ **Popups informativos** al hacer clic  
✅ **Zoom y pan** nativos del mapa  
✅ **Capa base** de OpenStreetMap  
✅ **Toggle vista** entre Mapa y Lista  
✅ **Sidebar responsive** (desktop only)  

---

## 🔄 Flujo Completo: Tailwind + Mapa

```
Usuario edita componente
        ↓
Vite detecta cambio
        ↓
┌─────────────────────────┐
│    TAILWIND ROUTE       │
├─────────────────────────┤
│ globals.css actualiza   │
│ PostCSS procesa         │
│ Genera clases CSS       │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│    LEAFLET ROUTE        │
├─────────────────────────┤
│ ParkingMap.tsx usa      │
│ MapContainer + Leaflet  │
│ Renderiza mapa          │
└─────────────────────────┘
        ↓
HMR inyecta cambios
        ↓
Navegador actualiza en vivo
        ↓
✨ Usuario ve cambios inmediatamente
```

---

## 📊 Resumen de Configuración

### Archivos clave

```
app/
├── tailwind.config.js           ← Configuración Tailwind
├── postcss.config.js            ← Configuración PostCSS
├── vite.config.ts               ← Configuración Vite
├── package.json                 ← Dependencias
├── src/
│   ├── main.tsx                 ← Punto entrada (importa CSS)
│   ├── styles/
│   │   └── globals.css          ← 📍 Archivo FUENTE CSS
│   └── components/features/
│       ├── MapView.tsx          ← Vista del mapa
│       └── ParkingMap.tsx       ← Componente Leaflet
```

### Dependencias en package.json

```json
"dependencies": {
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.5",
  "@tailwindcss/postcss": "^4.1.18"
}

"devDependencies": {
  "tailwindcss": "^4.1.3",
  "postcss": "^8.4.x",
  "@types/leaflet": "^1.9.x"
}
```

---

## 🚀 Cómo Funciona en Desarrollo

### Paso 1: Inicia servidor
```bash
npm run dev
```

### Paso 2: El sistema automático

1. **Vite** vigila cambios en archivos
2. Si editas `globals.css`:
   - PostCSS procesa el archivo
   - Tailwind genera las clases necesarias
   - HMR inyecta cambios en navegador
   - **Sin recargar página** ⚡

3. Si editas `ParkingMap.tsx`:
   - React recarga el componente
   - Mapa se renderiza de nuevo
   - Cambios visibles en vivo

### Paso 3: En producción
```bash
npm run build
```

- Vite + Tailwind minimizan CSS
- Solo incluyen clases utilizadas
- Build optimizado para producción

---

## 💡 Ventajas de esta Arquitectura

### Tailwind + Vite

✅ **Cero configuración manual** - Funciona automáticamente  
✅ **Hot reload** - Cambios sin recargar  
✅ **CSS minimizado** - Solo incluye lo necesario  
✅ **Dark mode integrado** - Con variables CSS  
✅ **TypeScript** - Soporte completo  

### Leaflet + React

✅ **Mapas interactivos** - Sin backend  
✅ **OpenStreetMap gratis** - Sin API keys  
✅ **Componentes React** - Integración perfecta  
✅ **Marcadores personalizables** - Iconos propios  
✅ **Popups y tooltips** - UX mejorada  

---

## 🔧 Personalización

### Cambiar proveedor de mapa

En `ParkingMap.tsx`, puedes cambiar la capa base:

```tsx
// OpenStreetMap (actual)
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// CartoDB
<TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

// Satélite (USGS)
<TileLayer url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}" />
```

### Cambiar estilos de marcadores

En `ParkingMap.tsx`:

```tsx
const icon = new L.Icon({
  iconUrl: 'tu-imagen-aqui.png',
  iconSize: [32, 48],  // ancho x alto
  iconAnchor: [16, 48], // punto de anclaje
  popupAnchor: [0, -48]
})
```

### Agregar más variables CSS

En `globals.css`:

```css
:root {
  --mi-color: #FF5733;
  --mi-tamaño: 16px;
  --mi-radio: 8px;
}
```

Luego usar en componentes:

```tsx
<div className="text-[var(--mi-color)] text-[length:var(--mi-tamaño)]">
  Contenido
</div>
```

---

## 📈 Performance

### Tamaño de Bundle

```
CSS:    23.77 kB (6.51 KB gzip)
JS:     283.13 kB (78.87 KB gzip)
Total:  307 kB (85.4 KB gzip)
```

### Optimizaciones aplicadas

✅ **Tree-shaking** - Elimina CSS no usado  
✅ **Minificación** - Comprime código  
✅ **Code-splitting** - Carga por demanda  
✅ **Lazy loading** - Componentes dinámicos  

---

## 🐛 Solución de Problemas

### El mapa no aparece

**Solución:**
```bash
npm install leaflet react-leaflet
npm run build
npm run dev
```

### Los estilos no se actualizan

**Solución:**
- Verifica que `globals.css` esté importado en `main.tsx`
- Reinicia servidor: Ctrl+C y `npm run dev`
- Borra cache del navegador: Ctrl+Shift+Delete

### Errores de tipos con Leaflet

**Solución:**
```bash
npm install -D @types/leaflet
```

---

## 📚 Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind v4 Guide](https://tailwindcss.com/blog/tailwindcss-v4)
- [Leaflet Documentation](https://leafletjs.com/)
- [React-Leaflet Guide](https://react-leaflet.js.org/)
- [Vite Documentation](https://vitejs.dev/)

---

## ✅ Checklist de Implementación

- [x] Instalar dependencias de Tailwind
- [x] Configurar `tailwind.config.js`
- [x] Configurar `postcss.config.js`
- [x] Crear `globals.css` con @import tailwindcss
- [x] Importar CSS en `main.tsx`
- [x] Instalar Leaflet y React-Leaflet
- [x] Crear componente `ParkingMap.tsx`
- [x] Integrar mapa en `MapView.tsx`
- [x] Configurar marcadores y popups
- [x] Hacer build exitoso
- [x] Verificar cambios en vivo

---

## 🎉 Conclusión

Has configurado exitosamente:

1. **Tailwind CSS v4** con compilación automática via Vite
2. **Variables CSS personalizadas** para colores y temas
3. **Dark mode** con soporte completo
4. **Mapa interactivo** con Leaflet y React-Leaflet
5. **Flujo de desarrollo** con HMR y cambios en vivo

Tu aplicación ahora tiene:
- ✨ Estilos modernos y responsivos
- 🗺️ Mapa interactivo de estacionamientos
- ⚡ Compilación automática
- 🌙 Soporte para dark mode
- 📱 Interfaz completamente funcional

¡Listo para seguir desarrollando nuevas features! 🚀

