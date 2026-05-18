import { useNavigate, useRouteError } from 'react-router-dom';
import { Car, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/ui/button';

export function ErrorPage() {
  const error = useRouteError() as { status?: number; statusText?: string; message?: string };
  const navigate = useNavigate();

  const is404 = error?.status === 404;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary">
          <Car className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground">Parky</span>
      </div>

      <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      <h1 className="text-4xl font-bold text-foreground mb-2">
        {is404 ? '404' : 'Error'}
      </h1>
      <p className="text-lg font-semibold text-foreground mb-1">
        {is404 ? 'Página no encontrada' : 'Algo salió mal'}
      </p>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        {is404
          ? 'La página que buscas no existe o ha sido movida.'
          : 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
      </p>

      <Button onClick={() => navigate('/')} className="gap-2">
        <Home className="h-4 w-4" />
        Volver al inicio
      </Button>
    </div>
  );
}
