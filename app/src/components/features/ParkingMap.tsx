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
      center={[28.4682, -16.2546]} // Tenerife
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