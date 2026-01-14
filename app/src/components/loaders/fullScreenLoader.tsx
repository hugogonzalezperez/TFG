import { Car } from 'lucide-react';

export function FullScreenLoader({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative">
        {/* Círculo de progreso animado */}
        <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>

        {/* Icono de coche fijo en el centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Mensaje dinámico */}
      <p className="mt-6 text-primary font-semibold text-lg animate-pulse">
        {message}
      </p>
    </div>
  );
}