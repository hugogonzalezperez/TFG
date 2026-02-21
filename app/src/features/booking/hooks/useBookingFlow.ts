import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth';
import { bookingService, pricingService, BookingEstimation } from '..';

interface UseBookingFlowProps {
  parkingId: string;
  basePrice: number;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

export function useBookingFlow({ parkingId, basePrice, initialStartDate, initialEndDate }: UseBookingFlowProps) {
  const { authUser } = useAuth();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estimation, setEstimation] = useState<BookingEstimation | null>(null);

  const [formData, setFormData] = useState({
    firstName: authUser?.user.name?.split(' ')[0] || '',
    lastName: authUser?.user.name?.split(' ').slice(1).join(' ') || '',
    email: authUser?.user.email || '',
    phone: authUser?.user.phone || '',
    licensePlate: '',
    carModel: '',
  });

  const bookingDates = useMemo(() => {
    if (initialStartDate && initialEndDate) {
      return {
        start: initialStartDate,
        end: initialEndDate
      };
    }

    const start = new Date();
    // Round to next 30 mins for better UX
    start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30);
    start.setSeconds(0);
    start.setMilliseconds(0);

    return {
      start,
      end: new Date(start.getTime() + 4 * 60 * 60 * 1000) // +4h default
    };
  }, [initialStartDate, initialEndDate]); // Only re-calc if props change

  useEffect(() => {
    const fetchRules = async () => {
      if (!parkingId) return;
      try {
        setRulesLoading(true);
        const rules = await bookingService.getPricingRules(parkingId);

        const est = pricingService.calculateEstimation(
          basePrice,
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
  }, [parkingId, basePrice, bookingDates]);

  const confirmBooking = async () => {
    if (!authUser?.user.id) {
      setError('Debes iniciar sesión para reservar');
      return;
    }

    setLoading(true);
    setError(null);

    const durationHours = (bookingDates.end.getTime() - bookingDates.start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 1.9) {
      setError('La reserva mínima debe ser de 2 horas.');
      setLoading(false);
      return;
    }

    try {
      const isAvailable = await bookingService.checkAvailability(
        parkingId,
        bookingDates.start,
        bookingDates.end
      );

      if (!isAvailable) {
        throw new Error('Esta plaza ya no está disponible para las horas seleccionadas.');
      }

      await bookingService.createBooking({
        spotId: parkingId,
        userId: authUser.user.id,
        startTime: bookingDates.start,
        endTime: bookingDates.end,
        basePrice: basePrice,
      });

      setBookingComplete(true);
    } catch (err: any) {
      setError(err.message || 'Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
