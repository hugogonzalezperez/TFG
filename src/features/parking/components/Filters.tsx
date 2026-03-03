import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../../../ui';
import { useFilters } from '../context/FilterContext';

interface FiltersProps {
  onOpen: () => void;
}

export function Filters({ onOpen }: FiltersProps) {
  const { filters } = useFilters();

  const isFiltered =
    filters.types.size < 3 ||
    filters.availability !== 'all' ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 100;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onOpen}
      className="relative h-12 w-12"
      title="Abrir filtros"
    >
      <SlidersHorizontal className="h-5 w-5" />
      {isFiltered && (
        <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full" />
      )}
    </Button>
  );
}