# 🗺️ Personalizar el Estilo del Mapa - Guía Completa

## 📍 Opciones Disponibles

Tu mapa usa **Leaflet** con **OpenStreetMap**. Tienes varias opciones para personalizarlo:

---

## 1️⃣ Cambiar el Proveedor de Mapas (TileLayer)

### Opción A: OpenStreetMap (Actual)
```tsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
```
- ✅ Gratuito
- ✅ Sin API key
- ❌ Aspecto básico

### Opción B: OpenStreetMap - Tema Oscuro
```tsx
<TileLayer
  url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
/>
```
- ✅ Más detallado que OSM estándar
- ✅ Gratuito
- ✅ Mejor para ciclismo y transporte

### Opción C: Stamen Toner (Minimalista - Blanco y Negro)
```tsx
<TileLayer
  url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"
/>
```
- ✅ Aspecto limpio y profesional
- ✅ Excelente para negocios
- ⚠️ Requiere atribución

### Opción D: Stamen Toner Lite (Minimalista - Gris)
```tsx
<TileLayer
  url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
/>
```
- ✅ Muy limpio
- ✅ No abruma la UI

### Opción E: CartoDB Positron (Profesional)
```tsx
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>
```
- ✅ Aspecto moderno y profesional
- ✅ Colores suaves
- ✅ Muy legible

### Opción F: CartoDB Voyager (Detallado)
```tsx
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/rastered/voyager/{z}/{x}/{y}{r}.png"
/>
```
- ✅ Muy detallado
- ✅ Colores naturales
- ✅ Excelente para presentaciones

### Opción G: Tema Oscuro (DarkMatter)
```tsx
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>
```
- ✅ Para modo oscuro
- ✅ Muy elegante
- ✅ Fondo oscuro

---

## 2️⃣ Personalizar Estilos del MapContainer

### Cambiar Colores del Fondo
```tsx
<MapContainer
  center={[28.4682, -16.2546]}
  zoom={14}
  className="w-full h-full z-0 bg-gray-100"  // ← Añade color de fondo
>
```

### Añadir Borde Redondeado
```tsx
<MapContainer
  center={[28.4682, -16.2546]}
  zoom={14}
  className="w-full h-full z-0 rounded-lg shadow-lg"  // ← Con sombra y esquinas redondeadas
>
```

### Ejemplos Completos

**Mapa Limpio y Minimalista:**
```tsx
<MapContainer
  center={[28.4682, -16.2546]}
  zoom={14}
  className="w-full h-full z-0 rounded-xl shadow-md"
>
```

**Mapa con Efecto de Profundidad:**
```tsx
<MapContainer
  center={[28.4682, -16.2546]}
  zoom={14}
  className="w-full h-full z-0 rounded-2xl shadow-2xl"
>
```

**Mapa Cuadrado (Sin Redondeado):**
```tsx
<MapContainer
  center={[28.4682, -16.2546]}
  zoom={14}
  className="w-full h-full z-0 shadow-lg"
>
```

---

## 3️⃣ Personalizar Marcadores (Pines)

### Cambiar Tamaño
En la función `createParkingPinIcon`:

```tsx
// Más grande
iconSize: [48, 48],     // De 36x36 a 48x48
iconAnchor: [24, 48],   // Actualizar punto de anclaje

// Más pequeño
iconSize: [24, 24],
iconAnchor: [12, 24],
```

### Cambiar el Icono (Usar un Emoji)
```tsx
function createParkingPinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        font-size: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        🅿️
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })
}
```

### Usar un Icono Personalizado
```tsx
function createParkingPinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 14 8 14s8-8.75 8-14c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  })
}
```

### Cambiar Color del Pin (Ya Funciona)
El color del pin ya se actualiza automáticamente según `--primary` en tu CSS.

Para cambiar el color en globals.css:
```css
:root {
  --primary: #ce2c10;  /* Cambia este color */
}
```

---

## 4️⃣ Personalizar Popup (Información en el Pin)

### Popup Actual
```tsx
<Popup>
  <p className="font-semibold">{spot.name}</p>
  <p>{spot.price}€/hora</p>
</Popup>
```

### Popup Mejorado con Más Información
```tsx
<Popup>
  <div className="w-48">
    <h3 className="font-bold text-lg mb-2">{spot.name}</h3>
    <p className="text-sm text-gray-600 mb-2">{spot.location}</p>
    <div className="flex justify-between mb-2">
      <span className="font-semibold">{spot.price}€/hora</span>
      <span className="text-yellow-500">⭐ {spot.rating}</span>
    </div>
    <button 
      onClick={() => onSelect(spot)}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Ver Detalles
    </button>
  </div>
</Popup>
```

