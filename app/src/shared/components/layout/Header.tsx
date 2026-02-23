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
              className="flex items-center space-x-2 h-10 px-6 text-base font-bold"
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
              <DialogContent className="w-full max-w-none h-auto flex flex-col p-6 top-0 left-0 translate-x-0 translate-y-0 border-t-0 rounded-b-[2.5rem] shadow-2xl data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top duration-300">
                <DialogHeader className="flex flex-row items-center justify-between mb-2">
                  <DialogTitle className="text-left">Menú Principal</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col py-2 space-y-2">
                  {/* User info in mobile */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-2xl mb-2">
                    <UserAvatar size="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight">{authUser?.user?.name || 'Usuario'}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{authUser?.user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigate(item.href)}
                        className="flex items-center w-full px-4 py-2.5 text-base font-semibold hover:bg-muted rounded-xl transition-colors"
                      >
                        {item.name}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNavigate('/profile')}
                      className="flex items-center w-full px-4 py-2.5 text-base font-semibold hover:bg-muted rounded-xl transition-colors"
                    >
                      Mi Perfil
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="exit"
                    onClick={async () => {
                      await logout();
                      localStorage.clear(); // Limpiar todo por si acaso
                      sessionStorage.clear();
                      window.location.href = '/login';
                    }}
                    className="w-full h-11 text-base justify-center text-destructive bg-destructive/5 hover:bg-destructive hover:text-white rounded-xl transition-all font-bold"
                  >
                    <LogOut className="h-5 w-5" />
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
