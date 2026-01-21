import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Card, Badge, Avatar } from '../../../ui';
import {
  ArrowLeft,
  Star,
  MapPin,
  Shield,
  Car,
  Clock,
  Camera,
  Wifi,
  Zap,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
} from 'lucide-react';

import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function ParkingDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const parkingData = location.state;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Datos por defecto
  const defaultParking = {
    id: 1,
    name: 'Plaza Sol',
    location: 'Calle Castillo, 45',
    city: 'Santa Cruz de Tenerife',
    price: 2.5,
    rating: 4.8,
    reviews: 124,
    distance: 0.3,
    type: 'Cubierta',
    verified: true,
    image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://imgs.search.brave.com/N5PiB-sq8nz-YyWStb0dX8MiUQWFfoDF7nRBeEkYs20/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZW5lcy4yMG1pbnV0/b3MuZXMvZmlsZXMv/aW1hZ2VfNjQwXzM2/MC91cGxvYWRzL2lt/YWdlbmVzLzIwMjUv/MDcvMDEvd2lsbHly/ZXgtZW4tc3UtY2Fu/YWwtZGUteW91dHVi/ZS5wbmc',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1761479353275-a66a51af32ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    owner: {
      name: 'María González',
      avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXJ8ZW58MXx8fHwxNzY3NjIwMjg1fDA&ixlib=rb-4.1.0&q=80&w=200',
      rating: 4.9,
      reviewCount: 87,
      responseTime: '15 min',
      memberSince: '2023',
    },
    amenities: ['Vigilancia 24/7', 'Cámara de seguridad', 'WiFi', 'Carga eléctrica'],
    description:
      'Plaza de aparcamiento cubierta en el corazón de Santa Cruz, ideal para turistas que visitan la ciudad. Acceso fácil desde la autopista y a solo 5 minutos andando de la zona comercial y el puerto. La plaza está en un garaje privado con seguridad 24/7 y cámaras de vigilancia.',
    rules: [
      'Altura máxima: 2.10m',
      'No se permiten vehículos comerciales grandes',
      'Horario de acceso: 24 horas',
      'Check-in flexible',
    ],
    availability: true,
  };

  // Merge: datos recibidos + datos por defecto
  const parking = {
    ...defaultParking,
    ...parkingData,
    owner: {
      ...defaultParking.owner,
      ...(parkingData?.owner || {}),
    },
  };

  // Maneja tanto 'image' (singular) como 'images' (array)
  const images = parking.images && Array.isArray(parking.images)
    ? parking.images
    : parking.image
      ? [parking.image]
      : [];

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const reviews = [
    {
      id: 1,
      author: 'Carlos Ruiz',
      rating: 5,
      date: 'Hace 2 semanas',
      comment: 'Excelente ubicación, muy cerca del centro. La plaza es amplia y el garaje está muy bien mantenido. Totalmente recomendable.',
    },
    {
      id: 2,
      author: 'Laura Martín',
      rating: 5,
      date: 'Hace 1 mes',
      comment: 'Perfecta para aparcar cuando visitas Santa Cruz. María fue muy amable y el proceso super fácil. Volveré sin duda.',
    },
    {
      id: 3,
      author: 'Pedro Sánchez',
      rating: 4,
      date: 'Hace 2 meses',
      comment: 'Muy buena plaza, solo un pequeño detalle con el acceso que se solucionó rápido. Por lo demás, todo perfecto.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate('/map')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-video lg:aspect-[21/9]">
            <img
              src={images[currentImageIndex]}
              alt={`${parking.name} - Imagen ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Image navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Verified badge */}
            {parking.verified && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-secondary text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and basic info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{parking.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{parking.rating}</span>
                  <span>({parking.reviews} valoraciones)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{parking.location}, {parking.city}</span>
                </div>
                <span>•</span>
                <span>{parking.distance} km de distancia</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{parking.type}</Badge>
                <Badge variant="outline" className="bg-secondary/10 text-secondary">
                  Disponible ahora
                </Badge>
              </div>
            </div>

            {/* Owner info */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <img src={parking.owner.avatar} alt={parking.owner.name} />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{parking.owner.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span>{parking.owner.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{parking.owner.reviewCount} valoraciones</span>
                      <span>•</span>
                      <span>Miembro desde {parking.owner.memberSince}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tiempo de respuesta: {parking.owner.responseTime}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Contactar
                </Button>
              </div>
            </Card>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">{parking.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Servicios incluidos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parking.amenities.map((amenity: string, index: number) => {
                  const icons = [Shield, Camera, Wifi, Zap];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rules */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Normas y condiciones</h2>
              <ul className="space-y-2">
                {parking.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="bg-secondary/10 p-1 rounded-full mt-0.5">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    </div>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  Valoraciones ({parking.reviews})
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-accent text-accent" />
                  <span className="text-2xl font-bold">{parking.rating}</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary font-semibold">
                          {review.author.charAt(0)}
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.author}</h4>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating
                                ? 'fill-accent text-accent'
                                : 'text-muted-foreground'
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                Ver todas las valoraciones
              </Button>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-xl">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">{parking.price}€</span>
                  <span className="text-muted-foreground">/hora</span>
                </div>
                <p className="text-sm text-muted-foreground">Precios especiales por día disponibles</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Fecha y hora de entrada
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Fecha y hora de salida
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button
                onClick={() => navigate(`/book/${parking.id}`, { state: parking })}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white mb-4"
              >
                Reservar ahora
              </Button>

              <p className="text-center text-sm text-muted-foreground mb-4">
                No se realizará ningún cargo todavía
              </p>

              <div className="border-t border-border pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{parking.price}€ x 4 horas</span>
                  <span className="font-semibold">{(parking.price * 4).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa de servicio</span>
                  <span className="font-semibold">1.50€</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">
                    {((parking.price * 4) + 1.5).toFixed(2)}€
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5 text-secondary" />
                  <span>Protección de reserva incluida</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
