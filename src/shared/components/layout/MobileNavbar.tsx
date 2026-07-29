import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Calendar, User } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { impact } from '@/mobile/haptics';

const NAV_ITEMS = [
  { name: 'Inicio',   icon: Home,     path: '/',        tab: undefined },
  { name: 'Mapa',     icon: Map,      path: '/map',     tab: undefined },
  { name: 'Reservas', icon: Calendar, path: '/profile', tab: 'bookings' },
  { name: 'Perfil',   icon: User,     path: '/profile', tab: 'settings' },
] as const;

export function MobileNavbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive = (item: typeof NAV_ITEMS[number]) => {
    if (item.path === '/') return location.pathname === '/';
    if (!item.tab)         return location.pathname.startsWith(item.path);
    return (
      location.pathname === item.path &&
      location.state?.activeTab === item.tab
    );
  };

  const handleNav = (item: typeof NAV_ITEMS[number]) => {
    impact('Light');
    navigate(item.path, item.tab ? { state: { activeTab: item.tab } } : undefined);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/96 backdrop-blur-xl border-t border-border/60 shadow-[0_-1px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-[66px] px-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon   = item.icon;

          return (
            <button
              key={`${item.path}-${item.tab ?? 'none'}`}
              onClick={() => handleNav(item)}
              className="relative flex-1 flex flex-col items-center justify-center gap-[3px] min-h-[48px] transition-all duration-150 active:scale-90 select-none"
              aria-label={item.name}
              aria-current={active ? 'page' : undefined}
            >
              {/* pill indicator */}
              <span
                className={cn(
                  'absolute inset-x-1.5 top-[7px] h-[38px] rounded-xl transition-all duration-200',
                  active ? 'bg-primary/12 scale-100' : 'bg-transparent scale-90 opacity-0'
                )}
              />

              <Icon
                className={cn(
                  'relative w-6 h-6 transition-all duration-200',
                  active ? 'text-primary stroke-[2.5px] scale-110' : 'text-muted-foreground stroke-2 scale-100'
                )}
              />
              <span
                className={cn(
                  'relative text-[12px] font-semibold transition-colors duration-200',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
