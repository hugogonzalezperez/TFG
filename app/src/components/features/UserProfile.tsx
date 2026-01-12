import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, Input, Label, Avatar, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Switch } from '../ui';
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Clock,
  Star,
  Settings,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Camera,
  Mail,
  Phone,
  Edit,
  Check,
  X,
} from 'lucide-react';

interface UserProfileProps {
  onNavigate: (page: string) => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar el tema guardado al montar el componente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const user = {
    name: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '+34 600 123 456',
    avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXJ8ZW58MXx8fHwxNzY3NjIwMjg1fDA&ixlib=rb-4.1.0&q=80&w=200',
    memberSince: 'Enero 2024',
    totalBookings: 12,
    rating: 4.9,
  };

  const activeBookings = [
    {
      id: 1,
      parkingName: 'Plaza Centro',
      location: 'Calle Castillo, 45, Santa Cruz',
      date: '2026-01-10',
      startTime: '14:00',
      endTime: '18:00',
      price: 11.50,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 2,
      parkingName: 'Garaje Privado Marina',
      location: 'Av. Marítima, 12, Santa Cruz',
      date: '2026-01-15',
      startTime: '09:00',
      endTime: '20:00',
      price: 33.00,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
    },
  ];

  const pastBookings = [
    {
      id: 3,
      parkingName: 'Plaza Residencial',
      location: 'C/ San Francisco, 78, La Laguna',
      date: '2025-12-20',
      startTime: '10:00',
      endTime: '14:00',
      price: 8.00,
      status: 'completed',
      rated: true,
      rating: 5,
    },
    {
      id: 4,
      parkingName: 'Parking Zona Norte',
      location: 'Plaza del Adelantado, La Laguna',
      date: '2025-12-15',
      startTime: '16:00',
      endTime: '22:00',
      price: 10.80,
      status: 'completed',
      rated: false,
    },
  ];

  const favoriteSpots = [
    {
      id: 1,
      name: 'Plaza Centro',
      location: 'Santa Cruz',
      price: 2.5,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Garaje Privado Marina',
      location: 'Santa Cruz',
      price: 3.0,
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Mi Perfil</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              {/* Avatar and basic info */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24">
                    <img src={user.avatar} alt={user.name} />
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <p className="text-sm text-muted-foreground">Miembro desde {user.memberSince}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="text-2xl font-bold">{user.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Valoración</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.totalBookings}</p>
                  <p className="text-sm text-muted-foreground">Reservas</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bookings'
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted text-foreground'
                    }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Mis reservas</span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'favorites'
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted text-foreground'
                    }`}
                >
                  <Star className="h-5 w-5" />
                  <span>Favoritos</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings'
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted text-foreground'
                    }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configuración</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground">
                  <CreditCard className="h-5 w-5" />
                  <span>Pagos</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground">
                  <Bell className="h-5 w-5" />
                  <span>Notificaciones</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground">
                  <Shield className="h-5 w-5" />
                  <span>Seguridad</span>
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full gap-2 text-destructive hover:bg-destructive/10"
                  onClick={() => onNavigate('login')}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Reservas activas</h2>
                  {activeBookings.length > 0 ? (
                    <div className="space-y-4">
                      {activeBookings.map((booking) => (
                        <Card key={booking.id} className="p-6">
                          <div className="flex gap-4">
                            <img
                              src={booking.image}
                              alt={booking.parkingName}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg mb-1">
                                    {booking.parkingName}
                                  </h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {booking.location}
                                  </p>
                                </div>
                                <Badge className="bg-secondary text-white">
                                  {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(booking.date).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {booking.startTime} - {booking.endTime}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-2xl font-bold text-primary">
                                    {booking.price.toFixed(2)}€
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    Ver detalles
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-destructive">
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No tienes reservas activas</p>
                      <Button
                        onClick={() => onNavigate('home')}
                        className="mt-4 bg-primary hover:bg-primary/90"
                      >
                        Buscar aparcamiento
                      </Button>
                    </Card>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Historial de reservas</h2>
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold mb-1">{booking.parkingName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.location}</p>
                          </div>
                          <Badge variant="outline">Completada</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{new Date(booking.date).toLocaleDateString('es-ES')}</span>
                          <span>•</span>
                          <span>
                            {booking.startTime} - {booking.endTime}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-foreground">
                            {booking.price.toFixed(2)}€
                          </span>
                        </div>
                        {!booking.rated && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Star className="h-4 w-4" />
                            Valorar reserva
                          </Button>
                        )}
                        {booking.rated && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Tu valoración:</span>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < booking.rating!
                                  ? 'fill-accent text-accent'
                                  : 'text-muted-foreground'
                                  }`}
                              />
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Mis favoritos</h2>
                {favoriteSpots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteSpots.map((spot) => (
                      <Card key={spot.id} className="p-4 hover:shadow-lg transition-shadow">
                        <h3 className="font-semibold mb-2">{spot.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{spot.location}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-semibold">{spot.rating}</span>
                          </div>
                          <span className="text-lg font-bold text-primary">{spot.price}€/h</span>
                        </div>
                        <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                          Reservar ahora
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aún no tienes favoritos</p>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Configuración de perfil</h2>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="gap-2 bg-secondary hover:bg-secondary/90"
                      >
                        <Check className="h-4 w-4" />
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>

                <Card className="p-6">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        defaultValue={user.name}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue={user.phone}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>

                    <div className="pt-6 border-t border-border">
                      <h3 className="font-semibold mb-4">Preferencias</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificaciones por email</p>
                            <p className="text-sm text-muted-foreground">
                              Recibe actualizaciones de tus reservas
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificaciones push</p>
                            <p className="text-sm text-muted-foreground">
                              Alertas en tiempo real
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Modo oscuro</p>
                            <p className="text-sm text-muted-foreground">
                              Cambiar a tema oscuro o claro
                            </p>
                          </div>
                          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                        </div>
                      </div>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
