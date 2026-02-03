import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Card, Input, Label, Textarea, Badge, Switch } from '../../../ui';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Euro,
  Calendar,
  Clock,
  Star,
  Edit,
  Trash2,
  Eye,
  Camera,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { AddressSearch } from '../../../ui/address-search';
import { GeocodingResult } from '../../../shared/services/geocoding.service';
import { useNavigate } from 'react-router-dom';
import { GarageImageUploader } from './GarageImageUploader';
import { useAuth } from '../../auth';

export function OwnerProfile() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
    price: string;
    type: string;
    description: string;
    images: string[];
  }>({
    name: '',
    address: '',
    lat: 0,
    lng: 0,
    price: '',
    type: 'Cubierta',
    description: '',
    images: [] // Inicializar array de imagenes
  });

  const handleAddressSelect = (result: GeocodingResult) => {
    setFormData(prev => ({
      ...prev,
      address: result.formatted,
      lat: result.lat,
      lng: result.lng
    }));
  };

  const stats = {
    totalEarnings: 1248.50,
    monthlyEarnings: 324.80,
    totalBookings: 47,
    averageRating: 4.8,
    activeSpots: 2,
  };

  const parkingSpots = [
    {
      id: 1,
      name: 'Plaza Centro',
      location: 'Calle Castillo, 45, Santa Cruz',
      price: 2.5,
      status: 'active',
      bookings: 28,
      rating: 4.8,
      earnings: 724.50,
      image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
    },
    {
      id: 2,
      name: 'Garaje Privado Marina',
      location: 'Av. Marítima, 12, Santa Cruz',
      price: 3.0,
      status: 'active',
      bookings: 19,
      rating: 4.9,
      earnings: 524.00,
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      spotName: 'Plaza Centro',
      guestName: 'Carlos Ruiz',
      date: '2026-01-10',
      time: '14:00 - 18:00',
      earnings: 11.50,
      status: 'confirmed',
    },
    {
      id: 2,
      spotName: 'Garaje Privado Marina',
      guestName: 'Laura Martín',
      date: '2026-01-12',
      time: '09:00 - 20:00',
      earnings: 33.00,
      status: 'confirmed',
    },
    {
      id: 3,
      spotName: 'Plaza Centro',
      guestName: 'Pedro Sánchez',
      date: '2026-01-15',
      time: '10:00 - 16:00',
      earnings: 15.00,
      status: 'pending',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Panel de propietario</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tus plazas de aparcamiento
              </p>
            </div>
            <Button
              onClick={() => setShowAddSpot(true)}
              className="gap-2 bg-accent hover:bg-accent/90 text-white"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Añadir plaza</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Ingresos totales</span>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">
              {stats.totalEarnings.toFixed(2)}€
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Este mes</span>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary">
              {stats.monthlyEarnings.toFixed(2)}€
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Reservas</span>
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{stats.totalBookings}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Valoración</span>
              <Star className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{stats.averageRating}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Plazas activas</span>
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.activeSpots}</p>
          </Card>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parking spots list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mis plazas de aparcamiento</h2>
            </div>

            {showAddSpot && (
              <Card className="p-6 mb-6 border-2 border-primary">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Añadir nueva plaza</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddSpot(false)}
                  >
                    <AlertCircle className="h-5 w-5" />
                  </Button>
                </div>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="spotName">Nombre de la plaza</Label>
                    <Input
                      id="spotName"
                      placeholder="Ej: Plaza garaje centro ciudad"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección completa</Label>
                    <AddressSearch
                      onAddressSelect={handleAddressSelect}
                      initialAddress={formData.address}
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Latitud</Label>
                        <Input
                          value={formData.lat || ''}
                          readOnly
                          className="bg-muted text-xs h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Longitud</Label>
                        <Input
                          value={formData.lng || ''}
                          readOnly
                          className="bg-muted text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio por hora (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.5"
                        placeholder="2.50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de plaza</Label>
                      <select
                        id="type"
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option>Cubierta</option>
                        <option>Subterránea</option>
                        <option>Al aire libre</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe tu plaza, ubicación exacta, facilidades de acceso..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fotos de la plaza</Label>
                    <GarageImageUploader
                      userId={authUser?.user?.id || 'temp'}
                      currentImages={formData.images || []}
                      onImagesChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddSpot(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                    >
                      Publicar plaza
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="space-y-4">
              {parkingSpots.map((spot) => (
                <Card key={spot.id} className="p-6">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={spot.image}
                        alt={spot.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <Badge
                        className={`absolute top-2 left-2 ${spot.status === 'active'
                          ? 'bg-secondary text-white'
                          : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        {spot.status === 'active' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {spot.location}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Precio</p>
                          <p className="font-semibold text-primary">
                            {spot.price}€/h
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reservas</p>
                          <p className="font-semibold">{spot.bookings}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valoración</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-semibold">{spot.rating}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ganado</p>
                          <p className="font-semibold text-secondary">
                            {spot.earnings.toFixed(2)}€
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-sm font-medium mb-2">Disponibilidad:</p>
                        <div className="flex gap-2">
                          {Object.entries(spot.availability).map(([day, available]) => (
                            <div
                              key={day}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${available
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-muted text-muted-foreground'
                                }`}
                            >
                              {day.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Upcoming bookings */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Próximas reservas</h3>

              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{booking.spotName}</p>
                        <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                      </div>
                      {booking.status === 'confirmed' ? (
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(booking.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-secondary" />
                        <span className="font-semibold text-secondary">
                          {booking.earnings.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                Ver todas las reservas
              </Button>
            </Card>

            <Card className="p-6 mt-4">
              <h3 className="font-semibold mb-4">Consejos para propietarios</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Sube fotos de calidad de tu plaza</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Responde rápido a las consultas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Mantén tu calendario actualizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Ofrece precios competitivos</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
