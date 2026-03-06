import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Map as MapIcon, List } from 'lucide-react';
import { isNative } from '@/mobile';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui';
import { cn } from '../../../shared/lib/cn';
import { Filters } from './Filters';
import { useIsMobile } from '../../../shared/hooks/use-mobile';

interface MapViewHeaderProps {
  view: 'map' | 'list';
  setView: (view: 'map' | 'list') => void;
  onSearch: (term: string) => void;
  onOpenFilters: () => void;
  searchQuery: string;
}

export function MapViewHeader({ view, setView, onSearch, onOpenFilters, searchQuery }: MapViewHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className={`bg-card border-b border-border p-2 md:p-4 shadow-sm sticky top-0 z-40 ${isNative() ? 'pt-[env(safe-area-inset-top)]' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full h-10 w-10 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex items-center gap-1.5 md:gap-2 min-w-0">
          <div className="relative flex-1 max-w-2xl min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <Input
              placeholder="¿Dónde aparcar?"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 md:pl-10 h-10 md:h-12 bg-muted/50 border-none focus-visible:ring-primary text-sm md:text-base"
            />
          </div>
          {(isMobile || view === 'map') && (
            <div className="shrink-0 scale-90 md:scale-100 origin-right">
              <Filters onOpen={onOpenFilters} />
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-1 bg-muted p-1 rounded-lg shrink-0">
          <Button
            variant={view === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('map')}
            className={cn("gap-2", view === 'map' && "shadow-sm")}
          >
            <MapIcon className="h-4 w-4" />
            Mapa
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className={cn("gap-2", view === 'list' && "shadow-sm")}
          >
            <List className="h-4 w-4" />
            Lista
          </Button>
        </div>
      </div>
    </div>
  );
}
