import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import { Card } from '../../../ui';

export function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener la sesión después del callback de OAuth
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (data.session?.user) {
          // Importamos el servicio para procesar el callback (incluye gestión de session_id)
          const { handleOAuthCallback } = await import('../services/auth.service');
          await handleOAuthCallback();

          // Redirigir a home
          navigate('/');
        } else {
          setError('No se pudo completar la autenticación');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error en la autenticación');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">Completando autenticación...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <p className="text-destructive font-semibold mb-4">Error de autenticación</p>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Volver a intentar
          </button>
        </Card>
      </div>
    );
  }

  return null;
}
