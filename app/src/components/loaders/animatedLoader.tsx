import { Car } from 'lucide-react';

interface AnimatedLoaderProps {
  message?: string;
}

export function AnimatedLoader({ message = "Cargando..." }: AnimatedLoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      {/* Contenedor de la animación */}
      <div className="relative w-80 h-40 mb-8">
        {/* Carretera */}
        <div className="absolute bottom-8 left-0 right-0 h-1 bg-border overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-road"></div>
        </div>

        {/* Líneas de carretera animadas */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-around">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-1 bg-muted-foreground/30 animate-road-lines"
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Coche animado */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-car-bounce">
          <div className="relative">
            {/* Coche principal */}
            <div className="bg-primary rounded-xl p-4 shadow-2xl">
              <Car className="h-12 w-12 text-white" />
            </div>

            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine rounded-xl"></div>
          </div>
        </div>

        {/* Partículas de polvo - Izquierda */}
        <div className="absolute bottom-10 left-1/4">
          {[...Array(3)].map((_, i) => (
            <div
              key={`dust-left-${i}`}
              className="absolute w-2 h-2 bg-muted-foreground/40 rounded-full animate-dust-left"
              style={{
                animationDelay: `${i * 0.3}s`,
                left: `${i * -10}px`,
              }}
            />
          ))}
        </div>

        {/* Partículas de polvo - Derecha */}
        <div className="absolute bottom-10 right-1/4">
          {[...Array(3)].map((_, i) => (
            <div
              key={`dust-right-${i}`}
              className="absolute w-2 h-2 bg-muted-foreground/40 rounded-full animate-dust-right"
              style={{
                animationDelay: `${i * 0.3}s`,
                right: `${i * -10}px`,
              }}
            />
          ))}
        </div>

        {/* Humo del escape */}
        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 -ml-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={`smoke-${i}`}
              className="absolute w-3 h-3 bg-muted-foreground/20 rounded-full animate-smoke"
              style={{
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Mensaje dinámico */}
      <div className="text-center space-y-2">
        <p className="text-primary font-semibold text-xl animate-pulse">
          {message}
        </p>
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style>{`
        @keyframes car-bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-8px);
          }
        }

        @keyframes road {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes road-lines {
          0% {
            transform: translateX(400px);
            opacity: 1;
          }
          100% {
            transform: translateX(-400px);
            opacity: 0;
          }
        }

        @keyframes dust-left {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-30px, -20px) scale(0);
            opacity: 0;
          }
        }

        @keyframes dust-right {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(30px, -20px) scale(0);
            opacity: 0;
          }
        }

        @keyframes smoke {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0.5;
          }
          100% {
            transform: translate(-40px, -30px) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(200%);
          }
        }

        .animate-car-bounce {
          animation: car-bounce 1s ease-in-out infinite;
        }

        .animate-road {
          animation: road 2s linear infinite;
        }

        .animate-road-lines {
          animation: road-lines 1.5s linear infinite;
        }

        .animate-dust-left {
          animation: dust-left 1s ease-out infinite;
        }

        .animate-dust-right {
          animation: dust-right 1s ease-out infinite;
        }

        .animate-smoke {
          animation: smoke 1.5s ease-out infinite;
        }

        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}