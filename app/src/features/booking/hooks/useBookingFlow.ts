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

      // Normalizar matrícula: eliminar espacios extra y añadir el espacio correcto
      const rawPlate = formData.licensePlate.replace(/\s+/g, '').toUpperCase();
      let normalizedPlate = rawPlate;
      if (/^[0-9]{4}[A-Z]{3}$/.test(rawPlate)) {
        // Formato moderno: 1234ABC → 1234 ABC
        normalizedPlate = rawPlate.slice(0, 4) + ' ' + rawPlate.slice(4);
      } else if (/^[A-Z]{1,2}[0-9]{4}[A-Z]{1,2}$/.test(rawPlate)) {
        // Formato provincial: TF1234AB → TF 1234 AB
        const match = rawPlate.match(/^([A-Z]{1,2})([0-9]{4})([A-Z]{1,2})$/);
        if (match) normalizedPlate = `${match[1]} ${match[2]} ${match[3]}`;
      }

      await bookingService.createBooking({
        spotId: parkingId,
        userId: authUser.user.id,
        startTime: bookingDates.start,
        endTime: bookingDates.end,
        basePrice: basePrice,
        vehiclePlate: normalizedPlate,
        vehicleDescription: formData.carModel,
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
