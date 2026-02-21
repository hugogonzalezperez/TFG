import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../ui/button';
import { ArrowLeft } from 'lucide-react';

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
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                step > 1 ? setStep(step - 1) : navigate(`/parking/${parking.id}`, { state: parking })
              }
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">Confirma y paga</h1>
            </div>
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
