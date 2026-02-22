import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../ui/button';
import { ArrowLeft, Car } from 'lucide-react';

import { useBookingFlow } from '../hooks/useBookingFlow';
import { BookingStepper } from './BookingStepper';
import { BookingDetailsForm } from './BookingDetailsForm';
import { PaymentDetails } from './PaymentDetails';
import { BookingSummary } from './BookingSummary';
import { BookingSuccess } from './BookingSuccess';
import { AnimatedLoader } from '../../../shared/components/loaders';

export function BookingProcess() {
  const navigate = useNavigate();
  const location = useLocation();

  const parking = location.state || {
    id: '',
    name: 'Plaza Centro',
    address: 'Calle Castillo, 45',
    city: 'Santa Cruz',
    base_price_per_hour: 2.5,
  };

  const {
    step,
    setStep,
    paymentMethod,
    setPaymentMethod,
    bookingComplete,
    loading,
    rulesLoading,
    error,
    setError,
    estimation,
    formData,
    setFormData,
    bookingDates,
    confirmBooking,
  } = useBookingFlow({
    parkingId: parking.id,
    basePrice: parking.base_price_per_hour,
    initialStartDate: parking.initialStartDate,
    initialEndDate: parking.initialEndDate,
  });

  if (rulesLoading) return <AnimatedLoader message="Calculando precios dinámicos..." />;

  if (bookingComplete) {
    return (
      <BookingSuccess
        parking={parking}
        bookingDates={bookingDates}
        totalPrice={estimation?.total_price || 0}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                step > 1 ? setStep(step - 1) : navigate(`/parking/${parking.id}`, { state: parking })
              }
              className="rounded-full z-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Logo Centrado */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="flex items-center gap-2 cursor-pointer pointer-events-auto group"
                onClick={() => navigate('/')}
              >
                <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">Parky</span>
              </div>
            </div>

            <div className="z-10 hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight">Confirma y paga</h1>
            </div>
            <div className="sm:hidden w-10"></div> {/* Spacer for symmetry on mobile */}
          </div>
        </div>
      </div>

      <BookingStepper currentStep={step} />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Step */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <BookingDetailsForm
                formData={formData}
                setFormData={setFormData}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <PaymentDetails
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                error={error}
                setError={setError}
                loading={loading}
                totalPrice={estimation?.total_price || 0}
                onConfirm={confirmBooking}
              />
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              parking={parking}
              estimation={estimation}
              bookingDates={bookingDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
