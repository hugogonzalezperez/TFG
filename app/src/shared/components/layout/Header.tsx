import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Menu, User, LogOut, X } from 'lucide-react';
import { useAuth } from '../../../features/auth';
import { Button } from '../../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog';

export function Header() {
  const navigate = useNavigate();
  const { logout, authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Encuentra aparcamiento', href: '/map' },
    { name: 'Alquila tu plaza', href: '/owner-profile' },
    { name: '¿Cómo funciona?', href: '#' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const UserAvatar = ({ size = "h-8 w-8" }: { size?: string }) => (
    authUser?.user?.avatar_url ? (
      <img
        src={authUser.user.avatar_url}
        alt={authUser.user.name}
        className={`${size} rounded-full object-cover border-2 border-primary`}
      />
    ) : (
      <div className={`${size} rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary`}>
        <User className={size === "h-8 w-8" ? "h-4 w-4 text-primary" : "h-5 w-5 text-primary"} />
      </div>
    )
  );

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-primary p-2 rounded-xl">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-2 text-2xl font-bold text-foreground">Parky</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2"
            >
              <UserAvatar />
              <span>{authUser?.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
            </Button>
            <Button
              variant="exit"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xs h-full flex flex-col p-6 right-0 left-auto translate-x-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="text-left">Menú</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col py-6 space-y-4">
                  {/* User info in mobile */}
                  <div className="flex items-center gap-3 px-2 py-3 bg-muted/50 rounded-xl mb-4">
                    <UserAvatar size="h-12 w-12" />
                    <div>
                      <p className="font-semibold">{authUser?.user?.name || 'Usuario'}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{authUser?.user?.email}</p>
                    </div>
                  </div>

                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.href)}
                      className="flex items-center w-full px-4 py-3 text-lg font-medium hover:bg-muted rounded-xl transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="flex items-center w-full px-4 py-3 text-lg font-medium hover:bg-muted rounded-xl transition-colors"
                  >
                    Mi Perfil
                  </button>
                </div>

                <div className="pt-6 border-t border-border">
                  <Button
                    variant="exit"
                    onClick={logout}
                    className="w-full h-12 text-lg justify-start"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Cerrar sesión
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
