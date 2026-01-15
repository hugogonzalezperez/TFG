import { Card, Input, Button } from '../ui';
import { MapPin, Calendar, Clock, Search } from 'lucide-react';

interface SearchBarProps {
  searchData: {
    location: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  onSearchDataChange: (data: any) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export function SearchBar({
  searchData,
  onSearchDataChange,
  onSearch,
  disabled = false,
}: SearchBarProps) {
  return (
    <Card className="max-w-4xl mx-auto p-6 lg:p-8 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Ubicación
          </label>
          <Input
            placeholder="¿Dónde aparcar?"
            value={searchData.location}
            onChange={(e) =>
              onSearchDataChange({ ...searchData, location: e.target.value })
            }
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Fecha
          </label>
          <Input
            type="date"
            value={searchData.date}
            onChange={(e) =>
              onSearchDataChange({ ...searchData, date: e.target.value })
            }
            min={new Date().toISOString().split('T')[0]}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Entrada
          </label>
          <Input
            type="time"
            value={searchData.startTime}
            onChange={(e) =>
              onSearchDataChange({ ...searchData, startTime: e.target.value })
            }
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Salida
          </label>
          <Input
            type="time"
            value={searchData.endTime}
            onChange={(e) => {
              // Prevent end time from being before start time
              if (searchData.startTime && e.target.value < searchData.startTime) {
                return;
              }
              onSearchDataChange({ ...searchData, endTime: e.target.value });
            }}
            min={searchData.startTime || '00:00'}
            className="h-12"
          />
        </div>
      </div>

      <Button
        onClick={onSearch}
        disabled={disabled}
        className="w-full h-14 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg"
      >
        <Search className="h-5 w-5 mr-2" />
        {disabled ? 'Completa todos los campos' : 'Buscar aparcamiento'}
      </Button>
    </Card>
  );
}
