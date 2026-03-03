import L from 'leaflet';

export function getPrimaryColor(): string {
  if (typeof window === 'undefined') return '#121db6'; // Dark blue
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim() || '#121db6';
}

export function getAccentColor(): string {
  if (typeof window === 'undefined') return '#F59E0B'; // Amber
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim() || '#F59E0B';
}

export function createParkingPinIcon(color: string, size: number = 36) {
  const iconSize = size;
  return L.divIcon({
    className: '',
    html: `
      <svg
        width="${iconSize}"
        height="${iconSize}"
        viewBox="0 0 24 24"
        fill="${color}"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));"
      >
        <path d="M12 2C7.58 2 4 5.58 4 10c0 4.5 8 12 8 12s8-7.5 8-12c0-4.42-3.58-8-8-8zm0 12a4 4 0 110-8 4 4 0 010 8z"/>
      </svg>
    `,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize], // Balanced anchor
  });
}

export function createSelectedParkingPinIcon(color: string) {
  // Use a slightly larger size and the provided color (intended to be the accent color)
  return createParkingPinIcon(color, 52);
}
