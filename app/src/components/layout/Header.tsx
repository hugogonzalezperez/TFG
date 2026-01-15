import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { Menu, User, LogOut } from 'lucide-react';
import { ParkyLogo } from '../shared/ParkyLogo';

interface AppHeaderProps {
  authUser: any;
  onLogout: () => void;
}

export function AppHeader({ authUser, onLogout }: AppHeaderProps) {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationLinks = [
    { label: 'Encuentra aparcamiento', onClick: () => navigate('/map') },
    { label: 'Alquila tu plaza', onClick: () => navigate('/owner-profile') },
    { label: '¿Cómo funciona?', onClick: () => { } },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <ParkyLogo size="md" onClick={() => navigate('/')} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.onClick}
                className="text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2"
            >
              {authUser?.user?.avatar_url ? (
                <img
                  src={authUser.user.avatar_url}
                  alt={authUser.user.name || ''}
                  className="h-8 w-8 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
              <span>{authUser?.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {/* User info in mobile */}
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg mb-2">
              {authUser?.user?.avatar_url ? (
                <img
                  src={authUser.user.avatar_url}
                  alt={authUser.user.name || ''}
                  className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                  <User className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <p className="font-semibold">{authUser?.user?.name || 'Usuario'}</p>
                <p className="text-xs text-muted-foreground">
                  {authUser?.user?.email || ''}
                </p>
              </div>
            </div>

            {navigationLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.onClick}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/profile')}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg"
            >
              Mi cuenta
            </button>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg text-destructive"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}