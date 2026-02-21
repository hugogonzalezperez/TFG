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
    <Card className="p-6">
      {/* Avatar and basic info */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <Avatar className="h-24 w-24">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            )}
          </Avatar>
          <AvatarUploader
            userId={user.id}
            onUploadComplete={updateAvatar}
          />
        </div>
        <h2 className="text-xl font-bold mb-1">{user.name}</h2>
        <p className="text-sm text-muted-foreground">Miembro desde {user.memberSince}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
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

      {/* Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                ? 'bg-primary text-white'
                : 'hover:bg-muted text-foreground'
                }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </Card>
  );
}
