/**
 * =====================================================
 * FEEDBACK HÁPTICO
 * =====================================================
 *
 * Proporciona vibración táctil para mejorar la experiencia
 * de usuario en dispositivos móviles. En web, las funciones
 * simplemente no hacen nada (no-op), así que se pueden llamar
 * sin verificar la plataforma.
 *
 * Tipos de impacto (de más suave a más fuerte):
 * - Light: Pulsaciones sutiles (toggle, selección)
 * - Medium: Confirmaciones (guardar, enviar)
 * - Heavy: Acciones destructivas o importantes (eliminar, error)
 *
 * También soporta notificaciones hápticas:
 * - Success: Operación completada ✓
 * - Warning: Algo requiere atención ⚠
 * - Error: Algo salió mal ✕
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { isNative } from './platform';

/**
 * Ejecuta una vibración de impacto. Se usa en interacciones
 * como pulsar botones, cambiar toggles o seleccionar items.
 *
 * @param style - Intensidad: 'Heavy' | 'Medium' | 'Light'
 *
 * Ejemplo de uso:
 *   <Button onClick={() => { impact('Light'); handleToggle(); }}>
 */
export const impact = async (
  style: 'Heavy' | 'Medium' | 'Light' = 'Medium'
): Promise<void> => {
  if (!isNative()) return; // No-op en web
  await Haptics.impact({ style: ImpactStyle[style] });
};

/**
 * Ejecuta una notificación háptica (patrón de vibración predefinido).
 * Se usa para comunicar resultados de operaciones al usuario.
 *
 * @param type - Tipo: 'Success' | 'Warning' | 'Error'
 *
 * Ejemplo de uso:
 *   try {
 *     await saveBooking();
 *     notify('Success');
 *   } catch {
 *     notify('Error');
 *   }
 */
export const notify = async (
  type: 'Success' | 'Warning' | 'Error' = 'Success'
): Promise<void> => {
  if (!isNative()) return;
  await Haptics.notification({ type: NotificationType[type] });
};

/**
 * Vibración de selección — la más sutil de todas.
 * Se usa cuando el usuario navega por una lista o un picker.
 * En iOS genera el "tick" clásico del UISelectionFeedbackGenerator.
 */
export const selectionFeedback = async (): Promise<void> => {
  if (!isNative()) return;
  await Haptics.selectionStart();
  await Haptics.selectionEnd();
};
