import React, { createContext, useContext, useState } from 'react';
import { ParkingFilter } from '../types/parking.types';

interface FilterContextType {
  filters: ParkingFilter;
  toggleType: (type: string) => void;
  setTypes: (types: Set<string>) => void;
  setAvailability: (availability: ParkingFilter['availability']) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleAmenity: (amenity: string) => void;
  setSearchQuery: (query: string) => void;
  setDateTimeFilters: (data: { startDate: string; startTime: string; endDate: string; endTime: string }) => void;
  resetFilters: () => void;
  selectedParkingId: string | null;
  setSelectedParkingId: (id: string | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: ParkingFilter = {
  types: new Set(['Cubierta', 'Subterráneo', 'Al aire libre']),
  availability: 'all',
  priceRange: [0, 100],
  amenities: new Set(),
  searchQuery: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<ParkingFilter>(defaultFilters);
  const [selectedParkingId, setSelectedParkingId] = useState<string | null>(null);

  const toggleType = (type: string) => {
    setFilters((prev) => {
      const newTypes = new Set(prev.types);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return { ...prev, types: newTypes };
    });
  };

  const setTypes = (types: Set<string>) => {
    setFilters((prev) => ({ ...prev, types }));
  };

  const setAvailability = (availability: ParkingFilter['availability']) => {
    setFilters((prev) => ({ ...prev, availability }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const newAmenities = new Set(prev.amenities);
      if (newAmenities.has(amenity)) {
        newAmenities.delete(amenity);
      } else {
        newAmenities.add(amenity);
      }
      return { ...prev, amenities: newAmenities };
    });
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setDateTimeFilters = (data: { startDate: string; startTime: string; endDate: string; endTime: string }) => {
    setFilters((prev) => ({
      ...prev,
      startDate: data.startDate,
      startTime: data.startTime,
      endDate: data.endDate,
      endTime: data.endTime,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSelectedParkingId(null);
  };

  const value: FilterContextType = {
    filters,
    toggleType,
    setTypes,
    setAvailability,
    setPriceRange,
    toggleAmenity,
    setSearchQuery,
    setDateTimeFilters,
    resetFilters,
    selectedParkingId,
    setSelectedParkingId,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextType {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
