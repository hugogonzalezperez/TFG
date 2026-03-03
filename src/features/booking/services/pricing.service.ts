import { PricingRule, BookingEstimation } from '../types/booking.types';

/**
 * Motor de Precios Dinámicos
 * Calcula el precio final de una reserva aplicando las reglas correspondientes.
 */
export const pricingService = {
  /**
   * Calcula el presupuesto de una reserva
   */
  calculateEstimation(
    basePricePerHour: number,
    startTime: Date,
    endTime: Date,
    rules: PricingRule[]
  ): BookingEstimation {
    const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));

    // 1. Filtrar reglas activas que apliquen al momento de la reserva
    const dayOfWeek = startTime.getDay();
    const startTimeStr = startTime.toLocaleTimeString('en-GB', { hour12: false });

    // En un sistema real, aplicaríamos lógica más compleja (prioridades, solapamientos)
    // Para el TFG, buscamos la regla con el multiplicador más alto que aplique
    const applicableRules = rules.filter(rule => {
      if (!rule.is_active) return false;

      // Regla por día de la semana
      if (rule.day_of_week !== undefined && rule.day_of_week !== dayOfWeek) return false;

      // Regla por tramo horario (opcional en la regla)
      if (rule.start_time && rule.end_time) {
        if (startTimeStr < rule.start_time || startTimeStr > rule.end_time) return false;
      }

      return true;
    });

    const maxMultiplier = applicableRules.length > 0
      ? Math.max(...applicableRules.map(r => r.multiplier))
      : 1.0;

    const totalPrice = basePricePerHour * hours * maxMultiplier;

    return {
      base_price: basePricePerHour,
      total_price: Number(totalPrice.toFixed(2)),
      multiplier_applied: maxMultiplier,
      hours,
      rules_applied: applicableRules.map(r => r.rule_name)
    };
  }
};
