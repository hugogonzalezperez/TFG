import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../ui/button';
import { Card, Input, Label, Badge } from '../../../ui';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Check,
  MapPin,
  Calendar,
  Clock,
  Shield,
  AlertCircle,
  Loader2,
  Zap,
} from 'lucide-react';
import { Checkbox } from '../../../ui';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import { bookingService, pricingService, BookingEstimation, PricingRule } from '../index';
import { AnimatedLoader } from '../../../shared/components/loaders';
import { ErrorMessage } from '../../../ui';

export function BookingProcess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuth();

  const parking = location.state || {
    id: '',
    name: 'Plaza Centro',
    address: 'Calle Castillo, 45',
    city: 'Santa Cruz',
    base_price_per_hour: 2.5,
  };

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [estimation, setEstimation] = useState<BookingEstimation | null>(null);

  // Datos del formulario pre-rellenados del usuario autenticado
  const [formData, setFormData] = useState({
    firstName: authUser?.user.name?.split(' ')[0] || '',
    lastName: authUser?.user.name?.split(' ').slice(1).join(' ') || '',
    email: authUser?.user.email || '',
    phone: authUser?.user.phone || '',
    licensePlate: '',
    carModel: '',
  });

  // Fechas por defecto (pueden venir del state o ser hoy)
  const bookingDates = useMemo(() => {
    return {
      start: new Date(),
      end: new Date(new Date().getTime() + 4 * 60 * 60 * 1000) // +4h por defecto
    };
  }, []);

  // 1. Cargar reglas de precio al iniciar
  useEffect(() => {
    const fetchRules = async () => {
      try {
        if (!parking.id) return;
        setRulesLoading(true);
        const rules = await bookingService.getPricingRules(parking.id);
        setPricingRules(rules);

        // Calcular primera estimación
        const est = pricingService.calculateEstimation(
          parking.base_price_per_hour,
          bookingDates.start,
          bookingDates.end,
          rules
        );
        setEstimation(est);
      } catch (err) {
        console.error('Error fetching rules:', err);
      } finally {
        setRulesLoading(false);
      }
    };

    fetchRules();
  }, [parking.id, parking.base_price_per_hour, bookingDates]);

  const handleConfirmBooking = async () => {
    if (!authUser?.user.id) {
      setError('Debes iniciar sesión para reservar');
      return;
    }

    setLoading(true);
    setError(null);

    // Validar duración mínima (2 horas)
    const durationHours = (bookingDates.end.getTime() - bookingDates.start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 1.9) { // Un pequeño margen para evitar problemas de precisión
      setError('La reserva mínima debe ser de 2 horas.');
      setLoading(false);
      return;
    }

    try {
      // Verificar disponibilidad real
      const isAvailable = await bookingService.checkAvailability(
        parking.id,
        bookingDates.start,
        bookingDates.end
      );

      if (!isAvailable) {
        throw new Error('Lo sentimos, esta plaza ya no está disponible para las horas seleccionadas.');
      }

      // Crear la reserva real
      await bookingService.createBooking({
        spotId: parking.id,
        userId: authUser.user.id,
        startTime: bookingDates.start,
        endTime: bookingDates.end,
        basePrice: parking.base_price_per_hour,
      });

      setBookingComplete(true);
    } catch (err: any) {
      setError(err.message || 'Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (rulesLoading) return <AnimatedLoader message="Calculando precios dinámicos..." />;

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">¡Reserva confirmada!</h1>
          <p className="text-muted-foreground mb-8">
            Tu reserva ha sido procesada con éxito. Hemos enviado los detalles a tu correo.
          </p>

          <Card className="p-6 bg-muted/50 mb-6 text-left">
            <h3 className="font-semibold mb-4">Detalles de la reserva</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{parking.name}</p>
                  <p className="text-muted-foreground">{parking.location}, {parking.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">
                    {bookingDates.start.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-muted-foreground">
                    {bookingDates.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {bookingDates.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Total pagado</p>
                  <p className="text-2xl font-bold text-primary">{estimation?.total_price.toFixed(2)}€</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="text-sm text-left">
              <p className="font-medium mb-1">Código de acceso</p>
              <p className="text-muted-foreground">
                Recibirás el código de acceso 1 hora antes de tu reserva. Guarda este mensaje.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="flex-1"
            >
              Ver mis reservas
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Volver al inicio
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => step > 1 ? setStep(step - 1) : navigate(`/parking/${parking.id}`, { state: parking })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Confirma y paga</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : '1'}
              </div>
              <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>
                Información
              </span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
              >
                {step > 2 ? <Check className="h-5 w-5" /> : '2'}
              </div>
              <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>Pago</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-border'}`} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
              >
                3
              </div>
              <span className={step >= 3 ? 'font-medium' : 'text-muted-foreground'}>
                Confirmación
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Tus datos</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Juan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Pérez García"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">Matrícula del vehículo</Label>
                    <Input id="licensePlate" placeholder="1234 ABC" className="uppercase" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carModel">Marca y modelo (opcional)</Label>
                    <Input id="carModel" placeholder="Ej: Toyota Corolla" />
                  </div>

                  <div className="flex items-start space-x-2 pt-4">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      Acepto las{' '}
                      <a href="#" className="text-primary hover:underline">
                        condiciones de la reserva
                      </a>{' '}
                      y la{' '}
                      <a href="#" className="text-primary hover:underline">
                        política de cancelación
                      </a>
                    </label>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full h-12 bg-primary hover:bg-primary/90 mt-6"
                  >
                    Continuar al pago
                  </Button>
                </form>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Método de pago</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'card'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Tarjeta</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="h-6 w-6 mx-auto mb-2 bg-[#0070BA] rounded flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                    <p className="text-sm font-medium">PayPal</p>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Fecha de caducidad</Label>
                        <Input id="expiry" placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                          <Input id="cvv" placeholder="123" maxLength={3} type="password" />
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre del titular</Label>
                      <Input id="cardName" placeholder="Como aparece en la tarjeta" />
                    </div>

                    <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
                      <Shield className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Pago seguro</p>
                        <p className="text-muted-foreground">
                          Tu información está protegida con encriptación SSL de 256 bits
                        </p>
                      </div>
                    </div>

                    <ErrorMessage message={error || ''} onClose={() => setError(null)} />

                    <Button
                      type="button"
                      onClick={handleConfirmBooking}
                      disabled={loading}
                      className="w-full h-12 bg-accent hover:bg-accent/90 text-white mt-6"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Confirmar y pagar {estimation?.total_price.toFixed(2)}€
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="text-center py-8">
                    <div className="bg-[#0070BA] text-white rounded-lg p-6 mb-4">
                      <p className="font-semibold mb-2">PayPal</p>
                      <p className="text-sm opacity-90">Serás redirigido a PayPal para completar el pago</p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="w-full h-12 bg-[#0070BA] hover:bg-[#005ea6] text-white"
                    >
                      Continuar con PayPal
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Resumen de reserva</h3>

              <div className="border border-border rounded-lg p-4 mb-4">
                <div className="flex gap-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400"
                    alt={parking.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{parking.name}</h4>
                    <p className="text-sm text-muted-foreground">{parking.location}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-secondary/10 text-secondary">
                  Verificado
                </Badge>
              </div>

              <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Fecha</p>
                    <p className="text-muted-foreground">
                      {bookingDates.start.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Horario</p>
                    <p className="text-muted-foreground">
                      {bookingDates.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {bookingDates.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} ({estimation?.hours}h)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {parking.base_price_per_hour}€ x {estimation?.hours} horas
                  </span>
                  <span>{(parking.base_price_per_hour * (estimation?.hours || 1)).toFixed(2)}€</span>
                </div>
                {estimation && estimation.multiplier_applied > 1 && (
                  <div className="flex justify-between text-secondary">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Tarifa dinámica ({((estimation.multiplier_applied - 1) * 100).toFixed(0)}%)
                    </span>
                    <span>{((estimation.total_price - (parking.base_price_per_hour * estimation.hours)) - 1.5).toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa de servicio</span>
                  <span>1.50€</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {estimation?.total_price.toFixed(2)}€
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mt-0.5 text-secondary" />
                  <span>Cancelación gratis hasta 24h antes</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mt-0.5 text-secondary" />
                  <span>Confirmación instantánea</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 mt-0.5 text-secondary" />
                  <span>Pago seguro</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
