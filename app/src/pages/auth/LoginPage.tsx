import { useState } from 'react';
import { Input, Label, Card, Button } from '../../ui';
import { Car, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../features/auth';
import { AnimatedLoader } from '../../shared/components/loaders';
import { ErrorMessage } from '../../ui';

import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Intentamos el login
      await login({ email, password });

      // Si llegamos aquí, el login fue exitoso
      // Es vital NO resetear isSubmitting aquí si vamos a navegar, 
      // para evitar que el formulario parpadee antes de irse
      navigate('/');
    } catch (err: any) {
      // IMPORTANTE: Primero desactivamos el estado de carga
      setIsSubmitting(false);

      // Luego asignamos el error. 
      // Ahora el "if (isSubmitting || loading)" será falso y mostrará el ErrorMessage
      setError(err.message || 'Credenciales incorrectas');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      // El redirect manejará la navegación
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
    }
  };

  const handleFacebookLogin = async () => {
    setError(null);
    try {
      await loginWithFacebook();
      // El redirect manejará la navegación
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Facebook');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Loader como Overlay: Evita que el componente se desmonte y se pierda el error */}
      {(isSubmitting || (loading && !error)) && (
        <AnimatedLoader message="Iniciando sesión..." />
      )}

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          {/* Logo y marca */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary p-3 rounded-2xl">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="ml-3 text-3xl font-bold text-foreground">Parky</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl mb-2">¡Bienvenido de nuevo!</h2>
            <p className="text-muted-foreground">Encuentra tu plaza perfecta en Tenerife</p>
          </div>

          {/* Mensaje de error: Ahora se mantendrá visible porque el componente no se desmonta */}
          <ErrorMessage message={error || ''} onClose={() => setError(null)} />

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  disabled={isSubmitting || loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting || loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white h-12"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onClick={handleFacebookLogin}
                disabled={isSubmitting || loading}
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Facebook
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary hover:underline font-medium"
                disabled={isSubmitting || loading}
              >
                Regístrate gratis
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}