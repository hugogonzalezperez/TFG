import { Card } from '../ui';
import { ParkyLogo } from './ParkyLogo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl my-8">
        {/* Logo y marca */}
        <div className="flex items-center justify-center mb-6">
          <ParkyLogo size="lg" />
        </div>

        {/* Título y subtítulo */}
        <div className="text-center mb-6">
          <h2 className="text-2xl mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {/* Contenido (formulario) */}
        {children}

        {/* Footer (enlace a otra página) */}
        {footer && <div className="mt-6 text-center">{footer}</div>}
      </Card>
    </div>
  );
}
