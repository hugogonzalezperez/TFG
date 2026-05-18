import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../features/auth';
import { isNative } from '@/mobile';
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
  const { pathname } = useLocation();
  const { logout, authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const isHome = pathname === '/';
  const transparent = isHome && isAtTop && !isNative();

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY < 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        className={`${size} rounded-full object-cover ${transparent ? 'border-2 border-white/60' : 'border-2 border-primary'}`}
      />
    ) : (
      <div className={`${size} rounded-full flex items-center justify-center ${transparent ? 'bg-white/20 border-2 border-white/40' : 'bg-primary/10 border-2 border-primary'}`}>
        <User className={`${size === "h-8 w-8" ? "h-4 w-4" : "h-5 w-5"} ${transparent ? 'text-white' : 'text-primary'}`} />
      </div>
    )
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNative() ? 'pt-[env(safe-area-inset-top)]' : ''} ${
        transparent
          ? 'bg-transparent border-transparent shadow-none'
          : 'bg-card/95 backdrop-blur-md border-b border-border shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className={`p-2 rounded-xl transition-colors ${transparent ? 'bg-white/20' : 'bg-primary'}`}>
              <Car className="h-6 w-6 text-white" />
            </div>
            <h1 className={`ml-2 text-2xl font-bold transition-colors ${transparent ? 'text-white' : 'text-foreground'}`}>
              Parky
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                className={`transition-colors font-medium ${transparent ? 'text-white/90 hover:text-white' : 'text-foreground hover:text-primary'}`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {authUser ? (
              transparent ? (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: 'white' }}
                  >
                    <UserAvatar />
                    <span className="font-medium">{authUser.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 h-10 px-5 rounded-lg font-bold hover:bg-white/10 transition-colors border"
                    style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2"
                  >
                    <UserAvatar />
                    <span>{authUser.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
                  </Button>
                  <Button
                    variant="exit"
                    onClick={logout}
                    className="flex items-center space-x-2 h-10 px-6 text-base font-bold"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Salir</span>
                  </Button>
                </>
              )
            ) : transparent ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="h-10 px-5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all border border-white/25 hover:border-white/50"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="h-10 px-5 rounded-lg font-bold bg-white text-[#1B4FD8] hover:bg-white/90 transition-all shadow-lg shadow-black/20"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="h-10 px-5 font-semibold"
                >
                  Iniciar sesión
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="h-10 px-5 font-bold bg-primary text-white hover:bg-primary/90"
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden min-h-[44px] min-w-[44px]" style={transparent ? { color: 'white' } : {}}>
                  <Menu className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-none h-auto flex flex-col p-6 top-0 left-0 translate-x-0 translate-y-0 border-t-0 rounded-b-[2.5rem] shadow-2xl data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top duration-300">
                <DialogHeader className="flex flex-row items-center justify-between mb-2">
                  <DialogTitle className="text-left">Menú Principal</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col py-2 space-y-2">
                  {authUser ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-2xl mb-2">
                      <UserAvatar size="h-10 w-10" />
                      <div className="min-w-0">
                        <p className="font-bold text-sm leading-tight">{authUser.user?.name || 'Usuario'}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{authUser.user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Button
                        variant="outline"
                        onClick={() => handleNavigate('/login')}
                        className="h-11 font-semibold"
                      >
                        Iniciar sesión
                      </Button>
                      <Button
                        onClick={() => handleNavigate('/signup')}
                        className="h-11 font-bold bg-primary text-white"
                      >
                        Registrarse
                      </Button>
                    </div>
                  )}

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
                    {authUser && (
                      <button
                        onClick={() => handleNavigate('/profile')}
                        className="flex items-center w-full px-4 py-2.5 text-base font-semibold hover:bg-muted rounded-xl transition-colors"
                      >
                        Mi Perfil
                      </button>
                    )}
                  </div>
                </div>

                {authUser && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="exit"
                      onClick={logout}
                      className="w-full h-11 text-base justify-center text-destructive bg-destructive/5 hover:bg-destructive hover:text-white rounded-xl transition-all font-bold"
                    >
                      <LogOut className="h-5 w-5" />
                      Cerrar sesión
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
