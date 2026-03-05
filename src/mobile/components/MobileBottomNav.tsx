import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, User, Calendar } from 'lucide-react';
import { cn } from '../../shared/lib/cn';
import { impact } from '../haptics';

/**
 * =====================================================
 * NAVEGACIÓN INFERIOR PARA MÓVIL (MOBILE BOTTOM NAV)
 * =====================================================
 * 
 * Este componente proporciona una barra de navegación inferior
 * persistente, similar a las aplicaciones nativas de iOS y Android.
 * 
 * CARACTERÍSTICAS:
 * 1. Solo se muestra en plataformas nativas (mediante check en MainLayout).
 * 2. Feedback Háptico: Vibra sutilmente al pulsar cada botón.
 * 3. Safe Area: El contenedor respeta el notch inferior mediante padding-bottom.
 * 4. Indicador Activo: Resalta el icono de la ruta actual.
 */

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Inicio', path: '/', icon: Home },
    { label: 'Explorar', path: '/map', icon: Map },
    { label: 'Mis Reservas', path: '/profile', icon: Calendar },
    { label: 'Mi Perfil', path: '/profile', icon: User },
  ];

  const handleNav = (path: string) => {
    // Feedback háptico ligero para una sensación premium
    impact('Light');
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
