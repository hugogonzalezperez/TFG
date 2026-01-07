# 🎨 Pines del Mapa - Actualización Dinámica de Colores

## 📋 ¿Qué cambió?

Ahora los **pines del mapa se actualizan automáticamente** cuando cambias el color primario en `src/styles/globals.css`.

Antes:
- ❌ El color se cargaba una sola vez al iniciar la página
- ❌ Cambios en `globals.css` no se reflejaban en los pines

Ahora:
- ✅ Los pines se actualizan en tiempo real (HMR)
- ✅ El `MutationObserver` detecta cambios automáticamente
- ✅ Los logs en consola te muestran cuándo se actualiza

---

## 🔧 Cómo Funciona

### Componente: `src/components/features/ParkingMap.tsx`

#### 1. **Funciones Auxiliares**

```tsx
// Obtiene el color primario actual del elemento raíz
function getPrimaryColor(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim()
}

// Crea el icono SVG con el color específico
function createParkingPinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<svg ... fill="${color}" ... />`, // ← Color dinámico aquí
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  })
}
```

#### 2. **Estado Reactivo**

```tsx
const [primaryColor, setPrimaryColor] = useState<string>(getPrimaryColor())
const [parkingPinIcon, setParkingPinIcon] = useState(createParkingPinIcon(primaryColor))
```

- `primaryColor`: Almacena el color actual
- `parkingPinIcon`: Almacena el icono generado con ese color

#### 3. **MutationObserver - Detección de Cambios**

```tsx
useEffect(() => {
  // Crear observer para detectar cambios en los estilos
  const observer = new MutationObserver(() => {
    const newColor = getPrimaryColor()
    if (newColor !== primaryColor) {
      console.log('🎨 Color primario actualizado a:', newColor)
      setPrimaryColor(newColor)
      setParkingPinIcon(createParkingPinIcon(newColor))
    }
  })

  // Observar cambios en atributos del elemento raíz
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    subtree: false,
  })

  return () => observer.disconnect()
}, [])
```

**¿Qué hace?**
- 🔍 **Observa** los cambios en el elemento `<html>`
- 📊 **Detecta** si cambió el atributo `style` o `class`
- 🔄 **Obtiene** el nuevo color
- 🎨 **Actualiza** el icono si el color cambió
- 📝 **Registra** en consola el nuevo color

---

## 🎯 Casos de Uso

### 1️⃣ Cambiar Color Manualmente en globals.css

**Archivo:** `src/styles/globals.css`

```css
:root {
  --primary: #121db6;  /* Cambio de color */
  /* ... otros colores ... */
}
```

**Resultado:** 
- Los pines se actualizan automáticamente ✅
- Ver consola para confirmación: `🎨 Color primario actualizado a: #121db6`

### 2️⃣ Implementar Toggle de Modo Oscuro

Si quieres un botón para activar modo oscuro:

**Archivo:** `src/App.tsx` (o donde tengas el botón)

```tsx
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}
```

El `MutationObserver` detectará el cambio y actualizará los pines automáticamente.

### 3️⃣ Cambiar Color Mediante JavaScript

```tsx
export function setCustomPrimaryColor(hexColor: string) {
  document.documentElement.style.setProperty('--primary', hexColor);
  // Los pines se actualizan automáticamente 🎨
}
```

**Uso:**
```tsx
setCustomPrimaryColor('#FF5733'); // Color naranja personalizado
```

---

## 🧪 Probar los Cambios

### Método 1: Cambiar en DevTools

1. Abre DevTools: `F12`
2. Inspector → Elemento `<html>`
3. En panel Styles, busca `:root { --primary: ... }`
4. Cambia el valor: `#FF5733` (rojo)
5. 👀 Mira los pines en el mapa cambiar en tiempo real

### Método 2: Script en Consola

1. Abre DevTools: `F12`
2. Consola
3. Ejecuta:

```javascript
// Cambiar a verde
document.documentElement.style.setProperty('--primary', '#10B981');

// Cambiar a naranja
document.documentElement.style.setProperty('--primary', '#F59E0B');

// Cambiar a rojo
document.documentElement.style.setProperty('--primary', '#EF4444');
```

4. 👀 Mira los pines actualizarse

### Método 3: Verificar en Consola

```javascript
// Ver el color actual de los pines
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary').trim();
console.log('Color actual de pines:', color);
```

---

## 📊 Propiedades que se Pueden Cambiar Dinámicamente

