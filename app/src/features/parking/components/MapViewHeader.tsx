import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Map as MapIcon, List } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui';
import { Filters } from './Filters';

interface MapViewHeaderProps {
  view: 'map' | 'list';
  setView: (view: 'map' | 'list') => void;
  onSearch: (term: string) => void;
  onOpenFilters: () => void;
  searchQuery: string;
}

export function MapViewHeader({ view, setView, onSearch, onOpenFilters, searchQuery }: MapViewHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border-b border-border p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ubicación (calle, ciudad...)"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 h-10 sm:h-12 bg-muted/50 border-none focus-visible:ring-primary"
            />
          </div>
          {view === 'map' && (
            <Filters onOpen={onOpenFilters} />
          )}
        </div>

        <div className="hidden md:flex gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={view === 'map' ? 'foreground' : 'ghost'}
            size="sm"
            onClick={() => setView('map')}
            className={`gap-2 ${view === 'map' ? 'shadow-sm' : ''}`}
          >
            <MapIcon className="h-4 w-4" />
            Mapa
          </Button>
          <Button
            variant={view === 'list' ? 'foreground' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className={`gap-2 ${view === 'list' ? 'shadow-sm' : ''}`}
          >
            <List className="h-4 w-4" />
            Lista
          </Button>
        </div>
      </div>
    </div>
  );
}
