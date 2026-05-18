import { useNavigate, useRouteError } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/button';

export function ErrorPage() {
  const error = useRouteError() as { status?: number; statusText?: string };
  const navigate = useNavigate();
  const is404 = !error?.status || error.status === 404;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group"
        >
          <div className="p-1.5 rounded-lg bg-primary">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-foreground">Parky</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 text-center">

        {/* Decorative 404 */}
        <div className="relative mb-8 select-none">
          <span className="text-[120px] sm:text-[160px] font-black text-foreground/5 leading-none tracking-tighter">
            {is404 ? '404' : '500'}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Parking icon illustration */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {/* Road */}
                <div className="w-24 h-1.5 bg-border rounded-full mx-auto mb-2" />
                {/* Car silhouette */}
                <svg
                  viewBox="0 0 80 40"
                  className="w-20 h-10 text-muted-foreground/40"
                  fill="currentColor"
                >
                  <rect x="8" y="18" width="64" height="18" rx="4" />
                  <path d="M18 18 L26 6 H54 L62 18 Z" />
                  <circle cx="22" cy="38" r="5" className="text-background" fill="currentColor" />
                  <circle cx="22" cy="38" r="3" className="text-muted-foreground/40" fill="currentColor" />
                  <circle cx="58" cy="38" r="5" className="text-background" fill="currentColor" />
                  <circle cx="58" cy="38" r="3" className="text-muted-foreground/40" fill="currentColor" />
                  <rect x="30" y="9" width="20" height="9" rx="2" className="text-background/60" fill="currentColor" />
                </svg>
                {/* Parking sign */}
                <div className="absolute -right-3 -top-4 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-black">P</span>
                </div>
              </div>
              <div className="w-24 h-0.5 bg-border/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {is404 ? 'Plaza no encontrada' : 'Algo salió mal'}
          </h1>
          <p className="text-sm text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
            {is404
              ? 'Esta dirección no existe. Puede que haya sido movida o eliminada.'
              : 'Ha ocurrido un error inesperado. Estamos trabajando para solucionarlo.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-[240px]">
          <Button onClick={() => navigate('/')} className="h-12 text-sm font-semibold rounded-xl">
            Volver al inicio
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="h-11 text-sm text-muted-foreground gap-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Página anterior
          </Button>
        </div>
      </main>

      {/* Footer hint */}
      <div className="pb-8 px-6 text-center">
        <p className="text-xs text-muted-foreground/60">
          Error {is404 ? '404' : error?.status ?? '500'} · Parky
        </p>
      </div>
    </div>
  );
}