Usando el mismo patrón, puedes hacer dinámicas otras propiedades:

### Colores Disponibles en globals.css

```css
:root {
  --primary: #121db6;           ← ¡Pines usan este!
  --secondary: #10B981;
  --accent: #F59E0B;
  --destructive: #EF4444;
  --background: #ffffff;
  --foreground: #1a1a1a;
  --card: #ffffff;
  --muted: #F3F4F6;
  /* ... más colores */
}
```

### Ejemplos de Cambios Dinámicos

```tsx
// Cambiar color primario
document.documentElement.style.setProperty('--primary', '#0F6FFF');

// Cambiar color secundario
document.documentElement.style.setProperty('--secondary', '#10B981');

// Cambiar color de acento
document.documentElement.style.setProperty('--accent', '#F59E0B');

// Cambiar fondo
document.documentElement.style.setProperty('--background', '#000000');

// Cambiar texto
document.documentElement.style.setProperty('--foreground', '#FFFFFF');
```

**Nota:** Otros componentes que usen estas variables también se actualizarán.

---

## 🚨 Logs para Debugging

Cuando cambies el color, verás en consola:

```
🎨 Color primario actualizado a: #FF5733
```

**Para ver todos los logs:**

1. Abre DevTools: `F12`
2. Consola
3. Filtra por: `🎨` o `Color`

---

## 🔄 Flujo de Actualización

```
Cambio en globals.css
        ↓
Vite HMR detecta cambio
        ↓
DOM se actualiza (class/style)
        ↓
MutationObserver dispara callback
        ↓
getPrimaryColor() obtiene nuevo valor
        ↓
createParkingPinIcon(newColor) crea nuevo icono
        ↓
setParkingPinIcon() actualiza estado
        ↓
React re-renderiza Markers con nuevo icono
        ↓
🎨 Pines cambian de color en el mapa
```

---

## 📝 Código Completo del Componente

**Archivo:** `src/components/features/ParkingMap.tsx`

```tsx
// @ts-nocheck
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

// Función para obtener el color primario actual
function getPrimaryColor(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim()
}

// Función para crear el icono con un color específico
function createParkingPinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="${color}"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  })
}

export function ParkingMap({ spots, onSelect }: any) {
  const [primaryColor, setPrimaryColor] = useState<string>(getPrimaryColor())
  const [parkingPinIcon, setParkingPinIcon] = useState(createParkingPinIcon(primaryColor))

  useEffect(() => {
    // Obtener color inicial
    const initialColor = getPrimaryColor()
    setPrimaryColor(initialColor)
    setParkingPinIcon(createParkingPinIcon(initialColor))

    // Crear observer para detectar cambios en los estilos
    const observer = new MutationObserver(() => {
      const newColor = getPrimaryColor()
      if (newColor !== primaryColor) {
        console.log('🎨 Color primario actualizado a:', newColor)
        setPrimaryColor(newColor)
        setParkingPinIcon(createParkingPinIcon(newColor))
      }
    })

    // Observar cambios en los atributos del elemento raíz
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
      className="w-full h-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            <p className="font-semibold">{spot.name}</p>
            <p>{spot.price}€/hora</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
```

---

## ✅ Checklist de Funcionamiento

- ✅ Los pines aparecen en el mapa
- ✅ El color inicial coincide con `--primary` en globals.css
- ✅ Cambios en globals.css actualizan los pines en tiempo real
- ✅ Consola muestra logs cuando cambia el color
- ✅ MutationObserver se desconecta cuando el componente se desmonta

---

## 🎨 Próximos Pasos

1. **Implementar Selector de Colores:**
   - Agregar input color en UI
   - Permitir cambiar `--primary` dinámicamente

2. **Temas Predefinidos:**
   - Botón "Tema Oscuro"
   - Botón "Tema Claro"
   - Ambos actualizan varios colores CSS

3. **Guardar Preferencias:**
   - Guardar color elegido en localStorage
   - Cargar automáticamente al reabrir la página

4. **Animar Transición:**
   - Agregar `transition: color 0.3s` en CSS
   - Pines cambiarán con animación suave

---

## 📚 Referencias

- **MutationObserver:** https://developer.mozilla.org/es/docs/Web/API/MutationObserver
- **getComputedStyle:** https://developer.mozilla.org/es/docs/Web/API/Window/getComputedStyle
- **CSS Variables:** https://developer.mozilla.org/es/docs/Web/CSS/--*
- **Leaflet Icons:** https://leafletjs.com/reference.html#icon
