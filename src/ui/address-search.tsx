
import { useState, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Search, Loader2, MapPin, Check } from 'lucide-react';
import { geocodingService, GeocodingResult } from '../shared/services/geocoding.service';
import { cn } from '../shared/lib/cn';

interface AddressSearchProps {
  onAddressSelect: (result: GeocodingResult) => void;
  initialAddress?: string;
  className?: string;
}

export function AddressSearch({ onAddressSelect, initialAddress = '', className }: AddressSearchProps) {
  const [query, setQuery] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialAddress) setQuery(initialAddress);
  }, [initialAddress]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Priorizar búsqueda en Santa Cruz de Tenerife añadiendo contexto
      const searchContext = query.toLowerCase().includes('tenerife') ? query : `${query}, Santa Cruz de Tenerife`;

      const result = await geocodingService.forwardGeocode(searchContext);

      if (result) {
        setSuccess(true);
        onAddressSelect(result);
        if (result.formatted) {
          setQuery(result.formatted); // Actualizar con la dirección formateada oficial
        }
      } else {
        setError('No se pudo encontrar la dirección. Intenta ser más específico.');
      }
    } catch (err) {
      setError('Error al buscar la dirección.');
    } finally {
      setLoading(false);
      // Quitar estado de éxito después de unos segundos
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuccess(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Calle, número, ciudad..."
            className={cn(
              "pr-10",
              success && "border-green-500 ring-green-500/20"
            )}
          />
          {success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          variant="secondary"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="sr-only sm:not-sr-only sm:ml-2">Buscar</span>
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {error}
        </p>
      )}

      {success && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Coordenadas encontradas y actualizadas
        </p>
      )}
    </div>
  );
}
