import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../lib/supabase';
import { Card } from '../../../ui';
import { AnimatedLoader } from '../../../loaders/animatedLoader';
import { HomeSkeleton } from '../../../loaders/homeSkeleton';

export function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener la sesión después del callback de OAuth
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (data.session?.user) {
          // Esperar un poco para que se cree el perfil
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Redirigir a home usando el nuevo enrutador
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
    return <HomeSkeleton />;
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
