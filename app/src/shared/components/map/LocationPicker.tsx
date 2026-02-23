
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { getPrimaryColor, createParkingPinIcon } from '../../../features/parking/utils/mapUtils';
import { geocodingService, GeocodingResult } from '../../services/geocoding.service';

interface LocationPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  onAddressUpdate?: (result: GeocodingResult) => void;
  className?: string;
}

// Controller to update map view when coordinates change from outside (e.g. search)
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  return null;
}

export function LocationPicker({ lat, lng, onChange, onAddressUpdate, className }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([lat, lng]);
  const [isSyncing, setIsSyncing] = useState(false);
  const primaryColor = getPrimaryColor();
  const parkingIcon = createParkingPinIcon(primaryColor);

  useEffect(() => {
    if (lat !== position[0] || lng !== position[1]) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handleLocationChange = async (newLat: number, newLng: number) => {
    setPosition([newLat, newLng]);
    onChange(newLat, newLng);

    if (onAddressUpdate) {
      setIsSyncing(true);
      try {
        const result = await geocodingService.reverseGeocode(newLat, newLng);
        if (result) {
          onAddressUpdate(result);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        handleLocationChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          handleLocationChange(lat, lng);
        }
      },
    }),
    [onAddressUpdate]
  );

  return (
    <div className={`relative h-64 w-full rounded-xl overflow-hidden border-2 border-border group ${className}`}>
      <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 text-xs font-semibold text-primary border border-primary/20">
        {isSyncing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <MapPin className="h-3.5 w-3.5" />
        )}
        {isSyncing ? 'Sincronizando dirección...' : 'Haz click o arrastra para precisión total'}
      </div>

      <MapContainer
        center={position}
        zoom={16}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapController center={position} />
        <MapEvents />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          icon={parkingIcon}
        />
      </MapContainer>
    </div>
  );
}
