import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Calendar, User } from 'lucide-react';
import { isNative } from '@/mobile';

export function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isNative()) return null;

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/' },
    { name: 'Mapa', icon: Map, path: '/map' },
    { name: 'Reservas', icon: Calendar, path: '/profile', tab: 'bookings' },
    { name: 'Perfil', icon: User, path: '/profile', tab: 'settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-6 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && (!item.tab || (location.state?.activeTab === item.tab));
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path, { state: { activeTab: item.tab } })}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? 'fill-primary/10' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
