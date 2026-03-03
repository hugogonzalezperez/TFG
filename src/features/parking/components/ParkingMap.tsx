import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { getPrimaryColor, getAccentColor, createParkingPinIcon, createSelectedParkingPinIcon } from '../utils/mapUtils'
import { LocateFixed } from 'lucide-react'
import { toast } from 'sonner'

interface ParkingMapProps {
  garages: any[];
  onGarageClick: (garage: any) => void;
  selectedGarageId?: string | null;
  hoveredGarageId?: string | null;
  center?: [number, number];
  zoom?: number;
}

// Componente helper para mover el mapa programáticamente
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

// Botón "Mi ubicación" que vive dentro del contexto del mapa
function LocateButton({ onLocate }: { onLocate: (pos: [number, number]) => void }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    const toastId = toast.loading('Buscando tu ubicación...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        map.flyTo(coords, 16, { animate: true, duration: 1.5 });
        onLocate(coords);
        setIsLocating(false);
        toast.dismiss(toastId);
        toast.success('Ubicación encontrada');
      },
      (error) => {
        setIsLocating(false);
        toast.dismiss(toastId);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Permiso de ubicación denegado. Por favor, actívalo en tu navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Información de ubicación no disponible. Asegúrate de tener el GPS activo.');
            break;
          case error.TIMEOUT:
            toast.error('Tiempo de espera agotado al buscar tu ubicación. Reinténtalo.');
            break;
          default:
            toast.error('No se pudo obtener tu ubicación.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ zIndex: 1000, pointerEvents: 'auto' }}>
      <div className="leaflet-control mt-4 mr-4">
        <button
          onClick={handleLocate}
          disabled={isLocating}
          title="Mi ubicación"
          className="flex items-center justify-center w-10 h-10 bg-card border border-border rounded-xl shadow-lg hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-60"
        >
          <LocateFixed className={`h-5 w-5 ${isLocating ? 'animate-pulse text-primary' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export function ParkingMap({
  garages = [],
  onGarageClick,
  selectedGarageId,
  hoveredGarageId,
  center = [28.4682, -16.2546],
  zoom = 14
}: ParkingMapProps) {
  const [primaryColor, setPrimaryColor] = useState<string>(getPrimaryColor())
  const [accentColor, setAccentColor] = useState<string>(getAccentColor())
  const [parkingPinIcon, setParkingPinIcon] = useState(createParkingPinIcon(primaryColor))
  const [selectedParkingPinIcon, setSelectedParkingPinIcon] = useState(createSelectedParkingPinIcon(accentColor))
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const initialColor = getPrimaryColor()
    const initialAccent = getAccentColor()
    setPrimaryColor(initialColor)
    setAccentColor(initialAccent)
    setParkingPinIcon(createParkingPinIcon(initialColor))
    setSelectedParkingPinIcon(createSelectedParkingPinIcon(initialAccent))

    let lastColor = initialColor
    let lastAccent = initialAccent

    const observer = new MutationObserver(() => {
      const newColor = getPrimaryColor()
      const newAccent = getAccentColor()

      if (newColor !== lastColor || newAccent !== lastAccent) {
        lastColor = newColor
        lastAccent = newAccent
        setPrimaryColor(newColor)
        setAccentColor(newAccent)
        setParkingPinIcon(createParkingPinIcon(newColor))
        setSelectedParkingPinIcon(createSelectedParkingPinIcon(newAccent))
      }
    })
    observer.observe(document.head, { childList: true, subtree: true })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'], subtree: false })
    return () => observer.disconnect()
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full z-0 shadow-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapController center={center} zoom={zoom} />
      <LocateButton onLocate={setUserPosition} />

      {/* Punto azul — posición del usuario */}
      {userPosition && (
        <CircleMarker
          center={userPosition}
          radius={10}
          pathOptions={{ color: '#2563EB', fillColor: '#3B82F6', fillOpacity: 0.9, weight: 2 }}
        />
      )}

      {garages.map((garage: any) => {
        const isSelected = garage.id === selectedGarageId || garage.id === hoveredGarageId;

        return (
          <Marker
            key={garage.id}
            position={[garage.lat, garage.lng]}
            icon={isSelected ? selectedParkingPinIcon : parkingPinIcon}
            eventHandlers={{
              click: () => onGarageClick(garage)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[150px] text-center">
                <p className="font-bold text-sm">{garage.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Click para ver disponibilidad</p>
                <div className="mt-2 text-xs font-semibold text-primary">
                  {garage.spots?.length || 0} plazas libres
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  )
}