### Popup Minimalista
```tsx
<Popup>
  <span className="text-sm font-medium">{spot.name} • {spot.price}€</span>
</Popup>
```

### Popup Personalizado con Imagen
```tsx
<Popup>
  <div className="w-56">
    <img 
      src={spot.image} 
      alt={spot.name}
      className="w-full h-32 object-cover rounded"
    />
    <h3 className="font-bold mt-2">{spot.name}</h3>
    <p className="text-sm text-gray-600">{spot.location}</p>
    <p className="font-semibold mt-2">{spot.price}€/hora</p>
  </div>
</Popup>
```

---

## 5️⃣ Ejemplo Completo - Mapa Personalizado

```tsx
// @ts-nocheck
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

function getPrimaryColor(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim()
}

function createParkingPinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="${color}"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); transition: all 0.3s;"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  })
}

export function ParkingMap({ spots, onSelect }: any) {
  const [primaryColor, setPrimaryColor] = useState<string>(getPrimaryColor())
  const [parkingPinIcon, setParkingPinIcon] = useState(createParkingPinIcon(primaryColor))

  useEffect(() => {
    const initialColor = getPrimaryColor()
    setPrimaryColor(initialColor)
    setParkingPinIcon(createParkingPinIcon(initialColor))

    let lastColor = initialColor
    
    const observer = new MutationObserver(() => {
      const newColor = getPrimaryColor()
      if (newColor !== lastColor) {
        console.log('🎨 Color actualizado a:', newColor)
        lastColor = newColor
        setPrimaryColor(newColor)
        setParkingPinIcon(createParkingPinIcon(newColor))
      }
    })

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false,
    })

    return () => observer.disconnect()
  }, [])

  return (
    <MapContainer
      center={[28.4682, -16.2546]}
      zoom={14}
      className="w-full h-full z-0 rounded-2xl shadow-xl"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {spots.map((spot: any) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={parkingPinIcon}
          eventHandlers={{
            click: () => onSelect(spot),
          }}
        >
          <Popup>
            <div className="w-56">
              <h3 className="font-bold text-base mb-1">{spot.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{spot.location}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{spot.price}€/h</span>
                <span className="text-yellow-500 text-sm">⭐ {spot.rating}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
```

---

## 🎨 Tabla de Temas Recomendados

| Tema | URL | Aspecto | Ideal Para |
|------|-----|--------|-----------|
| **OpenStreetMap** | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` | Colorido | Mapas generales |
| **CartoDB Light** | `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png` | Limpio y profesional | Aplicaciones modernas |
| **CartoDB Dark** | `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` | Oscuro y elegante | Modo oscuro |
| **Stamen Toner** | `https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png` | Blanco y negro | Minimalista |
| **CartoDB Voyager** | `https://{s}.basemaps.cartocdn.com/rastered/voyager/{z}/{x}/{y}{r}.png` | Detallado | Presentaciones |

---

## 🎯 Pasos para Cambiar el Estilo

### 1. Cambiar el TileLayer
Edita `src/components/features/ParkingMap.tsx`:

```tsx
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>
```

### 2. Cambiar Estilos del Contenedor
Añade clases Tailwind al `<MapContainer>`:

```tsx
className="w-full h-full z-0 rounded-2xl shadow-xl"
```

### 3. Personalizar Pines
Modifica la función `createParkingPinIcon()`:

```tsx
// Cambiar tamaño
iconSize: [42, 42],
iconAnchor: [21, 42],

// O cambiar el icono completamente
```

### 4. Personalizar Popup
Edita el JSX dentro de `<Popup>`:

```tsx
<Popup>
  {/* Tu contenido personalizado aquí */}
</Popup>
```

---

## 💡 Consejos de Diseño

✅ **Mapa Limpio:**
- Usa CartoDB Light + Pines grandes + Popup minimalista

✅ **Mapa Profesional:**
- Usa Stamen Toner + Pines pequeños + Popup detallado

✅ **Mapa Moderno:**
- Usa CartoDB Light + Bordes redondeados + Sombra grande

✅ **Mapa Oscuro:**
- Usa CartoDB Dark + Pines claros + Popup elegante

---

## 🔗 Referencias

- **Leaflet Docs:** https://leafletjs.com/
- **CartoDB Tiles:** https://carto.com/basemaps/
- **Stamen Maps:** https://stadiamaps.com/
- **TailwindCSS Classes:** https://tailwindcss.com/docs

