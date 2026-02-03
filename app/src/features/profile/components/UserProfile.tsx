import { useState, useEffect } from 'react';
import { Button } from '../../../ui/button';
import { Card, Input, Label, Avatar, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Switch } from '../../../ui';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { bookingService } from '../../booking';
import { AnimatedLoader } from '../../../shared/components/loaders';
import { ErrorMessage } from '../../../ui';
import { AvatarUploader } from './AvatarUploader';

export function UserProfile() {
  const navigate = useNavigate();
  const { authUser, updateProfile, logout, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar_url: '',
  });

  // Cargar datos del usuario y sus reservas
  useEffect(() => {
    if (authUser?.user) {
      setFormData({
        name: authUser.user.name || '',
        phone: authUser.user.phone || '',
        avatar_url: authUser.user.avatar_url || '',
      });

      const fetchBookings = async () => {
        try {
          setBookingsLoading(true);
          const data = await bookingService.getUserBookings(authUser.user.id);
          setBookings(data);
        } catch (err) {
          console.error('Error fetching bookings:', err);
        } finally {
          setBookingsLoading(false);
        }
      };
      fetchBookings();
    }
  }, [authUser]);

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

  const handleSaveProfile = async () => {
    setError(null);
    setIsSaving(true);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
        avatar_url: formData.avatar_url || undefined,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aquí deberías subir la imagen a un servicio (Supabase Storage, Cloudinary, etc.)
      // Por ahora, solo mostramos un mensaje
      alert('Función de subida de avatar en desarrollo. Por ahora, puedes pegar una URL de imagen en el campo de configuración.');
    }
  };

  // Mostrar loader mientras carga
  if (authLoading || !authUser) {
    return <AnimatedLoader message="Cargando perfil..." />;
  }

  const user = {
    name: authUser.user.name || 'Usuario',
    email: authUser.user.email || '',
    phone: authUser.user.phone || 'No especificado',
    avatar: authUser.user.avatar_url || '',
    memberSince: authUser.user.created_at
      ? new Date(authUser.user.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
      })
      : 'Recientemente',
    totalBookings: bookings.length,
    rating: 5.0,
  };

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

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
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
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
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </Avatar>

                  {authUser?.user?.id && (
                    <AvatarUploader
                      userId={authUser.user.id}
                      currentAvatarUrl={user.avatar}
                      onUploadComplete={(url) => {
                        setFormData(prev => ({ ...prev, avatar_url: url }));
                        // Opcional: Guardar automáticamente al subir
                        // Pero como hay un botón Guardar general, solo actualizamos el form state.
                        // Y para mejor UX, actualizamos visualmente el avatar local:
                        // Sin embargo, user.avatar viene de authUser.user.avatar_url, no de formData (todavía).
                        // Necesitamos que el cambio se refleje inmediatamente.
                        // Podemos hacer un guardado parcial o simplemente actualizar el estado visual si UserProfile usara formData para mostrar el avatar.
                        // Actualmente usa `user.avatar` que viene de `authUser`.
                        // Haremos un pequeño hack: actualizar el formData Y llamar a updateProfile silenciosamente?
                        // Mejor: Dejamos que el usuario le de a Guardar, pero actualizamos la vista previa.
                        // UserProfile usa `user` que viene de `authUser`.
                        // Deberíamos cambiar la vista para usar `formData.avatar_url` como fuente prioritaria si estamos editando?
                        // O simplemente, al subir, llamamos a updateProfile directamente?
                        // Lo más común en avatares es updated inmediato.
                        updateProfile({ avatar_url: url }).catch(console.error);
                      }}
                    />
                  )}

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
                  onClick={logout}
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
                                  <span>{new Date(booking.start_time).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {new Date(booking.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-2xl font-bold text-primary">
                                    {Number(booking.total_price).toFixed(2)}€
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
                        onClick={() => navigate('/')}
                        className="mt-4 bg-primary hover:bg-primary/90"
                      >
                        Buscar aparcamiento
                      </Button>
                    </Card>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Historial de reservas</h2>
                  {pastBookings.map((booking) => (
                    <Card key={booking.id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold mb-1">{booking.parkingName}</h3>
                          <p className="text-sm text-muted-foreground">{booking.location}</p>
                        </div>
                        <Badge variant="outline">
                          {booking.status === 'completed' ? 'Completada' : 'Cancelada'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>{new Date(booking.start_time).toLocaleDateString('es-ES')}</span>
                        <span>•</span>
                        <span>
                          {new Date(booking.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-foreground">
                          {Number(booking.total_price).toFixed(2)}€
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
                        onClick={() => {
                          setIsEditing(false);
                          setError(null);
                          // Restaurar datos originales
                          if (authUser?.user) {
                            setFormData({
                              name: authUser.user.name || '',
                              phone: authUser.user.phone || '',
                              avatar_url: authUser.user.avatar_url || '',
                            });
                          }
                        }}
                        className="gap-2"
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        className="gap-2 bg-secondary hover:bg-secondary/90"
                        disabled={isSaving}
                      >
                        <Check className="h-4 w-4" />
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Mensaje de error */}
                <ErrorMessage message={error || ''} onClose={() => setError(null)} />

                <Card className="p-6">
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                        required
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
                        value={user.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        El email no se puede cambiar
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                        placeholder="+34 600 000 000"
                      />
                    </div>

                    {isEditing && (
                      <div className="space-y-2">
                        <Label htmlFor="avatar_url" className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          URL del Avatar
                        </Label>
                        <Input
                          id="avatar_url"
                          type="url"
                          value={formData.avatar_url}
                          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                          placeholder="https://ejemplo.com/mi-foto.jpg"
                        />
                        <p className="text-xs text-muted-foreground">
                          Pega la URL de tu foto de perfil
                        </p>
                      </div>
                    )}

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
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificaciones push</p>
                            <p className="text-sm text-muted-foreground">
                              Alertas en tiempo real
                            </p>
                          </div>
                          <input type="checkbox" defaultChecked className="toggle" />
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