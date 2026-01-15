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
        <path d="M12 2C7.58 2 4 5.58 4 10c0 4.5 8 12 8 12s8-7.5 8-12c0-4.42-3.58-8-8-8zm0 12a4 4 0 110-8 4 4 0 010 8z"/>
      </svg>
    `,
    iconSize: [36, 36],
    iconAnchor: [36, 36],
  })
}

// Función para crear el icono con color alternativo para marcadores seleccionados
function createSelectedParkingPinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="${color}"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));"
      >
        <path d="M12 2C7.58 2 4 5.58 4 10c0 4.5 8 12 8 12s8-7.5 8-12c0-4.42-3.58-8-8-8zm0 12a4 4 0 110-8 4 4 0 010 8z"/>
      </svg>
    `,
    iconSize: [44, 44],
    iconAnchor: [44, 44],
  })
}

export function ParkingMap({ spots, onSelect, selectedSpotId }: any) {
  const [primaryColor, setPrimaryColor] = useState<string>(getPrimaryColor())
  const [parkingPinIcon, setParkingPinIcon] = useState(createParkingPinIcon(primaryColor))
  const [selectedParkingPinIcon, setSelectedParkingPinIcon] = useState(createSelectedParkingPinIcon(primaryColor))

  useEffect(() => {
    // Obtener color inicial
    const initialColor = getPrimaryColor()
    setPrimaryColor(initialColor)
    setParkingPinIcon(createParkingPinIcon(initialColor))
    setSelectedParkingPinIcon(createSelectedParkingPinIcon(initialColor))

    // Variable para almacenar el último color conocido
    let lastColor = initialColor

    // Crear observer para detectar cambios en los <style> inyectados por HMR
    const observer = new MutationObserver(() => {
      const newColor = getPrimaryColor()
      if (newColor !== lastColor) {
        lastColor = newColor
        setPrimaryColor(newColor)
        setParkingPinIcon(createParkingPinIcon(newColor))
        setSelectedParkingPinIcon(createSelectedParkingPinIcon(newColor))
      }
    })

    // Observar cambios en el <head> (donde se inyectan los <style>)
    observer.observe(document.head, {
      childList: true,
      subtree: true,
    })

    // También observar cambios en el <html> por si acaso
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
      className="w-full h-full z-0 shadow-lg"
    >
      <TileLayer
        // SOBRIO Y MUY MUY BASICO
        //url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

        /* url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=x4rkNwBT7ZNmaPfbybAX"
        tileSize={512}
        maxZoom={20} */

        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {spots.map((spot: any) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={selectedSpotId === spot.id ? selectedParkingPinIcon : parkingPinIcon}
          eventHandlers={{
            click: () => onSelect(spot),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold text-sm">{spot.name}</p>
              <p className="text-xs text-muted-foreground">{spot.location}</p>
              <p className="font-bold text-primary">{spot.price}€/hora</p>
              <p className="text-xs">⭐ {spot.rating} ({spot.reviews} reseñas)</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}