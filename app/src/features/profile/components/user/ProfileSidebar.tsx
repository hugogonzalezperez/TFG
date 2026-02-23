import { User, Star, Calendar, Settings, CreditCard, Bell, Shield, LogOut } from 'lucide-react';
import { Card, Avatar, Button } from '../../../../ui';
import { AvatarUploader } from '../AvatarUploader';

interface ProfileSidebarProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    memberSince: string;
    rating: number;
    totalBookings: number;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  logout: () => void;
  updateAvatar: (url: string) => void;
}

export function ProfileSidebar({ user, activeTab, setActiveTab, logout, updateAvatar }: ProfileSidebarProps) {
  const menuItems = [
    { id: 'bookings', label: 'Mis reservas', icon: Calendar },
    { id: 'favorites', label: 'Favoritos', icon: Star },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ];

  return (
    <Card className="p-4 lg:p-6 mb-6 lg:mb-0">
      {/* Avatar and basic info */}
      <div className="flex flex-col lg:text-center items-center lg:mb-6 mb-4">
        <div className="flex items-center gap-4 lg:flex-col lg:gap-0">
          <div className="relative inline-block lg:mb-4">
            <Avatar className="h-16 w-16 lg:h-24 lg:w-24 border-2 border-background shadow-sm">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 lg:h-12 lg:w-12 text-primary" />
                </div>
              )}
            </Avatar>
            <AvatarUploader
              userId={user.id}
              onUploadComplete={updateAvatar}
            />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold mb-0.5 lg:mb-1">{user.name}</h2>
            <p className="text-xs lg:text-sm text-muted-foreground">Miembro desde {user.memberSince}</p>
          </div>
        </div>
      </div>

      {/* Stats - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="text-2xl font-bold">{user.rating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Valoración</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.totalBookings}</p>
          <p className="text-sm text-muted-foreground">Reservas activas</p>
        </div>
      </div>

      {/* Menu - Horizontal scroll on mobile, vertical stack on desktop */}
      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-1 pb-2 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${activeTab === item.id
                ? 'bg-primary text-white font-medium shadow-sm'
                : 'bg-muted/50 lg:bg-transparent hover:bg-muted text-foreground'
                }`}
            >
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden lg:block mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </Card >
  );
}
