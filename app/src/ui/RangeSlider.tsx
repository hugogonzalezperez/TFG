import React, { useRef, useState } from 'react';
import { Input } from './input';

interface RangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  step?: number;
  label?: string;
  unit?: string;
}

export function RangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  step = 0.5,
  label = 'Rango',
  unit = '€',
}: RangeSliderProps) {
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  // ✅ Estado para rastrear cuál slider está activo
  const [activeSlider, setActiveSlider] = useState<'min' | 'max' | null>(null);

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(parseFloat(e.target.value), maxValue);
    onMinChange(value);
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(parseFloat(e.target.value), minValue);
    onMaxChange(value);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const clampedValue = Math.max(Math.min(value, maxValue), min);
    onMinChange(clampedValue);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const clampedValue = Math.min(Math.max(value, minValue), max);
    onMaxChange(clampedValue);
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  // ✅ SOLUCIÓN MEJORADA: Calcular z-index basado en:
  // 1. Cuál slider está activo (el activo siempre arriba)
  // 2. La posición de los sliders (evitar solapamiento)
  const getZIndex = () => {
    if (activeSlider === 'min') {
      return { min: 50, max: 40 };
    }
    if (activeSlider === 'max') {
      return { min: 40, max: 50 };
    }
    // Cuando ninguno está activo, priorizar según posición
    // Si el slider mínimo está más a la derecha, darle más z-index
    return {
      min: minPercent > 50 ? 50 : 40,
      max: maxPercent < 50 ? 50 : 40,
    };
  };

  const zIndices = getZIndex();

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-sm font-semibold text-foreground">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Inputs numéricos */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              value={minValue.toFixed(1)}
              onChange={handleMinInputChange}
              min={min}
              max={maxValue}
              step={step}
              className="h-9 w-20 text-sm font-semibold"
            />
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>

          <span className="text-sm text-muted-foreground px-2">-</span>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <Input
              type="number"
              value={maxValue.toFixed(1)}
              onChange={handleMaxInputChange}
              min={minValue}
              max={max}
              step={step}
              className="h-9 w-20 text-sm font-semibold"
            />
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="relative pt-6 pb-2">
          {/* Track de fondo */}
          <div className="absolute top-3 h-2 w-full bg-muted rounded-full" />

          {/* Rango activo */}
          <div
            className="absolute top-3 h-2 bg-primary rounded-full pointer-events-none"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* MIN SLIDER */}
          <input
            ref={minInputRef}
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={handleMinSliderChange}
            onMouseDown={() => setActiveSlider('min')}
            onMouseUp={() => setActiveSlider(null)}
            onTouchStart={() => setActiveSlider('min')}
            onTouchEnd={() => setActiveSlider(null)}
            style={{ zIndex: zIndices.min }}
            className="absolute w-full h-2 top-3 appearance-none bg-transparent rounded-full pointer-events-none accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto"
          />

          {/* MAX SLIDER */}
          <input
            ref={maxInputRef}
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={handleMaxSliderChange}
            onMouseDown={() => setActiveSlider('max')}
            onMouseUp={() => setActiveSlider(null)}
            onTouchStart={() => setActiveSlider('max')}
            onTouchEnd={() => setActiveSlider(null)}
            style={{ zIndex: zIndices.max }}
            className="absolute w-full h-2 top-3 appearance-none bg-transparent rounded-full pointer-events-none accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto"
          />
        </div>

        {/* Etiquetas */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2">
          <span>{min.toFixed(1)}{unit}</span>
          <span>{max.toFixed(1)}{unit}</span>
        </div>
      </div>
    </div>
  );
}